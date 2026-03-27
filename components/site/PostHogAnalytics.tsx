"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import {
  capturePostHogEvent,
  getDocumentTitle,
  getTrackedPageType,
  initPostHog,
  isPostHogConfigured,
} from "../../lib/analytics/posthog-browser";

function getViewEvent(pathname: string) {
  if (pathname.startsWith("/articles/")) return "article_viewed";
  if (pathname.startsWith("/studio/tutorials/")) return "tutorial_viewed";
  if (pathname.startsWith("/projects/experiential/")) return "project_viewed";
  if (pathname.startsWith("/projects/rendering/")) return "project_viewed";
  if (pathname.startsWith("/project/")) return "project_viewed";
  return null;
}

function getPortfolioType(pathname: string) {
  if (pathname.startsWith("/projects/experiential/")) return "experiential";
  if (pathname.startsWith("/projects/rendering/")) return "rendering";
  if (pathname.startsWith("/project/")) return "scenic";
  return null;
}

function getSlug(pathname: string) {
  return pathname.split("/").filter(Boolean).at(-1) || "";
}

export function PostHogAnalytics() {
  const pathname = usePathname() || "/";
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    if (!isPostHogConfigured()) return;
    initPostHog();
  }, []);

  useEffect(() => {
    if (!isPostHogConfigured() || lastTrackedPath.current === pathname) return;

    lastTrackedPath.current = pathname;

    const pageTitle = getDocumentTitle();
    const pageType = getTrackedPageType(pathname);

    capturePostHogEvent("$pageview", {
      pathname,
      page_title: pageTitle,
      page_type: pageType,
      $current_url: typeof window !== "undefined" ? window.location.href : pathname,
    });

    const viewEvent = getViewEvent(pathname);
    if (!viewEvent) return;

    const slug = getSlug(pathname);

    if (viewEvent === "article_viewed") {
      capturePostHogEvent(viewEvent, {
        pathname,
        page_title: pageTitle,
        page_type: pageType,
        article_slug: slug,
        article_title: pageTitle,
      });
      return;
    }

    if (viewEvent === "tutorial_viewed") {
      capturePostHogEvent(viewEvent, {
        pathname,
        page_title: pageTitle,
        page_type: pageType,
        tutorial_slug: slug,
        tutorial_title: pageTitle,
      });
      return;
    }

    capturePostHogEvent(viewEvent, {
      pathname,
      page_title: pageTitle,
      page_type: pageType,
      project_slug: slug,
      project_title: pageTitle,
      portfolio_type: getPortfolioType(pathname),
    });
  }, [pathname]);

  return null;
}
