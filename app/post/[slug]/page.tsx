import { notFound, permanentRedirect } from "next/navigation";

import { getLocalArticleBySlug } from "../../../shared/localArticles";
import { resolveLegacyArticlePath } from "../../../shared/legacyRedirects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const destination = getLocalArticleBySlug(slug) ? `/articles/${slug}` : resolveLegacyArticlePath(slug);
  if (!destination) {
    notFound();
  }
  permanentRedirect(destination);
}
