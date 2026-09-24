import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Photo } from "@/components/media/Photo";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import { WhyVertis } from "@/components/blocks/WhyVertis";
import { Pathways } from "@/components/blocks/Pathways";
import { INDUSTRY_COUNT, INDUSTRY_GROUPS, TALENT_LEVELS } from "@/config/industries";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `Vertis Global is a staffing company. For more than twenty years we have introduced businesses to the people who keep them moving, across ${INDUSTRY_COUNT} industries and every level of work.`,
  alternates: { canonical: "/about" },
};

/* The About page. Storytelling order borrowed from how a good
   staffing firm actually explains itself: who we are, what we
   believe, why it matters, how we work, who we are to work with,
   where we work, then the two doors out.

   Every fact here is one the company can stand behind. No founding
   myth, no invented headcount, no offices we have not confirmed and
   no awards. If a number is not in the deck it is not on this page. */

const VALUES = [
  {
    title: "People before placements",
    body: "A placement is somebody's rent, their commute and their Monday morning. We talk to candidates like that is true, because it is.",
  },
  {
    title: "Say the true thing",
    body: "Including when the honest answer costs us the work: a smaller arrangement than you asked for, a longer timeline than you hoped, or a shortlist we are not willing to pad.",
  },
  {
    title: "Answer quickly",
    body: "For most roles you have qualified people within 48 to 72 hours. Speed is a form of respect, for the employer waiting and for the person who needs the job.",
  },
  {
    title: "Do the unglamorous parts properly",
    body: "Payroll, compliance, background checks, onboarding. Nobody thanks a staffing firm for these until one of them goes wrong.",
  },
  {
    title: "Stay for the whole job",
    body: "We check in after the first week and again after the first month. A placement is not finished on the start date.",
  },
];

const HOW_WE_WORK = [
  {
    title: "One recruiter who knows the work",
    body: "Our recruiters specialise rather than covering everything. The person who takes your call has filled the role before and can tell you what it will really take.",
  },
  {
    title: "We meet everybody first",
    body: "Every candidate is interviewed, tested against the role and reference checked before their name reaches you. That is the difference between a shortlist and a forwarded inbox.",
  },
  {
    title: "Two or three names, with the reasoning",
    body: "You get what we liked, what we questioned and what the references said. If nobody is good enough yet, we say so instead of filling the list.",
  },
  {
    title: "We carry the employment risk",
    body: "On temporary, contract and contract-to-hire work the person is our employee. Payroll, taxes and compliance sit with us, and a placement that does not work out is replaced at no cost.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── 1 · Hero ─────────────────────────────────────────── */}
      <PageHero
        photo="aboutHero"
        eyebrow="About Vertis Global"
        title="The people behind"
        titleAccent="the people you hire."
        intro={`For more than twenty years we have introduced businesses to the people who keep them moving, across ${INDUSTRY_COUNT} industries and every level of work.`}
        titleClassName="max-w-[16ch]"
        scrim="light"
        actions={
          <>
            <HireTalentButton variant="onInk" />
            <Link href="/jobs" className="link-underline text-[1.0625rem]">
              Find your next opportunity
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </>
        }
      />

      {/* ── 2 · Who we are ───────────────────────────────────── */}
      <Section background="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Photo slot="aboutRecruiter" sizes="(max-width: 1024px) 100vw, 38vw" />
            </div>

            <div className="flex flex-col justify-center lg:col-span-7">
              <Eyebrow>Who we are</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">A staffing company, and not much else.</h2>
              <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-n-600">
                Vertis Global finds people for businesses. That is the whole job, across{" "}
                {INDUSTRY_COUNT} industries and every level of work, from the front line to the
                specialist.
              </p>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-n-600">
                We recruit across the United States and deliver from India when the work suits
                it. Fortune 500 companies hire through us, and so do the employers who keep a
                city running. Both get the same recruiter and the same standard.
              </p>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-n-600">
                Twenty years in, the belief underneath it has not moved. Hiring is not a
                transaction between a requisition and a resume. It is two people deciding to
                trust each other.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 3 · The numbers we can stand behind ──────────────── */}
      <WhyVertis />

      {/* ── 4 · Our values ───────────────────────────────────── */}
      <Section background="paper2">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Our values</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">Five things we actually do.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Not a poster in a reception area. These are the rules we are willing to be held
              to, including the ones that cost us business.
            </p>
          </div>

          <ol className="mt-16 border-t border-n-300/60 lg:mt-20">
            {VALUES.map((value, i) => (
              <li
                key={value.title}
                className="grid gap-4 border-b border-n-300/60 py-9 md:grid-cols-12 md:gap-8 lg:py-11"
              >
                <span className="font-mono text-[0.8125rem] tracking-[0.1em] text-n-500 md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] text-ink md:col-span-5">
                  {value.title}
                </h3>
                <p className="max-w-[52ch] text-[1.0625rem] leading-relaxed text-n-500 md:col-span-6">
                  {value.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── 5 · Our purpose ──────────────────────────────────── */}
      <Section background="ink" spacing="none" className="relative overflow-hidden">
        <Photo
          slot="aboutFirstDay"
          fill
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
        <div aria-hidden="true" className="scrim-photo absolute inset-0" />
        <Container className="relative">
          <div className="grid lg:grid-cols-12">
            <div className="py-24 md:py-32 lg:col-span-7 lg:py-44">
              <Eyebrow>Our purpose</Eyebrow>
              <h2 className="mt-7 max-w-[18ch] text-white">
                Work is how most people build{" "}
                <span className="text-amber">a life.</span>
              </h2>
              <p className="mt-8 max-w-[48ch] text-xl leading-relaxed text-on-ink-muted">
                A job is a mortgage application, a school run that works, a reason to get up on
                a Tuesday. When we get a placement right, somebody's week gets easier and a
                business gets to keep its promises. When we get it wrong, both of those people
                pay for it.
              </p>
              <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-on-ink-muted">
                That is the whole reason we screen every candidate ourselves, quote before we
                start, and replace a placement at no cost if it does not work out. It is not
                generosity. It is what taking the job seriously looks like.
              </p>
            </div>
          </div>
        </Container>
        <div
          aria-hidden="true"
          className="relative h-1 w-full"
          style={{ background: "var(--vg-gradient)" }}
        />
      </Section>

      {/* ── 6 · How we work ──────────────────────────────────── */}
      <Section background="paper">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>How we work</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">The same four things, every time.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Whether it is one person for a week or a team for a year, the method underneath
              does not change.
            </p>
          </div>

          <ul className="mt-16 grid gap-x-12 border-t border-n-200 md:grid-cols-2 lg:mt-20">
            {HOW_WE_WORK.map((step) => (
              <li key={step.title} className="border-b border-n-200 py-9 lg:py-11">
                <h3 className="text-[clamp(1.375rem,2vw,1.75rem)] text-ink">{step.title}</h3>
                <p className="mt-4 max-w-[48ch] text-[1.0625rem] leading-relaxed text-n-500">
                  {step.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
            <HireTalentButton />
            <Link href="/services" className="link-underline text-[1.0625rem]">
              The five ways to hire with us
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </Section>

      {/* ── 7 · People and culture ───────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>People and culture</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">We hire for the same thing we sell.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Judgement, and the willingness to have an honest conversation on a day when an
              easy one would be simpler.
            </p>
          </div>

          <div className="mt-16 lg:mt-20">
            <Photo slot="aboutCulture" sizes="100vw" className="w-full" />
          </div>

          <div className="mt-14 grid gap-x-16 gap-y-12 border-t border-n-200 pt-12 md:grid-cols-2">
            <div>
              <p className="eyebrow">How we are organised</p>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-n-600">
                Our recruiters specialise. Someone here spends their week on healthcare roles,
                someone else on semiconductor, someone else on the administrative jobs that
                keep an office upright. The person who picks up your call has filled the role
                before, and can tell you what it actually pays and how long it will take.
              </p>
            </div>
            <div>
              <p className="eyebrow">Where we work</p>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-n-600">
                Onshore in the United States and from our delivery teams in India, so a
                programme can run across time zones without you managing two relationships. If
                you would rather talk to a person than fill in a form, email{" "}
                <a href={`mailto:${SITE.staffingEmail}`} className="link-underline text-ink">
                  {SITE.staffingEmail}
                </a>{" "}
                and one of us will answer.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 8 · A word from the founder ──────────────────────── */}
      {/* The photograph is composed with him on the right and black
          space on the left, so it runs full bleed under the copy
          rather than sitting in a column. `object-right` keeps him in
          frame when a narrow viewport crops the width away. */}
      <Section background="ink" spacing="none" className="relative overflow-hidden">
        {/* His face sits about 71% across the frame, so the crop is
            anchored there rather than at the right edge, which is
            empty shoulder. */}
        {/* Only from lg up. On a narrow screen a 2.45:1 frame has to
            zoom so far that his face lands under the paragraph, so
            below lg the photograph stacks above the words instead. */}
        <Photo
          slot="founder"
          fill
          sizes="100vw"
          className="absolute inset-0 hidden h-full w-full lg:block [&>img]:[object-position:70%_45%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            /* The photograph is already black where the copy sits, so
               the purple can stay strong on the left and fall away to
               nothing on his side, which keeps him black and white
               rather than tinted. */
            background:
              "linear-gradient(to right, rgba(43, 39, 107,0.93) 0%, rgba(43, 39, 107,0.86) 36%, rgba(43, 39, 107,0.32) 58%, rgba(43, 39, 107,0.06) 76%, rgba(43, 39, 107,0) 100%), linear-gradient(to top, #2b276b 0%, rgba(43, 39, 107,0.18) 16%, rgba(43, 39, 107,0) 46%)",
          }}
        />
        <Container className="relative">
          <div className="pt-20 md:pt-24 lg:hidden">
            <Photo slot="founder" sizes="100vw" className="w-full rounded-lg" />
          </div>

          <div className="grid lg:grid-cols-12">
            {/* Kept shallow on purpose: the photograph is 2.45:1, so a
                tall section would crop and enlarge him past the point
                where the frame still reads as a portrait. */}
            <div className="pt-12 pb-20 md:pt-14 md:pb-24 lg:col-span-6 lg:py-24">
              <Eyebrow>From our founder</Eyebrow>
              <blockquote className="mt-8">
                <p className="font-display text-[clamp(1.5rem,2.9vw,2.375rem)] leading-[1.18] font-bold tracking-[-0.03em] text-white">
                  &ldquo;Our purpose is simple: to create opportunities that help people grow
                  personally, professionally, and financially, so they can{" "}
                  <span className="text-amber">build better lives</span> and make a greater
                  impact on the world around them.&rdquo;
                </p>
                <footer className="mt-8 text-[1.0625rem] text-on-ink-muted">
                  <span className="text-white">Jag</span>, Founder
                </footer>
              </blockquote>

              <p className="mt-10 max-w-[52ch] text-lg leading-relaxed text-on-ink-muted">
                We believe that when people are given the right opportunities, support, and
                environment to grow, they can become the best version of themselves. When our
                people thrive, they create better experiences for our clients, candidates, and
                communities.
              </p>
              <p className="mt-8 max-w-[52ch] text-lg leading-relaxed font-semibold text-white">
                That&rsquo;s the kind of impact we want Vertis Global to create: one person, one
                opportunity, and one success story at a time.
              </p>
            </div>
          </div>
        </Container>
        <div
          aria-hidden="true"
          className="relative h-1 w-full"
          style={{ background: "var(--vg-gradient)" }}
        />
      </Section>

      {/* ── 9 · Industries we serve ──────────────────────────── */}
      <Section background="paper2">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Industries we serve</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">
                {INDUSTRY_COUNT} industries, {TALENT_LEVELS.length} levels of work.
              </h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Grouped by the kind of work rather than by sector code, because that is how
              hiring managers actually think about it.
            </p>
          </div>

          <div className="mt-16 grid gap-x-12 gap-y-12 border-t border-n-300/60 pt-12 md:grid-cols-2 lg:mt-20">
            {INDUSTRY_GROUPS.map((group) => (
              <div key={group.id}>
                <h3 className="text-[1.375rem] text-ink">{group.name}</h3>
                <p className="mt-2 text-[1.0625rem] text-n-500">{group.tagline}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {group.industries.map((industry) => (
                    <li key={industry.slug}>
                      <Link
                        href={`/industries?industry=${industry.slug}#explorer`}
                        className="inline-flex rounded-full border border-n-300 px-4 py-2 text-[0.9375rem] text-n-600 transition-colors hover:border-purple hover:text-ink"
                      >
                        {industry.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Link href="/industries" className="link-underline mt-14 text-[1.0625rem]">
            Explore the industries in full
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </Container>
      </Section>

      {/* ── 10 · The two doors out ───────────────────────────── */}
      <Pathways />
    </>
  );
}
