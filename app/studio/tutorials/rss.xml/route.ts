import { buildRssFeed, xmlResponse } from "../../../../lib/seo/xml";
import { getLocalTutorials } from "../../../../shared/localStudio";

export const dynamic = "force-static";

export function GET() {
  const feed = buildRssFeed({
    title: "Brandon PT Davis Studio Tutorials",
    description:
      "Vectorworks and scenic design tutorials covering drafting, modeling, rendering, and workflow.",
    pathname: "/studio/tutorials/rss.xml",
    items: getLocalTutorials().map((tutorial) => ({
      title: tutorial.title,
      pathname: `/studio/tutorials/${tutorial.slug}`,
      description: tutorial.description || tutorial.overview || tutorial.seo_description,
      publishedAt: tutorial.created_at,
      updatedAt: tutorial.updated_at,
    })),
  });

  return xmlResponse(feed);
}
