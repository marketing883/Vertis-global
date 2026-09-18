import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";

/* A clean list, like a modern job board. The four featured roles
   are chosen to show the range — a nurse, a forklift operator, an
   admin, a developer. Placeholder data until the jobs listing lands. */
const JOBS = [
  { title: "Registered Nurse, Med/Surg", meta: "Charlotte, NC · Contract · Nights", posted: "2 days ago" },
  { title: "Forklift Operator", meta: "Dallas, TX · Temporary · Day shift", posted: "3 days ago" },
  { title: "Administrative Assistant", meta: "Chicago, IL · Contract-to-hire", posted: "5 days ago" },
  { title: "Senior Software Developer", meta: "Remote, US · Direct hire", posted: "1 week ago" },
];

export function FeaturedJobs() {
  return (
    <Section background="white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Looking for work?</Eyebrow>
            <h2 className="mt-7 max-w-[14ch]">Your next opportunity starts here.</h2>
          </div>
          <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
            Temporary, contract and permanent roles across every kind of work.
            Applying takes a few minutes, and you'll hear back from a person.
          </p>
        </div>

        <ul className="mt-16 border-t border-n-200 lg:mt-20">
          {JOBS.map((job) => (
            <li key={job.title} className="border-b border-n-200">
              <Link
                href="/jobs"
                className="group flex flex-col gap-3 py-8 transition-colors hover:bg-paper md:flex-row md:items-center md:gap-8 md:px-6 md:py-9"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-[clamp(1.375rem,2.2vw,1.875rem)] text-ink transition-colors group-hover:text-accent">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-[1.0625rem] text-n-500">{job.meta}</p>
                </div>
                <p className="shrink-0 text-[0.9375rem] text-n-400 md:w-32">{job.posted}</p>
                <ArrowUpRight
                  className="hidden size-6 shrink-0 text-n-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent md:block"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-5">
          <Link href="/jobs" className="link-underline text-[1.0625rem]">
            Browse all jobs
            <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
          <Link href="/candidates#submit-resume" className="link-underline text-[1.0625rem] text-n-500">
            Nothing fits yet? Send us your resume
          </Link>
        </div>
      </Container>
    </Section>
  );
}
