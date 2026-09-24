"use server";

import {
  INQUIRY_NEEDS,
  inquirySchema,
  type InquiryState,
  type InquiryValues,
} from "@/lib/validation/inquiry";
import { ALL_INDUSTRIES } from "@/config/industries";
import { SERVICES } from "@/config/services";
import { greeting, notifyTeam, signOff, thankVisitor } from "@/lib/email";

/* The employer lead. Validates on the server, then emails the team
   and thanks the visitor through lib/email.ts, which also documents
   the env vars. With no key configured both emails are logged and
   the form still succeeds, so the UX works end to end in development.

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

  const sent = await notifyTeam("inquiry", { replyTo: lead.email, subject, text: body });
  if (!sent) {
    return {
      status: "error",
      errors: {},
      message: "We couldn't send that just now. Please email us directly.",
    };
  }

  await thankVisitor("inquiry", {
    to: lead.email,
    subject: `We've got your request (${reference})`,
    text: [
      greeting(lead.name),
      ``,
      `Thanks for getting in touch with Vertis Global. Your request has reached our team, and someone will be in touch within a business day.`,
      ``,
      `Your reference is ${reference}. If you need to add anything in the meantime, reply to this email and quote it.`,
      signOff(),
    ].join("\n"),
  });

  // TODO(phase-2): hand the lead to the CRM here.

  return { status: "success", reference };
}

function makeReference() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VG-${stamp}-${rand}`;
}
