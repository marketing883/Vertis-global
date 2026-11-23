import Link from "next/link";
import { Download } from "lucide-react";
import { requirePage } from "@/lib/admin/auth";
import { ENQUIRY_STATUSES, enquiryCounts, listEnquiries, type EnquiryFilters } from "@/lib/enquiries";
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

export const metadata = { title: "Enquiries" };

type Search = Promise<{ q?: string; status?: string; page?: string; deleted?: string }>;

export default async function EnquiriesPage({ searchParams }: { searchParams: Search }) {
  await requirePage("enquiries");
  const sp = await searchParams;
  const filters: EnquiryFilters = { q: (sp.q ?? "").slice(0, 100), status: sp.status };
  const { rows, total, pages, page } = listEnquiries(filters, pageNumber(sp.page));
  const counts = enquiryCounts();
  const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) as Record<string, string>;
  const query = (extra: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, ...extra })) if (v) q.set(k, v);
    const s = q.toString();
    return s ? `?${s}` : "";
  };

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Employers who used the Hire Talent form. Nobody is emailed about these: check here for new ones, mark them Contacted once someone has replied, and Closed when done."
        actions={
          <a href={`/api/admin/enquiries/export${query({})}`} className={buttonClass.secondary}>
            <Download className="size-4" aria-hidden="true" /> Export CSV{Object.keys(params).length ? " (filtered)" : ""}
          </a>
        }
      />
      {sp.deleted ? <p role="status" className="mb-4 rounded-md bg-[#eefaf2] px-4 py-3 text-sm text-[#1d6b3f]">Enquiry deleted.</p> : null}

      <nav aria-label="Status" className="mb-5 flex flex-wrap gap-2">
        {[{ id: "", label: "All" }, ...ENQUIRY_STATUSES].map((s) => {
          const active = (filters.status ?? "") === s.id;
          return (
            <Link
              key={s.id || "all"}
              href={`/admin/enquiries${query({ status: s.id || undefined, page: undefined })}`}
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

      <FilterBar action="/admin/enquiries">
        {filters.status ? <input type="hidden" name="status" value={filters.status} /> : null}
        <FilterField label="Search">
          <input name="q" defaultValue={filters.q} placeholder="Name, company, email, role…" className={inputClass} />
        </FilterField>
      </FilterBar>

      {rows.length === 0 ? (
        <Empty>{Object.keys(params).length ? "No enquiries match those filters." : "No enquiries yet. They appear here as soon as an employer submits the Hire Talent form."}</Empty>
      ) : (
        <Table head={["Company", "Looking for", "Where", "Status", "Received"]}>
          {rows.map((e) => (
            <tr key={e.id} className="align-top">
              <td className="px-4 py-3">
                <Link href={`/admin/enquiries/${e.id}`} className="font-semibold text-ink hover:text-accent">{e.company}</Link>
                <p className="text-sm break-all text-n-500">{e.name} · {e.email}</p>
              </td>
              <td className="px-4 py-3 text-sm">
                {e.talent}
                <p className="text-n-500">{e.positions} {e.positions === "1" ? "person" : "people"}{e.service ? ` · ${e.service}` : ""}</p>
              </td>
              <td className="px-4 py-3 text-sm">{e.location}</td>
              <td className="px-4 py-3">
                <Badge tone={e.status === "new" ? "new" : e.status === "contacted" ? "shortlisted" : "draft"}>
                  {ENQUIRY_STATUSES.find((s) => s.id === e.status)?.label}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap text-n-500">
                {formatWhen(e.created_at)}
                <p className="font-mono text-xs">{e.reference}</p>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination page={page} pages={pages} total={total} base="/admin/enquiries" params={params} />
    </>
  );
}
