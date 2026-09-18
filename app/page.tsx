import type { Metadata } from "next";
import { Hero } from "@/components/blocks/Hero";
import { Statement } from "@/components/blocks/Statement";
import { TalentRange } from "@/components/blocks/TalentRange";
import { Industries } from "@/components/blocks/Industries";
import { Services } from "@/components/blocks/Services";
import { HowItWorks } from "@/components/blocks/HowItWorks";
import { FeaturedJobs } from "@/components/blocks/FeaturedJobs";
import { Principles } from "@/components/blocks/Principles";
import { WhyVertis } from "@/components/blocks/WhyVertis";
import { Resources } from "@/components/blocks/Resources";
import { Pathways } from "@/components/blocks/Pathways";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Staffing for every kind of work",
  description: SITE.description,
  alternates: { canonical: "/" },
};

/* ink+video → paper → ink+photos → paper → paper-2
   → paper+photo → white → paper-2 → white → paper+photos → ink+photos */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <TalentRange />
      <Industries />
      <Services />
      <HowItWorks />
      <FeaturedJobs />
      <Principles />
      <WhyVertis />
      <Resources />
      <Pathways />
    </>
  );
}
