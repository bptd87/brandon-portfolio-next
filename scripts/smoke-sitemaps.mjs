#!/usr/bin/env node
import process from "node:process";

const base = (process.argv[2] || process.env.SMOKE_BASE_URL || "https://www.brandonptdavis.com").replace(/\/+$/, "");

const checks = [
  { path: "/sitemap.xml", expectStatus: 200, expectContentType: "xml" },
  { path: "/image-sitemap.xml", expectStatus: 200, expectContentType: "xml" },
  { path: "/video-sitemap.xml", expectStatus: 200, expectContentType: "xml" },
  { path: "/projects/rss.xml", expectStatus: 200, expectContentType: "xml" },
  { path: "/project/rss.xml", expectStatus: 301, expectLocation: "/projects/rss.xml" },
  { path: "/articles/rss.xml", expectStatus: 200, expectContentType: "xml" },
  { path: "/news/rss.xml", expectStatus: 200, expectContentType: "xml" },
];

async function run() {
  let failed = 0;

  for (const check of checks) {
    const url = `${base}${check.path}`;
    let response;
    try {
      response = await fetch(url, { redirect: "manual" });
    } catch (error) {
      failed += 1;
      console.error(`FAIL ${check.path} network error: ${String(error)}`);
      continue;
    }

    const statusOk = response.status === check.expectStatus;
    const contentType = response.headers.get("content-type") || "";
    const location = response.headers.get("location") || "";
    const contentTypeOk = check.expectContentType
      ? contentType.toLowerCase().includes(check.expectContentType)
      : true;
    const locationOk = check.expectLocation
      ? location.endsWith(check.expectLocation) || location === check.expectLocation
      : true;

    if (statusOk && contentTypeOk && locationOk) {
      console.log(`PASS ${check.path} status=${response.status}${contentType ? ` content-type=${contentType}` : ""}${location ? ` location=${location}` : ""}`);
      continue;
    }

    failed += 1;
    console.error(
      `FAIL ${check.path} expected status=${check.expectStatus}` +
        `${check.expectContentType ? ` content-type~=${check.expectContentType}` : ""}` +
        `${check.expectLocation ? ` location~=${check.expectLocation}` : ""}` +
        ` got status=${response.status}` +
        `${contentType ? ` content-type=${contentType}` : ""}` +
        `${location ? ` location=${location}` : ""}`
    );
  }

  if (failed > 0) {
    console.error(`Smoke checks failed: ${failed}`);
    process.exit(1);
  }

  console.log("All sitemap/RSS smoke checks passed.");
}

run();
