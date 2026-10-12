import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, ExternalLink, FileText, Mail, Phone } from "lucide-react";
import { requirePage } from "@/lib/admin/auth";
import { STATUSES, getApplication, lookingForLabel, resumeFile } from "@/lib/applications";
import { getJob } from "@/lib/admin/jobs";
import { removeApplication } from "@/app/admin/actions/applications";
import { ApplicationReview } from "@/components/admin/ApplicationReview";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Card, PageHeader, buttonClass, formatWhen } from "@/components/admin/ui";

export const metadata = { title: "Application" };

const NOTIFICATION: Record<string, { label: string; tone: string }> = {
  sent: { label: "Email sent", tone: "published" },
  paused: { label: "Recruiter email paused", tone: "sample" },
  failed: { label: "Recruiter email failed", tone: "rejected" },
};

function formatBytes(n: number | null) {
  if (!n) return "";
  return n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePage("job-applications");
  const id = Number((await params).id);
  const a = Number.isInteger(id) ? getApplication(id) : null;
  if (!a) notFound();
  const job = a.job_id ? getJob(a.job_id) : null;
  const hasResume = Boolean(resumeFile(a));
  const resumeUrl = `/api/admin/applications/${a.id}/resume`;
  const notice = NOTIFICATION[a.notification];

  const details: [string, React.ReactNode][] = [
    ["Reference", <span key="r" className="font-mono">{a.reference}</span>],
    [
      "Email",
      <a key="e" href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 break-all text-accent hover:underline">
        <Mail className="size-4 shrink-0" aria-hidden="true" />
        {a.email}
      </a>,
    ],
    [
      "Phone",
      a.phone ? (
        <a key="p" href={`tel:${a.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 text-accent hover:underline">
          <Phone className="size-4" aria-hidden="true" />
          {a.phone}
        </a>
      ) : (
        <span key="p" className="text-n-500 italic">Not provided</span>
      ),
    ],
    [
      "Applied for",
      job ? (
        <Link key="j" href={`/admin/jobs/${job.id}/edit`} className="text-accent hover:underline">{job.title}</Link>
      ) : a.job_title ? (
        <span key="j">{a.job_title} <span className="text-n-500">(job since removed)</span></span>
      ) : (
        <span key="j" className="text-n-500">General submission, not a specific job</span>
      ),
    ],
    ["Looking for", lookingForLabel(a.looking_for)],
    ["Kind of work", a.work || "Not provided"],
    ["Location", a.location || "Not provided"],
    ["Received", formatWhen(a.created_at)],
    ["Screening", a.screening || "Not recorded"],
  ];

  return (
    <>
      <PageHeader
        title={a.name || "Name not provided"}
        back={{ href: "/admin/job-applications", label: "Applications" }}
        description={`Last updated ${formatWhen(a.updated_at)}${a.source === "held" ? " · received while recruiter emails were paused" : ""}`}
        actions={
          <>
            <Badge tone={a.status}>{STATUSES.find((s) => s.id === a.status)?.label ?? a.status}</Badge>
            {notice ? <Badge tone={notice.tone}>{notice.label}</Badge> : null}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-ink">Candidate</h2>
            <dl className="mt-4 divide-y divide-n-200">
              {details.map(([label, value]) => (
                <div key={label} className="grid gap-1 py-3 sm:grid-cols-[160px_1fr]">
                  <dt className="text-sm font-semibold text-n-500">{label}</dt>
                  <dd className="text-[0.9375rem] text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-ink">Message</h2>
            {a.message ? (
              <p className="mt-3 text-[0.9375rem] leading-relaxed whitespace-pre-line text-ink">{a.message}</p>
            ) : (
              <p className="mt-3 text-[0.9375rem] text-n-500 italic">No message.</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-ink">Resume</h2>
            {hasResume ? (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 text-[0.9375rem] text-ink">
                  <FileText className="size-5 text-accent" aria-hidden="true" />
                  {a.resume_filename}
                  <span className="text-sm text-n-500">{formatBytes(a.resume_size)}</span>
                </span>
                <span className="flex gap-3">
                  {a.resume_type === "application/pdf" ? (
                    <a href={resumeUrl} target="_blank" rel="noopener" className={buttonClass.secondary}>
                      <ExternalLink className="size-4" aria-hidden="true" /> View
                    </a>
                  ) : null}
                  <a href={`${resumeUrl}?download=1`} className={buttonClass.primary}>
                    <Download className="size-4" aria-hidden="true" /> Download
                  </a>
                </span>
              </div>
            ) : a.resume_filename ? (
              <p className="mt-3 rounded-md bg-[#fde8e8] px-4 py-3 text-sm text-[#9b1c1c]">
                A resume ({a.resume_filename}) was sent, but the file is missing from the server.
              </p>
            ) : (
              <p className="mt-3 rounded-md bg-paper-2 px-4 py-3 text-[0.9375rem] text-n-600">No resume provided.</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <ApplicationReview
            id={a.id}
            status={a.status}
            notes={a.internal_notes}
            statuses={STATUSES.map((s) => ({ value: s.id, label: s.label }))}
          />
          {user.role === "admin" ? (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-ink">Delete</h2>
              <p className="mt-2 text-sm text-n-500">
                Removes this application and its resume permanently, for example when a candidate asks
                to be forgotten.
              </p>
              <form action={removeApplication} className="mt-4">
                <input type="hidden" name="recordId" value={a.id} />
                <ConfirmButton
                  message={`Delete ${a.name || "this application"} and their resume permanently? This cannot be undone.`}
                  className={buttonClass.danger}
                >
                  Delete application
                </ConfirmButton>
              </form>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}
