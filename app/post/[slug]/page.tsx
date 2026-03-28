import { notFound, permanentRedirect } from "next/navigation";

import { getLocalArticleBySlug } from "../../../shared/localArticles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (!getLocalArticleBySlug(slug)) {
    notFound();
  }
  permanentRedirect(`/articles/${slug}`);
}
