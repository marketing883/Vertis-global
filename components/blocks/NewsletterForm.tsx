"use client";

import { useActionState, useId } from "react";
import { ArrowRight, Check } from "lucide-react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import type { NewsletterState } from "@/lib/validation/newsletter";
import { cn } from "@/lib/utils";

const IDLE: NewsletterState = { status: "idle" };

/* One field, one button. `tone` matches the surface it sits on. */
export function NewsletterForm({ tone = "ink", className }: { tone?: "ink" | "paper"; className?: string }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, IDLE);
  const id = useId();
  const onInk = tone === "ink";

  if (state.status === "success") {
    return (
      <p role="status" className={cn("flex items-center gap-3 text-[1.0625rem]", onInk ? "text-white" : "text-ink", className)}>
        <Check className="size-5 text-amber" strokeWidth={2} aria-hidden="true" />
        You are on the list. Watch for the next issue.
      </p>
    );
  }

  return (
    <form action={action} className={className} noValidate>
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          aria-invalid={state.status === "error" ? true : undefined}
          aria-describedby={state.status === "error" ? `${id}-err` : undefined}
          className={cn(
            "h-12 min-w-0 flex-1 rounded-md border px-4 text-base outline-none focus-visible:border-amber",
            onInk
              ? "border-white/20 bg-white/10 text-white placeholder:text-on-ink-muted"
              : "border-n-300 bg-white text-ink placeholder:text-n-500 focus-visible:border-accent",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Subscribe"
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-md transition-colors disabled:opacity-50",
            onInk ? "bg-orange text-purple hover:bg-amber" : "bg-orange text-purple hover:bg-orange-2",
          )}
        >
          <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.status === "error" && (
        <p id={`${id}-err`} role="alert" className={cn("mt-2 text-[0.875rem]", onInk ? "text-amber" : "text-danger")}>
          {state.message}
        </p>
      )}
    </form>
  );
}
