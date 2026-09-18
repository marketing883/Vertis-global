import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   VERTIS GLOBAL — brand mark and lockup

   The mark: a rising figure in deep purple (body, head and an
   upward arrow) alongside an orange-to-amber arrow sweeping up and
   to the right. This is a vector reconstruction of the supplied
   artwork, drawn from the palette only.

   TO USE THE OFFICIAL FILES: drop them at
     public/brand/vertis-global-logo.svg        (full lockup, on light)
     public/brand/vertis-global-logo-light.svg  (full lockup, on purple)
   and set USE_OFFICIAL_ASSET to true. Every consumer of <Logo />
   picks them up; the favicon (app/icon.svg) is separate.
------------------------------------------------------------------ */

const USE_OFFICIAL_ASSET = false;

type MarkProps = { className?: string; title?: string; onDark?: boolean };

/** The mark alone. `onDark` swaps the purple figure to white so it
 *  reads on the purple ground; the orange arrow is unchanged. */
export function LogoMark({ className, title = "Vertis Global", onDark = false }: MarkProps) {
  const figure = onDark ? "#FFFFFF" : "#27196D";
  const gradId = onDark ? "vg-arrow-dark" : "vg-arrow";
  return (
    <svg
      viewBox="0 0 1900 1900"
      role="img"
      aria-label={title}
      className={cn("block h-9 w-auto", className)}
    >
      <defs>
        <linearGradient id={gradId} x1="0.15" y1="1" x2="0.95" y2="0">
          <stop offset="0" stopColor="#F26522" />
          <stop offset="0.55" stopColor="#F8931B" />
          <stop offset="1" stopColor="#FAA918" />
        </linearGradient>
      </defs>

      {/* Figure: thin at the top-left, thickening into a rounded base,
          rising into an arrowhead at the top-right. */}
      <path
        fill={figure}
        d="M15 370
           C330 640 600 1040 790 1250
           C870 1345 1000 1355 1100 1250
           C1320 1010 1560 650 1750 60
           L1385 385
           L1525 445
           C1350 700 1150 980 1000 1120
           C930 1180 850 1180 790 1120
           C560 900 320 660 15 370 Z"
      />
      <circle cx="855" cy="590" r="190" fill={figure} />

      {/* Orange arrow: a crescent sweeping from the lower left to a
          tip at the top right. */}
      <path
        fill={`url(#${gradId})`}
        d="M385 1830
           C700 1905 1090 1760 1350 1420
           C1560 1150 1700 830 1770 520
           L1848 592
           L1842 55
           C1790 260 1745 415 1735 530
           C1560 820 1360 1150 1130 1400
           C900 1660 640 1790 385 1830 Z"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** On purple surfaces pass "light". */
  variant?: "dark" | "light";
  markOnly?: boolean;
};

export function Logo({ className, variant = "dark", markOnly = false }: LogoProps) {
  const onDark = variant === "light";

  if (USE_OFFICIAL_ASSET) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={onDark ? "/brand/vertis-global-logo-light.svg" : "/brand/vertis-global-logo.svg"}
        alt="Vertis Global"
        className={cn("block h-10 w-auto", className)}
      />
    );
  }

  if (markOnly) return <LogoMark className={className} onDark={onDark} />;

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className="h-10 w-auto" title="" onDark={onDark} />
      {/* Two-line wordmark: VERTIS heavy, GLOBAL light and tracked. */}
      <span
        aria-label="Vertis Global"
        className={cn("flex flex-col leading-none", onDark ? "text-white" : "text-purple")}
      >
        <span className="font-display text-[1.375rem] font-extrabold tracking-[-0.01em]">
          VERTIS
        </span>
        <span className="mt-[3px] font-sans text-[0.6875rem] font-light tracking-[0.42em]">
          GLOBAL
        </span>
      </span>
    </span>
  );
}
