import { permanentRedirect } from "next/navigation";

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
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(LEGACY_ARTICLE_REDIRECTS[slug] || "/articles");
}
