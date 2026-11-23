import { Download } from "lucide-react";
import { requirePage } from "@/lib/admin/auth";
import { listSubscribers, subscriberCounts } from "@/lib/subscribers";
import { deleteSubscriber } from "@/app/admin/actions/subscribers";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import {
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
import { NEWSLETTER } from "@/config/resources";

export const metadata = { title: "Newsletter Subscribers" };

type Search = Promise<{ q?: string; page?: string; removed?: string }>;

export default async function SubscribersPage({ searchParams }: { searchParams: Search }) {
  await requirePage("subscribers");
  const sp = await searchParams;
  const q = (sp.q ?? "").slice(0, 100);
  const { rows, total, pages, page } = listSubscribers(q, pageNumber(sp.page));
  const counts = subscriberCounts();

  return (
    <>
      <PageHeader
        title="Newsletter Subscribers"
        description={`Everyone who signed up for ${NEWSLETTER.name} on the site: ${counts.total} in total, ${counts.lastWeek} in the last 7 days. Signups are listed here only; nobody is emailed about them.`}
        actions={
          <a href={`/api/admin/subscribers/export${q ? `?q=${encodeURIComponent(q)}` : ""}`} className={buttonClass.secondary}>
            <Download className="size-4" aria-hidden="true" /> Export CSV{q ? " (filtered)" : ""}
          </a>
        }
      />
      {sp.removed ? (
        <p role="status" className="mb-4 rounded-md bg-[#eefaf2] px-4 py-3 text-sm text-[#1d6b3f]">Removed from the list.</p>
      ) : null}

      <FilterBar action="/admin/subscribers">
        <FilterField label="Search">
          <input name="q" defaultValue={q} placeholder="Email address" className={inputClass} />
        </FilterField>
      </FilterBar>

      {rows.length === 0 ? (
        <Empty>{q ? "No subscribers match that search." : "No subscribers yet. Signups from the newsletter forms on the site appear here."}</Empty>
      ) : (
        <Table head={["Email", "Signed up on", "Date", ""]}>
          {rows.map((s) => (
            <tr key={s.id}>
              <td className="px-4 py-3 break-all text-ink">{s.email}</td>
              <td className="px-4 py-3 text-sm text-n-500">{s.source === "/" ? "Home page" : s.source || "Not recorded"}</td>
              <td className="px-4 py-3 text-sm whitespace-nowrap text-n-500">{formatWhen(s.created_at)}</td>
              <td className="px-4 py-3 text-right">
                <form action={deleteSubscriber}>
                  <input type="hidden" name="recordId" value={s.id} />
                  <ConfirmButton message={`Remove ${s.email} from the list?`} className={buttonClass.link}>
                    Remove
                  </ConfirmButton>
                </form>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination page={page} pages={pages} total={total} base="/admin/subscribers" params={{ q }} />
    </>
  );
}
