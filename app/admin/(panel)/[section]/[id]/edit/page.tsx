import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Eye } from "lucide-react";
import { requirePage } from "@/lib/admin/auth";
import { contentTypeBySection } from "@/lib/content-types";
import { contentToValues, getContent, publicUrl } from "@/lib/admin/content";
import { removeContent } from "@/app/admin/actions/content";
import { ContentForm } from "@/components/admin/ContentForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, PageHeader, buttonClass, formatWhen } from "@/components/admin/ui";

type Props = { params: Promise<{ section: string; id: string }>; searchParams: Promise<{ saved?: string }> };

export async function generateMetadata({ params }: Props) {
  const type = contentTypeBySection((await params).section);
  return { title: type ? `Edit ${type.singular.toLowerCase()}` : "Not found" };
}

export default async function EditContentPage({ params, searchParams }: Props) {
  const { section, id } = await params;
  const type = contentTypeBySection(section);
  if (!type) notFound();
  await requirePage(section);
  const item = getContent(type, Number(id));
  if (!item) notFound();
  const { saved } = await searchParams;

  return (
    <>
      <PageHeader
        title={item.title}
        back={{ href: `/admin/${section}`, label: type.label }}
        description={`Created ${formatWhen(item.created_at)} · last saved ${formatWhen(item.updated_at)}`}
        actions={
          <>
            <Badge tone={item.status}>{item.status === "published" ? "Published" : "Draft"}</Badge>
            <Link href={`/admin/${section}/${item.id}/preview`} className={buttonClass.secondary}>
              <Eye className="size-4" aria-hidden="true" /> Preview
            </Link>
            {item.status === "published" ? (
              <a href={publicUrl(type, item)} target="_blank" rel="noopener" className={buttonClass.secondary}>
                <ExternalLink className="size-4" aria-hidden="true" /> View live
              </a>
            ) : null}
          </>
        }
      />
      {saved ? (
        <p role="status" className="mb-6 rounded-md bg-[#eefaf2] px-4 py-3 text-sm text-[#1d6b3f]">
          {saved === "published" ? "Created and published." : "Created as a draft."}
        </p>
      ) : null}
      <ContentForm type={type} id={item.id} initial={contentToValues(type, item)} status={item.status} />

      <form action={removeContent} className="mt-10 border-t border-n-200 pt-6">
        <input type="hidden" name="section" value={section} />
        <input type="hidden" name="recordId" value={item.id} />
        <p className="mb-3 text-sm text-n-500">Deleting removes it from the site for good.</p>
        <ConfirmButton message={`Delete "${item.title}"? This cannot be undone.`} className={buttonClass.danger}>
          Delete
        </ConfirmButton>
      </form>
    </>
  );
}
