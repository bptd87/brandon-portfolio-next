import "dotenv/config";

import { put } from "@vercel/blob";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import { getLocalScenicProjects } from "../shared/localScenicProjects";
import { getScenicBlobPath } from "../shared/scenicMedia";

type ScenicAsset = {
  projectSlug: string;
  mediaId: string;
  sourceUrl: string;
  targetPath: string;
};

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has("--write");
const projectArg = process.argv.slice(2).find((arg) => arg.startsWith("--project="));
const projectFilter = projectArg ? projectArg.split("=")[1]?.trim().toLowerCase() : "";

function isMigratableImageUrl(url: string) {
  return /^https?:\/\//i.test(url) && !url.includes("youtu");
}

function collectScenicAssets(): ScenicAsset[] {
  const projects = getLocalScenicProjects().filter((project) =>
    projectFilter ? project.slug === projectFilter : true
  );
  const seenSourceUrls = new Set<string>();
  const assets: ScenicAsset[] = [];

  for (const project of projects) {
    if (project.coverImageUrl && isMigratableImageUrl(project.coverImageUrl)) {
      const key = `${project.slug}::${project.coverImageUrl}`;
      if (!seenSourceUrls.has(key)) {
        seenSourceUrls.add(key);
        assets.push({
          projectSlug: project.slug,
          mediaId: `${project.slug}-cover`,
          sourceUrl: project.coverImageUrl,
          targetPath: getScenicBlobPath(project.slug, `${project.slug}-cover`, project.coverImageUrl),
        });
      }
    }

    for (const mediaItem of project.media) {
      if (mediaItem.type !== "image" || !mediaItem.imageUrl || !isMigratableImageUrl(mediaItem.imageUrl)) {
        continue;
      }

      const key = `${project.slug}::${mediaItem.imageUrl}`;
      if (seenSourceUrls.has(key)) continue;
      seenSourceUrls.add(key);

      assets.push({
        projectSlug: project.slug,
        mediaId: mediaItem.id,
        sourceUrl: mediaItem.imageUrl,
        targetPath: getScenicBlobPath(project.slug, mediaItem.id, mediaItem.imageUrl),
      });
    }
  }

  return assets;
}

function renderManifestFile(entries: Record<string, string>) {
  const sortedEntries = Object.entries(entries).sort(([a], [b]) => a.localeCompare(b));
  const body = sortedEntries
    .map(([source, target]) => `  ${JSON.stringify(source)}: ${JSON.stringify(target)},`)
    .join("\n");

  return `export const scenicBlobManifest: Record<string, string> = {\n${body}\n};\n`;
}

async function uploadAsset(asset: ScenicAsset) {
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
  const assets = collectScenicAssets();

  console.log(`Scenic assets discovered: ${assets.length}`);
  console.log(`Mode: ${shouldWrite ? "write" : "dry-run"}`);
  if (projectFilter) {
    console.log(`Project filter: ${projectFilter}`);
  }
  console.log("");

  for (const asset of assets.slice(0, 15)) {
    console.log(`${asset.projectSlug.padEnd(32)} ${asset.targetPath}`);
  }

  if (assets.length > 15) {
    console.log(`...and ${assets.length - 15} more scenic assets`);
  }

  if (!shouldWrite) {
    console.log("");
    console.log("Run with --write and BLOB_READ_WRITE_TOKEN to upload scenic assets and write the manifest.");
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN.");
  }

  const uploadedManifest: Record<string, string> = {};

  for (const asset of assets) {
    console.log(`Uploading ${asset.targetPath}`);
    const blobUrl = await uploadAsset(asset);
    uploadedManifest[asset.sourceUrl] = blobUrl;
  }

  const manifestPath = path.join(process.cwd(), "shared", "scenicBlobManifest.ts");
  await writeFile(manifestPath, renderManifestFile(uploadedManifest), "utf8");

  console.log("");
  console.log(`Wrote scenic Blob manifest: ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
