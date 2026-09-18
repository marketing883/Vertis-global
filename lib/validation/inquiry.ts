import { z } from "zod";

/* One schema, shared by the client (for field hints) and the server
   action (the actual security boundary). Kept deliberately short —
   this is a first conversation, not a procurement form. */

export const INQUIRY_NEEDS = [
  {
    id: "role",
    title: "Hire for a role",
    line: "Tell us who you need and we'll find them.",
  },
  {
    id: "team",
    title: "Build a team",
    line: "Several people, maybe across different roles.",
  },
  {
    id: "project",
    title: "Staff a project or a season",
    line: "People for a set piece of work or a busy period.",
  },
  {
    id: "unsure",
    title: "Not sure yet",
    line: "Tell us what you're working on. We'll figure it out together.",
  },
] as const;

export type InquiryNeed = (typeof INQUIRY_NEEDS)[number]["id"];

export const POSITION_COUNTS = ["1", "2–5", "6–15", "16–50", "50+"] as const;

export const inquirySchema = z.object({
  need: z.enum(INQUIRY_NEEDS.map((n) => n.id) as [InquiryNeed, ...InquiryNeed[]]),
  /* An industry slug from config/industries.ts. Optional, and
     pre-selected when the visitor arrives from the explorer. */
  industry: z.string().trim().max(60).optional().or(z.literal("")),
  /* A service slug from config/services.ts. Optional, and set when
     the visitor arrives from a service page. Loose strings on
     purpose: this schema reaches the client bundle, and a renamed
     slug should degrade to a label, not reject a real lead. */
  service: z.string().trim().max(60).optional().or(z.literal("")),
  name: z.string().trim().min(2, "Please tell us your name."),
  company: z.string().trim().min(2, "Please tell us your company."),
  email: z.email("Please enter a work email we can reply to."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  talent: z
    .string()
    .trim()
    .min(3, "A few words is enough, like \"forklift operators\" or \"a nurse\"."),
  location: z.string().trim().min(2, "Where will the work be?"),
  positions: z.enum(POSITION_COUNTS),
  details: z.string().trim().max(2000).optional().or(z.literal("")),
  /* honeypot — must stay empty */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/* React 19 resets an uncontrolled form once its action returns, so a
   failed submission would wipe every field. The error state carries
   the values back and the inputs use them as defaults. */
export type InquiryValues = Partial<Record<keyof InquiryInput, string>>;

export type InquiryState =
  | { status: "idle" }
  | {
      status: "error";
      errors: Partial<Record<keyof InquiryInput, string>>;
      values?: InquiryValues;
      message?: string;
    }
  | { status: "success"; reference: string };
