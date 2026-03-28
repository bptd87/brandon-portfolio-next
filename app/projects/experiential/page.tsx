import ExperientialPortfolioPage from "../../../client/src/pages/ExperientialPortfolio";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Experiential Design Portfolio",
  description:
    "Experiential design case studies combining renderings, technical drawing, and live event documentation to show concept, coordination, and built outcome.",
  pathname: "/projects/experiential",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/projects/experiential">
      <ExperientialPortfolioPage />
    </NextPathProvider>
  );
}
