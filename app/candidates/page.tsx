import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Photo } from "@/components/media/Photo";
import { Faq } from "@/components/ui/Faq";
import { Button } from "@/components/ui/Button";
import { ResourceGrid } from "@/components/blocks/ResourceGrid";
import { TalentRange } from "@/components/blocks/TalentRange";
import { ResumeForm } from "@/components/candidates/ResumeForm";
import { ALL_INDUSTRIES, INDUSTRY_COUNT } from "@/config/industries";
import { getJobs, formatPosted, jobTypeLabel } from "@/config/jobs";
import { getLatestInsights } from "@/config/insights";
import { FAQS, PROMISES, STEPS, STRAIGHT_ANSWERS } from "@/config/job-seekers";
import { WHITEPAPERS } from "@/config/resources";

export const metadata: Metadata = {
  title: "For job seekers",
  description: `Temporary, contract and permanent work across ${INDUSTRY_COUNT} industries. Free to you, a real recruiter reads every application, and you hear back either way.`,
  alternates: { canonical: "/candidates" },
};

/* The job seeker page. The reader is often anxious and has usually
   been ignored by somebody else this week, so the page earns trust
   before it asks for anything: what we do for you, then the straight
   answers, then how it works, and only then the form. The copy
   itself lives in config/job-seekers.ts, shared with /jobs. */

export default function CandidatesPage() {
  const jobs = getJobs().slice(0, 4);

  return (
    <>
      {/* ── 1 · Hero ─────────────────────────────────────────── */}
      <PageHero
        photo="candidateHero"
        eyebrow="For job seekers"
        title="Your next job, found by"
        titleAccent="a person."
        intro="Temporary, contract and permanent work across eighteen industries. Free to you, always, and you will hear back either way."
        titleClassName="max-w-[15ch]"
        scrim="light"
        actions={
          <>
            <Button href="/jobs" variant="onInk">
              Browse jobs
            </Button>
            <Link href="#submit-resume" className="link-underline text-[1.0625rem]">
              Send us your resume
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </>
        }
      />

      {/* ── 2 · What we do for you ───────────────────────────── */}
      <Section background="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Eyebrow>What we do for you</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">Looking for work is hard enough.</h2>
              <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-n-600">
                You should not have to shout into an inbox to be noticed. Here is what you get
                from us, whatever kind of work you are after.
              </p>
              <dl className="mt-10 border-t border-n-200">
                {PROMISES.map((p) => (
                  <div key={p.title} className="border-b border-n-200 py-6">
                    <dt className="text-[1.25rem] font-semibold text-ink">{p.title}</dt>
                    <dd className="mt-2 max-w-[46ch] text-[1.0625rem] leading-relaxed text-n-500">
                      {p.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="lg:col-span-6 lg:pt-16">
              <Photo slot="candidateConversation" sizes="(max-width: 1024px) 100vw, 48vw" />
              <p className="mt-4 text-[0.9375rem] text-n-500">
                A conversation, not an interrogation. That is how it starts.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 3 · Straight answers ─────────────────────────────── */}
      <Section background="white" id="why" className="scroll-mt-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Straight answers</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">The things nobody tells you.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Recruitment has earned some of its reputation. These are the promises we are
              willing to be held to.
            </p>
          </div>

          <ul className="mt-16 grid gap-x-16 border-t border-n-200 md:grid-cols-2 lg:mt-20">
            {STRAIGHT_ANSWERS.map((line) => (
              <li key={line} className="flex gap-4 border-b border-n-200 py-7">
                <Check className="mt-1 size-5 shrink-0 text-accent" strokeWidth={2.25} aria-hidden="true" />
                <span className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-n-600">
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 4 · How it works for you ─────────────────────────── */}
      <Section background="paper2">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">Four steps, and you are in control of all of them.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              No account to create, no portal to log into, and nothing happens without you
              saying yes to it first.
            </p>
          </div>

          <ol className="mt-16 border-t border-n-300/60 lg:mt-20">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="grid gap-4 border-b border-n-300/60 py-8 md:grid-cols-12 md:gap-8 lg:py-10"
              >
                <span className="font-mono text-[0.8125rem] tracking-[0.1em] text-n-500 md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="md:col-span-11">
                  <h3 className="text-[clamp(1.375rem,2vw,1.75rem)] text-ink">{s.title}</h3>
                  <p className="mt-3 max-w-[56ch] text-[1.0625rem] leading-relaxed text-n-500">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <Button href="#submit-resume">Start with a conversation</Button>
          </div>
        </Container>
      </Section>

      {/* ── 5 · The range of work ────────────────────────────── */}
      <TalentRange />

      {/* ── 6 · Open roles ───────────────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
            <div>
              <Eyebrow>Open roles</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">A sample of what we are filling.</h2>
            </div>
            <Link href="/jobs" className="link-underline text-[1.0625rem]">
              Browse all roles
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-16 border-t border-n-200 lg:mt-20">
            {jobs.map((job) => {
              const industryName =
                ALL_INDUSTRIES.find((i) => i.slug === job.industry)?.name ?? job.industry;
              return (
                <li key={job.id} className="border-b border-n-200">
                  <Link
                    href={`/candidates?role=${encodeURIComponent(job.title)}#submit-resume`}
                    className="group grid gap-y-2 py-7 transition-colors hover:bg-paper md:grid-cols-12 md:items-center md:gap-8 md:px-6"
                  >
                    <div className="min-w-0 md:col-span-7">
                      <h3 className="text-[clamp(1.25rem,1.9vw,1.5rem)] text-ink transition-colors group-hover:text-accent">
                        {job.title}
                      </h3>
                      <p className="mt-2 text-[1.0625rem] text-n-500">
                        {industryName}
                        <span aria-hidden="true"> · </span>
                        {job.location}
                      </p>
                    </div>
                    <p className="text-[0.9375rem] text-n-500 md:col-span-3">
                      {jobTypeLabel(job.type)}
                    </p>
                    <p className="tabular text-[0.875rem] text-n-500 md:col-span-2 md:justify-self-end">
                      {formatPosted(job.posted)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ── 7 · Advice ───────────────────────────────────────── */}
      <ResourceGrid
        posts={getLatestInsights(3)}
        paper={WHITEPAPERS[0]}
        eyebrow="Advice"
        heading="Worth reading before your next move."
      />

      {/* ── 8 · FAQ ──────────────────────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-7 max-w-[12ch] lg:sticky lg:top-32">Fair enough to ask.</h2>
            </div>
            <div className="lg:col-span-8">
              <Faq items={FAQS} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 9 · Send us your details ─────────────────────────── */}
      <Section background="paper2" id="submit-resume" className="scroll-mt-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>Send us your details</Eyebrow>
              <h2 className="mt-7 max-w-[14ch]">Tell us what you are looking for.</h2>
              <p className="mt-8 max-w-[42ch] text-lg leading-relaxed text-n-600">
                Two minutes. A recruiter reads it, and you will hear back within a business day
                either way. Attach a resume if you have one to hand, and if you do not, tell us
                what you do and we will take it from there.
              </p>
              <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-relaxed text-n-500">
                We do not create an account for you and we do not keep a database of candidates.
                What you send goes to a recruiter, and that is all.
              </p>
            </div>

            <div className="lg:col-span-7">
              <ResumeForm />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 10 · Closing call to action ──────────────────────── */}
      <Section background="ink" spacing="compact">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="max-w-[16ch] text-white">
                Ready when <span className="text-amber">you are.</span>
              </h2>
              <p className="mt-6 max-w-[44ch] text-lg text-on-ink-muted">
                Browse what is open, or just tell us what you do. Either way a person will come
                back to you.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-5 lg:col-span-5 lg:justify-end">
              <Button href="/jobs" variant="onInk">
                Browse jobs
              </Button>
              <Link href="/about" className="link-underline text-[1.0625rem]">
                Who we are
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
