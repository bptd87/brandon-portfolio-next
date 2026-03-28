import { notFound, permanentRedirect } from "next/navigation";

import { resolveLegacyTagPath } from "../../../../shared/legacyRedirects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const destination = resolveLegacyTagPath(slug);
  if (!destination) {
    notFound();
  }
  permanentRedirect(destination);
}
