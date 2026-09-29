/* ============================================================
   INDUSTRIES

   Eighteen industries in four groups. This is the spine of the
   broad-staffing positioning: the grouping is what makes the range
   legible at a glance, and the per-industry `line` is what each
   industry page opens with.

   Slugs are stable: they become /industries/<slug>.

   Not offered, and therefore not listed anywhere on the site:
   construction, real estate, media and entertainment, nonprofit,
   logistics, legal, life sciences, creative, clerical, education,
   customer service.
   ============================================================ */

export type Industry = {
  slug: string;
  name: string;
  /** One line answering "what kind of people can you provide?" */
  line: string;
};

export type IndustryGroup = {
  id: string;
  name: string;
  /** The short, human framing used in the explorer. */
  tagline: string;
  industries: Industry[];
};

export const INDUSTRY_GROUPS: IndustryGroup[] = [
  {
    id: "business",
    name: "Business & Professional",
    tagline: "The people who run the office, and the public office.",
    industries: [
      {
        slug: "administrative",
        name: "Administrative",
        line: "Administrative assistants, receptionists, coordinators and office operations people.",
      },
      {
        slug: "financial-services",
        name: "Financial Services",
        line: "Accountants, analysts, bookkeepers, and operations staff for banks and lenders.",
      },
      {
        slug: "human-resources",
        name: "Human Resources",
        line: "Recruiters, HR coordinators, payroll and benefits specialists.",
      },
      {
        slug: "insurance",
        name: "Insurance",
        line: "Claims, underwriting support, policy servicing and administration.",
      },
      {
        slug: "marketing",
        name: "Marketing",
        line: "Marketing coordinators, content specialists, analysts and campaign managers.",
      },
      {
        slug: "sales",
        name: "Sales",
        line: "Inside sales, account managers, business development and sales support.",
      },
      {
        slug: "government",
        name: "Government",
        line: "Administrative, program support, IT and compliance staff for public agencies.",
      },
    ],
  },
  {
    id: "industrial",
    name: "Industrial & Operations",
    tagline: "The people who make things.",
    industries: [
      {
        slug: "manufacturing",
        name: "Manufacturing",
        line: "Machine operators, assemblers, quality inspectors, supervisors and engineers.",
      },
      {
        slug: "automotive",
        name: "Automotive",
        line: "Technicians, assembly, parts, service advisors and dealership staff.",
      },
      {
        slug: "industrial",
        name: "Industrial",
        line: "General labour, forklift operators, maintenance and plant staff.",
      },
    ],
  },
  {
    id: "service",
    name: "People & Service",
    tagline: "The people who look after people.",
    industries: [
      {
        slug: "healthcare",
        name: "Healthcare",
        line: "Nurses, medical assistants, technicians and the administrative staff who keep a clinic running.",
      },
      {
        slug: "hospitality",
        name: "Hospitality",
        line: "Front desk, housekeeping, food service, events and guest experience staff.",
      },
      {
        slug: "retail",
        name: "Retail",
        line: "Store associates, merchandisers, stock and seasonal staff, and store managers.",
      },
    ],
  },
  {
    id: "technology",
    name: "Technology & Engineering",
    tagline: "The people who build what's next.",
    industries: [
      {
        slug: "information-technology",
        name: "Information Technology",
        line: "Developers, cloud and data engineers, ERP consultants, and IT support and project staff.",
      },
      {
        slug: "engineering",
        name: "Engineering",
        line: "Mechanical, electrical and process engineers, designers and drafters.",
      },
      {
        slug: "semiconductor",
        name: "Semiconductor",
        line: "Process, test and equipment engineers, fab technicians and quality staff.",
      },
      {
        slug: "telecommunications",
        name: "Telecommunications",
        line: "Network engineers, field technicians, installers and NOC staff.",
      },
      {
        slug: "energy",
        name: "Energy",
        line: "Field technicians, engineers, safety and operations staff across power and utilities.",
      },
    ],
  },
];

export const ALL_INDUSTRIES: Industry[] = INDUSTRY_GROUPS.flatMap((g) => g.industries);
export const INDUSTRY_COUNT = ALL_INDUSTRIES.length;

/* ============================================================
   THE RANGE OF WORK: five levels, frontline to specialised.
   ============================================================ */
export const TALENT_LEVELS = [
  {
    id: "frontline",
    name: "Frontline & Operations",
    roles: "Warehouse, production line, janitorial, general labour, security",
  },
  {
    id: "skilled",
    name: "Skilled Trades",
    roles: "Electricians, welders, HVAC, CNC operators, maintenance",
  },
  {
    id: "administrative",
    name: "Administrative",
    roles: "Assistants, receptionists, coordinators, office operations",
  },
  {
    id: "professional",
    name: "Professional",
    roles: "Accountants, HR, marketing, sales, project managers",
  },
  {
    id: "specialized",
    name: "Specialised & Technical",
    roles: "Engineers, nurses, developers, data and cloud, semiconductor",
  },
] as const;
