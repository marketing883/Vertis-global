"use client";

import { useActionState } from "react";
import { saveApplicationReview, type ApplicationFormState } from "@/app/admin/actions/applications";
import { Card, buttonClass } from "@/components/admin/ui";
import { Select, TextArea } from "@/components/admin/Fields";

/* Status and internal notes for one application. Notes are for the
   team only: they never reach the candidate or leave the admin, except
   in an export someone chooses to run. */
export function ApplicationReview({
  id,
  status,
  notes,
  statuses,
}: {
  id: number;
  status: string;
  notes: string;
  statuses: { value: string; label: string }[];
}) {
  const [state, action, pending] = useActionState<ApplicationFormState, FormData>(saveApplicationReview, {});
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-ink">Review</h2>
      <form action={action} className="mt-4 space-y-5">
        <input type="hidden" name="recordId" value={id} />
        <Select name="status" label="Status" options={statuses} defaultValue={status} />
        <TextArea
          name="notes"
          label="Internal notes"
          rows={8}
          defaultValue={notes}
          placeholder="Calls, availability, pay expectations, next steps…"
          help="Visible to the hiring team only. Never shown to the candidate."
        />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={pending} className={buttonClass.primary}>
            {pending ? "Saving…" : "Save"}
          </button>
          {state.message ? (
            <span role={state.error ? "alert" : "status"} className={state.error ? "text-sm text-danger" : "text-sm text-[#1d6b3f]"}>
              {state.message}
            </span>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
