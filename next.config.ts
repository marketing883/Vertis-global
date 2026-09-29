import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
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
     is no longer offered, so it goes to the services overview. */
  async redirects() {
    return [
      { source: "/services/temporary-staffing", destination: "/services/staffing#temporary-staffing", permanent: true },
      { source: "/services/contract-staffing", destination: "/services/staffing#contract-staffing", permanent: true },
      { source: "/services/contract-to-hire", destination: "/services/staffing#contract-to-hire", permanent: true },
      { source: "/services/project-team-staffing", destination: "/services/managed-services", permanent: true },
      { source: "/services/direct-hire", destination: "/services", permanent: true },
      { source: "/industries/oracle-erp", destination: "/services/oracle-erp", permanent: true },
      { source: "/industries/azure", destination: "/services/azure", permanent: true },
    ];
  },
  async headers() {
    return [
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
