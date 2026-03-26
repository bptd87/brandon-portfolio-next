import RenderingPortfolioPage from "../../../client/src/pages/RenderingPortfolio";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Rendering Portfolio",
  description:
    "Concept images, scenic visualization studies, and rendering projects by Brandon PT Davis.",
  pathname: "/projects/rendering",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/projects/rendering">
      <RenderingPortfolioPage />
    </NextPathProvider>
  );
}
