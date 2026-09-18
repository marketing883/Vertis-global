import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address."),
  /* honeypot: must stay empty */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type NewsletterState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };
