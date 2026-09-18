"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { INDUSTRY_GROUPS, INDUSTRY_COUNT, type IndustryGroup } from "@/config/industries";
import { cn } from "@/lib/utils";

/* Two behaviours, one component.

   ≥ lg  Two columns. Categories on the left, the selected category's
         industries on the right. The right column is sticky, so it
         stays level with whichever category the visitor is on.

   < lg  An accordion. Industries open directly beneath the category
         that was tapped, one at a time. Height animates with a
         grid-template-rows transition, so nothing is measured and
         nothing jumps.

   Both trees are rendered; the inactive one is `hidden`, which also
   removes it from the accessibility tree. */

export function Industries() {
  /* Two independent pieces of state on purpose. The desktop tab list
     always has a selection; the accordion may have nothing open.
     Sharing one value let the accordion set -1 and crash the desktop
     panel on `INDUSTRY_GROUPS[-1].id`. */
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0);
  const baseId = useId();
  const group = INDUSTRY_GROUPS[active] ?? INDUSTRY_GROUPS[0]!;

  return (
    <Section background="paper" id="industries">
      <Container>
        <div className="max-w-[900px]">
          <Eyebrow>Industries we serve</Eyebrow>
          {/* max-w lives on the h2 itself so `ch` resolves against the
              heading's own size, not the body copy. */}
          <h2 className="mt-7 max-w-[20ch]">
            From the people who keep a hospital running to the teams building
            the next chip.
          </h2>
        </div>

        {/* ── Desktop: two columns ─────────────────────────────── */}
        <div className="mt-16 hidden lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5" role="tablist" aria-label="Industry groups">
            {INDUSTRY_GROUPS.map((g, i) => {
              const selected = i === active;
              return (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    const n = INDUSTRY_GROUPS.length;
                    const to =
                      e.key === "ArrowDown" ? (i + 1) % n
                      : e.key === "ArrowUp" ? (i - 1 + n) % n
                      : e.key === "Home" ? 0
                      : e.key === "End" ? n - 1
                      : null;
                    if (to === null) return;
                    e.preventDefault();
                    setActive(to);
                    document.getElementById(`${baseId}-tab-${to}`)?.focus();
                  }}
                  className={cn(
                    "block w-full border-b border-n-200 py-6 text-left",
                    i === 0 && "border-t",
                  )}
                >
                  <GroupLabel group={g} selected={selected} />
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${active}`}
            className="lg:sticky lg:top-32 lg:col-span-7 lg:self-start"
          >
            <IndustryList key={group.id} group={group} className="reveal sm:grid-cols-2" />
            <Link href="/industries" className="link-underline mt-10 text-[1.0625rem]">
              All {INDUSTRY_COUNT} industries
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ── Tablet and mobile: accordion ─────────────────────── */}
        <div className="mt-14 border-t border-n-200 lg:hidden">
          {INDUSTRY_GROUPS.map((g, i) => {
            const open = i === expanded;
            const btnId = `${baseId}-acc-btn-${i}`;
            const regionId = `${baseId}-acc-region-${i}`;
            return (
              <div key={g.id} className="border-b border-n-200">
                <h3 className="text-[1rem] font-normal">
                  <button
                    type="button"
                    id={btnId}
                    aria-expanded={open}
                    aria-controls={regionId}
                    onClick={() => setExpanded(open ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <GroupLabel group={g} selected={open} />
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

                {/* 0fr → 1fr is the whole animation. No heights measured. */}
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
                    <IndustryList group={g} className="pb-6 pl-1" compact />
                  </div>
                </div>
              </div>
            );
          })}
          <Link href="/industries" className="link-underline mt-10 text-[1.0625rem]">
            All {INDUSTRY_COUNT} industries
            <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}

function GroupLabel({ group, selected }: { group: IndustryGroup; selected: boolean }) {
  return (
    <span className="block">
      <span
        className={cn(
          "font-display block text-[clamp(1.375rem,2.2vw,1.875rem)] leading-tight font-bold tracking-[-0.025em] transition-colors duration-300",
          selected ? "text-ink" : "text-n-400",
        )}
      >
        {group.name}
      </span>
      <span
        className={cn(
          "mt-1 block text-[0.9375rem] transition-colors duration-300",
          selected ? "text-n-500" : "text-n-400",
        )}
      >
        {group.tagline}
      </span>
    </span>
  );
}

function IndustryList({
  group,
  className,
  compact = false,
}: {
  group: IndustryGroup;
  className?: string;
  compact?: boolean;
}) {
  return (
    <ul className={cn("grid gap-x-10", className)}>
      {group.industries.map((ind) => (
        <li key={ind.slug} className={cn(!compact && "border-b border-n-200")}>
          {/* Every industry has its own page now, so go straight to it. */}
          <Link
            href={`/industries/${ind.slug}`}
            className={cn(
              "group flex items-center justify-between gap-4",
              compact ? "py-3" : "py-5",
            )}
          >
            <span
              className={cn(
                "font-medium text-ink transition-colors group-hover:text-accent",
                compact ? "text-[1.0625rem]" : "text-[1.25rem]",
              )}
            >
              {ind.name}
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-n-300 transition-all group-hover:translate-x-1 group-hover:text-accent"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
