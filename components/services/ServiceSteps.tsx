import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import type { ServiceStep } from "@/config/services";

/* How this particular service runs, in three or four steps. The
   numbers are honest here: these really are a sequence. */
export function ServiceSteps({
  steps,
  heading,
  intro,
  cta,
  id = "how-it-works",
}: {
  steps: ServiceStep[];
  heading: string;
  intro: string;
  cta: string;
  id?: string;
}) {
  return (
    <Section background="paper2" id={id} className="scroll-mt-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-7 max-w-[16ch]">{heading}</h2>
          </div>
          <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">{intro}</p>
        </div>

        <ol className="mt-16 border-t border-n-300/60 lg:mt-20">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="grid gap-4 border-b border-n-300/60 py-8 md:grid-cols-12 md:gap-8 lg:py-10"
            >
              <span className="font-mono text-[0.8125rem] tracking-[0.1em] text-n-400 md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="md:col-span-11">
                <h3 className="text-[clamp(1.375rem,2vw,1.75rem)] text-ink">{s.title}</h3>
                <p className="mt-3 max-w-[56ch] text-[1.0625rem] leading-relaxed text-n-500">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <HireTalentButton>{cta}</HireTalentButton>
        </div>
      </Container>
    </Section>
  );
}
