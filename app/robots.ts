import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* The hero video picker is a development tool and returns a 404
         in production anyway. Listed so nothing crawls for it. */
      disallow: ["/dev/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
