import Navigation from "../../client/src/pages/Navigation";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";
import { getLocalScenicProjects } from "../../shared/localScenicProjects";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Navigation | Brandon PT Davis",
  description:
    "Navigate Brandon PT Davis scenic design portfolio, studio tools, about page, and recent scenic design work.",
  pathname: "/navigation",
  keywords:
    "Brandon PT Davis navigation, scenic design portfolio, studio tools, scenic designer",
});

export default function Page() {
  const projects = getLocalScenicProjects();

  return (
    <NextPathProvider currentPath="/navigation">
      <Navigation initialProjects={projects} />
    </NextPathProvider>
  );
}
