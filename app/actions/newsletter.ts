"use server";

import { headers } from "next/headers";
import { newsletterSchema, type NewsletterState } from "@/lib/validation/newsletter";
import { NEWSLETTER } from "@/config/resources";
import { signOff, thankVisitor } from "@/lib/email";
import { clientAddress, emailRateLimited, rateLimited } from "@/lib/spam";
import { addSubscriber } from "@/lib/subscribers";

/* Newsletter signup. The address is saved to the subscriber list in
   the admin (/admin/subscribers); the team is not emailed. A new
   subscriber gets one thank-you; signing up again changes nothing and
   sends nothing, so the form cannot be used to email someone over and
   over. Bots that fill the hidden field, or post too often, are shown
   the normal success message and nothing is saved or sent. */

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please enter a valid email address.",
    };
  }
  if (parsed.data.website) return { status: "success" }; // honeypot tripped

  const email = parsed.data.email.trim().toLowerCase();
  if (rateLimited(clientAddress(await headers())) || emailRateLimited(email)) {
    console.warn("[newsletter:spam] dropped, rate limited");
    return { status: "success" };
  }

  let added: boolean;
  try {
    added = addSubscriber(email, parsed.data.source ?? "");
  } catch (err) {
    console.error("[newsletter] could not save a signup:", err instanceof Error ? err.message : "unknown error");
    return { status: "error", message: "We couldn't sign you up just now. Please try again." };
  }
  if (!added) return { status: "success" }; // already subscribed

  await thankVisitor("newsletter", {
    to: email,
    subject: `You're on the list for ${NEWSLETTER.name}`,
    text: [
      `Hello,`,
      ``,
      `Thanks for subscribing to ${NEWSLETTER.name}. ${NEWSLETTER.line}`,
      signOff("If that wasn't you, or you change your mind, reply with \"unsubscribe\" and we'll take you off the list."),
    ].join("\n"),
  });

  return { status: "success" };
}
