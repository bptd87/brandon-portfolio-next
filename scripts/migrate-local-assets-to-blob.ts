import { put } from "@vercel/blob";
import { config as loadEnv } from "dotenv";
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

loadEnv({ path: ".env", override: false });
loadEnv({ path: ".env.local", override: false });

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has("--write");

const rootDir = process.cwd();
const publicAssetDir = path.join(rootDir, "client/public/assets");
const assetGroups = ["about", "studio", "teaching", "articles"] as const;
const scanTargets = ["content", "shared", "client", "app", "components", "lib"] as const;
const allowedTextExtensions = new Set([".json", ".ts", ".tsx", ".yaml", ".yml", ".md"]);
const localAssetPattern = /https:\/\/www\.brandonptdavis\.com(\/assets\/[^\s"'`)]+)|(?<![a-zA-Z0-9_-])(\/assets\/[^\s"'`)]+)/g;

function normalizeSlash(input: string) {
  return input.replace(/\\/g, "/");
}

function extToContentType(filePath: string) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".avif":
      return "image/avif";
    default:
      return undefined;
  }
}

async function walkFiles(dir: string, output: string[]) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(abs, output);
      continue;
    }
    output.push(abs);
  }
}

async function collectLocalAssets() {
  const assetFiles: string[] = [];

  for (const group of assetGroups) {
    const dir = path.join(publicAssetDir, group);
    await walkFiles(dir, assetFiles);
  }

  return assetFiles.sort();
}

type UploadEntry = {
  absolutePath: string;
  assetPath: string;
  targetPath: string;
};

function buildUploadEntry(absolutePath: string): UploadEntry {
  const relativeToPublic = normalizeSlash(path.relative(path.join(rootDir, "client/public"), absolutePath));
  const assetPath = `/${relativeToPublic}`;
  const extension = path.extname(absolutePath);
  const basename = path.basename(absolutePath, extension);
  const dirName = normalizeSlash(path.dirname(relativeToPublic));
  const targetPath = `images/site-assets/${dirName}/${basename}${extension}`.replace(/\/+/g, "/");
  return { absolutePath, assetPath, targetPath };
}

async function uploadAsset(entry: UploadEntry) {
  const body = await readFile(entry.absolutePath);
  const uploaded = await put(entry.targetPath, body, {
    access: "public",
    addRandomSuffix: false,
    contentType: extToContentType(entry.absolutePath),
  });
  return uploaded.url;
}

async function collectTextFiles() {
  const files: string[] = [];

  for (const target of scanTargets) {
    const abs = path.join(rootDir, target);
    const entries = await readdir(abs, { withFileTypes: true });
    const stack = entries.map((entry) => path.join(abs, entry.name));

    while (stack.length) {
      const current = stack.pop()!;
      const rel = normalizeSlash(path.relative(rootDir, current));
      const statEntries = await readdir(current, { withFileTypes: true }).catch(() => null);

      if (statEntries) {
        if (rel.includes("node_modules") || rel.includes(".next") || rel.includes(".git")) continue;
        for (const entry of statEntries) {
          stack.push(path.join(current, entry.name));
        }
        continue;
      }

      if (allowedTextExtensions.has(path.extname(current))) {
        files.push(current);
      }
    }
  }

  return files;
}

function replaceAssetUrls(input: string, replacements: Map<string, string>) {
  return input.replace(localAssetPattern, (match, prefixedPath, plainPath) => {
    const assetPath = prefixedPath || plainPath;
    return replacements.get(assetPath) || match;
  });
}

async function main() {
  const assetFiles = await collectLocalAssets();
  const uploadEntries = assetFiles.map(buildUploadEntry);

  if (!uploadEntries.length) {
    console.log("No local asset files found in client/public/assets.");
    return;
  }

  console.log(`Found ${uploadEntries.length} local asset files to migrate.`);

  if (!shouldWrite) {
    for (const entry of uploadEntries) {
      console.log(`${entry.assetPath} -> ${entry.targetPath}`);
    }
    console.log("\nRun with --write and BLOB_READ_WRITE_TOKEN to upload and rewrite references.");
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN.");
  }

  const replacements = new Map<string, string>();

  for (const entry of uploadEntries) {
    const uploadedUrl = await uploadAsset(entry);
    replacements.set(entry.assetPath, uploadedUrl);
    console.log(`Uploaded ${entry.assetPath} -> ${uploadedUrl}`);
  }

  const textFiles = await collectTextFiles();

  for (const absolutePath of textFiles) {
    const original = await readFile(absolutePath, "utf8");
    const next = replaceAssetUrls(original, replacements);
    if (next !== original) {
      await writeFile(absolutePath, next, "utf8");
      console.log(`Updated ${normalizeSlash(path.relative(rootDir, absolutePath))}`);
    }
  }

  const manifestObject = Object.fromEntries([...replacements.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  const manifestJson = `${JSON.stringify(manifestObject, null, 2)}\n`;
  await writeFile(path.join(rootDir, "shared/localAssetBlobManifest.json"), manifestJson, "utf8");
  console.log("Wrote shared/localAssetBlobManifest.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).then(() => {
  process.exit(0);
});
