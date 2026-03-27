import { buildImageSitemap, xmlResponse } from "../../lib/seo/xml";
import { getLocalArticles } from "../../shared/localArticles";
import { getLocalExperientialProjects, getLocalRenderingProjects } from "../../shared/localPortfolios";
import { getLocalScenicProjects } from "../../shared/localScenicProjects";
import { getLocalTutorials } from "../../shared/localStudio";

export const dynamic = "force-static";

export function GET() {
  const entries = [
    ...getLocalArticles()
      .filter((article) => article.coverImageUrl)
      .map((article) => ({
        pathname: `/articles/${article.slug}`,
        imageUrl: article.coverImageUrl,
        title: article.title,
        caption: article.coverImageAlt || article.excerpt,
      })),
    ...getLocalScenicProjects()
      .filter((project) => project.coverImageUrl)
      .map((project) => ({
        pathname: `/project/${project.slug}`,
        imageUrl: project.coverImageUrl,
        title: project.title,
        caption: [project.client, project.location, project.year].filter(Boolean).join(" · "),
      })),
    ...getLocalRenderingProjects()
      .filter((project) => project.coverImageUrl)
      .map((project) => ({
        pathname: `/projects/rendering/${project.slug}`,
        imageUrl: project.coverImageUrl,
        title: project.title,
        caption: project.excerpt || project.seoDescription,
      })),
    ...getLocalExperientialProjects()
      .filter((project) => project.coverImageUrl)
      .map((project) => ({
        pathname: `/projects/experiential/${project.slug}`,
        imageUrl: project.coverImageUrl,
        title: project.title,
        caption: project.summary || project.seoDescription,
      })),
    ...getLocalTutorials()
      .filter((tutorial) => tutorial.cover_image)
      .map((tutorial) => ({
        pathname: `/studio/tutorials/${tutorial.slug}`,
        imageUrl: String(tutorial.cover_image),
        title: tutorial.title,
        caption: tutorial.description || tutorial.overview || tutorial.seo_description || tutorial.title,
      })),
  ];

  return xmlResponse(buildImageSitemap(entries));
}
