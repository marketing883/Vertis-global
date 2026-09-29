import type { Metadata } from "next";
import { SpecialistPage } from "@/components/industries/SpecialistPage";
import { AZURE as P } from "@/config/azure";

/* Azure staffing. Content in config/azure.ts; layout shared with the
   other specialist pages in components/industries/SpecialistPage. */

export const metadata: Metadata = {
  title: P.meta.title,
  description: P.meta.description,
  alternates: { canonical: `/services/${P.slug}` },
  openGraph: { type: "website", title: P.meta.title, description: P.meta.description },
};

export default function AzurePage() {
  return <SpecialistPage page={P} />;
}
