"use server";

import {
  candidateSchema,
  CANDIDATE_LOOKING_FOR,
  RESUME_MAX_BYTES,
  RESUME_TYPES,
  type CandidateState,
  type CandidateValues,
} from "@/lib/validation/candidate";
import { SITE } from "@/config/site";

/* The job seeker lead. Same delivery path as the employer inquiry:
   validated on the server, emailed through Resend when the key is
   set, logged otherwise. The resume is attached to that email and is
   never written to disk or to a database, which is what "no candidate
   database" means in practice.

     RESEND_API_KEY   — from resend.com
     CANDIDATE_TO     — inbox for job seekers (falls back to INQUIRY_TO) */

export async function submitCandidate(
  _prev: CandidateState,
  formData: FormData,
): Promise<CandidateState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = candidateSchema.safeParse(raw);

  /* Everything typed, echoed back so a validation error does not
     cost the person their answers. The file is left out: a browser
     will not let us refill a file input anyway. */
  const values = Object.fromEntries(
    Object.entries(raw).filter(
      ([k, v]) => typeof v === "string" && k !== "website" && k !== "resume",
    ),
  ) as CandidateValues;

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return { status: "error", errors, values };
  }

  const lead = parsed.data;
  if (lead.website) return { status: "success", reference: makeReference() };

  /* The resume is optional, but if one is attached it has to be
     something a recruiter can actually open, and small enough to
     email. Both limits are also enforced in the browser; this is the
     side that counts. */
  const file = formData.get("resume");
  let attachment: { filename: string; content: string } | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > RESUME_MAX_BYTES) {
      return {
        status: "error",
        values,
        errors: { resume: "That file is over 5MB. Send a smaller one, or email it to us instead." },
      };
    }
    const named = file.name.toLowerCase();
    const looksRight =
      RESUME_TYPES.includes(file.type) || /\.(pdf|docx?|rtf|txt)$/.test(named);
    if (!looksRight) {
      return {
        status: "error",
        values,
        errors: { resume: "Please attach a PDF, Word, RTF or text file." },
      };
    }
    attachment = {
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    };
  }

  const reference = makeReference();
  const to = process.env.CANDIDATE_TO ?? process.env.INQUIRY_TO ?? SITE.staffingEmail;
  const key = process.env.RESEND_API_KEY;
  const lookingFor =
    CANDIDATE_LOOKING_FOR.find((o) => o.id === lead.lookingFor)?.label ?? lead.lookingFor;

  const subject = `Job seeker ${reference}: ${lead.name}`;
  const body = [
    `Reference: ${reference}`,
    `Looking for: ${lookingFor}`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "not provided"}`,
    ``,
    `Kind of work: ${lead.work}`,
    `Where: ${lead.location}`,
    `Resume: ${attachment ? attachment.filename : "not attached"}`,
    ``,
    `Message:`,
    lead.message || "none",
  ].join("\n");

  if (key) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: `Vertis Global Website <no-reply@${new URL(SITE.url).hostname}>`,
          to: [to],
          reply_to: lead.email,
          subject,
          text: body,
          ...(attachment ? { attachments: [attachment] } : {}),
        }),
      });
      if (!res.ok) {
        console.error("[candidate] Resend responded", res.status, await res.text());
        return {
          status: "error",
          errors: {},
          message: "We couldn't send that just now. Please email us directly.",
        };
      }
    } catch (err) {
      console.error("[candidate] send failed", err);
      return {
        status: "error",
        errors: {},
        message: "We couldn't send that just now. Please email us directly.",
      };
    }
  } else {
    console.info(
      `[candidate] (no RESEND_API_KEY — logging only)\n${body}${
        attachment ? `\n[resume attached: ${attachment.filename}]` : ""
      }`,
    );
  }

  return { status: "success", reference };
}

function makeReference() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VG-C-${stamp}-${rand}`;
}
