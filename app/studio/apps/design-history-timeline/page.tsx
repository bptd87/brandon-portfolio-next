import DesignHistoryTimelinePage from "../../../../client/src/pages/DesignHistoryTimeline";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Design History Timeline for Architecture and Interiors",
  description:
    "A searchable reference timeline for architectural and interior design history, organized by period, region, palette, and major figures.",
  pathname: "/studio/apps/design-history-timeline",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/design-history-timeline">
      <DesignHistoryTimelinePage />
    </NextPathProvider>
  );
}
