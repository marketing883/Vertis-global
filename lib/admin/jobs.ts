import "server-only";
import { z } from "zod";
import { getDb, now } from "@/lib/db";
import { JOB_TYPES, type JobType } from "@/config/jobs";
import { ALL_INDUSTRIES, TALENT_LEVELS } from "@/config/industries";
import { ARRANGEMENTS, type JobRow } from "@/lib/data/jobs";
import { cleanText } from "@/lib/validation/candidate";
import { slugify } from "@/lib/admin/slug";

/* Admin reads and writes for jobs. Every value is cleaned (control
   and invisible characters removed) and validated against the real
   option lists before it reaches the database; the public pages then
   render it as text, never as HTML. */

const ids = <T extends string>(list: readonly { id: T }[]) => list.map((x) => x.id) as [T, ...T[]];
const industrySlugs = ALL_INDUSTRIES.map((i) => i.slug) as [string, ...string[]];

const EMAIL = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[a-z]{2,}$/i;

/** "a@x.com; B@y.com" → "a@x.com, b@y.com": trimmed, lowercased, no
    duplicates, every one a plausible address, at most ten. */
const notifyEmails = z
  .string()
  .max(1000, "That list is too long.")
  .default("")
  .transform((value, ctx) => {
    const list = [...new Set(value.split(/[,;\s]+/).map((s) => s.trim().toLowerCase()).filter(Boolean))];
    const bad = list.find((e) => !EMAIL.test(e) || e.length > 254);
    if (bad) {
      ctx.addIssue({ code: "custom", message: `"${bad.slice(0, 60)}" isn't a valid email address.` });
      return z.NEVER;
    }
    if (list.length > 10) {
      ctx.addIssue({ code: "custom", message: "Ten addresses at most." });
      return z.NEVER;
    }
    return list.join(", ");
  });

const deadline = z
  .string()
  .default("")
  .refine((v) => v === "" || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T12:00:00Z`))), "Use a date.")
  .transform((v) => v || null);

export const jobSchema = z.object({
  title: z.string().min(3, "Give the job a title.").max(120, "Keep the title under 120 characters."),
  summary: z.string().max(300, "Keep the summary under 300 characters.").default(""),
  description: z.string().max(10000, "That description is too long.").default(""),
  responsibilities: z.string().max(5000).default(""),
  qualifications: z.string().max(5000).default(""),
  skills: z.string().max(1000).default(""),
  industry: z.enum(industrySlugs, { error: "Choose an industry." }),
  location: z.string().min(2, "Where is the job?").max(120),
  employment_type: z.enum(ids(JOB_TYPES), { error: "Choose an employment type." }),
  level: z.enum(TALENT_LEVELS.map((l) => l.id) as [string, ...string[]], { error: "Choose a level." }),
  arrangement: z.enum(ids(ARRANGEMENTS), { error: "Choose on site, hybrid or remote." }),
  schedule: z.string().max(60, "Keep the schedule note short.").default(""),
  deadline,
  notify_emails: notifyEmails,
});
export type JobInput = z.infer<typeof jobSchema>;

const MULTILINE = new Set(["description", "responsibilities", "qualifications", "skills"]);

export function parseJobForm(formData: FormData) {
  const raw: Record<string, string> = {};
  for (const key of Object.keys(jobSchema.shape)) {
    raw[key] = cleanText(formData.get(key), MULTILINE.has(key));
  }
  return { raw, parsed: jobSchema.safeParse(raw) };
}

export type JobListFilters = { q?: string; status?: string; industry?: string; page: number };
export const PAGE_SIZE = 20;

export function listJobs(f: JobListFilters) {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (f.q) {
    where.push("(title LIKE ? OR location LIKE ? OR slug LIKE ?)");
    const like = `%${f.q.replace(/[%_]/g, "")}%`;
    args.push(like, like, like);
  }
  if (f.status === "draft" || f.status === "published") {
    where.push("status = ?");
    args.push(f.status);
  }
  if (f.industry && industrySlugs.includes(f.industry)) {
    where.push("industry = ?");
    args.push(f.industry);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const db = getDb();
  const total = (db.prepare(`SELECT COUNT(*) AS n FROM jobs ${clause}`).get(...args) as { n: number }).n;
  const rows = db
    .prepare(
      `SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS applications
       FROM jobs j ${clause} ORDER BY j.updated_at DESC, j.id DESC LIMIT ? OFFSET ?`,
    )
    .all(...args, PAGE_SIZE, (f.page - 1) * PAGE_SIZE) as (JobRow & { applications: number })[];
  return { rows, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export function getJob(id: number): JobRow | null {
  return (getDb().prepare("SELECT * FROM jobs WHERE id = ?").get(id) as JobRow | undefined) ?? null;
}

function uniqueSlug(title: string, exceptId?: number): string {
  const base = slugify(title) || "job";
  const db = getDb();
  let slug = base;
  for (let i = 2; db.prepare("SELECT 1 FROM jobs WHERE slug = ? AND id IS NOT ?").get(slug, exceptId ?? null); i++) {
    slug = `${base}-${i}`;
  }
  return slug;
}

export function createJob(input: JobInput, status: "draft" | "published"): number {
  const t = now();
  const info = getDb()
    .prepare(
      `INSERT INTO jobs (slug, title, summary, description, responsibilities, qualifications, skills,
        industry, location, employment_type, level, arrangement, schedule, deadline, notify_emails,
        status, posted_at, created_at, updated_at)
       VALUES (@slug, @title, @summary, @description, @responsibilities, @qualifications, @skills,
        @industry, @location, @employment_type, @level, @arrangement, @schedule, @deadline, @notify_emails,
        @status, @posted_at, @t, @t)`,
    )
    .run({ ...input, slug: uniqueSlug(input.title), status, posted_at: status === "published" ? t : null, t });
  return Number(info.lastInsertRowid);
}

/** Updates the fields. The slug (the public URL) is kept once a job has
    been published, so links already shared keep working. */
export function updateJob(id: number, input: JobInput, isSample: boolean) {
  const existing = getJob(id);
  if (!existing) return false;
  const slug = existing.posted_at ? existing.slug : uniqueSlug(input.title, id);
  getDb()
    .prepare(
      `UPDATE jobs SET slug=@slug, title=@title, summary=@summary, description=@description,
        responsibilities=@responsibilities, qualifications=@qualifications, skills=@skills, industry=@industry,
        location=@location, employment_type=@employment_type, level=@level, arrangement=@arrangement,
        schedule=@schedule, deadline=@deadline, notify_emails=@notify_emails, is_sample=@is_sample,
        updated_at=@t WHERE id=@id`,
    )
    .run({ ...input, slug, id, is_sample: isSample && existing.is_sample === 1 ? 1 : 0, t: now() });
  return true;
}

export function setJobStatus(id: number, status: "draft" | "published") {
  getDb()
    .prepare(
      `UPDATE jobs SET status = ?, posted_at = CASE WHEN ? = 'published' AND posted_at IS NULL THEN ? ELSE posted_at END,
       updated_at = ? WHERE id = ?`,
    )
    .run(status, status, now(), now(), id);
}

/** Deletes the job. Applications to it are kept, with the job's title
    (job_title) preserved and the link (job_id) cleared. */
export function deleteJob(id: number) {
  getDb().prepare("DELETE FROM jobs WHERE id = ?").run(id);
}

export type { JobType };
