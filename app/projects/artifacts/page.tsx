import ProjectArtifactsIndex from "../../../client/src/pages/ProjectArtifactsIndex";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Project Artifacts | Scenic Design Process",
  description:
    "A project-by-project index of scenic design artifacts including research, graphics, sketches, drafting, and paint elevations.",
  pathname: "/projects/artifacts",
  type: "website",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/projects/artifacts">
      <ProjectArtifactsIndex />
    </NextPathProvider>
  );
}
