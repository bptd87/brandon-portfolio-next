type HeaderCheck = {
  path: string;
  requiredCacheControlParts: string[];
};

const baseUrl = process.env.HEADER_CHECK_BASE_URL ?? "http://localhost:8080";

const feedAndSeoChecks: HeaderCheck[] = [
  { path: "/sitemap.xml", requiredCacheControlParts: ["public", "max-age=900", "s-maxage=3600"] },
  { path: "/image-sitemap.xml", requiredCacheControlParts: ["public", "max-age=900", "s-maxage=3600"] },
  { path: "/video-sitemap.xml", requiredCacheControlParts: ["public", "max-age=900", "s-maxage=3600"] },
  { path: "/sitemap-index.xml", requiredCacheControlParts: ["public", "max-age=900", "s-maxage=3600"] },
  { path: "/robots.txt", requiredCacheControlParts: ["public", "max-age=900", "s-maxage=3600"] },
  { path: "/api/news/rss", requiredCacheControlParts: ["public", "max-age=3600"] },
  { path: "/articles/rss.xml", requiredCacheControlParts: ["public", "max-age=900", "s-maxage=3600"] },
  { path: "/news/rss.xml", requiredCacheControlParts: ["public", "max-age=900", "s-maxage=3600"] },
  { path: "/studio/tutorials/rss.xml", requiredCacheControlParts: ["public", "max-age=900", "s-maxage=3600"] },
];

function fail(message: string): never {
  throw new Error(message);
}

async function fetchHeaders(path: string, extraHeaders?: HeadersInit): Promise<Headers> {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    method: "GET",
    headers: extraHeaders,
    redirect: "manual",
  });
  if (!response.ok) {
    fail(`Expected 2xx for ${path}, got ${response.status}`);
  }
  return response.headers;
}

async function getRuntimeEnv(): Promise<string> {
  const response = await fetch(`${baseUrl}/health`, { method: "GET" });
  if (!response.ok) {
    fail(`Unable to read /health (${response.status}). Is the server running at ${baseUrl}?`);
  }
  const data = (await response.json()) as { env?: { NODE_ENV?: string } };
  return data.env?.NODE_ENV ?? "unknown";
}

async function assertFeedAndSeoCacheHeaders() {
  for (const check of feedAndSeoChecks) {
    const headers = await fetchHeaders(check.path);
    const cacheControl = headers.get("cache-control") ?? "";
    for (const expectedPart of check.requiredCacheControlParts) {
      if (!cacheControl.includes(expectedPart)) {
        fail(`[${check.path}] Missing cache-control part "${expectedPart}". Got: "${cacheControl}"`);
      }
    }
  }
}

async function assertCompressionInProduction() {
  const headers = await fetchHeaders("/sitemap.xml", { "Accept-Encoding": "gzip,br" });
  const encoding = headers.get("content-encoding") ?? "";
  if (!encoding) {
    fail(`Expected content-encoding in production for /sitemap.xml, got empty header`);
  }
  if (encoding !== "br" && encoding !== "gzip") {
    fail(`Expected content-encoding br or gzip, got "${encoding}"`);
  }
}

async function assertStaticCacheInProduction() {
  const headers = await fetchHeaders("/");
  const cacheControl = headers.get("cache-control") ?? "";
  if (!cacheControl.includes("no-cache")) {
    fail(`[ / ] Expected no-cache for index document, got "${cacheControl}"`);
  }
}

async function main() {
  const nodeEnv = await getRuntimeEnv();
  await assertFeedAndSeoCacheHeaders();

  if (nodeEnv === "production") {
    await assertCompressionInProduction();
    await assertStaticCacheInProduction();
    console.log(`Header checks passed for production at ${baseUrl}`);
    return;
  }

  console.log(`Header checks passed for ${nodeEnv} at ${baseUrl} (production-only checks skipped)`);
}

main().catch((error: unknown) => {
  console.error("[check-cache-headers] failed");
  console.error(error);
  process.exit(1);
});
