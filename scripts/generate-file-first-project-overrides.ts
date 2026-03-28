import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content", "projects");
const OUTPUT_PATH = path.join(ROOT, "shared", "fileFirstProjects.generated.ts");

type ScenicMeta = {
  slug: string;
  title: string;
  status?: string;
  featured?: boolean;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  client?: string;
  clientUrl?: string;
  location?: string;
  year?: number;
  month?: number;
  subcategory?: string;
  cover?: {
    asset?: string;
    alt?: string;
    position?: string;
  };
  team?: Array<{ role: string; name: string; url?: string }>;
  tags?: Array<string | { name?: string; slug?: string }>;
  links?: Array<{ label: string; url: string }>;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

type ScenicMediaFile = {
  gallery?: Array<{
    id: string;
    kind?: "cover" | "production" | "rendering";
    asset?: string;
    alt?: string;
    caption?: string;
  }>;
  videos?: Array<{
    id: string;
    provider?: string;
    url?: string;
    title?: string;
  }>;
};

type RenderingMeta = {
  slug: string;
  title: string;
  status?: string;
  featured?: boolean;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  client?: string;
  location?: string;
  year?: number;
  month?: number;
  cover?: {
    asset?: string;
    alt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

type RenderingGalleryFile = {
  images?: Array<{
    asset?: string;
    alt?: string;
    caption?: string;
    sortOrder?: number;
  }>;
  designNotes?: string;
  heroExcerpt?: string;
  bodySections?: Array<{
    heading: string;
    paragraphs: string[];
  }>;
};

function resolveAssetUrl(asset?: string) {
  if (!asset) return undefined;
  if (asset.startsWith("http://") || asset.startsWith("https://")) return asset;
  if (asset.startsWith("/")) return asset;
  if (asset.startsWith("assets/")) return `/${asset}`;
  return undefined;
}

function serialize(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function titleizeSlug(slug: string) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function loadYaml<T>(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  return (yaml.load(raw) ?? {}) as T;
}

async function getProjectSlugs(discipline: "scenic" | "rendering") {
  const dirPath = path.join(CONTENT_ROOT, discipline);
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function main() {
  const scenicSlugs = await getProjectSlugs("scenic");
  const renderingSlugs = await getProjectSlugs("rendering");

  const scenicFieldEntries: string[] = [];
  const scenicMediaEntries: string[] = [];
  const scenicSectionEntries: string[] = [];
  const renderingFieldEntries: string[] = [];
  const renderingContentEntries: string[] = [];

  for (const slug of scenicSlugs) {
    const projectDir = path.join(CONTENT_ROOT, "scenic", slug);
    const meta = await loadYaml<ScenicMeta>(path.join(projectDir, "meta.yaml"));
    const media = await loadYaml<ScenicMediaFile>(path.join(projectDir, "media.yaml"));
    const sections = await loadYaml<unknown[]>(path.join(projectDir, "sections.yaml"));

    const fieldValue: Record<string, unknown> = {
      title: meta.title,
      excerpt: meta.excerpt || undefined,
      subcategory: meta.subcategory || undefined,
      client: meta.client || undefined,
      clientUrl: meta.clientUrl || undefined,
      location: meta.location || undefined,
      year: meta.year,
      month: meta.month,
      status: meta.status || undefined,
      featured: typeof meta.featured === "boolean" ? meta.featured : undefined,
      seoTitle: meta.seoTitle || undefined,
      seoDescription: meta.seoDescription || undefined,
      seoKeywords: Array.isArray(meta.seoKeywords) ? meta.seoKeywords.join(", ") : undefined,
      coverImagePosition: meta.cover?.position || undefined,
      creativeTeam: Array.isArray(meta.team) ? meta.team : undefined,
      tags: Array.isArray(meta.tags)
        ? meta.tags
            .map((tag) =>
              typeof tag === "string"
                ? { slug: tag, name: titleizeSlug(tag) }
                : {
                    slug: tag.slug || "",
                    name: tag.name || titleizeSlug(tag.slug || ""),
                  }
            )
            .filter((tag) => tag.slug)
        : undefined,
      links: Array.isArray(meta.links) ? meta.links : undefined,
      createdAt: meta.createdAt || undefined,
      updatedAt: meta.updatedAt || undefined,
      publishedAt: meta.publishedAt || undefined,
    };

    const resolvedCoverImageUrl = resolveAssetUrl(meta.cover?.asset);
    if (resolvedCoverImageUrl) {
      fieldValue.coverImageUrl = resolvedCoverImageUrl;
    }

    Object.keys(fieldValue).forEach((key) => {
      if (fieldValue[key] === undefined) delete fieldValue[key];
    });

    const mediaValue = [
      ...(media.gallery || []).map((item) => {
        const imageUrl = resolveAssetUrl(item.asset);
        return {
          id: item.id,
          type: "image",
          imageUrl,
          altText: item.alt || meta.cover?.alt || meta.title,
          caption: item.caption || undefined,
          kind: item.kind || "production",
        };
      }),
      ...(media.videos || []).map((item) => ({
        id: item.id,
        type: "video",
        videoUrl: item.url || undefined,
        altText: item.title || meta.title,
      })),
    ].map((item) => {
      const nextItem = { ...item } as Record<string, unknown>;
      Object.keys(nextItem).forEach((key) => {
        if (nextItem[key] === undefined) delete nextItem[key];
      });
      return nextItem;
    });

    scenicFieldEntries.push(`  ${JSON.stringify(slug)}: ${serialize(fieldValue)},`);
    scenicMediaEntries.push(`  ${JSON.stringify(slug)}: ${serialize(mediaValue)},`);
    scenicSectionEntries.push(`  ${JSON.stringify(slug)}: ${serialize(Array.isArray(sections) ? sections : [])},`);
  }

  for (const slug of renderingSlugs) {
    const projectDir = path.join(CONTENT_ROOT, "rendering", slug);
    const meta = await loadYaml<RenderingMeta>(path.join(projectDir, "meta.yaml"));
    const gallery = await loadYaml<RenderingGalleryFile>(path.join(projectDir, "gallery.yaml"));

    const fieldValue: Record<string, unknown> = {
      title: meta.title,
      excerpt: meta.excerpt || undefined,
      client: meta.client || undefined,
      location: meta.location || undefined,
      year: meta.year,
      month: meta.month,
      status: meta.status || undefined,
      featured: typeof meta.featured === "boolean" ? meta.featured : undefined,
      seoTitle: meta.seoTitle || undefined,
      seoDescription: meta.seoDescription || undefined,
      seoKeywords: Array.isArray(meta.seoKeywords) ? meta.seoKeywords.join(", ") : undefined,
      createdAt: meta.createdAt || undefined,
      updatedAt: meta.updatedAt || undefined,
      publishedAt: meta.publishedAt || undefined,
    };

    const resolvedCoverImageUrl = resolveAssetUrl(meta.cover?.asset);
    if (resolvedCoverImageUrl) {
      fieldValue.coverImageUrl = resolvedCoverImageUrl;
    }

    Object.keys(fieldValue).forEach((key) => {
      if (fieldValue[key] === undefined) delete fieldValue[key];
    });

    const contentValue: Record<string, unknown> = {
      images: Array.isArray(gallery.images)
        ? gallery.images.map((image) => {
            const nextImage: Record<string, unknown> = {
              imageUrl: resolveAssetUrl(image.asset),
              altText: image.alt || meta.cover?.alt || meta.title,
              caption: image.caption || undefined,
              sortOrder: image.sortOrder,
            };
            Object.keys(nextImage).forEach((key) => {
              if (nextImage[key] === undefined) delete nextImage[key];
            });
            return nextImage;
          })
        : [],
      designNotes: gallery.designNotes || undefined,
      heroExcerpt: gallery.heroExcerpt || undefined,
      bodySections: Array.isArray(gallery.bodySections) ? gallery.bodySections : undefined,
    };

    Object.keys(contentValue).forEach((key) => {
      if (contentValue[key] === undefined) delete contentValue[key];
    });

    renderingFieldEntries.push(`  ${JSON.stringify(slug)}: ${serialize(fieldValue)},`);
    renderingContentEntries.push(`  ${JSON.stringify(slug)}: ${serialize(contentValue)},`);
  }

  const output = `export const fileFirstScenicProjectFieldsBySlug = {
${scenicFieldEntries.join("\n")}
} as const;

export const fileFirstScenicProjectMediaBySlug = {
${scenicMediaEntries.join("\n")}
} as const;

export const fileFirstScenicProjectSectionsBySlug = {
${scenicSectionEntries.join("\n")}
} as const;

export const fileFirstRenderingProjectFieldsBySlug = {
${renderingFieldEntries.join("\n")}
} as const;

export const fileFirstRenderingProjectContentBySlug = {
${renderingContentEntries.join("\n")}
} as const;
`;

  await fs.writeFile(OUTPUT_PATH, output, "utf8");
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
