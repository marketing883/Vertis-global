"use server";

import { newsletterSchema, type NewsletterState } from "@/lib/validation/newsletter";
import { NEWSLETTER } from "@/config/resources";
import { notifyTeam, signOff, thankVisitor } from "@/lib/email";

/* Newsletter signup. Same delivery path as the inquiry (lib/email.ts):
   the team is told, the subscriber is thanked. Swapping this for a
   list provider (Resend Audiences, Mailchimp) is a one-function
   change here; the form does not care. */

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

  const email = parsed.data.email;
  const sent = await notifyTeam("newsletter", {
    replyTo: email,
    subject: `Newsletter signup: ${email}`,
    text: `New subscriber to ${NEWSLETTER.name}: ${email}`,
  });
  if (!sent) {
    return { status: "error", message: "We couldn't sign you up just now. Please try again." };
  }

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
