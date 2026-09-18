/* ============================================================
   SERVICES

   Five ways to hire, one entry each. This is the content for
   /services and /services/<slug>: every service page renders from
   the object below, so the pages share a skeleton but differ in
   hero, imagery, proof, body copy and FAQ.

   Rules for editing:
   · Only facts we can stand behind. The company deck supports 200+
     consultants on assignment, 20+ years, 80+ Fortune 500 clients,
     48 to 72 hour profile turnaround, two week onboarding, no cost
     replacement, and onshore US plus offshore India delivery.
     Do not invent numbers, clients or case studies.
   · No long dashes anywhere. Commas, colons or a new sentence.
   · `industries` holds slugs from config/industries.ts. Never name
     an industry we do not serve.
   · `aside` is optional and deliberately not present on every
     service: it is what stops the five pages reading as clones.
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

export type Service = {
  slug: string;
  /** Prose form. Headings, body copy, the lead email. Uses "and". */
  name: string;
  /** Chrome form for the header and footer menus, where "&" saves space. */
  navLabel: string;
  /** Two or three words, for table headings and chips. */
  shortName: string;
  /** The inquiry need this service implies, so the modal can skip step one. */
  need: InquiryNeed;
  photo: PhotoId;
  /** One line. Used on /services, in the nav dropdown and on related cards. */
  summary: string;
  /** Three short cells for the comparison table on /services. */
  compare: { employer: string; length: string; commit: string };
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
  /** Three figures, different for every service. Never the same three twice. */
  proof: ServiceProof[];
  /** The opening argument on the page: what this is, in two short paragraphs. */
  what: string[];
  /** When an employer should choose this one. */
  bestFor: string[];
  steps: ServiceStep[];
  included: string[];
  /** Industry slugs where this arrangement is most common. */
  industries: string[];
  faqs: ServiceFaq[];
  /** Optional extra section. Only three of the five have one. */
  aside?: {
    eyebrow: string;
    heading: string;
    body: string;
    points: { label: string; body: string }[];
  };
  cta: { heading: string; body: string };
};

export const SERVICES: Service[] = [
  /* ── 1 · Temporary staffing ─────────────────────────────── */
  {
    slug: "temporary-staffing",
    name: "Temporary staffing",
    navLabel: "Temporary staffing",
    shortName: "Temporary",
    need: "project",
    photo: "serviceTemporary",
    summary: "People for a day, a week or a season, without adding headcount.",
    compare: {
      employer: "We do",
      length: "A day to a season",
      commit: "When you book the shift",
    },
    notRightIf: {
      body: "If you already know the work is permanent, temporary cover is the expensive road to the same place. Say so at the first conversation and we will run a search instead.",
      alternative: "direct-hire",
    },
    whitepaper: "planning-for-peak-season",
    meta: {
      title: "Temporary staffing",
      description:
        "Temporary staffing from Vertis Global: cover a rush, a season or an absence in days. We are the employer of record, so payroll, onboarding and compliance sit with us.",
    },
    hero: {
      eyebrow: "Temporary staffing",
      lead: "People on the floor when the work",
      accent: "spikes.",
      sub: "Cover a rush, a season or an absence in days, not weeks. We employ them, pay them and handle the compliance. You get the hours you need and nothing you do not.",
    },
    proof: [
      {
        figure: "48 to 72",
        unit: "hours",
        caption: "from your call to qualified people who are ready to start",
      },
      {
        figure: "1 to 50+",
        caption: "people per request, from one shift cover to a full seasonal crew",
      },
      {
        figure: "0",
        unit: "headcount",
        caption:
          "they are on our payroll, so your permanent headcount does not move",
      },
    ],
    what: [
      "Temporary staffing is the arrangement for work that has a start and a finish. A seasonal peak, a big order that landed early, a shutdown, a run of absence. The people work your shifts and answer to your supervisors, and we remain their employer.",
      "That last part is the whole point. Payroll, taxes, onboarding paperwork, background checks and compliance stay with us. You approve hours and get one invoice.",
    ],
    bestFor: [
      "A seasonal peak you can see coming, and one you cannot",
      "Covering sickness, leave or a sudden resignation",
      "An order or a contract that arrived earlier than planned",
      "Shutdown, stocktake and changeover work",
      "Trying extra capacity before you commit to a permanent role",
    ],
    steps: [
      {
        title: "Tell us the shift",
        body: "Start time, finish time, what the person will be handling, any certification the job needs, and who they report to. Two minutes on the phone is enough.",
      },
      {
        title: "We go to the bench",
        body: "Our recruiters go to people we have already met, screened and placed before. You get names, not applications.",
      },
      {
        title: "They start",
        body: "We brief them on your site rules before day one. You approve the hours, we handle everything behind them.",
      },
    ],
    included: [
      "We are the employer of record",
      "Payroll, taxes and statutory cover",
      "Background checks and screening where the role needs them",
      "Site and safety briefing before the first shift",
      "Timesheets and a single invoice",
      "No cost replacement if someone is not right",
    ],
    industries: ["industrial", "manufacturing", "retail", "hospitality", "healthcare", "automotive"],
    faqs: [
      {
        q: "How quickly can people actually start?",
        a: "For most frontline and administrative roles, qualified people within 48 to 72 hours and on site within the week. Certified and specialist roles take longer, and we will give you a real date at the first conversation rather than an optimistic one.",
      },
      {
        q: "What is the shortest assignment you will take?",
        a: "A single shift. Most temporary work runs from a few days to a few months, and there is no minimum term you have to commit to.",
      },
      {
        q: "Who employs the workers?",
        a: "We do. They are on our payroll for the length of the assignment, which means taxes, statutory cover and employment admin sit with us, not with you.",
      },
      {
        q: "What if someone does not turn up?",
        a: "You call us and we replace them at no cost. Every person we send has been met and screened, so it is rare, but the cover stands either way.",
      },
      {
        q: "Can we hire a temporary worker permanently?",
        a: "Often, and it is one of the better ways to hire. If you know from the start that you may want to keep them, contract-to-hire is the cleaner arrangement, because the terms are agreed up front.",
      },
      {
        q: "What does it cost?",
        a: "An hourly rate that covers the person's pay, our employment costs and our margin. We quote before any work starts, and the rate does not change without your agreement.",
      },
    ],
    cta: {
      heading: "Need people this week?",
      body: "Tell us the shift and how many. A recruiter will come back to you the same business day with names and rates.",
    },
  },

  /* ── 2 · Contract staffing ──────────────────────────────── */
  {
    slug: "contract-staffing",
    name: "Contract staffing",
    navLabel: "Contract staffing",
    shortName: "Contract",
    need: "role",
    photo: "serviceContract",
    summary: "Skilled and technical specialists for exactly as long as the work lasts.",
    compare: {
      employer: "We do",
      length: "Three to 24 months",
      commit: "At the contract",
    },
    notRightIf: {
      body: "If you already know you want this person permanently, a straight contract is a detour. Contract-to-hire gives you the same trial with the permanent job on the table from day one.",
      alternative: "contract-to-hire",
    },
    meta: {
      title: "Contract staffing",
      description:
        "Contract staffing from Vertis Global: skilled and technical specialists on a defined contract, employed by us and working in your team. Onshore, offshore or both.",
    },
    hero: {
      eyebrow: "Contract staffing",
      lead: "Specialists for exactly as long as the",
      accent: "work lasts.",
      sub: "Engineers, developers, analysts and technicians on a defined contract, employed by us and working inside your team. No permanent headcount, and no long tail when the programme ends.",
    },
    proof: [
      {
        figure: "200+",
        caption: "consultants on assignment with our clients at any one time",
      },
      {
        figure: "3 to 24",
        unit: "months",
        caption: "the usual contract length, extended or closed as the work changes",
      },
      {
        figure: "2",
        unit: "weeks",
        caption: "typical onboarding, from a signed contract to productive work",
      },
    ],
    what: [
      "Contract staffing is how you add a skill you need now without carrying it forever. The person is ours on paper and yours in practice: they sit in your team, work to your priorities and go through your stand ups.",
      "It suits work with a shape to it. A funded programme, a migration, a validation phase, a backfill for someone on leave. When the phase ends, the contract ends, and nobody has to have a difficult conversation about headcount.",
    ],
    bestFor: [
      "A funded programme with a defined end date",
      "A skill you need for one phase, not permanently",
      "Backfilling parental or extended leave",
      "Scarce technical skills your local market does not have",
      "Adding capacity while a permanent requisition is still in approval",
    ],
    steps: [
      {
        title: "Scope the skill",
        body: "We talk through the work rather than the job title: the stack, the standards, the certifications and who the person will be working beside.",
      },
      {
        title: "Shortlist in days",
        body: "You see two or three people who have done this work before, with a recruiter's notes on each, not a stack of forwarded resumes.",
      },
      {
        title: "They join the team",
        body: "Contracts, confidentiality and onboarding are handled before day one. Most people are productive inside two weeks.",
      },
      {
        title: "We keep in touch",
        body: "We check in through the assignment, handle extensions before they lapse, and close it out cleanly when the work is done.",
      },
    ],
    included: [
      "Employed and paid by us for the whole assignment",
      "Confidentiality and intellectual property terms in place before day one",
      "Timesheets, approvals and one invoice",
      "Extensions and end of contract handled by us",
      "Onshore, offshore or a blend of the two",
      "No cost replacement if the fit is wrong",
    ],
    industries: [
      "information-technology",
      "engineering",
      "semiconductor",
      "telecommunications",
      "energy",
      "financial-services",
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
        q: "How is this different from temporary staffing?",
        a: "Length and level, mostly. Temporary covers hours and shifts, often at short notice. Contract is for skilled and technical people on a defined term, usually months, working inside your team on a specific piece of work.",
      },
      {
        q: "Who manages the person day to day?",
        a: "You do. They take direction from your leads and work to your priorities. We handle everything on the employment side and stay in touch with both of you through the assignment.",
      },
      {
        q: "Can we extend a contract?",
        a: "Yes, and most clients do. We flag the end date well before it arrives so an extension is a decision rather than a scramble.",
      },
      {
        q: "What about confidentiality and intellectual property?",
        a: "Confidentiality and assignment of work terms are signed before the person starts. If your legal team has its own paper, we will work to it.",
      },
      {
        q: "Can we hire a contractor permanently?",
        a: "Yes. Talk to us before you make the offer and we will agree the terms in writing, the same way contract-to-hire works from the start.",
      },
    ],
    cta: {
      heading: "Have a programme to staff?",
      body: "Tell us the skills, the timeline and where the work sits. We will come back with people who have done it before.",
    },
  },

  /* ── 3 · Contract-to-hire ───────────────────────────────── */
  {
    slug: "contract-to-hire",
    name: "Contract-to-hire",
    navLabel: "Contract-to-hire",
    shortName: "Contract-to-hire",
    need: "role",
    photo: "serviceContractToHire",
    summary: "A real trial period on the job, then the permanent decision.",
    compare: {
      employer: "We do, then you do",
      length: "Three to six months, then permanent",
      commit: "At the conversion point",
    },
    notRightIf: {
      body: "If the person has to be your employee from day one, for a clearance, a title or an internal rule, go straight to a direct hire and we will run the search.",
      alternative: "direct-hire",
    },
    whitepaper: "contract-to-hire-playbook",
    meta: {
      title: "Contract-to-hire",
      description:
        "Contract-to-hire from Vertis Global: the person joins on a contract, works in your team, and converts to permanent when you are sure. Terms agreed in writing up front.",
    },
    hero: {
      eyebrow: "Contract-to-hire",
      lead: "See how they fit before you",
      accent: "commit.",
      sub: "The person joins on a contract, usually three to six months, and works in your team like anyone else. When it is working, you make them permanent. Most of the time, you do.",
    },
    proof: [
      {
        figure: "3 to 6",
        unit: "months",
        caption: "the usual contract period before the permanent decision",
      },
      {
        figure: "90",
        unit: "days",
        caption:
          "of evidence before you commit: attendance, fit and output, not a resume and two interviews",
      },
      {
        figure: "0",
        unit: "cost",
        caption: "to replace someone if the fit turns out to be wrong",
      },
    ],
    what: [
      "A resume and two interviews tell you whether someone can do the job on paper. Ninety days on the floor tell you whether they turn up, get on with the crew and handle the Tuesday nobody planned for.",
      "Contract-to-hire buys you that evidence. The person is employed by us for an agreed period, works on your site as part of the team, and converts to your payroll when you decide. The conversion terms are agreed in writing before they start, so nothing is negotiated under pressure later.",
    ],
    bestFor: [
      "Roles where fit matters more than the resume",
      "The first hire into a new team or a new site",
      "A permanent requisition that is not approved yet",
      "Someone changing industry who cannot show a like for like history",
      "Roles you have hired for twice already and want to get right",
    ],
    steps: [
      {
        title: "Agree the role and the period",
        body: "The job, the length of the contract, and the conversion terms. All of it in writing before anyone starts.",
      },
      {
        title: "They start as a contractor",
        body: "On our payroll, on your site, in your team. Onboard them on day one exactly as you would a permanent hire.",
      },
      {
        title: "You see the actual work",
        body: "Not a probation on paper. Real shifts, real deadlines, real colleagues. We check in with both sides along the way.",
      },
      {
        title: "You convert them",
        body: "Say the word and they move to your payroll on the agreed terms. If it is not working, the contract simply ends.",
      },
    ],
    included: [
      "Employed and paid by us for the contract period",
      "Conversion terms agreed in writing before day one",
      "Onboarding, payroll and compliance handled",
      "Check ins with you and with the person through the period",
      "A clean end if you decide not to convert",
      "No cost replacement if the fit is wrong",
    ],
    industries: [
      "administrative",
      "financial-services",
      "healthcare",
      "human-resources",
      "insurance",
      "manufacturing",
    ],
    aside: {
      eyebrow: "Which one",
      heading: "Contract-to-hire, or direct hire?",
      body: "Both end in a permanent employee. The difference is when you decide and what you are deciding on.",
      points: [
        {
          label: "Choose contract-to-hire when",
          body: "fit and reliability matter as much as skill, the work can be learned on the job, or the headcount is not signed off yet.",
        },
        {
          label: "Choose direct hire when",
          body: "the role is senior or scarce, the person will not leave a permanent job for a contract, or the search needs to be confidential.",
        },
        {
          label: "Not sure",
          body: "Tell us the role and we will say which one we would use, including when the smaller arrangement is the right one.",
        },
      ],
    },
    faqs: [
      {
        q: "How long is the contract period?",
        a: "Three to six months is usual. It should be long enough to see a full cycle of the work and short enough that a good person is not left waiting for a decision.",
      },
      {
        q: "What does it cost to convert someone?",
        a: "It depends on the role and the length of the contract, and it is agreed in writing before the person starts. There are no surprise fees at conversion.",
      },
      {
        q: "What if we decide not to convert?",
        a: "The contract ends on the agreed date and we move the person on to their next assignment. There is no penalty for deciding it is not a fit.",
      },
      {
        q: "Does the person know it is contract-to-hire?",
        a: "Always, from the first conversation. People take these roles because there is a real path to permanent, and hiding it would poison the arrangement.",
      },
      {
        q: "Can we convert someone early?",
        a: "Yes. If you are sure at week six there is no reason to wait, and we will handle the paperwork.",
      },
      {
        q: "How is this different from a probation period?",
        a: "The person is on our payroll, not yours, so the employment risk and the admin sit with us until you decide. You get the same visibility with far less exposure.",
      },
    ],
    cta: {
      heading: "Want to see them work first?",
      body: "Tell us the role and how long you would want before deciding. We will set out the terms in writing before anyone starts.",
    },
  },

  /* ── 4 · Direct hire ────────────────────────────────────── */
  {
    slug: "direct-hire",
    name: "Direct hire",
    navLabel: "Direct hire",
    shortName: "Direct hire",
    need: "role",
    photo: "serviceDirectHire",
    summary: "A permanent hire, sourced and shortlisted by a recruiter who knows the role.",
    compare: {
      employer: "You do, from day one",
      length: "Permanent",
      commit: "At the offer",
    },
    notRightIf: {
      body: "If you are not yet certain the role should be permanent, or the headcount is not signed off, contract-to-hire gets someone working sooner and leaves the decision until you have seen the work.",
      alternative: "contract-to-hire",
    },
    meta: {
      title: "Direct hire",
      description:
        "Direct hire recruitment from Vertis Global: permanent roles sourced, screened and reference checked by recruiters who know the work. You interview a shortlist, not an inbox.",
    },
    hero: {
      eyebrow: "Direct hire",
      lead: "We find them.",
      accent: "You hire them.",
      sub: "A permanent hire, sourced, screened and reference checked by a recruiter who knows the role. You interview two or three people worth your time, not forty applications.",
    },
    proof: [
      {
        figure: "2 or 3",
        unit: "candidates",
        caption: "on the shortlist, each one you would be content to hire",
      },
      {
        figure: "80+",
        caption: "Fortune 500 companies have hired permanent staff through us",
      },
      {
        figure: "20+",
        unit: "years",
        caption: "of networks in the industries we recruit for, not a job board search",
      },
    ],
    what: [
      "Direct hire is a permanent role, filled properly. We scope the job with the person who will manage it, go to our network rather than an inbox, screen and reference check everyone, and bring you a short list with honest notes on each person.",
      "The work you save is the sifting. The work you keep is the judgement, which was always yours to make.",
    ],
    bestFor: [
      "A permanent role you cannot afford to get wrong",
      "A confidential search, including replacing someone still in post",
      "Scarce skills where the good people are not applying to adverts",
      "The first leadership hire into a team or a site",
      "A role you have already advertised twice",
    ],
    steps: [
      {
        title: "The intake conversation",
        body: "Thirty minutes with the hiring manager about the work, the team and what would make someone succeed here. This is where most searches are won or lost.",
      },
      {
        title: "Search and screen",
        body: "We go to our network and the market, then meet everyone ourselves. References are checked before you see a name, not after you make an offer.",
      },
      {
        title: "A real shortlist",
        body: "Two or three people, each with notes on strengths, gaps and motivation. If nobody is good enough yet, we tell you that instead of padding the list.",
      },
      {
        title: "Offer and start",
        body: "We manage the offer, the counter offer conversation and the notice period, and stay in touch through the first weeks.",
      },
    ],
    included: [
      "Role scoping with the hiring manager",
      "Market mapping and direct approach, not just advertising",
      "Screening interviews and reference checks before shortlist",
      "Interview scheduling and candidate care",
      "Offer, counter offer and notice period support",
      "A replacement guarantee if the hire does not work out",
    ],
    industries: [
      "financial-services",
      "information-technology",
      "engineering",
      "healthcare",
      "marketing",
      "sales",
    ],
    aside: {
      eyebrow: "The real cost",
      heading: "An empty seat is never free.",
      body: "The fee is the visible number. These are the ones that usually cost more, and they are the reason a proper search pays for itself.",
      points: [
        {
          label: "The work not done",
          body: "Every week the role is open, the output is absorbed by people who already have a job, or it does not happen at all.",
        },
        {
          label: "The wrong hire",
          body: "A hire that fails at month five costs the salary, the training, the disruption, and the search you now have to run again.",
        },
        {
          label: "The manager's time",
          body: "Sifting a hundred applications is a fortnight of a senior person's attention. That is the part we take off you.",
        },
      ],
    },
    faqs: [
      {
        q: "How does the fee work?",
        a: "A percentage of first year salary, quoted before any work starts and invoiced when the person begins. There is no charge for the search, the shortlist or the replacement guarantee.",
      },
      {
        q: "Do you need exclusivity?",
        a: "No. We do better work when we have it, because we can invest in a proper market map, but we will run a search alongside others if that is how you prefer to hire.",
      },
      {
        q: "How long does a permanent search take?",
        a: "A shortlist in one to two weeks for most roles. From there the timeline is yours: interviews, decision and notice period, which is usually where the weeks actually go.",
      },
      {
        q: "Can you run a confidential search?",
        a: "Yes. We approach the market without naming you until a candidate is serious and has signed confidentiality, which matters when you are replacing someone still in post.",
      },
      {
        q: "What if we do not hire anyone from the shortlist?",
        a: "Then we go again, and there is no fee. A shortlist you would not hire from is our problem to fix, not yours to pay for.",
      },
      {
        q: "What happens if the hire leaves?",
        a: "We replace them at no cost within the guarantee period. We would rather do the search twice than have you remember us for the one that did not work.",
      },
    ],
    cta: {
      heading: "Hiring a permanent role?",
      body: "Tell us the job and what would make someone succeed in it. You will have a shortlist worth your time, not an inbox.",
    },
  },

  /* ── 5 · Project and team staffing ──────────────────────── */
  {
    slug: "project-team-staffing",
    name: "Project and team staffing",
    navLabel: "Project & team staffing",
    shortName: "Project teams",
    need: "team",
    photo: "serviceProjectTeam",
    summary: "A whole team across roles, assembled around one piece of work.",
    compare: {
      employer: "We do",
      length: "The length of the programme",
      commit: "At the engagement",
    },
    notRightIf: {
      body: "If it is really one specialist for a defined period, contract staffing is simpler and costs you less. We will say so rather than sell you a team.",
      alternative: "contract-staffing",
    },
    meta: {
      title: "Project and team staffing",
      description:
        "Project and team staffing from Vertis Global: several people across roles, assembled around one piece of work, with a lead if you want one. Onshore, offshore or both.",
    },
    hero: {
      eyebrow: "Project and team staffing",
      lead: "A whole team,",
      accent: "ready to go.",
      sub: "Several people across different roles, assembled around one piece of work, with a lead if you want one. One point of contact, one invoice, onshore, offshore or both.",
    },
    proof: [
      {
        figure: "5 to 50",
        unit: "people",
        caption: "per team, assembled around a single piece of work",
      },
      {
        figure: "2",
        unit: "weeks",
        caption: "to onboard a whole team, rather than one person at a time",
      },
      {
        figure: "1",
        unit: "point of contact",
        caption: "for the whole team, whatever roles and locations it spans",
      },
    ],
    what: [
      "Some work does not need a person, it needs a team. A plant ramp up, a migration, a new line, a backlog that will not clear itself. Hiring for that one role at a time takes months you do not have.",
      "We assemble the whole group around the work: the mix of roles, the levels, a lead if you want one, onshore or offshore or a blend. You get one account contact and one invoice instead of a spreadsheet of individual placements.",
    ],
    bestFor: [
      "A plant, line or site ramping up",
      "A migration, implementation or validation programme",
      "A backlog that will not clear with the people you have",
      "Seasonal work across several sites at once",
      "A capability you need for a year but not forever",
    ],
    steps: [
      {
        title: "Shape the team",
        body: "We work out the roles, the levels and the mix with you, and say plainly where a smaller team would do the same job.",
      },
      {
        title: "Assemble and onboard",
        body: "Everyone is recruited, screened and onboarded together, so the team starts as a team rather than trickling in over two months.",
      },
      {
        title: "They deliver",
        body: "Your leads direct the work. A named account contact handles everything on our side, from timesheets to swaps.",
      },
      {
        title: "Scale up or wind down",
        body: "Add roles as the programme grows and release them as it finishes, without a redundancy conversation.",
      },
    ],
    included: [
      "A named account contact for the whole team",
      "One contract and one invoice, however many people",
      "A team lead if you want one",
      "Onshore, offshore or a blended team",
      "Onboarding run once, for everyone",
      "Scale up and wind down without penalty",
    ],
    industries: [
      "information-technology",
      "engineering",
      "semiconductor",
      "manufacturing",
      "energy",
      "telecommunications",
    ],
    faqs: [
      {
        q: "What is the smallest team you will staff?",
        a: "Three people. Below that a set of individual contract placements is usually simpler and cheaper for you, and we will say so.",
      },
      {
        q: "Do you manage the team, or do we?",
        a: "You direct the work. If you want a team lead from us who runs the day to day and reports to you, we will include one. Both arrangements are common.",
      },
      {
        q: "Can the team span several locations?",
        a: "Yes, including a blend of onshore and offshore. Multi site programmes get one point of contact rather than one per site.",
      },
      {
        q: "How quickly can a team start?",
        a: "Shortlists for the core roles within a week, and most full teams onboarded inside three to four weeks. A large ramp up is planned backwards from your date.",
      },
      {
        q: "What if we need a different skill halfway through?",
        a: "We swap or add roles as the work changes. That flexibility is most of the reason to staff a programme this way.",
      },
      {
        q: "Can we scale down without a penalty?",
        a: "Yes, on the notice agreed at the start. Winding a team down is part of the plan from day one, not an awkward conversation at the end.",
      },
    ],
    cta: {
      heading: "Staffing a whole programme?",
      body: "Tell us what the work is and when it starts. We will come back with the shape of a team and what it takes to stand it up.",
    },
  },
];

export function getService(slug: string): Service | null {
  return SERVICES.find((s) => s.slug === slug) ?? null;
}

export function otherServices(slug: string): Service[] {
  return SERVICES.filter((s) => s.slug !== slug);
}

export const SERVICE_COUNT = SERVICES.length;
