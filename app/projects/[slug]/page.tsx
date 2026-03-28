import { notFound, permanentRedirect } from "next/navigation";
import { getLocalScenicProjects } from "../../../shared/localScenicProjects";
import { resolveLegacyProjectPath } from "../../../shared/legacyRedirects";

type ScenicAliasPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getLocalScenicProjects().map((project) => ({ slug: project.slug }));
}

export default async function Page({ params }: ScenicAliasPageProps) {
  const { slug } = await params;
  const destination = resolveLegacyProjectPath(slug);
  if (!destination) {
    notFound();
  }
  permanentRedirect(destination);
}
