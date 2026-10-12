import Link from "next/link";
import { ArrowRight, BellOff, Briefcase, Plus, UserCheck } from "lucide-react";
import { canAccess, requirePage } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";
import { CONTENT_TYPES } from "@/lib/content-types";
import { contentCounts } from "@/lib/admin/content";
import { STATUSES, importHeldSubmissions, listApplications, statusCounts } from "@/lib/applications";
import { candidateNotificationsOn } from "@/lib/candidate-delivery";
import { Badge, Card, PageHeader, buttonClass, formatWhen } from "@/components/admin/ui";

export const metadata = { title: "Dashboard" };

function Stat({ label, value, href, note }: { label: string; value: number; href: string; note?: string }) {
  return (
    <Link href={href} className="group rounded-lg border border-n-200 bg-white p-5 transition-colors hover:border-ink">
      <p className="text-xs font-semibold tracking-wide text-n-500 uppercase">{label}</p>
      <p className="mt-2 font-display text-[2rem] leading-none font-bold text-ink">{value}</p>
      {note ? <p className="mt-2 text-sm text-n-500">{note}</p> : null}
    </Link>
  );
}

export default async function DashboardPage() {
  const user = await requirePage("");
  await importHeldSubmissions();
  const db = getDb();
  const counts = statusCounts();
  const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
  const lastWeek = (db.prepare("SELECT COUNT(*) AS n FROM applications WHERE created_at >= ?").get(weekAgo) as { n: number }).n;
  const jobs = Object.fromEntries(
    (db.prepare("SELECT status, COUNT(*) AS n FROM jobs GROUP BY status").all() as { status: string; n: number }[]).map((r) => [r.status, r.n]),
  ) as Record<string, number>;
  const recent = listApplications({}, 1).rows.slice(0, 6);
  const showContent = canAccess(user.role, "blog");
  const content = showContent ? contentCounts() : [];
  const count = (type: string, status: string) => content.find((c) => c.type === type && c.status === status)?.n ?? 0;

  return (
    <>
      <PageHeader
        title={`Hello, ${user.name.split(" ")[0]}`}
        description="What's new on vertisglobal.com."
        actions={
          <>
            <Link href="/admin/jobs/new" className={buttonClass.primary}>
              <Plus className="size-4" aria-hidden="true" /> New job
            </Link>
            <Link href="/admin/job-applications?status=new" className={buttonClass.secondary}>
              <UserCheck className="size-4" aria-hidden="true" /> Review new applications
            </Link>
          </>
        }
      />

      {!candidateNotificationsOn() ? (
        <p className="mb-6 flex gap-3 rounded-lg border border-[#f3d9a4] bg-[#fff8e8] px-4 py-3 text-sm text-n-600">
          <BellOff className="mt-0.5 size-4 shrink-0 text-[#9a6b00]" aria-hidden="true" />
          <span>
            Recruiter emails for general resume submissions are paused; they are saved here only. Applications to a
            specific job are emailed to that job&apos;s notification addresses.
          </span>
        </p>
      ) : null}

      <section aria-labelledby="hiring">
        <h2 id="hiring" className="mb-3 text-sm font-semibold tracking-wide text-n-500 uppercase">Hiring</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="New applications" value={counts.new} href="/admin/job-applications?status=new" note="Waiting for review" />
          <Stat label="Last 7 days" value={lastWeek} href="/admin/job-applications" note={`${counts.all} in total`} />
          <Stat label="In interview" value={counts.interview} href="/admin/job-applications?status=interview" note={`${counts.shortlisted} shortlisted`} />
          <Stat label="Live jobs" value={jobs.published ?? 0} href="/admin/jobs?status=published" note={`${jobs.draft ?? 0} drafts`} />
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <div className="flex items-center justify-between border-b border-n-200 px-5 py-4">
            <h2 className="text-lg font-bold text-ink">Latest applications</h2>
            <Link href="/admin/job-applications" className={buttonClass.link}>
              All applications <ArrowRight className="inline size-4" aria-hidden="true" />
            </Link>
          </div>
          {recent.length ? (
            <ul className="divide-y divide-n-200">
              {recent.map((a) => (
                <li key={a.id}>
                  <Link href={`/admin/job-applications/${a.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 hover:bg-paper">
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">{a.name || "Name not provided"}</span>
                      <span className="block truncate text-sm text-n-500">{a.job_title || a.work}</span>
                    </span>
                    <span className="flex items-center gap-3 text-sm text-n-500">
                      <Badge tone={a.status}>{STATUSES.find((s) => s.id === a.status)?.label}</Badge>
                      {formatWhen(a.created_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-10 text-center text-n-500">No applications yet.</p>
          )}
        </Card>

        {showContent ? (
          <Card>
            <h2 className="border-b border-n-200 px-5 py-4 text-lg font-bold text-ink">Content</h2>
            <ul className="divide-y divide-n-200">
              {CONTENT_TYPES.map((t) => (
                <li key={t.id}>
                  <Link href={`/admin/${t.section}`} className="flex items-center justify-between px-5 py-3 hover:bg-paper">
                    <span className="text-ink">{t.label}</span>
                    <span className="text-sm text-n-500">
                      {count(t.id, "published")} live{count(t.id, "draft") ? ` · ${count(t.id, "draft")} draft` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card className="p-5">
            <Briefcase className="size-5 text-accent" aria-hidden="true" />
            <p className="mt-3 text-sm text-n-500">
              You manage jobs and applications. Ask an administrator if you need to edit site content.
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
