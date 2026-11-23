"use server";

import {
  INQUIRY_NEEDS,
  inquirySchema,
  type InquiryState,
  type InquiryValues,
} from "@/lib/validation/inquiry";
import { ALL_INDUSTRIES } from "@/config/industries";
import { SERVICES } from "@/config/services";
import { headers } from "next/headers";
import { greeting, signOff, thankVisitor } from "@/lib/email";
import { clientAddress, emailRateLimited, rateLimited } from "@/lib/spam";
import { cleanText } from "@/lib/validation/candidate";
import { enquiryReferenceTaken, saveEnquiry } from "@/lib/enquiries";

/* The employer lead. Validated on the server, saved to Enquiries in
   the admin (/admin/enquiries), and the employer thanked through
   lib/email.ts. Nobody is emailed about a new enquiry: the team works
   them from the dashboard. If the enquiry cannot be saved, the form
   says so and asks them to email us, so a lead is never silently lost.

   A CRM hand-off belongs in the same place, see the TODO. */

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  /* Every value cleaned of control and invisible characters first; the
     message keeps its line breaks. */
  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, typeof v === "string" ? cleanText(v, k === "details") : v]),
  );
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

  /* Too many from one address or one email: the normal success
     screen, nothing saved, as for the other forms. */
  if (rateLimited(clientAddress(await headers())) || emailRateLimited(lead.email)) {
    console.warn("[inquiry:spam] dropped, rate limited");
    return { status: "success", reference: makeReference() };
  }

  let reference = makeReference();
  for (let i = 0; i < 5 && enquiryReferenceTaken(reference); i++) reference = makeReference();

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

  try {
    saveEnquiry({
      reference,
      need,
      service: lead.service ? service : "",
      industry: lead.industry ? industry : "",
      name: lead.name,
      company: lead.company,
      email: lead.email.toLowerCase(),
      phone: lead.phone ?? "",
      talent: lead.talent,
      location: lead.location,
      positions: lead.positions,
      details: lead.details ?? "",
    });
  } catch (err) {
    console.error(`[inquiry] ${reference} could not be saved:`, err instanceof Error ? err.message : "unknown error");
    return {
      status: "error",
      errors: {},
      message: "We couldn't send that just now. Please email us directly.",
    };
  }
  console.info(`[inquiry] ${reference} saved to enquiries`);

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
