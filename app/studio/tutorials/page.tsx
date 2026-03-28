import StudioTutorialsPage from "../../../client/src/pages/StudioTutorials";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Vectorworks Tutorials for Scenic Designers",
  description:
    "Step-by-step Vectorworks tutorials for scenic designers covering drafting, 3D modeling, rendering, and production-ready workflow.",
  pathname: "/studio/tutorials",
  type: "article",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/tutorials">
      <StudioTutorialsPage />
    </NextPathProvider>
  );
}
