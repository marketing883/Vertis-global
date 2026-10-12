import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePage } from "@/lib/admin/auth";
import { getJob } from "@/lib/admin/jobs";
import { JobDetail } from "@/components/jobs/JobDetail";
import { buttonClass } from "@/components/admin/ui";

export const metadata = { title: "Preview job" };

export default async function PreviewJobPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePage("jobs");
  const job = getJob(Number((await params).id));
  if (!job) notFound();
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f3d9a4] bg-[#fff8e8] px-4 py-3 text-sm">
        <span>
          <strong>Preview.</strong>{" "}
          {job.status === "published" ? "This is how the job looks on the site." : "Draft: not visible on the site until published."}
        </span>
        <Link href={`/admin/jobs/${job.id}/edit`} className={buttonClass.secondary}>Back to editing</Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-n-200">
        <JobDetail job={job} />
      </div>
    </>
  );
}
