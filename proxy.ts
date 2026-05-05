import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getConfiguredSiteUrl } from "./lib/env/site";

const LEGACY_PATH_REDIRECTS = new Map<string, string>([
  ["/home", "/"],
  ["/directory", "/studio/directory"],
  ["/scale-converter", "/studio/apps/scale-calculator"],
  ["/feed", "/articles/rss.xml"],
  ["/scenic-studio", "/studio"],
  ["/resources/scenic-design-studio", "/studio/tutorials"],
  ["/scenic-insights", "/articles"],
  ["/scenic-insights-all", "/articles"],
  ["/scenic-insights-design-philosophy", "/articles"],
  ["/scenic-insights-technology-tutorials", "/studio/tutorials"],
  ["/tags/stagescenela", "/articles"],
  ["/tags/kenrick-fischer", "/projects"],
  ["/tags/parliament-square", "/project/parliament-square"],
]);

const LOW_VALUE_QUERY_PARAMS = new Set([
  "tag",
  "category",
  "discipline",
  "album_id",
  "year",
  "sort",
  "view",
  "series",
]);

function isLocalDevelopmentHost(host?: string | null) {
  if (!host) return false;

  const normalizedHost = host.toLowerCase();
  const bareHost = normalizedHost.replace(/:\d+$/, "");

  return (
    normalizedHost.startsWith("localhost:") ||
    normalizedHost === "localhost" ||
    normalizedHost.startsWith("127.0.0.1:") ||
    normalizedHost === "127.0.0.1" ||
    normalizedHost.startsWith("[::1]:") ||
    normalizedHost === "[::1]" ||
    bareHost.endsWith(".local")
  );
}

function hasLowValueArchiveQuery(searchParams: URLSearchParams) {
  for (const key of LOW_VALUE_QUERY_PARAMS) {
    if (searchParams.has(key)) return true;
  }
  return false;
}

function stripLowValueArchiveQueries(url: URL) {
  let changed = false;

  for (const key of LOW_VALUE_QUERY_PARAMS) {
    if (!url.searchParams.has(key)) continue;
    url.searchParams.delete(key);
    changed = true;
  }

  return changed;
}

function getLegacyRedirectPath(url: URL) {
  const exactRedirect = LEGACY_PATH_REDIRECTS.get(url.pathname);
  if (exactRedirect) return exactRedirect;

  if (url.pathname === "/portfolio") {
    const normalized = String(url.searchParams.get("filter") || "")
      .trim()
      .toLowerCase();

    switch (normalized) {
      case "rendering":
        return "/projects/rendering";
      case "experiential":
      case "documentation":
        return "/projects/experiential";
      case "scenic":
      case "":
        return "/projects";
      default:
        return "/projects";
    }
  }

  if (url.pathname === "/projects") {
    const normalized = String(url.searchParams.get("discipline") || "")
      .trim()
      .toLowerCase();

    switch (normalized) {
      case "rendering":
        return "/projects/rendering";
      case "experiential":
      case "documentation":
      case "live-events":
        return "/projects/experiential";
      case "scenic":
      case "":
        return null;
      default:
        return "/projects";
    }
  }

  return null;
}

function buildRedirectResponse(request: NextRequest, destinationPath: string) {
  const redirectUrl = request.nextUrl.clone();
  const canonicalSiteUrl = new URL(getConfiguredSiteUrl());
  redirectUrl.protocol = canonicalSiteUrl.protocol;
  redirectUrl.host = canonicalSiteUrl.host;
  redirectUrl.pathname = destinationPath;
  redirectUrl.search = "";
  const response = NextResponse.redirect(redirectUrl, 308);
  response.headers.set("X-Robots-Tag", "noindex, follow");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const canonicalSiteUrl = new URL(getConfiguredSiteUrl());
  const canonicalHost = canonicalSiteUrl.host;
  const requestHost = request.headers.get("host");
  const legacyRedirectPath = getLegacyRedirectPath(request.nextUrl);

  if (legacyRedirectPath) {
    return buildRedirectResponse(request, legacyRedirectPath);
  }

  if (requestHost && requestHost !== canonicalHost && !isLocalDevelopmentHost(requestHost)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.host = canonicalHost;
    redirectUrl.protocol = canonicalSiteUrl.protocol;
    return NextResponse.redirect(redirectUrl, 308);
  }

  if (hasLowValueArchiveQuery(searchParams)) {
    const redirectUrl = request.nextUrl.clone();
    if (stripLowValueArchiveQueries(redirectUrl)) {
      redirectUrl.host = canonicalHost;
      redirectUrl.protocol = canonicalSiteUrl.protocol;
      const response = NextResponse.redirect(redirectUrl, 308);
      response.headers.set("X-Robots-Tag", "noindex, follow");
      return response;
    }
  }

  const response = NextResponse.next();

  if (pathname === "/search") {
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }

  if (hasLowValueArchiveQuery(searchParams)) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
