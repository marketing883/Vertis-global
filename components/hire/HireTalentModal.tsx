"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { submitInquiry } from "@/app/actions/inquiry";
import { Button } from "@/components/ui/Button";
import {
  INQUIRY_NEEDS,
  POSITION_COUNTS,
  type InquiryNeed,
  type InquiryState,
} from "@/lib/validation/inquiry";
import { ALL_INDUSTRIES } from "@/config/industries";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

/* CLICK → CHOOSE NEED → SHORT FORM → LEAD.

   Step 1 asks one question with four plain answers. Step 2 is eight
   fields, three of them optional. Step 3 says thank you and what
   happens next. Nothing here requires an account, a login or a
   second page. */

const IDLE: InquiryState = { status: "idle" };

export function HireTalentModal({
  open,
  onClose,
  industry = null,
  service = null,
  serviceName = null,
  initialNeed = null,
}: {
  open: boolean;
  onClose: () => void;
  /** Industry slug, when the visitor came from the explorer. */
  industry?: string | null;
  /** Service slug, when the visitor came from a service page. */
  service?: string | null;
  /** That service's display name, for the one line of confirmation. */
  serviceName?: string | null;
  /** Skips step one when the page already implies the need. */
  initialNeed?: InquiryNeed | null;
}) {
  const [need, setNeed] = useState<InquiryNeed | null>(initialNeed);
  const chosen = ALL_INDUSTRIES.find((i) => i.slug === industry) ?? null;
  const [state, action, pending] = useActionState(submitInquiry, IDLE);
  const panel = useRef<HTMLDivElement>(null);

  /* Returning null when closed does not unmount this component, so
     the step has to be reset explicitly on every open. A service page
     supplies the need, everywhere else starts at step one. */
  useEffect(() => {
    if (open) setNeed(initialNeed);
  }, [open, initialNeed]);

  /* Body scroll lock, Esc, focus trap */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("button, input, select, textarea");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const f = panel.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input, select, textarea, a[href]',
      );
      if (!f?.length) return;
      const a = f[0]!;
      const b = f[f.length - 1]!;
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        b.focus();
      } else if (!e.shiftKey && document.activeElement === b) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const step = state.status === "success" ? 3 : need ? 2 : 1;
  const errors = state.status === "error" ? state.errors : {};
  /* React resets the form once the action returns, so the defaults
     have to be whatever was last submitted or a single typo costs
     the visitor all eight fields. */
  const was = state.status === "error" ? (state.values ?? {}) : {};

  return (
    <div
      className="fixed inset-0 z-[500] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hire-title"
    >
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} aria-hidden="true" />

      <div
        ref={panel}
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-lg bg-paper sm:rounded-lg motion-safe:animate-[reveal_320ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <p className="eyebrow">
            {step === 3 ? "Sent" : `Step ${step} of 2`}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 grid size-11 place-items-center rounded-md text-n-500 hover:text-ink"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 pt-4 pb-8 sm:px-10 sm:pb-10">
          {step === 1 && (
            <>
              <h2 id="hire-title" className="text-[clamp(1.75rem,3vw,2.5rem)]">
                How can we help?
              </h2>
              <p className="mt-4 max-w-[44ch] text-lg text-n-500">
                {chosen
                  ? `Hiring in ${chosen.name}. Pick the closest fit and you can tell us more on the next step.`
                  : "Pick the closest fit. You can tell us more on the next step."}
              </p>

              <ul className="mt-9 space-y-3">
                {INQUIRY_NEEDS.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => setNeed(n.id)}
                      className="group flex w-full items-center justify-between gap-6 rounded-md bg-white px-6 py-5 text-left transition-colors hover:bg-ink hover:text-white"
                    >
                      <span>
                        <span className="block text-lg font-medium">{n.title}</span>
                        <span className="mt-1 block text-[0.9375rem] text-n-500 group-hover:text-white/70">
                          {n.line}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-5 shrink-0 text-n-400 transition-transform group-hover:translate-x-1 group-hover:text-white"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === 2 && need && (
            <form action={action} noValidate>
              <input type="hidden" name="need" value={need} />
              {/* The service is a statement the visitor already made by
                  navigating to that page, so it travels with the lead
                  without taking up an eleventh control. Changing your
                  mind should change the page, and the compare section
                  on every service page is how. */}
              {service ? <input type="hidden" name="service" value={service} /> : null}
              {/* Honeypot — hidden from people, tempting to bots */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label>
                  Website <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <button
                type="button"
                onClick={() => setNeed(null)}
                className="link-underline text-[0.9375rem] text-n-500"
              >
                <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
                {INQUIRY_NEEDS.find((n) => n.id === need)?.title}
              </button>

              <h2 id="hire-title" className="mt-5 text-[clamp(1.75rem,3vw,2.5rem)]">
                Tell us a little about it.
              </h2>
              <p className="mt-4 max-w-[44ch] text-lg text-n-500">
                {serviceName ? `About ${serviceName.toLowerCase()}. ` : ""}A person reads
                every one of these, usually within a business day.
              </p>

              {state.status === "error" && state.message && (
                <p role="alert" className="mt-6 rounded-md bg-white px-4 py-3 text-[0.9375rem] text-ink">
                  {state.message}{" "}
                  <a href={`mailto:${SITE.staffingEmail}`} className="underline">
                    {SITE.staffingEmail}
                  </a>
                </p>
              )}

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Your name"
                  name="name"
                  autoComplete="name"
                  defaultValue={was.name ?? ""}
                  error={errors.name}
                />
                <Field
                  label="Company"
                  name="company"
                  autoComplete="organization"
                  defaultValue={was.company ?? ""}
                  error={errors.company}
                />
                <Field
                  label="Work email"
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
                <Field
                  label="Who do you need?"
                  name="talent"
                  placeholder='e.g. "two forklift operators" or "a nurse"'
                  className="sm:col-span-2"
                  defaultValue={was.talent ?? ""}
                  error={errors.talent}
                />
                {/* Pre-selected when the visitor came from the industry
                    explorer, and still changeable. The modal unmounts
                    when closed, so defaultValue is correct on reopen. */}
                <label className="block sm:col-span-2">
                  <span className="block text-[0.9375rem] font-medium text-ink">
                    Industry <span className="font-normal text-n-500">(optional)</span>
                  </span>
                  <select
                    name="industry"
                    defaultValue={was.industry ?? chosen?.slug ?? ""}
                    className="mt-2 h-13 w-full rounded-md border border-n-300 bg-white px-4 text-base text-ink focus-visible:border-accent"
                  >
                    <option value="">Select an industry</option>
                    {ALL_INDUSTRIES.map((i) => (
                      <option key={i.slug} value={i.slug}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Where"
                  name="location"
                  placeholder="City, state, or remote"
                  autoComplete="address-level2"
                  defaultValue={was.location ?? ""}
                  error={errors.location}
                />
                <label className="block">
                  <span className="block text-[0.9375rem] font-medium text-ink">How many people?</span>
                  <select
                    name="positions"
                    defaultValue="1"
                    className="mt-2 h-13 w-full rounded-md border border-n-300 bg-white px-4 text-base text-ink focus-visible:border-accent"
                  >
                    {POSITION_COUNTS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="block text-[0.9375rem] font-medium text-ink">
                    Anything else? <span className="font-normal text-n-500">(optional)</span>
                  </span>
                  <textarea
                    name="details"
                    rows={3}
                    className="mt-2 w-full rounded-md border border-n-300 bg-white px-4 py-3 text-base text-ink focus-visible:border-accent"
                  />
                </label>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-[36ch] text-[0.875rem] text-n-500">
                  We'll only use this to reply to you. No lists, no newsletters.
                </p>
                <Button type="submit" disabled={pending} className="min-w-44">
                  {pending ? "Sending…" : "Send request"}
                </Button>
              </div>
            </form>
          )}

          {step === 3 && state.status === "success" && (
            <div className="py-6">
              <span className="grid size-12 place-items-center rounded-full bg-orange text-purple">
                <Check className="size-6" strokeWidth={2} aria-hidden="true" />
              </span>
              <h2 id="hire-title" className="mt-8 text-[clamp(1.75rem,3vw,2.5rem)]">
                Thanks. We've got it.
              </h2>
              <p className="mt-4 max-w-[44ch] text-lg text-n-500">
                Someone from our team will be in touch within a business day. Your
                reference is{" "}
                <span className="font-mono text-ink">{state.reference}</span>.
              </p>
              <p className="mt-4 max-w-[44ch] text-[0.9375rem] text-n-500">
                Need us sooner? Email{" "}
                <a href={`mailto:${SITE.staffingEmail}`} className="underline">
                  {SITE.staffingEmail}
                </a>
                .
              </p>
              <Button onClick={onClose} variant="outline" className="mt-9">
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
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
  const id = `inq-${name}`;
  return (
    <label htmlFor={id} className={cn("block", className)}>
      <span className="block text-[0.9375rem] font-medium text-ink">
        {label}{" "}
        {optional && <span className="font-normal text-n-500">(optional)</span>}
      </span>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          "mt-2 h-13 w-full rounded-md border bg-white px-4 text-base text-ink placeholder:text-n-500 focus-visible:border-accent",
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
