import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

import ArticleDetailPage from "../../../client/src/pages/ArticleDetail";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata, stripHtml } from "../../../lib/metadata";
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
  const articleJsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: articleDescription,
        image: article.coverImageUrl || undefined,
        author: {
          "@type": "Person",
          name: "Brandon PT Davis",
          url: "https://www.brandonptdavis.com/about",
        },
        datePublished: article.publishedAt
          ? new Date(article.publishedAt).toISOString()
          : article.createdAt
            ? new Date(article.createdAt).toISOString()
            : undefined,
        dateModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
        publisher: {
          "@type": "Organization",
          name: "Brandon PT Davis Design",
          logo: "https://www.brandonptdavis.com/android-chrome-512x512.png",
        },
        url: `https://www.brandonptdavis.com/articles/${article.slug}`,
        keywords: article.seoKeywords || undefined,
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
