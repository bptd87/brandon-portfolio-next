import type { MetadataRoute } from "next";
import { absoluteUrl } from "../lib/metadata";
import { getLocalArticles } from "../shared/localArticles";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "../shared/learningPortal";
import {
  getLocalExperientialProjects,
  getLocalRenderingProjects,
} from "../shared/localPortfolios";
import { getLocalScenicProjects } from "../shared/localScenicProjects";
import { getLocalTutorials } from "../shared/localStudio";

const STATIC_ROUTES: Array<{ pathname: string; priority?: number; changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { pathname: "/", priority: 1, changeFrequency: "weekly" },
  { pathname: "/about", priority: 0.8, changeFrequency: "monthly" },
  { pathname: "/about/collaborators", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/about/teaching", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/resume", priority: 0.7, changeFrequency: "monthly" },
  { pathname: "/creative-statement", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/assistant-scenic-design", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/projects", priority: 0.9, changeFrequency: "weekly" },
  { pathname: "/projects/rendering", priority: 0.8, changeFrequency: "weekly" },
  { pathname: "/projects/experiential", priority: 0.8, changeFrequency: "weekly" },
  { pathname: "/articles", priority: 0.8, changeFrequency: "weekly" },
  { pathname: "/studio", priority: 0.8, changeFrequency: "weekly" },
  { pathname: "/studio/tutorials", priority: 0.7, changeFrequency: "weekly" },
  { pathname: "/studio/directory", priority: 0.6, changeFrequency: "weekly" },
  { pathname: "/studio/apps", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/studio/apps/scale-calculator", priority: 0.5, changeFrequency: "monthly" },
  { pathname: "/studio/apps/dimension-reference", priority: 0.5, changeFrequency: "monthly" },
  { pathname: "/studio/apps/design-history-timeline", priority: 0.5, changeFrequency: "monthly" },
  { pathname: "/studio/apps/rosco-paint-calculator", priority: 0.5, changeFrequency: "monthly" },
  { pathname: "/studio/apps/scenic-3d-converter", priority: 0.5, changeFrequency: "monthly" },
  { pathname: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/links", priority: 0.4, changeFrequency: "monthly" },
  { pathname: "/syllabus/experiential-design", priority: 0.3, changeFrequency: "yearly" },
  { pathname: "/syllabus/3d-modeling", priority: 0.3, changeFrequency: "yearly" },
  { pathname: "/faq", priority: 0.4, changeFrequency: "monthly" },
  { pathname: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { pathname: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { pathname: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
];

function toLastModified(...candidates: Array<string | number | null | undefined>) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const date = new Date(candidate);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.pathname),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const scenicEntries: MetadataRoute.Sitemap = getLocalScenicProjects().map((project) => ({
    url: absoluteUrl(`/project/${project.slug}`),
    lastModified: toLastModified(project.updatedAt, project.publishedAt, project.createdAt, project.year ? `${project.year}-01-01` : null),
    changeFrequency: "monthly",
    priority: project.featured ? 0.8 : 0.7,
  }));

  const renderingEntries: MetadataRoute.Sitemap = getLocalRenderingProjects().map((project) => ({
    url: absoluteUrl(`/projects/rendering/${project.slug}`),
    lastModified: toLastModified(project.updatedAt, project.publishedAt, project.createdAt),
    changeFrequency: "monthly",
    priority: project.featured ? 0.7 : 0.6,
  }));

  const experientialProjectEntries: MetadataRoute.Sitemap = getLocalExperientialProjects().map((project) => ({
    url: absoluteUrl(`/projects/experiential/${project.slug}`),
    lastModified: toLastModified(project.updatedAt, project.year ? `${project.year}-01-01` : null),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = getLocalArticles()
    .filter((article) => !LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
    .filter((article) => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
    .map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: toLastModified(article.updatedAt, article.publishedAt, article.createdAt),
      changeFrequency: "monthly",
      priority: article.featured ? 0.7 : 0.6,
    }));

  const learningArticleEntries: MetadataRoute.Sitemap = getLocalArticles()
    .filter((article) => LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
    .map((article) => ({
      url: absoluteUrl(`/studio/tutorials/${article.slug}`),
      lastModified: toLastModified(article.updatedAt, article.publishedAt, article.createdAt),
      changeFrequency: "monthly",
      priority: article.featured ? 0.7 : 0.6,
    }));

  const tutorialEntries: MetadataRoute.Sitemap = getLocalTutorials().map((tutorial) => ({
    url: absoluteUrl(`/studio/tutorials/${tutorial.slug}`),
    lastModified: toLastModified(tutorial.published_at, tutorial.created_at, tutorial.updated_at),
    changeFrequency: "monthly",
    priority: tutorial.featured ? 0.6 : 0.5,
  }));

  return [
    ...staticEntries,
    ...scenicEntries,
    ...renderingEntries,
    ...experientialProjectEntries,
    ...articleEntries,
    ...learningArticleEntries,
    ...tutorialEntries,
  ];
}
