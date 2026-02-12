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
export async function generateMainSitemap(baseUrl?: string): Promise<string> {
  const SITE_URL = baseUrl || process.env.VITE_APP_URL || 'https://brandon-portfolio-v2.manus.space';
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
  
  // Tutorials listing page
  urls.push({
    loc: `${SITE_URL}/studio/tutorials`,
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
  
  // Individual tutorials (hardcoded slugs since tutorials are static)
  const tutorialSlugs = [
    'navigating-user-interface',
    'understanding-classes',
    'understanding-design-layers',
    'installing-workspace-template',
    'basics-tool-palette',
    'sheet-layers',
    '2d-edit-modify-tricks',
    'resource-manager-basics',
    'understanding-symbols',
    '2d-annotations-dimensioning',
    '3d-modeling-basics',
    'hybrid-symbols',
    'basics-of-textures',
    '3d-modeling-tools',
    'creating-pdfs-without-plotter',
    'modeling-a-table',
    'creating-camera-rendering',
    'creating-2d-from-3d-models',
  ];
  
  for (const slug of tutorialSlugs) {
    urls.push({
      loc: `${SITE_URL}/studio/tutorials/${slug}`,
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
  const SITE_URL = baseUrl || process.env.VITE_APP_URL || 'https://brandon-portfolio-v2.manus.space';
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
export function generateSitemapIndex(baseUrl?: string): string {
  const SITE_URL = baseUrl || process.env.VITE_APP_URL || 'https://brandon-portfolio-v2.manus.space';
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
  const SITE_URL = baseUrl || process.env.VITE_APP_URL || 'https://brandon-portfolio-v2.manus.space';
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
  const SITE_URL = baseUrl || process.env.VITE_APP_URL || 'https://brandon-portfolio-v2.manus.space';
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
export async function generateNewsRSS(baseUrl?: string): Promise<string> {
  const SITE_URL = baseUrl || process.env.VITE_APP_URL || 'https://brandon-portfolio-v2.manus.space';
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
 * Generate RSS feed for tutorials
 */
export function generateTutorialsRSS(baseUrl?: string): string {
  const SITE_URL = baseUrl || process.env.VITE_APP_URL || 'https://brandon-portfolio-v2.manus.space';
  // Hardcoded tutorial data matching StudioTutorials.tsx
  const tutorials = [
    {
      title: "Vectorworks Tutorial: Navigating the User Interface",
      slug: "navigating-user-interface",
      description: "Learn the fundamentals of Vectorworks interface, workspace setup, and essential navigation tools for scenic design.",
      youtubeUrl: "https://www.youtube.com/watch?v=jRI33g1oSt0",
      publishDate: new Date('2021-01-24'),
    },
    {
      title: "Vectorworks Tutorial: Understanding Classes",
      slug: "understanding-classes",
      description: "Master the organization system that controls graphic attributes, textures, and visibility in Vectorworks using classes and hierarchies.",
      youtubeUrl: "https://www.youtube.com/watch?v=tXQcTdGiwT4",
      publishDate: new Date('2021-01-24'),
    },
    {
      title: "Vectorworks Tutorial: Understanding Design Layers",
      slug: "understanding-design-layers",
      description: "Master the layer organization system that allows you to separate and manage different elements of your scenic design across multiple drawing planes.",
      youtubeUrl: "https://www.youtube.com/watch?v=CwCxmhQAFwI",
      publishDate: new Date('2021-01-25'),
    },
    {
      title: "Vectorworks Tutorial: Installing a Workspace and Template",
      slug: "installing-workspace-template",
      description: "Learn how to properly install and configure a Vectorworks workspace and template provided by your organization to ensure standardized communication and workflow.",
      youtubeUrl: "https://www.youtube.com/watch?v=CXBfG2L3ZmI",
      publishDate: new Date('2021-01-25'),
    },
    {
      title: "Vectorworks Tutorial: Basics Tool Palette",
      slug: "basics-tool-palette",
      description: "Master the essential 2D drawing tools including selection, drawing, and modification tools that form the foundation of scenic design drafting in Vectorworks.",
      youtubeUrl: "https://www.youtube.com/watch?v=orjqcNYveOg",
      publishDate: new Date('2021-01-27'),
    },
    {
      title: "Vectorworks Tutorial: Sheet Layers",
      slug: "sheet-layers",
      description: "Learn how to use sheet layers for laying out pages for printing, including creating viewports, adding title blocks, and managing drawing scales.",
      youtubeUrl: "https://www.youtube.com/watch?v=D4AXwNQgdBI",
      publishDate: new Date('2021-01-28'),
    },
    {
      title: "Vectorworks Tutorial: 2D Edit and Modify Tricks",
      slug: "2d-edit-modify-tricks",
      description: "Learn advanced 2D editing techniques and keyboard shortcuts to dramatically speed up your drafting workflow in Vectorworks.",
      youtubeUrl: "https://www.youtube.com/watch?v=L1MdPcfNVpI",
      publishDate: new Date('2021-01-29'),
    },
    {
      title: "Vectorworks Tutorial: Resource Manager Basics",
      slug: "resource-manager-basics",
      description: "Master the Resource Manager to organize, import, and manage symbols, textures, and other design resources across your Vectorworks files.",
      youtubeUrl: "https://www.youtube.com/watch?v=Vb9RLcQXFHE",
      publishDate: new Date('2021-02-01'),
    },
    {
      title: "Vectorworks Tutorial: Understanding Symbols",
      slug: "understanding-symbols",
      description: "Learn how to create, edit, and manage symbols to build reusable design elements and maintain consistency across your scenic design projects.",
      youtubeUrl: "https://www.youtube.com/watch?v=wy_zWBXgGzg",
      publishDate: new Date('2021-02-02'),
    },
    {
      title: "Vectorworks Tutorial: 2D Annotations and Dimensioning",
      slug: "2d-annotations-dimensioning",
      description: "Master the tools for adding dimensions, text annotations, and callouts to your scenic design drawings for clear communication.",
      youtubeUrl: "https://www.youtube.com/watch?v=0Kzr8lPKuIo",
      publishDate: new Date('2021-02-03'),
    },
    {
      title: "Vectorworks Tutorial: 3D Modeling Basics",
      slug: "3d-modeling-basics",
      description: "Begin your journey into 3D modeling with fundamental techniques for creating three-dimensional scenic elements in Vectorworks.",
      youtubeUrl: "https://www.youtube.com/watch?v=HXpXnBL6Rqk",
      publishDate: new Date('2021-02-04'),
    },
    {
      title: "Vectorworks Tutorial: Hybrid Symbols",
      slug: "hybrid-symbols",
      description: "Learn to create hybrid symbols that display different representations in 2D plan view and 3D model view for maximum flexibility.",
      youtubeUrl: "https://www.youtube.com/watch?v=wy_zWBXgGzg",
      publishDate: new Date('2021-02-05'),
    },
    {
      title: "Vectorworks Tutorial: Basics of Textures",
      slug: "basics-of-textures",
      description: "Master texture application and editing to add realistic surface materials to your 3D scenic design models.",
      youtubeUrl: "https://www.youtube.com/watch?v=BdOPzjEDpDg",
      publishDate: new Date('2021-02-08'),
    },
    {
      title: "Vectorworks Tutorial: 3D Modeling Tools",
      slug: "3d-modeling-tools",
      description: "Explore advanced 3D modeling tools including extrudes, sweeps, and Boolean operations for complex scenic design elements.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      publishDate: new Date('2021-02-09'),
    },
    {
      title: "Vectorworks Tutorial: Creating 24x36 PDFs Without a Plotter",
      slug: "creating-pdfs-without-plotter",
      description: "Learn how to export large-format PDFs from Vectorworks without requiring a physical plotter, essential for remote collaboration.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      publishDate: new Date('2021-02-10'),
    },
    {
      title: "Vectorworks Tutorial: Modeling a Table",
      slug: "modeling-a-table",
      description: "Follow a complete workflow for modeling a detailed furniture piece from concept to finished 3D model.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      publishDate: new Date('2021-02-11'),
    },
    {
      title: "Vectorworks Tutorial: Creating a Camera and Rendering",
      slug: "creating-camera-rendering",
      description: "Learn to set up cameras, adjust lighting, and create photorealistic renderings of your scenic designs.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      publishDate: new Date('2021-02-12'),
    },
    {
      title: "Vectorworks Tutorial: Creating 2D Drafting from 3D Models",
      slug: "creating-2d-from-3d-models",
      description: "Master the workflow for generating accurate 2D construction drawings from your 3D scenic design models.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      publishDate: new Date('2021-02-15'),
    },
  ];
  
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
    <lastBuildDate>${latest.publishDate.toUTCString()}</lastBuildDate>`;
  }
  
  for (const tutorial of tutorials) {
    xml += `
    <item>
      <title>${escapeXml(tutorial.title)}</title>
      <link>${SITE_URL}/studio/tutorials/${tutorial.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/studio/tutorials/${tutorial.slug}</guid>
      <pubDate>${tutorial.publishDate.toUTCString()}</pubDate>`;
    
    if (tutorial.description) {
      xml += `
      <description>${escapeXml(tutorial.description)}</description>`;
    }
    
    // Add YouTube video URL as enclosure
    if (tutorial.youtubeUrl) {
      xml += `
      <enclosure url="${escapeXml(tutorial.youtubeUrl)}" type="video/mp4" />`;
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
  const SITE_URL = baseUrl || process.env.VITE_APP_URL || 'https://brandon-portfolio-v2.manus.space';
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
