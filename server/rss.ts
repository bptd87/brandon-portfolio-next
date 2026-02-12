import { Request, Response } from "express";
import { getAllNews, getAllCategories } from "./db";

export async function generateRSSFeed(req: Request, res: Response) {
  try {
    // Fetch all published news items
    const newsItems = await getAllNews({ status: 'published' });

    // Get all categories for mapping
    const allCategories = await getAllCategories();
    const categoryMap = new Map(allCategories.map(c => [c.id, c.name]));

    // Build RSS feed
    const siteUrl = process.env.VITE_APP_URL || `https://${req.get('host')}`;
    const feedUrl = `${siteUrl}/api/news/rss`;
    const now = new Date().toUTCString();

    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Brandon PT Davis - News &amp; Updates</title>
    <link>${siteUrl}/news</link>
    <description>Latest news, project launches, career milestones, and industry recognition from Brandon PT Davis, Scenic Designer</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
`;

    for (const item of newsItems) {
      const itemUrl = `${siteUrl}/news/${item.slug}`;
      const pubDate = (item.publishedAt || item.createdAt).toUTCString();
      const categoryName = item.categoryId ? categoryMap.get(item.categoryId) : null;

      // Escape XML special characters
      const escapeXml = (str: string | null | undefined) => {
        if (!str) return '';
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      rss += `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${pubDate}</pubDate>
`;

      if (item.excerpt) {
        rss += `      <description>${escapeXml(item.excerpt)}</description>
`;
      }

      if (categoryName) {
        rss += `      <category>${escapeXml(categoryName)}</category>
`;
      }

      if (item.location) {
        const locationContent = `<p><strong>Location:</strong> ${escapeXml(item.location)}</p>${item.excerpt ? `<p>${escapeXml(item.excerpt)}</p>` : ''}`;
        rss += `      <content:encoded><![CDATA[${locationContent}]]></content:encoded>
`;
      }

      if (item.coverImageUrl) {
        rss += `      <enclosure url="${escapeXml(item.coverImageUrl)}" type="image/jpeg" />
`;
      }

      rss += `    </item>
`;
    }

    rss += `  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(rss);
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    res.status(500).send('Error generating RSS feed');
  }
}
