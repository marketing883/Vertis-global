import { ContentIndexPage, contentIndexMetadata } from "@/components/content/ContentPages";

/* Managed at /admin/webinars. Returns 404 until something is published. */
export const metadata = contentIndexMetadata("webinar");

export default function Page() {
  return <ContentIndexPage type="webinar" />;
}
