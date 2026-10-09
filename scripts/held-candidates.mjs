#!/usr/bin/env node
// Job seeker submissions held while recruiter notifications are paused
// (see lib/candidate-delivery.ts). Run on the server, as the vertis
// user, from the app checkout:
//
//   node scripts/held-candidates.mjs list          what is waiting
//   node scripts/held-candidates.mjs show <ref>    one submission in full
//   node scripts/held-candidates.mjs discard <ref> delete one (spam that got through)
//   node scripts/held-candidates.mjs release       email them all to the recruiters
//
// `release` sends each held email to NOTIFY_TO / NOTIFY_CC through
// Resend, exactly as the form would have, and deletes each file once
// Resend accepts it. It refuses to run unless CANDIDATE_NOTIFICATIONS=on
// is set in .env.local, so the pause cannot be bypassed by accident.
// Nothing here prints candidate details unless you ask for `show`.
import { readFile, readdir, unlink } from "node:fs/promises";
import path from "node:path";

// The same .env.local the site reads, so the script needs no flags.
const env = { ...process.env };
try {
  for (const line of (await readFile(".env.local", "utf8")).split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* no .env.local: environment only */
}

const DIR = env.CANDIDATE_HOLD_DIR?.trim() || path.resolve("..", "held-candidates");
// Defaults must match lib/email.ts.
const list = (v, fallback) => (v?.trim() ? v : fallback).split(",").map((s) => s.trim()).filter(Boolean);
const TO = list(env.NOTIFY_TO, "lohith.s@aciinfotech.com");
const CC = list(env.NOTIFY_CC, "krish.karanam@aciinfotech.com");
const FROM = env.MAIL_FROM?.trim() || "Vertis Global <no-reply@vertisglobal.com>";

async function held() {
  let names = [];
  try {
    names = (await readdir(DIR)).filter((n) => n.endsWith(".json")).sort();
  } catch {
    return [];
  }
  const out = [];
  for (const name of names) {
    try {
      out.push({ file: path.join(DIR, name), ...JSON.parse(await readFile(path.join(DIR, name), "utf8")) });
    } catch {
      console.error(`unreadable: ${name}`);
    }
  }
  return out;
}

const [cmd, ref] = process.argv.slice(2);
const items = await held();
const find = () => items.find((i) => i.reference === ref) ?? (console.error(`no held submission ${ref}`), process.exit(1));

if (cmd === "list" || !cmd) {
  console.log(`${items.length} held in ${DIR}`);
  for (const i of items) {
    const resume = i.email.attachments?.length ? "resume attached" : "no resume";
    console.log(`  ${i.reference}  ${i.received}  ${resume}`);
  }
} else if (cmd === "show") {
  const i = find();
  console.log(`Subject: ${i.email.subject}\nReply-To: ${i.email.replyTo}\n\n${i.email.text}`);
} else if (cmd === "discard") {
  const i = find();
  await unlink(i.file);
  console.log(`discarded ${i.reference}`);
} else if (cmd === "release") {
  if (env.CANDIDATE_NOTIFICATIONS?.trim().toLowerCase() !== "on") {
    console.error("Recruiter notifications are paused. Set CANDIDATE_NOTIFICATIONS=on in .env.local first.");
    process.exit(1);
  }
  if (!env.RESEND_API_KEY?.trim()) {
    console.error("RESEND_API_KEY is not set; nothing sent.");
    process.exit(1);
  }
  let sent = 0;
  for (const i of items) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY.trim()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        ...(CC.length ? { cc: CC } : {}),
        reply_to: i.email.replyTo,
        subject: i.email.subject,
        text: i.email.text,
        ...(i.email.html ? { html: i.email.html } : {}),
        ...(i.email.attachments?.length ? { attachments: i.email.attachments } : {}),
      }),
    });
    if (res.ok) {
      await unlink(i.file);
      sent++;
      console.log(`sent ${i.reference}`);
    } else {
      console.error(`failed ${i.reference}: Resend ${res.status}; kept for another try`);
    }
  }
  console.log(`${sent} of ${items.length} delivered`);
} else {
  console.error("usage: held-candidates.mjs list | show <ref> | discard <ref> | release");
  process.exit(2);
}
