import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Faq } from "@/components/ui/Faq";
import { ResourceGrid } from "@/components/blocks/ResourceGrid";
import { WhyVertis } from "@/components/blocks/WhyVertis";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import { SERVICES } from "@/config/services";
import { getLatestInsights } from "@/config/insights";
import { WHITEPAPERS } from "@/config/resources";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Five ways to hire with Vertis Global: temporary staffing, contract staffing, contract-to-hire, direct hire, and project and team staffing. We will tell you which one fits the work.",
  alternates: { canonical: "/services" },
};

/* The index does one job: help an employer pick the right arrangement
   before they read a word about any of them. Hence the situation list
   first and the comparison table second. The five detail pages do the
   persuading. */

const SITUATIONS = [
  { line: "I need people for a rush, an absence or a season", slug: "temporary-staffing" },
  { line: "I need a specialist for work that has an end date", slug: "contract-staffing" },
  {
    line: "The role is permanent, but I want to see the person do the job first",
    slug: "contract-to-hire",
  },
  { line: "The role is permanent and I need the right person found", slug: "direct-hire" },
  {
    line: "I need several people across roles for one piece of work",
    slug: "project-team-staffing",
  },
];

const FAQS = [
  {
    q: "Can we use more than one arrangement at once?",
    a: "Yes, and most clients do. A seasonal crew on temporary, two specialists on contract and a supervisor on direct hire is an ordinary month. It is one point of contact and one invoice whichever mix you use.",
  },
  {
    q: "Can a temporary or contract worker become a permanent employee?",
    a: "Yes. Talk to us before you make the offer and we will agree the terms in writing, which is exactly how contract-to-hire works from the start.",
  },
  {
    q: "Which industries do you staff for?",
    a: "Eighteen, from administrative and financial services through manufacturing, healthcare and hospitality to information technology, semiconductor and energy. All five arrangements are available in every one of them.",
  },
  {
    q: "Do you staff outside the United States?",
    a: "We recruit across the United States and deliver from India when the work suits it. A blended team, part onshore and part offshore, sits under one contract and one point of contact.",
  },
  {
    q: "What does it cost?",
    a: "It depends on the arrangement, the role and the volume, and we quote before any work starts. There is no charge for the first conversation, for a shortlist, or for a replacement under the guarantee.",
  },
  {
    q: "What do you need from us to start?",
    a: "A short conversation. The role or the work, roughly when you need it, and where. Twenty minutes with the person who will manage the hire is worth more than any written brief.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        photo="industriesHero"
        eyebrow="Services"
        title="Hire the way the work"
        titleAccent="demands."
        intro="Five arrangements, one standard of screening. Temporary cover, contract specialists, contract-to-hire, permanent search, and whole project teams. We will tell you which one fits, even when it is the smaller one."
        actions={
          <>
            <HireTalentButton variant="onInk" />
            <Link href="#start-here" className="link-underline text-[1.0625rem]">
              Which one do I need?
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </>
        }
      />

      {/* ── Start here: the situation, not the product name ──── */}
      <Section background="paper" id="start-here" className="scroll-mt-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Start here</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">Find your situation.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Most employers know the problem, not the product name. Pick the line that sounds
              like your week.
            </p>
          </div>

          <ul className="mt-16 border-t border-n-200 lg:mt-20">
            {SITUATIONS.map((s) => {
              const service = SERVICES.find((x) => x.slug === s.slug);
              if (!service) return null;
              return (
                <li key={s.slug} className="border-b border-n-200">
                  <Link
                    href={`/services/${service.slug}`}
                    className="group grid items-center gap-y-2 py-8 transition-colors hover:bg-paper-2 md:grid-cols-12 md:gap-8 md:px-6 lg:py-9"
                  >
                    <p className="text-[clamp(1.125rem,1.9vw,1.5rem)] leading-snug text-ink md:col-span-8">
                      {s.line}
                    </p>
                    <span className="link-underline text-[1.0625rem] text-n-600 md:col-span-4 md:justify-self-end">
                      {service.name}
                      <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="border-b border-n-200">
              <div className="grid items-center gap-y-3 py-8 md:grid-cols-12 md:gap-8 md:px-6 lg:py-9">
                <p className="text-[clamp(1.125rem,1.9vw,1.5rem)] leading-snug text-n-500 md:col-span-8">
                  I am not sure which of these it is
                </p>
                <span className="md:col-span-4 md:justify-self-end">
                  <HireTalentButton size="md">Ask us</HireTalentButton>
                </span>
              </div>
            </li>
          </ul>
        </Container>
      </Section>

      {/* ── The comparison table ─────────────────────────────── */}
      <Section background="paper2">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Compare</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">The five, side by side.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              They differ in who employs the person, how long they stay, and the moment you have
              to commit.
            </p>
          </div>

          {/* The table scrolls inside its own box rather than pushing
              the page sideways on a phone. */}
          <div className="mt-16 overflow-x-auto lg:mt-20">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <caption className="sr-only">
                The five staffing arrangements compared by employer, length and commitment point
              </caption>
              <thead>
                <tr className="border-b border-n-300/60">
                  <th scope="col" className="py-5 pr-6 text-[0.9375rem] font-medium text-n-500">
                    Arrangement
                  </th>
                  <th scope="col" className="py-5 pr-6 text-[0.9375rem] font-medium text-n-500">
                    Who employs the person
                  </th>
                  <th scope="col" className="py-5 pr-6 text-[0.9375rem] font-medium text-n-500">
                    Typical length
                  </th>
                  <th scope="col" className="py-5 text-[0.9375rem] font-medium text-n-500">
                    When you commit
                  </th>
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((s) => (
                  <tr key={s.slug} className="border-b border-n-300/60 align-top">
                    <th scope="row" className="py-7 pr-6 font-normal">
                      <Link
                        href={`/services/${s.slug}`}
                        className="font-display text-[1.25rem] leading-tight font-bold tracking-[-0.02em] text-ink transition-colors hover:text-accent"
                      >
                        {s.name}
                      </Link>
                    </th>
                    <td className="py-7 pr-6 text-[1.0625rem] text-n-600">{s.compare.employer}</td>
                    <td className="py-7 pr-6 text-[1.0625rem] text-n-600">{s.compare.length}</td>
                    <td className="py-7 text-[1.0625rem] text-n-600">{s.compare.commit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* ── The five in full ─────────────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>The five</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">Read the one that fits.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Each page sets out how it runs, what is included, where we use it most, and what it
              is not right for.
            </p>
          </div>

          <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6">
            {SERVICES.map((s) => (
              <li key={s.slug} className="flex">
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex w-full flex-col rounded-lg bg-paper p-7 transition-colors hover:bg-paper-2"
                >
                  <h3 className="text-[1.375rem] text-ink transition-colors group-hover:text-accent">
                    {s.name}
                  </h3>
                  <p className="mt-4 text-[1.0625rem] leading-relaxed text-n-500">{s.summary}</p>
                  <span className="link-underline mt-auto pt-8 text-[1.0625rem] text-ink">
                    How it works
                    <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <WhyVertis />

      <Section background="paper2">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-7 max-w-[12ch] lg:sticky lg:top-32">Before you call.</h2>
            </div>
            <div className="lg:col-span-8">
              <Faq items={FAQS} />
            </div>
          </div>
        </Container>
      </Section>

      <ResourceGrid posts={getLatestInsights(3)} paper={WHITEPAPERS[0]} />

      <Section background="ink">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="max-w-[16ch] text-white">
                Still not sure which one? <span className="text-amber">Say so.</span>
              </h2>
              <p className="mt-6 max-w-[44ch] text-lg text-on-ink-muted">
                Describe the work in a sentence and we will tell you which arrangement fits,
                including when the smaller one is the right answer.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-5 lg:col-span-5 lg:justify-end">
              <HireTalentButton variant="onInk">How Can We Help?</HireTalentButton>
              <Link href="/jobs" className="link-underline text-[1.0625rem]">
                Looking for work?
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
