import { permanentRedirect } from "next/navigation";

import { resolveLegacyTagPath } from "../../../../shared/legacyRedirects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(resolveLegacyTagPath(slug));
}
