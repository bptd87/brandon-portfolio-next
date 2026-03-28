import ProjectsPage from "../../client/src/pages/Projects";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Scenic Design Portfolio",
  description:
    "Selected scenic design projects for musicals, plays, and Shakespeare, with production images, credits, and story-led environments developed for theatre.",
  pathname: "/projects",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/projects">
      <ProjectsPage />
    </NextPathProvider>
  );
}
