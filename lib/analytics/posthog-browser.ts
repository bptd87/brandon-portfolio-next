"use client";

import posthog from "posthog-js";

import { readPublicEnv } from "../../client/src/lib/readPublicEnv";

type PostHogProperties = Record<string, string | number | boolean | null | undefined>;

let initialized = false;

function getPostHogKey() {
  return readPublicEnv("NEXT_PUBLIC_POSTHOG_KEY");
}

function getPostHogHost() {
  return readPublicEnv("NEXT_PUBLIC_POSTHOG_HOST") || "https://us.i.posthog.com";
}

export function isPostHogConfigured() {
  return Boolean(getPostHogKey());
}

export function initPostHog() {
  const apiKey = getPostHogKey();

  if (!apiKey || initialized) return false;

  posthog.init(apiKey, {
    api_host: getPostHogHost(),
    autocapture: false,
    capture_pageleave: false,
    capture_pageview: false,
    disable_session_recording: true,
  });

  initialized = true;
  return true;
}

export function capturePostHogEvent(event: string, properties: PostHogProperties = {}) {
  if (!initialized) return;
  posthog.capture(event, properties);
}

export function getTrackedPageType(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/articles/")) return "article";
  if (pathname.startsWith("/studio/tutorials/")) return "tutorial";
  if (pathname.startsWith("/projects/experiential/")) return "experiential-project";
  if (pathname.startsWith("/projects/rendering/")) return "rendering-project";
  if (pathname.startsWith("/project/")) return "scenic-project";
  if (pathname.startsWith("/projects/")) return "portfolio";
  return "page";
}

export function getDocumentTitle() {
  if (typeof document === "undefined") return "";
  return document.title.replace(/\s+\|\s+Brandon PT Davis$/u, "").trim();
}
