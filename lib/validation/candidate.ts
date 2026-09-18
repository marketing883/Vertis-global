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

export const candidateSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name."),
  email: z.email("Please enter an email we can reply to."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  work: z
    .string()
    .trim()
    .min(3, 'A few words is enough, like "forklift driver" or "accounts payable".'),
  location: z.string().trim().min(2, "Where are you looking for work?"),
  lookingFor: z.enum(
    CANDIDATE_LOOKING_FOR.map((o) => o.id) as [CandidateLookingFor, ...CandidateLookingFor[]],
  ),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  /* honeypot, must stay empty */
  website: z.string().max(0).optional().or(z.literal("")),
});

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
