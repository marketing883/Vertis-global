import { Container, Section } from "@/components/ui/Section";
import type { ServiceProof as Proof } from "@/config/services";

/* Three figures, specific to one service. Deliberately not WhyVertis:
   that section is the company's proof and is identical everywhere, so
   these numbers have to be the ones that only make sense here. */
export function ServiceProof({ points, heading }: { points: Proof[]; heading: string }) {
  return (
    <Section background="white" spacing="compact">
      <Container>
        <h2 className="sr-only">{heading}</h2>
        <dl className="grid gap-x-12 border-t border-n-200 md:grid-cols-3">
          {points.map((p) => (
            <div key={p.caption} className="border-b border-n-200 py-10 lg:py-12">
              <dt className="font-display text-[clamp(2.25rem,4vw,3.25rem)] leading-none font-bold tracking-[-0.03em] text-orange">
                {p.figure}
                {p.unit ? (
                  <span className="ml-2 text-[0.4em] tracking-[-0.02em] text-ink">{p.unit}</span>
                ) : null}
              </dt>
              <dd className="mt-4 max-w-[34ch] text-[1.0625rem] leading-relaxed text-n-500">
                {p.caption}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
