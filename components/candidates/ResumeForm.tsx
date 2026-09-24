"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Check, Paperclip, X } from "lucide-react";
import { submitCandidate } from "@/app/actions/candidate";
import { Button } from "@/components/ui/Button";
import {
  CANDIDATE_LOOKING_FOR,
  RESUME_ACCEPT,
  RESUME_MAX_BYTES,
  type CandidateState,
} from "@/lib/validation/candidate";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

const IDLE: CandidateState = { status: "idle" };

/* The job seeker form. Seven fields, one optional attachment, and no
   account to create. Nothing is stored: the action emails it to a
   recruiter and forgets it.

   Arriving from a job with `?role=` prefills what they are looking
   for, read from window.location rather than useSearchParams so the
   page stays static. */
export function ResumeForm() {
  const [state, action, pending] = useActionState(submitCandidate, IDLE);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [role, setRole] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("role");
    if (param) setRole(param);
  }, []);

  const errors = state.status === "error" ? state.errors : {};
  /* React resets the form once the action returns, so the defaults
     have to be whatever was last submitted or the person loses their
     answers to a single typo. */
  const was = state.status === "error" ? (state.values ?? {}) : {};

  if (state.status === "success") {
    return (
      <div className="rounded-lg bg-white p-8 sm:p-10">
        <span className="grid size-12 place-items-center rounded-full bg-orange text-purple">
          <Check className="size-6" strokeWidth={2} aria-hidden="true" />
        </span>
        <h3 className="mt-8 text-[clamp(1.5rem,2.6vw,2rem)] text-ink">Thanks. We have it.</h3>
        <p className="mt-4 max-w-[46ch] text-lg text-n-500">
          A recruiter will read this and come back to you, usually within a business day. Your
          reference is <span className="font-mono text-ink">{state.reference}</span>.
        </p>
        <p className="mt-4 max-w-[46ch] text-[0.9375rem] text-n-500">
          Nothing else is needed from you. If something changes in the meantime, email{" "}
          <a href={`mailto:${SITE.staffingEmail}`} className="link-underline text-ink">
            {SITE.staffingEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      noValidate
      className="rounded-lg bg-white p-8 sm:p-10"
      onSubmit={(e) => {
        const file = fileInput.current?.files?.[0];
        if (file && file.size > RESUME_MAX_BYTES) {
          e.preventDefault();
          setFileError("That file is over 5MB. Send a smaller one, or email it to us instead.");
        }
      }}
    >
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="mb-6 rounded-md bg-paper px-4 py-3 text-[0.9375rem] text-ink">
          {state.message}{" "}
          <a href={`mailto:${SITE.staffingEmail}`} className="underline">
            {SITE.staffingEmail}
          </a>
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          name="name"
          autoComplete="name"
          defaultValue={was.name ?? ""}
          error={errors.name}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          defaultValue={was.email ?? ""}
          error={errors.email}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          optional
          defaultValue={was.phone ?? ""}
          error={errors.phone}
        />
        <label className="block">
          <span className="block text-[0.9375rem] font-medium text-ink">
            What are you looking for?
          </span>
          <select
            name="lookingFor"
            defaultValue={was.lookingFor ?? "open"}
            className="mt-2 h-13 w-full rounded-md border border-n-300 bg-paper px-4 text-base text-ink focus-visible:border-accent"
          >
            {CANDIDATE_LOOKING_FOR.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="What kind of work?"
          name="work"
          defaultValue={was.work ?? role}
          placeholder='e.g. "accounts payable" or "forklift driver"'
          className="sm:col-span-2"
          error={errors.work}
        />
        <Field
          label="Where are you looking?"
          name="location"
          placeholder="City, state, or remote"
          autoComplete="address-level2"
          defaultValue={was.location ?? ""}
          className="sm:col-span-2"
          error={errors.location}
        />

        <div className="sm:col-span-2">
          <span className="block text-[0.9375rem] font-medium text-ink">
            Your resume <span className="font-normal text-n-500">(optional)</span>
          </span>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label
              htmlFor={`${id}-resume`}
              className="inline-flex h-13 cursor-pointer items-center gap-2 rounded-md border border-n-300 bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-purple"
            >
              <Paperclip className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Choose a file
            </label>
            <input
              ref={fileInput}
              id={`${id}-resume`}
              name="resume"
              type="file"
              accept={RESUME_ACCEPT}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFileError(
                  file && file.size > RESUME_MAX_BYTES
                    ? "That file is over 5MB. Send a smaller one, or email it to us instead."
                    : null,
                );
                setFileName(file ? file.name : null);
              }}
            />
            {fileName ? (
              <span className="inline-flex items-center gap-2 text-[0.9375rem] text-n-600">
                {fileName}
                <button
                  type="button"
                  aria-label="Remove the attached file"
                  onClick={() => {
                    if (fileInput.current) fileInput.current.value = "";
                    setFileName(null);
                    setFileError(null);
                  }}
                  className="grid size-6 place-items-center rounded-full text-n-400 hover:text-ink"
                >
                  <X className="size-4" strokeWidth={1.75} />
                </button>
              </span>
            ) : (
              <span className="text-[0.9375rem] text-n-500">PDF or Word, up to 5MB</span>
            )}
          </div>
          {(fileError ?? errors.resume) && (
            <p role="alert" className="mt-2 text-[0.875rem] text-danger">
              {fileError ?? errors.resume}
            </p>
          )}
        </div>

        <label className="block sm:col-span-2">
          <span className="block text-[0.9375rem] font-medium text-ink">
            Anything else? <span className="font-normal text-n-500">(optional)</span>
          </span>
          <textarea
            name="message"
            rows={3}
            defaultValue={was.message ?? ""}
            placeholder="Shifts you can work, notice period, anything we should know."
            className="mt-2 w-full rounded-md border border-n-300 bg-paper px-4 py-3 text-base text-ink placeholder:text-n-500 focus-visible:border-accent"
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[38ch] text-[0.875rem] text-n-500">
          We never charge you, and we never send your details to an employer without asking you
          first.
        </p>
        <Button type="submit" disabled={pending} className="min-w-44">
          {pending ? "Sending…" : "Send it"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  optional,
  className,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
}) {
  const id = `cand-${name}`;
  return (
    <label htmlFor={id} className={cn("block", className)}>
      <span className="block text-[0.9375rem] font-medium text-ink">
        {label} {optional && <span className="font-normal text-n-500">(optional)</span>}
      </span>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          "mt-2 h-13 w-full rounded-md border bg-paper px-4 text-base text-ink placeholder:text-n-500 focus-visible:border-accent",
          error ? "border-danger" : "border-n-300",
        )}
        {...input}
      />
      {error && (
        <span id={`${id}-err`} role="alert" className="mt-1.5 block text-[0.875rem] text-danger">
          {error}
        </span>
      )}
    </label>
  );
}
