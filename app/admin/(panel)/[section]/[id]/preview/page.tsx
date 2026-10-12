import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { requirePage } from "@/lib/admin/auth";
import { contentTypeBySection } from "@/lib/content-types";
import { getContent } from "@/lib/admin/content";
import { ContentArticle } from "@/components/content/ContentPages";
import { Card, buttonClass } from "@/components/admin/ui";

type Props = { params: Promise<{ section: string; id: string }> };

export const metadata = { title: "Preview" };

export default async function PreviewContentPage({ params }: Props) {
  const { section, id } = await params;
  const type = contentTypeBySection(section);
  if (!type) notFound();
  await requirePage(section);
  const item = getContent(type, Number(id));
  if (!item) notFound();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f3d9a4] bg-[#fff8e8] px-4 py-3 text-sm">
        <span>
          <strong>Preview.</strong>{" "}
          {item.status === "published" ? "This is how it looks on the site." : "Draft: not visible on the site until published."}
        </span>
        <Link href={`/admin/${section}/${item.id}/edit`} className={buttonClass.secondary}>Back to editing</Link>
      </div>
      {type.hasDetailPage ? (
        <div className="overflow-hidden rounded-lg border border-n-200">
          <ContentArticle type={type.id} item={item} />
        </div>
      ) : (
        /* Whitepapers have no page of their own: this is their entry on /whitepapers. */
        <Card className="max-w-2xl p-8">
          <p className="text-sm text-n-500">
            {item.data.audience}
            {Number(item.data.pages) > 0 ? ` · ${item.data.pages} pages` : ""}
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-ink">{item.title}</h2>
          <p className="mt-3 text-n-600">{item.excerpt}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            <FileText className="size-4" aria-hidden="true" />
            {item.data.file ? (
              <a href={item.data.file} target="_blank" rel="noopener" className="hover:underline">Download PDF</a>
            ) : (
              "Request a copy (no PDF uploaded, so visitors request it by email)"
            )}
          </p>
        </Card>
      )}
    </>
  );
}
