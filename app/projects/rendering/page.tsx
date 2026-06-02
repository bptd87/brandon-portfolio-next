import RenderingPortfolioPage from "../../../client/src/pages/RenderingPortfolio";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";
import {
  getLocalRenderingGallery,
  getLocalRenderingProjects,
} from "../../../shared/localPortfolios";

export const dynamic = "force-static";

const renderingMetadataImage =
  getLocalRenderingProjects().find((project) => project.coverImageUrl)?.coverImageUrl ||
  getLocalRenderingGallery().find((item) => item.project?.coverImageUrl)?.project?.coverImageUrl;

export const metadata = buildPageMetadata({
  title: "Scenic Rendering Portfolio",
  description:
    "Scenic rendering portfolio by Brandon PT Davis, showing theatre concept renderings and visual studies used to test atmosphere, scale, and design intent before production.",
  pathname: "/projects/rendering",
  image: renderingMetadataImage,
  keywords:
    "scenic rendering portfolio, theatre renderings, scenic design renderings, stage design visualization, Brandon PT Davis",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/projects/rendering">
      <RenderingPortfolioPage />
    </NextPathProvider>
  );
}
