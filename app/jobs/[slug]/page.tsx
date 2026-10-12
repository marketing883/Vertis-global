import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobDetail } from "@/components/jobs/JobDetail";
import { getJobs, getPublishedJob } from "@/lib/data/jobs";

/* One job, as published from /admin/jobs. Drafts and unpublished jobs
   404 here; the admin previews them at /admin/jobs/<id>/preview. */

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;

export function generateStaticParams() {
  return getJobs().map((j) => ({ slug: j.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const job = getPublishedJob((await params).slug);
  if (!job) return {};
  const description = job.summary || job.description.slice(0, 160);
  return {
    title: `${job.title}, ${job.location}`,
    description,
    alternates: { canonical: `/jobs/${job.slug}` },
    openGraph: { type: "website", title: job.title, description },
  };
}

export default async function JobPage({ params }: { params: Params }) {
  const job = getPublishedJob((await params).slug);
  if (!job) notFound();

  return <JobDetail job={job} />;
}
