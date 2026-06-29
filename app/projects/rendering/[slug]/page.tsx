import { permanentRedirect } from "next/navigation";

import { getLocalRenderingProjects } from "../../../../shared/localPortfolios";

type RenderingProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return getLocalRenderingProjects().map((project) => ({ slug: project.slug }));
}

export default async function Page({ params }: RenderingProjectPageProps) {
  await params;
  permanentRedirect("/projects/rendering");
}
