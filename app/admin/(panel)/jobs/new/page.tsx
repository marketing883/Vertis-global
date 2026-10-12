import { requirePage } from "@/lib/admin/auth";
import { JOB_OPTIONS } from "@/lib/admin/options";
import { JobForm } from "@/components/admin/JobForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "New job" };

export default async function NewJobPage() {
  await requirePage("jobs");
  return (
    <>
      <PageHeader title="New job" back={{ href: "/admin/jobs", label: "Job Listings" }} />
      <JobForm initial={{}} options={JOB_OPTIONS} />
    </>
  );
}
