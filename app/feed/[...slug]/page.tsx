import { permanentRedirect } from "next/navigation";

import { resolveLegacyProjectPath, resolveLegacyTagPath } from "../../../shared/legacyRedirects";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const [first, second] = slug || [];

  if (first === "tag" || first === "category") {
    permanentRedirect(resolveLegacyTagPath(second));
  }

  permanentRedirect(resolveLegacyProjectPath(first));
}
