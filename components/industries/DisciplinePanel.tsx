"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import type { Discipline } from "@/config/industry-pages";
import { cn } from "@/lib/utils";

/* Disciplines, as a spec sheet rather than a list of job titles.

   ≥ lg  A rail of disciplines on the left, the selected one held in
         a sticky panel on the right, so the detail stays level with
         whichever discipline the reader is on.

   < lg  An accordion, one open at a time.

   The two states are separate on purpose. Sharing them let the
   accordion set null and blank the desktop panel, which is the same
   trap the homepage industries block fell into. */

export function DisciplinePanel({ disciplines }: { disciplines: Discipline[] }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0);
  const baseId = useId();
  const current = disciplines[active] ?? disciplines[0];

  if (!current) return null;

  return (
    <div>
      {/* ── Desktop ──────────────────────────────────────────── */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4" role="tablist" aria-label="Engineering disciplines">
          {disciplines.map((d, i) => {
            const selected = i === active;
            return (
              <button
                key={d.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  const n = disciplines.length;
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
                  "flex w-full items-center justify-between gap-4 border-b border-n-300/60 py-5 text-left transition-colors",
                  i === 0 && "border-t",
                )}
              >
                <span
                  className={cn(
                    "text-[1.125rem] font-medium transition-colors",
                    selected ? "text-ink" : "text-n-500",
                  )}
                >
                  {d.name}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px w-6 shrink-0 transition-colors",
                    selected ? "bg-accent" : "bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${active}`}
          className="lg:col-span-8 lg:sticky lg:top-32 lg:self-start"
        >
          <Detail key={current.id} discipline={current} layout="panel" className="reveal" />
        </div>
      </div>

      {/* ── Tablet and mobile ────────────────────────────────── */}
      <div className="border-t border-n-300/60 lg:hidden">
        {disciplines.map((d, i) => {
          const open = i === expanded;
          const btnId = `${baseId}-acc-btn-${i}`;
          const regionId = `${baseId}-acc-region-${i}`;
          return (
            <div key={d.id} className="border-b border-n-300/60">
              <h3 className="text-[1rem] font-normal">
                <button
                  type="button"
                  id={btnId}
                  aria-expanded={open}
                  aria-controls={regionId}
                  onClick={() => setExpanded(open ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span
                    className={cn(
                      "text-[1.125rem] font-medium transition-colors",
                      open ? "text-ink" : "text-n-500",
                    )}
                  >
                    {d.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full border transition-colors",
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
                  <Detail discipline={d} layout="accordion" className="pb-8" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* The photograph is the first thing in the detail, because it is
   the quickest proof that we know what the job looks like. In the
   sticky panel it stands beside the copy as a portrait; in the
   accordion it sits above, cropped square so a phone does not
   scroll through a tall picture before reaching the words. The
   picture is framed high because the face is in the upper third. */
function Detail({
  discipline,
  layout,
  className,
}: {
  discipline: Discipline;
  layout: "panel" | "accordion";
  className?: string;
}) {
  const photo = (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-paper-2",
        layout === "panel" ? "aspect-[3/4]" : "aspect-square sm:aspect-[3/2]",
      )}
    >
      <Image
        src={discipline.photo}
        alt={discipline.photoAlt}
        fill
        sizes={layout === "panel" ? "(min-width: 1280px) 340px, 28vw" : "(min-width: 640px) 90vw, 100vw"}
        className="object-cover object-[50%_28%]"
      />
    </div>
  );

  const copy = (
    <>
      <p className="max-w-[52ch] text-[clamp(1.125rem,1.7vw,1.375rem)] leading-relaxed text-ink">
        {discipline.builds}
      </p>
      <Facts discipline={discipline} />
    </>
  );

  if (layout === "panel") {
    return (
      <div className={cn("grid gap-10 lg:grid-cols-12", className)}>
        <div className="lg:col-span-5">{photo}</div>
        <div className="lg:col-span-7">{copy}</div>
      </div>
    );
  }

  return (
    <div className={className}>
      {photo}
      <div className="mt-7">{copy}</div>
    </div>
  );
}

function Facts({ discipline }: { discipline: Discipline }) {
  return (
    <>
      <dl className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="eyebrow">Seniority we fill</dt>
          <dd className="mt-3 text-[1.0625rem] text-n-600">{discipline.seniority}</dd>
        </div>
        <div>
          <dt className="eyebrow">Tools</dt>
          <dd className="mt-3 flex flex-wrap gap-2">
            {discipline.tools.map((tool) => (
              <span
                key={tool}
                className="inline-flex rounded-md border border-n-300 bg-white px-3 py-1.5 font-mono text-[0.8125rem] text-n-600"
              >
                {tool}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Standards</dt>
          <dd className="mt-3 flex flex-wrap gap-2">
            {discipline.standards.map((standard) => (
              <span
                key={standard}
                className="inline-flex rounded-md border border-n-300 bg-white px-3 py-1.5 font-mono text-[0.8125rem] text-n-600"
              >
                {standard}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </>
  );
}
