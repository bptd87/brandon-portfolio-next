import type { MetadataRoute } from "next";

import { absoluteUrl } from "../../lib/metadata";
import { getLocalArticles } from "../../shared/localArticles";
import { RETIRED_LEARNING_ARTICLE_SLUG_SET } from "../../shared/learningPortal";
import {
  getLocalExperientialProjects,
  getLocalRenderingProjects,
} from "../../shared/localPortfolios";
import { getLocalScenicProjects } from "../../shared/localScenicProjects";
import { getProjectArtifactCollections } from "../../shared/projectArtifacts";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: Array<{
  pathname: string;
  priority?: number;
  changeFrequency?: SitemapEntry["changeFrequency"];
}> = [
  { pathname: "/", priority: 1, changeFrequency: "weekly" },
  { pathname: "/about", priority: 0.8, changeFrequency: "monthly" },
  { pathname: "/about/teaching", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/resume", priority: 0.7, changeFrequency: "monthly" },
  { pathname: "/creative-statement", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/assistant-scenic-design", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/projects", priority: 0.9, changeFrequency: "weekly" },
  { pathname: "/projects/artifacts", priority: 0.7, changeFrequency: "monthly" },
  { pathname: "/projects/rendering", priority: 0.8, changeFrequency: "weekly" },
  { pathname: "/projects/experiential", priority: 0.8, changeFrequency: "weekly" },
  { pathname: "/articles", priority: 0.8, changeFrequency: "weekly" },
  { pathname: "/studio", priority: 0.8, changeFrequency: "weekly" },
  { pathname: "/studio/directory", priority: 0.6, changeFrequency: "weekly" },
  { pathname: "/studio/apps", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/studio/apps/scale-calculator", priority: 0.5, changeFrequency: "monthly" },
  { pathname: "/studio/apps/dimension-reference", priority: 0.5, changeFrequency: "monthly" },
  { pathname: "/studio/apps/design-history-timeline", priority: 0.5, changeFrequency: "monthly" },
  { pathname: "/studio/apps/rosco-paint-calculator", priority: 0.5, changeFrequency: "monthly" },
  { pathname: "/studio/apps/commercial-paint-matcher", priority: 0.5, changeFrequency: "monthly" },
  { pathname: "/studio/apps/scenic-3d-converter", priority: 0.5, changeFrequency: "monthly" },
  { pathname: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/links", priority: 0.4, changeFrequency: "monthly" },
  { pathname: "/syllabus/experiential-design", priority: 0.3, changeFrequency: "yearly" },
  { pathname: "/syllabus/3d-modeling", priority: 0.3, changeFrequency: "yearly" },
  { pathname: "/faq", priority: 0.4, changeFrequency: "monthly" },
  { pathname: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { pathname: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { pathname: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
  { pathname: "/sitemap", priority: 0.3, changeFrequency: "monthly" },
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

function getSitemapEntries(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.pathname),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const scenicEntries: MetadataRoute.Sitemap = getLocalScenicProjects().map((project) => ({
    url: absoluteUrl(`/project/${project.slug}`),
    lastModified: toLastModified(
      project.updatedAt,
      project.publishedAt,
      project.createdAt,
      project.year ? `${project.year}-01-01` : null,
    ),
    changeFrequency: "monthly",
    priority: project.featured ? 0.8 : 0.7,
  }));

  const renderingEntries: MetadataRoute.Sitemap = getLocalRenderingProjects().map((project) => ({
    url: absoluteUrl(`/projects/rendering/${project.slug}`),
    lastModified: toLastModified(project.updatedAt, project.publishedAt, project.createdAt),
    changeFrequency: "monthly",
    priority: project.featured ? 0.7 : 0.6,
  }));

  const experientialProjectEntries: MetadataRoute.Sitemap = getLocalExperientialProjects().map(
    (project) => ({
      url: absoluteUrl(`/projects/experiential/${project.slug}`),
      lastModified: toLastModified(project.updatedAt, project.year ? `${project.year}-01-01` : null),
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  const artifactEntries: MetadataRoute.Sitemap = getProjectArtifactCollections().map(
    (collection) => ({
      url: absoluteUrl(`/projects/artifacts/${collection.slug}`),
      lastModified: toLastModified(collection.year ? `${collection.year}-01-01` : null),
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  const articleEntries: MetadataRoute.Sitemap = getLocalArticles()
    .filter((article) => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
    .map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: toLastModified(article.updatedAt, article.publishedAt, article.createdAt),
      changeFrequency: "monthly",
      priority: article.featured ? 0.7 : 0.6,
    }));

  return [
    ...staticEntries,
    ...scenicEntries,
    ...renderingEntries,
    ...experientialProjectEntries,
    ...artifactEntries,
    ...articleEntries,
  ];
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(date: SitemapEntry["lastModified"]) {
  if (!date) return undefined;
  const parsed = date instanceof Date ? date : new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function renderSitemapXml(entries: MetadataRoute.Sitemap) {
  const urls = entries
    .map((entry) => {
      const lastModified = formatDate(entry.lastModified);
      const lines = [`  <loc>${escapeXml(entry.url)}</loc>`];

      if (lastModified) lines.push(`  <lastmod>${lastModified}</lastmod>`);
      if (entry.changeFrequency) lines.push(`  <changefreq>${entry.changeFrequency}</changefreq>`);
      if (typeof entry.priority === "number") lines.push(`  <priority>${entry.priority}</priority>`);

      return `<url>\n${lines.join("\n")}\n</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function GET() {
  return new Response(renderSitemapXml(getSitemapEntries()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
