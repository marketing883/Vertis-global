import type { Metadata } from "next";
import { Funnel_Display, Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HireTalentProvider } from "@/components/hire/HireTalentProvider";
import { SITE } from "@/config/site";
import "./globals.css";

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-funnel-display",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Staffing for every kind of work`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} | Staffing for every kind of work`,
    description: SITE.description,
    url: SITE.url,
  },
  robots: { index: true, follow: true },
};

/* Organization and WebSite structured data, on every page. The logo is
   the square mark at a stable public URL (not the hashed /icon.png),
   512 x 512, which is what Google uses for the brand in results and
   knowledge panels; the favicon itself comes from app/favicon.ico,
   app/icon.png and app/apple-icon.png via Next's file conventions.
   Facts only: everything here is already published on the site. */
const BASE = SITE.url.replace(/\/$/, "");
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: SITE.name,
      url: `${BASE}/`,
      description: SITE.description,
      email: SITE.staffingEmail,
      logo: {
        "@type": "ImageObject",
        "@id": `${BASE}/#logo`,
        url: `${BASE}/brand/vertis-global-logo-square.png`,
        contentUrl: `${BASE}/brand/vertis-global-logo-square.png`,
        width: 512,
        height: 512,
        caption: SITE.name,
      },
      image: { "@id": `${BASE}/#logo` },
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.usAddress.street,
        addressLocality: SITE.usAddress.city,
        addressRegion: SITE.usAddress.region,
        postalCode: SITE.usAddress.postalCode,
        addressCountry: "US",
      },
      sameAs: ["https://www.linkedin.com/company/vertis-global"],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      name: SITE.name,
      url: `${BASE}/`,
      publisher: { "@id": `${BASE}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${funnelDisplay.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
      </head>
      <body>
        <HireTalentProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[600] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </HireTalentProvider>
      </body>
    </html>
  );
}
