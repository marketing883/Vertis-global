import { Container, Section } from "@/components/ui/Section";
import { INDUSTRY_COUNT } from "@/config/industries";

/* Proof, stated plainly. A heading and one headline figure on the
   left, three supporting figures on the right, each on its own
   ruled row. Every number here is one we can stand behind: the
   years and the client count come from the company deck, the
   turnaround is the standing commitment, and the industry count is
   derived from the list. No badges, no boxes. */

const HEADLINE = {
  figure: "20+",
  unit: "years",
  caption: "finding people for every kind of work, from the front line to the specialist",
};

const PROOF = [
  {
    figure: "80+",
    caption: "Fortune 500 companies have hired through us, alongside hundreds of local employers",
  },
  {
    figure: "48 to 72",
    unit: "hours",
    caption: "from your request to the first qualified people in front of you",
  },
  {
    figure: String(INDUSTRY_COUNT),
    unit: "industries",
    caption: "served with recruiters who know the work, and a no-cost replacement if a placement does not work out",
  },
];

export function WhyVertis() {
  return (
    <Section background="white" id="why-vertis">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6 lg:pr-12">
            <h2 className="max-w-[12ch]">Why Vertis Global</h2>
            <p className="font-display mt-14 text-[clamp(4.5rem,10vw,8rem)] leading-none font-bold tracking-[-0.04em] text-orange lg:mt-20">
              {HEADLINE.figure}
              <span className="ml-3 text-[0.4em] tracking-[-0.02em] text-ink">{HEADLINE.unit}</span>
            </p>
            <p className="mt-6 max-w-[36ch] text-lg leading-relaxed text-n-500">{HEADLINE.caption}</p>
          </div>

          <dl className="lg:col-span-6 lg:border-l lg:border-n-200 lg:pl-12">
            {PROOF.map((p, i) => (
              <div
                key={p.figure}
                className={
                  i === 0
                    ? "border-t border-n-200 pt-10 pb-10 lg:border-t-0 lg:pt-0 lg:pb-12"
                    : "border-t border-n-200 py-10 lg:py-12"
                }
              >
                <dt className="font-display text-[clamp(2.75rem,5vw,4.25rem)] leading-none font-bold tracking-[-0.03em] text-orange">
                  {p.figure}
                  {p.unit ? (
                    <span className="ml-2 text-[0.45em] tracking-[-0.02em] text-ink">{p.unit}</span>
                  ) : null}
                </dt>
                <dd className="mt-4 max-w-[40ch] text-[1.0625rem] leading-relaxed text-n-500">
                  {p.caption}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}
