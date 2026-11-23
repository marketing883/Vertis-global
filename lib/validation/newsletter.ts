import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address."),
  /* honeypot: real visitors leave it empty. Not validated here: a
     filled one is caught in the action and answered with a quiet
     "success", so a bot learns nothing. */
  website: z.string().optional(),
  /* the page the form was on; anything odd is simply not recorded */
  source: z.string().optional(),
});

export type NewsletterState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };
