import "server-only";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/* ============================================================
   RESUME STORE

   Recruiters asked for a download link in the email body, not only
   an attachment (some mail clients and filters hide or strip
   attachments). A link needs the file to live somewhere, so resumes
   are now kept on the server, briefly and privately:

   · Where: RESUME_DIR, default ../resumes beside the app checkout
     (/var/www/vertisglobal.com/<env>/resumes). Outside the app, so a
     deploy's git reset never touches it and nothing under public/
     can ever serve it.
   · How they are reached: /resume/<token>, where the token is 32
     random URL-safe characters (192 bits). Unguessable, not
     sequential, and never derived from the candidate's name.
   · How long: RESUME_RETENTION_DAYS, default 30. Expired files are
     deleted on the next upload and refused on download.
   · If storing fails for any reason, the caller still attaches the
     file to the email; the link is a convenience, not the only copy.

   Each resume is two files: <token> (the bytes) and <token>.json
   (original filename, content type, when it was received).
   ============================================================ */

const TOKEN = /^[A-Za-z0-9_-]{32}$/;

function dir() {
  return process.env.RESUME_DIR?.trim() || path.resolve(process.cwd(), "..", "resumes");
}

function retentionMs() {
  const days = Number(process.env.RESUME_RETENTION_DAYS);
  return (Number.isFinite(days) && days > 0 ? days : 30) * 24 * 60 * 60 * 1000;
}

export function retentionDays() {
  return Math.round(retentionMs() / (24 * 60 * 60 * 1000));
}

type Meta = { filename: string; type: string; created: number };

/** Saves the resume and returns its token, or null if it could not be
    stored (the email then carries the attachment only). */
export async function storeResume(bytes: Buffer, filename: string, type: string): Promise<string | null> {
  try {
    const base = dir();
    await fs.mkdir(base, { recursive: true, mode: 0o700 });
    await sweep(base);
    const token = randomBytes(24).toString("base64url");
    await fs.writeFile(path.join(base, token), bytes, { mode: 0o600 });
    const meta: Meta = { filename, type: type || "application/octet-stream", created: Date.now() };
    await fs.writeFile(path.join(base, `${token}.json`), JSON.stringify(meta), { mode: 0o600 });
    return token;
  } catch (err) {
    console.error("[resume-store] could not store resume, sending as attachment only", err);
    return null;
  }
}

/** The stored resume for a token, or null if unknown or expired. */
export async function readResume(token: string): Promise<(Meta & { bytes: Buffer }) | null> {
  if (!TOKEN.test(token)) return null;
  const base = dir();
  try {
    const meta = JSON.parse(await fs.readFile(path.join(base, `${token}.json`), "utf8")) as Meta;
    if (Date.now() - meta.created > retentionMs()) {
      await remove(base, token);
      return null;
    }
    return { ...meta, bytes: await fs.readFile(path.join(base, token)) };
  } catch {
    return null;
  }
}

async function remove(base: string, token: string) {
  await Promise.allSettled([
    fs.unlink(path.join(base, token)),
    fs.unlink(path.join(base, `${token}.json`)),
  ]);
}

/** Deletes every resume past its retention period. */
async function sweep(base: string) {
  const cutoff = Date.now() - retentionMs();
  for (const name of await fs.readdir(base)) {
    if (!name.endsWith(".json")) continue;
    const token = name.slice(0, -5);
    if (!TOKEN.test(token)) continue;
    try {
      const meta = JSON.parse(await fs.readFile(path.join(base, name), "utf8")) as Meta;
      if (meta.created < cutoff) await remove(base, token);
    } catch {
      /* unreadable metadata: leave it for a person to look at */
    }
  }
}
