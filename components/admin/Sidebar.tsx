"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  ExternalLink,
  FileCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  UserCheck,
  UserCog,
  Users,
  Video,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { signOut } from "@/app/admin/actions/auth";
import { cn } from "@/lib/utils";

/* The admin navigation, grouped as ACI's is. Each link names the
   section the server checks (lib/admin/auth.ts canAccess), so a
   recruiter (hr) is only shown what they can open. */

type Item = { href: string; label: string; section: string; icon: typeof FileText };
const GROUPS: { label: string | null; items: Item[] }[] = [
  { label: null, items: [{ href: "/admin", label: "Dashboard", section: "", icon: LayoutDashboard }] },
  {
    label: "Content",
    items: [
      { href: "/admin/case-studies", label: "Case Studies", section: "case-studies", icon: FileText },
      { href: "/admin/blog", label: "Blog Posts", section: "blog", icon: BookOpen },
      { href: "/admin/whitepapers", label: "Whitepapers", section: "whitepapers", icon: FileCheck },
      { href: "/admin/webinars", label: "Webinars", section: "webinars", icon: Video },
      { href: "/admin/news", label: "News & Press", section: "news", icon: Newspaper },
    ],
  },
  {
    label: "Hiring",
    items: [
      { href: "/admin/jobs", label: "Job Listings", section: "jobs", icon: Briefcase },
      { href: "/admin/job-applications", label: "Applications", section: "job-applications", icon: UserCheck },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/users", label: "Users", section: "users", icon: Users },
      { href: "/admin/account", label: "My account", section: "account", icon: UserCog },
    ],
  },
];

export function Sidebar({
  user,
  allowed,
}: {
  user: { name: string; email: string; role: string };
  allowed: string[];
}) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-6" aria-label="Admin">
      {GROUPS.map((g) => {
        const items = g.items.filter((i) => allowed.includes(i.section));
        if (!items.length) return null;
        return (
          <div key={g.label ?? "top"}>
            {g.label ? (
              <p className="px-3 pb-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-on-ink-muted uppercase">
                {g.label}
              </p>
            ) : null}
            <ul className="space-y-0.5">
              {items.map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    onClick={() => setOpen(false)}
                    aria-current={active(i.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-[0.9375rem] transition-colors",
                      active(i.href) ? "bg-white/12 font-semibold text-white" : "text-on-ink-muted hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <i.icon className={cn("size-[18px]", active(i.href) && "text-amber")} strokeWidth={1.75} aria-hidden="true" />
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-white/10 px-5 py-4">
      <p className="truncate text-sm font-semibold text-white">{user.name}</p>
      <p className="truncate text-xs text-on-ink-muted">
        {user.email} · {user.role === "hr" ? "Recruiter" : "Admin"}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs text-on-ink-muted hover:text-white">
          View site <ExternalLink className="size-3" aria-hidden="true" />
        </a>
        <form action={signOut}>
          <button type="submit" className="inline-flex items-center gap-1 text-xs font-semibold text-on-ink-muted hover:text-white">
            <LogOut className="size-3.5" aria-hidden="true" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-ink px-4 lg:hidden">
        <Logo variant="light" className="h-6 w-auto" />
        <button type="button" onClick={() => setOpen(true)} className="text-white" aria-label="Open menu">
          <Menu className="size-6" />
        </button>
      </div>

      {open ? <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" /> : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo variant="light" className="h-7 w-auto" />
          </Link>
          <button type="button" onClick={() => setOpen(false)} className="text-white lg:hidden" aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>
        {nav}
        {footer}
      </aside>
    </>
  );
}
