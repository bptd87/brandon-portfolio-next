import { notFound } from "next/navigation";
import ProjectArtifactDetail from "../../../../client/src/pages/ProjectArtifactDetail";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";
import {
  getProjectArtifactCollectionBySlug,
  getProjectArtifactCollections,
} from "../../../../shared/projectArtifacts";

type ProjectArtifactPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getProjectArtifactCollections().map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: ProjectArtifactPageProps) {
  const { slug } = await params;
  const collection = getProjectArtifactCollectionBySlug(slug);
  if (!collection) return {};

  return buildPageMetadata({
    title: `${collection.projectTitle} Artifacts | Scenic Design Process`,
    description: collection.summary,
    pathname: `/projects/artifacts/${collection.slug}`,
    image: collection.coverImageUrl,
    type: "article",
  });
}

export default async function Page({ params }: ProjectArtifactPageProps) {
  const { slug } = await params;
  const collection = getProjectArtifactCollectionBySlug(slug);
  if (!collection) notFound();

  return (
    <NextPathProvider currentPath={`/projects/artifacts/${slug}`}>
      <ProjectArtifactDetail slug={slug} />
    </NextPathProvider>
  );
}
