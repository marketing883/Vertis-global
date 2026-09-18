import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Photo } from "@/components/media/Photo";
import type { PhotoId } from "@/config/photography";
import { cn } from "@/lib/utils";

/* The interior page hero: one photograph, a purple well under the
   copy in the left seven columns, and the picture left clear
   everywhere else.

   It owns two things that must not be copied by hand. First the
   scrim, which is the shared `.scrim-photo` class in globals.css so
   that every hero lightens together. Second the `pt-32
   lg:pt-40`, which exists because the header overlays dark heroes
   (see LIGHT_HEADER_ROUTES in config/site.ts) and therefore occupies
   no flow space of its own.

   The headline is plain data plus one accent phrase, because a config
   file cannot carry JSX and one amber phrase is the only composition
   the site actually uses. */

export function PageHero({
  photo,
  eyebrow,
  title,
  titleAccent,
  intro,
  actions,
  id,
  size = "tall",
  scrim = "default",
  titleClassName,
  className,
}: {
  photo: PhotoId;
  eyebrow: string;
  title: string;
  /** Trailing phrase set in amber, for example "runs on." */
  titleAccent?: string;
  intro: string;
  /** The button and link row beneath the intro. */
  actions?: React.ReactNode;
  id?: string;
  /** "tall" matches /industries. "standard" is a shorter interior hero. */
  size?: "tall" | "standard";
  /** "light" holds the purple over the copy but lets a bright, low
      contrast photograph stay visible on the right. */
  scrim?: "default" | "light";
  /** Overrides the headline measure, which defaults to 14 characters. */
  titleClassName?: string;
  className?: string;
}) {
  return (
    <Section
      id={id}
      background="ink"
      spacing="none"
      className={cn("relative overflow-hidden", className)}
    >
      <Photo slot={photo} fill priority sizes="100vw" className="absolute inset-0 h-full w-full" />
      {/* The scrim lives in globals.css (`.scrim-photo`) so every
          hero on the site lightens or darkens together. */}
      <div
        aria-hidden="true"
        className={cn("absolute inset-0", scrim === "light" ? "scrim-photo-light" : "scrim-photo")}
      />

      <Container className="relative">
        <div className="grid lg:grid-cols-12">
          <div
            className={cn(
              "flex min-w-0 flex-col justify-center pt-32 pb-24 lg:col-span-7 lg:pt-40 lg:pb-32",
              size === "tall" ? "lg:min-h-[620px]" : "lg:min-h-[520px]",
            )}
          >
            <Eyebrow>{eyebrow}</Eyebrow>
            {/* The measure sits on the h1 itself so `ch` resolves
                against the heading's own size, not the body copy. */}
            <h1 className={cn("mt-8 text-white", titleClassName ?? "max-w-[14ch]")}>
              {title} {titleAccent ? <span className="text-amber">{titleAccent}</span> : null}
            </h1>
            <p className="mt-8 max-w-[46ch] text-xl leading-relaxed text-on-ink-muted">{intro}</p>
            {actions ? (
              <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">{actions}</div>
            ) : null}
          </div>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="relative h-1 w-full"
        style={{ background: "var(--vg-gradient)" }}
      />
    </Section>
  );
}
