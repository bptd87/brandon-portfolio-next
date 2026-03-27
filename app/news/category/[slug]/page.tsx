import { permanentRedirect } from "next/navigation";

import { resolveLegacyTagPath } from "../../../../shared/legacyRedirects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  if (slug.toLowerCase() === "assistant scenic design") {
    permanentRedirect("/assistant-scenic-design");
  }

  permanentRedirect(resolveLegacyTagPath(slug));
}
