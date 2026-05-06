import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

import ArticleDetailPage from "../../../client/src/pages/ArticleDetail";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata, stripHtml } from "../../../lib/metadata";
import { BRANDON_ORGANIZATION_ID, BRANDON_PERSON_ID } from "../../../lib/seo/entities";
import {
  getLocalArticleBySlug,
  getLocalArticleRecordBySlug,
  getLocalArticles,
} from "../../../shared/localArticles";
import { resolveLegacyArticlePath } from "../../../shared/legacyRedirects";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_REDIRECTS,
} from "../../../shared/learningPortal";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getLocalArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getLocalArticleBySlug(slug);

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
  const retiredRedirect = RETIRED_LEARNING_ARTICLE_REDIRECTS[slug];

  if (retiredRedirect) {
    permanentRedirect(retiredRedirect);
  }

  if (LEARNING_PORTAL_ARTICLE_SLUG_SET.has(slug)) {
    permanentRedirect(`/studio/tutorials/${slug}`);
  }

  const article = getLocalArticleRecordBySlug(slug);

  if (!article) {
    const destination = resolveLegacyArticlePath(slug);
    if (destination) {
      permanentRedirect(destination);
    }
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
