/* ============================================================
   INDUSTRY PAGES

   The long form page behind each industry: /industries/<slug>.

   This is written as a HIRING BRIEF rather than a brochure. The
   first version of this page was the same nine sections as every
   other page with the industry name dropped in, and it proved
   nothing. The job of the page is to show a hiring manager that we
   know their discipline before they have to ask.

   That means the content here has to be specific: the tools people
   actually live in, the standards they work to, the credentials
   worth verifying, and an honest read on which roles are hard to
   fill. Generic staffing copy belongs on /hire-talent, not here.

   One renderer at app/industries/[slug]/page.tsx reads this file, so
   adding an industry means adding an object and two photographs.
   Only industries listed here get a route; the rest still resolve to
   the explorer on /industries, so nothing 404s.

   Rules: real facts only, no invented client statistics, no long
   dashes. Tool and standard names are industry vocabulary, not
   claims about us, so they are safe to list.
   ============================================================ */

import type { PhotoId } from "./photography";

export type Discipline = {
  id: string;
  name: string;
  /** A photograph of this exact job being done, under public/photos/roles/.
      One per discipline, generated to a per role brief, so a receptionist
      is shown at a reception desk and a splicer at a splicer. */
  photo: string;
  photoAlt: string;
  /** What this discipline actually produces, in their own words. */
  builds: string;
  /** The seniority band we usually fill. */
  seniority: string;
  tools: string[];
  standards: string[];
};

export type StackGroup = { name: string; items: string[] };

export type MarketRow = {
  role: string;
  market: string;
  /** Honest, qualitative. Never a guarantee. */
  timeline: string;
};

export type Engagement = {
  name: string;
  covers: string;
  fits: string;
  shape: string;
};

export type IndustryPage = {
  /** Must match an Industry slug in config/industries.ts. */
  slug: string;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    lead: string;
    accent: string;
    sub: string;
    photo: PhotoId;
    /** Three facts that sit under the hero, on the purple. */
    facts: { figure: string; caption: string }[];
  };
  overview: {
    heading: string;
    paragraphs: string[];
    /* Optional. Only where an existing photograph genuinely fits;
       we do not generate a second image per industry just to fill a
       column. Without one the copy runs wider and the section reads
       as an editorial statement instead. */
    photo?: PhotoId;
    caption?: string;
  };
  /** "Disciplines" here; other industries may call these specialties. */
  disciplinesLabel: string;
  disciplinesHeading: string;
  disciplines: Discipline[];
  /** The spec sheet. Tools, standards and credentials we recruit against. */
  stack: { heading: string; intro: string; groups: StackGroup[] };
  /** The trust moment: how a person who is not an engineer screens one. */
  screening: { heading: string; intro: string; steps: { title: string; body: string }[] };
  /** One line of display type between the heavy sections. */
  pullQuote: string;
  market: { heading: string; intro: string; rows: MarketRow[]; note: string };
  engagements: { heading: string; intro: string; options: Engagement[] };
  /** The conversion device: what to have ready before calling. */
  brief: { heading: string; intro: string; items: string[] };
  faqs: { q: string; a: string }[];
  cta: { heading: string; body: string };
};

export const INDUSTRY_PAGES: IndustryPage[] = [
  /* ══════════════════════════════════════════════════════════
     ENGINEERING · the master template.
     ══════════════════════════════════════════════════════════ */
  {
    slug: "engineering",
    meta: {
      title: "Engineering staffing",
      description:
        "Engineering recruitment that knows the difference between controls and automation. Eight disciplines, screened against the standards and tools you actually run, on contract, permanent or a full discipline ramp.",
    },
    hero: {
      eyebrow: "Engineering",
      lead: "We know what a",
      accent: "good engineer looks like.",
      sub: "Eight disciplines, screened against the standards you work to and the tools they will live in. One specialist for a funded programme, a permanent hire the team depends on, or a whole discipline for a ramp up.",
      photo: "industryEngineeringHero",
      facts: [
        {
          figure: "8 disciplines",
          caption: "from design and simulation through controls, quality and commissioning",
        },
        {
          figure: "48 to 72 hours",
          caption: "to first qualified profiles on most engineering briefs",
        },
        {
          figure: "Onshore or offshore",
          caption: "design and analysis can run from India, commissioning cannot, and we say which",
        },
      ],
    },
    overview: {
      heading: "Eight disciplines, three shapes, two locations.",
      photo: "industryEngineeringLab",
      caption: "Test and validation work, where a good engineer earns their keep.",
      paragraphs: [
        "We recruit across eight engineering disciplines, from drafters and technicians through to principal engineers and engineering managers. Manufacturers, plants, utilities and product companies, on permanent, contract and contract-to-hire terms.",
        "Demand reaches us in three shapes. One specialist for a funded programme. A pod of two to five around a single workstream. Or a whole discipline stood up for a ramp up. On contract work the engineer stays our employee, so payroll, compliance and the end date sit with us.",
        "Design, drafting, analysis and simulation can run onshore in the United States or from our India teams. Commissioning, field service and anything that has to be in the room stays local. We tell you which side of that line your scope falls on before you commit to anything.",
      ],
    },
    disciplinesLabel: "Disciplines",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "mechanical",
        name: "Mechanical design",
        photo: "/photos/roles/engineering-mechanical.jpg",
        photoAlt: "A mechanical design engineer reviewing a 3D CAD assembly at her workstation",
        builds:
          "Housings, assemblies, fixtures and tooling, from concept sketches through detailed drawings and tolerance stacks.",
        seniority: "Drafter through to principal designer",
        tools: ["SolidWorks", "Creo", "CATIA", "NX", "Inventor", "AutoCAD"],
        standards: ["ASME Y14.5", "GD&T", "ISO 2768"],
      },
      {
        id: "controls",
        name: "Electrical and controls",
        photo: "/photos/roles/engineering-controls.jpg",
        photoAlt: "A controls engineer testing a PLC panel with a laptop and multimeter",
        builds:
          "Panel design, PLC and HMI programming, drives and instrumentation, plus the commissioning that proves it works.",
        seniority: "Controls technician through to controls lead",
        tools: ["Studio 5000", "TIA Portal", "Ignition", "FactoryTalk", "EPLAN", "AutoCAD Electrical"],
        standards: ["NFPA 79", "UL 508A", "IEC 61131", "NEC"],
      },
      {
        id: "process",
        name: "Process and chemical",
        photo: "/photos/roles/engineering-process.jpg",
        photoAlt: "A process engineer checking readings on a pilot plant skid against a P&ID",
        builds:
          "Mass and energy balances, P&IDs, scale up and the parts of a plant that only make sense once you have run one.",
        seniority: "Process engineer through to process manager",
        tools: ["Aspen Plus", "HYSYS", "AutoCAD P&ID", "PI"],
        standards: ["ISA-5.1", "OSHA PSM", "GMP where regulated"],
      },
      {
        id: "manufacturing",
        name: "Manufacturing and industrial",
        photo: "/photos/roles/engineering-manufacturing.jpg",
        photoAlt: "A manufacturing engineer timing a cycle at an assembly workstation",
        builds:
          "Line layout, work instructions, takt and cycle time, fixture design, and the practical fight to make a design buildable.",
        seniority: "Manufacturing engineer through to operations engineering lead",
        tools: ["SolidWorks", "AutoCAD", "Minitab", "MES platforms"],
        standards: ["Lean", "Six Sigma", "ISO 9001"],
      },
      {
        id: "quality",
        name: "Quality and reliability",
        photo: "/photos/roles/engineering-quality.jpg",
        photoAlt: "A quality engineer inspecting a machined part beside a coordinate measuring machine",
        builds:
          "PPAP, FMEA, gauge R&R, root cause analysis, supplier audits and the documentation that keeps an auditor calm.",
        seniority: "Quality engineer through to quality manager",
        tools: ["Minitab", "CMM and metrology", "GD&T", "CAPA systems"],
        standards: ["IATF 16949", "AS9100", "ISO 9001", "ISO 13485 where regulated"],
      },
      {
        id: "simulation",
        name: "Simulation and analysis",
        photo: "/photos/roles/engineering-simulation.jpg",
        photoAlt: "A simulation engineer studying a finite element stress plot on a large monitor",
        builds:
          "FEA, CFD, thermal and tolerance analysis, and the judgement to know when a model is telling you what you want to hear.",
        seniority: "Analyst through to principal engineer",
        tools: ["ANSYS", "Abaqus", "COMSOL", "Fluent", "MATLAB", "Simulink"],
        standards: ["Correlation to physical test", "ASME V&V where required"],
      },
      {
        id: "project",
        name: "Project engineering",
        photo: "/photos/roles/engineering-project.jpg",
        photoAlt: "A project engineer reviewing a printed schedule wall in a site office",
        builds:
          "Scope, schedule, budget and vendor management for capital work, plus the meetings that keep all three honest.",
        seniority: "Project engineer through to engineering manager",
        tools: ["MS Project", "Primavera P6", "Procore"],
        standards: ["PMP where required", "Stage gate processes"],
      },
      {
        id: "field",
        name: "Commissioning and field service",
        photo: "/photos/roles/engineering-field.jpg",
        photoAlt: "A commissioning engineer checking a sensor during machine start up",
        builds:
          "Installation, start up, fault finding and the customer conversation that comes with all three, usually somewhere else.",
        seniority: "Field technician through to commissioning lead",
        tools: ["Diagnostic and calibration equipment", "Vendor specific platforms"],
        standards: ["Site safety qualifications", "Travel percentage agreed up front"],
      },
    ],
    stack: {
      heading: "What we recruit against.",
      intro:
        "The vocabulary an engineering screen has to be conducted in. If your stack is not here, it is worth a conversation rather than an assumption.",
      groups: [
        {
          name: "CAD and PLM",
          items: ["SolidWorks", "Creo", "CATIA", "NX", "Inventor", "AutoCAD", "Revit", "Teamcenter", "Windchill"],
        },
        {
          name: "Simulation",
          items: ["ANSYS", "Abaqus", "COMSOL", "Fluent", "MATLAB", "Simulink", "Moldflow"],
        },
        {
          name: "Controls and automation",
          items: ["Allen-Bradley", "Siemens", "Studio 5000", "TIA Portal", "Ignition", "Wonderware", "EPLAN"],
        },
        {
          name: "Standards",
          items: ["ASME Y14.5", "IEC 61131", "NFPA 79", "UL 508A", "ISO 9001", "AS9100", "IATF 16949", "ISA-5.1"],
        },
        {
          name: "Credentials we verify",
          items: ["PE", "EIT and FE", "PMP", "Six Sigma Green Belt", "Six Sigma Black Belt", "CSWP", "OSHA 30"],
        },
      ],
    },
    screening: {
      heading: "How a recruiter screens an engineer.",
      intro:
        "Our recruiters are not engineers, and pretending otherwise would be the fastest way to waste your time. What they have instead is a structured technical screen built with hiring managers, and the discipline to use it every time.",
      steps: [
        {
          title: "The brief, in engineering terms",
          body: "Which standards you work to, which CAD and PLM the person lives in, and whether the role owns drawings, reviews them, or both. Ten minutes here saves a fortnight later.",
        },
        {
          title: "Work reviewed, not just read",
          body: "Drawings, a model tree, a controls narrative, a validation report. Whatever the discipline actually produces, we ask to see it before you do.",
        },
        {
          title: "Standards questioned, not assumed",
          body: "A GD&T call-out, a safety circuit, a tolerance stack, a PPAP element. A short set of discipline questions separates the people who have done it from the people who have been near it.",
        },
        {
          title: "Tool fluency checked honestly",
          body: "Familiar with SolidWorks and has shipped production drawings from it are not the same claim, and a resume treats them identically.",
        },
        {
          title: "A reference from a technical lead",
          body: "The person who reviewed their work, not an HR contact who confirms dates. It is the single most useful call in the process.",
        },
      ],
    },
    pullQuote:
      "An engineer relearning your standards and your CAD at the same time is slower for months. A job title never tells you that.",
    market: {
      heading: "Where the market is actually tight.",
      intro:
        "What our recruiters see when they run these searches. It is experience rather than a guarantee, and we would rather set the expectation here than on day thirty of a search.",
      rows: [
        {
          role: "Mechanical designers",
          market: "Deep pool in most manufacturing regions, especially on SolidWorks and Creo.",
          timeline: "Days",
        },
        {
          role: "Manufacturing and industrial",
          market: "Available, though genuine lean and line balancing depth thins out quickly.",
          timeline: "About a week",
        },
        {
          role: "Quality and reliability",
          market: "Steady supply. IATF 16949 and AS9100 depth is scarcer than the resumes suggest.",
          timeline: "One to two weeks",
        },
        {
          role: "Process engineers with plant time",
          market: "Plenty on paper. Few who have actually run a plant through a bad week.",
          timeline: "Two to three weeks",
        },
        {
          role: "Commissioning and field service",
          market: "Small pool, and the travel percentage decides it more often than the pay does.",
          timeline: "Two to four weeks",
        },
        {
          role: "Controls and automation",
          market: "The hardest engineering hire we run, in almost every market. Rockwell and Siemens depth is the constraint.",
          timeline: "Three to four weeks",
        },
      ],
      note: "If a search is going to take a month, we say so at the first conversation rather than sending a weak shortlist in week one.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro:
        "Engineering demand rarely arrives as one neat vacancy. These are the three shapes we see, and the arrangement behind each one.",
      options: [
        {
          name: "One specialist",
          covers: "A single discipline for a defined piece of work.",
          fits: "A funded programme, a backfill, or a skill you need for one phase and not forever.",
          shape: "Contract or contract-to-hire, typically three to twenty four months.",
        },
        {
          name: "A pod",
          covers: "Two to five engineers who work as a unit.",
          fits: "A workstream with its own outcome: a product line, a validation push, a controls upgrade.",
          shape: "Contract, with a lead of ours if you would rather not run it day to day.",
        },
        {
          name: "A discipline ramp",
          covers: "A whole engineering function stood up from very little.",
          fits: "A new plant or line, a migration, or a step change in volume with a date attached.",
          shape: "Project and team staffing. Onshore, offshore or blended, on one contract.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro:
        "None of this needs to be written up. Knowing the answers is enough, and it turns a first conversation into a shortlist rather than a discovery call.",
      items: [
        "The standards you work to, and which of them are actually negotiable",
        "Which CAD, PLM and simulation tools the person will live in every day",
        "Whether the role owns drawings, reviews them, or signs them off",
        "Site, hybrid or remote, and the real travel percentage rather than the hopeful one",
        "The rate or salary band you can approve without a second meeting",
        "Who the engineer reports to, and whether that person can interview this week",
      ],
    },
    faqs: [
      {
        q: "How can a recruiter screen an engineer properly?",
        a: "By not pretending to be one. Our recruiters run a structured technical screen built with hiring managers in that discipline, ask to see the work, and take a reference from the technical lead who reviewed it. Where a role is genuinely specialist we will ask your engineering manager for two questions to add to the screen, and they take five minutes to answer.",
      },
      {
        q: "Which disciplines do you cover?",
        a: "Mechanical design, electrical and controls, process and chemical, manufacturing and industrial, quality and reliability, simulation and analysis, project engineering, and commissioning and field service. If your discipline is not on that list, ask anyway. We would rather say it is not our strength than take the brief and waste your month.",
      },
      {
        q: "Do you verify PE, EIT and other credentials?",
        a: "Yes, before anyone reaches your shortlist. Licences, certifications and any site safety qualifications are checked at screening rather than after an offer, which is the cheapest place to catch a problem.",
      },
      {
        q: "Which engineering work can be delivered offshore?",
        a: "Design, drafting, analysis and simulation usually travel well and can run from our India teams. Commissioning, field service and anything that has to be in the room cannot. We will tell you plainly which side of that line each part of your scope falls on.",
      },
      {
        q: "Can you stand up a whole engineering function?",
        a: "Yes. That is a discipline ramp: several engineers recruited and onboarded together rather than one at a time, with one point of contact and one invoice. It is the arrangement behind most plant and line ramp ups we staff.",
      },
      {
        q: "What does it cost?",
        a: "Contract engineers are an hourly rate covering pay, our employment costs and our margin. A permanent hire is a percentage of first year salary, invoiced when they start. Both are quoted before any work begins, and the replacement guarantee costs nothing extra.",
      },
    ],
    cta: {
      heading: "Hiring engineers?",
      body: "Tell us the discipline, the standards you work to and the tools they will live in. You will get a straight answer on timing at the first conversation, including when it is going to take a month.",
    },
  },
  /* ══════════════════════════════════════════════════════════
     ADMINISTRATIVE
     ══════════════════════════════════════════════════════════ */
  {
    slug: "administrative",
    meta: {
      title: "Administrative staffing",
      description:
        "Executive assistants, coordinators, receptionists and office operations staff, screened on the systems they will actually use and the judgement the job needs.",
    },
    hero: {
      eyebrow: "Administrative",
      lead: "The people who keep",
      accent: "the week upright.",
      sub: "Executive assistants, coordinators, receptionists and office operations staff. Cover for a fortnight, a contract through a busy quarter, or the permanent hire everyone leans on.",
      photo: "industryAdministrativeHero",
      facts: [
        { figure: "6 functions", caption: "from front of house and scheduling through to records and office operations" },
        { figure: "Days, not weeks", caption: "administrative cover is the fastest desk we fill in most markets" },
        { figure: "Tested, not assumed", caption: "systems and speed checked at screening rather than taken from a resume" },
      ],
    },
    overview: {
      heading: "Six functions, one standard of judgement.",
      photo: "levelAdmin",
      caption: "The desk where the day gets organised.",
      paragraphs: [
        "We recruit administrative staff from receptionists and data entry through to senior executive assistants supporting a leadership team. Offices, clinics, plants, public agencies and professional services firms.",
        "Most administrative demand is urgent: someone resigned, someone is on leave, or a project has outgrown the person holding it together. Temporary and contract cover moves in days, and contract-to-hire is the usual route when the role is really permanent.",
        "The part that decides it is rarely software. It is whether the person can hold a diary against three people who all think they are the priority, and still be pleasant on the phone at five o'clock.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "executive-support",
        name: "Executive support",
        photo: "/photos/roles/administrative-executive-support.jpg",
        photoAlt: "An executive assistant managing a calendar and a call outside an executive office",
        builds: "Diaries, travel, expenses, board papers and the gatekeeping that protects a senior person's week.",
        seniority: "Administrative assistant through to executive assistant and chief of staff support",
        tools: ["Outlook", "Microsoft 365", "Concur", "Teams", "DocuSign"],
        standards: ["Discretion and confidentiality", "Calendar and travel policy"],
      },
      {
        id: "coordination",
        name: "Coordination and scheduling",
        photo: "/photos/roles/administrative-coordination.jpg",
        photoAlt: "A coordinator updating a colour coded schedule wall",
        builds: "Project, service and field schedules, meeting logistics, and chasing the people who have not replied yet.",
        seniority: "Coordinator through to senior scheduler",
        tools: ["Excel", "Smartsheet", "Asana", "Monday", "Scheduling platforms"],
        standards: ["Service level tracking", "Escalation discipline"],
      },
      {
        id: "front-of-house",
        name: "Reception and front of house",
        photo: "/photos/roles/administrative-front-of-house.jpg",
        photoAlt: "A receptionist greeting a visitor at a modern corporate front desk",
        builds: "First impressions, visitor management, calls, couriers and the small emergencies that arrive at the desk.",
        seniority: "Receptionist through to front of house lead",
        tools: ["Visitor management systems", "Multi line phone systems", "Outlook"],
        standards: ["Site access and safety procedures", "Confidentiality"],
      },
      {
        id: "records",
        name: "Records and data entry",
        photo: "/photos/roles/administrative-records.jpg",
        photoAlt: "A records specialist entering data from paper forms into a system",
        builds: "Accurate records, document control, digitisation and the audit trail somebody will need in two years.",
        seniority: "Data entry clerk through to records supervisor",
        tools: ["Excel", "SharePoint", "Document management systems", "ERP data entry"],
        standards: ["Retention policy", "HIPAA where healthcare", "Accuracy targets"],
      },
      {
        id: "office-operations",
        name: "Office operations",
        photo: "/photos/roles/administrative-office-operations.jpg",
        photoAlt: "An office operations manager checking supplies with a tablet",
        builds: "Suppliers, facilities, orders, onboarding logistics and the hundred small systems an office runs on.",
        seniority: "Office administrator through to office manager",
        tools: ["Procurement systems", "Facilities ticketing", "Microsoft 365"],
        standards: ["Vendor and purchasing policy", "Health and safety basics"],
      },
      {
        id: "customer-admin",
        name: "Customer administration",
        photo: "/photos/roles/administrative-customer-admin.jpg",
        photoAlt: "A customer administration specialist on a call while entering an order",
        builds: "Order entry, account updates, billing queries and the follow up that stops a small problem becoming a complaint.",
        seniority: "Administrator through to customer operations lead",
        tools: ["Salesforce", "NetSuite", "Zendesk", "ERP order entry"],
        standards: ["Response time targets", "Data protection basics"],
      },
    ],
    stack: {
      heading: "What we recruit against.",
      intro:
        "The systems administrative staff actually live in. We test the ones your role depends on rather than accept a list at the bottom of a resume.",
      groups: [
        { name: "Productivity", items: ["Microsoft 365", "Outlook", "Excel", "Word", "Teams", "SharePoint", "Google Workspace"] },
        { name: "Business systems", items: ["Salesforce", "NetSuite", "SAP", "Workday", "Concur", "DocuSign", "Zendesk"] },
        { name: "Coordination", items: ["Smartsheet", "Asana", "Monday", "Trello", "Calendly"] },
        { name: "Checks we run", items: ["Typing speed", "Excel exercise", "Written communication sample", "Background check"] },
      ],
    },
    screening: {
      heading: "How we screen an administrator.",
      intro:
        "Administrative hiring goes wrong when it is treated as a formality. The skills are testable, the judgement is not, and both have to be checked before anyone reaches your desk.",
      steps: [
        {
          title: "The week, described honestly",
          body: "How many people the person supports, how much of the day is reactive, and who gets to interrupt them. It changes which candidate is right more than the job title does.",
        },
        {
          title: "Systems tested, not listed",
          body: "A short Excel exercise or a system walkthrough where the role depends on one. Proficient in Excel covers everything from sorting a column to building a model.",
        },
        {
          title: "Written communication sampled",
          body: "A short written response, because a great deal of this job is email that somebody senior will be judged by.",
        },
        {
          title: "Judgement questions",
          body: "Two conflicting priorities, a difficult caller, a mistake that needs owning. The answers separate experience from length of service.",
        },
        {
          title: "A reference from the person supported",
          body: "Not the HR file. The manager whose diary they held, who can tell you what happened on a bad week.",
        },
      ],
    },
    pullQuote:
      "Administrative hiring is judged on the quiet weeks and decided on the bad ones. Screen for the bad ones.",
    market: {
      heading: "Where the market is actually tight.",
      intro:
        "What our recruiters see when they run these searches. Experience rather than a guarantee, and we would rather say it now than in week three.",
      rows: [
        { role: "Reception and front of house", market: "Deep pool in most metro markets, and quick to move.", timeline: "Days" },
        { role: "Data entry and records", market: "Readily available. Accuracy under volume is the differentiator, not availability.", timeline: "Days" },
        { role: "Coordinators", market: "Plenty of candidates, fewer who have coordinated across sites or trades.", timeline: "About a week" },
        { role: "Office managers", market: "Steady, though people who have run facilities and vendors as well thin out.", timeline: "One to two weeks" },
        { role: "Executive assistants at leadership level", market: "The hardest administrative hire. Discretion and composure are hard to evidence and harder to replace.", timeline: "Two to three weeks" },
        { role: "Bilingual administrative staff", market: "Market dependent, and worth flagging in the brief rather than discovering late.", timeline: "One to three weeks" },
      ],
      note: "Administrative cover is usually the fastest thing we do. If a search is slower than that, it is normally the seniority or the language requirement, and we will tell you which.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Administrative demand almost never arrives with a month of notice. These are the three shapes we see.",
      options: [
        {
          name: "Cover, now",
          covers: "A desk that has to be staffed tomorrow morning.",
          fits: "Resignation, illness, parental leave or a sudden gap with a deadline behind it.",
          shape: "Temporary, from a single day upward. We are the employer of record.",
        },
        {
          name: "A contract through a peak",
          covers: "Extra administrative capacity for a defined period.",
          fits: "An audit, a system migration, a busy season, or a project that has outgrown its coordinator.",
          shape: "Contract, typically three to twelve months.",
        },
        {
          name: "The permanent hire",
          covers: "The person the office will be built around.",
          fits: "Executive support, office management, or a role where continuity is the whole point.",
          shape: "Contract-to-hire when fit matters most, direct hire when you are sure.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "Nothing formal. Knowing these turns a first call into a shortlist rather than a discovery session.",
      items: [
        "How many people the person supports, and who can interrupt them",
        "The systems they will be in every day, and which ones are non negotiable",
        "How much of the role is reactive rather than planned",
        "On site, hybrid or remote, and the hours that actually matter",
        "The rate or salary band you can approve without a second meeting",
        "Whether this is cover, a contract, or a role you want somebody to stay in",
      ],
    },
    faqs: [
      {
        q: "How quickly can you cover an administrative desk?",
        a: "Often the same week, and sometimes the next morning for reception and data entry. These are the roles where our bench is deepest, and where being a day late actually costs you something.",
      },
      {
        q: "Do you test skills or just check resumes?",
        a: "We test the ones the role depends on. A short Excel exercise, a typing check where speed matters, and a written response, because much of this job is email that a senior person will be judged by.",
      },
      {
        q: "Can a temporary administrator become permanent?",
        a: "Often, and it is one of the better ways to hire for these roles. Tell us early and we will set it up as contract-to-hire so the conversion terms are agreed before anyone starts.",
      },
      {
        q: "Do you place bilingual administrative staff?",
        a: "Yes, and it is worth flagging in the brief. Language requirements are the most common reason an otherwise fast administrative search takes an extra fortnight.",
      },
      {
        q: "What about confidentiality?",
        a: "Background checks are run where the role requires them, and discretion is part of the screen for any role supporting leadership or handling records. On temporary and contract work the person is our employee, so the confidentiality terms sit with us.",
      },
      {
        q: "What does it cost?",
        a: "Temporary and contract cover is an hourly rate covering pay, our employment costs and our margin. A permanent hire is a percentage of first year salary. Both quoted before any work starts.",
      },
    ],
    cta: {
      heading: "Need a desk covered?",
      body: "Tell us who the person supports, the systems they need and when. Administrative cover is usually the fastest thing we do.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     FINANCIAL SERVICES
     ══════════════════════════════════════════════════════════ */
  {
    slug: "financial-services",
    meta: {
      title: "Financial services staffing",
      description:
        "Accountants, analysts, AP and AR specialists, audit and compliance staff and banking operations teams, screened on the systems and the close cycle you actually run.",
    },
    hero: {
      eyebrow: "Financial services",
      lead: "The people who close",
      accent: "the month on time.",
      sub: "Accountants, analysts, AP and AR specialists, audit and compliance staff. Cover through a close, a contract for a system migration, or the controller everything runs through.",
      photo: "industryFinanceHero",
      facts: [
        { figure: "6 functions", caption: "from transactional AP and AR through to controllership and compliance" },
        { figure: "Close and audit ready", caption: "screened for the cycle you run, not just the software you licence" },
        { figure: "Contract or permanent", caption: "the person stays our employee on contract work, including through year end" },
      ],
    },
    overview: {
      heading: "Six functions, one deadline everybody shares.",
      photo: "levelProfessional",
      caption: "Month end, where finance hiring is actually judged.",
      paragraphs: [
        "We recruit across transactional finance, reporting, analysis, audit and compliance, and banking and lending operations. Corporates, lenders, insurers, professional services firms and finance shared service centres.",
        "Finance demand clusters. Year end, an audit, an ERP migration, a resignation two weeks before close. Contract cover moves quickly and contract-to-hire is common where the role is permanent but the headcount is not signed yet.",
        "What separates candidates is rarely the qualification. It is whether they have owned a close, sat through an audit, or cleaned up a ledger somebody else left behind, and that only comes out if you ask.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "transactional",
        name: "Accounts payable and receivable",
        photo: "/photos/roles/financial-services-transactional.jpg",
        photoAlt: "An accounts payable specialist matching invoices against a ledger",
        builds: "Invoice processing, matching, payment runs, collections and the reconciliations that keep the ledger honest.",
        seniority: "Clerk through to AP or AR supervisor",
        tools: ["SAP", "Oracle", "NetSuite", "QuickBooks", "Coupa", "Bill.com"],
        standards: ["Three way match", "Segregation of duties", "Aging targets"],
      },
      {
        id: "accounting",
        name: "Accounting and control",
        photo: "/photos/roles/financial-services-accounting.jpg",
        photoAlt: "An accountant working through a month end reconciliation",
        builds: "Journals, reconciliations, month end close, fixed assets and the schedules an auditor will ask for.",
        seniority: "Staff accountant through to controller",
        tools: ["NetSuite", "SAP", "Oracle", "Blackline", "Excel"],
        standards: ["US GAAP", "SOX where public", "Close calendar discipline"],
      },
      {
        id: "fpa",
        name: "Financial planning and analysis",
        photo: "/photos/roles/financial-services-fpa.jpg",
        photoAlt: "A financial analyst presenting a forecast to colleagues",
        builds: "Budgets, forecasts, variance analysis and the model somebody senior will make a decision on.",
        seniority: "Analyst through to FP&A manager",
        tools: ["Excel modelling", "Power BI", "Tableau", "Anaplan", "Adaptive"],
        standards: ["Driver based forecasting", "Board reporting"],
      },
      {
        id: "audit-compliance",
        name: "Audit, risk and compliance",
        photo: "/photos/roles/financial-services-audit-compliance.jpg",
        photoAlt: "An auditor reviewing controls documentation at a boardroom table",
        builds: "Internal audit, controls testing, AML and KYC review, regulatory reporting and remediation work.",
        seniority: "Analyst through to compliance manager",
        tools: ["Audit management platforms", "Case management systems", "Excel"],
        standards: ["SOX", "BSA and AML", "KYC", "Internal audit standards"],
      },
      {
        id: "banking-ops",
        name: "Banking and lending operations",
        photo: "/photos/roles/financial-services-banking-ops.jpg",
        photoAlt: "A banking operations officer reviewing a loan file",
        builds: "Loan processing, servicing, documentation, funding and the exceptions queue nobody enjoys.",
        seniority: "Processor through to operations supervisor",
        tools: ["Encompass", "Fiserv", "Jack Henry", "Salesforce Financial Services Cloud"],
        standards: ["Lending regulations", "Document integrity", "Turnaround targets"],
      },
      {
        id: "payroll-tax",
        name: "Payroll and tax support",
        photo: "/photos/roles/financial-services-payroll-tax.jpg",
        photoAlt: "A payroll specialist checking a payroll register",
        builds: "Multi state payroll, filings, reconciliations and the queries that arrive the day after pay day.",
        seniority: "Payroll administrator through to payroll manager",
        tools: ["ADP", "UKG", "Workday", "Paylocity", "Avalara"],
        standards: ["Multi state tax", "Wage and hour rules", "Filing deadlines"],
      },
    ],
    stack: {
      heading: "What we recruit against.",
      intro:
        "The systems and frameworks a finance screen has to cover. If your stack is not here it is worth a conversation, because the wrong ERP experience costs months.",
      groups: [
        { name: "ERP and accounting", items: ["SAP", "Oracle", "NetSuite", "Microsoft Dynamics", "QuickBooks", "Sage", "Workday Financials"] },
        { name: "Close and reporting", items: ["Blackline", "Hyperion", "OneStream", "Power BI", "Tableau", "Excel modelling"] },
        { name: "Banking and lending", items: ["Encompass", "Fiserv", "Jack Henry", "nCino", "Salesforce FSC"] },
        { name: "Frameworks", items: ["US GAAP", "SOX", "IFRS where relevant", "BSA and AML", "KYC"] },
        { name: "Credentials we verify", items: ["CPA", "CMA", "CFA", "Enrolled Agent", "Series licences where required"] },
      ],
    },
    screening: {
      heading: "How we screen a finance hire.",
      intro:
        "Finance resumes look alike because the vocabulary is standard. The differences show up in what somebody has owned, and that takes specific questions rather than a longer interview.",
      steps: [
        {
          title: "The cycle, in your terms",
          body: "Your ERP, your close calendar, whether the role owns a schedule or supports one, and whether an auditor will ever speak to this person.",
        },
        {
          title: "Ownership tested",
          body: "Not have you done reconciliations, but which accounts did you own, what was the messiest one, and how long did close take when you got there compared to when you left.",
        },
        {
          title: "Systems checked properly",
          body: "SAP as an end user and SAP as somebody who configures it are different jobs. We establish which one the candidate actually is.",
        },
        {
          title: "A short technical exercise",
          body: "Where the role justifies it: a reconciliation with a deliberate error, or a small model. Fifteen minutes, and it settles more than a second interview.",
        },
        {
          title: "A reference from a finance lead",
          body: "The controller or manager who reviewed their work, not an HR contact confirming dates.",
        },
      ],
    },
    pullQuote:
      "Everybody has done reconciliations. The question is which accounts they owned, and what shape those accounts were in when they left.",
    market: {
      heading: "Where the market is actually tight.",
      intro:
        "What our recruiters see running these searches. Experience rather than a promise, and better said now than at month end.",
      rows: [
        { role: "AP and AR clerks", market: "Deep pool in most markets. Volume experience and system familiarity separate them.", timeline: "Days" },
        { role: "Staff accountants", market: "Available, though people who have genuinely owned a close are fewer than the resumes suggest.", timeline: "About a week" },
        { role: "Payroll specialists", market: "Steadier than most think, but multi state and multi entity experience is scarcer.", timeline: "One to two weeks" },
        { role: "FP&A analysts", market: "Competitive. Strong modelling plus the ability to present to a board is the constraint.", timeline: "Two to three weeks" },
        { role: "Controllers", market: "A genuine search. Public company and SOX experience narrows the field quickly.", timeline: "Three to five weeks" },
        { role: "Compliance and AML", market: "Tight in most regulated markets, and the first thing a competitor counter offers on.", timeline: "Three to four weeks" },
      ],
      note: "Close and year end are the two worst times to start a permanent search and the two most common. If you are hiring into a close, contract cover first is usually the safer sequence.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Finance demand arrives on a calendar, which at least means it can be planned for.",
      options: [
        {
          name: "Close or audit cover",
          covers: "Extra hands for a defined finance event.",
          fits: "Year end, an audit, a backlog, or a resignation with bad timing.",
          shape: "Temporary or contract, weeks to months. We are the employer of record.",
        },
        {
          name: "Project finance",
          covers: "Specialists for a system or reporting change.",
          fits: "An ERP migration, a reporting build, a remediation programme, a carve out.",
          shape: "Contract, typically six to eighteen months.",
        },
        {
          name: "The permanent hire",
          covers: "The person who owns the number.",
          fits: "Controller, finance manager, senior analyst, compliance lead.",
          shape: "Direct hire, or contract-to-hire where the headcount is not signed yet.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "None of this needs writing up. Knowing it turns a first call into a shortlist.",
      items: [
        "Your ERP, and whether the person needs to use it or configure it",
        "Whether the role owns a close schedule or supports one",
        "Public, private or private equity backed, and whether SOX applies",
        "Multi entity or multi state complexity, especially for payroll",
        "The rate or salary band you can approve without a second meeting",
        "Whether you are hiring into a close, and how much runway there is",
      ],
    },
    faqs: [
      {
        q: "Can you cover a close at short notice?",
        a: "Usually. Transactional and staff accounting cover moves within days, and contractors who have worked several closes are used to arriving mid cycle. Controller level cover takes longer and is worth planning a month out.",
      },
      {
        q: "Do you verify CPA and other credentials?",
        a: "Yes, before shortlist, along with any state licences the role requires. It is the cheapest place to catch a problem.",
      },
      {
        q: "How do you test finance skills?",
        a: "Where the role justifies it, a short exercise: a reconciliation with a deliberate error, or a small model. It takes fifteen minutes and settles more than a second interview does.",
      },
      {
        q: "Can contract finance staff work through year end?",
        a: "Yes, and it is one of the most common reasons clients use contract cover. The person remains our employee, so payroll, taxes and the end date sit with us.",
      },
      {
        q: "Do you recruit for regulated banking and lending roles?",
        a: "Yes, including processing, servicing, compliance, AML and KYC. Where a role requires a licence or registration we verify it at screening rather than after an offer.",
      },
      {
        q: "What does it cost?",
        a: "Contract finance staff are an hourly rate covering pay, our employment costs and our margin. A permanent hire is a percentage of first year salary, invoiced when they start. Both quoted before any work begins.",
      },
    ],
    cta: {
      heading: "Hiring into finance?",
      body: "Tell us your ERP, your close calendar and whether this is cover or a permanent seat. You will get a straight answer on timing at the first conversation.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     HEALTHCARE
     ══════════════════════════════════════════════════════════ */
  {
    slug: "healthcare",
    meta: {
      title: "Healthcare staffing",
      description:
        "Nurses, allied health professionals, medical office and revenue cycle staff, screened on licence, competency and the setting they will actually work in.",
    },
    hero: {
      eyebrow: "Healthcare",
      lead: "Cover the shift without",
      accent: "lowering the bar.",
      sub: "Nurses, allied health professionals, medical office and revenue cycle staff. Licences verified, competencies checked, and people who have worked your kind of setting before.",
      photo: "industryHealthcareHero",
      facts: [
        { figure: "Licence verified", caption: "primary source verification before anyone reaches your shortlist" },
        { figure: "6 functions", caption: "from bedside and allied health through to the office that keeps a clinic solvent" },
        { figure: "Shift ready", caption: "screened for the setting and the shift pattern, not just the credential" },
      ],
    },
    overview: {
      heading: "The credential is the start, not the answer.",
      photo: "heroA",
      caption: "Handover, where continuity is either protected or lost.",
      paragraphs: [
        "We staff clinical and non clinical healthcare roles: nursing, allied health, technicians, medical office and revenue cycle. Hospitals, clinics, outpatient centres, long term care and physician practices.",
        "Healthcare hiring is compliance heavy and time critical at once, which is a difficult combination. We verify licences at source, check competencies and immunisation records, and only then talk about availability.",
        "The other half is fit for setting. A nurse who thrives on a busy med surg floor is not automatically right for long term care, and the difference shows up in week two rather than at interview.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "nursing",
        name: "Nursing",
        photo: "/photos/roles/healthcare-nursing.jpg",
        photoAlt: "A nurse checking a monitor at a patient bedside",
        builds: "Bedside care across med surg, telemetry, long term care and outpatient settings, on days, nights and weekends.",
        seniority: "CNA and LPN through to RN and charge nurse",
        tools: ["Epic", "Cerner", "Meditech", "Point Click Care"],
        standards: ["State RN or LPN licence", "BLS and ACLS", "Skills checklist"],
      },
      {
        id: "allied",
        name: "Allied health",
        photo: "/photos/roles/healthcare-allied.jpg",
        photoAlt: "A physical therapist guiding a patient through a walking exercise",
        builds: "Imaging, laboratory, respiratory, rehabilitation and the diagnostic work a clinic runs on.",
        seniority: "Technician through to senior therapist",
        tools: ["PACS", "LIS", "Modality specific systems"],
        standards: ["ARRT", "ASCP", "State licensure", "Modality competencies"],
      },
      {
        id: "medical-office",
        name: "Medical office",
        photo: "/photos/roles/healthcare-medical-office.jpg",
        photoAlt: "A medical office coordinator checking in a patient at a clinic front desk",
        builds: "Front desk, scheduling, intake, referrals, prior authorisation and the patient experience before anyone sees a clinician.",
        seniority: "Receptionist through to practice supervisor",
        tools: ["Epic", "athenahealth", "eClinicalWorks", "NextGen"],
        standards: ["HIPAA", "Insurance verification", "Scheduling protocols"],
      },
      {
        id: "revenue-cycle",
        name: "Revenue cycle",
        photo: "/photos/roles/healthcare-revenue-cycle.jpg",
        photoAlt: "A medical billing specialist reviewing a claim",
        builds: "Coding, billing, claims, denials and appeals, and the collections work that keeps a practice solvent.",
        seniority: "Biller through to revenue cycle manager",
        tools: ["Epic Resolute", "Availity", "Waystar", "Coding platforms"],
        standards: ["CPC or CCS coding", "ICD-10 and CPT", "Payer rules"],
      },
      {
        id: "behavioural",
        name: "Behavioural health support",
        photo: "/photos/roles/healthcare-behavioural.jpg",
        photoAlt: "A behavioural health support worker listening in a counselling room",
        builds: "Direct support, case coordination and the documentation that keeps a programme funded and compliant.",
        seniority: "Support worker through to case manager",
        tools: ["EHR platforms", "Case management systems"],
        standards: ["State requirements", "Crisis training", "Documentation standards"],
      },
      {
        id: "operations",
        name: "Clinical operations and leadership",
        photo: "/photos/roles/healthcare-operations.jpg",
        photoAlt: "A nurse manager reviewing a staffing board with a charge nurse",
        builds: "Scheduling, staffing, quality, accreditation readiness and the unglamorous side of running a unit.",
        seniority: "Coordinator through to clinical manager",
        tools: ["Staffing and scheduling platforms", "Quality reporting systems"],
        standards: ["Joint Commission readiness", "CMS conditions of participation"],
      },
    ],
    stack: {
      heading: "What we verify and recruit against.",
      intro:
        "Healthcare screening is documentary before it is anything else. This is what gets checked, at source, before a name reaches you.",
      groups: [
        { name: "Clinical systems", items: ["Epic", "Cerner", "Meditech", "athenahealth", "eClinicalWorks", "NextGen", "Point Click Care"] },
        { name: "Licences", items: ["RN", "LPN", "CNA", "Therapy licensure", "Compact licences where applicable"] },
        { name: "Certifications", items: ["BLS", "ACLS", "PALS", "ARRT", "ASCP", "CPC", "CCS"] },
        { name: "Compliance", items: ["HIPAA", "Immunisation records", "TB and fit testing", "Background and OIG checks", "Drug screening"] },
      ],
    },
    screening: {
      heading: "How we screen a clinician.",
      intro:
        "Healthcare is the one industry where the paperwork genuinely is the screen, and where cutting a corner has a patient on the other end of it. This part is not negotiable.",
      steps: [
        {
          title: "Primary source verification",
          body: "Licence checked with the issuing board, not read off a resume or a photograph of a card. Expiry, status and any restrictions.",
        },
        {
          title: "Competency and setting",
          body: "A skills checklist for the specialty, plus a conversation about ratios, acuity and the kind of unit they have actually worked.",
        },
        {
          title: "Compliance file assembled",
          body: "Immunisations, TB, fit testing, background and OIG exclusion checks, and drug screening where required, before the first shift rather than after it.",
        },
        {
          title: "Shift reality confirmed",
          body: "Nights, weekends, rotating, on call, and how far they are genuinely willing to travel. Most failed healthcare placements fail here, not clinically.",
        },
        {
          title: "A reference from a charge nurse or supervisor",
          body: "Somebody who worked a shift with them, who can speak to how they handle a bad night rather than confirm dates.",
        },
      ],
    },
    pullQuote:
      "Most healthcare placements do not fail clinically. They fail on the shift pattern nobody asked about properly.",
    market: {
      heading: "Where the market is actually tight.",
      intro:
        "What our recruiters see running these searches. It is experience rather than a guarantee, and it is worth hearing before you plan a rota around it.",
      rows: [
        { role: "Medical office and front desk", market: "Available in most markets, and quick to move.", timeline: "Days" },
        { role: "Medical billers and coders", market: "Steady supply. Certified coders with payer specific denial experience are scarcer.", timeline: "One to two weeks" },
        { role: "CNAs and support staff", market: "Available, though retention rather than supply is usually the real problem.", timeline: "Days to a week" },
        { role: "Allied health technicians", market: "Modality dependent. Imaging and lab are tighter than most people expect.", timeline: "Two to four weeks" },
        { role: "Experienced RNs on nights", market: "The hardest healthcare hire we run in most markets. Differential and ratios decide it more than base pay.", timeline: "Three to five weeks" },
        { role: "Clinical leadership", market: "A genuine search, and usually confidential.", timeline: "Four to six weeks" },
      ],
      note: "If a rota depends on a hire landing by a date, tell us the date first. We would rather build the plan around it than discover it late.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Healthcare demand is rarely one clean vacancy. These are the three shapes we see most.",
      options: [
        {
          name: "Shift and short term cover",
          covers: "Filling a rota that is short this week.",
          fits: "Sickness, leave, a census spike, or a unit running short while you recruit permanently.",
          shape: "Temporary. We are the employer of record and carry the compliance file.",
        },
        {
          name: "Contract assignments",
          covers: "A clinician for a defined block.",
          fits: "Seasonal demand, a unit opening, a leave of absence, or a permanent search that will take time.",
          shape: "Contract, typically thirteen weeks upward, extendable.",
        },
        {
          name: "The permanent hire",
          covers: "The person who becomes part of the unit.",
          fits: "Core clinical roles, practice leadership, revenue cycle management.",
          shape: "Direct hire, or contract-to-hire where fit with the unit matters most.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "Knowing these answers is what turns a first call into candidates rather than questions.",
      items: [
        "The setting and the acuity, not just the job title",
        "Shift pattern, rotation and whether there is a differential",
        "Ratios, and what support the person will actually have",
        "Which EHR you run, and whether training is provided",
        "Licence, certification and immunisation requirements specific to your site",
        "The date the rota needs this filled by",
      ],
    },
    faqs: [
      {
        q: "How do you verify licences?",
        a: "At primary source, with the issuing board, before anyone reaches your shortlist. We check status, expiry and any restrictions, and we recheck at renewal for anyone on assignment with us.",
      },
      {
        q: "Who carries the compliance file on temporary staff?",
        a: "We do. Immunisations, TB, fit testing, background and OIG exclusion checks and drug screening are assembled by us before the first shift, and the person is our employee for the assignment.",
      },
      {
        q: "Can you cover nights and weekends?",
        a: "Yes, and we screen for it explicitly rather than assume it. Shift pattern is the most common reason a clinically sound placement does not last, so we confirm it before you meet anyone.",
      },
      {
        q: "Do you place non clinical healthcare staff?",
        a: "Yes. Medical office, scheduling, intake, prior authorisation, coding, billing and revenue cycle management. For many practices these are the roles that decide whether the month works financially.",
      },
      {
        q: "How quickly can you fill a nursing vacancy?",
        a: "It depends heavily on shift and specialty. Day shift in an accessible market can move in a fortnight. Experienced nights on a busy floor is a three to five week search in most markets, and we will say so at the first conversation.",
      },
      {
        q: "What does it cost?",
        a: "Temporary and contract clinicians are an hourly rate covering pay, our employment costs, compliance and our margin. A permanent hire is a percentage of first year salary. Both quoted before any work starts.",
      },
    ],
    cta: {
      heading: "Short on the rota?",
      body: "Tell us the setting, the shift and the date it has to be covered by. Licences are verified before anyone reaches your shortlist.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     HUMAN RESOURCES
     ══════════════════════════════════════════════════════════ */
  {
    slug: "human-resources",
    meta: {
      title: "Human resources staffing",
      description:
        "Recruiters, HR coordinators, payroll and benefits specialists and HRIS analysts, screened on the systems you run and the compliance the role carries.",
    },
    hero: {
      eyebrow: "Human resources",
      lead: "The people who hire",
      accent: "your people.",
      sub: "Recruiters, HR coordinators, payroll and benefits specialists, HRIS analysts and employee relations. Surge capacity for a hiring push, or the HR lead a growing company finally needs.",
      photo: "industryHrHero",
      facts: [
        { figure: "6 functions", caption: "from talent acquisition and HR operations to payroll, HRIS and employee relations" },
        { figure: "Systems tested", caption: "Workday, ADP and UKG experience checked rather than taken from a resume" },
        { figure: "Surge or permanent", caption: "recruiters for a hiring push, or the person who builds the function" },
      ],
    },
    overview: {
      heading: "The function everyone calls when it is already late.",
      photo: "industriesTeam",
      caption: "Talent teams: the people we staff and work beside.",
      paragraphs: [
        "We recruit across talent acquisition, HR operations, payroll and benefits, HRIS and employee relations, for companies from a single site through to multi state employers.",
        "Two patterns dominate. A hiring push that needs recruiters and coordinators for six months, and a company that has grown past the point where the office manager can also run HR.",
        "Both are systems dependent. Workday, ADP and UKG are not interchangeable, and a payroll specialist who has only run single state is a different hire from one who has closed multi state and multi entity.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "talent-acquisition",
        name: "Talent acquisition",
        photo: "/photos/roles/human-resources-talent-acquisition.jpg",
        photoAlt: "A recruiter interviewing a candidate in a glass meeting room",
        builds: "Sourcing, screening, scheduling and offer management, plus the hiring manager relationships that make it work.",
        seniority: "Recruiting coordinator through to talent acquisition manager",
        tools: ["Greenhouse", "Lever", "Workday Recruiting", "iCIMS", "LinkedIn Recruiter"],
        standards: ["EEOC and OFCCP awareness", "Structured interviewing", "Offer approval process"],
      },
      {
        id: "hr-operations",
        name: "HR operations",
        photo: "/photos/roles/human-resources-hr-operations.jpg",
        photoAlt: "An HR operations specialist handing a new starter a welcome folder",
        builds: "Onboarding, records, employment verification, leave administration and the tickets that arrive every Monday.",
        seniority: "HR assistant through to HR operations manager",
        tools: ["Workday", "BambooHR", "SuccessFactors", "ServiceNow HR"],
        standards: ["I-9 and E-Verify", "FMLA and ADA administration", "Records retention"],
      },
      {
        id: "payroll",
        name: "Payroll and benefits",
        photo: "/photos/roles/human-resources-payroll.jpg",
        photoAlt: "A benefits administrator walking an employee through a benefits summary",
        builds: "Payroll cycles, multi state filings, benefits administration, open enrolment and the queries that follow pay day.",
        seniority: "Payroll administrator through to payroll and benefits manager",
        tools: ["ADP", "UKG", "Paylocity", "Workday Payroll", "Paycom"],
        standards: ["FLSA", "Multi state tax", "ACA reporting", "401k and benefits compliance"],
      },
      {
        id: "hris",
        name: "HRIS and people analytics",
        photo: "/photos/roles/human-resources-hris.jpg",
        photoAlt: "A people analytics specialist studying a headcount dashboard",
        builds: "System configuration, integrations, reporting and the data hygiene that makes headcount numbers trustworthy.",
        seniority: "HRIS analyst through to HRIS manager",
        tools: ["Workday", "SuccessFactors", "UKG Pro", "Power BI", "Excel"],
        standards: ["Data privacy", "Change control", "Reporting accuracy"],
      },
      {
        id: "employee-relations",
        name: "Employee relations",
        photo: "/photos/roles/human-resources-employee-relations.jpg",
        photoAlt: "An employee relations manager in a private conversation with an employee",
        builds: "Investigations, performance issues, accommodations, terminations and the documentation that has to stand up later.",
        seniority: "HR generalist through to ER specialist and HR business partner",
        tools: ["Case management systems", "HRIS documentation"],
        standards: ["Investigation practice", "ADA accommodation", "Progressive discipline"],
      },
      {
        id: "learning",
        name: "Learning and development",
        photo: "/photos/roles/human-resources-learning.jpg",
        photoAlt: "A learning and development facilitator leading a workshop",
        builds: "Onboarding programmes, compliance training, skills matrices and the training records an auditor will ask about.",
        seniority: "Training coordinator through to L&D manager",
        tools: ["LMS platforms", "Articulate", "Workday Learning"],
        standards: ["Compliance training records", "Competency frameworks"],
      },
    ],
    stack: {
      heading: "What we recruit against.",
      intro:
        "HR systems are not interchangeable, and the wrong platform experience costs a quarter. These are the ones we screen on.",
      groups: [
        { name: "HRIS and payroll", items: ["Workday", "ADP", "UKG", "Paylocity", "Paycom", "BambooHR", "SuccessFactors"] },
        { name: "Recruiting", items: ["Greenhouse", "Lever", "iCIMS", "Workday Recruiting", "LinkedIn Recruiter"] },
        { name: "Compliance", items: ["FLSA", "FMLA", "ADA", "I-9 and E-Verify", "ACA", "EEOC", "OFCCP"] },
        { name: "Credentials we verify", items: ["SHRM-CP", "SHRM-SCP", "PHR", "SPHR", "CPP", "CEBS"] },
      ],
    },
    screening: {
      heading: "How we screen an HR hire.",
      intro:
        "HR candidates interview well by profession, which is exactly why the screen has to be about what they have actually carried rather than how they describe it.",
      steps: [
        {
          title: "Scope, not job title",
          body: "Headcount supported, how many states, whether the role owns payroll or hands it to a provider, and who handles an investigation today.",
        },
        {
          title: "Systems established properly",
          body: "Workday as an end user, a configurator or a report writer are three different people. We find out which one is in front of us.",
        },
        {
          title: "Compliance questioned",
          body: "A leave scenario, a classification question, an I-9 correction. Short, specific, and it separates practice from theory quickly.",
        },
        {
          title: "A difficult conversation, described",
          body: "A termination, an accommodation, a complaint about a senior person. What they did, and what they would do differently.",
        },
        {
          title: "A reference from an HR leader",
          body: "Somebody who saw the case files, not a manager who liked working with them.",
        },
      ],
    },
    pullQuote:
      "HR is judged on the quiet quarters and remembered for the one investigation that was handled badly. Screen for the second.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a guarantee.",
      rows: [
        { role: "Recruiting coordinators", market: "Deep pool, and a common entry route. Scheduling volume is the differentiator.", timeline: "Days" },
        { role: "HR assistants and generalists", market: "Readily available at junior level, thinner at true generalist depth.", timeline: "About a week" },
        { role: "Corporate recruiters", market: "Cyclical. Availability swings with the wider hiring market more than any other HR role.", timeline: "One to two weeks" },
        { role: "Payroll specialists, multi state", market: "Scarcer than expected. Single state experience is common, multi state and multi entity is not.", timeline: "Two to three weeks" },
        { role: "HRIS analysts", market: "Tight, particularly on Workday configuration rather than reporting.", timeline: "Three to four weeks" },
        { role: "Employee relations specialists", market: "The hardest HR hire we run. Genuine investigation experience is rare and heavily counter offered.", timeline: "Three to five weeks" },
      ],
      note: "If your hiring plan depends on recruiters starting by a date, contract recruiters are usually the faster route and can convert later.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "HR demand is either a spike or a structural gap, and the two need different answers.",
      options: [
        {
          name: "Recruiting surge",
          covers: "Contract recruiters and coordinators for a hiring push.",
          fits: "A funding round, a new site, a seasonal ramp, or a backlog of open requisitions.",
          shape: "Contract, three to twelve months, scaling down as the requisitions close.",
        },
        {
          name: "Project HR",
          covers: "Specialists for a defined piece of work.",
          fits: "An HRIS implementation, an audit, a policy rebuild, an acquisition integration.",
          shape: "Contract, typically six to eighteen months.",
        },
        {
          name: "The permanent hire",
          covers: "The person who owns the function.",
          fits: "First HR leader, HR business partner, payroll manager, ER specialist.",
          shape: "Direct hire, or contract-to-hire where the shape of the role is still forming.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "Knowing these turns a first call into a shortlist rather than a scoping exercise.",
      items: [
        "Headcount supported, and how many states or entities",
        "Your HRIS and payroll platforms, and whether the role configures or uses them",
        "Whether payroll is run in house or through a provider",
        "Who handles employee relations cases today, and what happens when they are away",
        "Union, non union, or a mix",
        "The rate or salary band you can approve without a second meeting",
      ],
    },
    faqs: [
      {
        q: "Can you provide contract recruiters for a hiring push?",
        a: "Yes, and it is one of the most common things we do in HR. Contract recruiters and coordinators can be in place within a fortnight and scaled down as requisitions close, without touching permanent headcount.",
      },
      {
        q: "Do you verify SHRM, PHR and payroll certifications?",
        a: "Yes, before shortlist, along with any state specific requirements. Certification is not the whole picture in HR, but claiming one you do not hold tells you something.",
      },
      {
        q: "How do you screen for employee relations experience?",
        a: "By asking about specific cases: an investigation, an accommodation, a termination that went badly. What they did, what the documentation looked like, and what they would change. It is the fastest way to tell practice from theory.",
      },
      {
        q: "Do you place payroll for multi state employers?",
        a: "Yes, and it is worth flagging early. Multi state and multi entity payroll experience is considerably scarcer than single state, and it is the most common reason an HR search runs long.",
      },
      {
        q: "Can HR work be delivered offshore?",
        a: "Parts of it. Recruiting coordination, HRIS reporting and some operations work travel well. Employee relations, investigations and anything requiring presence do not, and we will tell you which side your scope falls on.",
      },
      {
        q: "What does it cost?",
        a: "Contract HR staff are an hourly rate covering pay, our employment costs and our margin. A permanent hire is a percentage of first year salary. Both quoted before any work starts.",
      },
    ],
    cta: {
      heading: "Building out HR?",
      body: "Tell us the headcount supported, your HRIS and whether this is a surge or a structural gap. We will tell you which of the two you actually have.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     INFORMATION TECHNOLOGY
     ══════════════════════════════════════════════════════════ */
  {
    slug: "information-technology",
    meta: {
      title: "Information technology staffing",
      description:
        "Software engineers, data and cloud specialists, cybersecurity, service desk and ERP consultants. Screened on the stack you actually run, onshore, offshore or blended.",
    },
    hero: {
      eyebrow: "Information technology",
      lead: "Engineers who have",
      accent: "shipped it before.",
      sub: "Software, data, cloud, security, service desk and ERP. One specialist for a programme, a pod around a workstream, or a blended onshore and offshore team under one contract.",
      photo: "industryItHero",
      facts: [
        { figure: "6 disciplines", caption: "from software and data through cloud, security, support and ERP" },
        { figure: "200+ consultants", caption: "on assignment with our clients at any one time" },
        { figure: "Onshore or offshore", caption: "delivery from the United States, from India, or a blend on one contract" },
      ],
    },
    overview: {
      heading: "The stack decides the shortlist.",
      photo: "levelSkilled",
      caption: "Infrastructure work, which is still where the outages come from.",
      paragraphs: [
        "We recruit across software engineering, data and analytics, cloud and infrastructure, cybersecurity, IT support, and enterprise applications including SAP, Salesforce and ServiceNow.",
        "Technology hiring goes wrong when a job title is treated as a specification. A backend engineer on a Java monolith and one on event driven Go are not substitutes, and neither is a cloud engineer who has only ever inherited someone else's Terraform.",
        "So we screen on the stack, the scale and what the person actually owned. And where work travels well, we will say so: much of build and support runs perfectly from our India teams, while incident response and stakeholder heavy roles do not.",
      ],
    },
    disciplinesLabel: "Disciplines",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "software",
        name: "Software engineering",
        photo: "/photos/roles/information-technology-software.jpg",
        photoAlt: "A software engineer working across two monitors of code",
        builds: "Services, APIs and interfaces, plus the tests and pipelines that let somebody else change them safely.",
        seniority: "Mid level engineer through to principal and engineering manager",
        tools: ["Java", "C#", ".NET", "Python", "Node", "React", "TypeScript", "Go"],
        standards: ["Code review discipline", "CI/CD", "Test coverage expectations"],
      },
      {
        id: "data",
        name: "Data and analytics",
        photo: "/photos/roles/information-technology-data.jpg",
        photoAlt: "A data analyst working between a dashboard and a notebook",
        builds: "Pipelines, warehouses, models and the reporting layer that a business will make decisions on.",
        seniority: "Data analyst through to lead data engineer",
        tools: ["Snowflake", "Databricks", "dbt", "Airflow", "Power BI", "Tableau", "SQL", "Python"],
        standards: ["Data quality and lineage", "Governance", "Model documentation"],
      },
      {
        id: "cloud",
        name: "Cloud and infrastructure",
        photo: "/photos/roles/information-technology-cloud.jpg",
        photoAlt: "A cloud engineer reviewing an architecture diagram with a colleague",
        builds: "Landing zones, networking, Kubernetes, observability and the automation that keeps it reproducible.",
        seniority: "Cloud engineer through to platform lead",
        tools: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "Ansible", "Datadog"],
        standards: ["Infrastructure as code", "Well architected reviews", "Change management"],
      },
      {
        id: "security",
        name: "Cybersecurity",
        photo: "/photos/roles/information-technology-security.jpg",
        photoAlt: "A cybersecurity analyst monitoring alerts across three screens",
        builds: "Detection and response, vulnerability management, identity, and the evidence an auditor or a customer will ask for.",
        seniority: "Security analyst through to security architect",
        tools: ["Splunk", "Sentinel", "CrowdStrike", "Okta", "Qualys", "Tenable"],
        standards: ["NIST CSF", "SOC 2", "ISO 27001", "PCI DSS where relevant"],
      },
      {
        id: "support",
        name: "IT support and service desk",
        photo: "/photos/roles/information-technology-support.jpg",
        photoAlt: "An IT support technician helping a colleague with a laptop",
        builds: "First and second line support, endpoint management, onboarding and offboarding, and the ticket queue.",
        seniority: "Service desk analyst through to support manager",
        tools: ["ServiceNow", "Jira Service Management", "Intune", "Active Directory", "Entra ID"],
        standards: ["ITIL practices", "SLA management", "Asset control"],
      },
      {
        id: "erp",
        name: "Enterprise applications",
        photo: "/photos/roles/information-technology-erp.jpg",
        photoAlt: "An ERP consultant walking users through a configuration screen",
        builds: "Configuration, integration and support for the platforms a business actually runs on.",
        seniority: "Analyst through to solution architect",
        tools: ["SAP", "Salesforce", "ServiceNow", "Oracle", "Dynamics 365", "Workday"],
        standards: ["Release management", "Integration patterns", "Functional documentation"],
      },
    ],
    stack: {
      heading: "What we recruit against.",
      intro:
        "The vocabulary a technical screen has to be conducted in. Tell us your stack and we will tell you honestly how deep our bench is in it.",
      groups: [
        { name: "Languages and frameworks", items: ["Java", "C#", ".NET", "Python", "Node", "TypeScript", "React", "Go", "Spring"] },
        { name: "Cloud and platform", items: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "Docker", "Ansible"] },
        { name: "Data", items: ["Snowflake", "Databricks", "dbt", "Airflow", "Kafka", "SQL Server", "Postgres", "Power BI"] },
        { name: "Security and operations", items: ["Splunk", "Sentinel", "CrowdStrike", "Okta", "ServiceNow", "Datadog"] },
        { name: "Credentials we verify", items: ["AWS Solutions Architect", "Azure Administrator", "CISSP", "Security+", "CCNA", "ITIL"] },
      ],
    },
    screening: {
      heading: "How we screen a technologist.",
      intro:
        "Technical screening by a recruiter has a ceiling, and we work within it honestly. What we can do is establish scope, stack and ownership precisely, so your engineers only interview people worth their time.",
      steps: [
        {
          title: "Stack and scale, not job title",
          body: "Which languages and platforms, at what volume, and whether the person built it, ran it or inherited it. Those are three different engineers.",
        },
        {
          title: "Ownership evidenced",
          body: "What did you own end to end, what broke, and what did you change afterwards. Specific answers separate builders from passengers quickly.",
        },
        {
          title: "A technical screen we did not write alone",
          body: "For specialist roles we ask your engineering lead for two or three questions and their expected answers. It takes them ten minutes and it lifts the shortlist noticeably.",
        },
        {
          title: "Work seen where possible",
          body: "A repository, a design document, an architecture diagram. Not a take home test that costs a candidate a weekend.",
        },
        {
          title: "A reference from a technical lead",
          body: "The person who reviewed their pull requests or their designs, not an HR contact confirming dates.",
        },
      ],
    },
    pullQuote:
      "Built it, ran it and inherited it are three different engineers, and a job title calls all three of them the same thing.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a promise.",
      rows: [
        { role: "Service desk and support", market: "Deep pool in most markets, and the fastest technology desk to fill.", timeline: "Days to a week" },
        { role: "Business and data analysts", market: "Available. SQL depth and domain knowledge separate them, not tooling.", timeline: "About a week" },
        { role: "Full stack engineers", market: "Competitive but liquid. Stack specificity is what narrows it.", timeline: "Two to three weeks" },
        { role: "Data engineers", market: "Tight. Genuine pipeline ownership at scale is scarcer than the resumes imply.", timeline: "Three to four weeks" },
        { role: "Cloud and platform engineers", market: "Tight, particularly people who have built a landing zone rather than operated one.", timeline: "Three to four weeks" },
        { role: "Security engineers with clearance or SOC depth", market: "The hardest technology hire we run, and the most heavily counter offered.", timeline: "Four to six weeks" },
      ],
      note: "Rate has more leverage in technology than in any other industry we staff. If a search is stalling, the band is usually the reason, and we will say so.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Technology demand is rarely one vacancy. These are the three shapes we see most.",
      options: [
        {
          name: "One specialist",
          covers: "A single engineer for defined work.",
          fits: "A migration, a backfill, a skill you need for one phase of a programme.",
          shape: "Contract or contract-to-hire, three to twenty four months.",
        },
        {
          name: "A pod",
          covers: "A small team that works together on one outcome.",
          fits: "A product workstream, a data platform build, a security remediation programme.",
          shape: "Contract, with a lead of ours where you want one.",
        },
        {
          name: "Blended delivery",
          covers: "Onshore and offshore working as one team.",
          fits: "Long programmes where build and support can run overnight and stakeholder work stays local.",
          shape: "Project and team staffing on a single contract and one point of contact.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "None of this needs writing up. Knowing it is what makes the first shortlist usable.",
      items: [
        "The stack, honestly, including the parts nobody enjoys maintaining",
        "Whether the person builds, runs or inherits, and who reviews their work",
        "Scale: users, data volume, transaction rate, whatever actually applies",
        "On site, hybrid or remote, and whether time zone overlap is required",
        "Clearance, right to work or compliance constraints",
        "The rate band you can approve, because in technology it moves the market more than anything else",
      ],
    },
    faqs: [
      {
        q: "Can a recruiter screen technical people properly?",
        a: "Within limits, and we work inside them honestly. We establish stack, scale and ownership precisely, and for specialist roles we ask your engineering lead for two or three questions with expected answers. It takes them ten minutes and it noticeably improves the shortlist.",
      },
      {
        q: "Do you do offshore delivery?",
        a: "Yes. Build, data engineering, testing and much of support run well from our India teams. Incident response, stakeholder heavy roles and anything needing constant local overlap do not, and we will tell you which parts of your scope fall where.",
      },
      {
        q: "How quickly can you place a senior engineer?",
        a: "Two to four weeks for most disciplines. Security and specialist data engineering run longer and are heavily counter offered. We will give you a realistic date at the first conversation.",
      },
      {
        q: "Do you verify certifications?",
        a: "Yes, before shortlist. Certifications matter more in cloud, security and networking than in software engineering, and we weight them accordingly rather than treating them as a substitute for evidence.",
      },
      {
        q: "Can contractors convert to permanent?",
        a: "Yes. Agree it with us before you make the offer and we will set the terms in writing, the same way contract-to-hire works from the start.",
      },
      {
        q: "What does it cost?",
        a: "Contract technologists are an hourly rate covering pay, our employment costs and our margin. A permanent hire is a percentage of first year salary. Both quoted before any work begins.",
      },
    ],
    cta: {
      heading: "Hiring technologists?",
      body: "Tell us the stack, the scale and whether the work can run offshore. You will get a straight answer on the market, including when the rate band is the problem.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     INSURANCE
     ══════════════════════════════════════════════════════════ */
  {
    slug: "insurance",
    meta: {
      title: "Insurance staffing",
      description:
        "Claims, underwriting, policy servicing, licensed customer service and compliance staff, screened on the platform you run and the licences the role requires.",
    },
    hero: {
      eyebrow: "Insurance",
      lead: "Claims answered,",
      accent: "policies serviced.",
      sub: "Claims handlers, underwriting support, policy servicing, licensed customer service and compliance. Catastrophe surge cover, a system migration team, or the permanent hire who steadies a unit.",
      photo: "industryInsuranceHero",
      facts: [
        { figure: "Licences verified", caption: "state adjuster and producer licences checked before anyone reaches your shortlist" },
        { figure: "Surge ready", caption: "catastrophe and backlog cover is one of the fastest things we mobilise" },
        { figure: "Platform screened", caption: "Guidewire, Duck Creek and Applied experience established, not assumed" },
      ],
    },
    overview: {
      heading: "Volume arrives suddenly. The licence does not.",
      photo: "levelSpecialized",
      caption: "Analytical work, which is most of insurance once the phone is down.",
      paragraphs: [
        "We staff claims, underwriting support, policy servicing, licensed customer service, compliance and analytics for carriers, brokers, MGAs and third party administrators.",
        "Insurance staffing has two speeds. Surge, where a catastrophe or a backlog needs licensed people this week, and structural, where a unit needs an experienced hire it will keep.",
        "Both hinge on two checks that cannot be hurried: the licence, verified with the state, and the platform, because a handler who has only worked in one claims system is slower for a month in another.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "claims",
        name: "Claims",
        photo: "/photos/roles/insurance-claims.jpg",
        photoAlt: "A claims adjuster reviewing damage photographs and an estimate",
        builds: "First notice of loss through investigation, evaluation, negotiation and settlement, across property, auto and liability.",
        seniority: "Claims assistant through to senior adjuster and claims supervisor",
        tools: ["Guidewire ClaimCenter", "Duck Creek", "Xactimate", "Symbility"],
        standards: ["State adjuster licences", "Fair claims practices", "Reserving discipline"],
      },
      {
        id: "underwriting",
        name: "Underwriting support",
        photo: "/photos/roles/insurance-underwriting.jpg",
        photoAlt: "An underwriting assistant checking an application against a rating screen",
        builds: "Submission intake, rating, endorsements, renewals and the file preparation an underwriter depends on.",
        seniority: "Underwriting assistant through to associate underwriter",
        tools: ["Guidewire PolicyCenter", "Duck Creek", "Applied Epic", "Rating platforms"],
        standards: ["Underwriting guidelines", "Referral thresholds", "Documentation standards"],
      },
      {
        id: "policy-servicing",
        name: "Policy servicing",
        photo: "/photos/roles/insurance-policy-servicing.jpg",
        photoAlt: "A policy servicing specialist updating a record during a call",
        builds: "Endorsements, cancellations, reinstatements, certificates and the corrections that keep a book accurate.",
        seniority: "Policy administrator through to servicing supervisor",
        tools: ["Applied Epic", "AMS360", "Sagitta", "Carrier portals"],
        standards: ["Turnaround targets", "Accuracy standards", "Audit trail"],
      },
      {
        id: "customer-service",
        name: "Licensed customer service",
        photo: "/photos/roles/insurance-customer-service.jpg",
        photoAlt: "An insurance agent explaining coverage to a client",
        builds: "Policyholder calls, quotes, coverage questions and the retention conversation at renewal.",
        seniority: "Licensed CSR through to service team lead",
        tools: ["Carrier systems", "CRM platforms", "Telephony and call recording"],
        standards: ["P&C or Life and Health licence", "Call quality standards", "Complaint handling"],
      },
      {
        id: "compliance",
        name: "Compliance and audit",
        photo: "/photos/roles/insurance-compliance.jpg",
        photoAlt: "A compliance analyst reviewing a regulatory filing",
        builds: "Regulatory filings, market conduct readiness, complaint handling and internal file reviews.",
        seniority: "Compliance analyst through to compliance manager",
        tools: ["Compliance platforms", "Document management", "Excel"],
        standards: ["State DOI requirements", "Market conduct", "Record retention"],
      },
      {
        id: "analytics",
        name: "Actuarial and analytics support",
        photo: "/photos/roles/insurance-analytics.jpg",
        photoAlt: "An actuarial analyst working through loss data on screen",
        builds: "Loss triangles, data preparation, reporting and the analysis that sits behind a rate filing.",
        seniority: "Analyst through to senior analyst",
        tools: ["SQL", "Excel", "R", "Power BI", "Actuarial platforms"],
        standards: ["Data integrity", "Documentation for filings"],
      },
    ],
    stack: {
      heading: "What we verify and recruit against.",
      intro:
        "Licence first, platform second. Both are checked before a name reaches you, because both decide whether somebody can actually start.",
      groups: [
        { name: "Core platforms", items: ["Guidewire", "Duck Creek", "Applied Epic", "AMS360", "Sagitta", "Sapiens", "Origami"] },
        { name: "Claims tools", items: ["Xactimate", "Symbility", "CCC", "Mitchell"] },
        { name: "Licences", items: ["State adjuster licences", "P&C producer", "Life and Health producer", "Reciprocal and non resident licences"] },
        { name: "Credentials we verify", items: ["CPCU", "AIC", "AINS", "ARM", "Continuing education status"] },
      ],
    },
    screening: {
      heading: "How we screen an insurance hire.",
      intro:
        "Insurance resumes are full of transferable sounding language that hides real differences in line of business, platform and authority level. The screen exists to surface those three.",
      steps: [
        {
          title: "Line of business, precisely",
          body: "Personal or commercial, property, auto, liability or specialty, and the complexity band. A homeowner adjuster is not a commercial property adjuster.",
        },
        {
          title: "Licence verified with the state",
          body: "Status, lines, expiry, reciprocity and continuing education. Checked at source rather than read off a resume.",
        },
        {
          title: "Authority level established",
          body: "What settlement or binding authority did they hold, and who reviewed the files above that level. It is the clearest measure of seniority in this industry.",
        },
        {
          title: "Platform experience tested",
          body: "Which claims or policy system, in what depth, and how recently. A month of relearning is a real cost during a surge.",
        },
        {
          title: "A reference from a supervisor",
          body: "The person who audited their files, who can speak to accuracy and to how they handled a difficult policyholder.",
        },
      ],
    },
    pullQuote:
      "Authority level tells you more about an insurance hire than years of service ever will. Ask what they could settle without a second signature.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a guarantee.",
      rows: [
        { role: "Policy servicing and administration", market: "Available in most markets and quick to move.", timeline: "Days to a week" },
        { role: "Licensed customer service", market: "Steady, though licence status and reciprocity often gate the start date rather than the offer.", timeline: "One to two weeks" },
        { role: "Underwriting assistants", market: "Available. Commercial lines experience is scarcer than personal lines.", timeline: "One to two weeks" },
        { role: "Claims adjusters, personal lines", market: "Reasonable supply, and the fastest surge population to mobilise.", timeline: "One to two weeks" },
        { role: "Commercial and complex claims", market: "Tight. Authority level and line of business narrow the field fast.", timeline: "Three to five weeks" },
        { role: "Compliance and market conduct", market: "The hardest insurance hire we run in most states.", timeline: "Four to six weeks" },
      ],
      note: "During a catastrophe response the constraint is almost never candidates. It is licence reciprocity and onboarding throughput, and both can be planned for in advance.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Insurance demand is either an event or a structure, and they need different answers.",
      options: [
        {
          name: "Surge cover",
          covers: "Licensed people mobilised quickly against a spike.",
          fits: "Catastrophe response, a claims backlog, a renewal season, a system outage aftermath.",
          shape: "Temporary or contract. We are the employer of record and carry the licence file.",
        },
        {
          name: "Project teams",
          covers: "A group for a defined programme.",
          fits: "A Guidewire or Duck Creek migration, a remediation, a book transfer, an audit response.",
          shape: "Contract, typically six to eighteen months.",
        },
        {
          name: "The permanent hire",
          covers: "The person a unit is built around.",
          fits: "Senior adjusters, underwriters, compliance leads, service managers.",
          shape: "Direct hire, or contract-to-hire where authority level needs proving first.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "Knowing these turns a first call into candidates who can actually start.",
      items: [
        "Line of business and complexity band, not just the job title",
        "Which states, and whether non resident licences are acceptable",
        "The settlement or binding authority the role carries",
        "Your claims or policy platform, and whether training is provided",
        "Whether this is surge cover with an end date or a permanent seat",
        "The rate or salary band you can approve without a second meeting",
      ],
    },
    faqs: [
      {
        q: "How quickly can you mobilise for a catastrophe response?",
        a: "Licensed adjusters can move within days, and personal lines is the fastest population. The real constraint is usually licence reciprocity and onboarding throughput rather than candidate supply, which is why it pays to agree the plan before the season rather than during it.",
      },
      {
        q: "Do you verify adjuster and producer licences?",
        a: "Yes, at source with the state, including lines, expiry, reciprocity and continuing education status, before anyone reaches your shortlist.",
      },
      {
        q: "Do you staff Guidewire and Duck Creek migrations?",
        a: "Yes, both the business side and the support roles around it. Platform experience is established specifically rather than assumed, because relearning a claims system costs a month of productivity.",
      },
      {
        q: "Can you cover renewal season?",
        a: "Yes. Underwriting support and policy servicing cover is a common seasonal arrangement, and it is the sort of demand that can be planned rather than reacted to.",
      },
      {
        q: "Who employs temporary insurance staff?",
        a: "We do, for the length of the assignment, including the licence and compliance file. You direct the work.",
      },
      {
        q: "What does it cost?",
        a: "Temporary and contract staff are an hourly rate covering pay, our employment costs and our margin. A permanent hire is a percentage of first year salary. Both quoted before work starts.",
      },
    ],
    cta: {
      heading: "Claims piling up?",
      body: "Tell us the line of business, the states and the authority level. Licences are verified before anyone reaches your shortlist.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     MANUFACTURING
     ══════════════════════════════════════════════════════════ */
  {
    slug: "manufacturing",
    meta: {
      title: "Manufacturing staffing",
      description:
        "Machine operators, assemblers, quality inspectors, maintenance technicians and supervisors, screened for the shift, the standard and the equipment you actually run.",
    },
    hero: {
      eyebrow: "Manufacturing",
      lead: "People who can run",
      accent: "your line.",
      sub: "Operators, assemblers, quality inspectors, maintenance technicians and supervisors. A season, a second shift, a ramp up, or the permanent hire the floor is built around.",
      photo: "industryManufacturingHero",
      facts: [
        { figure: "6 functions", caption: "from the line and the machine through quality, maintenance, materials and supervision" },
        { figure: "Shift screened", caption: "second and third shift confirmed before you meet anyone, not discovered in week two" },
        { figure: "Volume ready", caption: "one operator or a full second shift, onboarded together" },
      ],
    },
    overview: {
      heading: "The shift pattern loses more hires than the skill test.",
      paragraphs: [
        "We staff production and assembly, machining, quality and inspection, maintenance and reliability, materials and planning, and floor supervision. Automotive suppliers, food and beverage, plastics, metals, medical device and general manufacturing.",
        "Volume hiring here is a throughput problem as much as a sourcing one. Onboarding, safety briefing and the first morning decide whether the people you hired are still there in week three.",
        "And the honest constraint is rarely capability. It is shift, commute and pay band, in that order, which is why we confirm all three before anybody is put forward.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "production",
        name: "Production and assembly",
        photo: "/photos/roles/manufacturing-production.jpg",
        photoAlt: "A production operator assembling a device at a clean workstation",
        builds: "Line work, assembly, packing and the changeovers that decide whether a shift hits its number.",
        seniority: "Entry level through to experienced line lead",
        tools: ["Hand and power tools", "Torque tools", "Work instructions", "Barcode scanning"],
        standards: ["Lockout tagout awareness", "5S", "Standard work"],
      },
      {
        id: "machining",
        name: "Machining and set up",
        photo: "/photos/roles/manufacturing-machining.jpg",
        photoAlt: "A CNC machinist measuring a finished part beside a mill",
        builds: "CNC operation, set up, offsets, tooling changes and holding tolerance across a run.",
        seniority: "Operator through to CNC set up and programmer",
        tools: ["Fanuc", "Haas", "Mazak", "Mastercam", "Calipers and micrometers"],
        standards: ["Blueprint reading", "GD&T basics", "First article inspection"],
      },
      {
        id: "quality",
        name: "Quality and inspection",
        photo: "/photos/roles/manufacturing-quality.jpg",
        photoAlt: "A quality inspector examining a part at an inspection bench",
        builds: "In process and final inspection, first articles, non conformance reports and the containment nobody wants to run.",
        seniority: "Inspector through to quality technician and supervisor",
        tools: ["CMM", "Calipers", "Gauges", "Minitab", "Quality management systems"],
        standards: ["ISO 9001", "IATF 16949", "AS9100", "PPAP and FMEA familiarity"],
      },
      {
        id: "maintenance",
        name: "Maintenance and reliability",
        photo: "/photos/roles/manufacturing-maintenance.jpg",
        photoAlt: "A maintenance technician inspecting a drive on a packaging line",
        builds: "Preventive maintenance, breakdown response, and the small fixes that stop a line from stopping.",
        seniority: "Maintenance technician through to maintenance supervisor",
        tools: ["PLC fault finding", "Hydraulics and pneumatics", "CMMS platforms"],
        standards: ["Lockout tagout", "Arc flash awareness", "PM compliance"],
      },
      {
        id: "materials",
        name: "Materials and planning",
        photo: "/photos/roles/manufacturing-materials.jpg",
        photoAlt: "A materials planner checking stock counts in a warehouse aisle",
        builds: "Receiving, inventory accuracy, kitting, line feed and the schedule that keeps the floor supplied.",
        seniority: "Material handler through to planner",
        tools: ["SAP", "MES", "ERP inventory modules", "RF scanners"],
        standards: ["Cycle counting", "FIFO", "Traceability"],
      },
      {
        id: "supervision",
        name: "Supervision and leadership",
        photo: "/photos/roles/manufacturing-supervision.jpg",
        photoAlt: "A production supervisor running a morning huddle at a whiteboard",
        builds: "Running a shift: staffing, safety, quality, output and the difficult conversation at two in the morning.",
        seniority: "Line lead through to production supervisor and manager",
        tools: ["Scheduling systems", "MES dashboards", "Standard work"],
        standards: ["Safety leadership", "Lean practices", "Performance management"],
      },
    ],
    stack: {
      heading: "What we recruit against.",
      intro:
        "Equipment, standards and the certifications that decide whether somebody can start on Monday or in three weeks.",
      groups: [
        { name: "Equipment and controls", items: ["Fanuc", "Haas", "Mazak", "Allen-Bradley", "Mastercam", "CMM", "Injection moulding"] },
        { name: "Systems", items: ["SAP", "MES platforms", "ERP inventory", "CMMS", "Minitab"] },
        { name: "Standards", items: ["ISO 9001", "IATF 16949", "AS9100", "GMP", "5S and lean", "Lockout tagout"] },
        { name: "Certifications we verify", items: ["Forklift and powered industrial truck", "OSHA 10 and 30", "Welding certifications", "Six Sigma"] },
      ],
    },
    screening: {
      heading: "How we screen for the floor.",
      intro:
        "Manufacturing screening fails when it is done as a phone call about a resume. The questions that predict success are practical, and most of them are about the shift rather than the skill.",
      steps: [
        {
          title: "The shift, confirmed in detail",
          body: "Start time, length, rotation, weekends, mandatory overtime. Said plainly to the candidate before anything else, because this is where most placements are lost.",
        },
        {
          title: "The work described honestly",
          body: "Lifting, standing, temperature, noise, pace and cleanroom or PPE requirements. A surprise on day one costs you the hire.",
        },
        {
          title: "Practical capability checked",
          body: "Blueprint reading, measurement, machine familiarity or a short assessment where the role justifies it, rather than a self reported skill list.",
        },
        {
          title: "Commute and reliability",
          body: "How they get there, how far, and what happens if a shift starts at five. Transport is the most common cause of early attrition and the easiest to ask about.",
        },
        {
          title: "Certifications verified",
          body: "Forklift, OSHA, welding tickets and any site specific requirement, checked before the first morning rather than after.",
        },
      ],
    },
    pullQuote:
      "Nobody leaves a manufacturing job in week two because the work was too hard. They leave because nobody told them about the shift.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a guarantee.",
      rows: [
        { role: "General production and assembly", market: "Available in most markets. Retention rather than supply is the real problem.", timeline: "Days" },
        { role: "Material handlers with forklift", market: "Readily available where certification is current.", timeline: "Days" },
        { role: "Quality inspectors", market: "Steady. Automotive and aerospace standards depth narrows it.", timeline: "One to two weeks" },
        { role: "CNC set up and programmers", market: "Tight in most regions, and worth paying properly for.", timeline: "Two to four weeks" },
        { role: "Maintenance technicians", market: "The hardest manufacturing hire we run, particularly with PLC fault finding.", timeline: "Three to five weeks" },
        { role: "Production supervisors, off shift", market: "Difficult. Capable supervisors rarely want nights, and the differential decides it.", timeline: "Three to five weeks" },
      ],
      note: "For volume ramps, the constraint is usually onboarding throughput rather than candidates. Tell us the start date and we will plan backwards from it.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Manufacturing demand tends to arrive as a number and a date rather than a job description.",
      options: [
        {
          name: "Shift cover",
          covers: "Bodies on the line, this week.",
          fits: "Absence, a rush order, a seasonal peak, or a second shift you are trialling.",
          shape: "Temporary. We are the employer of record and handle safety onboarding.",
        },
        {
          name: "A volume ramp",
          covers: "Many people starting together against a date.",
          fits: "A new line, a new customer, a plant expansion, a season with a known shape.",
          shape: "Temporary or contract at volume, onboarded in groups with one point of contact.",
        },
        {
          name: "The permanent hire",
          covers: "The skilled roles the floor depends on.",
          fits: "Maintenance technicians, CNC set up, quality, supervision.",
          shape: "Direct hire, or contract-to-hire where you want to see them on the floor first.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "These six answers are what separate a shortlist from a stack of resumes.",
      items: [
        "The shift, including rotation, weekends and mandatory overtime",
        "The physical reality: lifting, standing, temperature, pace and PPE",
        "Certifications the site requires before somebody can start",
        "Whether there is transport nearby, and parking",
        "Headcount and the date it has to be on the floor by",
        "The pay band, and whether there is a shift differential",
      ],
    },
    faqs: [
      {
        q: "Can you staff a full second shift?",
        a: "Yes, and volume ramps are a large part of what we do in manufacturing. The planning question is onboarding throughput rather than candidate supply, so tell us the start date and we will work backwards from it.",
      },
      {
        q: "Who handles safety onboarding for temporary staff?",
        a: "We do the general piece and your site does the site specific piece. The person is our employee for the assignment, so employment compliance and general safety induction sit with us.",
      },
      {
        q: "Do you verify forklift and OSHA certifications?",
        a: "Yes, before the first shift. An expired forklift certification discovered on the morning somebody is due to start is an avoidable and entirely common problem.",
      },
      {
        q: "Can temporary workers become permanent?",
        a: "Often, and in manufacturing it is one of the better ways to hire. Tell us early and we will set it up as contract-to-hire so the terms are agreed in advance.",
      },
      {
        q: "Why do manufacturing placements fail?",
        a: "Shift, commute and pace, far more often than capability. That is why we confirm all three with the candidate before you meet them, and why we ask you to be blunt about the reality of the job.",
      },
      {
        q: "What does it cost?",
        a: "An hourly rate covering pay, our employment costs and our margin, quoted before any work starts. Permanent hires are a percentage of first year salary.",
      },
    ],
    cta: {
      heading: "Need people on the line?",
      body: "Tell us the shift, the headcount and the date. We will tell you what is realistic before you plan a schedule around it.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     INDUSTRIAL
     ══════════════════════════════════════════════════════════ */
  {
    slug: "industrial",
    meta: {
      title: "Industrial staffing",
      description:
        "Warehouse and distribution staff, material handlers, forklift operators, maintenance and sanitation teams, mobilised at volume with the certifications verified.",
    },
    hero: {
      eyebrow: "Industrial",
      lead: "Crews that turn up",
      accent: "and stay.",
      sub: "Warehouse and distribution, material handling, forklift, maintenance and sanitation. One person for a shift, or a crew of forty against a date.",
      photo: "industryIndustrialHero",
      facts: [
        { figure: "Volume ready", caption: "crews onboarded in groups rather than one person at a time" },
        { figure: "Certifications first", caption: "forklift and site requirements verified before the first morning" },
        { figure: "Retention screened", caption: "shift, commute and pace confirmed with the candidate before you meet them" },
      ],
    },
    overview: {
      heading: "Filling the shift is easy. Keeping it filled is the job.",
      paragraphs: [
        "We staff distribution centres, warehouses, plants and facilities: pickers and packers, material handlers, forklift operators, maintenance support, sanitation and shipping and receiving.",
        "Industrial staffing is judged on week three, not day one. Anyone can put bodies on a floor for a morning. The measure is how many are still there when the peak actually bites.",
        "So the screen is built around the three things that cause early attrition: the shift, the commute, and whether the person was told the truth about the pace.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "warehouse",
        name: "Warehouse and distribution",
        photo: "/photos/roles/industrial-warehouse.jpg",
        photoAlt: "A warehouse associate scanning a pallet in a distribution centre",
        builds: "Picking, packing, put away, replenishment and the accuracy that stops a customer complaint.",
        seniority: "Entry level through to experienced picker and packer",
        tools: ["RF scanners", "WMS platforms", "Pick to light", "Conveyor systems"],
        standards: ["Pick accuracy targets", "Manual handling", "Housekeeping"],
      },
      {
        id: "material-handling",
        name: "Material handling",
        photo: "/photos/roles/industrial-material-handling.jpg",
        photoAlt: "A forklift operator placing a pallet onto racking",
        builds: "Forklift, reach truck and cherry picker work, loading, unloading and yard movements.",
        seniority: "Certified operator through to lead operator",
        tools: ["Sit down and stand up forklift", "Reach truck", "Order picker", "Pallet jack"],
        standards: ["Powered industrial truck certification", "Load safety", "Pedestrian segregation"],
      },
      {
        id: "shipping",
        name: "Shipping, receiving and inventory",
        photo: "/photos/roles/industrial-shipping.jpg",
        photoAlt: "A shipping clerk checking a delivery against a manifest at the dock",
        builds: "Inbound and outbound documentation, cycle counts, discrepancies and the paperwork a carrier will query.",
        seniority: "Clerk through to inventory control lead",
        tools: ["WMS", "ERP inventory", "Carrier portals", "Scanners"],
        standards: ["Cycle count accuracy", "FIFO", "Documentation control"],
      },
      {
        id: "maintenance-support",
        name: "Facilities and maintenance support",
        photo: "/photos/roles/industrial-maintenance-support.jpg",
        photoAlt: "A facilities technician replacing a light fitting",
        builds: "Basic repairs, equipment checks, grounds and the small jobs that stop being small if ignored.",
        seniority: "Maintenance assistant through to facilities technician",
        tools: ["Hand and power tools", "CMMS ticketing", "Basic electrical and plumbing"],
        standards: ["Lockout tagout awareness", "Working at height where relevant", "Permit systems"],
      },
      {
        id: "sanitation",
        name: "Sanitation and janitorial",
        photo: "/photos/roles/industrial-sanitation.jpg",
        photoAlt: "A sanitation worker operating a floor scrubber in a bright corridor",
        builds: "Cleaning schedules, sanitation between runs, waste handling and the standards an auditor checks.",
        seniority: "Cleaner through to sanitation lead",
        tools: ["Industrial cleaning equipment", "Chemical dosing systems"],
        standards: ["GMP where food", "Chemical handling", "Sanitation records"],
      },
      {
        id: "supervision",
        name: "Shift supervision",
        photo: "/photos/roles/industrial-supervision.jpg",
        photoAlt: "A shift supervisor briefing two associates at shift start",
        builds: "Allocating people, hitting the plan, handling absence and keeping the floor safe.",
        seniority: "Lead hand through to shift supervisor",
        tools: ["WMS dashboards", "Labour management systems", "Scheduling tools"],
        standards: ["Safety leadership", "Productivity targets", "Attendance management"],
      },
    ],
    stack: {
      heading: "What we verify and recruit against.",
      intro:
        "Certification and site requirements decide whether somebody can start tomorrow. These get checked first, not last.",
      groups: [
        { name: "Equipment", items: ["Sit down forklift", "Stand up reach", "Order picker", "Pallet jack", "Scissor lift", "Pallet wrapper"] },
        { name: "Systems", items: ["Manhattan", "Blue Yonder", "SAP EWM", "RF scanning", "Labour management"] },
        { name: "Safety", items: ["OSHA 10", "OSHA 30", "Lockout tagout", "Manual handling", "PPE requirements"] },
        { name: "Checks we run", items: ["Powered industrial truck certification", "Background check", "Drug screening where required", "Right to work"] },
      ],
    },
    screening: {
      heading: "How we screen for an industrial shift.",
      intro:
        "The questions that predict whether somebody lasts are unglamorous and take four minutes. Skipping them is why so much industrial staffing churns.",
      steps: [
        {
          title: "The shift, said out loud",
          body: "Start time, length, rotation, weekends and whether overtime is optional or expected. Before anything else, and in the candidate's own hearing.",
        },
        {
          title: "The commute, checked properly",
          body: "How they will actually get there at five in the morning. Public transport that does not run at that hour is the single most common cause of a no show on day three.",
        },
        {
          title: "The physical reality",
          body: "Lifting weight, standing hours, temperature, pace and noise. Told plainly, because a surprise costs you the person and the shift.",
        },
        {
          title: "Certification verified",
          body: "Forklift class and expiry, OSHA cards, and any site specific induction requirement, before the first morning.",
        },
        {
          title: "A reference from a supervisor",
          body: "Attendance and reliability, which in industrial work are the two things that actually matter.",
        },
      ],
    },
    pullQuote:
      "Anyone can fill a shift on Monday. The measure of industrial staffing is how much of that crew is still there on Thursday of week three.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a promise.",
      rows: [
        { role: "General warehouse", market: "Available in nearly every market. Retention is the challenge, not supply.", timeline: "Days" },
        { role: "Sanitation and janitorial", market: "Available, and often overlooked until it is urgent.", timeline: "Days" },
        { role: "Certified forklift operators", market: "Available where certification is current. Expired tickets slow more starts than shortages do.", timeline: "Days to a week" },
        { role: "Inventory and cycle count staff", market: "Steadier, though WMS specific experience narrows it.", timeline: "About a week" },
        { role: "Facilities and maintenance support", market: "Tight. Anyone with genuine hands on maintenance ability is in demand everywhere.", timeline: "Two to four weeks" },
        { role: "Shift supervisors, nights", market: "Difficult. The differential and the site's reputation decide it.", timeline: "Two to four weeks" },
      ],
      note: "Volume ramps rarely fail on sourcing. They fail on onboarding throughput and on a first morning nobody prepared for.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Industrial demand arrives as a headcount and a date, and usually with very little notice.",
      options: [
        {
          name: "Shift cover",
          covers: "People on the floor tomorrow.",
          fits: "Absence, a surge, a truck that arrived early, a shift running short.",
          shape: "Temporary, from a single day. We are the employer of record.",
        },
        {
          name: "A seasonal crew",
          covers: "A group hired, inducted and managed as one.",
          fits: "Peak season, a new contract, an inventory count, a site opening.",
          shape: "Temporary at volume, onboarded in groups, with one point of contact across shifts.",
        },
        {
          name: "The permanent core",
          covers: "The people the site keeps.",
          fits: "Leads, maintenance, inventory control, supervision.",
          shape: "Contract-to-hire, so both sides see the fit before it is permanent.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "Four minutes of detail here saves a fortnight of churn later.",
      items: [
        "The shift, including rotation, weekends and whether overtime is expected",
        "Lifting weight, standing hours, temperature and pace",
        "Certifications the site requires before somebody can start",
        "How people get to site, and whether there is parking or transport nearby",
        "Headcount, and the date the floor needs it by",
        "The pay rate, and any shift differential",
      ],
    },
    faqs: [
      {
        q: "How quickly can you get people on the floor?",
        a: "Often the next morning for general warehouse work, and within days for certified roles. Volume crews take longer to onboard than to source, which is the part worth planning.",
      },
      {
        q: "Do you verify forklift certification?",
        a: "Yes, including class and expiry, before the first shift. Expired certification discovered on the morning somebody is due to start is one of the most common avoidable delays in this industry.",
      },
      {
        q: "Can you staff multiple shifts and sites?",
        a: "Yes, with one point of contact rather than one per site. Multi site industrial programmes are a large part of what we do.",
      },
      {
        q: "How do you improve retention?",
        a: "By telling candidates the truth before they accept. Shift, commute, lifting and pace, said plainly. It reduces the day three no shows more than any incentive we have seen.",
      },
      {
        q: "Who is responsible for safety?",
        a: "Site specific induction is yours, general employment safety and compliance is ours. On temporary and contract work the person is our employee for the assignment.",
      },
      {
        q: "What does it cost?",
        a: "An hourly rate covering pay, our employment costs and our margin, quoted before work starts. Permanent hires are a percentage of first year salary.",
      },
    ],
    cta: {
      heading: "Short on the floor?",
      body: "Tell us the shift, the headcount and the date. We will be straight with you about what is realistic.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     RETAIL
     ══════════════════════════════════════════════════════════ */
  {
    slug: "retail",
    meta: {
      title: "Retail staffing",
      description:
        "Store associates, keyholders, visual merchandisers, stock crews and store managers, screened for the hours the rota actually needs.",
    },
    hero: {
      eyebrow: "Retail",
      lead: "Staff the floor",
      accent: "before the rush.",
      sub: "Associates, keyholders, visual merchandisers, stock crews and store management. Seasonal crews, a new store opening, or the manager a location is built around.",
      photo: "industryRetailHero",
      facts: [
        { figure: "6 functions", caption: "from the shop floor and stockroom through merchandising and store leadership" },
        { figure: "Season ready", caption: "crews recruited and inducted in groups against your opening date" },
        { figure: "Availability screened", caption: "evenings, weekends and holiday blackout confirmed before you meet anyone" },
      ],
    },
    overview: {
      heading: "Retail hiring is an availability problem.",
      paragraphs: [
        "We staff shop floor, stockroom, merchandising, e-commerce fulfilment and store leadership, for single sites, chains and seasonal operations.",
        "Almost every failed retail placement traces back to hours. Somebody said they were flexible, nobody asked about Saturdays, and the rota broke in week two.",
        "So availability is screened first and in writing: evenings, weekends, holiday periods and the blackout dates that matter most to you. Then we talk about experience.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "sales-floor",
        name: "Sales floor",
        photo: "/photos/roles/retail-sales-floor.jpg",
        photoAlt: "A sales associate helping a customer choose a product",
        builds: "Serving customers, fitting rooms, tills, recovery and the small conversations that decide whether somebody comes back.",
        seniority: "Seasonal associate through to experienced sales associate",
        tools: ["POS systems", "Handheld devices", "Clienteling apps"],
        standards: ["Service standards", "Cash handling", "Loss prevention basics"],
      },
      {
        id: "keyholder",
        name: "Keyholders and supervisors",
        photo: "/photos/roles/retail-keyholder.jpg",
        photoAlt: "A keyholder opening the register at the start of the day",
        builds: "Opening, closing, banking, break cover and running a section when the manager is off.",
        seniority: "Keyholder through to department supervisor",
        tools: ["POS management functions", "Scheduling tools", "Alarm and key procedures"],
        standards: ["Cash reconciliation", "Opening and closing procedure", "Escalation"],
      },
      {
        id: "stock",
        name: "Stockroom and replenishment",
        photo: "/photos/roles/retail-stock.jpg",
        photoAlt: "A stockroom associate scanning a delivery in the back room",
        builds: "Deliveries, backstock, replenishment, markdowns and the overnight resets nobody sees.",
        seniority: "Stock associate through to stockroom lead",
        tools: ["RF scanners", "Inventory systems", "RFID where used"],
        standards: ["Stock accuracy", "Manual handling", "Delivery paperwork"],
      },
      {
        id: "merchandising",
        name: "Visual merchandising",
        photo: "/photos/roles/retail-merchandising.jpg",
        photoAlt: "A visual merchandiser dressing a store window display",
        builds: "Window and floor sets, planogram compliance, seasonal changeovers and the resets that run overnight.",
        seniority: "Merchandiser through to visual lead",
        tools: ["Planogram software", "Fixture systems", "Display tooling"],
        standards: ["Brand guidelines", "Planogram compliance", "Working at height"],
      },
      {
        id: "fulfilment",
        name: "E-commerce fulfilment",
        photo: "/photos/roles/retail-fulfilment.jpg",
        photoAlt: "A fulfilment associate packing an online order",
        builds: "Click and collect, ship from store, returns processing and the accuracy that keeps online promises.",
        seniority: "Fulfilment associate through to fulfilment lead",
        tools: ["Order management systems", "Scanners", "Carrier platforms"],
        standards: ["Pick accuracy", "Dispatch cut offs", "Returns handling"],
      },
      {
        id: "management",
        name: "Store management",
        photo: "/photos/roles/retail-management.jpg",
        photoAlt: "A store manager reviewing sales figures with an assistant manager",
        builds: "Rota, targets, shrink, people and the ten minutes before opening when everything has to be ready.",
        seniority: "Assistant manager through to store manager",
        tools: ["Workforce scheduling", "Sales reporting", "Loss prevention systems"],
        standards: ["Labour budgeting", "Shrink control", "People management"],
      },
    ],
    stack: {
      heading: "What we recruit against.",
      intro:
        "Retail systems are quick to learn and availability is not negotiable, so we screen the second harder than the first.",
      groups: [
        { name: "Store systems", items: ["POS platforms", "Handheld and RF devices", "Order management", "Clienteling apps"] },
        { name: "Workforce", items: ["Scheduling platforms", "Time and attendance", "Labour reporting"] },
        { name: "Standards", items: ["Loss prevention", "Cash handling", "Health and safety", "Planogram compliance"] },
        { name: "Checks we run", items: ["Availability in writing", "Right to work", "Background check where required", "Age requirements for alcohol"] },
      ],
    },
    screening: {
      heading: "How we screen for the floor.",
      intro:
        "Retail experience is easy to claim and quick to teach. Availability, temperament and reliability are neither, so the screen concentrates there.",
      steps: [
        {
          title: "Availability, in writing",
          body: "Evenings, weekends, holiday periods and any blackout dates. Written down, not agreed vaguely on a phone call.",
        },
        {
          title: "The reality of the shift",
          body: "Standing hours, footfall, lone working, overnight resets and how physical the stockroom actually is.",
        },
        {
          title: "Temperament tested",
          body: "A difficult customer, a queue at closing, a shoplifting suspicion. How they answer tells you more than a retail history does.",
        },
        {
          title: "Cash and shrink questions",
          body: "For keyholder and management roles, plus the appropriate background check before they hold keys.",
        },
        {
          title: "A reference on reliability",
          body: "Attendance and punctuality, which in retail decide whether a rota holds together.",
        },
      ],
    },
    pullQuote:
      "Nearly every failed retail placement traces back to the same thing. Somebody said flexible and nobody asked about Saturdays.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a guarantee.",
      rows: [
        { role: "Seasonal sales associates", market: "Available in volume, but the good ones are gone by mid season.", timeline: "Days" },
        { role: "Stockroom and replenishment", market: "Available. Overnight availability is the constraint, not headcount.", timeline: "Days" },
        { role: "Keyholders and supervisors", market: "Steady, though people willing to open at six are fewer.", timeline: "About a week" },
        { role: "E-commerce fulfilment", market: "Available, and often easier to staff than the shop floor.", timeline: "Days to a week" },
        { role: "Visual merchandisers", market: "Tight. Genuine floor set experience against planograms is scarcer than it looks.", timeline: "Two to three weeks" },
        { role: "Store managers", market: "The hardest retail hire, and the one where a bad choice costs the most.", timeline: "Three to five weeks" },
      ],
      note: "For seasonal ramps, start six to eight weeks before you need people on the floor. The candidates exist earlier; by December they are already working somewhere else.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Retail demand is seasonal, sudden, or structural, and each needs a different answer.",
      options: [
        {
          name: "Seasonal crews",
          covers: "A group hired and inducted together against a date.",
          fits: "Peak trading, a store opening, a refit, a promotional period.",
          shape: "Temporary at volume. We are the employer of record.",
        },
        {
          name: "Cover and flex",
          covers: "Filling gaps in a rota that keeps moving.",
          fits: "Absence, holidays, a stronger week than forecast.",
          shape: "Temporary, from a single shift.",
        },
        {
          name: "The permanent team",
          covers: "Keyholders, supervisors and managers.",
          fits: "The people who hold the store together between seasons.",
          shape: "Contract-to-hire, or direct hire for management.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "Five minutes of clarity here is worth more than any job description.",
      items: [
        "The hours the rota actually needs, including weekends and evenings",
        "Any blackout dates where time off will not be possible",
        "Headcount and the date the floor needs them by",
        "Whether keys, cash handling or lone working are involved",
        "How physical the stockroom side of the job really is",
        "The pay rate, and whether there is a premium for overnight resets",
      ],
    },
    faqs: [
      {
        q: "How far ahead should we plan a seasonal ramp?",
        a: "Six to eight weeks before you need people on the floor. The candidates exist earlier in the season; by December most of them are already working somewhere else.",
      },
      {
        q: "Can you staff overnight resets and floor sets?",
        a: "Yes, and it is one of the more common retail requests. Overnight availability is the real constraint, so we confirm it in writing before anyone is put forward.",
      },
      {
        q: "Do you background check keyholders?",
        a: "Yes, before they hold keys or handle banking, along with the cash handling questions in the screen itself.",
      },
      {
        q: "Can seasonal staff become permanent?",
        a: "Often, and it is the cheapest hiring a retailer does. Tell us early which roles you may want to keep and we will screen the seasonal intake accordingly.",
      },
      {
        q: "Can you cover several stores?",
        a: "Yes, with one point of contact across the estate rather than one per store, which matters most during a peak when three locations are short on the same Saturday.",
      },
      {
        q: "What does it cost?",
        a: "An hourly rate covering pay, our employment costs and our margin, quoted before work starts. Management hires are a percentage of first year salary.",
      },
    ],
    cta: {
      heading: "Staffing a season?",
      body: "Tell us the hours, the headcount and the date the floor needs them by. We will tell you when to start recruiting.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     HOSPITALITY
     ══════════════════════════════════════════════════════════ */
  {
    slug: "hospitality",
    meta: {
      title: "Hospitality staffing",
      description:
        "Front desk, housekeeping, food and beverage, culinary and events staff, with certifications verified and availability confirmed before the shift.",
    },
    hero: {
      eyebrow: "Hospitality",
      lead: "Every shift covered,",
      accent: "every service.",
      sub: "Front desk, housekeeping, food and beverage, kitchen and events. A banquet on Saturday, a season, or the supervisor who holds a property together.",
      photo: "industryHospitalityHero",
      facts: [
        { figure: "6 functions", caption: "from front desk and housekeeping through kitchen, service and events" },
        { figure: "Certifications first", caption: "food handler and alcohol service verified before the shift, not after" },
        { figure: "Event ready", caption: "banquet and event crews briefed and staffed against a specific service time" },
      ],
    },
    overview: {
      heading: "The rota is the product.",
      paragraphs: [
        "We staff hotels, restaurants, venues, conference centres and contract catering: front desk and guest services, housekeeping, food and beverage service, kitchen, banquets and events, and property leadership.",
        "Hospitality demand is unusually precise. A banquet for four hundred needs a specific number of people, briefed, in uniform, at a specific time, and there is no version of the evening where that slips.",
        "So we work backwards from service time: certifications verified, uniform and grooming standards agreed, arrival and briefing time confirmed, and a named contact on the night.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "front-desk",
        name: "Front desk and guest services",
        photo: "/photos/roles/hospitality-front-desk.jpg",
        photoAlt: "A hotel front desk agent handing a guest a key card",
        builds: "Check in and out, reservations, night audit, concierge and the complaint that arrives at eleven at night.",
        seniority: "Front desk agent through to front office supervisor",
        tools: ["Opera PMS", "Property management systems", "Channel managers"],
        standards: ["Guest service standards", "Cash and folio handling", "Night audit procedure"],
      },
      {
        id: "housekeeping",
        name: "Housekeeping",
        photo: "/photos/roles/hospitality-housekeeping.jpg",
        photoAlt: "A housekeeping attendant making a bed in a bright hotel room",
        builds: "Room turns, public areas, linen, deep cleans and the quality checks a supervisor signs off.",
        seniority: "Room attendant through to housekeeping supervisor",
        tools: ["Housekeeping management systems", "Chemical dosing", "Laundry equipment"],
        standards: ["Room standards and timing", "Chemical safety", "Lost property procedure"],
      },
      {
        id: "food-beverage",
        name: "Food and beverage service",
        photo: "/photos/roles/hospitality-food-beverage.jpg",
        photoAlt: "A server carrying plates through a restaurant dining room",
        builds: "Restaurant and bar service, room service, breakfast and the turnaround between sittings.",
        seniority: "Server and bartender through to F&B supervisor",
        tools: ["Toast", "Micros", "Square", "POS and ordering systems"],
        standards: ["Alcohol service certification", "Allergen awareness", "Service standards"],
      },
      {
        id: "culinary",
        name: "Kitchen and culinary",
        photo: "/photos/roles/hospitality-culinary.jpg",
        photoAlt: "A line cook plating a dish at the pass",
        builds: "Prep, section work, service, and the consistency that makes a menu repeatable on a Friday night.",
        seniority: "Kitchen porter and commis through to sous chef",
        tools: ["Section equipment", "Kitchen management systems"],
        standards: ["Food handler certification", "HACCP", "Allergen control", "Temperature records"],
      },
      {
        id: "events",
        name: "Banquets and events",
        photo: "/photos/roles/hospitality-events.jpg",
        photoAlt: "A banquet captain setting a ballroom table for an event",
        builds: "Room sets, service teams, breakdown and the timeline that a wedding or a conference runs to.",
        seniority: "Banquet server through to events supervisor",
        tools: ["Event orders", "Floor plans", "AV basics"],
        standards: ["Service timing", "Uniform and grooming standards", "Manual handling"],
      },
      {
        id: "leadership",
        name: "Property leadership",
        photo: "/photos/roles/hospitality-leadership.jpg",
        photoAlt: "A hotel general manager walking the lobby with a department head",
        builds: "Rota, labour cost, standards, guest recovery and the shift when three people call in sick.",
        seniority: "Duty manager through to operations manager",
        tools: ["PMS reporting", "Labour scheduling", "Guest feedback platforms"],
        standards: ["Labour cost control", "Brand standards", "Licensing responsibilities"],
      },
    ],
    stack: {
      heading: "What we verify and recruit against.",
      intro:
        "In hospitality the certification decides whether somebody can work the shift at all, so it is checked before availability is even discussed.",
      groups: [
        { name: "Systems", items: ["Opera PMS", "Toast", "Micros", "Square", "Event management platforms"] },
        { name: "Certifications", items: ["Food handler card", "ServSafe", "TIPS", "State alcohol service", "Allergen training"] },
        { name: "Standards", items: ["HACCP", "Temperature control records", "Brand service standards", "Uniform and grooming"] },
        { name: "Checks we run", items: ["Availability including weekends", "Right to work", "Background check where required", "Age for alcohol service"] },
      ],
    },
    screening: {
      heading: "How we screen for a service.",
      intro:
        "Hospitality staffing is unforgiving because the deadline is a service time. The screen is built backwards from it.",
      steps: [
        {
          title: "Certification verified first",
          body: "Food handler, alcohol service and any state or county requirement. Checked before availability, because without it the rest is academic.",
        },
        {
          title: "The shift pattern, honestly",
          body: "Split shifts, late finishes, weekends and whether transport exists at the hour the service actually ends.",
        },
        {
          title: "Standard and setting matched",
          body: "Fine dining, banqueting, high volume casual and contract catering are different jobs with the same job titles.",
        },
        {
          title: "Uniform, grooming and briefing time",
          body: "Agreed in advance and passed to every person, so nobody arrives unable to work the floor.",
        },
        {
          title: "A reference from a duty manager",
          body: "Somebody who worked a service with them, who can speak to composure when the room is full.",
        },
      ],
    },
    pullQuote:
      "A service time is not a target, it is a fact. Everything in hospitality staffing has to be planned backwards from it.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a promise.",
      rows: [
        { role: "Banquet and event servers", market: "Available, and the population most used to working on call.", timeline: "Days" },
        { role: "Housekeeping", market: "Available in most markets. Transport at early hours is the usual constraint.", timeline: "Days" },
        { role: "Kitchen porters and prep", market: "Available, though retention is the harder half.", timeline: "Days" },
        { role: "Experienced servers and bartenders", market: "Steady, but certification status often gates the start date.", timeline: "About a week" },
        { role: "Line cooks", market: "The hardest hospitality hire in nearly every market, and heavily counter offered.", timeline: "Two to four weeks" },
        { role: "Night audit and duty managers", market: "Difficult. The hours narrow the field more than the skill does.", timeline: "Two to four weeks" },
      ],
      note: "For a specific event, give us the service time rather than the shift start. We will work the briefing and arrival times back from it.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Hospitality demand is either an event, a season or a structural gap.",
      options: [
        {
          name: "Event crews",
          covers: "A specific number of people for a specific service.",
          fits: "Banquets, conferences, weddings, a festival, a busy weekend.",
          shape: "Temporary, briefed and in uniform, with a named contact on the night.",
        },
        {
          name: "Seasonal teams",
          covers: "Staffing a property through its busy months.",
          fits: "Summer, ski season, conference season, a property reopening.",
          shape: "Temporary and contract, recruited in groups before the season starts.",
        },
        {
          name: "The permanent core",
          covers: "The people the property is held together by.",
          fits: "Supervisors, chefs, duty managers, front office leads.",
          shape: "Contract-to-hire, or direct hire for leadership.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "For events, the service time is the single most useful thing you can tell us.",
      items: [
        "Service time, and the briefing and arrival time you want",
        "Headcount by role, not just a total",
        "Certifications your county or state requires for the work",
        "Uniform and grooming standards, so nobody arrives unable to work",
        "The standard and setting: fine dining, banqueting, high volume or contract",
        "Whether transport exists at the hour the shift ends",
      ],
    },
    faqs: [
      {
        q: "Can you staff a single event?",
        a: "Yes, and it is one of the most common things we do. Give us the service time and the headcount by role, and we will work the briefing and arrival times back from it.",
      },
      {
        q: "Do you verify food handler and alcohol certifications?",
        a: "Yes, before the shift rather than after it. An uncertified person who cannot legally work the floor is a wasted shift for both of us.",
      },
      {
        q: "How do you handle uniform and grooming standards?",
        a: "You tell us, we pass it to every person before they arrive, and we confirm it at briefing. It is a small detail that decides whether a crew can actually work.",
      },
      {
        q: "Can you cover a full season?",
        a: "Yes. Seasonal teams are recruited in groups ahead of the season rather than reactively, which is how you get the better candidates rather than whoever is left.",
      },
      {
        q: "Why are line cooks so hard to hire?",
        a: "Demand outstrips supply in almost every market, and good ones are counter offered quickly. We will be honest about the timeline rather than promise a week and deliver a month.",
      },
      {
        q: "What does it cost?",
        a: "An hourly rate covering pay, our employment costs and our margin, quoted before the shift. Management hires are a percentage of first year salary.",
      },
    ],
    cta: {
      heading: "Service to cover?",
      body: "Give us the service time, the headcount by role and the standard. We will work backwards from there.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     MARKETING
     ══════════════════════════════════════════════════════════ */
  {
    slug: "marketing",
    meta: {
      title: "Marketing staffing",
      description:
        "Demand generation, content, marketing operations, analytics and events specialists, screened on the platforms you run and the work they have actually shipped.",
    },
    hero: {
      eyebrow: "Marketing",
      lead: "Marketers who have",
      accent: "shipped the work.",
      sub: "Demand generation, content, marketing operations, analytics, product marketing and events. Cover a maternity leave, staff a launch, or hire the person who owns the number.",
      photo: "industryMarketingHero",
      facts: [
        { figure: "6 functions", caption: "from demand generation and content through operations, analytics and events" },
        { figure: "Work seen", caption: "campaigns, dashboards and copy reviewed before you meet anyone" },
        { figure: "Platform screened", caption: "HubSpot, Marketo and Salesforce experience established rather than assumed" },
      ],
    },
    overview: {
      heading: "Everyone says full stack marketer. Almost nobody is.",
      paragraphs: [
        "We recruit across demand generation, content, marketing operations, analytics, product marketing and events, for B2B, B2C, agencies and in house teams.",
        "Marketing titles have drifted so far that they no longer describe the work. A marketing manager might be running paid media, or writing everything themselves, or managing an agency and nothing else.",
        "So the screen starts with what the person has actually shipped and what they owned when it worked. Then platforms, because a Marketo build and a HubSpot build are not the same skill.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "demand-gen",
        name: "Demand generation",
        photo: "/photos/roles/marketing-demand-gen.jpg",
        photoAlt: "A demand generation marketer reviewing a campaign dashboard",
        builds: "Paid, email and lifecycle campaigns, landing pages, nurture and the pipeline number they are measured against.",
        seniority: "Campaign executive through to demand generation manager",
        tools: ["HubSpot", "Marketo", "Google Ads", "Meta Ads", "LinkedIn Campaign Manager"],
        standards: ["Attribution model", "Lead scoring", "Pipeline reporting"],
      },
      {
        id: "content",
        name: "Content and copy",
        photo: "/photos/roles/marketing-content.jpg",
        photoAlt: "A content writer editing a printed draft at a sunlit desk",
        builds: "Editorial, web copy, sales collateral, case studies and the tone of voice everything else has to match.",
        seniority: "Copywriter through to content lead",
        tools: ["CMS platforms", "Webflow", "WordPress", "SEO tooling"],
        standards: ["Brand voice", "SEO practice", "Editorial calendar"],
      },
      {
        id: "marketing-ops",
        name: "Marketing operations",
        photo: "/photos/roles/marketing-marketing-ops.jpg",
        photoAlt: "A marketing operations specialist mapping an automation workflow",
        builds: "Automation, data hygiene, integrations, routing and the reporting the sales team argues with.",
        seniority: "Marketing ops analyst through to marketing ops manager",
        tools: ["Marketo", "HubSpot", "Salesforce", "Zapier", "Segment"],
        standards: ["Lead routing rules", "Data governance", "Consent and privacy"],
      },
      {
        id: "analytics",
        name: "Marketing analytics",
        photo: "/photos/roles/marketing-analytics.jpg",
        photoAlt: "A marketing analyst presenting an attribution chart to a team",
        builds: "Channel performance, cohort and funnel analysis, and the dashboard a board will actually look at.",
        seniority: "Analyst through to analytics manager",
        tools: ["GA4", "Looker", "Power BI", "Tableau", "SQL"],
        standards: ["Measurement plan", "Attribution", "Reporting cadence"],
      },
      {
        id: "product-marketing",
        name: "Product marketing",
        photo: "/photos/roles/marketing-product-marketing.jpg",
        photoAlt: "A product marketing manager working through a wall of positioning cards",
        builds: "Positioning, launches, competitive material and the sales enablement that gets used rather than filed.",
        seniority: "Product marketing manager through to lead",
        tools: ["Competitive intelligence tools", "Enablement platforms", "CMS"],
        standards: ["Launch process", "Messaging framework", "Win loss practice"],
      },
      {
        id: "events",
        name: "Events and field marketing",
        photo: "/photos/roles/marketing-events.jpg",
        photoAlt: "An events marketer directing setup at a conference booth",
        builds: "Trade shows, webinars, roadshows, logistics and the follow up that decides whether any of it paid off.",
        seniority: "Events coordinator through to field marketing manager",
        tools: ["Event platforms", "Webinar tooling", "CRM campaign objects"],
        standards: ["Budget control", "Lead capture and follow up", "Vendor management"],
      },
    ],
    stack: {
      heading: "What we recruit against.",
      intro:
        "Marketing platforms are where the transferable claim breaks down. These are the ones we screen on specifically.",
      groups: [
        { name: "Automation and CRM", items: ["HubSpot", "Marketo", "Salesforce", "Pardot", "Braze", "Klaviyo"] },
        { name: "Analytics", items: ["GA4", "Looker", "Power BI", "Tableau", "Mixpanel", "SQL"] },
        { name: "Creative and web", items: ["Adobe Creative Cloud", "Figma", "Canva", "Webflow", "WordPress"] },
        { name: "Paid and social", items: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Sprout Social", "Hootsuite"] },
      ],
    },
    screening: {
      heading: "How we screen a marketer.",
      intro:
        "Marketing candidates present well, because presenting is part of the job. The screen has to get underneath that to what they actually owned.",
      steps: [
        {
          title: "Ownership, not involvement",
          body: "Contributed to a campaign and owned the number are different claims. We establish which one, and what the number was.",
        },
        {
          title: "Work seen",
          body: "Campaigns, dashboards, writing samples or a portfolio. Reviewed before you spend an hour on an interview.",
        },
        {
          title: "Platform depth established",
          body: "Built the automation, used it, or watched an agency run it. All three describe themselves as experienced with Marketo.",
        },
        {
          title: "Measurement questioned",
          body: "How they knew it worked, what they would do differently, and what they stopped doing. The answers separate marketers from campaign runners.",
        },
        {
          title: "A reference from the person who set the target",
          body: "Not a colleague. The manager who owned the pipeline number the candidate contributed to.",
        },
      ],
    },
    pullQuote:
      "Contributed to and owned the number are different jobs, and marketing job titles call both of them manager.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a guarantee.",
      rows: [
        { role: "Marketing coordinators", market: "Deep pool, and a common entry route.", timeline: "Days to a week" },
        { role: "Content writers", market: "Plentiful. Quality varies enormously, which is why we ask for samples first.", timeline: "About a week" },
        { role: "Events and field marketing", market: "Available, and seasonal around conference calendars.", timeline: "One to two weeks" },
        { role: "Demand generation managers", market: "Competitive. Genuine pipeline ownership is scarcer than the title suggests.", timeline: "Two to four weeks" },
        { role: "Marketing operations", market: "Tight. Real Marketo or HubSpot build experience is the constraint.", timeline: "Three to four weeks" },
        { role: "Marketing analytics with SQL", market: "The hardest marketing hire we run, because the good ones get hired as data analysts instead.", timeline: "Three to five weeks" },
      ],
      note: "Marketing hiring runs faster when the brief names the number the person is accountable for. Without it, every shortlist is a guess.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Marketing demand is usually a launch, a gap or a build.",
      options: [
        {
          name: "Cover",
          covers: "Keeping the engine running while somebody is away.",
          fits: "Maternity or parental leave, a resignation mid quarter, a sabbatical.",
          shape: "Contract, three to twelve months.",
        },
        {
          name: "A launch team",
          covers: "Extra capacity around a specific push.",
          fits: "A product launch, a rebrand, a conference season, a market entry.",
          shape: "Contract specialists, often part time across several functions.",
        },
        {
          name: "The permanent hire",
          covers: "The person who owns the function or the number.",
          fits: "Demand generation lead, marketing ops, first marketing hire.",
          shape: "Direct hire, or contract-to-hire where the role is still being defined.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "The first question we will ask is what number this person is accountable for.",
      items: [
        "The number the role owns, or the closest thing to it",
        "Your automation platform and CRM, and who administers them",
        "Whether the person executes, manages an agency, or both",
        "The channels that actually matter to you, rather than all of them",
        "Team shape: who they work with and who reviews the work",
        "The salary band you can approve without a second meeting",
      ],
    },
    faqs: [
      {
        q: "How do you screen for marketing skill rather than presentation?",
        a: "By asking what the person owned and what the number was, then looking at the work. Campaigns, dashboards and writing samples are reviewed before you spend an hour interviewing.",
      },
      {
        q: "Do you cover both B2B and B2C?",
        a: "Yes, and the distinction matters more than most briefs allow for. A B2B demand generation manager and a B2C performance marketer share a job title and very little else.",
      },
      {
        q: "Can you find marketers who are hands on rather than managerial?",
        a: "Yes, and it is worth being explicit in the brief. Many candidates at manager level have not executed for years, which is fine unless you need someone who will build the email themselves.",
      },
      {
        q: "Do you place fractional or part time marketers?",
        a: "Yes, on contract. It is a common arrangement for launches and for companies not yet ready for a full time senior hire.",
      },
      {
        q: "Why is marketing operations so hard to hire?",
        a: "Because it needs technical depth and marketing context at once, and people who have both tend to be retained. Expect three to four weeks and a real conversation about rate.",
      },
      {
        q: "What does it cost?",
        a: "Contract marketers are an hourly or daily rate covering pay, our employment costs and our margin. Permanent hires are a percentage of first year salary. Both quoted before work starts.",
      },
    ],
    cta: {
      heading: "Hiring marketers?",
      body: "Tell us the number the role owns and the platforms behind it. We will show you work before you spend an hour interviewing.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     SALES
     ══════════════════════════════════════════════════════════ */
  {
    slug: "sales",
    meta: {
      title: "Sales staffing",
      description:
        "Inside sales, account management, field sales, sales engineering and sales operations, screened on quota history and the motion you actually run.",
    },
    hero: {
      eyebrow: "Sales",
      lead: "Salespeople who have",
      accent: "carried a number.",
      sub: "Inside sales, account management, field sales, sales engineering and sales operations. Build a team, cover a territory, or hire the person who owns a region.",
      photo: "industrySalesHero",
      facts: [
        { figure: "6 functions", caption: "from prospecting and account management through sales engineering and operations" },
        { figure: "Quota verified", caption: "target, attainment and deal size checked at reference rather than taken on trust" },
        { figure: "Motion matched", caption: "transactional, mid market and enterprise are different jobs with the same titles" },
      ],
    },
    overview: {
      heading: "The motion matters more than the industry.",
      paragraphs: [
        "We recruit inside sales and prospecting, account management, field sales, sales engineering, sales operations and enablement, across technology, industrial, professional services and consumer businesses.",
        "The most common hiring mistake in sales is matching on sector rather than motion. Somebody who closes forty transactional deals a quarter is not a natural fit for an eighteen month enterprise cycle, whatever industry either sits in.",
        "So we screen on cycle length, deal size, whether they hunt or farm, and what they personally closed rather than what the team did.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "prospecting",
        name: "Prospecting and inside sales",
        photo: "/photos/roles/sales-prospecting.jpg",
        photoAlt: "An inside sales representative on a prospecting call",
        builds: "Outbound sequences, qualification, meetings booked and the discipline to do it again tomorrow.",
        seniority: "SDR and BDR through to inside sales lead",
        tools: ["Salesforce", "Outreach", "Salesloft", "ZoomInfo", "LinkedIn Sales Navigator"],
        standards: ["Activity and meeting targets", "Qualification framework", "CRM hygiene"],
      },
      {
        id: "account-management",
        name: "Account management",
        photo: "/photos/roles/sales-account-management.jpg",
        photoAlt: "An account manager in a review meeting with a client",
        builds: "Retention, growth, renewals and the relationship that survives a bad quarter.",
        seniority: "Account manager through to strategic account director",
        tools: ["Salesforce", "HubSpot", "Gainsight", "QBR templates"],
        standards: ["Renewal and expansion targets", "Account planning", "Escalation handling"],
      },
      {
        id: "field-sales",
        name: "Field and territory sales",
        photo: "/photos/roles/sales-field-sales.jpg",
        photoAlt: "A field sales representative greeting a customer on site",
        builds: "A patch, a route, a pipeline and the miles that come with them.",
        seniority: "Territory representative through to regional sales manager",
        tools: ["CRM mobile", "Route planning", "Quoting tools"],
        standards: ["Territory coverage", "Quota attainment", "Expense discipline"],
      },
      {
        id: "sales-engineering",
        name: "Sales engineering",
        photo: "/photos/roles/sales-sales-engineering.jpg",
        photoAlt: "A sales engineer demonstrating a product to customers",
        builds: "Demonstrations, technical qualification, proof of concept and the answer to the question that stalls a deal.",
        seniority: "Sales engineer through to principal solutions consultant",
        tools: ["Demo environments", "Technical documentation", "CRM"],
        standards: ["Technical qualification", "POC scoping", "Security questionnaires"],
      },
      {
        id: "sales-ops",
        name: "Sales operations",
        photo: "/photos/roles/sales-sales-ops.jpg",
        photoAlt: "A sales operations analyst reviewing a pipeline dashboard",
        builds: "Forecasting, territory and quota design, CRM administration and the reporting leadership argues over.",
        seniority: "Sales ops analyst through to sales ops manager",
        tools: ["Salesforce administration", "Clari", "Gong", "Excel and SQL"],
        standards: ["Forecast discipline", "Territory design", "Commission accuracy"],
      },
      {
        id: "enablement",
        name: "Enablement and training",
        photo: "/photos/roles/sales-enablement.jpg",
        photoAlt: "A sales enablement trainer coaching new hires",
        builds: "Onboarding for new reps, playbooks, call coaching and the ramp time that decides a quarter.",
        seniority: "Enablement specialist through to enablement manager",
        tools: ["Gong", "Highspot", "LMS platforms"],
        standards: ["Ramp targets", "Certification of reps", "Playbook adoption"],
      },
    ],
    stack: {
      heading: "What we recruit against.",
      intro:
        "The tooling matters, but the motion matters more. We screen both, and we will tell you when a strong candidate is a poor motion match.",
      groups: [
        { name: "CRM", items: ["Salesforce", "HubSpot", "Dynamics 365", "Pipedrive"] },
        { name: "Engagement", items: ["Outreach", "Salesloft", "Gong", "Chorus", "ZoomInfo", "Sales Navigator"] },
        { name: "Forecasting and enablement", items: ["Clari", "Highspot", "Seismic", "Excel and SQL"] },
        { name: "What we verify at reference", items: ["Quota", "Attainment", "Average deal size", "Cycle length", "Ramp time"] },
      ],
    },
    screening: {
      heading: "How we screen a salesperson.",
      intro:
        "Salespeople are, by definition, good at interviews. The only reliable screen is specific numbers and a reference who owned the forecast.",
      steps: [
        {
          title: "The motion, established first",
          body: "Cycle length, average deal size, hunting or farming, inbound or outbound, and how many stakeholders sit in a typical deal.",
        },
        {
          title: "Numbers, not adjectives",
          body: "What was the quota, what did they attain, over how many quarters, and where did they rank. Vague answers here are the answer.",
        },
        {
          title: "A deal walked through end to end",
          body: "Their best deal, from first contact to signature. It exposes process, discipline and whether they actually ran it.",
        },
        {
          title: "Territory and pipeline reality",
          body: "Inherited pipeline or built from nothing, house accounts or cold patch. It changes what their attainment actually means.",
        },
        {
          title: "A reference from the sales leader",
          body: "The person who owned the forecast and can confirm the quota and the attainment, rather than a colleague who liked them.",
        },
      ],
    },
    pullQuote:
      "Ask for the quota, the attainment and the ranking. Everything else in a sales interview is a presentation.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a promise.",
      rows: [
        { role: "SDRs and BDRs", market: "Deep pool. Retention and ramp are the challenge, not sourcing.", timeline: "Days to a week" },
        { role: "Inside sales", market: "Available. Verified attainment is what separates the shortlist.", timeline: "About a week" },
        { role: "Account managers", market: "Steady, though genuine expansion track records are fewer than renewals experience.", timeline: "One to two weeks" },
        { role: "Field sales with an existing patch", market: "Competitive, and territory knowledge carries a premium.", timeline: "Two to four weeks" },
        { role: "Sales operations", market: "Tight. Salesforce administration plus commercial judgement is a rare pairing.", timeline: "Three to four weeks" },
        { role: "Sales engineers", market: "The hardest sales hire we run. Technical depth and client presence rarely sit in the same person.", timeline: "Four to six weeks" },
      ],
      note: "Comp plan clarity speeds a sales search more than anything else. If the plan is still being written, expect the search to take as long as the plan does.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Sales demand is a build, a gap or a bet on a territory.",
      options: [
        {
          name: "Building a team",
          covers: "Several reps hired against a plan.",
          fits: "A new region, a new product, a funded growth plan.",
          shape: "Direct hire in cohorts, so onboarding and ramp happen together.",
        },
        {
          name: "Covering a patch",
          covers: "Keeping a territory alive while you recruit.",
          fits: "A resignation mid quarter, a leave of absence, a sudden gap in a region.",
          shape: "Contract, with the option to convert.",
        },
        {
          name: "The senior hire",
          covers: "The person who owns a region or a function.",
          fits: "Sales leadership, strategic accounts, sales operations, sales engineering.",
          shape: "Direct hire, often confidential.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "A sales brief without a comp plan and a motion is a wish list.",
      items: [
        "Cycle length, average deal size and typical number of stakeholders",
        "Hunting or farming, inbound or outbound",
        "The comp plan: base, variable, accelerators and when it pays",
        "Territory: inherited pipeline, house accounts, or built from nothing",
        "Ramp expectation, and what quota looks like in month six",
        "Travel percentage, said honestly",
      ],
    },
    faqs: [
      {
        q: "How do you verify quota attainment?",
        a: "At reference, with the sales leader who owned the forecast. We ask for quota, attainment, ranking and average deal size. Candidates who are uncomfortable with that reference are telling you something.",
      },
      {
        q: "Does industry experience matter?",
        a: "Less than the motion. A transactional closer and an enterprise seller are different jobs regardless of sector, and matching on industry while ignoring cycle length is the most common sales hiring mistake we see.",
      },
      {
        q: "Can you hire a whole team?",
        a: "Yes, and cohort hiring is usually better than sequential. Reps who onboard together ramp together, and your enablement effort is spent once rather than five times.",
      },
      {
        q: "Can sales roles be covered on contract?",
        a: "Territory cover and sales operations work well on contract. Quota carrying roles are usually better as permanent hires, because a contractor rarely gets the runway to build a pipeline.",
      },
      {
        q: "Why do sales engineers take so long?",
        a: "Because they need genuine technical depth and client presence, and most people are strong in one. It is a four to six week search in most markets and worth planning for.",
      },
      {
        q: "What does it cost?",
        a: "Permanent sales hires are a percentage of first year base salary, quoted before work starts. Contract cover is an hourly or daily rate.",
      },
    ],
    cta: {
      heading: "Building a sales team?",
      body: "Tell us the motion, the comp plan and the territory. We will verify quota and attainment before you meet anyone.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     GOVERNMENT
     ══════════════════════════════════════════════════════════ */
  {
    slug: "government",
    meta: {
      title: "Government staffing",
      description:
        "Program support, IT and cybersecurity, contracts and procurement, grants and compliance staff for public agencies and contractors, with clearance status verified.",
    },
    hero: {
      eyebrow: "Government",
      lead: "Public work needs",
      accent: "people who show up.",
      sub: "Program support, IT and cybersecurity, contracts and procurement, grants, compliance and citizen services. For agencies, and for the contractors who serve them.",
      photo: "industryGovernmentHero",
      facts: [
        { figure: "6 functions", caption: "from program and administrative support through contracts, IT and compliance" },
        { figure: "Clearance verified", caption: "status and investigation date confirmed at screening where a role requires it" },
        { figure: "Contract vehicles", caption: "staff supplied to primes and subcontractors as well as directly to agencies" },
      ],
    },
    overview: {
      heading: "The constraint is rarely the candidate.",
      paragraphs: [
        "We staff public sector work across program and administrative support, IT and cybersecurity, contracts and procurement, finance and grants, compliance and records, and citizen facing services. Agencies at every level, and the contractors delivering for them.",
        "Government hiring runs on process. Position descriptions, approval chains, onboarding and, where relevant, clearance. The candidate is often ready weeks before the paperwork is.",
        "So we plan around it: verify clearance status at screening, confirm residency and background requirements early, and tell you plainly when a start date is being set by onboarding rather than by sourcing.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "program-support",
        name: "Program and administrative support",
        photo: "/photos/roles/government-program-support.jpg",
        photoAlt: "A program support specialist preparing a report",
        builds: "Program coordination, scheduling, correspondence, records and the reporting a funder will ask for.",
        seniority: "Administrative assistant through to program analyst",
        tools: ["Microsoft 365", "SharePoint", "Records systems", "Case management"],
        standards: ["Records retention", "FOIA awareness", "Accessibility requirements"],
      },
      {
        id: "gov-it",
        name: "IT and cybersecurity",
        photo: "/photos/roles/government-gov-it.jpg",
        photoAlt: "A public sector IT specialist checking equipment with a tablet",
        builds: "Service desk, infrastructure, application support and the security controls an assessor will test.",
        seniority: "Support technician through to security analyst and systems engineer",
        tools: ["ServiceNow", "Active Directory", "Azure Government", "Splunk", "Tenable"],
        standards: ["NIST 800-53 and 800-171", "FedRAMP awareness", "Section 508 accessibility"],
      },
      {
        id: "contracts",
        name: "Contracts and procurement",
        photo: "/photos/roles/government-contracts.jpg",
        photoAlt: "A contracts specialist reviewing a contract document",
        builds: "Solicitations, proposals, modifications, subcontract administration and the file that survives an audit.",
        seniority: "Contract administrator through to contracts manager",
        tools: ["Contract management systems", "SAM registration", "Procurement portals"],
        standards: ["FAR and DFARS", "Small business requirements", "Audit documentation"],
      },
      {
        id: "grants",
        name: "Finance and grants",
        photo: "/photos/roles/government-grants.jpg",
        photoAlt: "A grants accountant reconciling a budget against a grant agreement",
        builds: "Budgets, drawdowns, grant reporting, reconciliations and the compliance a single audit will examine.",
        seniority: "Grants accountant through to grants manager",
        tools: ["Government accounting systems", "Grants management platforms", "Excel"],
        standards: ["Uniform Guidance", "Single audit readiness", "Cost principles"],
      },
      {
        id: "compliance",
        name: "Compliance and records",
        photo: "/photos/roles/government-compliance.jpg",
        photoAlt: "A compliance officer checking records in an archive room",
        builds: "Policy, audit response, records management and the documentation that answers an inspector general.",
        seniority: "Compliance analyst through to compliance manager",
        tools: ["Document and records systems", "Audit tracking"],
        standards: ["Retention schedules", "Privacy requirements", "Audit response"],
      },
      {
        id: "citizen-services",
        name: "Citizen services",
        photo: "/photos/roles/government-citizen-services.jpg",
        photoAlt: "A citizen services representative helping a member of the public",
        builds: "Call centres, eligibility, intake, benefits support and the queue that grows when a policy changes.",
        seniority: "Service representative through to team supervisor",
        tools: ["Case management systems", "Telephony platforms", "Eligibility systems"],
        standards: ["Service level targets", "Privacy and PII handling", "Quality monitoring"],
      },
    ],
    stack: {
      heading: "What we verify and recruit against.",
      intro:
        "In public sector work the paperwork is the timeline. These are the things that decide whether somebody can actually start.",
      groups: [
        { name: "Frameworks", items: ["FAR", "DFARS", "Uniform Guidance", "NIST 800-53", "NIST 800-171", "Section 508"] },
        { name: "Systems", items: ["ServiceNow", "SharePoint", "Grants management platforms", "Case management", "Azure Government"] },
        { name: "Clearance status we verify", items: ["Public Trust", "Secret", "Top Secret", "Investigation date", "Reciprocity"] },
        { name: "Checks we run", items: ["Background investigation history", "Residency requirements", "E-Verify", "Drug screening where required"] },
      ],
    },
    screening: {
      heading: "How we screen for public sector work.",
      intro:
        "The screen has two halves. Can this person do the job, and can this person actually start. In government work the second half is where most timelines are lost.",
      steps: [
        {
          title: "Eligibility established first",
          body: "Citizenship or residency requirements, background investigation history, and clearance status with the date of the last investigation.",
        },
        {
          title: "The environment named honestly",
          body: "Agency or contractor, on site or remote, and the pace, because public sector work suits some people and frustrates others.",
        },
        {
          title: "Framework knowledge questioned",
          body: "FAR familiarity for contracts roles, Uniform Guidance for grants, NIST for security. Short, specific questions rather than a claim on a resume.",
        },
        {
          title: "Onboarding runway mapped",
          body: "We work out with you how long badging, systems access and any investigation will take, and we set the candidate's expectations to match.",
        },
        {
          title: "A reference from a supervisor",
          body: "Somebody who saw the work and can speak to reliability in an environment where deadlines are statutory rather than commercial.",
        },
      ],
    },
    pullQuote:
      "In public sector hiring the candidate is usually ready weeks before the paperwork is. Plan the paperwork first.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a guarantee.",
      rows: [
        { role: "Administrative and program support", market: "Available in most markets.", timeline: "About a week" },
        { role: "Citizen services and call centre", market: "Available, and scalable for a policy driven surge.", timeline: "Days to a week" },
        { role: "Grants and government accounting", market: "Steady. Uniform Guidance experience narrows it noticeably.", timeline: "Two to three weeks" },
        { role: "Contracts and procurement", market: "Tight. FAR depth is scarcer than the number of resumes suggests.", timeline: "Three to four weeks" },
        { role: "IT support and systems", market: "Available, until a clearance requirement is added.", timeline: "Two to three weeks" },
        { role: "Cleared cybersecurity", market: "The hardest public sector hire we run, and onboarding adds to it.", timeline: "Six weeks and up" },
      ],
      note: "Where a role requires an active clearance, the search is a search for a much smaller population. It is worth deciding early whether the requirement is genuine or inherited from an old position description.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Public sector demand is driven by budget cycles, contract awards and policy changes.",
      options: [
        {
          name: "Surge and backlog",
          covers: "Extra capacity against a spike.",
          fits: "A policy change, a backlog, a deadline set by statute rather than by preference.",
          shape: "Temporary and contract, scaled up in groups.",
        },
        {
          name: "Contract support",
          covers: "Staff supplied against an awarded programme.",
          fits: "Prime and subcontractor delivery, task orders, programme ramp up.",
          shape: "Contract for the length of the period of performance.",
        },
        {
          name: "The permanent hire",
          covers: "Roles an agency or contractor intends to keep.",
          fits: "Contracts managers, grants managers, compliance leads, senior analysts.",
          shape: "Direct hire, with onboarding runway planned into the timeline.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "The first thing we will ask about is eligibility, because it sets the timeline.",
      items: [
        "Citizenship, residency and background investigation requirements",
        "Whether a clearance is genuinely required, and at what level",
        "Agency, prime or subcontractor, and the contract vehicle if relevant",
        "How long badging and systems access realistically take at your site",
        "The period of performance, if the role is tied to one",
        "The rate or salary band, and whether it is set by a schedule",
      ],
    },
    faqs: [
      {
        q: "Do you place cleared personnel?",
        a: "We recruit candidates who hold active clearances and verify status and investigation date at screening. Sponsorship of a new clearance sits with the agency or the prime, and we will tell you plainly when a requirement is going to shrink the candidate pool dramatically.",
      },
      {
        q: "Can you support a contract award ramp?",
        a: "Yes. Staffing against a period of performance is a common arrangement, including scaling a team up at award and winding it down at the end without a redundancy conversation.",
      },
      {
        q: "How long does onboarding take?",
        a: "Longer than the search, frequently. Badging, systems access and any investigation are usually the binding constraint, so we map them with you at the start and set candidate expectations accordingly.",
      },
      {
        q: "Do you understand FAR and Uniform Guidance requirements?",
        a: "We screen against them rather than claim expertise in them. Contracts candidates get specific FAR questions, grants candidates get Uniform Guidance questions, and where a role is highly specialised we ask your team for two questions to add.",
      },
      {
        q: "Can you staff citizen facing service surges?",
        a: "Yes, and it is one of the more common public sector requests. Call centre and eligibility support can be scaled in groups against a policy deadline.",
      },
      {
        q: "What does it cost?",
        a: "Contract staff are an hourly rate covering pay, our employment costs and our margin. Permanent hires are a percentage of first year salary. Both quoted before work starts, and we will work to a rate schedule where one applies.",
      },
    ],
    cta: {
      heading: "Staffing a public programme?",
      body: "Tell us the eligibility requirements and the period of performance. We will be honest about what the clearance requirement does to the timeline.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     ENERGY
     ══════════════════════════════════════════════════════════ */
  {
    slug: "energy",
    meta: {
      title: "Energy staffing",
      description:
        "Field technicians, plant and control room operators, transmission and distribution crews, renewables technicians and HSE staff, with safety qualifications verified.",
    },
    hero: {
      eyebrow: "Energy",
      lead: "People who keep",
      accent: "the lights on.",
      sub: "Field and plant technicians, control room operators, transmission and distribution, renewables operations and HSE. Outage support, a project ramp, or the permanent hire a site depends on.",
      photo: "industryEnergyHero",
      facts: [
        { figure: "6 functions", caption: "from field and plant operations through control room, renewables and safety" },
        { figure: "Safety verified", caption: "qualifications and site requirements checked before anyone travels" },
        { figure: "Outage ready", caption: "crews mobilised against a planned outage window rather than a vague start date" },
      ],
    },
    overview: {
      heading: "Safety qualification decides who can start.",
      paragraphs: [
        "We staff generation, transmission and distribution, renewables and utilities operations: field technicians, plant operators, control room and dispatch, engineering support, and health and safety.",
        "Energy work is scheduled around outages, seasons and compliance deadlines, which means dates are fixed long before people are. That is an advantage if the staffing plan starts early enough.",
        "The gating item is almost always qualification rather than skill. Safety training, site specific requirements and medical or drug screening decide whether somebody can be on site on the Monday you need them.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "field",
        name: "Field operations and service",
        photo: "/photos/roles/energy-field.jpg",
        photoAlt: "A field technician taking a reading at an outdoor metering cabinet",
        builds: "Preventive maintenance, callouts, metering, inspections and the driving that comes with a territory.",
        seniority: "Field technician through to field supervisor",
        tools: ["Diagnostic equipment", "Mobile work management", "GIS mapping"],
        standards: ["OSHA 10 and 30", "Confined space where relevant", "Driving record requirements"],
      },
      {
        id: "plant",
        name: "Plant operations and maintenance",
        photo: "/photos/roles/energy-plant.jpg",
        photoAlt: "A plant operator checking a gauge on a pump",
        builds: "Running and maintaining generating and processing assets, plus the outage work that keeps them available.",
        seniority: "Operator and mechanic through to maintenance supervisor",
        tools: ["DCS and PLC interfaces", "Maximo", "Vibration and thermography tools"],
        standards: ["Lockout tagout", "Permit to work", "NFPA 70E"],
      },
      {
        id: "transmission",
        name: "Transmission and distribution",
        photo: "/photos/roles/energy-transmission.jpg",
        photoAlt: "A substation technician testing a relay panel",
        builds: "Line work support, substation maintenance, relay and protection, and restoration after weather.",
        seniority: "Apprentice and technician through to substation and relay technician",
        tools: ["Relay test sets", "SCADA interfaces", "Protection schemes"],
        standards: ["NERC CIP awareness", "Arc flash", "Grounding and switching procedures"],
      },
      {
        id: "renewables",
        name: "Renewables operations",
        photo: "/photos/roles/energy-renewables.jpg",
        photoAlt: "A solar technician checking an inverter beside a solar array",
        builds: "Wind and solar operations and maintenance, inverter and turbine work, performance monitoring and site upkeep.",
        seniority: "Technician through to site supervisor",
        tools: ["SCADA monitoring", "Inverter platforms", "Torque and tension tooling"],
        standards: ["Working at height and rescue", "Electrical safety", "Site access requirements"],
      },
      {
        id: "control-room",
        name: "Control room and dispatch",
        photo: "/photos/roles/energy-control-room.jpg",
        photoAlt: "A control room operator monitoring a grid schematic",
        builds: "Monitoring, switching, dispatch and the twelve hour shift where nothing should happen and occasionally does.",
        seniority: "Operator through to shift supervisor",
        tools: ["SCADA", "EMS and DMS platforms", "Outage management systems"],
        standards: ["Switching authority", "Shift handover discipline", "Regulatory logging"],
      },
      {
        id: "hse",
        name: "Health, safety and environment",
        photo: "/photos/roles/energy-hse.jpg",
        photoAlt: "A health and safety officer discussing a permit on site",
        builds: "Safety programmes, audits, incident investigation, permits and the training records a regulator will ask for.",
        seniority: "HSE coordinator through to HSE manager",
        tools: ["Incident management systems", "Audit platforms", "Training records"],
        standards: ["OSHA regulations", "Environmental reporting", "Contractor safety management"],
      },
    ],
    stack: {
      heading: "What we verify and recruit against.",
      intro:
        "Qualification and medical clearance decide the start date far more often than experience does. Both are checked first.",
      groups: [
        { name: "Systems", items: ["SCADA", "EMS and DMS", "Maximo", "GIS", "Outage management", "PI historian"] },
        { name: "Safety qualifications", items: ["OSHA 10", "OSHA 30", "NFPA 70E", "Confined space", "Working at height", "First aid and CPR"] },
        { name: "Standards", items: ["NERC CIP awareness", "API where applicable", "Lockout tagout", "Permit to work"] },
        { name: "Checks we run", items: ["Driving record", "Drug and alcohol screening", "Medical and fit for duty", "Background check"] },
      ],
    },
    screening: {
      heading: "How we screen for site work.",
      intro:
        "Energy screening is sequential. Qualification, then medical and driving, then capability. Doing it in that order stops people being mobilised who cannot legally be on site.",
      steps: [
        {
          title: "Qualifications verified first",
          body: "Safety training, site specific requirements and any regulatory qualification, checked with the issuing body before travel is booked.",
        },
        {
          title: "Medical, driving and screening",
          body: "Fit for duty, drug and alcohol screening and the driving record, because for field roles the licence is the job.",
        },
        {
          title: "The environment described plainly",
          body: "Outdoors, heights, confined spaces, weather, shift length, camp accommodation and travel. Said honestly before anybody accepts.",
        },
        {
          title: "Technical capability tested",
          body: "Equipment and system familiarity, and for protection and relay work a short set of discipline questions from your team.",
        },
        {
          title: "A reference on safety behaviour",
          body: "A supervisor who can speak to how they behave when a shortcut is available and nobody is watching.",
        },
      ],
    },
    pullQuote:
      "In energy work the qualification decides the start date, not the interview. Verify it before anybody books a flight.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a guarantee.",
      rows: [
        { role: "General site and support labour", market: "Available in most regions.", timeline: "Days to a week" },
        { role: "HSE coordinators", market: "Steady, though contractor safety management experience narrows it.", timeline: "Two to three weeks" },
        { role: "Plant mechanics and operators", market: "Regional. Availability follows the local industrial base closely.", timeline: "Two to four weeks" },
        { role: "Wind and solar technicians", market: "Tight, and travel tolerance decides it as much as skill.", timeline: "Three to four weeks" },
        { role: "Control room operators", market: "Difficult. Twelve hour rotating shifts narrow the field sharply.", timeline: "Four to six weeks" },
        { role: "Relay and protection technicians", market: "The hardest energy hire we run, in nearly every market.", timeline: "Six weeks and up" },
      ],
      note: "Outage staffing should start months out, not weeks. The window is fixed, the qualified population is small, and everyone in the region wants them in the same fortnight.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Energy demand is planned, seasonal or storm driven, and each needs a different lead time.",
      options: [
        {
          name: "Outage and turnaround",
          covers: "A crew against a fixed window.",
          fits: "Planned outages, turnarounds, major maintenance, commissioning.",
          shape: "Contract for the window, mobilised with qualifications verified in advance.",
        },
        {
          name: "Project ramp",
          covers: "A team across several disciplines for a build or a programme.",
          fits: "New generation, a substation programme, a renewables portfolio, a metering rollout.",
          shape: "Project and team staffing, onshore, with one point of contact.",
        },
        {
          name: "The permanent hire",
          covers: "The people a site cannot operate without.",
          fits: "Control room operators, relay technicians, HSE leads, maintenance supervisors.",
          shape: "Direct hire, or contract-to-hire where shift tolerance needs proving.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "The qualification list and the date are the two things that shape everything else.",
      items: [
        "Site specific safety qualifications, and who provides the training",
        "Shift pattern, rotation length and whether accommodation is provided",
        "Travel percentage and whether a driving record requirement applies",
        "Medical, drug screening and fit for duty requirements",
        "The outage or project window, with the mobilisation date",
        "The rate, including any per diem or travel allowance",
      ],
    },
    faqs: [
      {
        q: "How far ahead should we plan outage staffing?",
        a: "Months rather than weeks. The window is fixed, the qualified population is small and every operator in the region wants the same people in the same fortnight. Early planning is the whole game here.",
      },
      {
        q: "Do you verify safety qualifications?",
        a: "Yes, with the issuing body, before travel is booked. We also confirm medical, drug screening and driving record requirements, because for field roles those decide the start date.",
      },
      {
        q: "Can you supply crews for storm restoration?",
        a: "We can mobilise support and technician roles quickly, and we are honest about which specialist line roles we can and cannot supply at short notice.",
      },
      {
        q: "Why are relay and protection technicians so difficult?",
        a: "The population is small, the training is long, and utilities hold onto them. It is a six week search or longer in most markets, and rate is rarely the deciding factor.",
      },
      {
        q: "Do you staff renewables as well as conventional generation?",
        a: "Yes. Wind and solar operations and maintenance, inverter and turbine work, and the site roles around them. Travel tolerance matters as much as technical skill in these positions.",
      },
      {
        q: "What does it cost?",
        a: "Contract staff are an hourly rate covering pay, our employment costs and our margin, with per diem and travel handled separately where they apply. Permanent hires are a percentage of first year salary.",
      },
    ],
    cta: {
      heading: "Planning an outage?",
      body: "Tell us the window, the qualifications and the shift pattern. The earlier the conversation, the better the crew.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     AUTOMOTIVE
     ══════════════════════════════════════════════════════════ */
  {
    slug: "automotive",
    meta: {
      title: "Automotive staffing",
      description:
        "Technicians, service advisors, parts staff, collision and dealership support, plus production and quality roles for OEM and tier suppliers.",
    },
    hero: {
      eyebrow: "Automotive",
      lead: "Bays full,",
      accent: "cars moving.",
      sub: "Technicians, service advisors, parts and collision staff for dealerships and independents, plus production, quality and logistics for OEM and tier suppliers.",
      photo: "industryAutomotiveHero",
      facts: [
        { figure: "6 functions", caption: "from the service drive and the bays through parts, collision and supplier production" },
        { figure: "ASE verified", caption: "certifications and state inspection licences checked before you meet anyone" },
        { figure: "Both sides", caption: "retail dealership staffing and OEM and tier supplier production under one contract" },
      ],
    },
    overview: {
      heading: "The technician shortage is real. The rest is fixable.",
      paragraphs: [
        "We staff both halves of automotive: dealership and independent service, parts, collision and support, and the OEM and tier supplier side covering production, quality, logistics and pre delivery inspection.",
        "Retail automotive lives and dies on technician capacity. Every unfilled bay is lost hours that cannot be recovered later, which makes this one of the few industries where speed of hire is worth paying for directly.",
        "On the supplier side the pattern is closer to manufacturing: volume, shift, launch ramps and quality standards, with the same emphasis on shift honesty and certification.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "technicians",
        name: "Service technicians",
        photo: "/photos/roles/automotive-technicians.jpg",
        photoAlt: "A service technician diagnosing a car on a lift",
        builds: "Diagnostics, repair, maintenance and warranty work, and the flat rate hours a bay is measured on.",
        seniority: "Lube technician through to master technician",
        tools: ["Manufacturer diagnostic platforms", "ALLDATA", "Mitchell 1", "Scan tools"],
        standards: ["ASE certifications", "State inspection licence", "Manufacturer training levels"],
      },
      {
        id: "service-drive",
        name: "Service drive",
        photo: "/photos/roles/automotive-service-drive.jpg",
        photoAlt: "A service advisor talking a customer through a repair",
        builds: "Write ups, estimates, customer updates and the difficult call about a repair that grew.",
        seniority: "Service advisor through to service manager",
        tools: ["CDK", "Reynolds and Reynolds", "Dealertrack", "Xtime"],
        standards: ["Customer satisfaction measures", "Warranty documentation", "Estimate accuracy"],
      },
      {
        id: "parts",
        name: "Parts and inventory",
        photo: "/photos/roles/automotive-parts.jpg",
        photoAlt: "A parts specialist handing a part across the counter",
        builds: "Counter service, ordering, stocking and the accuracy that keeps a technician from waiting.",
        seniority: "Parts driver and counter through to parts manager",
        tools: ["Dealer management systems", "Catalogue platforms", "Inventory tools"],
        standards: ["Stock accuracy", "Obsolescence control", "Warranty parts handling"],
      },
      {
        id: "collision",
        name: "Collision and body",
        photo: "/photos/roles/automotive-collision.jpg",
        photoAlt: "A collision estimator documenting damage on a vehicle",
        builds: "Estimating, structural and panel repair, refinishing and the insurance conversation that funds it.",
        seniority: "Detailer and prepper through to body technician and estimator",
        tools: ["CCC", "Mitchell", "Audatex", "Frame and measuring systems"],
        standards: ["I-CAR training", "Refinish certifications", "OEM repair procedures"],
      },
      {
        id: "supplier-production",
        name: "Supplier production and quality",
        photo: "/photos/roles/automotive-supplier-production.jpg",
        photoAlt: "A quality technician gauging a component in a production cell",
        builds: "Assembly, machining, inspection and containment for OEM and tier one and two suppliers.",
        seniority: "Operator through to quality technician and supervisor",
        tools: ["MES", "SAP", "CMM and gauging", "Minitab"],
        standards: ["IATF 16949", "PPAP", "FMEA", "Layered process audits"],
      },
      {
        id: "logistics",
        name: "Logistics and vehicle operations",
        photo: "/photos/roles/automotive-logistics.jpg",
        photoAlt: "A logistics coordinator checking vehicles on a dealership lot",
        builds: "Pre delivery inspection, vehicle movement, yard management, transport and lot operations.",
        seniority: "Porter and driver through to logistics coordinator",
        tools: ["Yard management systems", "Transport platforms"],
        standards: ["Valid licence and driving record", "Damage reporting", "Vehicle handling"],
      },
    ],
    stack: {
      heading: "What we verify and recruit against.",
      intro:
        "Certification decides both capability and billable rate in automotive, so it is checked at source before you meet anyone.",
      groups: [
        { name: "Diagnostic and repair", items: ["ALLDATA", "Mitchell 1", "Manufacturer scan tools", "Frame and measuring systems"] },
        { name: "Dealer systems", items: ["CDK", "Reynolds and Reynolds", "Dealertrack", "Xtime", "CCC", "Audatex"] },
        { name: "Certifications", items: ["ASE A1 to A8", "ASE Master", "State inspection licence", "I-CAR", "Manufacturer certifications", "EPA 609"] },
        { name: "Supplier standards", items: ["IATF 16949", "PPAP", "FMEA", "Layered process audit", "5S"] },
      ],
    },
    screening: {
      heading: "How we screen automotive staff.",
      intro:
        "Two different screens, honestly applied. Retail technicians are screened on certification and productivity, supplier roles on shift, standards and reliability.",
      steps: [
        {
          title: "Certification verified at source",
          body: "ASE level, state inspection licence, manufacturer training and I-CAR for collision. It determines both what they can work on and what you can bill.",
        },
        {
          title: "Productivity established",
          body: "Flat rate hours produced, efficiency, and the work mix they are actually strong in. Diagnostics and maintenance are different skills.",
        },
        {
          title: "Tools and equipment confirmed",
          body: "Whether they own their tools, what they are missing, and what your shop supplies. It is a real barrier to a start date and is rarely asked about early enough.",
        },
        {
          title: "Shift and pay structure explained",
          body: "Flat rate, hourly or a hybrid, plus Saturdays. Pay structure surprises are the most common cause of a technician leaving within a month.",
        },
        {
          title: "A reference from a service or shop manager",
          body: "Somebody who saw the hours produced and the comeback rate, which is the only quality measure that matters in a bay.",
        },
      ],
    },
    pullQuote:
      "An empty bay is lost hours that never come back. That is why automotive is one of the few places where speed of hire pays for itself directly.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a guarantee.",
      rows: [
        { role: "Porters, drivers and detailers", market: "Available in most markets.", timeline: "Days" },
        { role: "Supplier production operators", market: "Available. Shift and location decide it, as in manufacturing.", timeline: "Days to a week" },
        { role: "Parts counter staff", market: "Steady, though dealer system experience narrows it.", timeline: "About a week" },
        { role: "Service advisors", market: "Tight. The combination of customer skill and technical literacy is uncommon.", timeline: "Two to four weeks" },
        { role: "Body technicians", market: "Very tight almost everywhere, and getting tighter as the trade ages.", timeline: "Four to six weeks" },
        { role: "ASE master technicians", market: "The hardest automotive hire in the market, and heavily counter offered.", timeline: "Six weeks and up" },
      ],
      note: "For master technicians, pay structure and tool allowance move the market more than the advert does. If a search is stalling, that is almost always where the problem is.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Retail and supplier automotive have different rhythms, and we staff both.",
      options: [
        {
          name: "Bay and drive cover",
          covers: "Keeping a service department running.",
          fits: "A technician resignation, a seasonal surge, a recall campaign, holiday cover.",
          shape: "Contract or contract-to-hire, because retention matters more than speed alone.",
        },
        {
          name: "Supplier volume",
          covers: "Production and quality staff at scale.",
          fits: "A launch ramp, a containment, a new programme, a seasonal build.",
          shape: "Temporary and contract at volume, onboarded in groups.",
        },
        {
          name: "The permanent hire",
          covers: "The people a shop or a plant is built around.",
          fits: "Master technicians, service managers, quality engineers, supervisors.",
          shape: "Direct hire, usually with a frank conversation about pay structure first.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "For technicians, the pay structure and the tool position matter more than the job description.",
      items: [
        "Flat rate, hourly or hybrid, and what a strong technician actually earns with you",
        "The work mix: diagnostics, maintenance, warranty, or a blend",
        "Whether tools are supplied, and any tool allowance",
        "Certification and state licence requirements",
        "Saturdays, and how the rota handles them",
        "For supplier roles, the shift pattern and the standard you are audited against",
      ],
    },
    faqs: [
      {
        q: "Can you find ASE certified technicians?",
        a: "Yes, and we verify certification at source. It is the hardest automotive hire in most markets, and we will be honest that it is a six week search rather than promise a fortnight.",
      },
      {
        q: "Do you staff both dealerships and suppliers?",
        a: "Yes. Retail service, parts and collision on one side, and OEM and tier supplier production, quality and logistics on the other. They are different screens and we run them differently.",
      },
      {
        q: "What about technician tools?",
        a: "We ask early whether a candidate owns their tools and what they are missing, because it is a genuine barrier to a start date that rarely appears in a job description.",
      },
      {
        q: "Can you support a recall campaign?",
        a: "Yes. Recall and campaign work is a common reason for temporary technician and support capacity, and it has a defined end date, which suits contract cover well.",
      },
      {
        q: "Why do technicians leave within a month?",
        a: "Pay structure, almost always. A flat rate technician who cannot produce hours in your shop will leave regardless of the hourly equivalent you quoted, so we set that expectation precisely before anyone accepts.",
      },
      {
        q: "What does it cost?",
        a: "Contract and temporary staff are an hourly rate covering pay, our employment costs and our margin. Permanent hires are a percentage of first year earnings. Both quoted before work starts.",
      },
    ],
    cta: {
      heading: "Bays standing empty?",
      body: "Tell us the certification level, the work mix and the pay structure. We will tell you honestly what the market looks like for it.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     SEMICONDUCTOR
     ══════════════════════════════════════════════════════════ */
  {
    slug: "semiconductor",
    meta: {
      title: "Semiconductor staffing",
      description:
        "Equipment technicians, process and yield engineers, metrology, test and cleanroom operations staff for fabs, OSATs and equipment suppliers.",
    },
    hero: {
      eyebrow: "Semiconductor",
      lead: "Tools running,",
      accent: "yield holding.",
      sub: "Equipment technicians, process and yield engineers, metrology, test and cleanroom operations. Ramp a new tool set, cover a shift pattern, or hire the engineer who owns a module.",
      photo: "industrySemiconductorHero",
      facts: [
        { figure: "6 functions", caption: "from equipment and process through metrology, test, facilities and operations" },
        { figure: "Tool specific", caption: "screened on the platforms you run, because tool experience does not transfer freely" },
        { figure: "Shift honest", caption: "compressed work weeks and night rotations confirmed before you meet anyone" },
      ],
    },
    overview: {
      heading: "Tool experience does not transfer as freely as resumes suggest.",
      paragraphs: [
        "We staff fabs, OSATs, equipment suppliers and materials companies: equipment maintenance, process engineering, metrology and yield, test and product engineering, facilities, and cleanroom operations.",
        "This is the most tool specific industry we recruit for. A technician who has maintained one vendor's etch platform is genuinely valuable and only partially transferable to another, and pretending otherwise wastes everybody's time.",
        "The second constraint is the shift. Compressed work weeks and night rotations are normal here and they narrow the field considerably, so we confirm tolerance before anyone is put forward.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "equipment",
        name: "Equipment maintenance",
        photo: "/photos/roles/semiconductor-equipment.jpg",
        photoAlt: "An equipment technician servicing a process tool in a cleanroom",
        builds: "Preventive maintenance, corrective repair, qualification after PM, and the uptime a module is measured on.",
        seniority: "Equipment technician through to lead technician",
        tools: ["Applied Materials", "Lam Research", "ASML", "KLA", "TEL platforms"],
        standards: ["Cleanroom protocol", "Lockout tagout", "Chemical and gas handling"],
      },
      {
        id: "process",
        name: "Process engineering",
        photo: "/photos/roles/semiconductor-process.jpg",
        photoAlt: "A process engineer reviewing a wafer map beside a tool",
        builds: "Recipe development, process control, excursion response and the SPC charts nobody wants to see move.",
        seniority: "Process engineer through to module owner",
        tools: ["JMP", "SPC platforms", "Recipe management", "FDC systems"],
        standards: ["Statistical process control", "Change control", "Excursion procedure"],
      },
      {
        id: "metrology",
        name: "Metrology and yield",
        photo: "/photos/roles/semiconductor-metrology.jpg",
        photoAlt: "A metrology technician loading a wafer cassette into an inspection tool",
        builds: "Measurement, defect inspection, yield analysis and finding the signal that explains a drop.",
        seniority: "Metrology technician through to yield engineer",
        tools: ["KLA inspection", "SEM", "Defect analysis platforms", "JMP"],
        standards: ["Gauge capability", "Sampling plans", "Yield reporting"],
      },
      {
        id: "test",
        name: "Test and product engineering",
        photo: "/photos/roles/semiconductor-test.jpg",
        photoAlt: "A test engineer examining a chip at a probe station",
        builds: "Test programmes, characterisation, failure analysis and the correlation between a wafer and a spec sheet.",
        seniority: "Test technician through to product engineer",
        tools: ["ATE platforms", "Test program environments", "Failure analysis tooling"],
        standards: ["Test coverage", "Correlation practice", "Data retention"],
      },
      {
        id: "facilities",
        name: "Facilities and sub fab",
        photo: "/photos/roles/semiconductor-facilities.jpg",
        photoAlt: "A facilities technician checking a gas manifold in the sub fab",
        builds: "Gas and chemical delivery, vacuum, water, abatement and the systems a fab cannot run ten minutes without.",
        seniority: "Facilities technician through to facilities supervisor",
        tools: ["BMS platforms", "Gas and chemical delivery systems", "Vacuum systems"],
        standards: ["SEMI S2 awareness", "Permit to work", "Emergency response"],
      },
      {
        id: "cleanroom-ops",
        name: "Cleanroom operations",
        photo: "/photos/roles/semiconductor-cleanroom-ops.jpg",
        photoAlt: "A cleanroom operator carrying a wafer carrier along a tool aisle",
        builds: "Wafer handling, lot movement, gowning discipline and the routine that protects a batch worth more than the building.",
        seniority: "Operator through to shift lead",
        tools: ["MES", "Lot tracking", "Automated material handling"],
        standards: ["ISO 14644 cleanroom class", "Gowning protocol", "ESD control"],
      },
    ],
    stack: {
      heading: "What we recruit against.",
      intro:
        "Tool platform, module and shift. Those three questions decide almost every semiconductor shortlist we build.",
      groups: [
        { name: "Equipment platforms", items: ["Applied Materials", "Lam Research", "ASML", "KLA", "TEL", "Axcelis", "Nova"] },
        { name: "Process areas", items: ["Etch", "Litho", "Deposition", "CMP", "Implant", "Diffusion", "Wet clean"] },
        { name: "Analysis", items: ["JMP", "SPC", "FDC", "SEM", "Defect inspection", "MES"] },
        { name: "Standards", items: ["ISO 14644", "SEMI S2", "ESD control", "Gowning protocol", "Chemical and gas safety"] },
      ],
    },
    screening: {
      heading: "How we screen for a fab.",
      intro:
        "Semiconductor screening is narrow and specific by necessity. Broad questions produce broad shortlists, which in this industry means useless ones.",
      steps: [
        {
          title: "Platform and module named",
          body: "Which vendor, which tool, which process module and at what node. This is the question that decides the shortlist.",
        },
        {
          title: "Depth established",
          body: "Preventive maintenance only, corrective repair, or qualification after PM. Three very different technicians share one job title.",
        },
        {
          title: "Shift tolerance confirmed",
          body: "Compressed work weeks, twelve hour rotations and nights. Confirmed with the candidate in writing, because it narrows the field more than any technical requirement.",
        },
        {
          title: "Cleanroom and safety readiness",
          body: "Gowning experience, ESD discipline, chemical and gas handling, and any medical or fit test requirement your site applies.",
        },
        {
          title: "A reference from a module or shift lead",
          body: "Somebody who saw their uptime and their qualification record, not a general supervisor.",
        },
      ],
    },
    pullQuote:
      "Which vendor, which tool, which module, which node. Four questions that decide a semiconductor shortlist before experience is even discussed.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a guarantee.",
      rows: [
        { role: "Cleanroom operators", market: "Available near established fab clusters, thin everywhere else.", timeline: "One to two weeks" },
        { role: "Facilities and sub fab technicians", market: "Tight, and competing directly with data centre demand for the same people.", timeline: "Three to four weeks" },
        { role: "Metrology technicians", market: "Tight. Platform specific experience narrows it quickly.", timeline: "Three to four weeks" },
        { role: "Process engineers", market: "Competitive, and node and module specific.", timeline: "Four to six weeks" },
        { role: "Test and product engineers", market: "Tight, particularly with ATE programme experience.", timeline: "Four to six weeks" },
        { role: "Equipment technicians on specific platforms", market: "The hardest semiconductor hire we run, and the market is national rather than local.", timeline: "Six weeks and up" },
      ],
      note: "Relocation is normal in this industry rather than exceptional. If the package does not allow for it, the search is limited to a local population that is usually already employed by your neighbour.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Semiconductor demand is driven by ramps, tool installs and shift coverage.",
      options: [
        {
          name: "Tool install and ramp",
          covers: "Technicians and engineers against an install and qualification schedule.",
          fits: "New tool sets, a fab expansion, a node transition.",
          shape: "Contract for the ramp, with the option to convert the ones you want to keep.",
        },
        {
          name: "Shift coverage",
          covers: "Filling a rotation that has to be staffed around the clock.",
          fits: "Compressed work weeks, night crews, leave cover on a critical module.",
          shape: "Contract or contract-to-hire, with shift tolerance confirmed up front.",
        },
        {
          name: "The permanent hire",
          covers: "The engineer or technician who owns a module.",
          fits: "Process engineers, yield engineers, senior equipment technicians.",
          shape: "Direct hire, usually with relocation in the package.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "Four specifics here are worth more than a full job description.",
      items: [
        "The tool vendor and platform, and the process module",
        "The node, and whether experience at an adjacent node is acceptable",
        "The shift pattern, including compressed weeks and night rotations",
        "Whether relocation is supported, and to what level",
        "Cleanroom class, gowning and any medical or fit test requirement",
        "The rate or salary band, benchmarked against the national market rather than the local one",
      ],
    },
    faqs: [
      {
        q: "How specific do you need the requirement to be?",
        a: "Very. Vendor, platform, module and node. Semiconductor is the most tool specific industry we recruit for, and a general requirement produces a general shortlist, which here means an unusable one.",
      },
      {
        q: "Does equipment experience transfer between vendors?",
        a: "Partially, and less than resumes imply. A strong technician can cross platforms with time, but if your ramp cannot absorb that learning curve then the requirement needs to say so.",
      },
      {
        q: "Can you support a tool install and ramp?",
        a: "Yes. Contract technicians and engineers against an install and qualification schedule is one of the most common arrangements, and the good ones can convert afterwards.",
      },
      {
        q: "What about relocation?",
        a: "It is normal in this industry rather than exceptional. A package with no relocation restricts the search to a local population that your neighbours have usually already hired.",
      },
      {
        q: "Do you staff cleanroom operators as well as engineers?",
        a: "Yes, and operations staffing at volume is a large part of it. Gowning discipline and shift tolerance are screened explicitly, because both cause early attrition.",
      },
      {
        q: "What does it cost?",
        a: "Contract staff are an hourly rate covering pay, our employment costs and our margin. Permanent hires are a percentage of first year salary. Both quoted before any work starts.",
      },
    ],
    cta: {
      heading: "Ramping a tool set?",
      body: "Tell us the vendor, the module, the node and the shift. The more specific the brief, the shorter the search.",
    },
  },

  /* ══════════════════════════════════════════════════════════
     TELECOMMUNICATIONS
     ══════════════════════════════════════════════════════════ */
  {
    slug: "telecommunications",
    meta: {
      title: "Telecommunications staffing",
      description:
        "Network engineers, field and installation technicians, NOC staff, fibre splicers and RF specialists, screened on certification and the plant you actually run.",
    },
    hero: {
      eyebrow: "Telecommunications",
      lead: "Networks built,",
      accent: "faults cleared.",
      sub: "Network engineering, field installation, NOC operations, fibre and outside plant, RF and structured cabling. A build programme, a shift rota, or the engineer who owns the core.",
      photo: "industryTelecomHero",
      facts: [
        { figure: "6 functions", caption: "from core engineering and the NOC through field, fibre, RF and cabling" },
        { figure: "Certification verified", caption: "vendor certifications and safety qualifications checked before mobilisation" },
        { figure: "Build or run", caption: "programme crews for a rollout, or permanent staff for the network you keep" },
      ],
    },
    overview: {
      heading: "Build teams and run teams are different hires.",
      paragraphs: [
        "We staff carriers, ISPs, MSOs, tower and infrastructure companies and enterprise network teams: engineering, field and installation, network operations, fibre and outside plant, RF and wireless, and structured cabling.",
        "The most useful distinction in telecom staffing is build against run. A splicer on a rollout and a NOC engineer holding an SLA are both essential and almost never the same person.",
        "Both are certification led and safety led. Vendor certifications, tower and height qualifications and driving records decide who can mobilise, and we check them before anybody is scheduled.",
      ],
    },
    disciplinesLabel: "Functions",
    disciplinesHeading: "What we actually recruit for.",
    disciplines: [
      {
        id: "network-engineering",
        name: "Network engineering",
        photo: "/photos/roles/telecommunications-network-engineering.jpg",
        photoAlt: "A network engineer configuring switches in a rack",
        builds: "Routing and switching design, changes, migrations and the maintenance window that has to finish before six.",
        seniority: "Network engineer through to network architect",
        tools: ["Cisco", "Juniper", "Arista", "BGP and OSPF", "MPLS", "SD-WAN"],
        standards: ["Change management", "Configuration standards", "Maintenance window discipline"],
      },
      {
        id: "noc",
        name: "Network operations",
        photo: "/photos/roles/telecommunications-noc.jpg",
        photoAlt: "A network operations technician monitoring a network map",
        builds: "Monitoring, incident response, escalation and the ticket queue that never quite empties.",
        seniority: "NOC technician through to NOC shift lead",
        tools: ["OSS and BSS platforms", "SolarWinds", "Ticketing systems", "Monitoring stacks"],
        standards: ["SLA management", "Incident and escalation procedure", "Shift handover"],
      },
      {
        id: "field",
        name: "Field and installation",
        photo: "/photos/roles/telecommunications-field.jpg",
        photoAlt: "An installation technician connecting a router in a customer's home",
        builds: "Customer installs, service calls, CPE, testing and the appointment window a customer is waiting in.",
        seniority: "Installation technician through to field supervisor",
        tools: ["Test meters", "Handheld work management", "CPE platforms"],
        standards: ["Driving record requirements", "Safety qualifications", "Install quality standards"],
      },
      {
        id: "fibre",
        name: "Fibre and outside plant",
        photo: "/photos/roles/telecommunications-fibre.jpg",
        photoAlt: "A fibre technician splicing at an outdoor work table",
        builds: "Splicing, testing, restoration and the OSP work that happens in the weather rather than in a building.",
        seniority: "Fibre technician through to OSP supervisor",
        tools: ["Fusion splicers", "OTDR", "Light source and power meter", "GIS records"],
        standards: ["Splice loss standards", "Traffic control awareness", "Locate and permit procedures"],
      },
      {
        id: "rf",
        name: "RF and wireless",
        photo: "/photos/roles/telecommunications-rf.jpg",
        photoAlt: "An RF technician checking a reading at the base of a tower",
        builds: "Site work, antenna and radio installation, integration, optimisation and drive testing.",
        seniority: "RF technician through to RF engineer",
        tools: ["Sweep and PIM testers", "Drive test tools", "Vendor radio platforms"],
        standards: ["Tower climbing and rescue qualifications", "RF safety awareness", "Site access requirements"],
      },
      {
        id: "cabling",
        name: "Structured cabling",
        photo: "/photos/roles/telecommunications-cabling.jpg",
        photoAlt: "A cabling technician terminating cables on a patch panel",
        builds: "Copper and fibre infrastructure inside buildings, racks, terminations, labelling and certification testing.",
        seniority: "Cabling technician through to project lead",
        tools: ["Certification testers", "Termination tooling", "Rack and pathway systems"],
        standards: ["BICSI practices", "TIA standards", "As built documentation"],
      },
    ],
    stack: {
      heading: "What we verify and recruit against.",
      intro:
        "Certification and safety qualification decide who can be scheduled. Both are checked before anyone is put on a job.",
      groups: [
        { name: "Network platforms", items: ["Cisco", "Juniper", "Arista", "Nokia", "Ciena", "SD-WAN platforms"] },
        { name: "Protocols and technologies", items: ["BGP", "OSPF", "MPLS", "DWDM", "PON and GPON", "5G and LTE"] },
        { name: "Field tooling", items: ["Fusion splicer", "OTDR", "Sweep and PIM testers", "Certification testers"] },
        { name: "Certifications we verify", items: ["CCNA and CCNP", "JNCIA", "BICSI", "Tower climbing and rescue", "OSHA 10 and 30", "Driving record"] },
      ],
    },
    screening: {
      heading: "How we screen telecom staff.",
      intro:
        "The first question is always build or run, because it changes everything that follows: the certification, the schedule, the pay structure and the kind of person who lasts.",
      steps: [
        {
          title: "Build or run, established first",
          body: "A rollout crew and a NOC rota need different people. Getting this wrong produces technically strong candidates who leave within a quarter.",
        },
        {
          title: "Plant and platform confirmed",
          body: "Which vendors, which technologies, aerial or underground, PON or point to point. Specifics narrow the shortlist usefully.",
        },
        {
          title: "Certification and safety verified",
          body: "Vendor certifications, tower and rescue qualifications, OSHA cards and the driving record, before anybody is scheduled.",
        },
        {
          title: "Schedule reality",
          body: "On call rotations, storm response, overnight maintenance windows and travel. Said plainly, because these are what people actually leave over.",
        },
        {
          title: "A reference from a supervisor",
          body: "Someone who can speak to quality of work and to how they behaved at four in the morning during a restoration.",
        },
      ],
    },
    pullQuote:
      "Build or run is the first question in telecom hiring. Answer it wrongly and you will hire a very good person for the wrong job.",
    market: {
      heading: "Where the market is actually tight.",
      intro: "What our recruiters see running these searches. Experience rather than a guarantee.",
      rows: [
        { role: "NOC technicians", market: "Available, though night rotations narrow the field.", timeline: "One to two weeks" },
        { role: "Structured cabling", market: "Available, and scalable for a building programme.", timeline: "About a week" },
        { role: "Installation technicians", market: "Steady. Driving record and clean background gate more starts than skill does.", timeline: "One to two weeks" },
        { role: "Network engineers", market: "Competitive. Genuine BGP and MPLS depth is scarcer than certifications imply.", timeline: "Three to four weeks" },
        { role: "Fibre splicers", market: "Tight nearly everywhere, and rollout programmes compete for the same people.", timeline: "Four to six weeks" },
        { role: "Tower climbers and RF technicians", market: "The hardest telecom hire we run. Certification, medical and safety requirements shrink the pool sharply.", timeline: "Six weeks and up" },
      ],
      note: "Rollout programmes bid for the same regional crews at the same time. Staffing plans that start when the award lands are already competing from behind.",
    },
    engagements: {
      heading: "Three shapes this usually takes.",
      intro: "Telecom demand is either a programme with an end date or a rota that never ends.",
      options: [
        {
          name: "Programme crews",
          covers: "Field and fibre crews against a build schedule.",
          fits: "A fibre rollout, a site upgrade programme, a cabling project, a migration.",
          shape: "Contract for the programme, mobilised with certifications verified in advance.",
        },
        {
          name: "Rota cover",
          covers: "Keeping a NOC or field rota staffed.",
          fits: "On call rotations, night shifts, storm response, leave cover.",
          shape: "Contract or contract-to-hire, with schedule tolerance confirmed first.",
        },
        {
          name: "The permanent hire",
          covers: "The engineers who own the network.",
          fits: "Network engineers and architects, NOC leads, RF engineers.",
          shape: "Direct hire, or contract-to-hire where on call tolerance needs proving.",
        },
      ],
    },
    brief: {
      heading: "What to have ready before you call.",
      intro: "Build or run, and the certification list. Everything else follows from those two.",
      items: [
        "Build or run, and the end date if there is one",
        "Vendors and technologies, including aerial or underground for outside plant",
        "Certifications and safety qualifications the work requires",
        "On call rotation, overnight windows and storm response expectations",
        "Travel percentage, per diem and whether a vehicle is provided",
        "The rate, benchmarked regionally, because crews follow programmes",
      ],
    },
    faqs: [
      {
        q: "Can you crew a fibre rollout?",
        a: "Yes, and the planning matters more than the sourcing. Rollout programmes in a region compete for the same crews at the same time, so a staffing plan that starts when the award lands is already behind.",
      },
      {
        q: "Do you verify tower climbing qualifications?",
        a: "Yes, along with rescue training, medical requirements and OSHA cards, before anybody is scheduled. Height work is the area where we are least willing to take a certificate at face value.",
      },
      {
        q: "What is the difference between build and run hiring?",
        a: "Almost everything. Build crews are mobile, programme paced and paid accordingly. Run teams hold an SLA on a rota, often overnight. Strong candidates for one are frequently wrong for the other.",
      },
      {
        q: "Can you staff a NOC around the clock?",
        a: "Yes. Night and weekend rotations are screened explicitly, because schedule tolerance rather than technical ability is what determines whether somebody lasts on a rota.",
      },
      {
        q: "Do you place enterprise network engineers as well as carrier staff?",
        a: "Yes. Enterprise routing and switching, SD-WAN and data centre networking, as well as carrier and service provider environments.",
      },
      {
        q: "What does it cost?",
        a: "Contract staff are an hourly rate covering pay, our employment costs and our margin, with per diem and vehicle arrangements handled separately where they apply. Permanent hires are a percentage of first year salary.",
      },
    ],
    cta: {
      heading: "Crewing a build?",
      body: "Tell us build or run, the plant and the certifications. We will tell you where the regional crews actually are.",
    },
  },

];

export function getIndustryPage(slug: string): IndustryPage | null {
  return INDUSTRY_PAGES.find((p) => p.slug === slug) ?? null;
}

/** Slugs that have a page. Passed to the explorer so it links only
    where a page actually exists. */
export const INDUSTRY_PAGE_SLUGS = INDUSTRY_PAGES.map((p) => p.slug);
