import ProjectsPage from "../../../client/src/pages/Projects";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Scenic Design Portfolio",
  description:
    "Portfolio of scenic design projects across musicals, plays, Shakespeare, and regional theatre.",
  pathname: "/projects/scenic-design",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/projects/scenic-design">
      <ProjectsPage />
    </NextPathProvider>
  );
}
