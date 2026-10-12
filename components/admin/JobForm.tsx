"use client";

import { useActionState } from "react";
import { saveJob, type JobFormState } from "@/app/admin/actions/jobs";
import { buttonClass, Card } from "@/components/admin/ui";
import { Select, TextArea, TextField } from "@/components/admin/Fields";
import { JOB_APPLICATIONS_INBOX } from "@/config/site";

type Option = { value: string; label: string };

export function JobForm({
  id,
  initial,
  status,
  isSample,
  options,
}: {
  id?: number;
  initial: Record<string, string>;
  status?: "draft" | "published";
  isSample?: boolean;
  options: { industries: Option[]; types: Option[]; levels: Option[]; arrangements: Option[] };
}) {
  const [state, action, pending] = useActionState<JobFormState, FormData>(saveJob, {});
  const v = state.values ?? initial;
  const e = state.errors ?? {};
  return (
    <form action={action} className="space-y-6">
      {/* Not name="id": an input called "id" shadows form.id, and React
          then drops the pressed button's "intent" from the form data. */}
      {id ? <input type="hidden" name="recordId" value={id} /> : null}
      {state.message ? (
        <p role="alert" className="rounded-md bg-[#fde8e8] px-4 py-3 text-sm text-[#9b1c1c]">{state.message}</p>
      ) : null}
      {state.saved ? (
        <p role="status" className="rounded-md bg-[#eefaf2] px-4 py-3 text-sm text-[#1d6b3f]">{state.saved}</p>
      ) : null}

      <Card className="grid gap-5 p-6 md:grid-cols-2">
        <TextField name="title" label="Job title" required defaultValue={v.title} error={e.title} className="md:col-span-2" />
        <TextField
          name="summary"
          label="Summary"
          defaultValue={v.summary}
          error={e.summary}
          help="One or two sentences. Shown in job lists and at the top of the job page."
          className="md:col-span-2"
        />
        <Select name="industry" label="Industry" required options={options.industries} placeholder="Choose…" defaultValue={v.industry} error={e.industry} />
        <TextField name="location" label="Location" required placeholder="City, ST or Remote, United States" defaultValue={v.location} error={e.location} />
        <Select name="employment_type" label="Employment type" required options={options.types} placeholder="Choose…" defaultValue={v.employment_type} error={e.employment_type} />
        <Select name="level" label="Experience level" required options={options.levels} placeholder="Choose…" defaultValue={v.level} error={e.level} />
        <Select name="arrangement" label="Work arrangement" required options={options.arrangements} placeholder="Choose…" defaultValue={v.arrangement} error={e.arrangement} />
        <TextField name="schedule" label="Schedule note" placeholder="e.g. nights, second shift" defaultValue={v.schedule} error={e.schedule} help='Optional. Shown after the arrangement: "On site, nights".' />
      </Card>

      <Card className="grid gap-5 p-6 md:grid-cols-2">
        <h2 className="text-base font-semibold text-ink md:col-span-2">Settings</h2>
        <TextField
          name="deadline"
          label="Application deadline (optional)"
          type="date"
          defaultValue={v.deadline}
          error={e.deadline}
          help="Last day to apply, US Central. After it the job leaves the listings and its page says applications have closed."
        />
        <TextField
          name="notify_emails"
          label="Notification email(s)"
          placeholder={JOB_APPLICATIONS_INBOX}
          defaultValue={v.notify_emails}
          error={e.notify_emails}
          help={`Each application to this job is emailed here, with the resume. Comma-separate multiple addresses. Leave blank to send to ${JOB_APPLICATIONS_INBOX}.`}
        />
      </Card>

      <Card className="grid gap-5 p-6">
        <TextArea
          name="description"
          label="Description"
          rows={8}
          defaultValue={v.description}
          error={e.description}
          help="The role in plain words. Leave a blank line between paragraphs."
        />
        <TextArea name="responsibilities" label="Responsibilities" defaultValue={v.responsibilities} error={e.responsibilities} help="One per line." />
        <TextArea name="qualifications" label="Qualifications" defaultValue={v.qualifications} error={e.qualifications} help="One per line." />
        <TextArea name="skills" label="Skills" rows={3} defaultValue={v.skills} error={e.skills} help="Separate with commas or new lines." />
        {isSample ? (
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="is_sample" defaultChecked className="mt-1 size-4 accent-[#2b276b]" />
            <span>
              <span className="font-semibold">Representative sample, not a live vacancy.</span>
              <span className="block text-n-500">
                One of the original example roles. While any published job is a sample, the jobs page says these are
                representative. Untick when this becomes a real opening.
              </span>
            </span>
          </label>
        ) : null}
      </Card>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-n-200 bg-paper/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
        {!id || status === "draft" ? (
          <>
            <button type="submit" name="intent" value="publish" disabled={pending} className={buttonClass.primary}>
              {pending ? "Saving…" : "Publish"}
            </button>
            <button type="submit" name="intent" value="draft" disabled={pending} className={buttonClass.secondary}>
              Save draft
            </button>
          </>
        ) : (
          <>
            <button type="submit" name="intent" value="save" disabled={pending} className={buttonClass.primary}>
              {pending ? "Saving…" : "Save changes"}
            </button>
            <button type="submit" name="intent" value="draft" disabled={pending} className={buttonClass.secondary}>
              Save and unpublish
            </button>
          </>
        )}
        <span className="text-xs text-n-500">Fields marked * are required.</span>
      </div>
    </form>
  );
}
