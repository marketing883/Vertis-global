import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Photo } from "@/components/media/Photo";
import { HireTalentButton } from "@/components/hire/HireTalentButton";

/* The employer story in three steps. The numbers ARE a sequence
   here, so numbering is honest. One photograph of a recruiter
   actually listening — the human version of "requirement intake". */
const STEPS = [
  {
    title: "Tell us what you need",
    body: "A role, a headcount, a start date, or just what you're working on. Two minutes, no forms to download.",
  },
  {
    title: "We find the right people",
    body: "A recruiter who knows the work goes to our network and our bench. You meet two or three people worth your time.",
  },
  {
    title: "You build your team",
    body: "Interview, choose, start. We handle the paperwork, and we stay in touch to make sure it's working.",
  },
];

export function HowItWorks() {
  return (
    <Section background="paper" id="how-it-works">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Photo slot="howItWorks" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>

          <div className="flex flex-col justify-center lg:col-span-7">
            <Eyebrow>Need people?</Eyebrow>
            <h2 className="mt-7 max-w-[14ch]">Here's how it goes.</h2>

            <ol className="mt-14 border-t border-n-200">
              {STEPS.map((s, i) => (
                <li key={s.title} className="grid gap-4 border-b border-n-200 py-8 md:grid-cols-12 md:gap-8">
                  <span className="font-mono text-[0.8125rem] tracking-[0.1em] text-n-400 md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="md:col-span-11">
                    <h3 className="text-ink">{s.title}</h3>
                    <p className="mt-3 max-w-[48ch] text-[1.0625rem] leading-relaxed text-n-500">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12">
              <HireTalentButton />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
