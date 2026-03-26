import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import yaml from "js-yaml";

import {
  articleMetaSchema,
  projectMediaSchema,
  projectMetaSchema,
  siteSettingsSchema,
  tutorialMetaSchema,
  type ArticleMeta,
  type ProjectMedia,
  type ProjectMeta,
  type SiteSettings,
  type TutorialMeta,
} from "./schemas";

const CONTENT_ROOT = path.join(process.cwd(), "content");

async function readFileIfExists(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error: any) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function readYamlFile<T>(filePath: string, parser: { parse: (value: unknown) => T }) {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = yaml.load(raw);
  return parser.parse(parsed);
}

async function readMdxBody(filePath: string) {
  const raw = await readFileIfExists(filePath);
  if (!raw) return "";
  const parsed = matter(raw);
  return parsed.content.trim();
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return readYamlFile(path.join(CONTENT_ROOT, "site", "settings.yaml"), siteSettingsSchema);
});

export const getScenicProjectSlugs = cache(async () => {
  const dir = path.join(CONTENT_ROOT, "projects", "scenic");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
});

export const getScenicProjectBySlug = cache(async (slug: string) => {
  const projectDir = path.join(CONTENT_ROOT, "projects", "scenic", slug);
  const [meta, media, body] = await Promise.all([
    readYamlFile(path.join(projectDir, "meta.yaml"), projectMetaSchema),
    readYamlFile(path.join(projectDir, "media.yaml"), projectMediaSchema),
    readMdxBody(path.join(projectDir, "body.mdx")),
  ]);

  return { meta, media, body };
});

export const getArticleSlugs = cache(async () => {
  const dir = path.join(CONTENT_ROOT, "articles");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
});

export const getArticleBySlug = cache(async (slug: string): Promise<{ meta: ArticleMeta; body: string }> => {
  const articleDir = path.join(CONTENT_ROOT, "articles", slug);
  const [meta, body] = await Promise.all([
    readYamlFile(path.join(articleDir, "meta.yaml"), articleMetaSchema),
    readMdxBody(path.join(articleDir, "body.mdx")),
  ]);

  return { meta, body };
});

export const getTutorialSlugs = cache(async () => {
  const dir = path.join(CONTENT_ROOT, "tutorials");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
});

export const getTutorialBySlug = cache(async (slug: string): Promise<{ meta: TutorialMeta; body: string }> => {
  const tutorialDir = path.join(CONTENT_ROOT, "tutorials", slug);
  const [meta, body] = await Promise.all([
    readYamlFile(path.join(tutorialDir, "meta.yaml"), tutorialMetaSchema),
    readMdxBody(path.join(tutorialDir, "body.mdx")),
  ]);

  return { meta, body };
});

export async function listProjectSummaries() {
  const slugs = await getScenicProjectSlugs();
  const projects = await Promise.all(slugs.map((slug) => getScenicProjectBySlug(slug)));
  return projects
    .map(({ meta }) => meta)
    .sort((a, b) => {
      const aDate = new Date(a.publishedAt || "").getTime() || 0;
      const bDate = new Date(b.publishedAt || "").getTime() || 0;
      return bDate - aDate;
    });
}
