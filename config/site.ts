export const SITE = {
  name: "Vertis Global",
  tagline: "People who keep business moving.",
  description:
    "Vertis Global is a staffing company. We help businesses find the people they need, from frontline and administrative roles to specialised professionals, across eighteen industries.",
  url: "https://www.vertisglobal.com",
  /* General and employer enquiries. Every mailto on the site reads
     this, so an inbox change is one line. */
  staffingEmail: "info@vertisglobal.com",
  /* Resumes and portfolios from job seekers. */
  careersEmail: "careers@vertisglobal.com",
} as const;

/* Routes whose hero is NOT a dark surface — the header stays solid
   and does not overlay on these. */
export const LIGHT_HEADER_ROUTES = [
  "/contact",
  "/legal",
  "/account",
  "/insights",
  "/whitepapers",
];
