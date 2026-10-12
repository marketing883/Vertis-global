import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { SERVICE_LIST } from "@/config/services";
import { INDUSTRY_PAGES } from "@/config/industry-pages";
import { getInsights, listPublished } from "@/lib/data/content";
import { getJobs } from "@/lib/data/jobs";
import { CONTENT_TYPES } from "@/lib/content-types";

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
    /* The four services, including Cloud (/services/azure) and ERP
       (/services/oracle-erp). Retired service URLs redirect and are
       deliberately absent. */
    ...SERVICE_LIST.map((s) => ({
      url: `${base}${s.href}`,
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
    /* Job pages, managed at /admin/jobs. */
    ...getJobs().map((job) => ({
      url: `${base}/jobs/${job.id}`,
      lastModified: new Date(`${job.posted}T00:00:00Z`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    /* Case studies, webinars and news: listed only once something is
       published, because the index pages 404 while they are empty. */
    ...CONTENT_TYPES.filter((t) => t.id !== "blog" && t.hasDetailPage).flatMap((t) => {
      const items = listPublished(t.id);
      if (items.length === 0) return [];
      return [
        { url: `${base}${t.publicPath}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 },
        ...items
          .filter((i) => !(t.id === "news" && i.data.externalUrl))
          .map((i) => ({
            url: `${base}${t.publicPath}/${i.slug}`,
            lastModified: new Date(i.updated_at),
            changeFrequency: "yearly" as const,
            priority: 0.5,
          })),
      ];
    }),
  ];
}

/* Rebuilt at most hourly in the background, so a job whose application
   deadline has passed leaves this page without anyone saving anything. */
export const revalidate = 3600;
