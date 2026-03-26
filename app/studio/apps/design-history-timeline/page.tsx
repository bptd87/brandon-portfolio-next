import DesignHistoryTimelinePage from "../../../../client/src/pages/DesignHistoryTimeline";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";

export const dynamic = "force-static";

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/design-history-timeline">
      <DesignHistoryTimelinePage />
    </NextPathProvider>
  );
}
