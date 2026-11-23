import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { requirePage } from "@/lib/admin/auth";
import { ENQUIRY_STATUSES, getEnquiry } from "@/lib/enquiries";
import { removeEnquiry } from "@/app/admin/actions/enquiries";
import { EnquiryReview } from "@/components/admin/EnquiryReview";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Card, PageHeader, buttonClass, formatWhen } from "@/components/admin/ui";

export const metadata = { title: "Enquiry" };

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePage("enquiries");
  const id = Number((await params).id);
  const e = Number.isInteger(id) ? getEnquiry(id) : null;
  if (!e) notFound();

  const details: [string, React.ReactNode][] = [
    ["Reference", <span key="r" className="font-mono">{e.reference}</span>],
    ["Contact", e.name],
    [
      "Email",
      <a key="e" href={`mailto:${e.email}?subject=${encodeURIComponent(`Your staffing request (${e.reference})`)}`} className="inline-flex items-center gap-1.5 break-all text-accent hover:underline">
        <Mail className="size-4 shrink-0" aria-hidden="true" />
        {e.email}
      </a>,
    ],
    [
      "Phone",
      e.phone ? (
        <a key="p" href={`tel:${e.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 text-accent hover:underline">
          <Phone className="size-4" aria-hidden="true" />
          {e.phone}
        </a>
      ) : (
        <span key="p" className="text-n-500 italic">Not provided</span>
      ),
    ],
    ["Need", e.need],
    ["Who they need", e.talent],
    ["How many", e.positions],
    ["Where", e.location],
    ["Service", e.service || "Not specified"],
    ["Industry", e.industry || "Not specified"],
    ["Received", formatWhen(e.created_at)],
  ];

  return (
    <>
      <PageHeader
        title={e.company}
        back={{ href: "/admin/enquiries", label: "Enquiries" }}
        description={`Last updated ${formatWhen(e.updated_at)}`}
        actions={
          <Badge tone={e.status === "new" ? "new" : e.status === "contacted" ? "shortlisted" : "draft"}>
            {ENQUIRY_STATUSES.find((s) => s.id === e.status)?.label}
          </Badge>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-ink">Enquiry</h2>
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
            <h2 className="text-lg font-bold text-ink">Details</h2>
            {e.details ? (
              <p className="mt-3 text-[0.9375rem] leading-relaxed whitespace-pre-line text-ink">{e.details}</p>
            ) : (
              <p className="mt-3 text-[0.9375rem] text-n-500 italic">No details given.</p>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          <EnquiryReview
            id={e.id}
            status={e.status}
            notes={e.internal_notes}
            statuses={ENQUIRY_STATUSES.map((s) => ({ value: s.id, label: s.label }))}
          />
          <Card className="p-6">
            <h2 className="text-lg font-bold text-ink">Delete</h2>
            <p className="mt-2 text-sm text-n-500">Removes this enquiry permanently, for example spam that got through.</p>
            <form action={removeEnquiry} className="mt-4">
              <input type="hidden" name="recordId" value={e.id} />
              <ConfirmButton message={`Delete the enquiry from ${e.company}? This cannot be undone.`} className={buttonClass.danger}>
                Delete enquiry
              </ConfirmButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
