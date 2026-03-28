import { permanentRedirect } from "next/navigation";
import { notFound } from "next/navigation";

import { resolveLegacyTagPath } from "../../../../shared/legacyRedirects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const normalized = slug.toLowerCase().replace(/[\s_]+/g, "-");

  if (normalized === "assistant-scenic-design") {
    permanentRedirect("/assistant-scenic-design");
  }

  const destination = resolveLegacyTagPath(slug);
  if (!destination) {
    notFound();
  }
  permanentRedirect(destination);
}
