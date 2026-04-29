import type { Metadata } from "next";
import TutorialDetailPage from "../../../../client/src/pages/TutorialDetail";
import ArticleDetailPage from "../../../../client/src/pages/ArticleDetail";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";
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

type TutorialPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

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
    return (
      <NextPathProvider currentPath={`/studio/tutorials/${slug}`}>
        <TutorialDetailPage slug={slug} />
      </NextPathProvider>
    );
  }

  if (LEARNING_PORTAL_ARTICLE_SLUG_SET.has(slug)) {
    const article = getLocalArticleRecordBySlug(slug);

    if (article) {
      return (
        <NextPathProvider currentPath={`/studio/tutorials/${slug}`}>
          <ArticleDetailPage slug={slug} article={article} />
        </NextPathProvider>
      );
    }
  }

  notFound();
}
