import { notFound, permanentRedirect } from "next/navigation";

import { resolveLegacyProjectPath, resolveLegacyTagPath } from "../../../shared/legacyRedirects";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const [first, second] = slug || [];

  if (first === "tag" || first === "category") {
    const destination = resolveLegacyTagPath(second);
    if (!destination) notFound();
    permanentRedirect(destination);
  }

  const destination = resolveLegacyProjectPath(first);
  if (!destination) notFound();
  permanentRedirect(destination);
}
