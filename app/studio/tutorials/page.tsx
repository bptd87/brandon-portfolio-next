import StudioTutorialsPage from "../../../client/src/pages/StudioTutorials";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Vectorworks Tutorials | Brandon PT Davis",
  description:
    "Vectorworks tutorials for scenic designers covering drafting, modeling, rendering, and production workflow.",
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
