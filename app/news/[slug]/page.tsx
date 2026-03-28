import { notFound, permanentRedirect } from "next/navigation";

import { buildPageMetadata } from "../../../lib/metadata";
import { getLegacyCanonicalDestination } from "../../../shared/publicContent";

type NewsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const destination = getLegacyCanonicalDestination(slug);

  return buildPageMetadata({
    title: "Legacy News Entry",
    description:
      "Legacy news entries are being consolidated into articles and assistant scenic design content.",
    pathname: `/news/${slug}`,
    noindex: true,
    type: "article",
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const destination = getLegacyCanonicalDestination(slug);

  if (destination) {
    permanentRedirect(destination.displayPath);
  }

  notFound();
}
