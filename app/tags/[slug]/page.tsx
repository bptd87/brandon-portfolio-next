import TagDetailPage from "../../../client/src/pages/TagDetail";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";
import { notFound } from "next/navigation";
import { getLocalArticles } from "../../../shared/localArticles";
import { getLocalScenicProjects } from "../../../shared/localScenicProjects";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const tagSlugs = new Set<string>();

  for (const article of getLocalArticles()) {
    for (const tag of article.tags || []) {
      if (tag.slug) tagSlugs.add(tag.slug);
    }
  }

  for (const project of getLocalScenicProjects()) {
    for (const tag of project.tags || []) {
      if (tag.slug) tagSlugs.add(tag.slug);
    }
  }

  return Array.from(tagSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const tagName = normalizedSlug.replace(/-/g, " ");
  const projectCount = getLocalScenicProjects().filter((project) =>
    project.tags.some((tag) => tag.slug === normalizedSlug)
  ).length;
  const articleCount = getLocalArticles().filter((article) =>
    (article.tags || []).some((tag) => tag.slug === normalizedSlug)
  ).length;
  const totalItems = projectCount + articleCount;

  return buildPageMetadata({
    title: `${tagName} | Tag Archive`,
    description: `Archive page for content tagged ${tagName}.`,
    pathname: `/tags/${normalizedSlug}`,
    noindex: true,
    keywords: totalItems > 0 ? `${tagName}, tag archive` : undefined,
  });
}

export default async function Page({ params }: TagPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const hasTag =
    getLocalArticles().some((article) => (article.tags || []).some((tag) => tag.slug === normalizedSlug)) ||
    getLocalScenicProjects().some((project) => project.tags.some((tag) => tag.slug === normalizedSlug));

  if (!hasTag) {
    notFound();
  }

  return (
    <NextPathProvider currentPath={`/tags/${normalizedSlug}`}>
      <TagDetailPage slug={normalizedSlug} />
    </NextPathProvider>
  );
}
