import ExperientialPortfolioPage from "../../../client/src/pages/ExperientialPortfolio";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Experiential Design Portfolio",
  description:
    "Experiential design projects spanning renderings, technical drawings, and live event documentation.",
  pathname: "/projects/experiential",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/projects/experiential">
      <ExperientialPortfolioPage />
    </NextPathProvider>
  );
}
