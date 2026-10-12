import { ContentIndexPage, contentIndexMetadata } from "@/components/content/ContentPages";

/* Managed at /admin/news. Returns 404 until something is published. */
export const metadata = contentIndexMetadata("news");

export default function Page() {
  return <ContentIndexPage type="news" />;
}
