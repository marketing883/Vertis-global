import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Photo } from "@/components/media/Photo";
import { TALENT_LEVELS } from "@/config/industries";
import type { PhotoId } from "@/config/photography";

const LEVEL_PHOTO: Record<(typeof TALENT_LEVELS)[number]["id"], PhotoId> = {
  frontline: "levelFrontline",
  skilled: "levelSkilled",
  administrative: "levelAdmin",
  professional: "levelProfessional",
  specialized: "levelSpecialized",
};

/* FROM frontline TO specialised — five portraits in a row, one per
   level. This is the "we are not limited to one kind of candidate"
   section, and the pictures do most of the talking. Horizontal
   snap-scroll on mobile so the row stays a row. */
export function TalentRange() {
  return (
    <Section background="ink">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Who we staff</Eyebrow>
            <h2 className="mt-7 max-w-[15ch] text-white">
              From the front line to the specialist.
            </h2>
          </div>
          <p className="max-w-[40ch] text-lg text-on-ink-muted lg:col-span-5">
            Five levels of work. The same care at every one of them.
          </p>
        </div>
      </Container>

      <div className="mt-16 lg:mt-20">
        <Container size="wide" className="px-0 md:px-0">
          <ol className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:px-10 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {TALENT_LEVELS.map((level, i) => (
              <li
                key={level.id}
                className="w-[72vw] shrink-0 snap-start sm:w-[44vw] lg:w-auto"
              >
                <Photo
                  slot={LEVEL_PHOTO[level.id]}
                  sizes="(max-width: 1024px) 72vw, 20vw"
                />
                <p className="mt-6 font-mono text-[0.8125rem] tracking-[0.1em] text-on-ink-quiet">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-white">{level.name}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-on-ink-muted">
                  {level.roles}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </div>
    </Section>
  );
}
