"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ALL_INDUSTRIES, INDUSTRY_GROUPS } from "@/config/industries";
import { cn } from "@/lib/utils";

/* The explorer. Filter by group, scan the whole list, pick one.
   Every industry now has its own page, so a row is simply a link.

   Arriving from elsewhere with `?industry=<slug>` (the homepage list)
   filters to that industry's group and highlights it. A `#<group-id>`
   hash (the header dropdown) selects that group. Both are read from
   `window.location` on mount rather than through useSearchParams, so
   the page stays fully static and renders the whole list on the
   server with no Suspense fallback in the middle of the section. */

const ALL = "all";

export function IndustryExplorer() {
  const [group, setGroup] = useState<string>(ALL);
  const [highlight, setHighlight] = useState<string | null>(null);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("industry");
    const hash = window.location.hash.replace("#", "");
    if (slug) {
      const owner = INDUSTRY_GROUPS.find((g) => g.industries.some((i) => i.slug === slug));
      if (owner) {
        setGroup(owner.id);
        setHighlight(slug);
        return;
      }
    }
    if (hash && INDUSTRY_GROUPS.some((g) => g.id === hash)) setGroup(hash);
  }, []);

  /* Bring the highlighted row to the middle of the viewport, which
     also supersedes the browser's own jump to #explorer. */
  useEffect(() => {
    if (!highlight) return;
    const el = document.getElementById(`industry-${highlight}`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, [highlight]);

  const filters = useMemo(
    () => [
      { id: ALL, name: "All industries", count: ALL_INDUSTRIES.length },
      ...INDUSTRY_GROUPS.map((g) => ({ id: g.id, name: g.name, count: g.industries.length })),
    ],
    [],
  );

  const shown = useMemo(() => {
    if (group === ALL) return ALL_INDUSTRIES;
    return INDUSTRY_GROUPS.find((g) => g.id === group)?.industries ?? ALL_INDUSTRIES;
  }, [group]);

  const active = INDUSTRY_GROUPS.find((g) => g.id === group);

  return (
    <div>
      {/* Below sm the five labels would stack five deep, so the row
          scrolls sideways instead, bleeding into the gutter so the
          last chip is visibly cut off and reads as scrollable. */}
      <div
        role="group"
        aria-label="Filter industries"
        className="-mx-6 flex snap-x snap-mandatory gap-x-2 gap-y-3 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
      >
        {filters.map((f) => {
          const selected = f.id === group;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setGroup(f.id);
                setHighlight(null);
              }}
              className={cn(
                "shrink-0 snap-start rounded-full border px-5 py-2.5 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200",
                selected
                  ? "border-purple bg-purple text-white"
                  : "border-n-300 text-n-600 hover:border-purple hover:text-ink",
              )}
            >
              {f.name}
              <span className={cn("tabular ml-2", selected ? "text-white/70" : "text-n-500")}>
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-8 text-[1.0625rem] text-n-500" aria-live="polite">
        {active ? active.tagline : "Every kind of work, from the front line to the specialist."}
      </p>

      <ul className="mt-10 grid gap-x-10 border-t border-n-200 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((ind) => {
          const lit = ind.slug === highlight;
          const inner = (
            <>
              <span className="flex w-full items-start justify-between gap-4">
                <span
                  className={cn(
                    "font-display text-[1.375rem] leading-tight font-bold tracking-[-0.02em] transition-colors group-hover:text-accent",
                    lit ? "text-accent" : "text-ink",
                  )}
                >
                  {ind.name}
                </span>
                <ArrowUpRight
                  className={cn(
                    "mt-1 size-4 shrink-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent",
                    lit ? "text-accent" : "text-n-300",
                  )}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </span>
              <span className="mt-3 text-[0.9375rem] leading-relaxed text-n-500">{ind.line}</span>
            </>
          );
          const cls = cn(
            "group flex w-full flex-col items-start py-7 text-left transition-[padding,border-color] duration-300",
            lit && "border-l-2 border-accent pl-4",
          );

          return (
            <li key={ind.slug} id={`industry-${ind.slug}`} className="border-b border-n-200">
              <Link href={`/industries/${ind.slug}`} className={cls}>
                {inner}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
