"use server";

import {
  INQUIRY_NEEDS,
  inquirySchema,
  type InquiryState,
  type InquiryValues,
} from "@/lib/validation/inquiry";
import { ALL_INDUSTRIES } from "@/config/industries";
import { SERVICES } from "@/config/services";
import { SITE } from "@/config/site";

/* The employer lead. Validates on the server, then delivers by
   email through Resend's REST API when the two env vars below are
   set. With no keys configured it logs the lead and still returns
   success, so the UX can be exercised end to end in development.

     RESEND_API_KEY   — from resend.com
     INQUIRY_TO       — inbox that receives leads (defaults to info@)

   A CRM hand-off belongs in the same place — see the TODO. */

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = inquirySchema.safeParse(raw);

  /* Echoed back so a validation error does not cost the person the
     eight fields they just filled in. */
  const values = Object.fromEntries(
    Object.entries(raw).filter(([k, v]) => typeof v === "string" && k !== "website"),
  ) as InquiryValues;

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return { status: "error", errors, values };
  }

  const lead = parsed.data;
  if (lead.website) {
    /* Honeypot tripped — pretend it worked, tell no one. */
    return { status: "success", reference: makeReference() };
  }

  const reference = makeReference();
  const to = process.env.INQUIRY_TO ?? SITE.staffingEmail;
  const key = process.env.RESEND_API_KEY;

  /* The form submits slugs and ids; the inbox wants readable names.
     Service goes first because it is the strongest routing signal
     for whoever picks the lead up. */
  const service = lead.service
    ? (SERVICES.find((s) => s.slug === lead.service)?.name ?? lead.service)
    : "not specified";
  const industry = lead.industry
    ? (ALL_INDUSTRIES.find((i) => i.slug === lead.industry)?.name ?? lead.industry)
    : "not specified";
  const need = INQUIRY_NEEDS.find((n) => n.id === lead.need)?.title ?? lead.need;

  const subject = `New staffing inquiry ${reference}: ${lead.company}`;
  const body = [
    `Reference: ${reference}`,
    `Need: ${need}`,
    `Service: ${service}`,
    `Industry: ${industry}`,
    ``,
    `Name: ${lead.name}`,
    `Company: ${lead.company}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "not provided"}`,
    ``,
    `Who they need: ${lead.talent}`,
    `Where: ${lead.location}`,
    `How many: ${lead.positions}`,
    ``,
    `Details:`,
    lead.details || "none",
  ].join("\n");

  if (key) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Vertis Global Website <no-reply@${new URL(SITE.url).hostname}>`,
          to: [to],
          reply_to: lead.email,
          subject,
          text: body,
        }),
      });
      if (!res.ok) {
        console.error("[inquiry] Resend responded", res.status, await res.text());
        return {
          status: "error",
          errors: {},
          message: "We couldn't send that just now. Please email us directly.",
        };
      }
    } catch (err) {
      console.error("[inquiry] send failed", err);
      return {
        status: "error",
        errors: {},
        message: "We couldn't send that just now. Please email us directly.",
      };
    }
  } else {
    console.info(`[inquiry] (no RESEND_API_KEY — logging only)\n${body}`);
  }

  // TODO(phase-2): hand the lead to the CRM here.

  return { status: "success", reference };
}

function makeReference() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VG-${stamp}-${rand}`;
}
