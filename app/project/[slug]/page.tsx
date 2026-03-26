import ScenicProjectDetailPage from "../../../client/src/pages/ScenicProjectDetail";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";
import { getLocalScenicProjectBySlug, getLocalScenicProjects } from "../../../shared/localScenicProjects";

type ScenicProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getLocalScenicProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ScenicProjectPageProps) {
  const { slug } = await params;
  const project = getLocalScenicProjectBySlug(slug);
  if (!project) return {};

  return buildPageMetadata({
    title: project.seoTitle || `${project.title} | Scenic Design`,
    description: project.seoDescription || project.excerpt,
    pathname: `/project/${project.slug}`,
    image: project.coverImageUrl,
    keywords: project.seoKeywords || undefined,
    type: "article",
  });
}

export default async function Page({ params }: ScenicProjectPageProps) {
  const { slug } = await params;
  return (
    <NextPathProvider currentPath={`/project/${slug}`}>
      <ScenicProjectDetailPage slug={slug} currentPath={`/project/${slug}`} />
    </NextPathProvider>
  );
}
