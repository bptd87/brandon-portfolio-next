import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY?.trim();
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST?.trim();

let initialized = false;

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function isPostHogEnabled() {
  return Boolean(POSTHOG_KEY && POSTHOG_HOST);
}

export function initPostHog() {
  if (!isPostHogEnabled() || initialized || typeof window === "undefined") {
    return;
  }

  posthog.init(POSTHOG_KEY!, {
    api_host: POSTHOG_HOST,
    defaults: "2026-01-30",
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
  });

  initialized = true;
}

export function capturePageView(path: string) {
  if (!isPostHogEnabled() || typeof window === "undefined") return;

  const pathname = normalizePath(path);
  posthog.capture("$pageview", {
    $current_url: window.location.href,
    pathname,
  });
}

export function captureProjectView(input: {
  projectId?: number;
  projectSlug: string;
  projectTitle: string;
  discipline?: string;
  subcategory?: string;
}) {
  if (!isPostHogEnabled()) return;

  posthog.capture("project_viewed", {
    project_id: input.projectId,
    project_slug: input.projectSlug,
    project_title: input.projectTitle,
    discipline: input.discipline,
    subcategory: input.subcategory,
  });
}

export function captureAnalyticsEvent(eventName: string, properties?: Record<string, unknown>) {
  if (!isPostHogEnabled()) return;
  posthog.capture(eventName, properties);
}

export function getPostHogDebugInfo() {
  return {
    enabled: isPostHogEnabled(),
    host: POSTHOG_HOST || null,
    keyPreview: POSTHOG_KEY ? `${POSTHOG_KEY.slice(0, 8)}...${POSTHOG_KEY.slice(-6)}` : null,
    distinctId: isPostHogEnabled() ? posthog.get_distinct_id() : null,
    sessionId:
      typeof posthog.get_session_id === "function" ? posthog.get_session_id() : null,
  };
}

export default posthog;
