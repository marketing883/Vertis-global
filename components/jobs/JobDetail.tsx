import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Prose } from "@/components/content/Prose";
import { Button } from "@/components/ui/Button";
import { SAMPLE_NOTICE, formatPosted, jobTypeLabel } from "@/config/jobs";
import { ALL_INDUSTRIES, TALENT_LEVELS } from "@/config/industries";
import { SITE } from "@/config/site";
import { arrangementText, lines, type JobRow } from "@/lib/data/jobs";
import { bodyBlocks } from "@/lib/data/content";

/* One job, as the public sees it at /jobs/<slug>. Also rendered by the
   admin preview (/admin/jobs/<id>/preview), so a draft can be checked
   exactly as it will appear. */
export function JobDetail({ job }: { job: JobRow }) {
  const industry = ALL_INDUSTRIES.find((i) => i.slug === job.industry);
  const level = TALENT_LEVELS.find((l) => l.id === job.level);
  const posted = (job.posted_at ?? job.created_at).slice(0, 10);
  const responsibilities = lines(job.responsibilities);
  const qualifications = lines(job.qualifications);
  const skills = job.skills
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const apply = `/candidates?role=${encodeURIComponent(job.title)}&job=${encodeURIComponent(job.slug)}#submit-resume`;

  /* Google's JobPosting markup, for real vacancies only: the original
     representative roles are not openings and must not be marked up
     as if they were. */
  const jsonLd =
    job.is_sample === 1
      ? null
      : {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: job.title,
          description: [job.summary, job.description, ...responsibilities, ...qualifications]
            .filter(Boolean)
            .join("\n"),
          datePosted: posted,
          employmentType:
            job.employment_type === "direct-hire"
              ? "FULL_TIME"
              : job.employment_type === "temporary"
                ? "TEMPORARY"
                : "CONTRACTOR",
          hiringOrganization: { "@type": "Organization", name: SITE.name, sameAs: SITE.url },
          ...(job.arrangement === "remote"
            ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "US" } }
            : {
                jobLocation: {
                  "@type": "Place",
                  address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "US" },
                },
              }),
          ...(skills.length ? { skills: skills.join(", ") } : {}),
        };

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      ) : null}
      <Section background="paper" spacing="none" className="pt-16 pb-24 md:pt-20 md:pb-32">
        <Container size="narrow">
          <Link href="/jobs" className="link-underline text-[0.9375rem] text-n-500">
            <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
            All jobs
          </Link>

          <article className="mt-12">
            <header>
              <Eyebrow>{industry?.name ?? "Open role"}</Eyebrow>
              <h1 className="mt-7 max-w-[22ch] text-[clamp(2.25rem,5vw,3.5rem)]">{job.title}</h1>
              <p className="mt-8 text-[1.0625rem] text-n-500">
                {job.location}
                <span aria-hidden="true"> · </span>
                {arrangementText(job)}
                <span aria-hidden="true"> · </span>
                {jobTypeLabel(job.employment_type)}
                {level ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    {level.name}
                  </>
                ) : null}
              </p>
              <p className="tabular mt-2 text-[0.9375rem] text-n-500">
                Posted <time dateTime={posted}>{formatPosted(posted).toLowerCase()}</time>
              </p>
            </header>

            {job.is_sample === 1 ? (
              <p className="mt-10 flex gap-3 rounded-lg bg-paper-2 px-6 py-5 text-[1.0625rem] leading-relaxed text-n-600">
                <Info className="mt-1 size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                {SAMPLE_NOTICE}
              </p>
            ) : null}

            {job.summary ? (
              <p className="mt-12 max-w-[60ch] text-[1.375rem] leading-relaxed text-ink">{job.summary}</p>
            ) : null}

            {job.description && job.description !== job.summary ? (
              <Prose blocks={bodyBlocks(job.description)} className="mt-10 max-w-[64ch]" />
            ) : null}

            <JobList heading="What you will do" items={responsibilities} />
            <JobList heading="What you will need" items={qualifications} />

            {skills.length ? (
              <section className="mt-14">
                <h2 className="text-[clamp(1.5rem,2.4vw,1.875rem)] leading-snug">Skills</h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <li key={s} className="rounded-full border border-n-300 px-4 py-1.5 text-[0.9375rem] text-n-600">
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <footer className="mt-16 rounded-lg bg-white p-8 sm:p-10">
              <h2 className="text-[clamp(1.5rem,2.4vw,1.875rem)] leading-snug">Interested?</h2>
              <p className="mt-4 max-w-[48ch] text-lg text-n-500">
                Send us your details and resume. A recruiter reads every one and comes back to you
                either way.
              </p>
              <Button href={apply} className="mt-8">
                Apply for this role
                <ArrowRight strokeWidth={2} aria-hidden="true" />
              </Button>
            </footer>
          </article>
        </Container>
      </Section>
    </>
  );
}

function JobList({ heading, items }: { heading: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-14">
      <h2 className="text-[clamp(1.5rem,2.4vw,1.875rem)] leading-snug">{heading}</h2>
      <ul className="mt-6 list-disc space-y-3 pl-6 text-[1.125rem] leading-[1.7] text-n-600 marker:text-accent">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
