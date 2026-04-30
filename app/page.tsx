import HomePage from "../client/src/pages/Home";
import { NextPathProvider } from "../components/routing/NextPathProvider";
import { JsonLdScript } from "../components/seo/JsonLdScript";
import { absoluteUrl, buildPageMetadata } from "../lib/metadata";
import { getBreadcrumbJsonLd } from "../lib/seo/entities";
import { getLocalScenicProjects } from "../shared/localScenicProjects";
import { toScenicProjectSummary } from "../shared/scenicProjectSummaries";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Brandon PT Davis | Scenic Designer Portfolio",
  description:
    "Brandon PT Davis is a scenic designer creating theatre environments, concept renderings, and experiential design work for regional productions, universities, and branded spaces.",
  pathname: "/",
});

export default function Page() {
  const projects = getLocalScenicProjects().map(toScenicProjectSummary);

  return (
    <>
      <JsonLdScript
        id="home-breadcrumb-json-ld"
        data={getBreadcrumbJsonLd([{ name: "Home", url: absoluteUrl("/") }])}
      />
      <NextPathProvider currentPath="/">
        <HomePage initialProjects={projects} />
      </NextPathProvider>
    </>
  );
}
