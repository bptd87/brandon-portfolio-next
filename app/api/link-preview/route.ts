import { NextResponse } from "next/server";

const MAX_HTML_BYTES = 220_000;
const REQUEST_TIMEOUT_MS = 4_500;
const SCREENSHOT_RETRIES = 3;
const SCREENSHOT_RETRY_DELAY_MS = 900;
const SCREENSHOT_WIDTH = 520;

type ScreenshotResult = {
  imageSrc: string;
  status: "ready" | "pending" | "unavailable";
};

function getScreenshotUrl(previewUrl: URL) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(previewUrl.toString())}?w=${SCREENSHOT_WIDTH}`;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isBlockedHostname(hostname: string) {
  const normalized = hostname.toLowerCase();

  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized.endsWith(".local") ||
    normalized.startsWith("10.") ||
    normalized.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalized)
  );
}

function getAttribute(tag: string, name: string) {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
  return match?.[1]?.trim() || "";
}

function getMetaImage(html: string) {
  const tags = html.match(/<meta\s+[^>]*>/gi) || [];
  const preferredKeys = new Set([
    "og:image",
    "og:image:secure_url",
    "twitter:image",
    "twitter:image:src",
  ]);

  for (const tag of tags) {
    const key = getAttribute(tag, "property") || getAttribute(tag, "name");
    if (!preferredKeys.has(key.toLowerCase())) continue;

    const content = getAttribute(tag, "content");
    if (content) return content;
  }

  return "";
}

function toAbsoluteImageUrl(imageUrl: string, pageUrl: URL) {
  try {
    const absoluteUrl = new URL(imageUrl, pageUrl);
    if (absoluteUrl.protocol !== "https:" && absoluteUrl.protocol !== "http:") return "";

    return absoluteUrl.toString();
  } catch {
    return "";
  }
}

async function checkScreenshotUrl(previewUrl: URL): Promise<ScreenshotResult> {
  const screenshotUrl = getScreenshotUrl(previewUrl);

  try {
    const response = await fetch(screenshotUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const contentType = response.headers.get("content-type") || "";

    if (
      response.ok &&
      contentType.startsWith("image/") &&
      !response.url.includes("/mshots/v1/default")
    ) {
      return { imageSrc: screenshotUrl, status: "ready" };
    }

    if (response.ok && response.url.includes("/mshots/v1/default")) {
      return { imageSrc: "", status: "pending" };
    }
  } catch {
    return { imageSrc: "", status: "unavailable" };
  }

  return { imageSrc: "", status: "unavailable" };
}

async function getVerifiedScreenshotUrl(previewUrl: URL): Promise<ScreenshotResult> {
  let latestResult: ScreenshotResult = { imageSrc: "", status: "unavailable" };

  for (let attempt = 0; attempt < SCREENSHOT_RETRIES; attempt += 1) {
    latestResult = await checkScreenshotUrl(previewUrl);

    if (latestResult.status === "ready") return latestResult;
    if (latestResult.status !== "pending") break;
    if (attempt < SCREENSHOT_RETRIES - 1) await wait(SCREENSHOT_RETRY_DELAY_MS);
  }

  return latestResult;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || "";

  let previewUrl: URL;

  try {
    previewUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ imageSrc: "" }, { status: 400 });
  }

  if (
    (previewUrl.protocol !== "https:" && previewUrl.protocol !== "http:") ||
    isBlockedHostname(previewUrl.hostname)
  ) {
    return NextResponse.json({ imageSrc: "" }, { status: 400 });
  }

  let screenshotStatus: ScreenshotResult["status"] = "unavailable";

  try {
    const screenshotResult = await getVerifiedScreenshotUrl(previewUrl);
    screenshotStatus = screenshotResult.status;

    if (screenshotResult.imageSrc) {
      return NextResponse.json(
        { imageSrc: screenshotResult.imageSrc, source: "screenshot" },
        {
          headers: {
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        }
      );
    }

    const response = await fetch(previewUrl, {
      headers: {
        "User-Agent": "Brandon PT Davis portfolio link preview",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return NextResponse.json({ imageSrc: "" }, { status: 200 });
    }

    const html = (await response.text()).slice(0, MAX_HTML_BYTES);
    const imageSrc = toAbsoluteImageUrl(getMetaImage(html), previewUrl);
    const pending = !imageSrc && screenshotStatus === "pending";

    return NextResponse.json(
      {
        imageSrc,
        source: imageSrc ? "open-graph" : "",
        pending,
        retryAfterMs: SCREENSHOT_RETRY_DELAY_MS,
      },
      {
        headers: {
          "Cache-Control": pending ? "no-store" : "public, max-age=3600, s-maxage=86400",
        },
      }
    );
  } catch {
    const pending = screenshotStatus === "pending";

    return NextResponse.json(
      {
        imageSrc: "",
        source: "",
        pending,
        retryAfterMs: SCREENSHOT_RETRY_DELAY_MS,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": pending ? "no-store" : "public, max-age=600, s-maxage=3600",
        },
      }
    );
  }
}
