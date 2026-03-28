import DimensionReferencePage from "../../../../client/src/pages/DimensionReference";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Dimension Reference for Scenic, Event, and Exhibit Design",
  description:
    "Reference dimensions for furniture, theatre, events, exhibits, and architecture in a fast mobile-friendly lookup tool.",
  pathname: "/studio/apps/dimension-reference",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/dimension-reference">
      <DimensionReferencePage />
    </NextPathProvider>
  );
}
