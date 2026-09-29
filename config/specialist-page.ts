/* ============================================================
   SPECIALIST STAFFING PAGES

   The shape behind /services/oracle-erp (ERP) and /services/azure
   (Cloud): a specialist talent market offered as a service. One
   renderer,
   components/industries/SpecialistPage.tsx, draws every page from
   this shape, so the pages share a flow and a look and differ only
   in content.

   Each page has its own static route under app/services/<slug>,
   which takes precedence over the [slug] service renderer, and is
   listed in SERVICE_LIST in config/services.ts. The old
   /industries/<slug> URLs redirect to them (next.config.ts).

   Rules, as for industry pages: every line comes from the client's
   source document or plainly from it. No invented statistics,
   clients, certifications held by us, partnerships or timelines.
   Product names are role vocabulary, not claims about us.
   ============================================================ */

import type { PhotoId } from "./photography";
import type { Discipline, StackGroup } from "./industry-pages";

export type SpecialistPage = {
  slug: string;
  meta: { title: string; description: string };
  /** Tags every lead sent from the page, so the inbox knows where it came from. */
  hireContext: { industry: string; service: string };
  /** The secondary call to action, e.g. "View Azure jobs". */
  jobsLabel: string;
  hero: {
    eyebrow: string;
    lead: string;
    accent: string;
    sub: string;
    photo: PhotoId;
    facts: { figure: string; caption: string }[];
  };
  overview: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    /** Three or six; the grid runs in threes. */
    values: { name: string; body: string }[];
    photo: PhotoId;
    caption: string;
  };
  talent: {
    eyebrow: string;
    heading: string;
    intro: string;
    disciplines: Discipline[];
    /** Overrides the panel's "Tools" and "Standards" labels. */
    labels?: { tools?: string; standards?: string };
  };
  scope: { eyebrow: string; heading: string; intro: string; groups: StackGroup[] };
  pullQuote: string;
  path: { eyebrow: string; heading: string; intro: string; steps: { title: string; body: string }[] };
  /** Up to five stages read as a timeline; more become a grid, since a
      longer list is rarely one sequence. */
  lifecycle: {
    eyebrow: string;
    heading: string;
    intro: string;
    stages: { name: string; body: string }[];
    note?: string;
  };
  engagements: { eyebrow: string; heading: string; intro: string; options: { name: string; body: string }[] };
  brief: { eyebrow: string; heading: string; intro: string; items: string[] };
  candidates: {
    eyebrow: string;
    heading: string;
    body: string;
    roles: { title: string; area: string }[];
  };
  faqs: { q: string; a: string }[];
  cta: { heading: string; body: string };
};
