import { buildRssFeed, xmlResponse } from "../../../lib/seo/xml";
import { getLocalArticles } from "../../../shared/localArticles";

export const dynamic = "force-static";

export function GET() {
  const feed = buildRssFeed({
    title: "Brandon PT Davis News Archive",
    description:
      "Legacy news is now consolidated into articles and durable portfolio content on the Brandon PT Davis site.",
    pathname: "/news/rss.xml",
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
