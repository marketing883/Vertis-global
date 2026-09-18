"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* The accordion, in one place at last. One open at a time, height
   animated from 0fr to 1fr so nothing is measured, and `inert` plus
   `aria-hidden` rather than `hidden` so the close still animates.

   Third time this mechanic was written on this site, so it is a
   component now. The mobile industries accordion is deliberately NOT
   folded in here: its rows carry a heading and a list of links, not a
   question and an answer, and generalising far enough to cover it
   would mean a render prop rewrite of the busiest component on the
   site for nothing a visitor would notice. */

export function Faq({
  items,
  className,
  defaultOpen = 0,
}: {
  items: readonly { q: string; a: string }[];
  className?: string;
  /** Index open on first render. Pass null to open none. */
  defaultOpen?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn("border-t border-n-200", className)}>
      {items.map((item, i) => {
        const open = i === openIndex;
        const btnId = `${baseId}-faq-btn-${i}`;
        const regionId = `${baseId}-faq-region-${i}`;
        return (
          <div key={item.q} className="border-b border-n-200">
            <h3 className="text-[1rem] font-normal">
              <button
                type="button"
                id={btnId}
                aria-expanded={open}
                aria-controls={regionId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-8 py-7 text-left"
              >
                <span
                  className={cn(
                    "font-display text-[clamp(1.125rem,1.9vw,1.5rem)] leading-snug font-bold tracking-[-0.02em] transition-colors duration-300",
                    open ? "text-ink" : "text-n-600",
                  )}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                    open ? "border-ink text-ink" : "border-n-300 text-n-400",
                  )}
                >
                  {open ? (
                    <Minus className="size-4" strokeWidth={1.75} />
                  ) : (
                    <Plus className="size-4" strokeWidth={1.75} />
                  )}
                </span>
              </button>
            </h3>

            <div
              id={regionId}
              role="region"
              aria-labelledby={btnId}
              inert={!open}
              aria-hidden={!open}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="max-w-[68ch] pb-8 text-[1.0625rem] leading-relaxed text-n-500">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
