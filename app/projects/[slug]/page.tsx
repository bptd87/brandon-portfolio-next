import { notFound, permanentRedirect } from "next/navigation";
import { resolveLegacyProjectPath } from "../../../shared/legacyRedirects";

type ScenicAliasPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: ScenicAliasPageProps) {
  const { slug } = await params;
  const destination = resolveLegacyProjectPath(slug);
  if (!destination) {
    notFound();
  }
  permanentRedirect(destination);
}
