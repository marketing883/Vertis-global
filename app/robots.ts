import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* The hero video picker is a development tool and returns a 404
         in production anyway. Listed so nothing crawls for it.
         /resume/ holds recruiters' private resume download links. */
      disallow: ["/dev/", "/resume/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
