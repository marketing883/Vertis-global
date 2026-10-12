import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Eye } from "lucide-react";
import { requirePage } from "@/lib/admin/auth";
import { getJob } from "@/lib/admin/jobs";
import { isClosed } from "@/lib/data/jobs";
import { JOB_OPTIONS } from "@/lib/admin/options";
import { removeJob } from "@/app/admin/actions/jobs";
import { JobForm } from "@/components/admin/JobForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, PageHeader, buttonClass, formatWhen } from "@/components/admin/ui";

export const metadata = { title: "Edit job" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditJobPage({ params, searchParams }: Props) {
  await requirePage("jobs");
  const job = getJob(Number((await params).id));
  if (!job) notFound();
  const { saved } = await searchParams;
  const initial = {
    title: job.title,
    summary: job.summary,
    description: job.description,
    responsibilities: job.responsibilities,
    qualifications: job.qualifications,
    skills: job.skills,
    industry: job.industry,
    location: job.location,
    employment_type: job.employment_type,
    level: job.level,
    arrangement: job.arrangement,
    schedule: job.schedule,
    deadline: job.deadline ?? "",
    notify_emails: job.notify_emails,
  };

  return (
    <>
      <PageHeader
        title={job.title}
        back={{ href: "/admin/jobs", label: "Job Listings" }}
        description={`Created ${formatWhen(job.created_at)} · last saved ${formatWhen(job.updated_at)}${job.posted_at ? ` · first published ${formatWhen(job.posted_at)}` : ""}`}
        actions={
          <>
            <Badge tone={job.status}>{job.status === "published" ? "Published" : "Draft"}</Badge>
            {job.status === "published" && isClosed(job) ? <Badge tone="closed">Closed</Badge> : null}
            <Link href={`/admin/jobs/${job.id}/preview`} className={buttonClass.secondary}>
              <Eye className="size-4" aria-hidden="true" /> Preview
            </Link>
            {job.status === "published" ? (
              <a href={`/jobs/${job.slug}`} target="_blank" rel="noopener" className={buttonClass.secondary}>
                <ExternalLink className="size-4" aria-hidden="true" /> View live
              </a>
            ) : null}
          </>
        }
      />
      {saved ? (
        <p role="status" className="mb-6 rounded-md bg-[#eefaf2] px-4 py-3 text-sm text-[#1d6b3f]">
          {saved === "published" ? "Job created and published." : "Job created as a draft."}
        </p>
      ) : null}
      <JobForm id={job.id} initial={initial} status={job.status} isSample={job.is_sample === 1} options={JOB_OPTIONS} />

      <form action={removeJob} className="mt-10 border-t border-n-200 pt-6">
        <input type="hidden" name="recordId" value={job.id} />
        <p className="mb-3 text-sm text-n-500">
          Deleting removes the job from the site. Applications to it are kept, with the job title.
        </p>
        <ConfirmButton message={`Delete "${job.title}"? This cannot be undone.`} className={buttonClass.danger}>
          Delete job
        </ConfirmButton>
      </form>
    </>
  );
}
