import HomePage from "../client/src/pages/Home";
import { NextPathProvider } from "../components/routing/NextPathProvider";
import { buildPageMetadata } from "../lib/metadata";
import { getLocalScenicProjects } from "../shared/localScenicProjects";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Brandon PT Davis | Scenic Designer Portfolio",
  description:
    "Brandon PT Davis is a scenic designer creating theatre environments, concept renderings, and experiential design work for regional productions, universities, and branded spaces.",
  pathname: "/",
});

export default function Page() {
  const projects = getLocalScenicProjects();

  return (
    <NextPathProvider currentPath="/">
      <HomePage initialProjects={projects} />
    </NextPathProvider>
  );
}
