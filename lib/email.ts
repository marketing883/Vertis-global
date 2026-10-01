import { SITE } from "@/config/site";

/* One delivery path for every form on the site. Each submission sends
   two emails through Resend's REST API:

     1. a notification to the team (NOTIFY_TO, cc NOTIFY_CC), with the
        visitor as reply-to so answering the lead is one click;
     2. a thank-you to the visitor, from MAIL_FROM.

   The notification is the one that matters: if it fails, the form
   reports an error so the visitor emails us instead. A failed
   thank-you is logged and swallowed; the lead has already arrived.

   With no RESEND_API_KEY both are logged to the server console, so
   the forms still work end to end in development.

     RESEND_API_KEY  — from resend.com; the sending domain must be
                       verified there or Resend refuses every recipient
                       except the account owner
     MAIL_FROM       — defaults to "Vertis Global <no-reply@vertisglobal.com>"
     MAIL_REPLY_TO   — where a visitor's reply to the thank-you lands;
                       defaults to SITE.staffingEmail
     NOTIFY_TO       — comma separated; defaults to lohith.s@aciinfotech.com
     NOTIFY_CC       — comma separated; defaults to krish.karanam@aciinfotech.com */

const DEFAULT_NOTIFY_TO = "lohith.s@aciinfotech.com";
const DEFAULT_NOTIFY_CC = "krish.karanam@aciinfotech.com";

type Attachment = { filename: string; content: string };

type Message = {
  to: string[];
  cc?: string[];
  replyTo?: string;
  subject: string;
  text: string;
  attachments?: Attachment[];
};

function list(value: string | undefined, fallback: string): string[] {
  return (value?.trim() ? value : fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function from() {
  return process.env.MAIL_FROM?.trim() || `${SITE.name} <no-reply@vertisglobal.com>`;
}

/** Sends one email. Returns true when Resend accepted it, or when no key
    is configured and it was logged instead. */
async function send(tag: string, msg: Message): Promise<boolean> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.info(
      `[${tag}] (no RESEND_API_KEY — logging only)\n` +
        `to: ${msg.to.join(", ")}${msg.cc?.length ? `\ncc: ${msg.cc.join(", ")}` : ""}\n` +
        `subject: ${msg.subject}\n\n${msg.text}` +
        (msg.attachments?.length
          ? `\n[attached: ${msg.attachments.map((a) => a.filename).join(", ")}]`
          : ""),
    );
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: from(),
        to: msg.to,
        ...(msg.cc?.length ? { cc: msg.cc } : {}),
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
        subject: msg.subject,
        text: msg.text,
        ...(msg.attachments?.length ? { attachments: msg.attachments } : {}),
      }),
    });
    if (!res.ok) {
      console.error(`[${tag}] Resend responded`, res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[${tag}] send failed`, err);
    return false;
  }
}

/** The lead, to the team. The form fails if this does. */
export function notifyTeam(
  tag: string,
  msg: { replyTo?: string; subject: string; text: string; attachments?: Attachment[] },
) {
  return send(tag, {
    ...msg,
    to: list(process.env.NOTIFY_TO, DEFAULT_NOTIFY_TO),
    cc: list(process.env.NOTIFY_CC, DEFAULT_NOTIFY_CC),
  });
}

/** The acknowledgement, to the visitor. Never fails the form.

    Anyone can type anyone's address into a public form, so this email
    must never carry what the visitor wrote, or it becomes a way to
    send arbitrary text from our domain. It gets a greeting, the
    reference and fixed copy, nothing else. */
export async function thankVisitor(
  tag: string,
  msg: { to: string; subject: string; text: string },
) {
  const ok = await send(`${tag}:thanks`, {
    to: [msg.to],
    replyTo: process.env.MAIL_REPLY_TO?.trim() || SITE.staffingEmail,
    subject: msg.subject,
    text: msg.text,
  });
  if (!ok) console.error(`[${tag}] thank-you not sent to ${msg.to}; the lead was delivered`);
}

/** "Hi Priya," from whatever was typed in the name field: first word,
    letters only, capped, so the greeting cannot smuggle in a link. */
export function greeting(name: string) {
  const first = name.trim().split(/\s+/)[0]?.replace(/[^\p{L}'-]/gu, "").slice(0, 30);
  return first ? `Hi ${first},` : "Hello,";
}

const HOST = SITE.url.replace(/^https?:\/\/(www\.)?/, "");

/** Closing lines for every thank-you. `why` explains the email to
    someone who did not fill in the form. */
export function signOff(why = "If that wasn't you, ignore this email and you won't hear from us again.") {
  return [
    ``,
    `The ${SITE.name} team`,
    HOST,
    ``,
    `You're getting this because this address was entered on a form at ${HOST}. ${why}`,
  ].join("\n");
}
