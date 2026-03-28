import RenderingPortfolioPage from "../../../client/src/pages/RenderingPortfolio";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Rendering Portfolio",
  description:
    "Theatre renderings and scenic visualization studies by Brandon PT Davis, showing concept atmosphere, spatial rhythm, and communication before production build.",
  pathname: "/projects/rendering",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/projects/rendering">
      <RenderingPortfolioPage />
    </NextPathProvider>
  );
}
