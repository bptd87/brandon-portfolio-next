import ExperientialPortfolioPage from "../../../client/src/pages/ExperientialPortfolio";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";
import { getLocalExperientialProjects } from "../../../shared/localPortfolios";

export const dynamic = "force-static";

const experientialMetadataImage = getLocalExperientialProjects().find(
  (project) => project.coverImageUrl
)?.coverImageUrl;

export const metadata = buildPageMetadata({
  title: "Experiential Design Portfolio",
  description:
    "Experiential design portfolio by Brandon PT Davis, extending scenic design methods into immersive environments, brand activations, renderings, drafting, and finished work.",
  pathname: "/projects/experiential",
  image: experientialMetadataImage,
  keywords:
    "experiential design portfolio, immersive environment design, scenic design methods, event design, Brandon PT Davis",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/projects/experiential">
      <ExperientialPortfolioPage />
    </NextPathProvider>
  );
}
