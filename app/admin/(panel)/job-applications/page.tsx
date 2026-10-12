import Link from "next/link";
import { Download, Paperclip } from "lucide-react";
import { requirePage } from "@/lib/admin/auth";
import {
  STATUSES,
  importHeldSubmissions,
  jobsWithApplications,
  listApplications,
  lookingForLabel,
  statusCounts,
  type ApplicationFilters,
} from "@/lib/applications";
import { CANDIDATE_LOOKING_FOR } from "@/lib/validation/candidate";
import {
  Badge,
  Empty,
  FilterBar,
  FilterField,
  PageHeader,
  Pagination,
  Table,
  buttonClass,
  formatWhen,
  inputClass,
  pageNumber,
} from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const metadata = { title: "Applications" };

type Search = Promise<Record<string, string | undefined>>;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export default async function ApplicationsPage({ searchParams }: { searchParams: Search }) {
  await requirePage("job-applications");
  /* Anything held while recruiter emails were paused, before this
     table existed, is brought in once (by reference, never twice). */
  await importHeldSubmissions();

  const sp = await searchParams;
  const filters: ApplicationFilters = {
    q: (sp.q ?? "").slice(0, 100),
    status: sp.status,
    job: sp.job,
    lookingFor: sp.lookingFor,
    from: sp.from && DATE.test(sp.from) ? sp.from : undefined,
    to: sp.to && DATE.test(sp.to) ? sp.to : undefined,
  };
  const { rows, total, pages, page } = listApplications(filters, pageNumber(sp.page));
  const counts = statusCounts();
  const jobs = jobsWithApplications();
  const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) as Record<string, string>;
  const query = (extra: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, ...extra })) if (v) q.set(k, v);
    const s = q.toString();
    return s ? `?${s}` : "";
  };
  const filtered = Object.keys(params).length > 0;

  return (
    <>
      <PageHeader
        title="Applications"
        description="Every job seeker who submits the form on the Candidates page or applies to a job. Personal details: handle with care, and export only what you need."
        actions={
          <a href={`/api/admin/job-applications/export${query({})}`} className={buttonClass.secondary}>
            <Download className="size-4" aria-hidden="true" /> Export CSV{filtered ? " (filtered)" : ""}
          </a>
        }
      />
      {sp.deleted ? (
        <p role="status" className="mb-4 rounded-md bg-[#eefaf2] px-4 py-3 text-sm text-[#1d6b3f]">
          Application and resume deleted.
        </p>
      ) : null}

      <nav aria-label="Status" className="mb-5 flex flex-wrap gap-2">
        {[{ id: "", label: "All" }, ...STATUSES].map((s) => {
          const active = (filters.status ?? "") === s.id;
          return (
            <Link
              key={s.id || "all"}
              href={`/admin/job-applications${query({ status: s.id || undefined, page: undefined })}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                active ? "border-ink bg-ink text-white" : "border-n-300 bg-white text-n-600 hover:border-ink",
              )}
            >
              {s.label} <span className={active ? "text-white/70" : "text-n-400"}>{counts[(s.id || "all") as keyof typeof counts]}</span>
            </Link>
          );
        })}
      </nav>

      <FilterBar action="/admin/job-applications">
        {filters.status ? <input type="hidden" name="status" value={filters.status} /> : null}
        <FilterField label="Search">
          <input name="q" defaultValue={filters.q} placeholder="Name, email, phone, reference…" className={inputClass} />
        </FilterField>
        <FilterField label="Job">
          <select name="job" defaultValue={filters.job ?? ""} className={inputClass}>
            <option value="">Any</option>
            <option value="none">General (no specific job)</option>
            {jobs.map((j) => (
              <option key={j.id} value={String(j.id)}>
                {j.title} ({j.n})
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Looking for">
          <select name="lookingFor" defaultValue={filters.lookingFor ?? ""} className={inputClass}>
            <option value="">Any</option>
            {CANDIDATE_LOOKING_FOR.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="From">
          <input type="date" name="from" defaultValue={filters.from} className={inputClass} />
        </FilterField>
        <FilterField label="To">
          <input type="date" name="to" defaultValue={filters.to} className={inputClass} />
        </FilterField>
      </FilterBar>

      {rows.length === 0 ? (
        <Empty>{filtered ? "No applications match those filters." : "No applications yet. They appear here as soon as someone submits the form."}</Empty>
      ) : (
        <Table head={["Candidate", "Applied for", "Location", "Resume", "Status", "Received"]}>
          {rows.map((a) => (
            <tr key={a.id} className="align-top">
              <td className="px-4 py-3">
                <Link href={`/admin/job-applications/${a.id}`} className="font-semibold text-ink hover:text-accent">
                  {a.name || "Name not provided"}
                </Link>
                <p className="text-sm break-all text-n-500">{a.email}</p>
              </td>
              <td className="px-4 py-3 text-sm">
                {a.job_title ? <span className="text-ink">{a.job_title}</span> : <span className="text-n-500">General</span>}
                <p className="text-n-500">{a.work}{a.looking_for ? ` · ${lookingForLabel(a.looking_for)}` : ""}</p>
              </td>
              <td className="px-4 py-3 text-sm">{a.location}</td>
              <td className="px-4 py-3 text-sm">
                {a.resume_path ? (
                  <span className="inline-flex items-center gap-1 text-ink" title={a.resume_filename ?? undefined}>
                    <Paperclip className="size-4" aria-hidden="true" /> Yes
                  </span>
                ) : (
                  <span className="text-n-500">None</span>
                )}
              </td>
              <td className="px-4 py-3">
                <Badge tone={a.status}>{STATUSES.find((s) => s.id === a.status)?.label ?? a.status}</Badge>
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap text-n-500">
                {formatWhen(a.created_at)}
                <p className="font-mono text-xs">{a.reference}</p>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination page={page} pages={pages} total={total} base="/admin/job-applications" params={params} />
    </>
  );
}
