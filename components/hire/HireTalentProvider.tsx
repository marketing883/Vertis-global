"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { InquiryNeed } from "@/lib/validation/inquiry";
import { HireTalentModal } from "./HireTalentModal";

/* One modal, mounted once in the root layout. Any button anywhere on
   the site opens it through this context, so the primary conversion
   is always one click.

   Three ways in:

   · `open()`      the plain entry point, passed straight to onClick.
                   It inherits whatever page scope is set, which is
                   why the header's own Hire Talent button carries a
                   service when it sits on a service page.
   · `openFor(ctx)` explicit context for one control, such as a row in
                   the industry explorer. Wins over the page scope.
   · `setScope(ctx)` ambient page context, set by <HireTalentScope />.

   The scope lives in a ref rather than state on purpose: this
   provider wraps the whole app, and re-rendering the header, main and
   footer to store a value nobody renders would be a waste. */

export type HireContext = {
  industry?: string;
  /** Service slug, submitted with the lead. */
  service?: string;
  /** The service's display name. Passed in rather than looked up so
      config/services.ts, which is mostly page copy, stays out of the
      client bundle. */
  serviceName?: string;
  /** Pre-selects the first step, so the visitor lands on the form. */
  need?: InquiryNeed;
};

type Ctx = {
  open: () => void;
  openFor: (ctx: HireContext) => void;
  setScope: (ctx: HireContext) => void;
  close: () => void;
  isOpen: boolean;
};

const HireTalentContext = createContext<Ctx | null>(null);

export function HireTalentProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [ctx, setCtx] = useState<HireContext>({});
  const scope = useRef<HireContext>({});

  const setScope = useCallback((next: HireContext) => {
    scope.current = next;
  }, []);
  const open = useCallback(() => {
    setCtx(scope.current);
    setOpen(true);
  }, []);
  const openFor = useCallback((next: HireContext) => {
    setCtx(next);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <HireTalentContext.Provider value={{ open, openFor, setScope, close, isOpen }}>
      {children}
      <HireTalentModal
        open={isOpen}
        onClose={close}
        industry={ctx.industry ?? null}
        service={ctx.service ?? null}
        serviceName={ctx.serviceName ?? null}
        initialNeed={ctx.need ?? null}
      />
    </HireTalentContext.Provider>
  );
}

export function useHireTalent() {
  const ctx = useContext(HireTalentContext);
  if (!ctx) throw new Error("useHireTalent must be used inside HireTalentProvider");
  return ctx;
}
