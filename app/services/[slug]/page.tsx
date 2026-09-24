import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Faq } from "@/components/ui/Faq";
import { ResourceGrid } from "@/components/blocks/ResourceGrid";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import { HireTalentScope } from "@/components/hire/HireTalentScope";
import { ServiceProof } from "@/components/services/ServiceProof";
import { ServiceSteps } from "@/components/services/ServiceSteps";
import { ServiceCompare } from "@/components/services/ServiceCompare";
import { StickyHireBar } from "@/components/services/StickyHireBar";
import { SERVICES, getService } from "@/config/services";
import { ALL_INDUSTRIES } from "@/config/industries";
import { getLatestInsights } from "@/config/insights";
import { WHITEPAPERS } from "@/config/resources";

/* One renderer, five pages. Everything that differs between them
   lives in config/services.ts: the hero, the photograph, the three
   proof figures, the body copy, the sequence, the FAQ and the closing
   call to action. The only conditional in this file is the optional
   `aside`, which is why three of the five pages carry a section the
   other two do not. */

type Params = Promise<{ slug: string }>;

/* Five services, five prerendered pages. An unknown slug is a static
   404 rather than a render at request time. */
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: service.meta.title,
    description: service.meta.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      type: "website",
      title: service.meta.title,
      description: service.meta.description,
    },
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const industries = service.industries.flatMap((slug) => {
    const found = ALL_INDUSTRIES.find((i) => i.slug === slug);
    return found ? [found] : [];
  });
  const alternative = getService(service.notRightIf.alternative);
  const paper =
    (service.whitepaper ? WHITEPAPERS.find((w) => w.slug === service.whitepaper) : undefined) ??
    WHITEPAPERS[0];

  return (
    <>
      {/* Every plain open() on this page carries the service, including
          the header's own Hire Talent button. */}
      <HireTalentScope service={service.slug} serviceName={service.name} need={service.need} />

      {/* ── 1 · Hero ─────────────────────────────────────────── */}
      <PageHero
        id="service-hero"
        photo={service.photo}
        eyebrow={service.hero.eyebrow}
        title={service.hero.lead}
        titleAccent={service.hero.accent}
        intro={service.hero.sub}
        titleClassName="max-w-[16ch]"
        actions={
          <>
            <HireTalentButton variant="onInk" />
            <Link href="#how-it-works" className="link-underline text-[1.0625rem]">
              How it works
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </>
        }
      />

      {/* ── 2 · Proof, this service only ─────────────────────── */}
      <ServiceProof points={service.proof} heading={`${service.name} in three figures`} />

      {/* ── 3 · What it is, and when it fits ─────────────────── */}
      <Section background="paper" id="is-this-right" className="scroll-mt-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Eyebrow>What it is</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">{service.summary}</h2>
              {service.what.map((para) => (
                <p
                  key={para.slice(0, 32)}
                  className="mt-6 max-w-[52ch] text-lg leading-relaxed text-n-600"
                >
                  {para}
                </p>
              ))}
            </div>

            <div className="lg:col-span-6">
              <p className="eyebrow">Best for</p>
              <ul className="mt-8 border-t border-n-200">
                {service.bestFor.map((item) => (
                  <li key={item} className="flex gap-4 border-b border-n-200 py-5">
                    <Check
                      className="mt-1 size-4 shrink-0 text-accent"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    <span className="text-[1.0625rem] leading-relaxed text-n-600">{item}</span>
                  </li>
                ))}
              </ul>

              {alternative ? (
                <div className="mt-10 rounded-lg bg-paper-2 p-7">
                  <p className="text-[0.9375rem] font-medium text-ink">When it is not the answer</p>
                  <p className="mt-3 max-w-[44ch] text-[1.0625rem] leading-relaxed text-n-500">
                    {service.notRightIf.body}
                  </p>
                  <Link
                    href={`/services/${alternative.slug}`}
                    className="link-underline mt-6 text-[1.0625rem]"
                  >
                    {alternative.name}
                    <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 4 · How it works ─────────────────────────────────── */}
      <ServiceSteps
        steps={service.steps}
        heading={`How ${service.name.toLowerCase()} works.`}
        intro="From the first call to the first day. No forms to download, no portal to log into, and a person on the other end of every step."
        cta={`Start with ${service.name.toLowerCase()}`}
      />

      {/* ── 5 · The section only some services have ──────────── */}
      {service.aside ? (
        <Section background="white">
          <Container>
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Eyebrow>{service.aside.eyebrow}</Eyebrow>
                <h2 className="mt-7 max-w-[14ch]">{service.aside.heading}</h2>
                <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-n-500">
                  {service.aside.body}
                </p>
              </div>
              <dl className="lg:col-span-7">
                {service.aside.points.map((p) => (
                  <div key={p.label} className="border-t border-n-200 py-8">
                    <dt className="text-[1.25rem] font-semibold text-ink">{p.label}</dt>
                    <dd className="mt-3 max-w-[56ch] text-[1.0625rem] leading-relaxed text-n-500">
                      {p.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ── 6 · What is included, and who it suits ───────────── */}
      <Section background="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Eyebrow>What is included</Eyebrow>
              <h2 className="mt-7 max-w-[14ch]">Every placement, the same standard.</h2>
              <ul className="mt-10 border-t border-n-200">
                {service.included.map((item) => (
                  <li key={item} className="flex gap-4 border-b border-n-200 py-5">
                    <Check
                      className="mt-1 size-4 shrink-0 text-accent"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    <span className="text-[1.0625rem] leading-relaxed text-n-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 lg:pl-8">
              <p className="eyebrow">Where we use it most</p>
              <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-n-500">
                Common in these industries, though we run {service.name.toLowerCase()} across all
                eighteen we serve.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <li key={industry.slug}>
                    <Link
                      href={`/industries?industry=${industry.slug}#explorer`}
                      className="inline-flex rounded-full border border-n-300 px-5 py-2.5 text-[0.9375rem] font-medium text-n-600 transition-colors hover:border-purple hover:text-ink"
                    >
                      {industry.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/industries" className="link-underline mt-10 text-[1.0625rem]">
                All eighteen industries
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 7 · Compare the five ─────────────────────────────── */}
      <ServiceCompare current={service.slug} />

      {/* ── 8 · FAQ ──────────────────────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-7 max-w-[12ch] lg:sticky lg:top-32">Before you call.</h2>
            </div>
            <div className="lg:col-span-8">
              <Faq items={service.faqs} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 9 · Resources ────────────────────────────────────── */}
      <ResourceGrid posts={getLatestInsights(3)} paper={paper} />

      {/* ── 10 · Closing call to action ──────────────────────── */}
      <Section background="ink" id="service-cta">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="max-w-[16ch] text-white">{service.cta.heading}</h2>
              <p className="mt-6 max-w-[44ch] text-lg text-on-ink-muted">{service.cta.body}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-5 lg:col-span-5 lg:justify-end">
              <HireTalentButton variant="onInk">How Can We Help?</HireTalentButton>
              <Link href="/services" className="link-underline text-[1.0625rem]">
                All five services
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <StickyHireBar
        label={`${service.name}. ${service.summary}`}
        cta="Hire Talent"
        showAfterId="service-hero"
        hideAtId="service-cta"
      />
    </>
  );
}
