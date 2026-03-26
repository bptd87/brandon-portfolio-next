import "dotenv/config";

import { put } from "@vercel/blob";
import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import { getLocalArticles } from "../shared/localArticles";
import {
  assistantScenicDesignEntries,
  type AssistantScenicDesignEntry,
} from "../shared/localAssistantScenic";
import {
  getLocalExperientialBrands,
  getLocalExperientialProcessGallery,
  getLocalRenderingProjects,
  type LocalExperientialBrand,
  type LocalExperientialProcessGalleryItem,
  type LocalRenderingProject,
} from "../shared/localPortfolios";
import { getLocalScenicProjects } from "../shared/localScenicProjects";
import {
  getLocalCollaborators,
  getLocalStudioDirectory,
  getLocalTutorials,
  type LocalCollaborator,
  type LocalStudioDirectoryEntry,
  type LocalTutorial,
} from "../shared/localStudio";
import { getScenicBlobPath } from "../shared/scenicMedia";

type AssetFamily =
  | "scenic"
  | "articles"
  | "rendering"
  | "experiential"
  | "brands"
  | "tutorials"
  | "collaborators"
  | "directory"
  | "assistant"
  | "about";

type MediaKind = "image" | "audio" | "video" | "pdf" | "file";

type MediaAsset = {
  family: AssetFamily;
  pageKey: string;
  mediaId: string;
  sourceUrl: string;
  targetPath: string;
};

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has("--write");
const familyArg = process.argv
  .slice(2)
  .find((arg) => arg.startsWith("--family="))
  ?.split("=")[1]
  ?.trim()
  .toLowerCase();
const validFamilies = new Set<AssetFamily>([
  "scenic",
  "articles",
  "rendering",
  "experiential",
  "brands",
  "tutorials",
  "collaborators",
  "directory",
  "assistant",
  "about",
]);
const familyFilter = familyArg && validFamilies.has(familyArg as AssetFamily) ? (familyArg as AssetFamily) : null;

const GENERAL_MANIFEST_PATH = path.join(process.cwd(), "shared", "mediaBlobManifest.ts");
const SCENIC_MANIFEST_PATH = path.join(process.cwd(), "shared", "scenicBlobManifest.ts");

const ABOUT_MEDIA = [
  {
    pageKey: "page",
    mediaId: "gallery-uci",
    sourceUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-uci.webp",
  },
  {
    pageKey: "page",
    mediaId: "gallery-teaching",
    sourceUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-teaching.webp",
  },
  {
    pageKey: "page",
    mediaId: "gallery-teams",
    sourceUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-teams.webp",
  },
  {
    pageKey: "page",
    mediaId: "gallery-mentors",
    sourceUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-mentors.webp",
  },
  {
    pageKey: "page",
    mediaId: "gallery-collaborations",
    sourceUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-collaborations.webp",
  },
  {
    pageKey: "page",
    mediaId: "gallery-family",
    sourceUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-family.webp",
  },
  {
    pageKey: "page",
    mediaId: "gallery-partnerships",
    sourceUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-partnerships.webp",
  },
  {
    pageKey: "page",
    mediaId: "gallery-behind-scenes",
    sourceUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-behind-scenes.webp",
  },
  {
    pageKey: "page",
    mediaId: "profile-headshot",
    sourceUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/profile-headshot.webp",
  },
] as const;

function stripQueryAndHash(input: string) {
  return input.split("#")[0]?.split("?")[0] ?? input;
}

function sanitizePathSegment(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "asset";
}

function getFilenameFromUrl(sourceUrl: string) {
  const cleanUrl = stripQueryAndHash(sourceUrl);
  return cleanUrl.split("/").pop() || "asset";
}

function getExtension(sourceUrl: string) {
  const filename = getFilenameFromUrl(sourceUrl);
  const ext = filename.includes(".") ? filename.split(".").pop() : "";
  return sanitizePathSegment(ext || "bin");
}

function inferMediaKind(sourceUrl: string): MediaKind {
  const clean = stripQueryAndHash(sourceUrl).toLowerCase();
  if (clean.endsWith(".mp3") || clean.endsWith(".wav") || clean.endsWith(".m4a") || clean.endsWith(".ogg")) {
    return "audio";
  }
  if (clean.endsWith(".mp4") || clean.endsWith(".mov") || clean.endsWith(".webm")) {
    return "video";
  }
  if (clean.endsWith(".pdf")) return "pdf";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg") || clean.endsWith(".png") || clean.endsWith(".webp") || clean.endsWith(".gif") || clean.endsWith(".avif")) {
    return "image";
  }
  return "file";
}

function getMediaRoot(kind: MediaKind) {
  switch (kind) {
    case "audio":
      return "audio";
    case "video":
      return "video";
    case "pdf":
      return "pdf";
    case "image":
      return "images";
    default:
      return "files";
  }
}

function withHashedBasename(mediaId: string, sourceUrl: string) {
  const ext = getExtension(sourceUrl);
  const base = sanitizePathSegment(mediaId || getFilenameFromUrl(sourceUrl).replace(/\.[^.]+$/, ""));
  const hash = createHash("sha1").update(sourceUrl).digest("hex").slice(0, 8);
  return `${base}-${hash}.${ext}`;
}

function getSuggestedMediaId(sourceUrl: string, fallback: string) {
  const filename = getFilenameFromUrl(sourceUrl).replace(/\.[^.]+$/, "");
  return sanitizePathSegment(filename || fallback);
}

function createPath(parts: string[], mediaId: string, sourceUrl: string) {
  const folder = parts.map(sanitizePathSegment).filter(Boolean).join("/");
  return `${folder}/${withHashedBasename(mediaId, sourceUrl)}`;
}

function isSupabaseStorageUrl(value: string) {
  return /^https?:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/(?:public|sign)\//i.test(value);
}

function addAsset(
  assets: MediaAsset[],
  seen: Set<string>,
  family: AssetFamily,
  pageKey: string,
  mediaId: string,
  sourceUrl: string,
  targetPath: string
) {
  if (!isSupabaseStorageUrl(sourceUrl)) return;
  if (seen.has(sourceUrl)) return;
  seen.add(sourceUrl);
  assets.push({ family, pageKey, mediaId, sourceUrl, targetPath });
}

function collectUrlsFromValue(value: unknown, visitor: (url: string, trace: string) => void, trace = "root") {
  if (typeof value === "string") {
    if (isSupabaseStorageUrl(value)) {
      visitor(value, trace);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectUrlsFromValue(item, visitor, `${trace}-${index}`));
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => collectUrlsFromValue(child, visitor, `${trace}-${key}`));
  }
}

function collectScenicAssets() {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];
  const projects = getLocalScenicProjects();

  for (const project of projects) {
    if (project.coverImageUrl) {
      addAsset(
        assets,
        seen,
        "scenic",
        project.slug,
        `${project.slug}-cover`,
        project.coverImageUrl,
        getScenicBlobPath(project.slug, `${project.slug}-cover`, project.coverImageUrl)
      );
    }

    for (const mediaItem of project.media) {
      if (mediaItem.type !== "image" || !mediaItem.imageUrl) continue;
      addAsset(
        assets,
        seen,
        "scenic",
        project.slug,
        String(mediaItem.id),
        mediaItem.imageUrl,
        getScenicBlobPath(project.slug, String(mediaItem.id), mediaItem.imageUrl)
      );
    }
  }

  return assets;
}

function collectArticleAssets() {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];

  for (const article of getLocalArticles()) {
    if (article.coverImageUrl) {
      addAsset(
        assets,
        seen,
        "articles",
        article.slug,
        "cover",
        article.coverImageUrl,
        createPath(["images", "articles", article.slug], "cover", article.coverImageUrl)
      );
    }

    if (article.audio?.url) {
      addAsset(
        assets,
        seen,
        "articles",
        article.slug,
        "audio",
        article.audio.url,
        createPath(["audio", "articles", article.slug], "audio", article.audio.url)
      );
    }

    collectUrlsFromValue(article.content, (url, trace) => {
      const mediaKind = inferMediaKind(url);
      const root = getMediaRoot(mediaKind);
      const bucketFolder = mediaKind === "image" ? "body" : mediaKind;
      const mediaId = getSuggestedMediaId(url, trace);
      addAsset(
        assets,
        seen,
        "articles",
        article.slug,
        mediaId,
        url,
        createPath([root, "articles", article.slug, bucketFolder], mediaId, url)
      );
    });
  }

  return assets;
}

function collectRenderingAssets() {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];

  for (const project of getLocalRenderingProjects()) {
    if (project.coverImageUrl) {
      addAsset(
        assets,
        seen,
        "rendering",
        project.slug,
        "cover",
        project.coverImageUrl,
        createPath(["images", "projects", "rendering", project.slug], "cover", project.coverImageUrl)
      );
    }

    for (const image of project.images) {
      addAsset(
        assets,
        seen,
        "rendering",
        project.slug,
        `image-${image.id}`,
        image.imageUrl,
        createPath(["images", "projects", "rendering", project.slug], `image-${image.id}`, image.imageUrl)
      );
    }
  }

  return assets;
}

function collectExperientialAssets() {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];

  for (const sample of getLocalExperientialProcessGallery()) {
    const folderParts = ["images", "projects", "experiential", sample.category, sample.slug];
    if (sample.imageUrl) {
      addAsset(assets, seen, "experiential", sample.slug, "cover", sample.imageUrl, createPath(folderParts, "cover", sample.imageUrl));
    }
    for (const image of sample.images || []) {
      if (!image.imageUrl) continue;
      addAsset(
        assets,
        seen,
        "experiential",
        sample.slug,
        `image-${image.id}`,
        image.imageUrl,
        createPath(folderParts, `image-${image.id}`, image.imageUrl)
      );
    }
  }

  return assets;
}

function collectBrandAssets() {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];

  for (const brand of getLocalExperientialBrands()) {
    addAsset(
      assets,
      seen,
      "brands",
      brand.name,
      "logo",
      brand.logoUrl,
      createPath(
        ["images", "projects", "experiential", "page", "brands", brand.name],
        "logo",
        brand.logoUrl
      )
    );
  }

  return assets;
}

function collectTutorialAssets() {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];

  for (const tutorial of getLocalTutorials()) {
    collectUrlsFromValue(tutorial, (url, trace) => {
      const mediaKind = inferMediaKind(url);
      const root = getMediaRoot(mediaKind);
      const mediaId = getSuggestedMediaId(url, trace);
      addAsset(
        assets,
        seen,
        "tutorials",
        tutorial.slug,
        mediaId,
        url,
        createPath([root, "studio", "tutorials", tutorial.slug], mediaId, url)
      );
    });
  }

  return assets;
}

function collectCollaboratorAssets() {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];

  for (const collaborator of getLocalCollaborators()) {
    collectUrlsFromValue(collaborator, (url, trace) => {
      const mediaKind = inferMediaKind(url);
      const root = getMediaRoot(mediaKind);
      const mediaId = getSuggestedMediaId(url, trace);
      addAsset(
        assets,
        seen,
        "collaborators",
        collaborator.slug,
        mediaId,
        url,
        createPath([root, "about", "collaborators", collaborator.slug], mediaId, url)
      );
    });
  }

  return assets;
}

function collectDirectoryAssets() {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];

  for (const entry of getLocalStudioDirectory()) {
    collectUrlsFromValue(entry, (url, trace) => {
      const mediaKind = inferMediaKind(url);
      const root = getMediaRoot(mediaKind);
      const mediaId = getSuggestedMediaId(url, trace);
      addAsset(
        assets,
        seen,
        "directory",
        entry.slug,
        mediaId,
        url,
        createPath([root, "studio", "directory", entry.slug], mediaId, url)
      );
    });
  }

  return assets;
}

function collectAssistantAssets() {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];

  for (const entry of assistantScenicDesignEntries) {
    addAsset(
      assets,
      seen,
      "assistant",
      entry.anchorId,
      "cover",
      entry.coverImageUrl,
      createPath(["images", "assistant-scenic-design", entry.anchorId], "cover", entry.coverImageUrl)
    );
  }

  return assets;
}

function collectAboutAssets() {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];

  for (const asset of ABOUT_MEDIA) {
    addAsset(
      assets,
      seen,
        "about",
        asset.pageKey,
        asset.mediaId,
        asset.sourceUrl,
        createPath(["images", "about", asset.pageKey], asset.mediaId, asset.sourceUrl)
      );
  }

  return assets;
}

function collectAssets() {
  const allCollectors: Array<() => MediaAsset[]> = [
    collectScenicAssets,
    collectArticleAssets,
    collectRenderingAssets,
    collectExperientialAssets,
    collectBrandAssets,
    collectTutorialAssets,
    collectCollaboratorAssets,
    collectDirectoryAssets,
    collectAssistantAssets,
    collectAboutAssets,
  ];

  const assets = allCollectors.flatMap((collect) => collect());
  return familyFilter ? assets.filter((asset) => asset.family === familyFilter) : assets;
}

function renderManifestFile(entries: Record<string, string>, exportName: string) {
  const sortedEntries = Object.entries(entries).sort(([a], [b]) => a.localeCompare(b));
  const body = sortedEntries
    .map(([source, target]) => `  ${JSON.stringify(source)}: ${JSON.stringify(target)},`)
    .join("\n");

  return `export const ${exportName}: Record<string, string> = {\n${body}\n};\n`;
}

async function uploadAsset(asset: MediaAsset) {
  const response = await fetch(asset.sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${asset.sourceUrl}: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") || "application/octet-stream";
  const arrayBuffer = await response.arrayBuffer();
  const uploaded = await put(asset.targetPath, arrayBuffer, {
    access: "public",
    addRandomSuffix: false,
    contentType,
  });

  return uploaded.url;
}

async function main() {
  const assets = collectAssets();
  const scenicAssets = assets.filter((asset) => asset.family === "scenic");
  const generalAssets = assets.filter((asset) => asset.family !== "scenic");

  console.log(`Assets discovered: ${assets.length}`);
  console.log(`Mode: ${shouldWrite ? "write" : "dry-run"}`);
  if (familyFilter) {
    console.log(`Family filter: ${familyFilter}`);
  }
  console.log("");

  for (const asset of assets.slice(0, 20)) {
    console.log(`${asset.family.padEnd(14)} ${asset.pageKey.padEnd(36)} ${asset.targetPath}`);
  }

  if (assets.length > 20) {
    console.log(`...and ${assets.length - 20} more assets`);
  }

  if (!shouldWrite) {
    console.log("");
    console.log("Run with --write and BLOB_READ_WRITE_TOKEN to upload site assets and write manifests.");
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN.");
  }

  const scenicManifest: Record<string, string> = {};
  const generalManifest: Record<string, string> = {};

  for (const asset of assets) {
    console.log(`Uploading ${asset.targetPath}`);
    const blobUrl = await uploadAsset(asset);
    if (asset.family === "scenic") {
      scenicManifest[asset.sourceUrl] = blobUrl;
    } else {
      generalManifest[asset.sourceUrl] = blobUrl;
    }
  }

  if (!familyFilter || familyFilter === "scenic") {
    await writeFile(SCENIC_MANIFEST_PATH, renderManifestFile(scenicManifest, "scenicBlobManifest"), "utf8");
    console.log(`Wrote scenic manifest: ${SCENIC_MANIFEST_PATH}`);
  }

  if (!familyFilter || familyFilter !== "scenic") {
    await writeFile(GENERAL_MANIFEST_PATH, renderManifestFile(generalManifest, "mediaBlobManifest"), "utf8");
    console.log(`Wrote general manifest: ${GENERAL_MANIFEST_PATH}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
