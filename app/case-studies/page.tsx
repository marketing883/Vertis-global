import { ContentIndexPage, contentIndexMetadata } from "@/components/content/ContentPages";

/* Managed at /admin/case-studies. Returns 404 until something is published. */
export const metadata = contentIndexMetadata("case-study");

export default function Page() {
  return <ContentIndexPage type="case-study" />;
}
