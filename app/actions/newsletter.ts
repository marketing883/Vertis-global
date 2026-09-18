"use server";

import { newsletterSchema, type NewsletterState } from "@/lib/validation/newsletter";
import { SITE } from "@/config/site";

/* Newsletter signup. Same delivery path as the inquiry: validated on
   the server, sent to the inbox through Resend when RESEND_API_KEY
   is set, logged otherwise. NEWSLETTER_TO overrides the inbox.
   Swapping this for a list provider (Resend Audiences, Mailchimp)
   is a one-function change here; the form does not care. */

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
  const to = process.env.NEWSLETTER_TO ?? process.env.INQUIRY_TO ?? SITE.staffingEmail;
  const key = process.env.RESEND_API_KEY;
  const text = `New newsletter subscriber: ${email}`;

  if (key) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: `Vertis Global Website <no-reply@${new URL(SITE.url).hostname}>`,
          to: [to],
          subject: "Newsletter signup",
          text,
        }),
      });
      if (!res.ok) {
        console.error("[newsletter] Resend responded", res.status, await res.text());
        return { status: "error", message: "We couldn't sign you up just now. Please try again." };
      }
    } catch (err) {
      console.error("[newsletter] send failed", err);
      return { status: "error", message: "We couldn't sign you up just now. Please try again." };
    }
  } else {
    console.info(`[newsletter] (no RESEND_API_KEY — logging only) ${text}`);
  }

  return { status: "success" };
}
