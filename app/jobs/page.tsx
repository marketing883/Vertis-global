import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, Mail } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Photo } from "@/components/media/Photo";
import { JobsHero } from "@/components/jobs/JobsHero";
import { JobList } from "@/components/jobs/JobList";
import { getJobs, SAMPLE_NOTICE } from "@/config/jobs";
import { PROMISES, STEPS } from "@/config/job-seekers";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "Temporary, contract, contract-to-hire and permanent roles across eighteen industries. Tell us what you are looking for and a recruiter will come back to you.",
  alternates: { canonical: "/jobs" },
};

/* The jobs page, in the order a job seeker needs it: what this feels
   like, what we promise, how it goes, where to send a resume, then
   the roles. The listing used to be the whole page, which read as a
   filter with nothing behind it. The copy here is shared with
   /candidates through config/job-seekers.ts so the two pages say the
   same thing. */

export default function JobsPage() {
  const jobs = getJobs();

  return (
    <>
      {/* ── 1 · Hero ─────────────────────────────────────────── */}
      <JobsHero />

      {/* ── 2 · What working with us looks like ──────────────── */}
      <Section background="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <Photo slot="jobsFirstDay" sizes="(max-width: 1024px) 100vw, 48vw" className="rounded-lg" />
              <p className="mt-4 text-[0.9375rem] text-n-500">
                The first morning. The part of the job we are actually working toward.
              </p>
            </div>
            <div className="lg:col-span-6">
              <Eyebrow>What you get</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">A recruiter who knows your kind of work.</h2>
              <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-n-600">
                Looking for work is hard enough without shouting into an inbox. Whatever you do,
                and whichever way you want to work, this is what you get from us.
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
          </div>
        </Container>
      </Section>

      {/* ── 3 · How it goes ──────────────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>How it goes</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">Four steps, and you are in control of all of them.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              No account to create and no portal to log into. Nothing happens without you saying
              yes to it first.
            </p>
          </div>

          <ol className="mt-16 grid gap-x-10 gap-y-12 border-t border-n-200 pt-12 md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="font-mono text-[0.8125rem] tracking-[0.1em] text-n-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 max-w-[16ch] text-[1.375rem] leading-tight text-ink">{s.title}</h3>
                <p className="mt-3 max-w-[32ch] text-[1.0625rem] leading-relaxed text-n-500">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── 4 · Send us your resume ──────────────────────────── */}
      <Section background="ink" spacing="compact">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <Eyebrow>Resumes and portfolios</Eyebrow>
              <h2 className="mt-7 max-w-[18ch] text-white">
                Want to share your resume <span className="text-amber">or portfolio?</span>
              </h2>
              <p className="mt-6 max-w-[46ch] text-lg text-on-ink-muted">
                Send it straight to our recruiters. A person reads it, and you will hear back
                either way, usually within a business day.
              </p>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <p className="text-[0.9375rem] text-on-ink-muted">Send it to</p>
              <a
                href={`mailto:${SITE.careersEmail}?subject=${encodeURIComponent("Resume for Vertis Global")}`}
                className="link-underline mt-2 inline-flex items-center gap-3 text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold text-white"
              >
                <Mail className="size-6 shrink-0 text-amber" strokeWidth={1.75} aria-hidden="true" />
                {SITE.careersEmail}
              </a>
              <p className="mt-5 text-[0.9375rem] text-on-ink-muted">
                Or use{" "}
                <Link href="/candidates#submit-resume" className="link-underline text-white">
                  the short form
                </Link>{" "}
                and attach it there.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 5 · The roles ────────────────────────────────────── */}
      <Section background="paper" id="roles" className="scroll-mt-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Open roles</Eyebrow>
              <h2 className="mt-7 max-w-[14ch]">Work that fits your life.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Filter by the way you want to work and the industry you know. Every row goes to a
              recruiter, not a queue.
            </p>
          </div>

          {/* Said plainly, because nobody should think they have applied
              to an opening that is not currently live. */}
          <p className="mt-12 flex max-w-[80ch] gap-3 rounded-lg bg-paper-2 px-6 py-5 text-[1.0625rem] leading-relaxed text-n-600">
            <Info className="mt-1 size-5 shrink-0 text-orange" strokeWidth={1.75} aria-hidden="true" />
            {SAMPLE_NOTICE}
          </p>

          <div className="mt-16 lg:mt-20">
            <JobList jobs={jobs} />
          </div>
        </Container>
      </Section>

      {/* ── 6 · Nothing here yet ─────────────────────────────── */}
      <Section background="ink" spacing="compact">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="max-w-[18ch] text-white">
                Nothing here yet? <span className="text-amber">Tell us anyway.</span>
              </h2>
              <p className="mt-6 max-w-[46ch] text-lg text-on-ink-muted">
                Most of the work we fill never reaches a listing. Send us what you do and where
                you are, and a recruiter will call when something fits.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-5 lg:col-span-5 lg:justify-end">
              <Link href="/candidates#submit-resume" className="link-underline text-[1.0625rem]">
                Send us your details
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
