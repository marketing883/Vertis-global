import { z } from "zod";

/* The job seeker enquiry. Deliberately short: a person reads it, and
   nothing is stored, so we ask only what a recruiter needs to call
   somebody back. The resume file is validated in the action rather
   than here, because zod does not see the File. */

export const CANDIDATE_LOOKING_FOR = [
  { id: "permanent", label: "A permanent job" },
  { id: "temporary", label: "Temporary or seasonal work" },
  { id: "contract", label: "Contract work" },
  { id: "open", label: "Open to anything that fits" },
] as const;

export type CandidateLookingFor = (typeof CANDIDATE_LOOKING_FOR)[number]["id"];

/** Kept in step with the action. 5MB, and formats a recruiter can open. */
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_ACCEPT = ".pdf,.doc,.docx,.rtf,.txt";
export const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/rtf",
  "text/rtf",
  "text/plain",
];

/* Server-side rules. Values arrive already cleaned by cleanText
   (control and invisible characters gone, spacing tidied), so these
   check shape and length only. Lenient on purpose: accents,
   apostrophes, hyphens and international phone formats all pass. */
const PHONE_CHARS = /^[+\d\s().-]*$/;

export const candidateSchema = z.object({
  name: z
    .string()
    .min(2, "Please tell us your name.")
    .max(100, "That name is longer than we can take. Please shorten it.")
    .regex(/\p{L}/u, "Please tell us your name."),
  email: z.email("Please enter an email we can reply to.").max(254),
  phone: z
    .string()
    .max(30, "Please enter a phone number, or leave it blank.")
    .refine(
      (v) => v === "" || (PHONE_CHARS.test(v) && /^(\D*\d){7,15}\D*$/.test(v)),
      "Please enter a phone number, or leave it blank.",
    )
    .optional()
    .or(z.literal("")),
  work: z
    .string()
    .min(3, 'A few words is enough, like "forklift driver" or "accounts payable".')
    .max(200, "A short description is plenty. Please shorten it."),
  location: z
    .string()
    .min(2, "Where are you looking for work?")
    .max(120, "A city, state or \"remote\" is plenty. Please shorten it."),
  lookingFor: z.enum(
    CANDIDATE_LOOKING_FOR.map((o) => o.id) as [CandidateLookingFor, ...CandidateLookingFor[]],
  ),
  message: z.string().max(2000, "Please keep this under 2,000 characters.").optional().or(z.literal("")),
  /* honeypot, must stay empty */
  website: z.string().max(0).optional().or(z.literal("")),
});

/** Strips control and invisible characters and tidies spacing. Keeps
    line breaks where a field is multi-line (the message). */
export function cleanText(value: unknown, multiline = false): string {
  if (typeof value !== "string") return "";
  const stripped = value
    .normalize("NFC")
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
    .replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ");
  return multiline
    ? stripped
        .split("\n")
        .map((l) => l.replace(/\s+/g, " ").trim())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    : stripped.replace(/\s+/g, " ").trim();
}

export type CandidateInput = z.infer<typeof candidateSchema>;

/* React 19 resets an uncontrolled form once its action returns, so a
   failed submission would wipe everything the person typed. The
   error state carries the values back and the fields use them as
   their defaults, which is what makes the reset harmless. */
export type CandidateValues = Partial<Record<keyof CandidateInput, string>>;

export type CandidateState =
  | { status: "idle" }
  | {
      status: "error";
      errors: Partial<Record<keyof CandidateInput | "resume", string>>;
      values?: CandidateValues;
      message?: string;
    }
  | { status: "success"; reference: string };
