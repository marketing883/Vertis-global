import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { SERVICES } from "@/config/services";
import { INDUSTRY_PAGES } from "@/config/industry-pages";
import { getInsights } from "@/config/insights";

/* Generated from the content configs, so a new service or article is
   listed the moment it is published. The development only hero video
   picker is excluded by robots.ts and is absent here. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/industries", priority: 0.9 },
    { path: "/hire-talent", priority: 0.9 },
    { path: "/candidates", priority: 0.8 },
    { path: "/jobs", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
    { path: "/insights", priority: 0.6 },
    { path: "/whitepapers", priority: 0.6 },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: r.priority,
    })),
    ...INDUSTRY_PAGES.map((p) => ({
      url: `${base}/industries/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...SERVICES.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getInsights().map((post) => ({
      url: `${base}/insights/${post.slug}`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
