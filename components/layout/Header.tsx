"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import { PRIMARY_NAV, type NavItem } from "@/config/navigation";
import { LIGHT_HEADER_ROUTES } from "@/config/site";
import { cn } from "@/lib/utils";

/* Logo · six links · one button. The button opens the inquiry modal,
   so "I need people" is one click from every page. The header
   overlays dark heroes; its height is constant so condensing never
   moves the page. */

export function Header() {
  const pathname = usePathname();
  const overInk = !LIGHT_HEADER_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );

  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setCondensed(window.scrollY >= 24);
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setOpen(null);
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setDrawer(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 260);
  }, []);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const light = overInk && !condensed && !open;

  return (
    <header
      className={cn(
        "sticky top-0 z-[200] w-full transition-colors duration-300",
        light ? "bg-transparent on-ink" : "bg-paper/92 backdrop-blur-xl",
        overInk && "-mb-20 lg:-mb-24",
      )}
      onMouseLeave={scheduleClose}
    >
      <Container>
        <div className="flex h-20 items-center justify-between gap-8 lg:h-24">
          <Link href="/" aria-label="Vertis Global — home" className="shrink-0">
            <Logo variant={light ? "light" : "dark"} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {PRIMARY_NAV.map((item) => (
                <li
                  key={item.label}
                  onMouseEnter={() => {
                    cancelClose();
                    setOpen(item.children ? item.label : null);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={item.href}
                    aria-expanded={item.children ? open === item.label : undefined}
                    onFocus={() => setOpen(item.children ? item.label : null)}
                    className={cn(
                      "link-underline text-[0.9375rem]",
                      light ? "text-on-ink hover:text-white" : "text-n-600 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden shrink-0 lg:block">
            <HireTalentButton size="md" variant={light ? "onInk" : "primary"} />
          </div>

          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            aria-expanded={drawer}
            className={cn("-mr-3 grid size-12 place-items-center lg:hidden", light ? "text-white" : "text-ink")}
          >
            <Menu className="size-6" strokeWidth={1.5} />
          </button>
        </div>
      </Container>

      {PRIMARY_NAV.map(
        (item) =>
          item.children && (
            <Dropdown
              key={item.label}
              item={item}
              open={open === item.label}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            />
          ),
      )}

      <Drawer open={drawer} onClose={() => setDrawer(false)} />
    </header>
  );
}

function Dropdown({
  item,
  open,
  onMouseEnter,
  onMouseLeave,
}: {
  item: NavItem;
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  if (!item.children) return null;
  const twoCol = item.children.length > 3;
  return (
    <div
      hidden={!open}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute inset-x-0 top-full hidden bg-paper/97 backdrop-blur-xl lg:block"
    >
      <Container>
        <ul className={cn("grid max-w-3xl gap-x-12 gap-y-1 py-10", twoCol && "grid-cols-2")}>
          {item.children.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="group block py-3">
                <span className="block text-[1.0625rem] font-medium text-ink transition-colors group-hover:text-accent">
                  {link.label}
                </span>
                {link.note && (
                  <span className="mt-0.5 block text-[0.9375rem] text-n-500">{link.note}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

/* The drawer. Items with sub-links open in place: the label is a
   disclosure button, the first entry inside is "All <label>" so the
   section page stays one tap away. One section open at a time. */
function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const f = panel.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    f?.[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !f?.length) return;
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
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[400] lg:hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper motion-safe:animate-[drawerIn_300ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="flex h-20 shrink-0 items-center justify-between px-6">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-3 grid size-12 place-items-center text-ink"
          >
            <X className="size-6" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-10">
          <ul className="mt-4">
            {PRIMARY_NAV.map((item) => {
              const labelCls =
                "font-display block py-4 text-3xl font-bold tracking-[-0.02em] text-ink";
              if (!item.children) {
                return (
                  <li key={item.label}>
                    <Link href={item.href} className={labelCls}>
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const isOpen = expanded === item.label;
              const id = `drawer-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setExpanded(isOpen ? null : item.label)}
                    className={cn(labelCls, "flex w-full items-center justify-between text-left")}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className={cn(
                        "size-6 shrink-0 text-n-400 transition-transform duration-300",
                        isOpen && "rotate-180 text-accent",
                      )}
                    />
                  </button>
                  <div
                    id={id}
                    inert={!isOpen}
                    aria-hidden={!isOpen}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <ul className="min-h-0 overflow-hidden">
                      <li>
                        <Link
                          href={item.href}
                          className="block py-3 text-[1.0625rem] font-medium text-ink"
                        >
                          All {item.label.toLowerCase() === "who we help" ? "of who we help" : item.label.toLowerCase()}
                        </Link>
                      </li>
                      {item.children.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="block py-3">
                            <span className="block text-[1.0625rem] text-n-600">{link.label}</span>
                            {link.note && (
                              <span className="mt-0.5 block text-[0.9375rem] text-n-400">
                                {link.note}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                      <li aria-hidden="true" className="h-4" />
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
          <ul className="mt-6 border-t border-n-200 pt-6">
            <li>
              <Link href="/contact" className="block py-3 text-[1.0625rem] text-n-600">
                Contact
              </Link>
            </li>
          </ul>
          <div className="mt-8 space-y-3">
            {/* Closing the drawer first so the modal isn't behind it */}
            <HireTalentButton full />
            <Button href="/jobs" variant="outline" full>
              Find a job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
