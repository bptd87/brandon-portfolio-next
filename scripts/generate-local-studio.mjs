import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "shared", "localStudio.generated.ts");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeJsonValue = (value, fallback) => {
  if (!value) return fallback;
  if (Array.isArray(value) || typeof value === "object") return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const normalizeCollaborator = (collab) => {
  const website = collab.website ?? collab.website_url ?? collab.websiteUrl ?? null;
  const portfolioUrl = collab.portfolio_url ?? collab.portfolioUrl ?? null;

  let instagramUrl = collab.instagram_url ?? collab.instagramUrl ?? null;
  let instagramHandle = collab.instagram_handle ?? collab.instagramHandle ?? null;

  if (typeof instagramUrl === "string" && instagramUrl.includes("@") && !instagramUrl.startsWith("http")) {
    instagramHandle = instagramHandle || instagramUrl.replace(/^@/, "");
    instagramUrl = `https://instagram.com/${instagramHandle}`;
  }

  if (!instagramUrl && instagramHandle) {
    instagramUrl = `https://instagram.com/${String(instagramHandle).replace(/^@/, "")}`;
  }

  return {
    id: collab.id,
    name: collab.name,
    slug: collab.slug || slugify(collab.name),
    role: collab.role || "other",
    bio: collab.bio || "",
    website,
    portfolioUrl,
    instagramUrl,
    instagramHandle: instagramHandle ? String(instagramHandle).replace(/^@/, "") : null,
    coverImage: collab.cover_image ?? collab.coverImage ?? null,
    gallery: normalizeJsonValue(collab.gallery, []),
    status: collab.status || "active",
    featured: Boolean(collab.featured),
    seoTitle: collab.seo_title ?? collab.seoTitle ?? null,
    seoDescription: collab.seo_description ?? collab.seoDescription ?? null,
    seoKeywords: collab.seo_keywords ?? collab.seoKeywords ?? null,
    createdAt: collab.created_at ?? collab.createdAt ?? null,
    updatedAt: collab.updated_at ?? collab.updatedAt ?? null,
  };
};

const normalizeTutorial = (tutorial) => ({
  ...tutorial,
  learning_objectives: normalizeJsonValue(tutorial.learning_objectives, []),
  key_concepts: normalizeJsonValue(tutorial.key_concepts, []),
  pro_tips: normalizeJsonValue(tutorial.pro_tips, []),
  shortcuts: normalizeJsonValue(tutorial.shortcuts, []),
  common_pitfalls: normalizeJsonValue(tutorial.common_pitfalls, []),
  transcript: normalizeJsonValue(tutorial.transcript, []),
  related_resources: normalizeJsonValue(tutorial.related_resources, []),
  related_tutorials: normalizeJsonValue(tutorial.related_tutorials, []),
});

const normalizeDirectoryEntry = (entry) => ({
  id: entry.id,
  name: entry.name,
  slug: entry.slug || slugify(entry.name),
  description: entry.description || "",
  category_name: entry.category_name ?? entry.categoryName ?? "Resource",
  category_slug: entry.category_slug ?? entry.categorySlug ?? slugify(entry.category_name ?? entry.categoryName ?? "resource"),
  url: entry.url,
  location: entry.location || null,
  cover_image: entry.cover_image ?? entry.coverImage ?? null,
  status: entry.status || "published",
  featured: Boolean(entry.featured),
  seo_title: entry.seo_title ?? entry.seoTitle ?? null,
  seo_description: entry.seo_description ?? entry.seoDescription ?? null,
  seo_keywords: entry.seo_keywords ?? entry.seoKeywords ?? null,
  gallery: normalizeJsonValue(entry.gallery, []),
  created_at: entry.created_at ?? entry.createdAt ?? null,
  updated_at: entry.updated_at ?? entry.updatedAt ?? null,
  like_count: entry.like_count ?? entry.likeCount ?? 0,
  click_count: entry.click_count ?? entry.clickCount ?? 0,
});

const fetchAll = async (table, queryBuilder) => {
  const results = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {
    const query = queryBuilder(supabase.from(table).select("*")).range(from, from + pageSize - 1);
    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) break;
    results.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return results;
};

const tutorials = (await fetchAll("tutorials", (query) =>
  query.eq("status", "published").order("created_at", { ascending: false })
)).map(normalizeTutorial);

const collaborators = (await fetchAll("collaborators", (query) =>
  query.order("name", { ascending: true })
)).map(normalizeCollaborator);

const scenicDirectory = (await fetchAll("scenic_directory", (query) =>
  query.order("name", { ascending: true })
)).map(normalizeDirectoryEntry);

const fileContents = `// Auto-generated by scripts/generate-local-studio.mjs
// Do not edit manually. Re-run the generator after studio DB changes.

export const generatedLocalTutorials = ${JSON.stringify(tutorials, null, 2)};

export const generatedLocalCollaborators = ${JSON.stringify(collaborators, null, 2)};

export const generatedLocalStudioDirectory = ${JSON.stringify(scenicDirectory, null, 2)};
`;

await fs.writeFile(outputPath, fileContents, "utf8");

console.log(
  `Generated ${tutorials.length} tutorials, ${collaborators.length} collaborators, and ${scenicDirectory.length} directory entries at ${outputPath}`
);
