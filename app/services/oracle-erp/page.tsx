import type { Metadata } from "next";
import { SpecialistPage } from "@/components/industries/SpecialistPage";
import { ORACLE_ERP as P } from "@/config/oracle-erp";

/* Oracle ERP staffing. Content in config/oracle-erp.ts; layout shared
   with the other specialist pages in components/industries/SpecialistPage. */

export const metadata: Metadata = {
  title: P.meta.title,
  description: P.meta.description,
  alternates: { canonical: `/services/${P.slug}` },
  openGraph: { type: "website", title: P.meta.title, description: P.meta.description },
};

export default function OracleErpPage() {
  return <SpecialistPage page={P} />;
}
