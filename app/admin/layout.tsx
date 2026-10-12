import type { Metadata } from "next";

/* The admin sits outside the public site's header and footer
   (components/layout/SiteChrome.tsx) and is never indexed. */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Vertis Global Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper text-ink">{children}</div>;
}
