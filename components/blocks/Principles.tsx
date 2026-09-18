import { Container, Eyebrow, Section } from "@/components/ui/Section";

/* Why people choose us. Four words, four sentences. No boxes. */
const PRINCIPLES = [
  ["Trust", "Every person we send has been met, checked and vouched for by one of us."],
  ["Speed", "Most requests get people in front of you within days, not weeks."],
  ["Experience", "Twenty years of finding people for every kind of work, at every level."],
  ["A human approach", "You talk to a recruiter who knows the job, and so does every candidate."],
] as const;

export function Principles() {
  return (
    <Section background="paper2">
      <Container>
        <Eyebrow>Why people choose us</Eyebrow>
        <h2 className="mt-7 max-w-[16ch]">Four things you can count on.</h2>
        <dl className="mt-16 grid gap-x-16 md:grid-cols-2 lg:mt-20">
          {PRINCIPLES.map(([term, def]) => (
            <div key={term} className="border-t border-n-300/60 py-10 lg:py-12">
              <dt className="font-display text-[clamp(1.875rem,3.2vw,2.5rem)] leading-none font-bold tracking-[-0.03em] text-ink">
                {term}
              </dt>
              <dd className="mt-5 max-w-[36ch] text-lg leading-relaxed text-n-500">{def}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
