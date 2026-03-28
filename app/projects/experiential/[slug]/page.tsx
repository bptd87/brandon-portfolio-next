import ExperientialProjectDetailPage from "../../../../client/src/pages/ExperientialProjectDetail";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";
import { notFound } from "next/navigation";
import { getLocalExperientialProjectBySlug, getLocalExperientialProjects } from "../../../../shared/localPortfolios";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return getLocalExperientialProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getLocalExperientialProjectBySlug(slug);
  if (!project) return {};

  return buildPageMetadata({
    title: project.seoTitle || `${project.title} | Experiential Design`,
    description: project.seoDescription || project.summary,
    pathname: `/projects/experiential/${project.slug}`,
    image: project.coverImageUrl,
    type: "article",
  });
}

export default async function Page({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getLocalExperientialProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <NextPathProvider currentPath={`/projects/experiential/${slug}`}>
      <ExperientialProjectDetailPage slug={slug} currentPath={`/projects/experiential/${slug}`} />
    </NextPathProvider>
  );
}
