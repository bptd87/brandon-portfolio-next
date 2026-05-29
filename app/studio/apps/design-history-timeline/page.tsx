import DesignHistoryTimelinePage from "../../../../client/src/pages/DesignHistoryTimeline";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = {
  ...buildPageMetadata({
    title: "Design History Timeline for Architecture and Interiors",
    description:
      "A searchable reference timeline for architectural and interior design history, organized by period, region, palette, and major figures.",
    pathname: "/studio/apps/design-history-timeline",
    image: "/assets/studio-apps/icons/design-history-timeline.jpg",
  }),
  appleWebApp: {
    capable: true,
    title: "History",
    statusBarStyle: "default",
  },
  icons: {
    apple: [
      {
        url: "/assets/studio-apps/icons/design-history-timeline-touch.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/design-history-timeline">
      <DesignHistoryTimelinePage />
    </NextPathProvider>
  );
}
