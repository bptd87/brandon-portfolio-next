import * as db from './db';
import { ASSISTANT_SCENIC_DESIGN_PATH } from '@shared/localAssistantScenic';
import { getLocalArticles } from '@shared/localArticles';
import { getConfiguredSiteUrl } from '../lib/env/site';

/**
 * Sitemap utilities for generating XML sitemaps
 * Following Google's sitemap protocol: https://www.sitemaps.org/protocol.html
 */

const SITE_URL = getConfiguredSiteUrl();

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface ImageSitemapUrl {
  loc: string;
  images: Array<{
    loc: string;
    title?: string;
    caption?: string;
  }>;
}

/**
 * Generate XML sitemap header
 */
function generateSitemapHeader(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
}

/**
 * Generate XML sitemap footer
 */
function generateSitemapFooter(): string {
  return `</urlset>`;
}

/**
 * Generate XML for a single URL entry
 */
function generateUrlEntry(url: SitemapUrl): string {
  let xml = `  <url>
    <loc>${escapeXml(url.loc)}</loc>`;

  if (url.lastmod) {
    xml += `
    <lastmod>${url.lastmod}</lastmod>`;
  }

  if (url.changefreq) {
    xml += `
    <changefreq>${url.changefreq}</changefreq>`;
  }

  if (url.priority !== undefined) {
    xml += `
    <priority>${url.priority.toFixed(1)}</priority>`;
  }

  xml += `
  </url>`;

  return xml;
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Format date to ISO 8601 format (YYYY-MM-DD)
 */
function formatDate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

function toPinterestReadyImageUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const objectIdx = parts.findIndex((segment) => segment === 'object');

    if (
      parsed.hostname.endsWith('.supabase.co') &&
      objectIdx >= 0 &&
      parts[objectIdx + 1] === 'public'
    ) {
      const bucket = parts[objectIdx + 2];
      const objectPath = parts.slice(objectIdx + 3).join('/');
      if (bucket && objectPath) {
        const next = new URL(
          `${parsed.origin}/storage/v1/render/image/public/${bucket}/${objectPath}`
        );
        next.searchParams.set('width', '1200');
        next.searchParams.set('quality', '85');
        return next.toString();
      }
    }
  } catch {
    // Ignore malformed URLs and keep original URL.
  }

  return rawUrl;
}

function isLikelyImageUrl(value: string): boolean {
  if (!value) return false;
  const lower = value.toLowerCase();
  if (lower.includes('youtu.be') || lower.includes('youtube.com') || lower.includes('vimeo.com')) {
    return false;
  }
  return (
    lower.includes('/storage/v1/object/public/') ||
    lower.includes('/storage/v1/render/image/public/') ||
    /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(lower)
  );
}

/**
 * Generate main sitemap with all pages
 */
export async function generateMainSitemap(baseUrl?: string): Promise<string> {
  const SITE_URL = baseUrl || getConfiguredSiteUrl();
  const urls: SitemapUrl[] = [];

  // Homepage - highest priority
  urls.push({
    loc: SITE_URL,
    changefreq: 'weekly',
    priority: 1.0,
  });

  // Static pages
  urls.push(
    {
      loc: `${SITE_URL}/about`,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/about/teaching`,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/resume`,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/creative-statement`,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/about/collaborators`,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}${ASSISTANT_SCENIC_DESIGN_PATH}`,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/studio`,
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: `${SITE_URL}/contact`,
      changefreq: 'monthly',
      priority: 0.6,
    }
  );

  // Portfolio pages
  urls.push(
    {
      loc: `${SITE_URL}/projects`,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/projects/rendering`,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/projects/experiential`,
      changefreq: 'weekly',
      priority: 0.7,
    }
  );

  // Individual projects
  const projects = await db.getAllProjects({ status: 'published' });
  for (const project of projects) {
    urls.push({
      loc: `${SITE_URL}/project/${project.slug}`,
      lastmod: formatDate(project.updatedAt || project.createdAt),
      changefreq: 'monthly',
      priority: 0.8,
    });
  }

  // News listing page
  urls.push({
    loc: `${SITE_URL}/news`,
    changefreq: 'weekly',
    priority: 0.7,
  });

  // Individual news items
  const newsItems = await db.getAllNews({ status: 'published' });
  for (const news of newsItems) {
    urls.push({
      loc: `${SITE_URL}/news/${news.slug}`,
      lastmod: formatDate(news.updatedAt || news.createdAt),
      changefreq: 'monthly',
      priority: 0.6,
    });
  }

  // Articles listing page
  urls.push({
    loc: `${SITE_URL}/articles`,
    changefreq: 'weekly',
    priority: 0.7,
  });

  for (const article of getLocalArticles()) {
    urls.push({
      loc: `${SITE_URL}/articles/${article.slug}`,
      lastmod: formatDate(new Date(article.updatedAt || article.publishedAt)),
      changefreq: 'monthly',
      priority: 0.7,
    });
  }

  // Tutorials listing page
  urls.push({
    loc: `${SITE_URL}/studio/tutorials`,
    changefreq: 'weekly',
    priority: 0.7,
  });

  // Studio Apps listing page
  urls.push({
    loc: `${SITE_URL}/studio/apps`,
    changefreq: 'monthly',
    priority: 0.7,
  });

  // Studio Directory listing page
  urls.push({
    loc: `${SITE_URL}/studio/directory`,
    changefreq: 'weekly',
    priority: 0.7,
  });

  // Individual app pages
  const appSlugs = [
    'scale-calculator',
    'dimension-reference',
    'rosco-paint-calculator',
    'design-history-timeline',
    'classical-orders',
    'paint-finder',
    'model-scaler',
  ];

  for (const slug of appSlugs) {
    urls.push({
      loc: `${SITE_URL}/studio/apps/${slug}`,
      changefreq: 'monthly',
      priority: 0.6,
    });
  }

  // Individual tutorials (dynamic from published tutorial records)
  const tutorials = await db.getAllTutorials({ status: 'published' });
  for (const tutorial of tutorials) {
    if (!tutorial.slug) continue;
    urls.push({
      loc: `${SITE_URL}/studio/tutorials/${tutorial.slug}`,
      lastmod: formatDate(tutorial.updated_at || tutorial.created_at),
      changefreq: 'monthly',
      priority: 0.6,
    });
  }

  // Generate XML
  let xml = generateSitemapHeader();
  for (const url of urls) {
    xml += '\n' + generateUrlEntry(url);
  }
  xml += '\n' + generateSitemapFooter();

  return xml;
}

/**
 * Generate image sitemap with all project images
 */
export async function generateImageSitemap(baseUrl?: string): Promise<string> {
  const SITE_URL = baseUrl || getConfiguredSiteUrl();
  const projects = await db.getAllProjects();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  for (const project of projects) {
    const images = await db.getProjectImages(project.id);

    if (images.length === 0) continue;

    xml += `
  <url>
    <loc>${escapeXml(`${SITE_URL}/project/${project.slug}`)}</loc>`;

    for (const image of images) {
      // Skip images without URL
      if (!image.imageUrl) continue;

      xml += `
    <image:image>
      <image:loc>${escapeXml(image.imageUrl)}</image:loc>`;

      if (image.altText) {
        xml += `
      <image:title>${escapeXml(image.altText)}</image:title>`;
      }

      if (image.caption) {
        xml += `
      <image:caption>${escapeXml(image.caption)}</image:caption>`;
      }

      xml += `
    </image:image>`;
    }

    xml += `
  </url>`;
  }

  xml += '\n</urlset>';

  return xml;
}

/**
 * Generate sitemap index
 */
export function generateSitemapIndex(baseUrl?: string): string {
  const SITE_URL = baseUrl || getConfiguredSiteUrl();
  const now = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/image-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/video-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
}

/**
 * Generate video sitemap with all project videos
 */
export async function generateVideoSitemap(baseUrl?: string): Promise<string> {
  const SITE_URL = baseUrl || getConfiguredSiteUrl();
  const projects = await db.getAllProjects();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  for (const project of projects) {
    const images = await db.getProjectImages(project.id);
    const videos = images.filter(img => img.imageType === 'video' && img.videoUrl);

    if (videos.length === 0) continue;

    xml += `
  <url>
    <loc>${escapeXml(`${SITE_URL}/project/${project.slug}`)}</loc>`;

    for (const video of videos) {
      if (!video.videoUrl) continue;

      xml += `
    <video:video>
      <video:content_loc>${escapeXml(video.videoUrl)}</video:content_loc>
      <video:title>${escapeXml(project.title)}</video:title>`;

      if (project.excerpt) {
        // Limit description to 2048 characters as per Google spec
        const desc = project.excerpt.substring(0, 2048);
        xml += `
      <video:description>${escapeXml(desc)}</video:description>`;
      }

      if (video.imageUrl) {
        xml += `
      <video:thumbnail_loc>${escapeXml(video.imageUrl)}</video:thumbnail_loc>`;
      }

      if (project.publishedAt) {
        xml += `
      <video:publication_date>${new Date(project.publishedAt).toISOString()}</video:publication_date>`;
      }

      // Add default duration for videos (in seconds)
      xml += `
      <video:duration>300</video:duration>`;

      xml += `
    </video:video>`;
    }

    xml += `
  </url>`;
  }

  xml += '\n</urlset>';

  return xml;
}

/**
 * Generate RSS feed for articles
 */
export async function generateArticlesRSS(baseUrl?: string): Promise<string> {
  const SITE_URL = baseUrl || getConfiguredSiteUrl();
  const publishedArticles = getLocalArticles();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Brandon PT Davis - Articles</title>
    <link>${SITE_URL}/articles</link>
    <description>Articles on scenic design, theatre technology, and design education by Brandon PT Davis</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/articles/rss.xml" rel="self" type="application/rss+xml" />`;

  if (publishedArticles.length > 0) {
    const latest = publishedArticles[0];
    xml += `
    <lastBuildDate>${new Date(latest.updatedAt || latest.createdAt).toUTCString()}</lastBuildDate>`;
  }

  for (const article of publishedArticles) {
    xml += `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/articles/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/articles/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt || article.createdAt).toUTCString()}</pubDate>`;

    if (article.excerpt) {
      xml += `
      <description>${escapeXml(article.excerpt)}</description>`;
    }

    if (article.coverImageUrl) {
      xml += `
      <enclosure url="${escapeXml(article.coverImageUrl)}" type="image/jpeg" length="150000" />`;
    }

    xml += `
    </item>`;
  }

  xml += `
  </channel>
</rss>`;

  return xml;
}

/**
 * Generate RSS feed for news
 */
export async function generateNewsRSS(baseUrl?: string): Promise<string> {
  const SITE_URL = baseUrl || getConfiguredSiteUrl();
  const newsItems = await db.getAllNews({ status: 'published' });
  const publishedNews = newsItems.filter(n => n.status === 'published');
  publishedNews.sort((a, b) =>
    new Date(b.publishedAt || b.date || b.createdAt).getTime() -
    new Date(a.publishedAt || a.date || a.createdAt).getTime()
  );

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Brandon PT Davis - News</title>
    <link>${SITE_URL}/news</link>
    <description>Latest news and updates from Brandon PT Davis, scenic designer</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/news/rss.xml" rel="self" type="application/rss+xml" />`;

  if (publishedNews.length > 0) {
    const latest = publishedNews[0];
    xml += `
    <lastBuildDate>${new Date(latest.updatedAt || latest.createdAt).toUTCString()}</lastBuildDate>`;
  }

  for (const news of publishedNews) {
    xml += `
    <item>
      <title>${escapeXml(news.title)}</title>
      <link>${SITE_URL}/news/${news.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/news/${news.slug}</guid>
      <pubDate>${new Date(news.publishedAt || news.createdAt).toUTCString()}</pubDate>`;

    if (news.excerpt) {
      xml += `
      <description>${escapeXml(news.excerpt)}</description>`;
    }

    xml += `
    </item>`;
  }

  xml += `
  </channel>
</rss>`;

  return xml;
}

/**
 * Generate RSS feed for projects
 */
export async function generateProjectsRSS(baseUrl?: string): Promise<string> {
  const SITE_URL = baseUrl || getConfiguredSiteUrl();
  const projects = await db.getAllProjects({ status: 'published' });
  const publishedProjects = projects
    .filter((p) => p.status === 'published')
    .sort((a, b) =>
      new Date(b.publishedAt || b.updatedAt || b.createdAt).getTime() -
      new Date(a.publishedAt || a.updatedAt || a.createdAt).getTime()
    );

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Brandon PT Davis - Projects</title>
    <link>${SITE_URL}/projects</link>
    <description>Scenic design project updates and production portfolio entries by Brandon PT Davis</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/projects/rss.xml" rel="self" type="application/rss+xml" />`;

  if (publishedProjects.length > 0) {
    const latest = publishedProjects[0];
    xml += `
    <lastBuildDate>${new Date(latest.updatedAt || latest.createdAt).toUTCString()}</lastBuildDate>`;
  }

  for (const project of publishedProjects) {
    xml += `
    <item>
      <title>${escapeXml(project.title)}</title>
      <link>${SITE_URL}/project/${project.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/project/${project.slug}</guid>
      <pubDate>${new Date(project.publishedAt || project.createdAt).toUTCString()}</pubDate>`;

    const summary = project.excerpt || project.designNotes || null;
    if (summary) {
      xml += `
      <description>${escapeXml(String(summary).slice(0, 1200))}</description>`;
    }

    if (project.discipline) {
      xml += `
      <category>${escapeXml(project.discipline)}</category>`;
    }

    // Add Media RSS image metadata for aggregators (e.g. Pinterest/feed readers).
    const images = await db.getProjectImages(project.id);
    const galleryImageUrls = images
      .map((img) => img.imageUrl)
      .filter((value): value is string => Boolean(value) && isLikelyImageUrl(value));

    const coverCandidate = project.coverImageUrl && isLikelyImageUrl(project.coverImageUrl)
      ? project.coverImageUrl
      : null;

    const orderedImageUrls = Array.from(
      new Set(
        // Prefer gallery images first for richer feeds; keep cover as fallback.
        [...galleryImageUrls, coverCandidate].filter(
          (value): value is string => Boolean(value)
        )
      )
    );
    const pinterestReadyImageUrls = orderedImageUrls.map((imageUrl) =>
      toPinterestReadyImageUrl(imageUrl)
    );

    if (pinterestReadyImageUrls.length > 0) {
      // Keep enclosure for broad RSS compatibility; use first image as primary.
      xml += `
      <enclosure url="${escapeXml(pinterestReadyImageUrls[0])}" type="image/jpeg" length="150000" />`;

      for (let i = 0; i < orderedImageUrls.length; i += 1) {
        const sourceUrl = orderedImageUrls[i];
        const imageUrl = pinterestReadyImageUrls[i];
        const imageMeta = images.find((img) => img.imageUrl === sourceUrl);
        const mediaText =
          imageMeta?.altText ||
          imageMeta?.caption ||
          summary ||
          project.title;

        xml += `
      <media:content url="${escapeXml(imageUrl)}" medium="image">
        <media:title>${escapeXml(project.title)}</media:title>
        <media:description type="plain">${escapeXml(String(mediaText).slice(0, 1000))}</media:description>
      </media:content>`;
      }
    }

    xml += `
    </item>`;
  }

  xml += `
  </channel>
</rss>`;

  return xml;
}

/**
 * Generate RSS feed for tutorials
 */
export async function generateTutorialsRSS(baseUrl?: string): Promise<string> {
  const SITE_URL = baseUrl || getConfiguredSiteUrl();
  const tutorials = await db.getAllTutorials({ status: 'published' });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Brandon PT Davis - Vectorworks Tutorials</title>
    <link>${SITE_URL}/studio/tutorials</link>
    <description>Free Vectorworks tutorials for scenic designers covering 2D drafting, 3D modeling, and rendering techniques</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/studio/tutorials/rss.xml" rel="self" type="application/rss+xml" />`;

  if (tutorials.length > 0) {
    const latest = tutorials[0];
    xml += `
    <lastBuildDate>${new Date(latest.updated_at || latest.created_at).toUTCString()}</lastBuildDate>`;
  }

  for (const tutorial of tutorials) {
    if (!tutorial.slug) continue;

    xml += `
    <item>
      <title>${escapeXml(tutorial.title || 'Tutorial')}</title>
      <link>${SITE_URL}/studio/tutorials/${tutorial.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/studio/tutorials/${tutorial.slug}</guid>
      <pubDate>${new Date(tutorial.updated_at || tutorial.created_at).toUTCString()}</pubDate>`;

    if (tutorial.description) {
      xml += `
      <description>${escapeXml(tutorial.description)}</description>`;
    }

    if (tutorial.cover_image) {
      xml += `
      <enclosure url="${escapeXml(tutorial.cover_image)}" type="image/jpeg" length="150000" />`;
    }

    xml += `
    </item>`;
  }

  xml += `
  </channel>
</rss>`;

  return xml;
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt(baseUrl?: string): string {
  const SITE_URL = baseUrl || getConfiguredSiteUrl();
  return `# Brandon PT Davis Portfolio - Robots.txt
User-agent: *
Allow: /
Allow: /api/trpc

# Sitemaps
Sitemap: ${SITE_URL}/sitemap-index.xml
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/image-sitemap.xml
Sitemap: ${SITE_URL}/video-sitemap.xml

# Disallow admin and API routes
Disallow: /admin
Disallow: /login
Disallow: /auth-debug
`;
}
