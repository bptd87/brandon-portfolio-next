import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

import { assistantScenicDesignEntries } from "../shared/localAssistantScenic";
import { getLocalArticles } from "../shared/localArticles";
import { getLocalExperientialProjects, getLocalExperientialSamples, getLocalRenderingProjects } from "../shared/localPortfolios";
import { getLocalScenicProjects } from "../shared/localScenicProjects";
import { getLocalCollaborators, getLocalStudioDirectory, getLocalTutorials } from "../shared/localStudio";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content");

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

async function writeJsonFile(filePath: string, value: unknown) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function exportScenicProjects() {
  for (const project of getLocalScenicProjects()) {
    const projectDir = path.join(CONTENT_ROOT, "projects", "scenic", project.slug);

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
        alt: `${project.title} scenic design cover image`,
        position: project.coverImagePosition || undefined,
      },
      team: project.creativeTeam.map((member) => ({
        role: member.role,
        name: member.name,
      })),
      tags: project.tags.map((tag) => tag.slug),
      links: project.links || [],
      publishedAt: project.publishedAt || undefined,
      updatedAt: project.updatedAt || undefined,
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
    const projectDir = path.join(CONTENT_ROOT, "projects", "rendering", project.slug);

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
        alt: `${project.title} rendering project cover image`,
      },
      publishedAt: project.publishedAt || undefined,
      updatedAt: project.updatedAt || undefined,
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

async function exportExperientialProjects() {
  for (const project of getLocalExperientialProjects()) {
    const projectDir = path.join(CONTENT_ROOT, "projects", "experiential", project.slug);

    await writeYamlFile(path.join(projectDir, "meta.yaml"), {
      type: "project",
      discipline: "experiential",
      slug: project.slug,
      title: project.title,
      status: "published",
      featured: false,
      excerpt: project.summary,
      seoTitle: project.seoTitle || undefined,
      seoDescription: project.seoDescription || undefined,
      year: project.year || undefined,
      cover: {
        asset: extractAssetRef(project.coverImageUrl),
        alt: project.coverAltText,
      },
      mediaTypes: project.mediaTypes,
      updatedAt: project.updatedAt || undefined,
    });

    await writeYamlFile(path.join(projectDir, "sections.yaml"), project.sections);
    await writeYamlFile(path.join(projectDir, "samples.yaml"), project.samples.map((sample) => ({
      slug: sample.slug,
      category: sample.category,
      categoryLabel: sample.categoryLabel,
      title: sample.displayTitle,
      description: sample.description,
      asset: extractAssetRef(sample.imageUrl),
      alt: sample.altText,
      gallery: sample.images?.map((image) => ({
        asset: extractAssetRef(image.imageUrl),
        alt: image.altText || sample.altText,
        caption: image.caption || undefined,
      })) || [],
    })));
  }

  for (const sample of getLocalExperientialSamples()) {
    await writeYamlFile(
      path.join(CONTENT_ROOT, "projects", "experiential-samples", sample.category, `${sample.slug}.yaml`),
      {
        slug: sample.slug,
        category: sample.category,
        categoryLabel: sample.categoryLabel,
        title: sample.displayTitle,
        description: sample.description,
        asset: extractAssetRef(sample.imageUrl),
        alt: sample.altText,
        gallery: sample.images?.map((image) => ({
          asset: extractAssetRef(image.imageUrl),
          alt: image.altText || sample.altText,
          caption: image.caption || undefined,
        })) || [],
      }
    );
  }
}

async function exportArticles() {
  for (const article of getLocalArticles()) {
    const articleDir = path.join(CONTENT_ROOT, "articles", article.slug);

    await writeYamlFile(path.join(articleDir, "meta.yaml"), {
      type: "article",
      slug: article.slug,
      title: article.title,
      status: "published",
      featured: article.featured || false,
      excerpt: article.excerpt,
      category: article.categoryName,
      seoTitle: article.seoTitle || undefined,
      seoDescription: article.seoDescription || undefined,
      seoKeywords: article.seoKeywords
        ? article.seoKeywords.split(",").map((entry) => entry.trim()).filter(Boolean)
        : [],
      cover: {
        asset: extractAssetRef(article.coverImageUrl),
        alt: article.coverImageAlt,
      },
      tags: (article.tags || []).map((tag) => tag.slug),
      readTime: article.readTime || undefined,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      sourcePublication: article.sourcePublication || undefined,
      sourceUrl: article.sourceUrl || undefined,
      audio: article.audio
        ? {
            asset: extractAssetRef(article.audio.url),
            label: article.audio.label || "Listen to article",
            durationLabel: article.audio.durationLabel || undefined,
          }
        : undefined,
      linkedScenicProjectSlugs: article.linkedScenicProjectSlugs || [],
      series: article.series || undefined,
    });

    await writeJsonFile(path.join(articleDir, "blocks.json"), article.content);
  }
}

async function exportTutorials() {
  for (const tutorial of getLocalTutorials()) {
    await writeYamlFile(path.join(CONTENT_ROOT, "tutorials", `${tutorial.slug}.yaml`), {
      ...tutorial,
      cover_image: extractAssetRef(tutorial.cover_image),
    });
  }
}

async function exportCollaborators() {
  for (const collaborator of getLocalCollaborators()) {
    await writeYamlFile(path.join(CONTENT_ROOT, "collaborators", `${collaborator.slug}.yaml`), {
      ...collaborator,
      coverImage: extractAssetRef(collaborator.coverImage),
    });
  }
}

async function exportDirectory() {
  for (const entry of getLocalStudioDirectory()) {
    await writeYamlFile(path.join(CONTENT_ROOT, "directory", `${entry.slug}.yaml`), {
      ...entry,
      cover_image: extractAssetRef(entry.cover_image),
    });
  }
}

async function exportAssistantScenic() {
  await writeYamlFile(path.join(CONTENT_ROOT, "assistant-scenic", "entries.yaml"), assistantScenicDesignEntries.map((entry) => ({
    ...entry,
    coverImageUrl: extractAssetRef(entry.coverImageUrl),
  })));
}

async function exportSiteSettings() {
  await writeYamlFile(path.join(CONTENT_ROOT, "site", "settings.yaml"), {
    siteName: "Brandon PT Davis",
    siteUrl: "https://www.brandonptdavis.com",
    title: "Brandon PT Davis | Scenic Designer",
    description:
      "Union scenic designer in Southern California creating story-driven environments for regional theatre, summer stock, and academic production.",
    email: "info@brandonptdavis.com",
    social: {
      instagram: "https://www.instagram.com/brandonptdavisdesign",
      linkedin: "https://www.linkedin.com/in/brandonptdavis",
      youtube: "https://www.youtube.com/@brandonptdavis",
      pinterest: "https://www.pinterest.com/BrandonPTDavis/",
    },
  });
}

async function main() {
  await exportSiteSettings();
  await exportScenicProjects();
  await exportRenderingProjects();
  await exportExperientialProjects();
  await exportArticles();
  await exportTutorials();
  await exportCollaborators();
  await exportDirectory();
  await exportAssistantScenic();

  console.log(`Exported file-first content to ${CONTENT_ROOT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
