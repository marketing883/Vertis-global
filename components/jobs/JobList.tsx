"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ALL_INDUSTRIES } from "@/config/industries";
import { JOB_TYPES, formatPosted, jobTypeLabel, type Job } from "@/config/jobs";
import { cn } from "@/lib/utils";

/* Filter by arrangement and by industry, then read the list. No
   search box: fourteen roles do not need one, and an empty search is
   a worse experience than a short list you can scan.

   Each row goes to the job seeker form with the role carried in the
   query, so the person does not retype what they just clicked. */

const ALL = "all";

export function JobList({ jobs }: { jobs: Job[] }) {
  const [type, setType] = useState<string>(ALL);
  const [industry, setIndustry] = useState<string>(ALL);

  const industriesInUse = useMemo(() => {
    const used = new Set(jobs.map((j) => j.industry));
    return ALL_INDUSTRIES.filter((i) => used.has(i.slug));
  }, [jobs]);

  const shown = useMemo(
    () =>
      jobs.filter(
        (j) => (type === ALL || j.type === type) && (industry === ALL || j.industry === industry),
      ),
    [jobs, type, industry],
  );

  const filters = [{ id: ALL, label: "All roles" }, ...JOB_TYPES.map((t) => ({ id: t.id, label: t.label }))];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <div
          role="group"
          aria-label="Filter by type of work"
          className="-mx-6 flex snap-x snap-mandatory gap-x-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {filters.map((f) => {
            const selected = f.id === type;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setType(f.id)}
                className={cn(
                  "shrink-0 snap-start rounded-full border px-5 py-2.5 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200",
                  selected
                    ? "border-purple bg-purple text-white"
                    : "border-n-300 text-n-600 hover:border-purple hover:text-ink",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-3">
          <span className="text-[0.9375rem] text-n-500">Industry</span>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="h-11 rounded-md border border-n-300 bg-white px-4 text-[0.9375rem] text-ink focus-visible:border-accent"
          >
            <option value={ALL}>All industries</option>
            {industriesInUse.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="tabular mt-8 text-[0.9375rem] text-n-500" aria-live="polite">
        {shown.length} {shown.length === 1 ? "role" : "roles"}
      </p>

      {shown.length === 0 ? (
        <p className="mt-10 border-t border-n-200 pt-10 text-lg text-n-500">
          Nothing listed under that combination today. Tell us what you are after and we will
          come back to you when something fits.
        </p>
      ) : (
        <ul className="mt-6 border-t border-n-200">
          {shown.map((job) => {
            const industryName =
              ALL_INDUSTRIES.find((i) => i.slug === job.industry)?.name ?? job.industry;
            return (
              <li key={job.id} className="border-b border-n-200">
                <Link
                  href={`/candidates?role=${encodeURIComponent(job.title)}#submit-resume`}
                  className="group grid gap-y-3 py-8 transition-colors hover:bg-white md:grid-cols-12 md:items-center md:gap-8 md:px-6 lg:py-9"
                >
                  <div className="min-w-0 md:col-span-7">
                    <h3 className="text-[clamp(1.25rem,2vw,1.625rem)] text-ink transition-colors group-hover:text-accent">
                      {job.title}
                    </h3>
                    <p className="mt-2 text-[1.0625rem] text-n-500">
                      {industryName}
                      <span aria-hidden="true"> · </span>
                      {job.location}
                      <span aria-hidden="true"> · </span>
                      {job.arrangement}
                    </p>
                    <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-n-500">
                      {job.summary}
                    </p>
                  </div>

                  <div className="md:col-span-3">
                    <span className="inline-flex rounded-full border border-n-300 px-4 py-1.5 text-[0.875rem] font-medium text-n-600">
                      {jobTypeLabel(job.type)}
                    </span>
                    <p className="tabular mt-3 text-[0.875rem] text-n-500">
                      {formatPosted(job.posted)}
                    </p>
                  </div>

                  <span className="link-underline text-[1.0625rem] text-ink md:col-span-2 md:justify-self-end">
                    Register interest
                    <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
