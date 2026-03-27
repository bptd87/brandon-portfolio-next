import { permanentRedirect } from "next/navigation";

import { resolveLegacyTutorialPath } from "../../../../../shared/legacyRedirects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(resolveLegacyTutorialPath(slug));
}
