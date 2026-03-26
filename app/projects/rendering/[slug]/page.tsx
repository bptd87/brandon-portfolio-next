import RenderingProjectDetailPage from "../../../../client/src/pages/RenderingProjectDetail";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";
import { getLocalRenderingProjectBySlug, getLocalRenderingProjects } from "../../../../shared/localPortfolios";

type RenderingProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getLocalRenderingProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: RenderingProjectPageProps) {
  const { slug } = await params;
  const project = getLocalRenderingProjectBySlug(slug);
  if (!project) return {};

  return buildPageMetadata({
    title: project.seoTitle || `${project.title} | Rendering`,
    description: project.seoDescription || project.excerpt,
    pathname: `/projects/rendering/${project.slug}`,
    image: project.coverImageUrl,
    keywords: project.seoKeywords || undefined,
    type: "article",
  });
}

export default async function Page({ params }: RenderingProjectPageProps) {
  const { slug } = await params;

  return (
    <NextPathProvider currentPath={`/projects/rendering/${slug}`}>
      <RenderingProjectDetailPage slug={slug} currentPath={`/projects/rendering/${slug}`} />
    </NextPathProvider>
  );
}
