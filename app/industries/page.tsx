import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, FileText, Globe2, Layers, ShieldCheck, UserCheck } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Photo } from "@/components/media/Photo";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import { ResourceGrid } from "@/components/blocks/ResourceGrid";
import { WhyVertis } from "@/components/blocks/WhyVertis";
import { IndustryExplorer } from "@/components/industries/IndustryExplorer";
import { IndustryFaq } from "@/components/industries/IndustryFaq";
import { INDUSTRY_COUNT } from "@/config/industries";
import { getLatestInsights } from "@/config/insights";
import { WHITEPAPERS } from "@/config/resources";

export const metadata: Metadata = {
  title: "Industries",
  description: `Vertis Global staffs ${INDUSTRY_COUNT} industries, from administrative and healthcare to manufacturing, semiconductor and energy. Managed services, and staffing on temporary, contract and contract-to-hire terms.`,
  alternates: { canonical: "/industries" },
};

/* ── The services, per industry ─────────────────────────────
   Managed services and staffing apply in every industry; Cloud and
   ERP are the specialist technology services. */
const SOLUTIONS = [
  {
    name: "Managed services",
    line: "We staff it and run it.",
    detail:
      "An ongoing team or workstream we recruit, manage day to day and keep staffed as your needs change. One point of contact, one invoice.",
  },
  {
    name: "Staffing",
    line: "The right people, for as long as the work needs them.",
    detail:
      "Temporary cover for a rush or a season, contract specialists for work with an end date, and contract-to-hire when you want to see someone work first.",
  },
  {
    name: "Cloud",
    line: "Microsoft Azure talent.",
    detail:
      "Cloud and infrastructure, data and AI, DevOps, security and program talent, from one specialist to a complete project team.",
  },
  {
    name: "ERP",
    line: "Oracle ERP specialists.",
    detail:
      "Functional, technical, integration, data, testing and program talent for Oracle programs, releases and steady-state operations.",
  },
];

/* ── What we do beyond sending profiles ────────────────────── */
const CAPABILITIES = [
  {
    icon: UserCheck,
    title: "Screened by a person",
    body: "Every candidate is met, tested against the role and reference checked by a recruiter before you see them.",
  },
  {
    icon: Clock,
    title: "Profiles in 48 to 72 hours",
    body: "For most roles you get a qualified shortlist within three days, and people on site within the week.",
  },
  {
    icon: ShieldCheck,
    title: "Replacement guarantee",
    body: "If a placement does not work out, we replace the person at no cost to you.",
  },
  {
    icon: Layers,
    title: "Every level of work",
    body: "Frontline and operations, skilled trades, administrative, professional, and specialised technical roles.",
  },
  {
    icon: Globe2,
    title: "Onshore, offshore or both",
    body: "Recruiting across the United States and delivery from India when the work suits it, under one point of contact.",
  },
  {
    icon: FileText,
    title: "Payroll and compliance",
    body: "Onboarding, payroll, background checks and compliance handled by us for everyone we place.",
  },
];

/* ── The visual band: one industry per frame ───────────────── */
const AT_WORK = [
  { slot: "levelFrontline" as const, caption: "Administrative" },
  { slot: "levelSkilled" as const, caption: "Information Technology" },
  { slot: "levelProfessional" as const, caption: "Financial Services" },
  { slot: "levelSpecialized" as const, caption: "Insurance" },
];

export default function IndustriesPage() {
  const posts = getLatestInsights(3);
  const paper = WHITEPAPERS[0];

  return (
    <>
      {/* ── 1 · Hero ─────────────────────────────────────────── */}
      <PageHero
        photo="industriesHero"
        eyebrow="Industries we serve"
        title="The people your industry"
        titleAccent="runs on."
        intro={`${INDUSTRY_COUNT} industries, five levels of work, one standard of screening. We find people who fit the job, the shift and the team, and we do it in days.`}
        actions={
          <>
            <HireTalentButton variant="onInk" />
            <Link href="#explorer" className="link-underline text-[1.0625rem]">
              Find your industry
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </>
        }
      />

      {/* ── 2 · Industry explorer ────────────────────────────── */}
      <Section background="paper" id="explorer" className="scroll-mt-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>The full list</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">Find your industry.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Filter by the kind of work, then pick the industry you hire for.
              Choosing one starts a short conversation with a recruiter who knows it.
            </p>
          </div>

          <div className="mt-16 lg:mt-20">
            <IndustryExplorer />
          </div>
        </Container>
      </Section>

      {/* ── 3 · Staffing solutions ───────────────────────────── */}
      <Section background="paper2">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Staffing solutions</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">Hire the way the work demands.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Managed services and staffing apply in every industry we serve. We will
              tell you honestly which one fits, even when it is the smaller one.
            </p>
          </div>

          <ul className="mt-16 grid gap-x-12 border-t border-n-300/60 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {SOLUTIONS.map((s) => (
              <li key={s.name} className="border-b border-n-300/60 py-9">
                <h3 className="text-[clamp(1.375rem,2vw,1.75rem)] text-ink">{s.name}</h3>
                <p className="mt-3 text-[1.0625rem] text-n-600">{s.line}</p>
                <p className="mt-4 max-w-[40ch] text-[1.0625rem] leading-relaxed text-n-500">
                  {s.detail}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 4 · People at work ───────────────────────────────── */}
      <Section background="paper" spacing="none" className="py-24 md:py-32 lg:py-44">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>People at work</Eyebrow>
              <h2 className="mt-7 max-w-[18ch]">This is who we place, and where they work.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Not stock optimism. The desk where the month gets closed, the
              shortlist that has to be right, the first morning of a new job.
            </p>
          </div>

          <figure className="mt-16 lg:mt-20">
            <Photo slot="industriesTeam" sizes="100vw" className="w-full" />
            <figcaption className="mt-4 text-[0.9375rem] text-n-500">
              Human Resources: the recruiters, coordinators and talent teams we staff.
            </figcaption>
          </figure>

          <ul className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6">
            {AT_WORK.map((item) => (
              <li key={item.slot}>
                <Photo slot={item.slot} sizes="(max-width: 1024px) 50vw, 25vw" className="w-full" />
                <p className="mt-3 text-[0.9375rem] text-n-500">{item.caption}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 5 · Why Vertis Global ────────────────────────────── */}
      <WhyVertis />

      {/* ── 6 · How we help ──────────────────────────────────── */}
      <Section background="paper2">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>How we help</Eyebrow>
              <h2 className="mt-7 max-w-[16ch]">More than a list of resumes.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              What you get with every placement, in every industry, whether it is
              one person for a week or forty for a season.
            </p>
          </div>

          <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6">
            {CAPABILITIES.map((c) => {
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

      {/* ── 7 · FAQ ──────────────────────────────────────────── */}
      <Section background="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-7 max-w-[12ch] lg:sticky lg:top-32">Before you call.</h2>
            </div>
            <div className="lg:col-span-8">
              <IndustryFaq />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 8 · Resources ────────────────────────────────────── */}
      <ResourceGrid posts={posts} paper={paper} />

      {/* ── 9 · Final call to action ─────────────────────────── */}
      <Section background="ink">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="max-w-[16ch] text-white">Looking for the right people?</h2>
              <p className="mt-6 max-w-[44ch] text-lg text-on-ink-muted">
                Tell us the industry, the roles and when you need them. A recruiter
                who knows the work will be in touch within a business day.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-5 lg:col-span-5 lg:justify-end">
              <HireTalentButton variant="onInk">How Can We Help?</HireTalentButton>
              <Link href="/jobs" className="link-underline text-[1.0625rem]">
                Looking for work?
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
