import TagDetailPage from "../../../client/src/pages/TagDetail";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";
import { getLocalArticles } from "../../../shared/localArticles";
import { getLocalScenicProjects } from "../../../shared/localScenicProjects";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

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
  const tagName = slug.replace(/-/g, " ");

  return buildPageMetadata({
    title: `${tagName} | Tags`,
    description: `Tagged scenic design content for ${tagName}.`,
    pathname: `/tags/${slug}`,
  });
}

export default async function Page({ params }: TagPageProps) {
  const { slug } = await params;

  return (
    <NextPathProvider currentPath={`/tags/${slug}`}>
      <TagDetailPage slug={slug} />
    </NextPathProvider>
  );
}
