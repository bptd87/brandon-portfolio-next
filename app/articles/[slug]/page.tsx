import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import ArticleDetailPage from "../../../client/src/pages/ArticleDetail";
import TutorialDetailPage from "../../../client/src/pages/TutorialDetail";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata, stripHtml } from "../../../lib/metadata";
import { BRANDON_ORGANIZATION_ID, BRANDON_PERSON_ID } from "../../../lib/seo/entities";
import {
  getTutorialArticleBySlug,
  getTutorialArticles,
} from "../../../shared/articleTutorials";
import { getLocalTutorialBySlug } from "../../../shared/localStudio";
import {
  getLocalArticleBySlug,
  getLocalArticleRecordBySlug,
  getLocalArticles,
} from "../../../shared/localArticles";
import { resolveLegacyArticlePath } from "../../../shared/legacyRedirects";
import {
  RETIRED_LEARNING_ARTICLE_REDIRECTS,
} from "../../../shared/learningPortal";
import {
  VOYAGELA_ARTICLE_SLUG,
  VOYAGELA_EXTERNAL_URL,
  VOYAGELA_PROFILE_TITLE,
} from "../../../shared/publicContent";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...getLocalArticles().map((article) => ({ slug: article.slug })),
    ...getTutorialArticles().map((article) => ({ slug: article.slug })),
    { slug: VOYAGELA_ARTICLE_SLUG },
  ];
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === VOYAGELA_ARTICLE_SLUG) {
    return buildPageMetadata({
      title: VOYAGELA_PROFILE_TITLE,
      description:
        "VoyageLA's Rising Stars interview with Brandon PT Davis now links to the original publication.",
      pathname: `/articles/${slug}`,
      noindex: true,
      type: "article",
    });
  }

  const article = getLocalArticleBySlug(slug) || getTutorialArticleBySlug(slug);

  if (!article) {
    return buildPageMetadata({
      title: "Article Not Found",
      description: "The requested article could not be found.",
      pathname: `/articles/${slug}`,
      noindex: true,
      type: "article",
    });
  }

  return buildPageMetadata({
    title: article.seoTitle || `${article.title} | Brandon PT Davis`,
    description: article.seoDescription || article.excerpt,
    pathname: `/articles/${article.slug}`,
    image: article.coverImageUrl,
    keywords:
      article.seoKeywords ||
      [article.categoryName, article.series?.name, "Brandon PT Davis"].filter(Boolean).join(", "),
    type: "article",
  });
}

export default async function Page({ params }: ArticlePageProps) {
  const { slug } = await params;

  if (slug === VOYAGELA_ARTICLE_SLUG) {
    permanentRedirect(VOYAGELA_EXTERNAL_URL);
  }

  const retiredRedirect = RETIRED_LEARNING_ARTICLE_REDIRECTS[slug];

  if (retiredRedirect && retiredRedirect !== `/articles/${slug}`) {
    permanentRedirect(retiredRedirect);
  }

  if (getLocalTutorialBySlug(slug)) {
    return (
      <NextPathProvider currentPath={`/articles/${slug}`}>
        <TutorialDetailPage slug={slug} />
      </NextPathProvider>
    );
  }

  const article = getLocalArticleRecordBySlug(slug);

  if (!article) {
    const destination = resolveLegacyArticlePath(slug);
    if (destination) {
      permanentRedirect(destination);
    }
    notFound();
  }

  const articleDescription = article?.excerpt
    ? stripHtml(article.excerpt)
    : article
      ? `${article.title} by Brandon PT Davis on scenic design, production thinking, and visual storytelling.`
      : undefined;
  const articleKeywords = article
    ? [
        article.seoKeywords,
        article.categoryName,
        article.series?.name,
        ...(article.tags?.map((tag) => tag.name) || []),
        "Brandon PT Davis",
        "scenic design",
      ]
        .filter(Boolean)
        .join(", ")
    : undefined;
  const articleJsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `https://www.brandonptdavis.com/articles/${article.slug}#article`,
        headline: article.title,
        description: articleDescription,
        image: article.coverImageUrl
          ? [
              {
                "@type": "ImageObject",
                url: article.coverImageUrl,
                caption: article.coverImageAlt || `${article.title} article image.`,
              },
            ]
          : undefined,
        thumbnailUrl: article.coverImageUrl || undefined,
        author: {
          "@id": BRANDON_PERSON_ID,
        },
        datePublished: article.publishedAt
          ? new Date(article.publishedAt).toISOString()
          : article.createdAt
            ? new Date(article.createdAt).toISOString()
            : undefined,
        dateModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
        publisher: {
          "@id": BRANDON_ORGANIZATION_ID,
        },
        articleSection: article.categoryName || undefined,
        isAccessibleForFree: true,
        inLanguage: "en-US",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://www.brandonptdavis.com/articles/${article.slug}`,
        },
        url: `https://www.brandonptdavis.com/articles/${article.slug}`,
        keywords: articleKeywords || undefined,
        about: [
          article.categoryName ? { "@type": "Thing", name: article.categoryName } : null,
          article.series?.name ? { "@type": "Thing", name: article.series.name } : null,
          ...(article.tags?.slice(0, 8).map((tag) => ({ "@type": "Thing", name: tag.name })) || []),
        ].filter(Boolean),
      }
    : null;
  const breadcrumbJsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.brandonptdavis.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Articles",
            item: "https://www.brandonptdavis.com/articles",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `https://www.brandonptdavis.com/articles/${article.slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {articleJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      {breadcrumbJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <NextPathProvider currentPath={`/articles/${slug}`}>
        <ArticleDetailPage slug={slug} article={article} />
      </NextPathProvider>
    </>
  );
}
