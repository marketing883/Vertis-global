import "server-only";
import { getDb } from "@/lib/db";
import type { Job, JobType } from "@/config/jobs";
import { JOB_APPLICATIONS_INBOX } from "@/config/site";

/* Public reads of the jobs table. Only published rows ever leave this
   file; drafts are visible in the admin only (lib/admin/jobs.ts). */

export const ARRANGEMENTS = [
  { id: "onsite", label: "On site" },
  { id: "hybrid", label: "Hybrid" },
  { id: "remote", label: "Remote" },
] as const;
export type Arrangement = (typeof ARRANGEMENTS)[number]["id"];

export type JobRow = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  skills: string;
  industry: string;
  location: string;
  employment_type: JobType;
  level: string;
  arrangement: Arrangement;
  schedule: string;
  status: "draft" | "published";
  is_sample: number;
  /** Last day applications are taken (YYYY-MM-DD, US Central), or null. */
  deadline: string | null;
  /** Comma separated; empty means JOB_APPLICATIONS_INBOX. */
  notify_emails: string;
  posted_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Today's date in US Central (the Dallas office), YYYY-MM-DD. */
export function centralToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date());
}

/** A deadline is inclusive: the job closes once that day has ended in
    US Central. */
export function isClosed(row: Pick<JobRow, "deadline">): boolean {
  return Boolean(row.deadline) && row.deadline! < centralToday();
}

/** Who is emailed an application to this job. */
export function applicationRecipients(row: Pick<JobRow, "notify_emails">): string[] {
  const own = row.notify_emails
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return own.length ? own : [JOB_APPLICATIONS_INBOX];
}

/** "Oct 30, 2026" for a YYYY-MM-DD date, without shifting the day. */
export function formatDeadline(day: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" }).format(
    new Date(`${day}T12:00:00Z`),
  );
}

/* Published and still open: what the public listings show. */
const OPEN = "status = 'published' AND (deadline IS NULL OR deadline = '' OR deadline >= ?)";

/** "On site, nights": the arrangement label plus any schedule note. */
export function arrangementText(row: Pick<JobRow, "arrangement" | "schedule">): string {
  const label = ARRANGEMENTS.find((a) => a.id === row.arrangement)?.label ?? row.arrangement;
  return row.schedule ? `${label}, ${row.schedule}` : label;
}

/** The shape every existing public component already renders. */
export function toPublicJob(row: JobRow): Job {
  return {
    id: row.slug,
    title: row.title,
    industry: row.industry,
    level: row.level,
    type: row.employment_type,
    location: row.location,
    arrangement: arrangementText(row),
    posted: (row.posted_at ?? row.created_at).slice(0, 10),
    summary: row.summary || firstSentence(row.description),
    sample: row.is_sample === 1,
  };
}

function firstSentence(text: string): string {
  const t = text.replace(/\s+/g, " ").trim();
  const m = t.match(/^(.{20,220}?[.!?])(\s|$)/);
  return m ? m[1]! : t.slice(0, 200);
}

/** Every published job still taking applications, newest first. */
export function getJobs(): Job[] {
  const rows = getDb()
    .prepare(`SELECT * FROM jobs WHERE ${OPEN} ORDER BY posted_at DESC, id DESC`)
    .all(centralToday()) as JobRow[];
  return rows.map(toPublicJob);
}

/** One published job, in full, for its own page. Includes jobs past
    their deadline, so a shared link says "closed" rather than 404. */
export function getPublishedJob(slug: string): JobRow | null {
  return (
    (getDb()
      .prepare("SELECT * FROM jobs WHERE slug = ? AND status = 'published'")
      .get(slug) as JobRow | undefined) ?? null
  );
}

/** True when any published job is a representative sample rather than
    a live vacancy, so the jobs page keeps its honest notice. */
export function anySampleJobs(): boolean {
  return Boolean(
    getDb().prepare(`SELECT 1 FROM jobs WHERE ${OPEN} AND is_sample = 1 LIMIT 1`).get(centralToday()),
  );
}

/** Multi-line admin text ("one per line", or "- item") as a list. */
export function lines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean);
}
