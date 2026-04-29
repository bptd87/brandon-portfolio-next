import { buildRssFeed, xmlResponse } from "../../../../lib/seo/xml";
import { getLocalArticles } from "../../../../shared/localArticles";
import { getLocalTutorials } from "../../../../shared/localStudio";
import { LEARNING_PORTAL_ARTICLE_SLUG_SET } from "../../../../shared/learningPortal";

export const dynamic = "force-static";

export function GET() {
  const feed = buildRssFeed({
    title: "Brandon PT Davis Studio Tutorials",
    description:
      "Vectorworks and scenic design tutorials covering drafting, modeling, rendering, and workflow.",
    pathname: "/studio/tutorials/rss.xml",
    items: [
      ...getLocalTutorials().map((tutorial) => ({
        title: tutorial.title,
        pathname: `/studio/tutorials/${tutorial.slug}`,
        description: tutorial.description || tutorial.overview || tutorial.seo_description,
        publishedAt: tutorial.published_at || tutorial.created_at,
        updatedAt: tutorial.published_at || tutorial.updated_at,
      })),
      ...getLocalArticles()
        .filter((article) => LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
        .map((article) => ({
          title: article.title,
          pathname: `/studio/tutorials/${article.slug}`,
          description: article.excerpt || article.seoDescription,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
        })),
    ],
  });

  return xmlResponse(feed, { noindex: true });
}
