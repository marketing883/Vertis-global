import Image from "next/image";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   VERTIS GLOBAL — brand mark and lockup

   These are the client's own artwork, not a reconstruction. The
   supplied file was trimmed to its bounding box and split into
   three assets in public/brand/:

     vertis-global-logo.png        full lockup, indigo wordmark
     vertis-global-logo-light.png  same, wordmark reversed to white
     vertis-global-mark.png        the V on its own

   The light variant recolours ONLY the wordmark. The V keeps its
   own gradients in both, because the mark is built from the warm
   and purple blades and reads on either ground.

   The mark's intrinsic ratio is 330:244, the lockup's 1737:247;
   both are passed to next/image so nothing shifts while loading.
   To swap in a true vector later, drop an .svg beside these and
   point the `src` at it: nothing else here needs to change.
------------------------------------------------------------------ */

const LOCKUP = { w: 1737, h: 247 };
const MARK = { w: 330, h: 244 };

type MarkProps = { className?: string; title?: string; priority?: boolean };

/** The V alone. Identical on light and dark grounds. */
export function LogoMark({ className, title = "Vertis Global", priority }: MarkProps) {
  return (
    <Image
      src="/brand/vertis-global-mark.png"
      alt={title}
      width={MARK.w}
      height={MARK.h}
      priority={priority}
      className={cn("block h-9 w-auto", className)}
    />
  );
}

type LogoProps = {
  className?: string;
  /** On indigo surfaces pass "light" to reverse the wordmark. */
  variant?: "dark" | "light";
  markOnly?: boolean;
  priority?: boolean;
};

export function Logo({ className, variant = "dark", markOnly = false, priority }: LogoProps) {
  if (markOnly) return <LogoMark className={className} priority={priority} />;

  const onDark = variant === "light";
  return (
    <Image
      src={onDark ? "/brand/vertis-global-logo-light.png" : "/brand/vertis-global-logo.png"}
      alt="Vertis Global"
      width={LOCKUP.w}
      height={LOCKUP.h}
      priority={priority}
      className={cn("block h-9 w-auto sm:h-10", className)}
    />
  );
}
