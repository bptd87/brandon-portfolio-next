import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

import { getLocalRenderingProjects } from "../shared/localPortfolios";
import { getLocalScenicProjects } from "../shared/localScenicProjects";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content", "projects");

function extractAssetRef(url?: string | null) {
  const value = String(url || "").trim();
  if (!value) return "";

  const publicMarker = "/storage/v1/object/public/";
  const signedMarker = "/storage/v1/object/sign/";

  if (value.includes(publicMarker)) {
    return value.split(publicMarker)[1]?.split("?")[0] || value;
  }

  if (value.includes(signedMarker)) {
    return value.split(signedMarker)[1]?.split("?")[0] || value;
  }

  return value;
}

function toYaml(value: unknown) {
  return yaml.dump(value, {
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
  });
}

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeYamlFile(filePath: string, value: unknown) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, toYaml(value), "utf8");
}

async function exportScenicProjects() {
  for (const project of getLocalScenicProjects()) {
    const projectDir = path.join(CONTENT_ROOT, "scenic", project.slug);

    await writeYamlFile(path.join(projectDir, "meta.yaml"), {
      type: "project",
      discipline: "scenic",
      slug: project.slug,
      title: project.title,
      status: project.status,
      featured: project.featured,
      excerpt: project.excerpt,
      seoTitle: project.seoTitle || undefined,
      seoDescription: project.seoDescription || undefined,
      seoKeywords: project.seoKeywords
        ? project.seoKeywords.split(",").map((entry) => entry.trim()).filter(Boolean)
        : [],
      client: project.client || undefined,
      clientUrl: project.clientUrl || undefined,
      location: project.location || undefined,
      year: project.year || undefined,
      month: project.month || undefined,
      subcategory: project.subcategory || undefined,
      cover: {
        asset: extractAssetRef(project.coverImageUrl),
        alt: project.media.find((item) => item.kind === "cover" && item.type === "image")?.altText || project.title,
        position: project.coverImagePosition || undefined,
      },
      team: project.creativeTeam.map((member) => ({
        role: member.role,
        name: member.name,
        url: member.url || undefined,
      })),
      tags: project.tags.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
      })),
      links: project.links || [],
      publishedAt: project.publishedAt || undefined,
      updatedAt: project.updatedAt || undefined,
      createdAt: project.createdAt || undefined,
    });

    await writeYamlFile(path.join(projectDir, "media.yaml"), {
      gallery: project.media
        .filter((item) => item.type === "image" && item.imageUrl)
        .map((item) => ({
          id: item.id,
          kind: item.kind || "production",
          asset: extractAssetRef(item.imageUrl),
          alt: item.altText,
          caption: item.caption || undefined,
        })),
      videos: project.media
        .filter((item) => item.type === "video" && item.videoUrl)
        .map((item) => ({
          id: item.id,
          provider: item.videoUrl?.includes("vimeo") ? "vimeo" : "youtube",
          url: item.videoUrl,
          title: item.altText || project.title,
        })),
    });

    await writeYamlFile(path.join(projectDir, "sections.yaml"), project.sections);
  }
}

async function exportRenderingProjects() {
  for (const project of getLocalRenderingProjects()) {
    const projectDir = path.join(CONTENT_ROOT, "rendering", project.slug);

    await writeYamlFile(path.join(projectDir, "meta.yaml"), {
      type: "project",
      discipline: "rendering",
      slug: project.slug,
      title: project.title,
      status: project.status || "published",
      featured: project.featured,
      excerpt: project.excerpt,
      seoTitle: project.seoTitle || undefined,
      seoDescription: project.seoDescription || undefined,
      seoKeywords: project.seoKeywords
        ? project.seoKeywords.split(",").map((entry) => entry.trim()).filter(Boolean)
        : [],
      client: project.client || undefined,
      location: project.location || undefined,
      year: project.year || undefined,
      month: project.month || undefined,
      cover: {
        asset: extractAssetRef(project.coverImageUrl),
        alt: project.images[0]?.altText || `${project.title} rendering project cover image`,
      },
      publishedAt: project.publishedAt || undefined,
      updatedAt: project.updatedAt || undefined,
      createdAt: project.createdAt || undefined,
    });

    await writeYamlFile(path.join(projectDir, "gallery.yaml"), {
      images: project.images.map((image) => ({
        asset: extractAssetRef(image.imageUrl),
        alt: image.altText,
        caption: image.caption || undefined,
        sortOrder: image.sortOrder || undefined,
      })),
      designNotes: project.designNotes,
      heroExcerpt: project.heroExcerpt || undefined,
      bodySections: project.bodySections || [],
    });
  }
}

async function main() {
  await exportScenicProjects();
  await exportRenderingProjects();
  console.log("Wrote current scenic and rendering project content to content/projects/*");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
