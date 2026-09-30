"use server";

import { headers } from "next/headers";
import {
  candidateSchema,
  cleanText,
  CANDIDATE_LOOKING_FOR,
  RESUME_MAX_BYTES,
  RESUME_TYPES,
  type CandidateState,
  type CandidateValues,
} from "@/lib/validation/candidate";
import { clientAddress, rateLimited, screen } from "@/lib/spam";
import { escapeHtml, greeting, notifyTeam, signOff, thankVisitor } from "@/lib/email";
import { retentionDays, storeResume } from "@/lib/resume-store";
import { SITE } from "@/config/site";

/* The job seeker lead. Validated on the server, screened for bots,
   emailed to the recruiters with the resume attached, and a thank-you
   to the candidate. Nothing is written to disk or to a database, which
   is what "no candidate database" means in practice.

   Order matters:
     1. clean every value (control and invisible characters, spacing)
     2. screen for bots (lib/spam.ts); a bot gets the normal success
        screen and nothing is sent, so it learns nothing
     3. validate shape and length
     4. check the attachment
     5. email the team, then thank the candidate

   The recruiter email never shows field names, ids or raw values:
   every field has a human label, the "looking for" id is mapped to
   its wording, and an empty field reads "Not provided".

   A resume reaches the recruiter twice: attached to the email, and as
   a private download link in the body (lib/resume-store.ts), because
   some mail clients hide or strip attachments. */

const NOT_PROVIDED = "Not provided";

export async function submitCandidate(
  _prev: CandidateState,
  formData: FormData,
): Promise<CandidateState> {
  const raw = {
    name: cleanText(formData.get("name")),
    email: cleanText(formData.get("email")).toLowerCase(),
    phone: cleanText(formData.get("phone")),
    work: cleanText(formData.get("work")),
    location: cleanText(formData.get("location")),
    lookingFor: cleanText(formData.get("lookingFor")),
    message: cleanText(formData.get("message"), true),
    website: cleanText(formData.get("website")),
  };
  const fillMs = typeof formData.get("t") === "string" ? String(formData.get("t")) : undefined;

  /* Everything typed, echoed back so a validation error does not cost
     the person their answers. The file and the honeypot are left out. */
  const { website: _honeypot, ...values } = raw satisfies CandidateValues;

  /* ── 2 · Bots ──────────────────────────────────────────────── */
  const verdict = screen({
    honeypot: raw.website,
    fillMs,
    text: [raw.name, raw.work, raw.location, raw.message],
  });
  const requestHeaders = await headers();
  const address = clientAddress(requestHeaders);
  const limited = rateLimited(address);
  if (verdict.spam || limited) {
    const why = limited ? [...verdict.reasons, "rate limited"] : verdict.reasons;
    console.warn(
      `[candidate:spam] dropped, no email sent (${why.join("; ")}) ` +
        JSON.stringify({ name: raw.name, email: raw.email, work: raw.work, from: address }),
    );
    return { status: "success", reference: makeReference() };
  }

  /* ── 3 · Validation ────────────────────────────────────────── */
  const parsed = candidateSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return { status: "error", errors, values };
  }
  const lead = parsed.data;

  /* ── 4 · The resume ────────────────────────────────────────────
     Optional, but if one is attached it has to be something a
     recruiter can open, and small enough to email. Both limits are
     also enforced in the browser; this is the side that counts. */
  const file = formData.get("resume");
  let attachment: { filename: string; content: string } | null = null;
  let downloadUrl: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > RESUME_MAX_BYTES) {
      return {
        status: "error",
        values,
        errors: { resume: "That file is over 5MB. Send a smaller one, or email it to us instead." },
      };
    }
    const filename = safeFilename(file.name);
    const looksRight =
      RESUME_TYPES.includes(file.type) || /\.(pdf|docx?|rtf|txt)$/i.test(filename);
    if (!looksRight) {
      return {
        status: "error",
        values,
        errors: { resume: "Please attach a PDF, Word, RTF or text file." },
      };
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    attachment = { filename, content: bytes.toString("base64") };
    const token = await storeResume(bytes, filename, file.type);
    if (token) downloadUrl = `${siteOrigin(requestHeaders)}/resume/${token}`;
  }

  /* ── 5 · The recruiter email ───────────────────────────────── */
  const reference = makeReference();
  const submitted = new Date();
  const lookingFor =
    CANDIDATE_LOOKING_FOR.find((o) => o.id === lead.lookingFor)?.label ?? NOT_PROVIDED;

  const rows: Row[] = [
    ["Candidate Reference", reference],
    ["Full Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone || NOT_PROVIDED],
    ["Looking For", lookingFor],
    ["Kind of Work", lead.work],
    ["Location", lead.location],
    [
      "Resume",
      attachment ? attachment.filename : NOT_PROVIDED,
      attachment ? { href: downloadUrl, attached: true } : undefined,
    ],
    ["Additional Message", lead.message || NOT_PROVIDED],
    ["Submission Date/Time", formatWhen(submitted)],
  ];

  const subject = `New Job Seeker Submission | ${lead.name.slice(0, 60)} | ${reference}`;

  const sent = await notifyTeam("candidate", {
    replyTo: lead.email,
    subject,
    text: plainEmail(rows),
    html: htmlEmail(rows, lead.email),
    ...(attachment ? { attachments: [attachment] } : {}),
  });
  if (!sent) {
    return {
      status: "error",
      errors: {},
      values,
      message: "We couldn't send that just now. Please email us directly.",
    };
  }

  await thankVisitor("candidate", {
    to: lead.email,
    subject: `Thanks, we've got your details (${reference})`,
    text: [
      greeting(lead.name),
      ``,
      `Thanks for sending us your details${attachment ? " and resume" : ""}. A recruiter will read them and come back to you, usually within a business day.`,
      ``,
      `Your reference is ${reference}. If anything changes before then, reply to this email and quote it.`,
      signOff(),
    ].join("\n"),
  });

  return { status: "success", reference };
}

function makeReference() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VG-C-${stamp}-${rand}`;
}

/** The uploaded file's own name, minus any path and anything that is
    not safe in an email header, extension kept. */
function safeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "";
  const clean = base
    .replace(/[\u0000-\u001F\u007F"<>|:*?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return "resume";
  if (clean.length <= 120) return clean;
  const ext = clean.match(/\.[a-z0-9]{1,5}$/i)?.[0] ?? "";
  return clean.slice(0, 120 - ext.length) + ext;
}

/** Both the Dallas office's time and India time, since the recruiters
    who read these work across both. */
function formatWhen(d: Date): string {
  const fmt = (timeZone: string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(d);
  return `${fmt("America/Chicago")} (${fmt("Asia/Kolkata").replace(/GMT\+5:30/, "IST")})`;
}

/** A labelled row. The resume row also carries its download link. */
type Row = [label: string, value: string, file?: { href: string | null; attached: boolean }];

/** The site the form was submitted on, so a staging test links to
    staging and a live submission to the live site. */
function siteOrigin(h: Headers): string {
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host || !/^[a-z0-9.-]+(:\d+)?$/i.test(host)) return SITE.url.replace(/\/$/, "");
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const proto = h.get("x-forwarded-proto") ?? (local ? "http" : "https");
  return `${proto === "http" ? "http" : "https"}://${host}`;
}

function fileNote(file: NonNullable<Row[2]>): string {
  return file.href
    ? `The download link works for ${retentionDays()} days; the file is also attached to this email.`
    : "Attached to this email.";
}

function plainEmail(rows: Row[]): string {
  const width = Math.max(...rows.map(([label]) => label.length)) + 2;
  return [
    "New job seeker submission",
    "",
    ...rows.map(([label, value, file]) => {
      if (file) {
        const pad = " ".repeat(width);
        return [
          `${(label + ":").padEnd(width)}${value}`,
          ...(file.href ? [`${pad}Download: ${file.href}`] : []),
          `${pad}${fileNote(file)}`,
        ].join("\n");
      }
      return value.includes("\n")
        ? `${label}:\n  ${value.split("\n").join("\n  ")}`
        : `${(label + ":").padEnd(width)}${value}`;
    }),
    "",
    "Reply to this email to contact the candidate directly.",
  ].join("\n");
}

function htmlEmail(rows: Row[], email: string): string {
  const ink = "#2b276b";
  const body = rows
    .map(([label, value, file], i) => {
      const empty = value === NOT_PROVIDED;
      const shown =
        label === "Email"
          ? `<a href="mailto:${escapeHtml(email)}" style="color:${ink}">${escapeHtml(value)}</a>`
          : file
            ? `<div style="font-weight:600">${escapeHtml(value)}</div>` +
              (file.href
                ? `<a href="${escapeHtml(file.href)}" style="display:inline-block;margin-top:8px;padding:9px 16px;background:#f49055;color:${ink};font-weight:700;text-decoration:none;border-radius:6px">Download resume</a>`
                : "") +
              `<div style="margin-top:6px;font-size:13px;color:#55527a">${escapeHtml(fileNote(file))}</div>`
            : escapeHtml(value).replace(/\n/g, "<br>");
      return `<tr style="background:${i % 2 ? "#ffffff" : "#f7f6fb"}">
  <td style="padding:10px 14px;width:180px;vertical-align:top;font-weight:600;color:#55527a;white-space:nowrap">${escapeHtml(label)}</td>
  <td style="padding:10px 14px;vertical-align:top;color:${empty ? "#8a88a3" : "#1d1b3a"}${empty ? ";font-style:italic" : ""}">${shown}</td>
</tr>`;
    })
    .join("\n");
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f2f1f7;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.45">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e4e2ef">
<tr><td style="background:${ink};padding:18px 20px;color:#ffffff;font-size:18px;font-weight:700">New job seeker submission</td></tr>
<tr><td style="padding:8px 6px">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
${body}
</table>
</td></tr>
<tr><td style="padding:14px 20px 20px;color:#55527a;font-size:13px">Reply to this email to contact the candidate directly.</td></tr>
</table>
</body></html>`;
}
