import type { Metadata } from "next";

import ArticleDetailPage from "../../../client/src/pages/ArticleDetail";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";
import { getLocalArticleBySlug, getLocalArticles } from "../../../shared/localArticles";

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
  return (
    <NextPathProvider currentPath={`/articles/${slug}`}>
      <ArticleDetailPage slug={slug} />
    </NextPathProvider>
  );
}
