import TutorialDetailPage from "../../../../client/src/pages/TutorialDetail";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";
import { getLocalTutorialBySlug, getLocalTutorials } from "../../../../shared/localStudio";

type TutorialPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getLocalTutorials().map((tutorial) => ({ slug: tutorial.slug }));
}

export async function generateMetadata({ params }: TutorialPageProps) {
  const { slug } = await params;
  const tutorial = getLocalTutorialBySlug(slug);
  if (!tutorial) return {};

  return buildPageMetadata({
    title: tutorial.seo_title || tutorial.title,
    description:
      tutorial.seo_description ||
      tutorial.description ||
      tutorial.overview ||
      `${tutorial.title} tutorial by Brandon PT Davis.`,
    pathname: `/studio/tutorials/${tutorial.slug}`,
    image: tutorial.cover_image || undefined,
    keywords: tutorial.seo_keywords || undefined,
    type: "article",
  });
}

export default async function Page({ params }: TutorialPageProps) {
  const { slug } = await params;

  return (
    <NextPathProvider currentPath={`/studio/tutorials/${slug}`}>
      <TutorialDetailPage slug={slug} />
    </NextPathProvider>
  );
}
