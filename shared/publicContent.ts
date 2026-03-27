import {
  ASSISTANT_SCENIC_DESIGN_PATH,
  assistantScenicDesignEntries,
} from "./localAssistantScenic";
import { resolveBlobMediaUrl } from "./mediaBlob";

export {
  ASSISTANT_SCENIC_DESIGN_PATH,
  ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION,
  ASSISTANT_SCENIC_DESIGN_SEO_TITLE,
  assistantScenicDesignEntries,
  assistantScenicYearRange,
  type AssistantScenicDesignEntry,
} from "./localAssistantScenic";
export const VOYAGELA_ARTICLE_SLUG = "voyagela-rising-stars-interview";
export const VOYAGELA_ARTICLE_PATH = `/articles/${VOYAGELA_ARTICLE_SLUG}`;
export const VOYAGELA_NEWS_SLUG = "featured-voyagela-rising-stars-interview";

export interface StaticArticleSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface StaticArticle {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  coverImageAlt: string;
  publishedAt: string;
  updatedAt: string;
  categoryName: string;
  seoTitle: string;
  seoDescription: string;
  sourcePublication?: string;
  sourceUrl?: string;
  sections: StaticArticleSection[];
}

export interface LegacyCanonicalDestination {
  canonicalPath: string;
  displayPath: string;
  destinationLabel: string;
  destinationTitle: string;
}

export const voyageLaArticle: StaticArticle = {
  slug: VOYAGELA_ARTICLE_SLUG,
  title: "VoyageLA: Rising Stars Interview",
  excerpt:
    "VoyageLA featured Brandon PT Davis in a Rising Stars profile focused on scenic design growth, artistic voice, and long-term career direction in Southern California.",
  coverImageUrl:
    resolveBlobMediaUrl(
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/local-articles/news-150001-cover-6b3d12c4.webp"
    ) ||
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/local-articles/news-150001-cover-6b3d12c4.webp",
  coverImageAlt: "VoyageLA Rising Stars interview feature",
  publishedAt: "2026-02-10",
  updatedAt: "2026-02-12",
  categoryName: "Profiles & Interviews",
  seoTitle: "VoyageLA Interview | Brandon PT Davis",
  seoDescription:
    "VoyageLA's Rising Stars interview with Brandon PT Davis on scenic design process, career development, and production-focused collaboration.",
  sourcePublication: "VoyageLA",
  sourceUrl: "https://voyagela.com/interview/rising-stars-meet-brandon-pt-davis-of-irvine-ca/",
  sections: [
    {
      title: "Editorial Context",
      paragraphs: [
        "VoyageLA published a Rising Stars interview profiling Brandon PT Davis's path from regional theatre work to current scenic design and teaching practice.",
        "The feature sits best alongside editorial writing and profile material rather than production news, so it now lives in Articles as part of the site's long-form content structure.",
      ],
    },
    {
      title: "Interview Focus",
      paragraphs: [
        "The interview centers on process, collaboration, and the working conditions that shape scenic design decisions in rehearsal, drafting, and production.",
      ],
      bullets: [
        "Career progression across regional and academic theatre",
        "How storytelling goals shape scenic systems and material choices",
        "Building a visible body of work through documented production practice",
      ],
    },
    {
      title: "Why It Belongs Here",
      paragraphs: [
        "This profile functions as editorial context for the broader body of work. It is less a time-sensitive update than a durable account of approach, professional trajectory, and scenic values.",
      ],
    },
  ],
};

const legacyCanonicalDestinations = new Map<string, LegacyCanonicalDestination>();

for (const entry of assistantScenicDesignEntries) {
  for (const slug of entry.legacyNewsSlugs) {
    legacyCanonicalDestinations.set(slug, {
      canonicalPath: ASSISTANT_SCENIC_DESIGN_PATH,
      displayPath: `${ASSISTANT_SCENIC_DESIGN_PATH}#${entry.anchorId}`,
      destinationLabel: "Assistant Scenic Design",
      destinationTitle: entry.title,
    });
  }
}

legacyCanonicalDestinations.set(VOYAGELA_NEWS_SLUG, {
  canonicalPath: VOYAGELA_ARTICLE_PATH,
  displayPath: VOYAGELA_ARTICLE_PATH,
  destinationLabel: "Articles",
  destinationTitle: voyageLaArticle.title,
});

export function getLegacyCanonicalDestination(slug?: string | null): LegacyCanonicalDestination | null {
  if (!slug) return null;
  return legacyCanonicalDestinations.get(slug) || null;
}

export function isStaticArticleSlug(slug?: string | null): boolean {
  return slug === VOYAGELA_ARTICLE_SLUG;
}
