import type { Metadata } from "next";
import { ArrowUpRight, FileText } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { NewsletterForm } from "@/components/blocks/NewsletterForm";
import { NEWSLETTER, WHITEPAPERS, whitepaperHref } from "@/config/resources";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Whitepapers",
  description:
    "Longer guides from Vertis Global on contract-to-hire, peak season planning and the decisions behind a staffing programme.",
  alternates: { canonical: "/whitepapers" },
};

/* Whitepapers are their own resource, not an article category. They
   sit beside Insights rather than inside it. */
export default function WhitepapersPage() {
  return (
    <>
      <Section background="paper" spacing="none" className="pt-16 pb-24 md:pt-20 md:pb-32 lg:pb-44">
        <Container>
          <Eyebrow>Deep dives</Eyebrow>
          <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="max-w-[12ch] lg:col-span-7">Whitepapers</h1>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Longer guides for the people who sign off. Written from placements we
              have actually made, not from surveys.
            </p>
          </div>

          <ul className="mt-16 border-t border-n-200 lg:mt-24">
            {WHITEPAPERS.map((w) => (
              <li key={w.slug} className="border-b border-n-200">
                <a
                  href={whitepaperHref(w, SITE.staffingEmail)}
                  className="group grid gap-6 py-10 md:grid-cols-12 md:items-center md:gap-10 lg:py-12"
                >
                  <span className="grid size-14 place-items-center rounded-md bg-paper-2 text-orange md:col-span-1">
                    <FileText className="size-6" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 md:col-span-8">
                    <p className="tabular text-[0.9375rem] text-n-400">
                      {w.audience}
                      <span aria-hidden="true"> · </span>
                      {w.pages} pages
                    </p>
                    <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2.25rem)] text-ink transition-colors group-hover:text-accent">
                      {w.title}
                    </h2>
                    <p className="mt-4 max-w-[56ch] text-[1.0625rem] leading-relaxed text-n-500">
                      {w.summary}
                    </p>
                  </div>
                  <span className="link-underline text-[1.0625rem] text-ink md:col-span-3 md:justify-self-end">
                    {w.file ? "Download PDF" : "Request a copy"}
                    <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section background="ink" spacing="compact">
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
