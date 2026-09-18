/* ============================================================
   JOBS

   Representative roles, not a live vacancy feed. They exist so a
   visitor can see the shape and range of what we fill, and so the
   jobs page is a real page rather than a placeholder.

   IMPORTANT: because these are examples rather than open vacancies,
   the page says so plainly and every action is "register interest"
   rather than "apply for this job". Nobody should believe they have
   applied to a specific opening that does not exist. When the live
   feed is connected, replace JOBS, drop `SAMPLE_NOTICE`, and change
   the card action to a real application link.

   `industry` is a slug from config/industries.ts and `level` an id
   from TALENT_LEVELS, so the filters stay in step with the rest of
   the site.
   ============================================================ */

export type JobType = "temporary" | "contract" | "contract-to-hire" | "direct-hire";

export const JOB_TYPES: { id: JobType; label: string; service: string }[] = [
  { id: "temporary", label: "Temporary", service: "temporary-staffing" },
  { id: "contract", label: "Contract", service: "contract-staffing" },
  { id: "contract-to-hire", label: "Contract-to-hire", service: "contract-to-hire" },
  { id: "direct-hire", label: "Permanent", service: "direct-hire" },
];

export type Job = {
  id: string;
  title: string;
  /** Industry slug from config/industries.ts */
  industry: string;
  /** Talent level id from TALENT_LEVELS */
  level: string;
  type: JobType;
  location: string;
  /** On site, hybrid or remote. */
  arrangement: string;
  /** ISO date the role was listed. */
  posted: string;
  summary: string;
};

export const SAMPLE_NOTICE =
  "These are representative of the roles we fill rather than a live vacancy list. Tell us what you are looking for and a recruiter will come back to you with what is actually open.";

export const JOBS: Job[] = [
  {
    id: "rn-med-surg-charlotte",
    title: "Registered Nurse, Med/Surg",
    industry: "healthcare",
    level: "specialized",
    type: "contract",
    location: "Charlotte, NC",
    arrangement: "On site, nights",
    posted: "2026-09-05",
    summary:
      "Thirteen week contracts on a med/surg floor, three twelves, with the option to extend or convert.",
  },
  {
    id: "accounts-payable-specialist",
    title: "Accounts Payable Specialist",
    industry: "financial-services",
    level: "professional",
    type: "contract-to-hire",
    location: "Dallas, TX",
    arrangement: "Hybrid, three days on site",
    posted: "2026-09-04",
    summary:
      "High volume invoice processing for a growing finance team, with a permanent seat at the end of the contract.",
  },
  {
    id: "executive-assistant",
    title: "Executive Assistant",
    industry: "administrative",
    level: "administrative",
    type: "direct-hire",
    location: "Chicago, IL",
    arrangement: "On site",
    posted: "2026-09-03",
    summary:
      "Supporting two executives: diaries, travel, board papers and the hundred things that keep a week upright.",
  },
  {
    id: "senior-software-engineer",
    title: "Senior Software Engineer",
    industry: "information-technology",
    level: "specialized",
    type: "direct-hire",
    location: "Remote, United States",
    arrangement: "Remote",
    posted: "2026-09-02",
    summary:
      "Backend work on a platform team, with real ownership and a hiring manager who interviews properly.",
  },
  {
    id: "hr-coordinator",
    title: "HR Coordinator",
    industry: "human-resources",
    level: "administrative",
    type: "contract-to-hire",
    location: "Austin, TX",
    arrangement: "Hybrid",
    posted: "2026-09-02",
    summary:
      "Onboarding, records and first line questions for a people team that is growing faster than its processes.",
  },
  {
    id: "claims-adjuster",
    title: "Claims Adjuster",
    industry: "insurance",
    level: "professional",
    type: "direct-hire",
    location: "Phoenix, AZ",
    arrangement: "Hybrid",
    posted: "2026-09-01",
    summary: "Property claims end to end, for a carrier that trains its adjusters rather than churning them.",
  },
  {
    id: "production-supervisor",
    title: "Production Supervisor",
    industry: "manufacturing",
    level: "skilled",
    type: "direct-hire",
    location: "Greenville, SC",
    arrangement: "On site, second shift",
    posted: "2026-09-01",
    summary: "Running a shift of twenty two on a packaging line, with real authority over scheduling and quality.",
  },
  {
    id: "warehouse-associate",
    title: "Warehouse Associate",
    industry: "industrial",
    level: "frontline",
    type: "temporary",
    location: "Columbus, OH",
    arrangement: "On site, day shift",
    posted: "2026-08-31",
    summary: "Picking, packing and put away through a seasonal peak. Weekly pay, and the good ones get kept.",
  },
  {
    id: "field-service-technician",
    title: "Field Service Technician",
    industry: "energy",
    level: "skilled",
    type: "direct-hire",
    location: "Denver, CO",
    arrangement: "Field based, regional",
    posted: "2026-08-30",
    summary: "Preventive maintenance and callouts across a regional territory, van and tools provided.",
  },
  {
    id: "marketing-coordinator",
    title: "Marketing Coordinator",
    industry: "marketing",
    level: "professional",
    type: "contract",
    location: "Remote, United States",
    arrangement: "Remote",
    posted: "2026-08-29",
    summary: "Six month cover for a campaign team: email, events and the calendar that holds it all together.",
  },
  {
    id: "guest-services-associate",
    title: "Guest Services Associate",
    industry: "hospitality",
    level: "frontline",
    type: "temporary",
    location: "Orlando, FL",
    arrangement: "On site, shifts including weekends",
    posted: "2026-08-29",
    summary: "Front desk and guest experience through a busy season, with shifts that can work around study.",
  },
  {
    id: "mechanical-design-engineer",
    title: "Mechanical Design Engineer",
    industry: "engineering",
    level: "specialized",
    type: "contract",
    location: "Grand Rapids, MI",
    arrangement: "Hybrid, two days on site",
    posted: "2026-09-06",
    summary:
      "Twelve month programme on a new product line: concept through detailed design, working to the client's own standards.",
  },
  {
    id: "project-engineer-houston",
    title: "Project Engineer",
    industry: "engineering",
    level: "professional",
    type: "direct-hire",
    location: "Houston, TX",
    arrangement: "On site",
    posted: "2026-09-04",
    summary:
      "Owning capital projects end to end for a growing operations team, with real budget authority from day one.",
  },
  {
    id: "process-engineer-fab",
    title: "Process Engineer",
    industry: "semiconductor",
    level: "specialized",
    type: "contract",
    location: "Chandler, AZ",
    arrangement: "On site",
    posted: "2026-08-28",
    summary: "Etch process support on a twelve month programme, working alongside the client's own engineers.",
  },
  {
    id: "network-engineer",
    title: "Network Engineer",
    industry: "telecommunications",
    level: "specialized",
    type: "contract-to-hire",
    location: "Atlanta, GA",
    arrangement: "Hybrid",
    posted: "2026-08-27",
    summary: "Core network changes and escalations, with a permanent offer at the end if both sides are happy.",
  },
  {
    id: "inside-sales-representative",
    title: "Inside Sales Representative",
    industry: "sales",
    level: "professional",
    type: "direct-hire",
    location: "Tampa, FL",
    arrangement: "Hybrid",
    posted: "2026-08-26",
    summary: "Warm pipeline, a real product and a comp plan that pays for the work you actually do.",
  },
];

export function getJobs(): Job[] {
  return [...JOBS].sort((a, b) => (a.posted < b.posted ? 1 : -1));
}

export function jobTypeLabel(type: JobType) {
  return JOB_TYPES.find((t) => t.id === type)?.label ?? type;
}

export function formatPosted(iso: string) {
  const days = Math.round((Date.now() - new Date(`${iso}T00:00:00Z`).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 14) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  return weeks < 9 ? `${weeks} weeks ago` : "Over two months ago";
}
