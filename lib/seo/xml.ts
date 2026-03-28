import { absoluteUrl, stripHtml, siteMetadata } from "../metadata";

type FeedItem = {
  title: string;
  pathname: string;
  description?: string | null;
  publishedAt?: string | Date | null;
  updatedAt?: string | Date | null;
};

type FeedInput = {
  title: string;
  description: string;
  pathname: string;
  items: FeedItem[];
};

type ImageSitemapEntry = {
  pathname: string;
  imageUrl: string;
  title?: string | null;
  caption?: string | null;
};

type VideoSitemapEntry = {
  pathname: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  playerUrl: string;
  publishedAt?: string | Date | null;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc2822Date(value?: string | Date | null) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toUTCString();
}

function toIsoDate(value?: string | Date | null) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function toAbsoluteAssetUrl(value: string) {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return absoluteUrl(value);
  return value;
}

export function xmlResponse(body: string, options?: { noindex?: boolean }) {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=3600, stale-while-revalidate=86400",
      ...(options?.noindex ? { "X-Robots-Tag": "noindex, follow" } : {}),
    },
  });
}

export function buildRssFeed({ title, description, pathname, items }: FeedInput) {
  const channelUrl = absoluteUrl(pathname);
  const sortedItems = [...items].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.publishedAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.publishedAt || 0).getTime();
    return bTime - aTime;
  });

  const itemXml = sortedItems
    .map((item) => {
      const link = absoluteUrl(item.pathname);
      const pubDate = toRfc2822Date(item.updatedAt || item.publishedAt);
      const summary = stripHtml(String(item.description || "")).trim();

      return [
        "<item>",
        `<title>${escapeXml(item.title)}</title>`,
        `<link>${escapeXml(link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
        summary ? `<description>${escapeXml(summary)}</description>` : "",
        pubDate ? `<pubDate>${escapeXml(pubDate)}</pubDate>` : "",
        "</item>",
      ]
        .filter(Boolean)
        .join("");
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteMetadata.siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <atom:link href="${escapeXml(channelUrl)}" rel="self" type="application/rss+xml" />
    ${itemXml}
  </channel>
</rss>`;
}

export function buildImageSitemap(entries: ImageSitemapEntry[]) {
  const grouped = new Map<string, ImageSitemapEntry[]>();

  for (const entry of entries) {
    if (!entry.imageUrl) continue;
    const pageUrl = absoluteUrl(entry.pathname);
    const current = grouped.get(pageUrl) || [];
    if (!current.some((item) => item.imageUrl === entry.imageUrl)) {
      current.push(entry);
      grouped.set(pageUrl, current);
    }
  }

  const urlXml = [...grouped.entries()]
    .map(([pageUrl, pageEntries]) => {
      const imagesXml = pageEntries
        .map((entry) => {
          return [
            "<image:image>",
            `<image:loc>${escapeXml(toAbsoluteAssetUrl(entry.imageUrl))}</image:loc>`,
            entry.title ? `<image:title>${escapeXml(entry.title)}</image:title>` : "",
            entry.caption ? `<image:caption>${escapeXml(entry.caption)}</image:caption>` : "",
            "</image:image>",
          ]
            .filter(Boolean)
            .join("");
        })
        .join("");

      return `<url><loc>${escapeXml(pageUrl)}</loc>${imagesXml}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${urlXml}
</urlset>`;
}

export function buildVideoSitemap(entries: VideoSitemapEntry[]) {
  const urlXml = entries
    .map((entry) => {
      const pageUrl = absoluteUrl(entry.pathname);
      const publishedAt = toIsoDate(entry.publishedAt);

      return [
        "<url>",
        `<loc>${escapeXml(pageUrl)}</loc>`,
        "<video:video>",
        `<video:thumbnail_loc>${escapeXml(toAbsoluteAssetUrl(entry.thumbnailUrl))}</video:thumbnail_loc>`,
        `<video:title>${escapeXml(entry.title)}</video:title>`,
        `<video:description>${escapeXml(stripHtml(entry.description))}</video:description>`,
        `<video:player_loc allow_embed="yes">${escapeXml(toAbsoluteAssetUrl(entry.playerUrl))}</video:player_loc>`,
        publishedAt ? `<video:publication_date>${escapeXml(publishedAt)}</video:publication_date>` : "",
        "<video:family_friendly>yes</video:family_friendly>",
        "</video:video>",
        "</url>",
      ]
        .filter(Boolean)
        .join("");
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${urlXml}
</urlset>`;
}
