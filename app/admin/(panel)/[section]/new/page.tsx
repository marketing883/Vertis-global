import { notFound } from "next/navigation";
import { requirePage } from "@/lib/admin/auth";
import { contentTypeBySection } from "@/lib/content-types";
import { ContentForm } from "@/components/admin/ContentForm";
import { PageHeader } from "@/components/admin/ui";

type Props = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Props) {
  const type = contentTypeBySection((await params).section);
  return { title: type ? `New ${type.singular.toLowerCase()}` : "Not found" };
}

export default async function NewContentPage({ params }: Props) {
  const { section } = await params;
  const type = contentTypeBySection(section);
  if (!type) notFound();
  await requirePage(section);
  return (
    <>
      <PageHeader title={`New ${type.singular.toLowerCase()}`} back={{ href: `/admin/${section}`, label: type.label }} />
      <ContentForm type={type} initial={{}} />
    </>
  );
}
