import { describe, it, expect, vi } from "vitest";
import * as sitemap from "./sitemap";

const mockProjects = [
  {
    id: 1,
    slug: "million-dollar-quartet",
    title: "Million Dollar Quartet",
    status: "published",
    discipline: "scenic_design",
    excerpt: "A high-energy jukebox scenic design production.",
    designNotes: "Production notes for set build and transitions.",
    coverImageUrl: "https://cdn.example.com/projects/mdq-cover.jpg",
    createdAt: new Date("2026-01-01T12:00:00.000Z"),
    updatedAt: new Date("2026-01-12T12:00:00.000Z"),
    publishedAt: new Date("2026-01-15T12:00:00.000Z"),
  },
];

const mockProjectImages = {
  1: [
    {
      imageUrl: "https://cdn.example.com/projects/mdq-cover.jpg",
      caption: "Main stage composition",
      altText: "Million Dollar Quartet scenic design cover image",
      imageType: "production",
      videoUrl: null,
    },
    {
      imageUrl: "https://cdn.example.com/projects/mdq-gallery-01.jpg",
      caption: "Bandstand close-up",
      altText: "Bandstand close-up",
      imageType: "production",
      videoUrl: null,
    },
    {
      imageUrl: "https://cdn.example.com/projects/mdq-video-thumb.jpg",
      caption: "Video thumb",
      altText: "Video thumbnail",
      imageType: "video",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ],
};

const mockNews = [
  {
    id: 10,
    slug: "regional-feature",
    title: "Regional Feature",
    status: "published",
    excerpt: "News excerpt",
    createdAt: new Date("2026-01-10T12:00:00.000Z"),
    updatedAt: new Date("2026-01-11T12:00:00.000Z"),
    publishedAt: new Date("2026-01-11T12:00:00.000Z"),
    date: new Date("2026-01-11T12:00:00.000Z"),
  },
];

const mockArticles = [
  {
    id: 20,
    slug: "modern-theatrical-design-portfolio",
    title: "The Modern Theatrical Design Portfolio",
    status: "published",
    excerpt: "Article excerpt",
    coverImageUrl: "https://cdn.example.com/articles/modern-cover.jpg",
    createdAt: new Date("2026-01-05T12:00:00.000Z"),
    updatedAt: new Date("2026-01-06T12:00:00.000Z"),
    publishedAt: new Date("2026-01-06T12:00:00.000Z"),
  },
];

const mockTutorials = [
  {
    id: 30,
    slug: "vectorworks-lighting-basics",
    title: "Vectorworks Lighting Basics",
    status: "published",
    description: "Tutorial description",
    cover_image: "https://cdn.example.com/tutorials/lighting-cover.jpg",
    created_at: new Date("2026-01-08T12:00:00.000Z"),
    updated_at: new Date("2026-01-09T12:00:00.000Z"),
  },
];

vi.mock("./db", () => ({
  getAllProjects: vi.fn(async () => mockProjects),
  getProjectImages: vi.fn(async (projectId: number) => mockProjectImages[projectId as keyof typeof mockProjectImages] || []),
  getAllNews: vi.fn(async () => mockNews),
  getAllArticles: vi.fn(async () => mockArticles),
  getAllTutorials: vi.fn(async () => mockTutorials),
}));

describe("Sitemap Generation", () => {
  it("should generate main sitemap with valid XML", async () => {
    const xml = await sitemap.generateMainSitemap();
    
    // Check XML declaration
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    
    // Check sitemap namespace
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    
    // Check homepage is included with highest priority
    expect(xml).toContain('<loc>https://www.brandonptdavis.com</loc>');
    expect(xml).toContain('<priority>1.0</priority>');
    
    // Check static pages are included
    expect(xml).toContain('/about</loc>');
    expect(xml).toContain('/studio</loc>');
    expect(xml).toContain('/contact</loc>');
    
    // Check discipline pages are included
    expect(xml).toContain('/projects</loc>');
    expect(xml).toContain('/projects/experiential</loc>');
    
    // Check closing tag
    expect(xml).toContain('</urlset>');
  });

  it("should generate image sitemap with valid XML and image namespace", async () => {
    const xml = await sitemap.generateImageSitemap();
    
    // Check XML declaration
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    
    // Check image namespace
    expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    
    // Check image elements structure
    if (xml.includes('<image:image>')) {
      expect(xml).toContain('<image:loc>');
      expect(xml).toContain('</image:image>');
    }
    
    // Check closing tag
    expect(xml).toContain('</urlset>');
  });

  it("should generate video sitemap with valid XML and video namespace", async () => {
    const xml = await sitemap.generateVideoSitemap();
    
    // Check XML declaration
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    
    // Check video namespace
    expect(xml).toContain('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"');
    
    // Check video elements structure (if videos exist)
    if (xml.includes('<video:video>')) {
      expect(xml).toContain('<video:content_loc>');
      expect(xml).toContain('<video:title>');
      expect(xml).toContain('</video:video>');
    }
    
    // Check closing tag
    expect(xml).toContain('</urlset>');
  });

  it("should generate sitemap index with all sitemaps", () => {
    const xml = sitemap.generateSitemapIndex();
    
    // Check XML declaration
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    
    // Check sitemap index namespace
    expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    
    // Check all sitemaps are referenced
    expect(xml).toContain('/sitemap.xml</loc>');
    expect(xml).toContain('/image-sitemap.xml</loc>');
    expect(xml).toContain('/video-sitemap.xml</loc>');
    
    // Check lastmod is included
    expect(xml).toContain('<lastmod>');
    
    // Check closing tag
    expect(xml).toContain('</sitemapindex>');
  });

  it("should generate robots.txt with sitemap references", () => {
    const txt = sitemap.generateRobotsTxt();
    
    // Check user agent
    expect(txt).toContain('User-agent: *');
    expect(txt).toContain('Allow: /');
    
    // Check sitemap references
    expect(txt).toContain('Sitemap: https://www.brandonptdavis.com/sitemap-index.xml');
    expect(txt).toContain('Sitemap: https://www.brandonptdavis.com/sitemap.xml');
    expect(txt).toContain('Sitemap: https://www.brandonptdavis.com/image-sitemap.xml');
    expect(txt).toContain('Sitemap: https://www.brandonptdavis.com/video-sitemap.xml');
    
    // Check disallow rules
    expect(txt).toContain('Disallow: /admin');
    expect(txt).toContain('Allow: /api/trpc');
  });
});

describe("RSS Feed Generation", () => {
  it("should generate articles RSS with valid XML", async () => {
    const xml = await sitemap.generateArticlesRSS();
    
    // Check XML declaration
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    
    // Check RSS version
    expect(xml).toContain('<rss version="2.0"');
    
    // Check atom namespace
    expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    
    // Check channel metadata
    expect(xml).toContain('<title>Brandon PT Davis - Articles</title>');
    expect(xml).toContain('<link>https://www.brandonptdavis.com/articles</link>');
    expect(xml).toContain('<description>');
    expect(xml).toContain('<language>en-us</language>');
    
    // Check self-referencing link
    expect(xml).toContain('href="https://www.brandonptdavis.com/articles/rss.xml"');
    
    // Check closing tags
    expect(xml).toContain('</channel>');
    expect(xml).toContain('</rss>');
  });

  it("should generate news RSS with valid XML", async () => {
    const xml = await sitemap.generateNewsRSS();
    
    // Check XML declaration
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    
    // Check RSS version
    expect(xml).toContain('<rss version="2.0"');
    
    // Check channel metadata
    expect(xml).toContain('<title>Brandon PT Davis - News</title>');
    expect(xml).toContain('<link>https://www.brandonptdavis.com/news</link>');
    expect(xml).toContain('<description>');
    
    // Check self-referencing link
    expect(xml).toContain('href="https://www.brandonptdavis.com/news/rss.xml"');
    
    // Check closing tags
    expect(xml).toContain('</channel>');
    expect(xml).toContain('</rss>');
  });

  it("should generate projects RSS with valid XML", async () => {
    const xml = await sitemap.generateProjectsRSS();

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<title>Brandon PT Davis - Projects</title>');
    expect(xml).toContain('<link>https://www.brandonptdavis.com/projects</link>');
    expect(xml).toContain('href="https://www.brandonptdavis.com/projects/rss.xml"');
    expect(xml).toContain('</channel>');
    expect(xml).toContain('</rss>');
  });

  it("should include item elements in articles RSS", async () => {
    const xml = await sitemap.generateArticlesRSS();
    
    // If there are published articles, check item structure
    if (xml.includes('<item>')) {
      expect(xml).toContain('<title>');
      expect(xml).toContain('<link>');
      expect(xml).toContain('<guid isPermaLink="true">');
      expect(xml).toContain('<pubDate>');
      expect(xml).toContain('</item>');
    }
  });

  it("should include item elements in news RSS", async () => {
    const xml = await sitemap.generateNewsRSS();
    
    // If there are published news items, check item structure
    if (xml.includes('<item>')) {
      expect(xml).toContain('<title>');
      expect(xml).toContain('<link>');
      expect(xml).toContain('<guid isPermaLink="true">');
      expect(xml).toContain('<pubDate>');
      expect(xml).toContain('</item>');
    }
  });

  it("should include item elements in projects RSS", async () => {
    const xml = await sitemap.generateProjectsRSS();

    if (xml.includes('<item>')) {
      expect(xml).toContain('<title>');
      expect(xml).toContain('<link>');
      expect(xml).toContain('<guid isPermaLink="true">');
      expect(xml).toContain('<pubDate>');
      expect(xml).toContain('</item>');
    }
  });
});

describe("XML Escaping", () => {
  it("should properly escape special characters in URLs", async () => {
    const xml = await sitemap.generateMainSitemap();
    
    // Check that ampersands in query strings are escaped
    if (xml.includes('?discipline=')) {
      // Should not contain raw ampersands in URLs (except in &amp;)
      const urlMatches = xml.match(/<loc>([^<]+)<\/loc>/g);
      if (urlMatches) {
        urlMatches.forEach(match => {
          // Extract URL content
          const url = match.replace(/<\/?loc>/g, '');
          // If URL contains query params, check escaping
          if (url.includes('?')) {
            // Should not have unescaped & (except as part of &amp;)
            expect(url).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
          }
        });
      }
    }
  });
});
