import { buildRssFeed, xmlResponse } from "../../../lib/seo/xml";
import { getLocalArticles } from "../../../shared/localArticles";

export const dynamic = "force-static";

export function GET() {
  const feed = buildRssFeed({
    title: "Brandon PT Davis Articles",
    description:
      "Articles on scenic design, rendering, teaching, tools, and performance history from Brandon PT Davis.",
    pathname: "/articles/rss.xml",
    items: getLocalArticles().map((article) => ({
      title: article.title,
      pathname: `/articles/${article.slug}`,
      description: article.excerpt || article.seoDescription,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
    })),
  });

  return xmlResponse(feed);
}
