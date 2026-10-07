/* ============================================================
   SERVICES

   Four services: Managed Services, Staffing, Cloud and ERP.

   · SERVICE_LIST is the one list every menu, card, comparison and
     footer reads, so the four can never drift apart.
   · SERVICES holds the full content for the two pages drawn by
     app/services/[slug]: Managed Services and Staffing. Staffing is
     the consolidation of the former temporary staffing, contract
     staffing and contract-to-hire pages, which now redirect to its
     `options` section (see next.config.ts).
   · Cloud (/services/azure) and ERP (/services/oracle-erp) are the
     specialist pages drawn by components/industries/SpecialistPage
     from config/azure.ts and config/oracle-erp.ts.
   · Direct hire is no longer offered as a service and appears
     nowhere in the services section; its old URL redirects to
     /services.

   Rules for editing:
   · Only facts we can stand behind. The company deck supports 200+
     consultants on assignment, 20+ years, 80+ Fortune 500 clients,
     48 to 72 hour profile turnaround, two week onboarding, no cost
     replacement, and onshore US plus offshore India delivery.
     Do not invent numbers, clients or case studies.
   · No long dashes anywhere. Commas, colons or a new sentence.
   · `industries` holds slugs from config/industries.ts. Never name
     an industry we do not serve.
   ============================================================ */

import type { PhotoId } from "./photography";
import type { InquiryNeed } from "@/lib/validation/inquiry";

export type ServiceProof = {
  figure: string;
  unit?: string;
  caption: string;
};

export type ServiceStep = { title: string; body: string };
export type ServiceFaq = { q: string; a: string };

/** Who employs the person, how long, and when the employer commits. */
export type ServiceTerms = { employer: string; length: string; commit: string };

/** One of the arrangements inside a service page (Staffing has three). */
export type ServiceOption = {
  /** Also the anchor on the page, and where the old URL redirects. */
  id: string;
  name: string;
  line: string;
  body: string;
  bestFor: string[];
  terms: ServiceTerms;
};

export type Service = {
  slug: string;
  /** Prose form. Headings, body copy, the lead email. Uses "and". */
  name: string;
  /** Two or three words, for table headings and chips. */
  shortName: string;
  /** The inquiry need this service implies, so the modal can skip step one. */
  need: InquiryNeed;
  photo: PhotoId;
  /** One line. The headline of the "What it is" section. */
  summary: string;
  /** Said plainly, with the service we would send them to instead. */
  notRightIf: { body: string; alternative: string };
  /** Whitepaper slug from config/resources.ts, when one genuinely fits. */
  whitepaper?: string;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    /** The headline is split so one phrase can carry the amber accent. */
    lead: string;
    accent: string;
    sub: string;
  };
  /** Three figures, different for every service. */
  proof: ServiceProof[];
  /** The opening argument on the page: what this is, in two short paragraphs. */
  what: string[];
  /** When an employer should choose this one. */
  bestFor: string[];
  /** Optional: the arrangements within the service, side by side. */
  options?: { eyebrow: string; heading: string; intro: string; items: ServiceOption[] };
  steps: ServiceStep[];
  included: string[];
  /** Industry slugs where this is most common. */
  industries: string[];
  faqs: ServiceFaq[];
  /** Optional extra section. */
  aside?: {
    eyebrow: string;
    heading: string;
    body: string;
    points: { label: string; body: string }[];
  };
  cta: { heading: string; body: string };
};

/* The four, in menu order. `href` is where each one lives; two are
   rendered from SERVICES below and two are specialist pages. */
export type ServiceListing = {
  slug: string;
  /** Display name, as the client names it: "Cloud", not "Azure staffing". */
  name: string;
  /** One line for menus, cards and the comparison list. */
  summary: string;
  /** A short hook and a sentence of detail, for the homepage list. */
  line: string;
  detail: string;
  href: string;
  terms: ServiceTerms;
};

export const SERVICE_LIST: ServiceListing[] = [
  {
    slug: "managed-services",
    name: "Managed Services",
    summary: "A workforce or workstream we staff and run for you, on an ongoing basis.",
    line: "We staff it and run it. You set the standard.",
    detail:
      "For work that does not end: a function, a workstream or a site. We recruit the team, manage it day to day through a named lead, and keep it staffed as your needs change.",
    href: "/services/managed-services",
    terms: { employer: "We do", length: "Ongoing, reviewed with you", commit: "At the engagement" },
  },
  {
    slug: "staffing",
    name: "Staffing Services",
    summary: "Temporary, contract and contract-to-hire people, employed by us and working in your team.",
    line: "The right people, for as long as the work needs them.",
    detail:
      "Temporary cover for a rush or a season, contract specialists for work with an end date, and contract-to-hire when you want to see someone work before you commit.",
    href: "/services/staffing",
    terms: {
      employer: "We do, until you convert",
      length: "A single shift to 24 months",
      commit: "At the booking, the contract or the conversion",
    },
  },
  {
    slug: "azure",
    name: "Cloud",
    summary: "Microsoft Azure talent, from one specialist to a complete project team.",
    line: "Azure talent for your cloud transformation.",
    detail:
      "Cloud and infrastructure, data and AI, DevOps, security and program talent for migrations, modernization, data platforms and cloud operations.",
    href: "/services/azure",
    terms: {
      employer: "Depends on the model you choose",
      length: "A project, a period or long term",
      commit: "At the engagement",
    },
  },
  {
    slug: "oracle-erp",
    name: "ERP",
    summary: "Oracle ERP specialists for programs, releases and steady-state operations.",
    line: "The right Oracle expertise where the work is.",
    detail:
      "Functional, technical, integration, data, testing and program talent for Oracle Fusion Cloud ERP, from one critical specialist to a connected team.",
    href: "/services/oracle-erp",
    terms: {
      employer: "We do, or you do after conversion",
      length: "A workstream, a release or a program",
      commit: "At the engagement",
    },
  },
];

export function getListing(slug: string): ServiceListing | null {
  return SERVICE_LIST.find((s) => s.slug === slug) ?? null;
}

export const SERVICES: Service[] = [
  /* ── 1 · Managed Services ──────────────────────────────────
     Grown from the former project and team staffing page, which now
     redirects here. Positioned as an ongoing managed workforce: we
     staff the team and manage it day to day, the client sets the
     scope and the standard. No technical or IT-only claims. */
  {
    slug: "managed-services",
    name: "Managed services",
    shortName: "Managed",
    need: "team",
    photo: "serviceProjectTeam",
    summary: "A workforce we staff, run and keep staffed for you.",
    notRightIf: {
      body: "If it is one person for a defined period, or you want to direct the people yourself, staffing is simpler and costs you less. We will say so rather than sell you a managed team.",
      alternative: "staffing",
    },
    meta: {
      title: "Managed services",
      description:
        "Managed services from Vertis Global: an ongoing team or workstream we recruit, manage day to day and keep staffed as your needs change. One point of contact, one invoice, onshore, offshore or both.",
    },
    hero: {
      eyebrow: "Managed services",
      lead: "We run the team.",
      accent: "You run the business.",
      sub: "For work that is ongoing rather than one placement. We staff the people, manage them day to day through a named lead, and keep the team staffed as your needs change. One contract, one point of contact, one invoice.",
    },
    proof: [
      {
        figure: "1",
        unit: "point of contact",
        caption: "for the whole managed team, whatever roles and locations it spans",
      },
      {
        figure: "2",
        unit: "weeks",
        caption: "typical onboarding for a whole team, rather than one person at a time",
      },
      {
        figure: "0",
        unit: "cost",
        caption: "to replace someone who is not right, the same guarantee as every placement",
      },
    ],
    what: [
      "Some work does not end. A function, a workstream, a site or a service line that needs the right people in place month after month. Placing individuals and leaving you to supervise them is not the help you need there.",
      "Managed services puts the team on us. You set the scope, the standard and the outcomes. We recruit and onboard the people, manage them day to day through a named lead, handle payroll and compliance, cover absence and turnover, and scale the team up or down as your needs change, with regular reviews against what you asked for.",
    ],
    bestFor: [
      "An ongoing function you would rather not staff and supervise yourself",
      "A workstream or backlog that needs a steady team, not a one-off placement",
      "A site, line or operation that needs consistent cover across shifts",
      "Work that spans several roles, levels or locations",
      "Capacity that has to flex up and down through the year",
    ],
    steps: [
      {
        title: "Scope the service",
        body: "What the team is responsible for, the standard it works to, how it reports to you, and how we will both know it is working.",
      },
      {
        title: "Stand up the team",
        body: "Everyone is recruited, screened and onboarded together under a named lead, so the team starts as a team rather than trickling in over two months.",
      },
      {
        title: "We run it",
        body: "Our lead manages the people day to day: scheduling, cover, performance and timesheets. You get regular reviews against the scope you set.",
      },
      {
        title: "Adjust as you go",
        body: "Add roles as the work grows and release them as it changes, on the notice agreed at the start, without a redundancy conversation.",
      },
    ],
    included: [
      "A named lead who manages the team day to day",
      "Recruitment, screening and onboarding for every role",
      "Payroll, taxes, compliance and employment admin",
      "Cover for absence and turnover",
      "Regular reviews against the scope you set",
      "One contract, one invoice and one point of contact",
      "Onshore, offshore or a blended team",
      "Scale up or down on agreed notice",
    ],
    industries: [
      "information-technology",
      "engineering",
      "manufacturing",
      "healthcare",
      "insurance",
      "government",
    ],
    aside: {
      eyebrow: "Which one",
      heading: "Staffing, or managed services?",
      body: "Both put the right people on the work. The difference is who runs them once they are there.",
      points: [
        {
          label: "Choose staffing when",
          body: "you want people placed into your team, directed by your own managers, for a shift, a contract or a trial before hiring.",
        },
        {
          label: "Choose managed services when",
          body: "the work is ongoing and you want us responsible for the team: who is on it, how it is run, and keeping it staffed.",
        },
        {
          label: "Not sure",
          body: "Tell us the work and we will say which one we would use, including when the smaller arrangement is the right one.",
        },
      ],
    },
    faqs: [
      {
        q: "How is this different from staffing?",
        a: "With staffing, the people join your team and your managers direct them. With managed services, we are responsible for the team as a whole: our lead manages the people day to day, keeps the team staffed and reports to you against the scope you set.",
      },
      {
        q: "Who decides what the team works on?",
        a: "You do. You set the scope, the priorities and the standard. We run the people who deliver it, and we review the work with you regularly.",
      },
      {
        q: "What is the smallest team you will manage?",
        a: "Three people. Below that, individual staffing placements are usually simpler and cheaper for you, and we will say so.",
      },
      {
        q: "Can the team span several locations?",
        a: "Yes, including a blend of onshore and offshore. A team across several sites still has one lead and one point of contact.",
      },
      {
        q: "How quickly can a managed team start?",
        a: "Shortlists for the core roles within a week, and most teams onboarded inside three to four weeks. A larger team is planned backwards from your start date.",
      },
      {
        q: "Can we scale the team down?",
        a: "Yes, on the notice agreed at the start. Changing the size of the team is part of the plan from day one, not an awkward conversation at the end.",
      },
      {
        q: "What does it cost?",
        a: "A price agreed for the scope and the team, quoted before any work starts. It covers the people, their employment costs, the management and our margin.",
      },
    ],
    cta: {
      heading: "Want a team run for you?",
      body: "Tell us the work, the standard and when it starts. We will come back with the shape of the team and how we would run it.",
    },
  },

  /* ── 2 · Staffing ──────────────────────────────────────────
     One page for the three arrangements that used to be three pages:
     temporary staffing, contract staffing and contract-to-hire. The
     old URLs redirect to their anchors in `options`. Content merged
     from those pages, not new claims. */
  {
    slug: "staffing",
    name: "Staffing Services",
    shortName: "Staffing",
    need: "role",
    photo: "serviceTemporary",
    summary: "People employed by us and working in your team, for as long as the work needs them.",
    notRightIf: {
      body: "If the work is ongoing and you would rather we ran the team as well as staffed it, managed services is the better fit. We will say so at the first conversation.",
      alternative: "managed-services",
    },
    whitepaper: "contract-to-hire-playbook",
    meta: {
      title: "Staffing Services",
      description:
        "Staffing services from Vertis Global: temporary staffing for a rush or a season, contract staffing for skilled specialists, and contract-to-hire when you want to see someone work before you commit. We employ them, pay them and handle the compliance.",
    },
    hero: {
      eyebrow: "Staffing Services",
      lead: "The right people, for as long as the",
      accent: "work needs them.",
      sub: "Temporary cover for a rush or a season, contract specialists for work with an end date, and contract-to-hire when you want to see someone do the job before you commit. We employ them, pay them and handle the compliance.",
    },
    proof: [
      {
        figure: "48 to 72",
        unit: "hours",
        caption: "from your call to qualified people who are ready to start",
      },
      {
        figure: "200+",
        caption: "consultants on assignment with our clients at any one time",
      },
      {
        figure: "0",
        unit: "cost",
        caption: "to replace someone if the fit turns out to be wrong",
      },
    ],
    what: [
      "Staffing is how you add people without adding permanent headcount before you are ready. The person is ours on paper and yours in practice: they work your shifts or sit in your team, answer to your supervisors and work to your priorities, and we remain their employer.",
      "That last part is the point. Payroll, taxes, onboarding paperwork, background checks and compliance stay with us. You approve hours and get one invoice. Whether it is a shift, a programme or a trial before a permanent hire, the arrangement fits the work rather than the other way round.",
    ],
    bestFor: [
      "A seasonal peak, a rush or a run of absence",
      "A funded programme or a phase with a defined end date",
      "Scarce skills your local market does not have",
      "A permanent role where fit matters more than the resume",
      "Adding capacity while a permanent requisition is still in approval",
    ],
    options: {
      eyebrow: "Three ways to staff",
      heading: "Pick the arrangement that fits the work.",
      intro: "They differ in how long the person stays and whether the job becomes permanent. We will tell you which one we would use, even when it is the smaller one.",
      items: [
        {
          id: "temporary-staffing",
          name: "Temporary staffing",
          line: "People on the floor when the work spikes.",
          body: "For work that has a start and a finish: a seasonal peak, an order that landed early, a shutdown, a run of absence. Qualified people in days, from a single shift to a full seasonal crew, and your permanent headcount does not move.",
          bestFor: [
            "A seasonal peak you can see coming, and one you cannot",
            "Covering sickness, leave or a sudden resignation",
            "Shutdown, stocktake and changeover work",
          ],
          terms: { employer: "We do", length: "A single shift to a season", commit: "When you book the shift" },
        },
        {
          id: "contract-staffing",
          name: "Contract staffing",
          line: "Specialists for exactly as long as the work lasts.",
          body: "Engineers, developers, analysts and technicians on a defined contract, working inside your team. It suits work with a shape to it: a funded programme, a migration, a validation phase, a backfill. When the phase ends, the contract ends.",
          bestFor: [
            "A skill you need for one phase, not permanently",
            "Backfilling parental or extended leave",
            "Scarce technical skills your local market does not have",
          ],
          terms: { employer: "We do", length: "Three to 24 months", commit: "At the contract" },
        },
        {
          id: "contract-to-hire",
          name: "Contract-to-hire",
          line: "See how they fit before you commit.",
          body: "The person joins on a contract, usually three to six months, and works in your team like anyone else. Ninety days on the job tell you more than a resume and two interviews. When it is working, they move to your payroll on terms agreed in writing before they started.",
          bestFor: [
            "Roles where fit matters more than the resume",
            "The first hire into a new team or a new site",
            "A permanent requisition that is not approved yet",
          ],
          terms: {
            employer: "We do, then you do",
            length: "Three to six months, then permanent",
            commit: "At the conversion point",
          },
        },
      ],
    },
    steps: [
      {
        title: "Tell us the work",
        body: "The shift, the skill or the role: what the person will be handling, the standards and certifications it needs, how long, and who they report to. Two minutes on the phone is enough to start.",
      },
      {
        title: "A shortlist in days",
        body: "Our recruiters go to people we have already met, screened and placed before. You see names with a recruiter's notes on each, not a stack of forwarded resumes.",
      },
      {
        title: "They start",
        body: "Contracts, confidentiality, site rules and onboarding are handled before day one. Most people are productive inside two weeks. You approve the hours, we handle everything behind them.",
      },
      {
        title: "We stay in touch",
        body: "We check in with both sides through the assignment, handle extensions before they lapse, convert contract-to-hire on the agreed terms, and close out cleanly when the work is done.",
      },
    ],
    included: [
      "We are the employer of record",
      "Payroll, taxes and statutory cover",
      "Background checks and screening where the role needs them",
      "Site and safety briefing, confidentiality and IP terms before day one",
      "Conversion terms in writing before a contract-to-hire starts",
      "Timesheets, approvals and one invoice",
      "Extensions and end of assignment handled by us",
      "No cost replacement if the fit is wrong",
    ],
    industries: [
      "manufacturing",
      "healthcare",
      "hospitality",
      "retail",
      "information-technology",
      "engineering",
    ],
    aside: {
      eyebrow: "Delivery",
      heading: "Onshore, offshore, or both.",
      body: "The same contract covers all three. We recruit across the United States and deliver from India when the work suits it, with one point of contact either way.",
      points: [
        {
          label: "Onshore",
          body: "People on your site or in your time zone, for work that needs to be in the room or on the floor.",
        },
        {
          label: "Offshore",
          body: "Delivery from our India teams, for work that travels well and benefits from overnight progress.",
        },
        {
          label: "Blended",
          body: "A lead and core roles onshore, the rest offshore. Most long programmes end up here.",
        },
      ],
    },
    faqs: [
      {
        q: "How quickly can people actually start?",
        a: "For most frontline and administrative roles, qualified people within 48 to 72 hours and on site within the week. Contract specialists usually join inside two weeks of a signed contract. Certified and scarce roles take longer, and we will give you a real date at the first conversation.",
      },
      {
        q: "How is temporary different from contract staffing?",
        a: "Length and level, mostly. Temporary covers hours and shifts, often at short notice. Contract is for skilled and technical people on a defined term, usually months, working inside your team on a specific piece of work.",
      },
      {
        q: "Who employs the people, and who manages them?",
        a: "We employ them, so payroll, taxes, statutory cover and employment admin sit with us. You manage the work: they take direction from your leads and work to your priorities, and we stay in touch with both of you.",
      },
      {
        q: "What is the shortest assignment you will take?",
        a: "A single shift. Most temporary work runs from a few days to a few months, contracts usually three to 24 months, and there is no minimum term you have to commit to.",
      },
      {
        q: "Can we extend a contract?",
        a: "Yes, and most clients do. We flag the end date well before it arrives so an extension is a decision rather than a scramble.",
      },
      {
        q: "How does contract-to-hire conversion work?",
        a: "The contract period, usually three to six months, and the conversion terms are agreed in writing before the person starts. Convert early if you are sure, or let the contract end on the agreed date with no penalty if it is not a fit. The person knows it is contract-to-hire from the first conversation.",
      },
      {
        q: "Can we hire a temporary worker or contractor permanently?",
        a: "Often, and it is one of the better ways to hire. Talk to us before you make the offer and we will agree the terms in writing. If you know from the start that you may want to keep them, contract-to-hire is the cleaner arrangement.",
      },
      {
        q: "What about confidentiality and intellectual property?",
        a: "Confidentiality and assignment of work terms are signed before the person starts. If your legal team has its own paper, we will work to it.",
      },
      {
        q: "What does it cost?",
        a: "An hourly rate that covers the person's pay, our employment costs and our margin, quoted before any work starts. Contract-to-hire conversion terms are agreed in writing up front, so there are no surprise fees later.",
      },
    ],
    cta: {
      heading: "Need people, or a specialist?",
      body: "Tell us the shift, the skill or the role, and for how long. A recruiter will come back the same business day with names, rates and the arrangement we would use.",
    },
  },
];

export function getService(slug: string): Service | null {
  return SERVICES.find((s) => s.slug === slug) ?? null;
}

export const SERVICE_COUNT = SERVICE_LIST.length;
