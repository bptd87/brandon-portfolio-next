import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  captureAnalyticsEvent,
  capturePageView,
  captureProjectView,
  getPostHogDebugInfo,
} from "@/lib/posthog";

export function AnalyticsTracker() {
  const [location] = useLocation();

  useEffect(() => {
    capturePageView(location);
  }, [location]);

  useEffect(() => {
    (window as any).analyticsTracker = {
      trackProjectView: (projectId: number | undefined, projectSlug: string, projectTitle: string, discipline?: string, subcategory?: string) => {
        captureProjectView({
          projectId,
          projectSlug,
          projectTitle,
          discipline,
          subcategory,
        });
      },
      trackEvent: (eventType: string, eventData?: any) => {
        captureAnalyticsEvent(eventType, {
          ...eventData,
          pathname: location,
        });
      },
      getSessionId: () => getPostHogDebugInfo().sessionId,
    };
  }, [location]);

  return null;
}
