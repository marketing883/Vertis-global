import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/* ============================================================
   CANDIDATE NOTIFICATIONS: PAUSE AND HOLD

   Recruiter emails for the job seeker form are PAUSED unless the
   server's environment says otherwise:

     CANDIDATE_NOTIFICATIONS=on     send to NOTIFY_TO / NOTIFY_CC
     (anything else, or unset)      paused

   Paused is the default on purpose, so no deploy, restart or missing
   variable can switch the emails back on. The recipient addresses
   themselves are untouched (lib/email.ts, NOTIFY_TO, NOTIFY_CC); the
   pause only decides whether the candidate email is sent to them.
   Nothing is redirected to anyone else.

   While paused, a submission that passed screening is HELD rather
   than lost: the finished recruiter email (subject, body, resume) is
   written to CANDIDATE_HOLD_DIR, default ../held-candidates beside
   the app checkout (/var/www/vertisglobal.com/<env>/held-candidates),
   outside the app and outside public/, one file per reference, mode
   600 in a 700 directory. scripts/held-candidates.mjs lists them for
   review and, once notifications are back on, delivers them to the
   recruiters and deletes each file as it is sent.

   If the hold directory cannot be written, the caller tells the
   candidate to email us instead, so a person is never told "we have
   it" when we do not.
   ============================================================ */

export function candidateNotificationsOn(): boolean {
  return process.env.CANDIDATE_NOTIFICATIONS?.trim().toLowerCase() === "on";
}

function holdDir() {
  return process.env.CANDIDATE_HOLD_DIR?.trim() || path.resolve(process.cwd(), "..", "held-candidates");
}

export type HeldCandidate = {
  reference: string;
  received: string;
  /** The recruiter email exactly as it would have been sent. */
  email: {
    replyTo: string;
    subject: string;
    text: string;
    html?: string;
    attachments?: { filename: string; content: string }[];
  };
};

/** Writes the held submission. Returns false if it could not be kept. */
export async function holdCandidate(record: HeldCandidate): Promise<boolean> {
  try {
    const dir = holdDir();
    await fs.mkdir(dir, { recursive: true, mode: 0o700 });
    const file = path.join(dir, `${record.reference.replace(/[^A-Z0-9-]/gi, "")}.json`);
    await fs.writeFile(file, JSON.stringify(record), { mode: 0o600, flag: "wx" });
    return true;
  } catch (err) {
    /* The error, never the record: it holds the candidate's details. */
    console.error(
      `[candidate] could not hold ${record.reference}:`,
      err instanceof Error ? err.message : "unknown error",
    );
    return false;
  }
}
