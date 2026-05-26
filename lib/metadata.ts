import type { Metadata } from "next";
import { getConfiguredSiteUrl } from "./env/site";

export const siteMetadata = {
  siteName: "Brandon PT Davis",
  siteUrl: getConfiguredSiteUrl(),
  title: "Brandon PT Davis | Scenic Designer",
  description:
    "San Diego-based scenic designer creating story-driven stage environments, renderings, and production design for theatre and live performance.",
};

const SEO_TITLE_MAX_LENGTH = 60;
const SEO_DESCRIPTION_MAX_LENGTH = 155;
const SEO_TITLE_SUFFIX = ` | ${siteMetadata.siteName}`;

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteMetadata.siteUrl).toString();
}

export function stripHtml(value: string) {
  return String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeTitleText(value: string) {
  return String(value || "")
    .replace(/Brandon PT Davis\s*Design/gi, "Brandon PT Davis Design")
    .replace(/\s+/g, " ")
    .trim();
}

function stripBrandFromLongTitle(value: string) {
  return normalizeTitleText(value)
    .replace(/\s*\|\s*Brandon PT Davis(?:\s+Design)?$/i, "")
    .replace(/\s+by\s+Brandon PT Davis$/i, "")
    .trim();
}

function trimAtWordBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const trimmed = value.slice(0, maxLength + 1).replace(/\s+\S*$/u, "").trim();
  return trimmed || value.slice(0, maxLength).trim();
}

function compactPageTitle(value: string) {
  const maxPageTitleLength = SEO_TITLE_MAX_LENGTH - SEO_TITLE_SUFFIX.length;
  let title = stripBrandFromLongTitle(value)
    .replace(/^Vectorworks Tutorial:\s*/i, "")
    .replace(/\s+for Scenic Designers$/i, "")
    .replace(/\s+by Brandon PT Davis$/i, "")
    .trim();

  let parts = title
    .split(/\s+\|\s+/u)
    .map((part) => part.trim())
    .filter(Boolean);

  while (parts.length > 1 && `${parts.join(" | ")}${SEO_TITLE_SUFFIX}`.length > SEO_TITLE_MAX_LENGTH) {
    parts = parts.slice(0, -1);
  }

  title = parts.join(" | ") || title;

  if (`${title}${SEO_TITLE_SUFFIX}`.length > SEO_TITLE_MAX_LENGTH) {
    title = title.replace(/\s*\([^)]*\)\s*/gu, " ").replace(/\s+/g, " ").trim();
  }

  if (`${title}${SEO_TITLE_SUFFIX}`.length > SEO_TITLE_MAX_LENGTH && title.startsWith("The ")) {
    title = title.replace(/^The\s+/u, "");
  }

  return trimAtWordBoundary(title, maxPageTitleLength) || siteMetadata.siteName;
}

export function formatSeoTitle(title: string, pathname: string) {
  const normalizedTitle = normalizeTitleText(title);
  const fullTitle = normalizedTitle.includes(siteMetadata.siteName)
    ? normalizedTitle
    : `${normalizedTitle}${SEO_TITLE_SUFFIX}`;

  if (pathname === "/" || fullTitle.length <= SEO_TITLE_MAX_LENGTH) {
    return {
      metadataTitle: normalizedTitle.includes(siteMetadata.siteName)
        ? { absolute: normalizedTitle }
        : normalizedTitle,
      fullTitle,
    };
  }

  const compactTitle = compactPageTitle(normalizedTitle);

  return {
    metadataTitle: compactTitle,
    fullTitle: `${compactTitle}${SEO_TITLE_SUFFIX}`,
  };
}

export function formatSeoDescription(description: string) {
  const normalizedDescription = stripHtml(description);

  if (normalizedDescription.length <= SEO_DESCRIPTION_MAX_LENGTH) {
    return normalizedDescription;
  }

  const clippedDescription = normalizedDescription.slice(0, SEO_DESCRIPTION_MAX_LENGTH + 1);
  const sentenceMatch = clippedDescription.match(/^(.+[.!?])\s+/u);

  if (sentenceMatch?.[1] && sentenceMatch[1].length >= 90) {
    return sentenceMatch[1];
  }

  const clauseMatch = clippedDescription.match(/^(.+)[,;:]\s+[^,;:]*$/u);

  if (clauseMatch?.[1] && clauseMatch[1].length >= 55) {
    return /[.!?]$/u.test(clauseMatch[1]) ? clauseMatch[1] : `${clauseMatch[1]}.`;
  }

  const trimmedDescription = trimAtWordBoundary(normalizedDescription, SEO_DESCRIPTION_MAX_LENGTH).replace(
    /[,:;]$/u,
    "",
  );

  return /[.!?]$/u.test(trimmedDescription) || trimmedDescription.length >= SEO_DESCRIPTION_MAX_LENGTH
    ? trimmedDescription
    : `${trimmedDescription}.`;
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
  const title = formatSeoTitle(input.title, input.pathname);
  const description = formatSeoDescription(input.description);
  const keywords = input.keywords
    ? input.keywords
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : undefined;

  return {
    title: title.metadataTitle,
    description,
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
      title: title.fullTitle,
      description,
      siteName: siteMetadata.siteName,
      images: [
        {
          url: image,
          alt: title.fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@brandonptdavis",
      site: "@brandonptdavis",
      title: title.fullTitle,
      description,
      images: [image],
    },
  } satisfies Metadata;
}
