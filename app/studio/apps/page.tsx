import StudioAppsPage from "../../../client/src/pages/StudioApps";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Studio Apps",
  description:
    "Interactive tools and utilities for scenic design workflow, drafting, and visualization.",
  pathname: "/studio/apps",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps">
      <StudioAppsPage />
    </NextPathProvider>
  );
}
