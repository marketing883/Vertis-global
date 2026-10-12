import "server-only";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { dataPath, getDb, now } from "@/lib/db";
import { CANDIDATE_LOOKING_FOR } from "@/lib/validation/candidate";

/* ============================================================
   APPLICATIONS

   Every job seeker form submission that passes screening becomes a
   row here, with its resume saved beside the database:

     <data>/applications/<id>-<random>.<ext>   (mode 600, dir 700)

   The admin (Applications) reads, updates and exports them; resumes
   are only ever served through /api/admin/applications/<id>/resume,
   which requires a signed-in admin or recruiter.

   Submissions held while recruiter emails were paused
   (lib/candidate-delivery.ts) are imported once, by reference, so no
   earlier candidate is lost. Those files stay where they are for the
   email release script.
   ============================================================ */

export const STATUSES = [
  { id: "new", label: "New" },
  { id: "reviewed", label: "Reviewed" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interview", label: "Interview" },
  { id: "rejected", label: "Rejected" },
] as const;
export type Status = (typeof STATUSES)[number]["id"];

export type ApplicationRow = {
  id: number;
  reference: string;
  name: string;
  email: string;
  phone: string;
  looking_for: string;
  work: string;
  location: string;
  message: string;
  job_id: number | null;
  job_title: string;
  resume_path: string | null;
  resume_filename: string | null;
  resume_type: string | null;
  resume_size: number | null;
  status: Status;
  internal_notes: string;
  screening: string;
  notification: string;
  source: string;
  created_at: string;
  updated_at: string;
};

export const lookingForLabel = (id: string) => CANDIDATE_LOOKING_FOR.find((o) => o.id === id)?.label ?? (id || "Not provided");

const EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/rtf": "rtf",
  "text/rtf": "rtf",
  "text/plain": "txt",
};

function extensionFor(filename: string, type: string): string {
  const fromName = filename.match(/\.(pdf|docx?|rtf|txt)$/i)?.[1]?.toLowerCase();
  return fromName ?? EXT[type] ?? "bin";
}

const TYPE: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  rtf: "application/rtf",
  txt: "text/plain; charset=utf-8",
};

export function contentTypeFor(ext: string): string {
  return TYPE[ext] ?? "application/octet-stream";
}

export type NewApplication = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  lookingFor: string;
  work: string;
  location: string;
  message: string;
  job: { id: number; title: string } | null;
  resume: { bytes: Buffer; filename: string; type: string } | null;
  screening: string;
  notification: "sent" | "paused" | "failed";
  source?: string;
  createdAt?: string;
};

/** Saves an application and its resume. Returns the new id. */
export async function saveApplication(a: NewApplication): Promise<number> {
  const db = getDb();
  const t = a.createdAt ?? now();
  const info = db
    .prepare(
      `INSERT INTO applications (reference, name, email, phone, looking_for, work, location, message,
         job_id, job_title, screening, notification, source, created_at, updated_at)
       VALUES (@reference, @name, @email, @phone, @lookingFor, @work, @location, @message,
         @jobId, @jobTitle, @screening, @notification, @source, @t, @t)`,
    )
    .run({
      ...a,
      jobId: a.job?.id ?? null,
      jobTitle: a.job?.title ?? "",
      source: a.source ?? "form",
      t,
    });
  const id = Number(info.lastInsertRowid);
  if (a.resume) {
    const ext = extensionFor(a.resume.filename, a.resume.type);
    const file = dataPath("applications", `${id}-${randomBytes(12).toString("hex")}.${ext}`);
    try {
      await fs.writeFile(file, a.resume.bytes, { mode: 0o600 });
    } catch (err) {
      /* No half-saved application: the caller falls back to email. */
      db.prepare("DELETE FROM applications WHERE id = ?").run(id);
      throw err;
    }
    db.prepare(
      "UPDATE applications SET resume_path = ?, resume_filename = ?, resume_type = ?, resume_size = ? WHERE id = ?",
    ).run(path.basename(file), a.resume.filename, contentTypeFor(ext), a.resume.bytes.length, id);
  }
  return id;
}

export function setNotification(id: number, notification: "sent" | "paused" | "failed") {
  getDb().prepare("UPDATE applications SET notification = ? WHERE id = ?").run(notification, id);
}

/** True when a reference is already used. False if the database can't
    be read, so the form still works without it. */
export function referenceTaken(reference: string): boolean {
  try {
    return Boolean(getDb().prepare("SELECT 1 FROM applications WHERE reference = ?").get(reference));
  } catch {
    return false;
  }
}

/** The resume file's absolute path, or null. Only names created by
    saveApplication are accepted, so a stored value can never point
    anywhere else on disk. */
export function resumeFile(row: Pick<ApplicationRow, "id" | "resume_path">): string | null {
  if (!row.resume_path || !new RegExp(`^${row.id}-[0-9a-f]{24}\\.(pdf|docx?|rtf|txt|bin)$`).test(row.resume_path)) return null;
  return dataPath("applications", row.resume_path);
}

/* ── Admin queries ─────────────────────────────────────────── */

export type ApplicationFilters = {
  q?: string;
  status?: string;
  job?: string;
  lookingFor?: string;
  from?: string;
  to?: string;
};

function whereFor(f: ApplicationFilters) {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (f.q) {
    const like = `%${f.q.replace(/[%_]/g, "")}%`;
    where.push(
      "(a.name LIKE ? OR a.email LIKE ? OR a.phone LIKE ? OR a.work LIKE ? OR a.location LIKE ? OR a.reference LIKE ? OR a.job_title LIKE ?)",
    );
    args.push(like, like, like, like, like, like, like);
  }
  if (f.status && STATUSES.some((s) => s.id === f.status)) {
    where.push("a.status = ?");
    args.push(f.status);
  }
  if (f.job === "none") where.push("a.job_id IS NULL AND a.job_title = ''");
  else if (f.job && /^\d+$/.test(f.job)) {
    where.push("a.job_id = ?");
    args.push(Number(f.job));
  }
  if (f.lookingFor && CANDIDATE_LOOKING_FOR.some((o) => o.id === f.lookingFor)) {
    where.push("a.looking_for = ?");
    args.push(f.lookingFor);
  }
  if (f.from && /^\d{4}-\d{2}-\d{2}$/.test(f.from)) {
    where.push("a.created_at >= ?");
    args.push(`${f.from}T00:00:00.000Z`);
  }
  if (f.to && /^\d{4}-\d{2}-\d{2}$/.test(f.to)) {
    where.push("a.created_at <= ?");
    args.push(`${f.to}T23:59:59.999Z`);
  }
  return { clause: where.length ? `WHERE ${where.join(" AND ")}` : "", args };
}

export const APP_PAGE_SIZE = 25;

export function listApplications(f: ApplicationFilters, page: number) {
  const { clause, args } = whereFor(f);
  const db = getDb();
  const total = (db.prepare(`SELECT COUNT(*) AS n FROM applications a ${clause}`).get(...args) as { n: number }).n;
  const pages = Math.max(1, Math.ceil(total / APP_PAGE_SIZE));
  const p = Math.min(page, pages);
  const rows = db
    .prepare(`SELECT a.* FROM applications a ${clause} ORDER BY a.created_at DESC, a.id DESC LIMIT ? OFFSET ?`)
    .all(...args, APP_PAGE_SIZE, (p - 1) * APP_PAGE_SIZE) as ApplicationRow[];
  return { rows, total, pages, page: p };
}

/** Every matching row, for the CSV export. */
export function exportApplications(f: ApplicationFilters): ApplicationRow[] {
  const { clause, args } = whereFor(f);
  return getDb()
    .prepare(`SELECT a.* FROM applications a ${clause} ORDER BY a.created_at DESC, a.id DESC`)
    .all(...args) as ApplicationRow[];
}

export function getApplication(id: number): ApplicationRow | null {
  return (getDb().prepare("SELECT * FROM applications WHERE id = ?").get(id) as ApplicationRow | undefined) ?? null;
}

export function updateApplication(id: number, status: Status, notes: string) {
  getDb()
    .prepare("UPDATE applications SET status = ?, internal_notes = ?, updated_at = ? WHERE id = ?")
    .run(status, notes, now(), id);
}

export async function deleteApplication(id: number) {
  const row = getApplication(id);
  if (!row) return;
  const file = resumeFile(row);
  if (file) await fs.rm(file, { force: true });
  getDb().prepare("DELETE FROM applications WHERE id = ?").run(id);
}

export function jobsWithApplications() {
  return getDb()
    .prepare(
      `SELECT j.id, j.title, COUNT(a.id) AS n FROM jobs j JOIN applications a ON a.job_id = j.id
       GROUP BY j.id ORDER BY j.title`,
    )
    .all() as { id: number; title: string; n: number }[];
}

/* ── Import of submissions held during the email pause ───────── */

type Held = {
  reference: string;
  received: string;
  email: { replyTo: string; text: string; attachments?: { filename: string; content: string }[] };
};

/** Reads a labelled value ("Full Name:   Priya") from the held email
    text, which lib/../app/actions/candidate.ts wrote in a fixed format. */
function field(text: string, label: string): string {
  const m = text.match(new RegExp(`^${label}:[ \\t]*(.*)$`, "m"));
  const v = m?.[1]?.trim() ?? "";
  return v === "Not provided" ? "" : v;
}

function message(text: string): string {
  const m = text.match(/^Additional Message:\n((?:  .*\n?)*)/m);
  if (m) return m[1]!.split("\n").map((l) => l.replace(/^  /, "")).join("\n").trim();
  const inline = field(text, "Additional Message");
  return inline;
}

let importedThisProcess = false;

/** Imports held submissions not yet in the table. Safe to call often:
    references already present are skipped, and the files are left in
    place. Returns how many were imported. */
export async function importHeldSubmissions(force = false): Promise<number> {
  if (importedThisProcess && !force) return 0;
  importedThisProcess = true;
  const dir = process.env.CANDIDATE_HOLD_DIR?.trim() || path.resolve(process.cwd(), "..", "held-candidates");
  let names: string[];
  try {
    names = (await fs.readdir(dir)).filter((n) => n.endsWith(".json"));
  } catch {
    return 0;
  }
  const db = getDb();
  let count = 0;
  for (const name of names) {
    try {
      const held = JSON.parse(await fs.readFile(path.join(dir, name), "utf8")) as Held;
      if (!held.reference || db.prepare("SELECT 1 FROM applications WHERE reference = ?").get(held.reference)) continue;
      const text = held.email.text ?? "";
      const lookingLabel = field(text, "Looking For");
      const attachment = held.email.attachments?.[0];
      const jobTitle = field(text, "Applied For");
      const job = jobTitle
        ? ((db.prepare("SELECT id, title FROM jobs WHERE title = ?").get(jobTitle) as { id: number; title: string } | undefined) ?? { id: 0, title: jobTitle })
        : null;
      await saveApplication({
        reference: held.reference,
        name: field(text, "Full Name"),
        email: field(text, "Email") || held.email.replyTo,
        phone: field(text, "Phone"),
        lookingFor: CANDIDATE_LOOKING_FOR.find((o) => o.label === lookingLabel)?.id ?? "",
        work: field(text, "Kind of Work"),
        location: field(text, "Location"),
        message: message(text),
        job: job && job.id ? job : null,
        resume: attachment
          ? { bytes: Buffer.from(attachment.content, "base64"), filename: attachment.filename, type: "" }
          : null,
        screening: field(text, "Screening"),
        notification: "paused",
        source: "held",
        createdAt: held.received,
      });
      if (job && !job.id) db.prepare("UPDATE applications SET job_title = ? WHERE reference = ?").run(job.title, held.reference);
      count++;
    } catch (err) {
      console.error(`[applications] could not import ${name}:`, err instanceof Error ? err.message : "unknown error");
    }
  }
  return count;
}

/** How many applications are in each status, for the list's tabs and
    the dashboard. */
export function statusCounts(): Record<Status | "all", number> {
  const counts = { all: 0, new: 0, reviewed: 0, shortlisted: 0, interview: 0, rejected: 0 };
  for (const r of getDb().prepare("SELECT status, COUNT(*) AS n FROM applications GROUP BY status").all() as { status: Status; n: number }[]) {
    counts[r.status] = r.n;
    counts.all += r.n;
  }
  return counts;
}
