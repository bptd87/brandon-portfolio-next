import type { Metadata } from "next";
import TutorialDetailPage from "../../../../client/src/pages/TutorialDetail";
import ArticleDetailPage from "../../../../client/src/pages/ArticleDetail";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { JsonLdScript } from "../../../../components/seo/JsonLdScript";
import { absoluteUrl, buildPageMetadata, stripHtml } from "../../../../lib/metadata";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getLocalArticleBySlug,
  getLocalArticleRecordBySlug,
  getLocalArticles,
} from "../../../../shared/localArticles";
import { getLocalTutorialBySlug, getLocalTutorials } from "../../../../shared/localStudio";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_REDIRECTS,
} from "../../../../shared/learningPortal";
import {
  BRANDON_ORGANIZATION_ID,
  BRANDON_PERSON_ID,
  getBreadcrumbJsonLd,
} from "../../../../lib/seo/entities";

type TutorialPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

function toIsoDate(value?: string | Date | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function toIsoDuration(value?: number | string | null) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return undefined;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${remainingSeconds || (!hours && !minutes) ? `${remainingSeconds}S` : ""}`;
}

function getYouTubeId(url?: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "") || null;
    }
    return parsedUrl.searchParams.get("v");
  } catch {
    return null;
  }
}

function getTutorialDescription(tutorial: ReturnType<typeof getLocalTutorialBySlug>) {
  if (!tutorial) return undefined;

  const transcriptIntro = tutorial.transcript
    ?.slice(0, 3)
    .map((entry) => entry.text)
    .join(" ");

  return stripHtml(
    tutorial.seo_description ||
      tutorial.description ||
      tutorial.overview ||
      transcriptIntro ||
      `${tutorial.title} tutorial by Brandon PT Davis.`
  );
}

function getArticleDescription(article: ReturnType<typeof getLocalArticleRecordBySlug>) {
  if (!article) return undefined;

  return stripHtml(
    article.seoDescription ||
      article.excerpt ||
      `${article.title} by Brandon PT Davis on scenic design, production workflow, and visual storytelling.`
  );
}

function getLearningArticleJsonLd(article: NonNullable<ReturnType<typeof getLocalArticleRecordBySlug>>) {
  const url = absoluteUrl(`/studio/tutorials/${article.slug}`);
  const keywords = [
    article.seoKeywords,
    article.categoryName,
    article.series?.name,
    ...(article.tags?.map((tag) => tag.name) || []),
  ]
    .filter(Boolean)
    .join(", ");

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: getArticleDescription(article),
    image: article.coverImageUrl
      ? [
          {
            "@type": "ImageObject",
            url: article.coverImageUrl,
            caption: article.coverImageAlt || `${article.title} learning article image.`,
          },
        ]
      : undefined,
    thumbnailUrl: article.coverImageUrl || undefined,
    author: {
      "@id": BRANDON_PERSON_ID,
    },
    publisher: {
      "@id": BRANDON_ORGANIZATION_ID,
    },
    datePublished: toIsoDate(article.publishedAt || article.createdAt),
    dateModified: toIsoDate(article.updatedAt || article.publishedAt || article.createdAt),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords: keywords || undefined,
    articleSection: article.categoryName || "Scenic Design Learning",
    isAccessibleForFree: true,
    inLanguage: "en-US",
    learningResourceType: "Article",
    educationalUse: ["self study", "instruction"],
    isPartOf: article.series
      ? {
          "@type": "CreativeWorkSeries",
          name: article.series.name,
          url: absoluteUrl("/studio/tutorials"),
        }
      : undefined,
    about: [
      article.categoryName ? { "@type": "Thing", name: article.categoryName } : null,
      ...(article.tags?.slice(0, 8).map((tag) => ({ "@type": "Thing", name: tag.name })) || []),
    ].filter(Boolean),
  };
}

function getTutorialArticleJsonLd(tutorial: NonNullable<ReturnType<typeof getLocalTutorialBySlug>>) {
  const url = absoluteUrl(`/studio/tutorials/${tutorial.slug}`);
  const keywords = [
    tutorial.seo_keywords,
    tutorial.category,
    ...(tutorial.tags?.map((tag) => tag.name) || []),
    "Vectorworks tutorial",
    "scenic design tutorial",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: tutorial.title,
    description: getTutorialDescription(tutorial),
    image: tutorial.cover_image
      ? [
          {
            "@type": "ImageObject",
            url: tutorial.cover_image,
            caption: `${tutorial.title} tutorial cover image.`,
          },
        ]
      : undefined,
    thumbnailUrl: tutorial.cover_image || undefined,
    author: {
      "@id": BRANDON_PERSON_ID,
    },
    publisher: {
      "@id": BRANDON_ORGANIZATION_ID,
    },
    datePublished: toIsoDate(tutorial.published_at || tutorial.created_at),
    dateModified: toIsoDate(tutorial.updated_at || tutorial.published_at || tutorial.created_at),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords,
    articleSection: tutorial.category || "Vectorworks Tutorials",
    isAccessibleForFree: true,
    inLanguage: "en-US",
    learningResourceType: tutorial.video_url ? "Video tutorial" : "Tutorial",
    educationalUse: ["self study", "instruction"],
    about: [
      tutorial.category ? { "@type": "Thing", name: tutorial.category } : null,
      ...tutorial.key_concepts.slice(0, 8).map((concept) => ({ "@type": "Thing", name: concept.title })),
    ].filter(Boolean),
  };
}

function getTutorialVideoJsonLd(tutorial: NonNullable<ReturnType<typeof getLocalTutorialBySlug>>) {
  const uploadDate = toIsoDate(tutorial.published_at || tutorial.created_at || tutorial.updated_at);
  if (!tutorial.video_url || !tutorial.cover_image || !uploadDate) return null;

  const url = absoluteUrl(`/studio/tutorials/${tutorial.slug}`);
  const youTubeId = getYouTubeId(tutorial.video_url);

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${url}#video`,
    name: tutorial.title,
    description: getTutorialDescription(tutorial),
    thumbnailUrl: [tutorial.cover_image],
    uploadDate,
    duration: toIsoDuration(tutorial.duration),
    contentUrl: tutorial.video_url,
    embedUrl: youTubeId ? `https://www.youtube.com/embed/${youTubeId}` : undefined,
    publisher: {
      "@id": BRANDON_ORGANIZATION_ID,
    },
  };
}

export async function generateStaticParams() {
  const tutorialParams = getLocalTutorials().map((tutorial) => ({ slug: tutorial.slug }));
  const articleParams = getLocalArticles()
    .filter((article) => LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
    .map((article) => ({ slug: article.slug }));
  const redirectParams = Object.keys(RETIRED_LEARNING_ARTICLE_REDIRECTS).map((slug) => ({ slug }));

  return [...tutorialParams, ...articleParams, ...redirectParams];
}

export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = getLocalTutorialBySlug(slug);
  if (!tutorial && LEARNING_PORTAL_ARTICLE_SLUG_SET.has(slug)) {
    const article = getLocalArticleBySlug(slug);

    if (article) {
      return buildPageMetadata({
        title: article.seoTitle || `${article.title} | Brandon PT Davis`,
        description: article.seoDescription || article.excerpt,
        pathname: `/studio/tutorials/${article.slug}`,
        image: article.coverImageUrl,
        keywords:
          article.seoKeywords ||
          [article.categoryName, article.series?.name, "Brandon PT Davis"].filter(Boolean).join(", "),
        type: "article",
      });
    }
  }

  if (!tutorial) return {};

  return buildPageMetadata({
    title: tutorial.seo_title || tutorial.title,
    description:
      tutorial.seo_description ||
      tutorial.description ||
      tutorial.overview ||
      `${tutorial.title} tutorial by Brandon PT Davis.`,
    pathname: `/studio/tutorials/${tutorial.slug}`,
    image: tutorial.cover_image || undefined,
    keywords: tutorial.seo_keywords || undefined,
    type: "article",
  });
}

export default async function Page({ params }: TutorialPageProps) {
  const { slug } = await params;
  const retiredRedirect = RETIRED_LEARNING_ARTICLE_REDIRECTS[slug];

  if (retiredRedirect) {
    permanentRedirect(retiredRedirect);
  }

  const tutorial = getLocalTutorialBySlug(slug);

  if (tutorial) {
    const tutorialUrl = absoluteUrl(`/studio/tutorials/${tutorial.slug}`);
    const tutorialJsonLd = [
      getTutorialArticleJsonLd(tutorial),
      getBreadcrumbJsonLd([
        { name: "Home", url: absoluteUrl("/") },
        { name: "Studio", url: absoluteUrl("/studio") },
        { name: "Tutorials", url: absoluteUrl("/studio/tutorials") },
        { name: tutorial.title, url: tutorialUrl },
      ]),
      getTutorialVideoJsonLd(tutorial),
    ].filter(Boolean) as Record<string, unknown>[];

    return (
      <>
        <JsonLdScript id={`studio-tutorial-${slug}-json-ld`} data={tutorialJsonLd} />
        <NextPathProvider currentPath={`/studio/tutorials/${slug}`}>
          <TutorialDetailPage slug={slug} />
        </NextPathProvider>
      </>
    );
  }

  if (LEARNING_PORTAL_ARTICLE_SLUG_SET.has(slug)) {
    const article = getLocalArticleRecordBySlug(slug);

    if (article) {
      const articleUrl = absoluteUrl(`/studio/tutorials/${article.slug}`);
      const articleJsonLd = [
        getLearningArticleJsonLd(article),
        getBreadcrumbJsonLd([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Studio", url: absoluteUrl("/studio") },
          { name: "Tutorials", url: absoluteUrl("/studio/tutorials") },
          { name: article.title, url: articleUrl },
        ]),
      ];

      return (
        <>
          <JsonLdScript id={`studio-article-${slug}-json-ld`} data={articleJsonLd} />
          <NextPathProvider currentPath={`/studio/tutorials/${slug}`}>
            <ArticleDetailPage slug={slug} article={article} />
          </NextPathProvider>
        </>
      );
    }
  }

  notFound();
}
