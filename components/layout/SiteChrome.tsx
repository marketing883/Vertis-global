"use client";

import { usePathname } from "next/navigation";

/* The public header and footer, left out under /admin, which has its
   own shell (app/admin). Both are rendered on the server and handed in
   as props, so public pages render exactly as they did before. */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const admin = usePathname()?.startsWith("/admin") ?? false;
  if (admin) return <>{children}</>;
  return (
    <>
      {header}
      <main id="main">{children}</main>
      {footer}
    </>
  );
}
