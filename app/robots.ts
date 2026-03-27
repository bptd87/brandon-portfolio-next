import type { MetadataRoute } from "next";
import { getConfiguredSiteUrl } from "../lib/env/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getConfiguredSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/image-sitemap.xml`,
      `${siteUrl}/video-sitemap.xml`,
    ],
    host: siteUrl,
  };
}
