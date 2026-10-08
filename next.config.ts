import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    /* Every width here is a separate encode the server must do the
       first time a visitor needs it, and AVIF takes 1.3 to 1.7s per
       photo on this server. 3840 is dropped: it is what a full-width
       hero on a 2x laptop asks for, the slowest encode, and no sharper
       to the eye than 2048 behind a scrim. Fewer, more common widths
       also mean a warm cache serves more visitors. 1440 is kept: it is
       the most common laptop width, and without it every full-width
       hero there jumps from 1200 to 1920, a third more bytes on the
       image that decides LCP. */
    deviceSizes: [640, 828, 1080, 1200, 1440, 1920, 2048],
    imageSizes: [64, 128, 256, 384],
    /* Optimised images keep for 30 days instead of 4 hours, so they are
       not re-encoded over and over. A changed photo should get a new
       filename, as every photo here already has. */
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    /* Candidates attach a resume to the server action, and the
       default action body limit is 1MB. The form itself refuses
       anything over 5MB, so this leaves headroom for the base64
       encoding and the other fields. */
    serverActions: { bodySizeLimit: "8mb" },
  },
  /* Retired URLs, permanently redirected so links and search results
     land on the page that replaced them. The three former staffing
     pages go to their own section of /services/staffing; Oracle ERP
     and Azure moved from Industries to Services as ERP and Cloud;
     project and team staffing grew into managed services; direct hire
     is no longer offered, so it goes to the services overview. The
     six industries no longer served go to the industries overview. */
  async redirects() {
    return [
      { source: "/services/temporary-staffing", destination: "/services/staffing#temporary-staffing", permanent: true },
      { source: "/services/contract-staffing", destination: "/services/staffing#contract-staffing", permanent: true },
      { source: "/services/contract-to-hire", destination: "/services/staffing#contract-to-hire", permanent: true },
      { source: "/services/project-team-staffing", destination: "/services/managed-services", permanent: true },
      { source: "/services/direct-hire", destination: "/services", permanent: true },
      { source: "/industries/oracle-erp", destination: "/services/oracle-erp", permanent: true },
      { source: "/industries/azure", destination: "/services/azure", permanent: true },
      ...["administrative", "financial-services", "human-resources", "marketing", "sales", "industrial"].map(
        (slug) => ({ source: `/industries/${slug}`, destination: "/industries", permanent: true }),
      ),
    ];
  },
  async headers() {
    return [
      /* Photos, brand files and the hero videos are served from public/
         with max-age=0, so every page view re-checked them. They now
         keep for a week, and are refreshed quietly for a day after. */
      ...["/photos/:path*", "/brand/:path*", "/hero-video/:path*", "/jobs-video/:path*"].map(
        (source) => ({
          source,
          headers: [
            { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
          ],
        }),
      ),
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
