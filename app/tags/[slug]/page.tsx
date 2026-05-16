import TagDetailPage from "../../../client/src/pages/TagDetail";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";
import { notFound, permanentRedirect } from "next/navigation";
import { getLocalArticles } from "../../../shared/localArticles";
import { resolveLegacyTagPath } from "../../../shared/legacyRedirects";
import { getLocalScenicProjects } from "../../../shared/localScenicProjects";

const INDEXABLE_TAG_MIN_ITEMS = 3;
const scenicCategoryCopy: Record<
  string,
  { title: string; description: string }
> = {
  comedy: {
    title: "Comedy Scenic Design",
    description:
      "Scenic design for comedy, farce, and heightened theatrical worlds by Brandon PT Davis.",
  },
  drama: {
    title: "Drama Scenic Design",
    description:
      "Scenic design for dramatic work by Brandon PT Davis, built around memory, atmosphere, intimacy, and emotional pressure.",
  },
  shakespeare: {
    title: "Shakespeare Scenic Design",
    description:
      "Scenic design for Shakespeare and classical text by Brandon PT Davis.",
  },
  "musical-theatre": {
    title: "Musical Scenic Design",
    description:
      "Scenic design for musicals by Brandon PT Davis, built around rhythm, transitions, ensemble movement, and song.",
  },
  "theatre-for-young-audiences": {
    title: "TYA Scenic Design",
    description:
      "Scenic design for theatre for young audiences by Brandon PT Davis.",
  },
};

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

function getTagCounts(normalizedSlug: string) {
  const projectCount = getLocalScenicProjects().filter(project =>
    project.tags.some(tag => tag.slug === normalizedSlug)
  ).length;
  const articleCount = getLocalArticles().filter(article =>
    (article.tags || []).some(tag => tag.slug === normalizedSlug)
  ).length;

  return {
    projectCount,
    articleCount,
    totalItems: projectCount + articleCount,
  };
}

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

  return Array.from(tagSlugs).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const tagName = normalizedSlug.replace(/-/g, " ");
  const { totalItems } = getTagCounts(normalizedSlug);
  const scenicCategory = scenicCategoryCopy[normalizedSlug];

  return buildPageMetadata({
    title: scenicCategory?.title || `${tagName} | Brandon PT Davis`,
    description:
      scenicCategory?.description ||
      `Browse ${tagName} across scenic projects and writing by Brandon PT Davis.`,
    pathname: `/tags/${normalizedSlug}`,
    noindex: true,
    keywords:
      totalItems > 0
        ? `${tagName}, scenic design, Brandon PT Davis`
        : undefined,
  });
}

export default async function Page({ params }: TagPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const { totalItems } = getTagCounts(normalizedSlug);

  if (totalItems === 0) {
    const destination = resolveLegacyTagPath(slug);
    if (destination) {
      permanentRedirect(destination);
    }
    notFound();
  }

  return (
    <NextPathProvider currentPath={`/tags/${normalizedSlug}`}>
      <TagDetailPage slug={normalizedSlug} />
    </NextPathProvider>
  );
}
