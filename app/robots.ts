import type { MetadataRoute } from "next";
import { getConfiguredSiteUrl } from "../lib/env/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getConfiguredSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login", "/api/"],
      },
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
    ],
    host: siteUrl,
  };
}
