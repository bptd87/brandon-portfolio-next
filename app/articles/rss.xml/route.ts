import { buildRssFeed, xmlResponse } from "../../../lib/seo/xml";
import { getLocalArticles } from "../../../shared/localArticles";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "../../../shared/learningPortal";

export const dynamic = "force-static";

export function GET() {
  const feed = buildRssFeed({
    title: "Brandon PT Davis Articles",
    description:
      "Articles on scenic design, rendering, teaching, tools, and performance history from Brandon PT Davis.",
    pathname: "/articles/rss.xml",
    items: getLocalArticles()
      .filter((article) => !LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
      .filter((article) => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
      .map((article) => ({
        title: article.title,
        pathname: `/articles/${article.slug}`,
        description: article.excerpt || article.seoDescription,
        publishedAt: article.publishedAt,
        updatedAt: article.updatedAt,
      })),
  });

  return xmlResponse(feed, { noindex: true });
}
