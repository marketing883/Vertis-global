export const SITE = {
  name: "Vertis Global",
  tagline: "People who keep business moving.",
  description:
    "Vertis Global is a staffing company. We help businesses find the people they need, from frontline and administrative roles to specialised professionals, across eighteen industries.",
  /* The apex is what DNS and nginx serve; www has no record. Canonical
     URLs, the sitemap and robots.txt all read this, so it must be a
     host that answers. */
  url: "https://vertisglobal.com",
  /* General and employer enquiries. Every mailto on the site reads
     this, so an inbox change is one line. */
  staffingEmail: "info@vertisglobal.com",
  /* Resumes and portfolios from job seekers. */
  careersEmail: "careers@vertisglobal.com",
  /* The US office. Not shown anywhere for now (taken down 25 Sep 2026
     at the client's request). To publish it again, render it in the
     footer's Offices list and on the contact page's United States card. */
  usAddress: {
    street: "5 Gorman Court",
    city: "Hillsborough",
    region: "NJ",
    postalCode: "08844",
    country: "USA",
  },
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
