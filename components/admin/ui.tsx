import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* Small building blocks for the admin, in the site's own palette and
   type: indigo shell, paper ground, white cards, orange actions. */

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-8">
      {back ? (
        <Link href={back.href} className="mb-4 inline-flex items-center gap-1 text-sm text-n-500 hover:text-ink">
          <ChevronLeft className="size-4" aria-hidden="true" />
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.875rem] leading-tight font-bold tracking-[-0.02em] text-ink">{title}</h1>
          {description ? <p className="mt-2 max-w-[70ch] text-[0.9375rem] text-n-500">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-n-200 bg-white", className)}>{children}</div>;
}

const BADGE: Record<string, string> = {
  published: "bg-[#e3f4ea] text-[#1d6b3f]",
  draft: "bg-paper-2 text-n-600",
  sample: "bg-[#fff3d6] text-[#7a5300]",
  new: "bg-[#e6ecff] text-[#2b3fa0]",
  reviewed: "bg-paper-2 text-n-600",
  shortlisted: "bg-[#fff0e6] text-[#9a4b14]",
  interview: "bg-[#efe6ff] text-[#5b2ea6]",
  rejected: "bg-[#fde8e8] text-[#9b1c1c]",
  closed: "bg-[#fde8e8] text-[#9b1c1c]",
  admin: "bg-ink text-white",
  hr: "bg-paper-2 text-n-600",
  disabled: "bg-[#fde8e8] text-[#9b1c1c]",
};

export function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", BADGE[tone] ?? BADGE.draft)}>
      {children}
    </span>
  );
}

export const buttonClass = {
  primary:
    "inline-flex h-10 items-center gap-2 rounded-md bg-orange px-4 text-sm font-semibold text-purple transition-colors hover:bg-orange-2 disabled:opacity-60",
  secondary:
    "inline-flex h-10 items-center gap-2 rounded-md border border-n-300 bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-ink disabled:opacity-60",
  danger:
    "inline-flex h-10 items-center gap-2 rounded-md border border-[#f3c4c4] bg-white px-4 text-sm font-semibold text-[#9b1c1c] transition-colors hover:bg-[#fde8e8] disabled:opacity-60",
  link: "text-sm font-semibold text-accent hover:underline",
};

export const inputClass =
  "h-10 w-full rounded-md border border-n-300 bg-white px-3 text-[0.9375rem] text-ink placeholder:text-n-400 focus:border-accent focus:outline-none";

/** A GET form for search and filters; works without JavaScript. */
export function FilterBar({ children, action }: { children: React.ReactNode; action: string }) {
  return (
    <form action={action} method="get" className="mb-5 flex flex-wrap items-end gap-3">
      {children}
      <button type="submit" className={buttonClass.secondary}>
        Apply
      </button>
    </form>
  );
}

export function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-40 flex-col gap-1 text-xs font-semibold tracking-wide text-n-500 uppercase">
      {label}
      {children}
    </label>
  );
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-[0.9375rem]">
        <thead>
          <tr className="border-b border-n-200 bg-paper">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-n-500 uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-n-200">{children}</tbody>
      </table>
    </Card>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <Card className="px-6 py-14 text-center text-n-500">
      <p className="mx-auto max-w-[50ch]">{children}</p>
    </Card>
  );
}

/** Page links that keep the current filters. */
export function Pagination({
  page,
  pages,
  total,
  base,
  params,
}: {
  page: number;
  pages: number;
  total: number;
  base: string;
  params: Record<string, string | undefined>;
}) {
  if (pages <= 1) return <p className="mt-4 text-sm text-n-500">{total} total</p>;
  const href = (p: number) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
    q.set("page", String(p));
    return `${base}?${q.toString()}`;
  };
  return (
    <nav className="mt-4 flex items-center justify-between text-sm text-n-500" aria-label="Pagination">
      <span>
        {total} total · page {page} of {pages}
      </span>
      <span className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={buttonClass.secondary}>
            <ChevronLeft className="size-4" aria-hidden="true" /> Previous
          </Link>
        ) : null}
        {page < pages ? (
          <Link href={href(page + 1)} className={buttonClass.secondary}>
            Next <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </span>
    </nav>
  );
}

/** "Oct 9, 2026, 3:22 PM" in US Central, the Dallas office's time. */
export function formatWhen(iso: string | null | undefined): string {
  if (!iso) return "Not set";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function formatDay(iso: string | null | undefined): string {
  if (!iso) return "Not set";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", month: "short", day: "numeric", year: "numeric" }).format(d);
}

/** Parses ?page= safely. */
export function pageNumber(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? Math.min(n, 100000) : 1;
}
