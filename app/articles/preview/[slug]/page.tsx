import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleDetailPage from "../../../../client/src/pages/ArticleDetail";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";
import { getLocalArticlePreviewRecordBySlug } from "../../../../shared/localArticles";

type ArticlePreviewPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

const previewEnabled =
  process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

export async function generateMetadata({
  params,
}: ArticlePreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = previewEnabled ? getLocalArticlePreviewRecordBySlug(slug) : undefined;

  return buildPageMetadata({
    title: article ? `Preview: ${article.title}` : "Article Preview",
    description: "Private article preview for scheduled or draft article review.",
    pathname: `/articles/preview/${slug}`,
    noindex: true,
    type: "article",
  });
}

export default async function Page({ params }: ArticlePreviewPageProps) {
  if (!previewEnabled) {
    notFound();
  }

  const { slug } = await params;
  const article = getLocalArticlePreviewRecordBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <NextPathProvider currentPath={`/articles/preview/${slug}`}>
      <div className="border-b border-amber-500/30 bg-amber-100 px-5 py-3 text-center text-sm font-medium text-amber-950">
        Preview only. This article is not published on the public Articles page.
      </div>
      <ArticleDetailPage slug={slug} article={article} />
    </NextPathProvider>
  );
}
