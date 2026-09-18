import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { SERVICES } from "@/config/services";
import { cn } from "@/lib/utils";

/* All five arrangements, with the current one marked. This is the
   escape hatch for a visitor who landed on the wrong page, and it is
   what lets the inquiry form keep the service as a hidden field:
   changing your mind should change the page, not a dropdown. */
export function ServiceCompare({
  current,
  background = "paper2",
  heading = "Not sure which one fits?",
  intro = "The five arrangements differ in how long the person stays and who employs them. We will tell you honestly which one suits the work, even when it is the smaller one.",
}: {
  /** Slug of the service being viewed, or undefined on the index. */
  current?: string;
  background?: "paper" | "paper2" | "white";
  heading?: string;
  intro?: string;
}) {
  return (
    <Section background={background}>
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Compare</Eyebrow>
            <h2 className="mt-7 max-w-[16ch]">{heading}</h2>
          </div>
          <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">{intro}</p>
        </div>

        <ul className="mt-16 border-t border-n-200 lg:mt-20">
          {SERVICES.map((s) => {
            const here = s.slug === current;
            const body = (
              <>
                <div className="min-w-0 md:col-span-4">
                  <span
                    className={cn(
                      "font-display block text-[clamp(1.375rem,2.2vw,1.875rem)] leading-tight font-bold tracking-[-0.02em]",
                      here ? "text-accent" : "text-ink transition-colors group-hover:text-accent",
                    )}
                  >
                    {s.name}
                  </span>
                </div>
                <p className="text-[1.0625rem] leading-relaxed text-n-500 md:col-span-7">
                  {s.summary}
                </p>
                <span className="md:col-span-1 md:justify-self-end">
                  {here ? (
                    <span className="inline-flex items-center gap-2 text-[0.9375rem] text-accent">
                      <Check className="size-4" strokeWidth={2} aria-hidden="true" />
                      You are here
                    </span>
                  ) : (
                    <ArrowUpRight
                      className="hidden size-5 text-n-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent md:block"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  )}
                </span>
              </>
            );
            const rowClass =
              "grid items-start gap-y-3 py-8 md:grid-cols-12 md:items-center md:gap-8 md:px-6 lg:py-9";
            return (
              <li key={s.slug} className={cn("border-b border-n-200", here && "bg-white")}>
                {here ? (
                  <div className={rowClass}>{body}</div>
                ) : (
                  <Link
                    href={`/services/${s.slug}`}
                    className={cn("group transition-colors hover:bg-white", rowClass)}
                  >
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
