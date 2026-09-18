import type { Metadata } from "next";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { InsightList } from "@/components/blocks/InsightList";
import { NewsletterForm } from "@/components/blocks/NewsletterForm";
import { getInsights } from "@/config/insights";
import { NEWSLETTER } from "@/config/resources";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical notes from Vertis Global recruiters for the people who hire and the people looking for work.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const posts = getInsights();

  return (
    <>
      <Section background="paper" spacing="none" className="pt-16 pb-24 md:pt-20 md:pb-32 lg:pb-44">
        <Container>
          <Eyebrow>Insights</Eyebrow>
          <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="max-w-[14ch] lg:col-span-7">Straight talk about work and hiring.</h1>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Practical notes from our recruiters for the people who hire and the
              people looking for work. New articles appear here as they are published.
            </p>
          </div>

          <InsightList posts={posts} className="mt-16 lg:mt-24" />
        </Container>
      </Section>

      <Section background="ink" spacing="compact" id="newsletter">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <Eyebrow>Newsletter</Eyebrow>
              <h2 className="mt-7 max-w-[14ch] text-white">{NEWSLETTER.name}</h2>
              <p className="mt-6 max-w-[44ch] text-lg text-on-ink-muted">{NEWSLETTER.line}</p>
            </div>
            <NewsletterForm tone="ink" className="lg:col-span-5" />
          </div>
        </Container>
      </Section>
    </>
  );
}
