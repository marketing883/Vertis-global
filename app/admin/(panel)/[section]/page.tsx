import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Eye, Plus } from "lucide-react";
import { requirePage } from "@/lib/admin/auth";
import { contentTypeBySection } from "@/lib/content-types";
import { listContent, publicUrl } from "@/lib/admin/content";
import { changeContentStatus } from "@/app/admin/actions/content";
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

type Props = {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ q?: string; status?: string; category?: string; page?: string; deleted?: string }>;
};

export async function generateMetadata({ params }: Props) {
  return { title: contentTypeBySection((await params).section)?.label ?? "Not found" };
}

const DESCRIPTION: Record<string, string> = {
  "case-study": "Published case studies appear at /case-studies. The page and its menu link stay hidden until the first one is published.",
  blog: "Blog posts appear on Insights (/insights), the home page and the service pages.",
  whitepaper: "Published whitepapers appear on /whitepapers and the home page resources. Without a PDF, visitors can request a copy by email.",
  webinar: "Published webinars appear at /webinars, with a registration link before the date and the recording after.",
  news: "Announcements and press appear at /news. Coverage elsewhere links out to the article.",
};

export default async function ContentListPage({ params, searchParams }: Props) {
  const { section } = await params;
  const type = contentTypeBySection(section);
  if (!type) notFound();
  await requirePage(section);
  const sp = await searchParams;
  const q = (sp.q ?? "").slice(0, 100);
  const { rows, total, pages, page } = listContent(type, { q, status: sp.status, category: sp.category, page: pageNumber(sp.page) });
  const back = `/admin/${section}?${new URLSearchParams(
    Object.entries({ q, status: sp.status ?? "", category: sp.category ?? "", page: String(page) }).filter(([, v]) => v),
  ).toString()}`;

  return (
    <>
      <PageHeader
        title={type.label}
        description={DESCRIPTION[type.id]}
        actions={
          <Link href={`/admin/${section}/new`} className={buttonClass.primary}>
            <Plus className="size-4" aria-hidden="true" /> New {type.singular.toLowerCase()}
          </Link>
        }
      />
      {sp.deleted ? <p role="status" className="mb-4 rounded-md bg-[#eefaf2] px-4 py-3 text-sm text-[#1d6b3f]">Deleted.</p> : null}

      <FilterBar action={`/admin/${section}`}>
        <FilterField label="Search">
          <input name="q" defaultValue={q} placeholder="Title, summary…" className={inputClass} />
        </FilterField>
        <FilterField label="Status">
          <select name="status" defaultValue={sp.status ?? ""} className={inputClass}>
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </FilterField>
        {type.categories ? (
          <FilterField label={type.categoryLabel ?? "Category"}>
            <select name="category" defaultValue={sp.category ?? ""} className={inputClass}>
              <option value="">All</option>
              {type.categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FilterField>
        ) : null}
      </FilterBar>

      {rows.length === 0 ? (
        <Empty>
          {q || sp.status || sp.category
            ? "Nothing matches those filters."
            : `No ${type.label.toLowerCase()} yet. Create the first one.`}
        </Empty>
      ) : (
        <Table head={["Title", ...(type.categories ? [type.categoryLabel ?? "Category"] : []), "Status", "Date shown", "Updated", ""]}>
          {rows.map((item) => (
            <tr key={item.id} className="align-top">
              <td className="px-4 py-3">
                <Link href={`/admin/${section}/${item.id}/edit`} className="font-semibold text-ink hover:text-accent">{item.title}</Link>
                <p className="line-clamp-1 max-w-[60ch] text-sm text-n-500">{item.excerpt}</p>
              </td>
              {type.categories ? <td className="px-4 py-3 text-sm">{item.category || <span className="text-n-500">None</span>}</td> : null}
              <td className="px-4 py-3">
                <Badge tone={item.status}>{item.status === "published" ? "Published" : "Draft"}</Badge>
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap text-n-500">{item.published_at ? formatDay(item.published_at) : "Not yet"}</td>
              <td className="px-4 py-3 text-sm whitespace-nowrap text-n-500">{formatDay(item.updated_at)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                  <Link href={`/admin/${section}/${item.id}/preview`} className={buttonClass.link}>
                    <Eye className="inline size-4" aria-hidden="true" /> Preview
                  </Link>
                  {item.status === "published" ? (
                    <a href={publicUrl(type, item)} target="_blank" rel="noopener" className={buttonClass.link}>
                      <ExternalLink className="inline size-4" aria-hidden="true" /> Live
                    </a>
                  ) : null}
                  <form action={changeContentStatus}>
                    <input type="hidden" name="section" value={section} />
                    <input type="hidden" name="recordId" value={item.id} />
                    <input type="hidden" name="status" value={item.status === "published" ? "draft" : "published"} />
                    <input type="hidden" name="back" value={back} />
                    <button type="submit" className={buttonClass.link}>{item.status === "published" ? "Unpublish" : "Publish"}</button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination page={page} pages={pages} total={total} base={`/admin/${section}`} params={{ q, status: sp.status, category: sp.category }} />
    </>
  );
}
