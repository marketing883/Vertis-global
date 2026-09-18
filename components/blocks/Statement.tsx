import { Container, Section } from "@/components/ui/Section";
import { INDUSTRY_COUNT } from "@/config/industries";

/* One paragraph, said plainly. This block used to lead with a large
   office photograph; it was removed deliberately, so do not add one
   back. The words carry it, and the section reads better as a quiet
   pause between the video hero and the range of work.

   The proof line beneath uses only what we can stand behind: the
   industry count is derived from the list, and the years are real. */
export function Statement() {
  return (
    <Section background="paper" spacing="none" className="pt-24 pb-24 md:pt-32 md:pb-32 lg:pb-44">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="max-w-[16ch] lg:col-span-7">
            Every business runs on the people in it.
          </h2>
          <div className="lg:col-span-5">
            <p className="max-w-[40ch] text-xl leading-relaxed text-n-600">
              Some of that work happens on a shop floor at six in the morning. Some
              of it happens in a cleanroom, a ward, a front desk or a codebase. We
              find the people for all of it. And we treat every one of them like
              a person, not a placement.
            </p>
            <p className="tabular mt-10 text-[0.9375rem] text-n-500">
              {INDUSTRY_COUNT} industries · Five levels of work · 20+ years
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
