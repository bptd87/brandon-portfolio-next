import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "shared", "localPortfolios.generated.ts");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const toIso = (value) => {
  if (!value) return null;
  try {
    return new Date(value).toISOString();
  } catch {
    return null;
  }
};

const normalizeRenderingProject = (project, images) => ({
  id: project.id,
  title: project.title || "",
  slug: project.slug || "",
  excerpt: project.excerpt || "",
  designNotes: project.design_notes || "",
  coverImageUrl: project.cover_image_url || "",
  client: project.client || "",
  location: project.location || "",
  year: project.year || null,
  month: project.month || null,
  status: project.status || null,
  featured: Boolean(project.featured),
  galleryOnly: Boolean(project.gallery_only),
  seoTitle: project.seo_title || project.title || "",
  seoDescription: project.seo_description || project.excerpt || "",
  seoKeywords: project.seo_keywords || null,
  createdAt: toIso(project.created_at),
  updatedAt: toIso(project.updated_at) || toIso(project.created_at),
  publishedAt: toIso(project.published_at) || toIso(project.updated_at) || toIso(project.created_at),
  images: (images || []).map((image) => ({
    id: image.id,
    imageUrl: image.image_url || "",
    altText: image.alt_text || "",
    caption: image.caption || "",
    sortOrder: image.sort_order ?? null,
  })),
});

const normalizeProcessGalleryItem = (item) => ({
  id: item.id,
  category: item.category || "",
  imageUrl: item.image_url || "",
  videoUrl: item.video_url || null,
  altText: item.alt_text || "",
  displayTitle: item.display_title || "",
  description: item.description || "",
  sortOrder: item.sort_order ?? null,
  active: Boolean(item.active),
  projectId: item.project_id ?? null,
  year: item.year ?? null,
  createdAt: toIso(item.created_at),
  images: (item.images || []).map((image) => ({
    id: image.id,
    imageUrl: image.image_url || image.video_url || "",
    videoUrl: image.video_url || null,
    altText: image.alt_text || "",
    caption: image.caption || "",
    title: image.title || "",
    sortOrder: image.sort_order ?? null,
    imageType: image.image_type || null,
  })),
});

const normalizeBrand = (brand) => ({
  id: brand.id,
  name: brand.name || "",
  logoUrl: brand.logo_url || "",
  websiteUrl: brand.website_url || "",
  sortOrder: brand.sort_order ?? null,
  active: Boolean(brand.active),
});

const [
  { data: renderingProjects, error: renderingProjectsError },
  { data: renderingProjectImages, error: renderingProjectImagesError },
  { data: renderingGallery, error: renderingGalleryError },
  { data: processGallery, error: processGalleryError },
  { data: processProjectImages, error: processProjectImagesError },
  { data: brands, error: brandsError },
] = await Promise.all([
  supabase
    .from("rendering_projects")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false }),
  supabase
    .from("rendering_project_images")
    .select("*")
    .order("rendering_project_id", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true }),
  supabase
    .from("rendering_gallery")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true }),
  supabase
    .from("experiential_process_gallery")
    .select("*")
    .eq("active", true)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true }),
  supabase
    .from("project_images")
    .select("*")
    .order("project_id", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true }),
  supabase
    .from("experiential_brands")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true }),
]);

const firstError =
  renderingProjectsError ||
  renderingProjectImagesError ||
  renderingGalleryError ||
  processGalleryError ||
  processProjectImagesError ||
  brandsError;

if (firstError) {
  console.error(firstError);
  process.exit(1);
}

const imagesByRenderingProjectId = new Map();
for (const image of renderingProjectImages || []) {
  const key = image.rendering_project_id;
  if (!imagesByRenderingProjectId.has(key)) {
    imagesByRenderingProjectId.set(key, []);
  }
  imagesByRenderingProjectId.get(key).push(image);
}

const normalizedRenderingProjects = (renderingProjects || []).map((project) =>
  normalizeRenderingProject(project, imagesByRenderingProjectId.get(project.id))
);

const renderingProjectMap = new Map(
  normalizedRenderingProjects.map((project) => [project.id, project])
);

const normalizedRenderingGallery = (renderingGallery || [])
  .map((item) => ({
    id: item.id,
    altText: item.alt_text || "",
    displayTitle: item.display_title || "",
    description: item.description || "",
    sortOrder: item.sort_order ?? null,
    active: Boolean(item.active),
    projectId: item.rendering_project_id ?? null,
    project: renderingProjectMap.get(item.rendering_project_id) || null,
  }))
  .filter((item) => item.project);

const processImagesByProjectId = new Map();
for (const image of processProjectImages || []) {
  const key = image.project_id;
  if (!key) continue;
  if (!processImagesByProjectId.has(key)) {
    processImagesByProjectId.set(key, []);
  }
  processImagesByProjectId.get(key).push(image);
}

const normalizedProcessGallery = (processGallery || []).map((item) =>
  normalizeProcessGalleryItem({
    ...item,
    images: processImagesByProjectId.get(item.project_id) || [],
  })
);
const normalizedBrands = (brands || []).map(normalizeBrand);

const fileContents = `// Auto-generated by scripts/generate-local-portfolios.mjs
// Do not edit manually. Re-run the generator after portfolio DB changes.

export const generatedRenderingProjects = ${JSON.stringify(normalizedRenderingProjects, null, 2)};

export const generatedRenderingGallery = ${JSON.stringify(normalizedRenderingGallery, null, 2)};

export const generatedExperientialProcessGallery = ${JSON.stringify(normalizedProcessGallery, null, 2)};

export const generatedExperientialBrands = ${JSON.stringify(normalizedBrands, null, 2)};
`;

await fs.writeFile(outputPath, fileContents, "utf8");

console.log(`Generated local portfolio data at ${outputPath}`);
