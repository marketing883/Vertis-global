import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Photo } from "@/components/media/Photo";
import { Faq } from "@/components/ui/Faq";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import { HireTalentScope } from "@/components/hire/HireTalentScope";
import { DisciplinePanel } from "@/components/industries/DisciplinePanel";
import { INDUSTRY_PAGES, getIndustryPage } from "@/config/industry-pages";
import { ALL_INDUSTRIES } from "@/config/industries";
import { getJobs, formatPosted, jobTypeLabel } from "@/config/jobs";

/* One renderer for every industry page, written as a hiring brief
   rather than a brochure: what we recruit for, in what vocabulary,
   how a non-engineer screens an engineer, where the market is tight,
   and what to have ready before calling.

   Everything specific lives in config/industry-pages.ts. Only
   industries with an entry there get a route, which is why the
   explorer links to a page when one exists and opens the inquiry
   modal when it does not. */

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRY_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = getIndustryPage((await params).slug);
  if (!page) return {};
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: { canonical: `/industries/${page.slug}` },
    openGraph: { type: "website", title: page.meta.title, description: page.meta.description },
  };
}

export default async function IndustryPage({ params }: { params: Params }) {
  const page = getIndustryPage((await params).slug);
  if (!page) notFound();

  const industry = ALL_INDUSTRIES.find((i) => i.slug === page.slug);
  if (!industry) notFound();

  const jobs = getJobs()
    .filter((j) => j.industry === page.slug)
    .slice(0, 4);

  return (
    <>
      <HireTalentScope industry={page.slug} />

      {/* ── 1 · Hero ─────────────────────────────────────────── */}
      <PageHero
        photo={page.hero.photo}
        eyebrow={page.hero.eyebrow}
        title={page.hero.lead}
        titleAccent={page.hero.accent}
        intro={page.hero.sub}
        titleClassName="max-w-[17ch]"
        size="standard"
        actions={
          <>
            <HireTalentButton variant="onInk" />
            <Link href="#disciplines" className="link-underline text-[1.0625rem]">
              {page.disciplinesLabel.toLowerCase()} we recruit for
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </>
        }
      />

      {/* ── 2 · Three facts, still on the purple ─────────────── */}
      <Section background="ink" spacing="none" className="py-12 lg:py-14">
        <Container>
          <dl className="grid gap-x-12 gap-y-8 md:grid-cols-3 md:divide-x md:divide-white/10">
            {page.hero.facts.map((fact, i) => (
              <div key={fact.figure} className={i > 0 ? "md:pl-12" : undefined}>
                <dt className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-none font-bold tracking-[-0.03em] text-amber">
                  {fact.figure}
                </dt>
                <dd className="mt-3 max-w-[34ch] text-[1.0625rem] leading-relaxed text-on-ink-muted">
                  {fact.caption}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* ── 3 · The problem, in their language ───────────────── */}
      <Section background="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div
              className={
                page.overview.photo
                  ? "flex flex-col justify-center lg:col-span-7"
                  : "grid gap-x-16 gap-y-6 lg:col-span-12 lg:grid-cols-2"
              }
            >
              <div className={page.overview.photo ? undefined : "lg:col-span-2"}>
                <Eyebrow>{industry.name}</Eyebrow>
                <h2 className="mt-7 max-w-[17ch]">{page.overview.heading}</h2>
              </div>
              {page.overview.paragraphs.map((para) => (
                <p
                  key={para.slice(0, 32)}
                  className={
                    page.overview.photo
                      ? "mt-6 max-w-[52ch] text-lg leading-relaxed text-n-600"
                      : "max-w-[52ch] text-lg leading-relaxed text-n-600"
                  }
                >
                  {para}
                </p>
              ))}
            </div>

            {page.overview.photo ? (
              <figure className="lg:col-span-5">
                <Photo slot={page.overview.photo} sizes="(max-width: 1024px) 100vw, 40vw" />
                {page.overview.caption ? (
                  <figcaption className="mt-4 text-[0.9375rem] text-n-500">
                    {page.overview.caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* ── 4 · Disciplines ──────────────────────────────────── */}
      <Section background="paper2" id="disciplines" className="scroll-mt-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{page.disciplinesLabel}</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">{page.disciplinesHeading}</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Pick one and you get what they actually produce, the seniority we fill, and the
              tools and standards a screen has to cover.
            </p>
          </div>

          <div className="mt-16 lg:mt-20">
            <DisciplinePanel disciplines={page.disciplines} />
          </div>
        </Container>
      </Section>

      {/* ── 5 · The spec sheet ───────────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>The vocabulary</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">{page.stack.heading}</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">{page.stack.intro}</p>
          </div>

          {/* Deliberately unlike anything else on the site: a bordered
              technical block, mono type, dense. It is the fastest way
              to show competence to somebody scanning. */}
          <div className="mt-16 rounded-lg border border-n-300 lg:mt-20">
            {page.stack.groups.map((group, i) => (
              <div
                key={group.name}
                className={cnRow(i)}
              >
                <p className="eyebrow md:col-span-3">{group.name}</p>
                <ul className="flex flex-wrap gap-2 md:col-span-9">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="inline-flex rounded-md bg-paper px-3 py-1.5 font-mono text-[0.8125rem] text-n-600"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 6 · The line worth remembering ───────────────────── */}
      <Section background="paper" spacing="compact">
        <Container size="narrow">
          <p className="font-display text-[clamp(1.625rem,3.2vw,2.5rem)] leading-[1.2] font-bold tracking-[-0.03em] text-ink">
            {page.pullQuote}
          </p>
        </Container>
      </Section>

      {/* ── 7 · How we screen ────────────────────────────────── */}
      <Section background="ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* One sticky wrapper, not two sticky siblings. Sticking
                the heading and the paragraph separately at different
                offsets made them collide on the way down. */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <Eyebrow>Screening</Eyebrow>
                <h2 className="mt-7 max-w-[14ch] text-white">{page.screening.heading}</h2>
                <p className="mt-8 max-w-[42ch] text-lg leading-relaxed text-on-ink-muted">
                  {page.screening.intro}
                </p>
              </div>
            </div>

            <ol className="lg:col-span-7">
              {page.screening.steps.map((step, i) => (
                <li
                  key={step.title}
                  className="grid gap-3 border-t border-white/12 py-7 md:grid-cols-12 md:gap-6"
                >
                  <span className="font-mono text-[0.8125rem] tracking-[0.1em] text-amber md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="md:col-span-11">
                    <h3 className="text-[1.25rem] text-white">{step.title}</h3>
                    <p className="mt-2 max-w-[52ch] text-[1.0625rem] leading-relaxed text-on-ink-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* ── 8 · Market reality ───────────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Straight answer</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">{page.market.heading}</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">{page.market.intro}</p>
          </div>

          <div className="mt-16 overflow-x-auto lg:mt-20">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">
                Engineering roles, what the market looks like, and a realistic timeline
              </caption>
              <thead>
                <tr className="border-b border-n-300/60">
                  <th scope="col" className="py-5 pr-6 text-[0.9375rem] font-medium text-n-500">
                    Role
                  </th>
                  <th scope="col" className="py-5 pr-6 text-[0.9375rem] font-medium text-n-500">
                    What the market looks like
                  </th>
                  <th scope="col" className="py-5 text-[0.9375rem] font-medium text-n-500">
                    Realistic shortlist
                  </th>
                </tr>
              </thead>
              <tbody>
                {page.market.rows.map((row) => (
                  <tr key={row.role} className="border-b border-n-300/60 align-top">
                    <th scope="row" className="py-6 pr-6 text-[1.0625rem] font-medium text-ink">
                      {row.role}
                    </th>
                    <td className="max-w-[46ch] py-6 pr-6 text-[1.0625rem] leading-relaxed text-n-500">
                      {row.market}
                    </td>
                    <td className="py-6 text-[1.0625rem] font-medium whitespace-nowrap text-accent">
                      {row.timeline}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 max-w-[62ch] text-[1.0625rem] leading-relaxed text-n-500">
            {page.market.note}
          </p>
        </Container>
      </Section>

      {/* ── 9 · Engagement shapes ────────────────────────────── */}
      <Section background="paper2">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Shapes</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">{page.engagements.heading}</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              {page.engagements.intro}
            </p>
          </div>

          <ul className="mt-16 grid gap-5 lg:mt-20 lg:grid-cols-3 lg:gap-6">
            {page.engagements.options.map((option) => (
              <li key={option.name} className="flex flex-col rounded-lg bg-white p-8">
                <h3 className="text-[1.5rem] text-ink">{option.name}</h3>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-n-600">{option.covers}</p>
                <dl className="mt-8 space-y-5 border-t border-n-200 pt-6">
                  <div>
                    <dt className="eyebrow">When it fits</dt>
                    <dd className="mt-2 text-[1.0625rem] leading-relaxed text-n-500">
                      {option.fits}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow">The arrangement</dt>
                    <dd className="mt-2 text-[1.0625rem] leading-relaxed text-n-500">
                      {option.shape}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 10 · What to have ready ──────────────────────────── */}
      <Section background="ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>Before you call</Eyebrow>
              <h2 className="mt-7 max-w-[14ch] text-white">{page.brief.heading}</h2>
              <p className="mt-8 max-w-[42ch] text-lg leading-relaxed text-on-ink-muted">
                {page.brief.intro}
              </p>
              <div className="mt-10">
                <HireTalentButton variant="onInk">Start the brief</HireTalentButton>
              </div>
            </div>

            <ul className="lg:col-span-7">
              {page.brief.items.map((item) => (
                <li key={item} className="flex gap-4 border-t border-white/12 py-6">
                  <Check className="mt-1 size-5 shrink-0 text-amber" strokeWidth={2.25} aria-hidden="true" />
                  <span className="max-w-[52ch] text-[1.0625rem] leading-relaxed text-on-ink-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── 11 · Open roles in this industry ─────────────────── */}
      {jobs.length > 0 ? (
        <Section background="paper">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
              <div>
                <Eyebrow>Open roles</Eyebrow>
                <h2 className="mt-7 max-w-[18ch]">
                  A sample of {industry.name.toLowerCase()} roles we fill.
                </h2>
              </div>
              <Link href="/jobs" className="link-underline text-[1.0625rem]">
                Browse all roles
                <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-14 border-t border-n-200">
              {jobs.map((job) => (
                <li key={job.id} className="border-b border-n-200">
                  <Link
                    href={`/candidates?role=${encodeURIComponent(job.title)}#submit-resume`}
                    className="group grid gap-y-2 py-7 transition-colors hover:bg-paper-2 md:grid-cols-12 md:items-center md:gap-8 md:px-6"
                  >
                    <div className="min-w-0 md:col-span-7">
                      <h3 className="text-[clamp(1.25rem,1.9vw,1.5rem)] text-ink transition-colors group-hover:text-accent">
                        {job.title}
                      </h3>
                      <p className="mt-2 text-[1.0625rem] text-n-500">
                        {job.location}
                        <span aria-hidden="true"> · </span>
                        {job.arrangement}
                      </p>
                    </div>
                    <p className="text-[0.9375rem] text-n-500 md:col-span-3">
                      {jobTypeLabel(job.type)}
                    </p>
                    <p className="tabular text-[0.875rem] text-n-400 md:col-span-2 md:justify-self-end">
                      {formatPosted(job.posted)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* ── 12 · FAQ ─────────────────────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-7 max-w-[12ch] lg:sticky lg:top-32">Before you call.</h2>
            </div>
            <div className="lg:col-span-8">
              <Faq items={page.faqs} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 13 · Closing call to action ──────────────────────── */}
      <Section background="ink">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="max-w-[16ch] text-white">{page.cta.heading}</h2>
              <p className="mt-6 max-w-[46ch] text-lg text-on-ink-muted">{page.cta.body}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-5 lg:col-span-5 lg:justify-end">
              <HireTalentButton variant="onInk">How Can We Help?</HireTalentButton>
              <Link href="/industries" className="link-underline text-[1.0625rem]">
                All industries
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

/* The spec sheet rows: no border above the first one, so the block
   reads as one bordered card rather than a stack of rules. */
function cnRow(index: number) {
  return [
    "grid gap-4 p-6 md:grid-cols-12 md:items-baseline md:gap-8 md:p-7",
    index > 0 ? "border-t border-n-300" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
