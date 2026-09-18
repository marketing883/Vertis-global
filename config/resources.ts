/* ============================================================
   RESOURCES

   Whitepapers and the newsletter. These are NOT articles: they do
   not live under Insights, they are their own thing, and Insights
   (config/insights.ts) knows nothing about them. The homepage
   resources grid is the one place all three appear together.

   To publish a whitepaper, add an entry below and put the PDF in
   public/whitepapers/<slug>.pdf, then set `file` to that path.
   Until `file` is set the link requests a copy by email, so
   nothing ever points at a missing download.
   ============================================================ */

export type Whitepaper = {
  slug: string;
  title: string;
  summary: string;
  audience: string;
  pages: number;
  /** Path under public/, or null while the PDF is not yet uploaded. */
  file: string | null;
};

export const WHITEPAPERS: Whitepaper[] = [
  {
    slug: "contract-to-hire-playbook",
    title: "The contract-to-hire playbook",
    summary:
      "How to run a contract period that converts: onboarding, check-ins, the conversion conversation, and the numbers to watch.",
    audience: "Hiring managers and HR",
    pages: 14,
    file: null,
  },
  {
    slug: "planning-for-peak-season",
    title: "Planning for peak season",
    summary:
      "A twelve-week staffing calendar for warehouses, retail and hospitality, with headcount models and the mistakes that cost the most.",
    audience: "Operations leaders",
    pages: 18,
    file: null,
  },
];

export function whitepaperHref(w: Whitepaper, requestEmail: string) {
  if (w.file) return w.file;
  const subject = encodeURIComponent(`Whitepaper request: ${w.title}`);
  const body = encodeURIComponent(
    `Hello,\n\nPlease send me a copy of "${w.title}".\n\nName:\nCompany:\n`,
  );
  return `mailto:${requestEmail}?subject=${subject}&body=${body}`;
}

export const NEWSLETTER = {
  name: "The Shift",
  line: "One short email a month: hiring notes, pay and availability trends, and the best of Insights. No spam, unsubscribe any time.",
};
