import { NextResponse } from "next/server";

const MAX_HTML_BYTES = 220_000;
const REQUEST_TIMEOUT_MS = 4_500;

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

  try {
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

    return NextResponse.json(
      { imageSrc },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      }
    );
  } catch {
    return NextResponse.json({ imageSrc: "" }, { status: 200 });
  }
}
