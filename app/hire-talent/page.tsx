import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, FileText, Globe2, Layers, ShieldCheck, UserCheck } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Photo } from "@/components/media/Photo";
import { Faq } from "@/components/ui/Faq";
import { ResourceGrid } from "@/components/blocks/ResourceGrid";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import { ServiceProof } from "@/components/services/ServiceProof";
import { ServiceSteps } from "@/components/services/ServiceSteps";
import { ServiceCompare } from "@/components/services/ServiceCompare";
import { INDUSTRY_COUNT, INDUSTRY_GROUPS, TALENT_LEVELS } from "@/config/industries";
import { getLatestInsights } from "@/config/insights";
import { WHITEPAPERS } from "@/config/resources";

export const metadata: Metadata = {
  title: "Hire talent",
  description: `Tell Vertis Global who you need and get qualified people in 48 to 72 hours. Temporary, contract, contract-to-hire, direct hire and whole teams, across ${INDUSTRY_COUNT} industries.`,
  alternates: { canonical: "/hire-talent" },
};

/* The employer page. Everything here already exists somewhere on the
   site; what this page does is put the whole argument in one place
   for someone who has a gap in their team today. */

const PROOF = [
  {
    figure: "48 to 72",
    unit: "hours",
    caption: "from your call to qualified people who are ready to start",
  },
  {
    figure: "80+",
    caption: "Fortune 500 companies hire through us, alongside hundreds of local employers",
  },
  {
    figure: "0",
    unit: "cost",
    caption: "to replace anyone who turns out not to be right for the job",
  },
];

const STEPS = [
  {
    title: "Tell us what you need",
    body: "A role, a headcount, a start date, or just what you are working on. Two minutes on the phone beats a form you have to download.",
  },
  {
    title: "We go to people we know",
    body: "Our recruiters specialise, so the person taking your call has filled this role before. Everyone is met, screened and reference checked before you see a name.",
  },
  {
    title: "You meet two or three",
    body: "A short list with honest notes on each person: what we liked, what we questioned, what the references said. Not forty forwarded resumes.",
  },
  {
    title: "They start, and we stay close",
    body: "We handle contracts, payroll and compliance, confirm the first morning, and check in after the first week and the first month.",
  },
];

const INCLUDED = [
  {
    icon: UserCheck,
    title: "Screened by a person",
    body: "Every candidate is interviewed, tested against the role and reference checked before you see them.",
  },
  {
    icon: Clock,
    title: "Profiles in 48 to 72 hours",
    body: "For most roles a qualified shortlist within three days, and people on site within the week.",
  },
  {
    icon: ShieldCheck,
    title: "Replacement guarantee",
    body: "If a placement does not work out we replace the person at no cost to you.",
  },
  {
    icon: FileText,
    title: "Payroll and compliance",
    body: "On temporary and contract work we are the employer of record. Taxes, onboarding and checks sit with us.",
  },
  {
    icon: Layers,
    title: "Every level of work",
    body: "Frontline and operations, skilled trades, administrative, professional and specialised technical roles.",
  },
  {
    icon: Globe2,
    title: "Onshore, offshore or both",
    body: "Recruiting across the United States and delivering from India when the work suits it, under one point of contact.",
  },
];

const FAQS = [
  {
    q: "What does it cost?",
    a: "It depends on the arrangement, the role and the volume, and we quote before any work starts. Temporary and contract work is an hourly rate that covers pay, our employment costs and our margin. Permanent hiring is a percentage of first year salary, invoiced when the person starts. There is no charge for the first conversation, the shortlist or a replacement under the guarantee.",
  },
  {
    q: "How quickly can you actually send people?",
    a: "Qualified profiles within 48 to 72 hours for most roles, and people on site within the week. Specialist and volume requests take longer, and we give you a real date at the first conversation rather than an optimistic one.",
  },
  {
    q: "Do you need exclusivity?",
    a: "No. We do better work with it, because we can invest in a proper market map, but we will run a search alongside others if that is how you prefer to hire.",
  },
  {
    q: "Who employs the people you place?",
    a: "On temporary, contract and contract-to-hire work, we do. Payroll, taxes, statutory cover and compliance are ours for the length of the assignment. On a direct hire the person is your employee from day one.",
  },
  {
    q: "What happens if someone is not right?",
    a: "You call us and we replace them at no cost. Every person has been met and screened before you see them, so it is rare, but the guarantee stands either way.",
  },
  {
    q: "Can you cover several sites or several roles at once?",
    a: "Yes. Multi-site and multi-role programmes get one point of contact and one invoice rather than one of each per location. If you need a whole team, that is project and team staffing.",
  },
];

export default function HireTalentPage() {
  return (
    <>
      {/* ── 1 · Hero ─────────────────────────────────────────── */}
      <PageHero
        photo="employerHero"
        eyebrow="For employers"
        title="Tell us who you need."
        titleAccent="We will find them."
        intro={`Qualified people in front of you within 48 to 72 hours, across ${INDUSTRY_COUNT} industries and every level of work. Screened by a recruiter who has filled the role before.`}
        titleClassName="max-w-[16ch]"
        actions={
          <>
            <HireTalentButton variant="onInk" />
            <Link href="#how-it-works" className="link-underline text-[1.0625rem]">
              How it works
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </>
        }
      />

      {/* ── 2 · Proof ────────────────────────────────────────── */}
      <ServiceProof points={PROOF} heading="Hiring with Vertis Global in three figures" />

      {/* ── 3 · How it works ─────────────────────────────────── */}
      <ServiceSteps
        steps={STEPS}
        heading="From your call to their first day."
        intro="The same four steps whether it is one person for a week or forty for a season. No portal to log into and a person on the other end of every one of them."
        cta="Start the conversation"
      />

      {/* ── 4 · Ways to hire ─────────────────────────────────── */}
      <ServiceCompare
        background="paper"
        heading="Hire the way the work demands."
        intro="Five arrangements, one standard of screening. We will tell you honestly which one fits, even when it is the smaller one."
      />

      {/* ── 5 · What comes with every placement ──────────────── */}
      <Section background="paper2">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>What you get</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">More than a list of resumes.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              The same standard on every placement, in every industry, whether it is one person
              for a week or a team for a year.
            </p>
          </div>

          <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6">
            {INCLUDED.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.title} className="flex flex-col rounded-lg bg-white p-7">
                  <span className="grid size-11 place-items-center rounded-md bg-paper-2 text-accent">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-[1.25rem] text-ink">{c.title}</h3>
                  <p className="mt-3 text-[1.0625rem] leading-relaxed text-n-500">{c.body}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ── 6 · Who we place ─────────────────────────────────── */}
      <Section background="paper" spacing="none" className="py-24 md:py-32 lg:py-44">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Eyebrow>Who we place</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">
                {TALENT_LEVELS.length} levels of work, {INDUSTRY_COUNT} industries.
              </h2>
              <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-n-600">
                The same recruiters who fill a warehouse shift fill a controller's chair. Pick
                the industry you hire for and we will put you with the person who knows it.
              </p>

              <dl className="mt-10 border-t border-n-200">
                {TALENT_LEVELS.map((level) => (
                  <div key={level.id} className="border-b border-n-200 py-5">
                    <dt className="text-[1.0625rem] font-medium text-ink">{level.name}</dt>
                    <dd className="mt-1 text-[0.9375rem] text-n-500">{level.roles}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="lg:col-span-6">
              <Photo slot="employerTeam" sizes="(max-width: 1024px) 100vw, 48vw" />
              <ul className="mt-8 flex flex-wrap gap-2">
                {INDUSTRY_GROUPS.flatMap((g) => g.industries).map((industry) => (
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
          </div>
        </Container>
      </Section>

      {/* ── 7 · FAQ ──────────────────────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-7 max-w-[12ch] lg:sticky lg:top-32">Before you call.</h2>
            </div>
            <div className="lg:col-span-8">
              <Faq items={FAQS} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 8 · Resources ────────────────────────────────────── */}
      <ResourceGrid posts={getLatestInsights(3)} paper={WHITEPAPERS[0]} />

      {/* ── 9 · Closing call to action ───────────────────────── */}
      <Section background="ink">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="max-w-[16ch] text-white">
                Looking for the right people? <span className="text-amber">Start here.</span>
              </h2>
              <p className="mt-6 max-w-[44ch] text-lg text-on-ink-muted">
                Tell us the role, the location and when you need them. A recruiter who knows the
                work will be in touch within a business day.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-5 lg:col-span-5 lg:justify-end">
              <HireTalentButton variant="onInk">How Can We Help?</HireTalentButton>
              <Link href="/services" className="link-underline text-[1.0625rem]">
                Compare the five services
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
