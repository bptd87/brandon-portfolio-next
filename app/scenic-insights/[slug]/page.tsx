import { notFound, permanentRedirect } from "next/navigation";

import { getLocalArticleBySlug } from "../../../shared/localArticles";
import { resolveLegacyArticlePath } from "../../../shared/legacyRedirects";

const LEGACY_ARTICLE_REDIRECTS: Record<string, string> = {
  "navigating-the-scenic-design-process-a-comprehensive-guide": "/articles/scenic-design-process",
  "the-art-of-presenting-theatre-design-a-guide-for-designers":
    "/articles/the-art-of-presenting-theatre-design-a-guide-for-designers",
  "sora-in-the-studio-testing-ais-potential-for-theatrical-design":
    "/articles/sora-in-the-studio-testing-ais-potential-for-theatrical-design",
  "the-lights-were-already-on-maude-adams-legacy-at-stephens-college":
    "/articles/the-lights-were-already-on-maude-adams-legacy-at-stephens-college",
  "empowering-theatre-production-students-with-computer-literacy":
    "/articles/empowering-theatre-students-with-computer-literacy",
  "golden-age-broadway":
    "/articles/the-golden-age-of-broadway-a-defining-era-in-musical-theatre",
  "opera-foundations": "/articles/operas-foundations-the-evolution-of-scenic-design-in-opera",
  "a-scenic-design-lesson-that-still-sticks":
    "/articles/youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision",
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const destination =
    LEGACY_ARTICLE_REDIRECTS[slug] || resolveLegacyArticlePath(slug) || (getLocalArticleBySlug(slug) ? `/articles/${slug}` : null);
  if (!destination) {
    notFound();
  }
  permanentRedirect(destination);
}
