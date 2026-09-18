"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { useHireTalent } from "@/components/hire/HireTalentProvider";
import { cn } from "@/lib/utils";

/* One persistent call to action on a long employer page, rather than
   an orange button in every section. It appears once the hero has
   scrolled away and hides again at the closing call to action, so
   there are never two of the same button on screen.

   Bottom, not top: the header is sticky at z-200 and overlays dark
   heroes with a negative margin, and anything sticky up there fights
   it. Visibility comes from two IntersectionObservers rather than a
   scroll listener, because the header already runs one of those.

   It renders hidden and inert on the server, so there is nothing to
   mismatch at hydration, and the global reduced-motion rule in
   globals.css collapses the transition on its own. */
export function StickyHireBar({
  label,
  cta,
  showAfterId,
  hideAtId,
}: {
  label: string;
  cta: string;
  /** The element that must scroll out of view before the bar appears. */
  showAfterId: string;
  /** The element whose appearance hides the bar again. */
  hideAtId: string;
}) {
  const { open } = useHireTalent();
  const [pastHero, setPastHero] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.getElementById(showAfterId);
    const end = document.getElementById(hideAtId);
    const observers: IntersectionObserver[] = [];

    /* Measure once on mount as well as observing. A visitor who
       arrives on an anchor is already past the hero, and should not
       wait for the first observer callback to see the bar. */
    const inView = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      /* A zero sized rect means the element is not laid out yet, or
         the document is not being rendered at all. Treat that as in
         view so the bar stays hidden until an observer says
         otherwise, rather than flashing up over the hero. */
      if (r.width === 0 && r.height === 0) return true;
      return r.bottom > 0 && r.top < Math.max(window.innerHeight, 1);
    };
    if (hero) setPastHero(!inView(hero));
    if (end) setAtEnd(inView(end));

    if (hero) {
      const io = new IntersectionObserver(
        ([entry]) => setPastHero(!(entry?.isIntersecting ?? true)),
        { threshold: 0 },
      );
      io.observe(hero);
      observers.push(io);
    }
    if (end) {
      const io = new IntersectionObserver(
        ([entry]) => setAtEnd(entry?.isIntersecting ?? false),
        { threshold: 0 },
      );
      io.observe(end);
      observers.push(io);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [showAfterId, hideAtId]);

  const shown = pastHero && !atEnd;

  return (
    <div
      ref={barRef}
      inert={!shown}
      aria-hidden={!shown}
      className={cn(
        "fixed inset-x-0 bottom-0 z-[150] border-t border-white/10 bg-ink/95 backdrop-blur-md transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] on-ink",
        "pb-[env(safe-area-inset-bottom)]",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <Container>
        <div className="flex items-center justify-between gap-6 py-4">
          <p className="hidden text-[1.0625rem] text-on-ink-muted sm:block">{label}</p>
          <Button variant="onInk" size="md" onClick={open} className="max-sm:w-full">
            {cta}
          </Button>
        </div>
      </Container>
    </div>
  );
}
