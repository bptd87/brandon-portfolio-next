import StudioAppsPage from "../../../client/src/pages/StudioApps";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Studio Apps for Scenic Design Workflow",
  description:
    "Production-focused calculators, reference tools, and utilities for scenic drafting, paint, modeling, and research.",
  pathname: "/studio/apps",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps">
      <StudioAppsPage />
    </NextPathProvider>
  );
}
