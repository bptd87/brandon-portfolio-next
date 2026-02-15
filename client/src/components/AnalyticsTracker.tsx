import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

// Generate or retrieve session ID
const getSessionId = (): string => {
  const key = 'analytics_session_id';
  let sessionId = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, sessionId);
    }
  }
  return sessionId;
};

export function AnalyticsTracker() {
  const [location] = useLocation();
  const sessionIdRef = useRef<string>(getSessionId());
  const trackPageMutation = trpc.analytics.trackPageView.useMutation();
  const trackProjectMutation = trpc.analytics.trackProjectView.useMutation();
  const trackEventMutation = trpc.analytics.trackEvent.useMutation();

  // Track page views
  useEffect(() => {
    trackPageMutation.mutate({
      sessionId: sessionIdRef.current,
      pagePath: location,
      userAgent: navigator.userAgent
    });
  }, [location]);

  // Export functions for use in other components
  useEffect(() => {
    (window as any).analyticsTracker = {
      trackProjectView: (projectId: number | undefined, projectSlug: string, projectTitle: string, discipline?: string, subcategory?: string) => {
        trackProjectMutation.mutate({
          sessionId: sessionIdRef.current,
          projectId,
          projectSlug,
          projectTitle,
          discipline,
          subcategory
        });
      },
      trackEvent: (eventType: string, eventData?: any) => {
        trackEventMutation.mutate({
          sessionId: sessionIdRef.current,
          eventType,
          eventData,
          pagePath: location
        });
      },
      getSessionId: () => sessionIdRef.current
    };
  }, [location, trackProjectMutation, trackEventMutation]);

  return null; // Renderless component
}
