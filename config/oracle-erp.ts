/* ============================================================
   ORACLE ERP STAFFING · /services/oracle-erp (the ERP service)

   A specialist page, listed under Services as "ERP", drawn by the
   shared SpecialistPage renderer. Its static route,
   app/services/oracle-erp, takes precedence over the [slug] service
   renderer. The old /industries/oracle-erp URL redirects here.

   Source: the client's "Oracle ERP Staffing Web Content" document.
   Everything here is taken from it or plainly derived from it. It
   carries no statistics, clients, certifications or partnerships,
   and neither may this page: no invented numbers, no market
   timelines, no claims about Oracle. Module and product names are
   role vocabulary, not claims about us.
   ============================================================ */

import type { Discipline, StackGroup } from "./industry-pages";
import type { SpecialistPage } from "./specialist-page";

export const ORACLE_ERP = {
  slug: "oracle-erp",
  hireContext: { industry: "information-technology", service: "Oracle ERP staffing" },
  jobsLabel: "View Oracle ERP jobs",
  meta: {
    title: "Oracle ERP staffing",
    description:
      "Oracle ERP specialists for transformation programs, critical workstreams, release cycles and steady-state operations: Fusion Financials, procurement and SCM, PPM and EPM, Oracle Integration Cloud, data migration, testing and program leadership.",
  },

  hero: {
    eyebrow: "Oracle ERP staffing",
    lead: "Put the right Oracle expertise",
    accent: "where the work is.",
    photo: "serviceContract",
    sub: "Oracle ERP specialists for transformation programs, critical workstreams, release cycles and steady-state operations, without waiting for the perfect full-time hire.",
    facts: [
      {
        figure: "Functional to technical",
        caption: "finance, supply chain and projects consultants alongside integration, data and testing talent",
      },
      {
        figure: "One specialist to a squad",
        caption: "close a single skill gap, reinforce an SI or internal team, or assemble a team around an outcome",
      },
      {
        figure: "Design to hypercare",
        caption: "capacity that reshapes as the program moves from build to testing, go-live and support",
      },
    ],
  },

  overview: {
    eyebrow: "The assignment",
    heading: "Oracle programs slow down when the skills arrive late.",
    paragraphs: [
      "They also slow down when functional and technical teams do not connect, or when experienced specialists are locked into the wrong capacity model.",
      "So we build staffing around the work that has to get done: the module, the milestone, the release or the operating outcome, rather than a job title.",
    ],
    values: [
      {
        name: "Faster capacity",
        body: "Proven Oracle skills in priority workstreams, without a long permanent hiring cycle.",
      },
      {
        name: "Better fit",
        body: "Experience matched to the actual module, phase, architecture, industry context and delivery need.",
      },
      {
        name: "Flexible scale",
        body: "Capacity added or reshaped as the program moves from design and build to testing, go-live and support.",
      },
    ],
    photo: "serviceProjectTeam",
    caption: "One specialist or a connected team, shaped around the work.",
  },

  talent: {
    eyebrow: "What we staff",
    heading: "From one critical specialist to a connected Oracle team.",
    intro:
      "Bring us in to close a specific skill gap, reinforce an existing SI or internal team, or assemble a dedicated squad around a defined outcome.",
    disciplines: [
      {
        id: "functional",
        name: "Functional specialists",
        photo: "/photos/roles/information-technology-erp.jpg",
        photoAlt: "An ERP consultant walking users through a configuration screen",
        builds:
          "Oracle Fusion consultants across Financials, Procurement, Project Portfolio Management and EPM, aligned to process design, configuration, controls, reporting, testing and adoption.",
        seniority: "Consultant through to Fusion Financials and workstream lead",
        tools: ["Fusion Financials", "Procurement", "PPM", "EPM", "Self-Service Procurement"],
        standards: ["Process design", "Configuration", "Controls", "Adoption"],
      },
      {
        id: "technical",
        name: "Technical and integration",
        photo: "/photos/roles/information-technology-cloud.jpg",
        photoAlt: "A technical specialist talking a colleague through an architecture diagram",
        builds:
          "Oracle Integration Cloud, APIs, extensions, workflows, security and reporting: the technical skills that connect the ERP to the wider enterprise.",
        seniority: "Integration developer through to Oracle technical architect",
        tools: ["OIC", "REST", "SOAP", "OTBI", "BI Publisher"],
        standards: ["Extensions", "Workflows", "Security", "Integration design"],
      },
      {
        id: "data",
        name: "Data, migration and reporting",
        photo: "/photos/roles/information-technology-data.jpg",
        photoAlt: "A data specialist working between a dashboard and a notebook",
        builds:
          "Profiling, cleansing, mapping, mock loads and cutover, and the reporting that turns migrated data into trusted management information.",
        seniority: "Conversion specialist through to data migration lead",
        tools: ["Data conversion", "Mock loads", "Reconciliation", "Financial reporting"],
        standards: ["Data cleansing", "Mapping", "Cutover", "Trusted MI"],
      },
      {
        id: "quality",
        name: "Quality, release and support",
        photo: "/photos/roles/information-technology-support.jpg",
        photoAlt: "An application support specialist helping a colleague at their desk",
        builds:
          "Oracle QA, test automation, UAT coordination, release assurance, hypercare and application support for go-live and quarterly cloud releases.",
        seniority: "Oracle tester through to test lead and support lead",
        tools: ["Test automation", "UAT", "Hypercare", "AMS"],
        standards: ["Release assurance", "Quarterly releases", "Regression"],
      },
      {
        id: "leadership",
        name: "Program and solution leadership",
        photo: "/photos/service-direct-hire.jpg",
        photoAlt: "A program lead talking a small team through the plan in an open office",
        builds:
          "Solution architects, workstream leads, PMO and program leaders who align business decisions, dependencies, delivery governance and executive visibility.",
        seniority: "Workstream lead through to solution architect and program manager",
        tools: ["Solution architecture", "PMO", "Workstream leadership"],
        standards: ["Delivery governance", "Dependencies", "Executive visibility"],
      },
    ] satisfies Discipline[],
  },

  scope: {
    eyebrow: "Oracle talent scope",
    heading: "The roles that turn an ERP roadmap into working operations.",
    intro:
      "The vocabulary an Oracle brief is written in. Tell us which of these you need, at what seniority, and we will tell you how we would staff it.",
    groups: [
      {
        name: "Finance and accounting",
        items: [
          "Fusion Financials lead or consultant",
          "GL, AP, AR, FA",
          "Cash Management",
          "Tax, expenses, controls and close",
          "OTBI and BI Publisher reporting",
        ],
      },
      {
        name: "Procurement and supply",
        items: [
          "Procurement and purchasing consultant",
          "Supplier management and sourcing",
          "Self-Service Procurement",
          "Approval and workflow specialists",
        ],
      },
      {
        name: "Projects and EPM",
        items: [
          "Project Financial Management (PPM)",
          "Planning and budgeting",
          "Consolidation and close",
          "Forecasting and management reporting",
        ],
      },
      {
        name: "Technical and integration",
        items: [
          "Oracle Integration Cloud (OIC)",
          "REST, SOAP and APIs",
          "Extensions, workflows and security",
          "Oracle technical architects",
        ],
      },
      {
        name: "Data and quality",
        items: [
          "Data migration and conversion leads",
          "Data cleansing and reconciliation",
          "Oracle QA and test leads",
          "UAT, cutover and release assurance",
        ],
      },
      {
        name: "Leadership and operations",
        items: [
          "Oracle solution architects",
          "Program and project managers",
          "PMO and workstream leads",
          "AMS, hypercare and release support",
        ],
      },
    ] satisfies StackGroup[],
  },

  pullQuote:
    "The talent model should accelerate the program, not add another dependency.",

  path: {
    eyebrow: "Staffing path",
    heading: "A clear sequence. No CV theatre.",
    intro:
      "Start with the outcome and the delivery context. Define the skills that matter, validate for real Oracle experience, and keep the staffing model accountable after onboarding.",
    steps: [
      {
        title: "Define",
        body: "The workstream, modules, outcomes, seniority, location, duration and delivery constraints.",
      },
      {
        title: "Match",
        body: "Profiles identified against functional depth, technical capability, release experience and team fit.",
      },
      {
        title: "Validate",
        body: "Structured screening for hands-on Oracle expertise, communication, delivery judgment and role-specific capability.",
      },
      {
        title: "Deploy",
        body: "Onboarding, access, handover and objectives coordinated, and the person integrated with your own or your SI's delivery model.",
      },
      {
        title: "Scale",
        body: "Performance and capacity reviewed, and the team extended, replaced or reshaped as program priorities change.",
      },
    ],
  },

  /* Replaces the market timeline table the other industry pages carry.
     The source gives no timelines, so this shows where in the program
     each kind of talent is needed instead, all of it from the source. */
  lifecycle: {
    eyebrow: "Across the lifecycle",
    heading: "Capacity for every phase, not only go-live.",
    intro:
      "The skills a program needs change as it moves from design and build to testing, go-live and support. The staffing should change with it.",
    stages: [
      {
        name: "Design and build",
        body: "Functional consultants for process design and configuration, solution architects, and integration and extension developers.",
      },
      {
        name: "Data and migration",
        body: "Data leads and conversion specialists for profiling, cleansing, mapping and mock loads.",
      },
      {
        name: "Testing",
        body: "Oracle QA and test leads, test automation and UAT coordination.",
      },
      {
        name: "Cutover and go-live",
        body: "Cutover, reconciliation and release assurance, then hypercare once the system is live.",
      },
      {
        name: "Releases and support",
        body: "Release assurance for quarterly cloud updates, application support and AMS for steady-state operations.",
      },
    ],
    note: "Program leadership, PMO and workstream leads run across every phase.",
  },

  engagements: {
    eyebrow: "Engagement models",
    heading: "Use the capacity model that fits the work.",
    intro: "Four ways in. Most programs use more than one before they are done.",
    options: [
      {
        name: "Staff augmentation",
        body: "Individual Oracle specialists added to your internal, partner or SI-led program.",
      },
      {
        name: "Dedicated squads",
        body: "A connected team assembled around a module, release, migration, testing or support outcome.",
      },
      {
        name: "Contract-to-hire",
        body: "Critical talent evaluated in delivery before a long-term hiring decision, where appropriate.",
      },
      {
        name: "Fractional leadership",
        body: "Senior Oracle architecture or program leadership when you need the experience without a full-time executive layer.",
      },
    ],
  },

  brief: {
    eyebrow: "Start with the gap",
    heading: "Need Oracle capacity for a live program, a critical release or the work after go-live?",
    intro:
      "Tell us the module, skill, location, seniority and timing. We will give you a direct read on the likely talent model and the profiles needed to move the work forward.",
    items: [
      "The workstream and the Oracle modules in scope",
      "The outcome or milestone the person or team is there to deliver",
      "Functional, technical or both, and the seniority you need",
      "Location, and whether the work is on site, hybrid or remote",
      "Start date and expected duration",
      "Who else is delivering: an internal team, a partner or an SI",
    ],
  },

  /* The secondary path. There is no live Oracle vacancy feed, so each
     area registers interest through the resume form, pre-filled, the
     same way the job listings do. */
  candidates: {
    eyebrow: "For Oracle professionals",
    heading: "Work in Oracle ERP? Tell us where you fit.",
    body: "We staff Oracle specialists into transformation programs, release cycles and steady-state operations. Pick the area closest to your experience to register interest, and a recruiter will come back to you with what is actually open.",
    roles: [
      { title: "Oracle Fusion Financials consultant", area: "Finance and accounting" },
      { title: "Oracle Procurement and SCM consultant", area: "Procurement and supply" },
      { title: "Oracle PPM and EPM consultant", area: "Projects and EPM" },
      { title: "Oracle Integration Cloud developer", area: "Technical and integration" },
      { title: "Oracle data migration specialist", area: "Data and quality" },
      { title: "Oracle QA and test lead", area: "Data and quality" },
      { title: "Oracle solution architect", area: "Leadership" },
      { title: "Oracle AMS and release support", area: "Operations" },
    ],
  },

  faqs: [
    {
      q: "Can you work alongside our systems integrator?",
      a: "Yes. We add individual specialists to internal, partner or SI-led programs, or reinforce a team that is already in place, and we coordinate onboarding, access and handover with the delivery model you run.",
    },
    {
      q: "Can we start with one specialist and grow the team later?",
      a: "Yes. Many engagements start with a single critical gap. Capacity can then be added or reshaped as the program moves from design and build to testing, go-live and support.",
    },
    {
      q: "How do you check that someone really has Oracle experience?",
      a: "Through structured screening for hands-on Oracle expertise, communication, delivery judgment and role-specific capability, matched against the module, phase and release experience the role actually needs.",
    },
    {
      q: "Do you staff after go-live?",
      a: "Yes. Hypercare, application support and release assurance for quarterly cloud releases are part of what we staff, alongside program delivery.",
    },
    {
      q: "What if we need senior leadership but not a full-time hire?",
      a: "Fractional leadership gives you senior Oracle architecture or program leadership without adding a full-time executive layer.",
    },
    {
      q: "Can a contractor become a permanent hire?",
      a: "Where it is appropriate, contract-to-hire lets you evaluate critical talent in delivery before you make a long-term hiring decision.",
    },
  ],

  cta: {
    heading: "Tell us what you need to staff.",
    body: "Start with a short note. We will align the Oracle skills, the team shape and the engagement model to the work in front of you.",
  },
} satisfies SpecialistPage;
