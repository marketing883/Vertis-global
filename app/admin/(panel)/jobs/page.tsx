import Link from "next/link";
import { ExternalLink, Eye, Plus } from "lucide-react";
import { requirePage } from "@/lib/admin/auth";
import { listJobs } from "@/lib/admin/jobs";
import { JOB_OPTIONS, industryName } from "@/lib/admin/options";
import { jobTypeLabel } from "@/config/jobs";
import { arrangementText, formatDeadline, isClosed } from "@/lib/data/jobs";
import { changeJobStatus } from "@/app/admin/actions/jobs";
import {
  Badge,
  Empty,
  FilterBar,
  FilterField,
  PageHeader,
  Pagination,
  Table,
  buttonClass,
  formatDay,
  inputClass,
  pageNumber,
} from "@/components/admin/ui";

export const metadata = { title: "Job Listings" };

type Search = Promise<{ q?: string; status?: string; industry?: string; page?: string; deleted?: string }>;

export default async function JobsAdminPage({ searchParams }: { searchParams: Search }) {
  await requirePage("jobs");
  const sp = await searchParams;
  const q = (sp.q ?? "").slice(0, 100);
  const { rows, total, pages } = listJobs({ q, status: sp.status, industry: sp.industry, page: pageNumber(sp.page) });
  const page = Math.min(pageNumber(sp.page), pages);

  return (
    <>
      <PageHeader
        title="Job Listings"
        description="Published jobs appear on the Jobs page, the home page, their industry page and in Google's sitemap. Drafts are visible here only."
        actions={
          <Link href="/admin/jobs/new" className={buttonClass.primary}>
            <Plus className="size-4" aria-hidden="true" /> New job
          </Link>
        }
      />
      {sp.deleted ? <p role="status" className="mb-4 rounded-md bg-[#eefaf2] px-4 py-3 text-sm text-[#1d6b3f]">Job deleted.</p> : null}

      <FilterBar action="/admin/jobs">
        <FilterField label="Search">
          <input name="q" defaultValue={q} placeholder="Title, location…" className={inputClass} />
        </FilterField>
        <FilterField label="Status">
          <select name="status" defaultValue={sp.status ?? ""} className={inputClass}>
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </FilterField>
        <FilterField label="Industry">
          <select name="industry" defaultValue={sp.industry ?? ""} className={inputClass}>
            <option value="">All</option>
            {JOB_OPTIONS.industries.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </FilterField>
      </FilterBar>

      {rows.length === 0 ? (
        <Empty>{q || sp.status || sp.industry ? "No jobs match those filters." : "No jobs yet. Create the first one."}</Empty>
      ) : (
        <Table head={["Job", "Industry", "Type", "Status", "Applications", "Updated", ""]}>
          {rows.map((j) => (
            <tr key={j.id} className="align-top">
              <td className="px-4 py-3">
                <Link href={`/admin/jobs/${j.id}/edit`} className="font-semibold text-ink hover:text-accent">{j.title}</Link>
                <p className="text-sm text-n-500">{j.location} · {arrangementText(j)}</p>
                {j.deadline ? (
                  <p className="text-xs text-n-500">{isClosed(j) ? "Closed" : "Apply by"} {formatDeadline(j.deadline)}</p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-sm">{industryName(j.industry)}</td>
              <td className="px-4 py-3 text-sm">{jobTypeLabel(j.employment_type)}</td>
              <td className="px-4 py-3">
                <span className="flex flex-wrap gap-1.5">
                  <Badge tone={j.status}>{j.status === "published" ? "Published" : "Draft"}</Badge>
                  {j.is_sample ? <Badge tone="sample">Sample</Badge> : null}
                  {j.status === "published" && isClosed(j) ? <Badge tone="closed">Closed</Badge> : null}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                {j.applications ? (
                  <Link href={`/admin/job-applications?job=${j.id}`} className="text-accent hover:underline">{j.applications}</Link>
                ) : (
                  <span className="text-n-500">0</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap text-n-500">{formatDay(j.updated_at)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                  <Link href={`/admin/jobs/${j.id}/preview`} className={buttonClass.link} title="Preview">
                    <Eye className="inline size-4" aria-hidden="true" /> Preview
                  </Link>
                  {j.status === "published" ? (
                    <a href={`/jobs/${j.slug}`} target="_blank" rel="noopener" className={buttonClass.link} title="View on site">
                      <ExternalLink className="inline size-4" aria-hidden="true" /> Live
                    </a>
                  ) : null}
                  <form action={changeJobStatus}>
                    <input type="hidden" name="recordId" value={j.id} />
                    <input type="hidden" name="status" value={j.status === "published" ? "draft" : "published"} />
                    <input type="hidden" name="back" value={`/admin/jobs?${new URLSearchParams(Object.entries({ q, status: sp.status ?? "", industry: sp.industry ?? "", page: String(page) }).filter(([, v]) => v)).toString()}`} />
                    <button type="submit" className={buttonClass.link}>{j.status === "published" ? "Unpublish" : "Publish"}</button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination page={page} pages={pages} total={total} base="/admin/jobs" params={{ q, status: sp.status, industry: sp.industry }} />
    </>
  );
}
