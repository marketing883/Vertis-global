import { INSIGHT_CATEGORIES } from "@/config/insights";
import { ALL_INDUSTRIES } from "@/config/industries";

/* ============================================================
   CONTENT TYPES

   One definition per kind of content the admin manages. The admin
   list and editor (app/admin/(content)/[section]) and the public
   pages both read from here, so a field added here appears in the
   editor and is stored in the item's `data` JSON automatically.

   The admin paths match ACI's (/admin/case-studies, /admin/blog,
   /admin/whitepapers, /admin/webinars, /admin/news). Blog posts are
   published at /insights, the URL they have always had.
   ============================================================ */

export type ContentTypeId = "case-study" | "blog" | "whitepaper" | "webinar" | "news";

export type ExtraField = {
  name: string;
  label: string;
  kind: "text" | "textarea" | "url" | "number" | "datetime" | "pdf";
  help?: string;
  required?: boolean;
};

export type ContentType = {
  id: ContentTypeId;
  /** The admin URL segment: /admin/<section>. */
  section: string;
  label: string;
  singular: string;
  /** Where published items live on the site. */
  publicPath: string;
  /** False for whitepapers: they are a download, not an article. */
  hasDetailPage: boolean;
  hasBody: boolean;
  hasCover: boolean;
  categoryLabel?: string;
  categories?: string[];
  extra: ExtraField[];
};

export const CONTENT_TYPES: ContentType[] = [
  {
    id: "case-study",
    section: "case-studies",
    label: "Case Studies",
    singular: "Case study",
    publicPath: "/case-studies",
    hasDetailPage: true,
    hasBody: true,
    hasCover: true,
    categoryLabel: "Industry",
    categories: ALL_INDUSTRIES.map((i) => i.name),
    extra: [
      { name: "client", label: "Client", kind: "text", help: 'Name them only with permission, otherwise describe them, e.g. "A regional hospital network".' },
      { name: "results", label: "Results", kind: "textarea", help: "One result per line. Shown as highlights at the top." },
    ],
  },
  {
    id: "blog",
    section: "blog",
    label: "Blog Posts",
    singular: "Blog post",
    publicPath: "/insights",
    hasDetailPage: true,
    hasBody: true,
    hasCover: true,
    categoryLabel: "Category",
    categories: [...INSIGHT_CATEGORIES],
    extra: [
      { name: "readingMinutes", label: "Reading time (minutes)", kind: "number", help: "Leave empty to work it out from the length." },
    ],
  },
  {
    id: "whitepaper",
    section: "whitepapers",
    label: "Whitepapers",
    singular: "Whitepaper",
    publicPath: "/whitepapers",
    hasDetailPage: false,
    hasBody: false,
    hasCover: false,
    extra: [
      { name: "audience", label: "Audience", kind: "text", required: true, help: 'e.g. "Hiring managers and HR".' },
      { name: "pages", label: "Pages", kind: "number" },
      { name: "file", label: "PDF", kind: "pdf", help: 'Without a PDF the site offers "Request a copy" by email instead.' },
    ],
  },
  {
    id: "webinar",
    section: "webinars",
    label: "Webinars",
    singular: "Webinar",
    publicPath: "/webinars",
    hasDetailPage: true,
    hasBody: true,
    hasCover: true,
    extra: [
      { name: "eventAt", label: "Date and time (US Central)", kind: "datetime", required: true },
      { name: "durationMinutes", label: "Length (minutes)", kind: "number" },
      { name: "speakers", label: "Speakers", kind: "textarea", help: 'One per line, e.g. "Priya Raman, Head of Healthcare Staffing".' },
      { name: "registrationUrl", label: "Registration link", kind: "url", help: "Shown before the event." },
      { name: "recordingUrl", label: "Recording link", kind: "url", help: "Shown after the event, if you have one." },
    ],
  },
  {
    id: "news",
    section: "news",
    label: "News & Press",
    singular: "News item",
    publicPath: "/news",
    hasDetailPage: true,
    hasBody: true,
    hasCover: true,
    categoryLabel: "Kind",
    categories: ["Company news", "Press release", "In the press"],
    extra: [
      { name: "source", label: "Publication", kind: "text", help: 'For coverage elsewhere, e.g. "Dallas Business Journal".' },
      { name: "externalUrl", label: "Link to the article", kind: "url", help: "For coverage elsewhere. The listing links out to it." },
    ],
  },
];

export function contentTypeBySection(section: string): ContentType | null {
  return CONTENT_TYPES.find((t) => t.section === section) ?? null;
}

export function contentType(id: ContentTypeId): ContentType {
  return CONTENT_TYPES.find((t) => t.id === id)!;
}
