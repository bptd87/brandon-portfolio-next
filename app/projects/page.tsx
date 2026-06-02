import ProjectsPage from "../../client/src/pages/Projects";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";
import { getLocalScenicProjects } from "../../shared/localScenicProjects";
import { toScenicProjectSummary } from "../../shared/scenicProjectSummaries";

export const dynamic = "force-static";

const scenicMetadataImage = getLocalScenicProjects().find(
  (project) => project.coverImageUrl
)?.coverImageUrl;

export const metadata = buildPageMetadata({
  title: "Scenic Design Portfolio",
  description:
    "Scenic design portfolio by Brandon PT Davis, featuring theatre environments for plays, musicals, Shakespeare, and new work with production images and project credits.",
  pathname: "/projects",
  image: scenicMetadataImage,
  keywords:
    "scenic design portfolio, theatre set design, scenic designer, Brandon PT Davis, San Diego scenic designer",
});

export default function Page() {
  const projects = getLocalScenicProjects().map(toScenicProjectSummary);

  return (
    <NextPathProvider currentPath="/projects">
      <ProjectsPage initialProjects={projects} />
    </NextPathProvider>
  );
}
