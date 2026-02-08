import * as db from './db';

/**
 * Sitemap utilities for generating XML sitemaps
 * Following Google's sitemap protocol: https://www.sitemaps.org/protocol.html
 */

const SITE_URL = process.env.VITE_APP_URL || 'https://brandon-portfolio-v2.manus.space';

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

/**
 * Generate main sitemap with all pages
 */
export async function generateMainSitemap(): Promise<string> {
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
      loc: `${SITE_URL}/about/teaching-philosophy`,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/about/resume`,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/about/creative-statement`,
      changefreq: 'monthly',
      priority: 0.7,
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
  
  // Portfolio discipline pages
  urls.push(
    {
      loc: `${SITE_URL}/projects?discipline=scenic_design`,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/projects?discipline=experiential_design`,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/projects?discipline=rendering`,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/projects?discipline=scenic_models`,
      changefreq: 'weekly',
      priority: 0.9,
    }
  );
  
  // Individual projects
  const projects = await db.getAllProjects();
  for (const project of projects) {
    urls.push({
      loc: `${SITE_URL}/projects/${project.slug}`,
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
  const newsItems = await db.getAllNews();
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
  
  // Individual articles
  const articles = await db.getAllArticles();
  for (const article of articles) {
    urls.push({
      loc: `${SITE_URL}/articles/${article.slug}`,
      lastmod: formatDate(article.updatedAt || article.createdAt),
      changefreq: 'monthly',
      priority: 0.7,
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
export async function generateImageSitemap(): Promise<string> {
  const projects = await db.getAllProjects();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;
  
  for (const project of projects) {
    const images = await db.getProjectImages(project.id);
    
    if (images.length === 0) continue;
    
    xml += `
  <url>
    <loc>${escapeXml(`${SITE_URL}/projects/${project.slug}`)}</loc>`;
    
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
export function generateSitemapIndex(): string {
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
export async function generateVideoSitemap(): Promise<string> {
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
    <loc>${escapeXml(`${SITE_URL}/projects/${project.slug}`)}</loc>`;
    
    for (const video of videos) {
      if (!video.videoUrl) continue;
      
      xml += `
    <video:video>
      <video:content_loc>${escapeXml(video.videoUrl)}</video:content_loc>
      <video:title>${escapeXml(project.title)}</video:title>`;
      
      if (project.description) {
        // Limit description to 2048 characters as per Google spec
        const desc = project.description.substring(0, 2048);
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
export async function generateArticlesRSS(): Promise<string> {
  const articles = await db.getAllArticles();
  const publishedArticles = articles.filter(a => a.status === 'published');
  
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
      <enclosure url="${escapeXml(article.coverImageUrl)}" type="image/jpeg" />`;
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
export async function generateNewsRSS(): Promise<string> {
  const newsItems = await db.getAllNews();
  const publishedNews = newsItems.filter(n => n.status === 'published');
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Brandon PT Davis - News</title>
    <link>${SITE_URL}/news</link>
    <description>Latest news and updates from Brandon PT Davis, scenic and experiential designer</description>
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
 * Generate robots.txt
 */
export function generateRobotsTxt(): string {
  return `# Brandon PT Davis Portfolio - Robots.txt
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap-index.xml
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/image-sitemap.xml
Sitemap: ${SITE_URL}/video-sitemap.xml

# Disallow admin and API routes
Disallow: /admin
Disallow: /api/
`;
}
