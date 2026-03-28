import { buildRssFeed, xmlResponse } from "../../../lib/seo/xml";
import { getLocalExperientialProjects, getLocalRenderingProjects } from "../../../shared/localPortfolios";
import { getLocalScenicProjects } from "../../../shared/localScenicProjects";

export const dynamic = "force-static";

export function GET() {
  const scenicItems = getLocalScenicProjects().map((project) => ({
    title: project.title,
    pathname: `/project/${project.slug}`,
    description: [project.client, project.location, project.year].filter(Boolean).join(" · "),
    publishedAt: project.publishedAt || (project.year ? `${project.year}-01-01` : null),
    updatedAt: project.updatedAt,
  }));

  const renderingItems = getLocalRenderingProjects().map((project) => ({
    title: project.title,
    pathname: `/projects/rendering/${project.slug}`,
    description: project.excerpt || project.seoDescription,
    publishedAt: project.publishedAt || project.createdAt,
    updatedAt: project.updatedAt,
  }));

  const experientialItems = getLocalExperientialProjects().map((project) => ({
    title: project.title,
    pathname: `/projects/experiential/${project.slug}`,
    description: project.summary || project.seoDescription,
    publishedAt: project.year ? `${project.year}-01-01` : null,
    updatedAt: project.updatedAt,
  }));

  const feed = buildRssFeed({
    title: "Brandon PT Davis Projects",
    description:
      "Portfolio updates from scenic design, rendering, and experiential design projects by Brandon PT Davis.",
    pathname: "/projects/rss.xml",
    items: [...scenicItems, ...renderingItems, ...experientialItems],
  });

  return xmlResponse(feed, { noindex: true });
}
