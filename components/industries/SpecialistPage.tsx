import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Photo } from "@/components/media/Photo";
import { Faq } from "@/components/ui/Faq";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import { HireTalentScope } from "@/components/hire/HireTalentScope";
import { DisciplinePanel } from "@/components/industries/DisciplinePanel";
import type { SpecialistPage as Content } from "@/config/specialist-page";
import { cn } from "@/lib/utils";

/* A specialist staffing page (Oracle ERP, Azure). The same flow and
   visual language as the industry pages rendered by
   app/industries/[slug], with two sections swapped for what the
   source content actually supports: a lifecycle map in place of the
   market timeline table, and a candidate path in place of the sample
   job list, since there is no live vacancy feed for these roles.

   Leads arrive tagged with the page's `hireContext`, so they route
   without the inquiry form needing to know these pages exist. */

const JOBS_ANCHOR = "#jobs";

export function SpecialistPage({ page: P }: { page: Content }) {
  return (
    <>
      <HireTalentScope industry={P.hireContext.industry} service={P.hireContext.service} />

      {/* ── 1 · Hero ─────────────────────────────────────────── */}
      <PageHero
        photo={P.hero.photo}
        eyebrow={P.hero.eyebrow}
        title={P.hero.lead}
        titleAccent={P.hero.accent}
        intro={P.hero.sub}
        titleClassName="max-w-[17ch]"
        size="standard"
        actions={
          <>
            <HireTalentButton variant="onInk" />
            <Link href={JOBS_ANCHOR} className="link-underline text-[1.0625rem]">
              {P.jobsLabel}
              <ArrowDown className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </>
        }
      />

      {/* ── 2 · Three facts, still on the purple ─────────────── */}
      <Section background="ink" spacing="none" className="py-12 lg:py-14">
        <Container>
          <dl className="grid gap-x-12 gap-y-8 md:grid-cols-3 md:divide-x md:divide-white/10">
            {P.hero.facts.map((fact, i) => (
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

      {/* ── 3 · The assignment ───────────────────────────────── */}
      <Section background="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="flex flex-col justify-center lg:col-span-7">
              <Eyebrow>{P.overview.eyebrow}</Eyebrow>
              <h2 className="mt-7 max-w-[17ch]">{P.overview.heading}</h2>
              {P.overview.paragraphs.map((para) => (
                <p key={para.slice(0, 32)} className="mt-6 max-w-[52ch] text-lg leading-relaxed text-n-600">
                  {para}
                </p>
              ))}
            </div>

            <figure className="lg:col-span-5">
              <Photo slot={P.overview.photo} sizes="(max-width: 1024px) 100vw, 40vw" />
              <figcaption className="mt-4 text-[0.9375rem] text-n-500">{P.overview.caption}</figcaption>
            </figure>
          </div>

          <ul className="mt-16 grid gap-px overflow-hidden rounded-lg border border-n-200 bg-n-200 md:grid-cols-3 lg:mt-20">
            {P.overview.values.map((value, i) => (
              <li key={value.name} className="bg-white p-8 lg:p-10">
                <span className="font-mono text-[0.8125rem] tracking-[0.1em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-[1.375rem] text-ink">{value.name}</h3>
                <p className="mt-3 max-w-[36ch] text-[1.0625rem] leading-relaxed text-n-500">
                  {value.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 4 · What we staff ────────────────────────────────── */}
      <Section background="paper2" id="talent" className="scroll-mt-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{P.talent.eyebrow}</Eyebrow>
              <h2 className="mt-7 max-w-[17ch]">{P.talent.heading}</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">{P.talent.intro}</p>
          </div>

          <div className="mt-16 lg:mt-20">
            <DisciplinePanel disciplines={P.talent.disciplines} labels={P.talent.labels} />
          </div>
        </Container>
      </Section>

      {/* ── 5 · Talent scope, as a spec sheet ────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{P.scope.eyebrow}</Eyebrow>
              <h2 className="mt-7 max-w-[17ch]">{P.scope.heading}</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">{P.scope.intro}</p>
          </div>

          <div className="mt-16 rounded-lg border border-n-300 lg:mt-20">
            {P.scope.groups.map((group, i) => (
              <div
                key={group.name}
                className={[
                  "grid gap-4 p-6 md:grid-cols-12 md:items-baseline md:gap-8 md:p-7",
                  i > 0 ? "border-t border-n-300" : "",
                ].join(" ")}
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
            {P.pullQuote}
          </p>
        </Container>
      </Section>

      {/* ── 7 · Staffing path ────────────────────────────────── */}
      <Section background="ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <Eyebrow>{P.path.eyebrow}</Eyebrow>
                <h2 className="mt-7 max-w-[14ch] text-white">{P.path.heading}</h2>
                <p className="mt-8 max-w-[42ch] text-lg leading-relaxed text-on-ink-muted">
                  {P.path.intro}
                </p>
              </div>
            </div>

            <ol className="lg:col-span-7">
              {P.path.steps.map((step, i) => (
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

      {/* ── 8 · Across the lifecycle ─────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{P.lifecycle.eyebrow}</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">{P.lifecycle.heading}</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">{P.lifecycle.intro}</p>
          </div>

          {P.lifecycle.stages.length <= 5 ? (
            <>
            {/* A program read left to right. The brand gradient is the
                one flourish on the page: a single rule the phases hang
                from. Stacked on a phone it becomes a vertical rail. */}
            <ol className="relative mt-16 grid gap-10 lg:mt-20 lg:grid-cols-5 lg:gap-8">
              <span
                aria-hidden="true"
                className="absolute top-2 bottom-2 left-[5px] w-0.5 lg:top-[5px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-0.5 lg:w-full"
                style={{ background: "var(--vg-gradient)" }}
              />
              {P.lifecycle.stages.map((stage, i) => (
                <li key={stage.name} className="relative pl-10 lg:pt-10 lg:pl-0">
                  <span
                    aria-hidden="true"
                    className="absolute top-1 left-0 size-3 rounded-full border-2 border-white bg-ink ring-1 ring-n-300 lg:top-0"
                  />
                  <span className="font-mono text-[0.8125rem] tracking-[0.1em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-[1.25rem] text-ink">{stage.name}</h3>
                  <p className="mt-3 max-w-[40ch] text-[1.0625rem] leading-relaxed text-n-500">
                    {stage.body}
                  </p>
                </li>
              ))}
            </ol>
            </>
          ) : (
            /* Six or more stages are rarely one sequence (security and
               data run alongside migration, not after it), so they read
               as a grid, each hung from its own short gradient rule. */
            <ol className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
              {P.lifecycle.stages.map((stage, i) => (
                <li key={stage.name}>
                  <span
                    aria-hidden="true"
                    className="block h-0.5 w-12"
                    style={{ background: "var(--vg-gradient)" }}
                  />
                  <span className="mt-6 block font-mono text-[0.8125rem] tracking-[0.1em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-[1.25rem] text-ink">{stage.name}</h3>
                  <p className="mt-3 max-w-[40ch] text-[1.0625rem] leading-relaxed text-n-500">
                    {stage.body}
                  </p>
                </li>
              ))}
            </ol>
          )}

          {P.lifecycle.note ? (
            <p className="mt-12 max-w-[62ch] text-[1.0625rem] leading-relaxed text-n-500">
              {P.lifecycle.note}
            </p>
          ) : null}
        </Container>
      </Section>

      {/* ── 9 · Engagement models ────────────────────────────── */}
      <Section background="paper2">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{P.engagements.eyebrow}</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">{P.engagements.heading}</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">{P.engagements.intro}</p>
          </div>

          <ul
            className={cn(
              "mt-16 grid gap-5 md:grid-cols-2 lg:mt-20 xl:gap-6",
              P.engagements.options.length === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3",
            )}
          >
            {P.engagements.options.map((option) => (
              <li key={option.name} className="flex flex-col rounded-lg bg-white p-8">
                <h3 className="text-[1.375rem] text-ink">{option.name}</h3>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-n-600">{option.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 10 · Start with the gap ──────────────────────────── */}
      <Section background="ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>{P.brief.eyebrow}</Eyebrow>
              <h2 className="mt-7 max-w-[18ch] text-[clamp(1.75rem,3vw,2.5rem)] text-white">
                {P.brief.heading}
              </h2>
              <p className="mt-8 max-w-[42ch] text-lg leading-relaxed text-on-ink-muted">
                {P.brief.intro}
              </p>
              <div className="mt-10">
                <HireTalentButton variant="onInk">Start the brief</HireTalentButton>
              </div>
            </div>

            <ul className="lg:col-span-7">
              {P.brief.items.map((item) => (
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

      {/* ── 11 · For professionals in this field ─────────────── */}
      <Section background="paper" id="jobs" className="scroll-mt-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>{P.candidates.eyebrow}</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">{P.candidates.heading}</h2>
              <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-n-600">{P.candidates.body}</p>
              <div className="mt-10 hidden lg:block">
                <Photo slot="candidateConversation" sizes="40vw" className="rounded-lg" />
              </div>
            </div>

            <div className="lg:col-span-7">
              <ul className="border-t border-n-200">
                {P.candidates.roles.map((role) => (
                  <li key={role.title} className="border-b border-n-200">
                    <Link
                      href={`/candidates?role=${encodeURIComponent(role.title)}#submit-resume`}
                      className="group flex items-center justify-between gap-6 py-6 transition-colors hover:bg-paper-2 md:px-6"
                    >
                      <span className="min-w-0">
                        <span className="block text-[clamp(1.125rem,1.7vw,1.3125rem)] font-medium text-ink transition-colors group-hover:text-accent">
                          {role.title}
                        </span>
                        <span className="mt-1 block text-[0.9375rem] text-n-500">{role.area}</span>
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-[0.9375rem] text-n-500 transition-colors group-hover:text-accent">
                        Register interest
                        <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                <Link href="/candidates#submit-resume" className="link-underline text-[1.0625rem]">
                  Send your resume
                  <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </Link>
                <Link href="/jobs" className="link-underline text-[1.0625rem]">
                  Browse all roles
                  <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 12 · FAQ ─────────────────────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-7 max-w-[12ch] lg:sticky lg:top-32">Before you call.</h2>
            </div>
            <div className="lg:col-span-8">
              <Faq items={P.faqs} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 13 · Closing call to action ──────────────────────── */}
      <Section background="ink">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="max-w-[16ch] text-white">{P.cta.heading}</h2>
              <p className="mt-6 max-w-[46ch] text-lg text-on-ink-muted">{P.cta.body}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-5 lg:col-span-5 lg:justify-end">
              <HireTalentButton variant="onInk" />
              <Link href={JOBS_ANCHOR} className="link-underline text-[1.0625rem]">
                {P.jobsLabel}
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
