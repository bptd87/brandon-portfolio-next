import type { Metadata } from "next";
import { getConfiguredSiteUrl } from "./env/site";

export const siteMetadata = {
  siteName: "Brandon PT Davis",
  siteUrl: getConfiguredSiteUrl(),
  title: "Brandon PT Davis | Scenic Designer",
  description:
    "San Diego-based union scenic designer creating story-driven environments for regional theatre, summer stock, and academic production.",
};

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteMetadata.siteUrl).toString();
}

export function stripHtml(value: string) {
  return String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function buildPageMetadata(input: {
  title: string;
  description: string;
  pathname: string;
  image?: string | null;
  keywords?: string | null;
  noindex?: boolean;
  type?: "website" | "article";
}) {
  const canonical = absoluteUrl(input.pathname);
  const image = input.image || absoluteUrl("/og-default.jpeg");
  const title = input.title.includes(siteMetadata.siteName)
    ? { absolute: input.title }
    : input.title;
  const keywords = input.keywords
    ? input.keywords
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : undefined;

  return {
    title,
    description: input.description,
    keywords,
    alternates: {
      canonical,
    },
    robots: input.noindex
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : undefined,
    openGraph: {
      type: input.type || "website",
      url: canonical,
      title: input.title,
      description: input.description,
      siteName: siteMetadata.siteName,
      images: [
        {
          url: image,
          alt: input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@brandonptdavis",
      site: "@brandonptdavis",
      title: input.title,
      description: input.description,
      images: [image],
    },
  } satisfies Metadata;
}
