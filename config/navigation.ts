/* Navigation is DATA, not JSX.

   Six items and one button. "Hire Talent" is not a link — it opens
   the inquiry modal (see components/hire). Dropdowns are short and
   single-purpose; there is no mega menu. */

import { ALL_INDUSTRIES } from "./industries";
import { SERVICES } from "./services";

/* The five services, written once. `navLabel` keeps the ampersand
   that suits a dense menu; the prose form lives on `name`. */
const SERVICE_LINKS: NavLink[] = SERVICES.map((s) => ({
  label: s.navLabel,
  href: `/services/${s.slug}`,
  note: s.summary,
}));

export type NavLink = { label: string; href: string; note?: string };
export type NavItem = { label: string; href: string; children?: NavLink[] };

/* Every industry page, by name. The order is the client's: Information
   Technology, then the two specialist pages beside it, Oracle ERP
   Staffing and Azure Staffing (not industries, so they are named here
   rather than taken from ALL_INDUSTRIES), then Healthcare and
   Engineering, then the rest alphabetically. A new industry joins the
   alphabetical tail on its own. */
const INDUSTRY_LEAD = ["information-technology", "oracle-erp", "azure", "healthcare", "engineering"];
const INDUSTRY_PAGES_NAV: NavLink[] = [
  ...ALL_INDUSTRIES.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })),
  { label: "Oracle ERP Staffing", href: "/industries/oracle-erp" },
  { label: "Azure Staffing", href: "/industries/azure" },
];
const leadIndex = (l: NavLink) => INDUSTRY_LEAD.indexOf(l.href.replace("/industries/", ""));
const INDUSTRY_LINKS: NavLink[] = [
  ...INDUSTRY_LEAD.map((slug) => INDUSTRY_PAGES_NAV.find((l) => l.href === `/industries/${slug}`)!),
  ...INDUSTRY_PAGES_NAV.filter((l) => leadIndex(l) < 0).sort((a, b) => a.label.localeCompare(b.label)),
];

export const PRIMARY_NAV: NavItem[] = [
  {
    label: "Who We Help",
    href: "/hire-talent",
    children: [
      {
        label: "Employers",
        href: "/hire-talent",
        note: "Find the people your business needs",
      },
      {
        label: "Job seekers",
        href: "/candidates",
        note: "Find your next opportunity",
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: SERVICE_LINKS,
  },
  {
    label: "Industries",
    href: "/industries",
    children: INDUSTRY_LINKS,
  },
  { label: "Jobs", href: "/jobs" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
];

export const FOOTER_COLUMNS: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Employers",
    links: [
      { label: "Hire talent", href: "/hire-talent" },
      { label: "How it works", href: "/hire-talent#how-it-works" },
      { label: "Services", href: "/services" },
      { label: "Industries", href: "/industries" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Job seekers",
    links: [
      { label: "Browse jobs", href: "/jobs" },
      { label: "For job seekers", href: "/candidates" },
      { label: "Submit your resume", href: "/candidates#submit-resume" },
      { label: "Why Vertis", href: "/candidates#why" },
    ],
  },
  {
    heading: "Services",
    links: SERVICE_LINKS.map(({ label, href }) => ({ label, href })),
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Insights", href: "/insights" },
      { label: "Whitepapers", href: "/whitepapers" },
      { label: "Locations", href: "/contact#offices" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy", href: "/legal/privacy-policy" },
  { label: "Cookies", href: "/legal/cookie-policy" },
  { label: "Terms", href: "/legal/terms-of-use" },
  { label: "Candidate privacy", href: "/legal/candidate-privacy-notice" },
  { label: "Accessibility", href: "/legal/accessibility-statement" },
  { label: "EEO", href: "/legal/eeo-statement" },
];
