import { put } from "@vercel/blob";
import { config as loadEnv } from "dotenv";
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type MediaKind = "image" | "audio" | "video" | "pdf" | "file";

type FileScan = {
  file: string;
  urls: string[];
};

loadEnv({ path: ".env", override: false });
loadEnv({ path: ".env.local", override: false });

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has("--write");

const rootDir = process.cwd();

const scanTargets = [
  "content/articles",
  "content/tutorials",
  "shared/localArticles.ts",
  "shared/localArticles.generated.ts",
  "shared/localPortfolios.generated.ts",
  "shared/localScenicProjects.ts",
  "shared/publicContent.ts",
  "shared/localAssistantScenic.ts",
  "client/src/pages/About.tsx",
  "client/src/pages/SyllabusExperiential.tsx",
  "client/src/pages/Resume.tsx",
  "client/src/pages/DesignHistoryTimeline.tsx",
  "client/src/pages/DimensionReference.tsx",
] as const;

const allowedExtensions = new Set([".json", ".ts", ".tsx", ".yaml", ".yml"]);
const supabaseUrlPattern =
  /https?:\/\/xibkuwouvisabnfowthn\.supabase\.co\/storage\/v1\/object\/(?:public|sign)\/[^\s"'`)\]]+/gi;

function stripQueryAndHash(input: string) {
  return input.split("#")[0]?.split("?")[0] ?? input;
}

function sanitizeSegment(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "asset";
}

function getFilenameFromUrl(url: string) {
  const pathname = decodeURIComponent(new URL(stripQueryAndHash(url)).pathname);
  return path.basename(pathname) || "asset";
}

function getExtension(url: string) {
  const filename = getFilenameFromUrl(url);
  return path.extname(filename).toLowerCase() || ".bin";
}

function inferMediaKind(url: string): MediaKind {
  const clean = stripQueryAndHash(url).toLowerCase();
  if (/\.(mp3|wav|m4a|ogg)$/.test(clean)) return "audio";
  if (/\.(mp4|mov|webm)$/.test(clean)) return "video";
  if (clean.endsWith(".pdf")) return "pdf";
  if (/\.(jpg|jpeg|png|webp|gif|avif|svg)$/.test(clean)) return "image";
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

function withHashedBasename(url: string) {
  const ext = getExtension(url);
  const base = sanitizeSegment(path.basename(getFilenameFromUrl(url), ext));
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 8);
  return `${base}-${hash}${ext}`;
}

function getTargetPrefix(file: string, kind: MediaKind) {
  const mediaRoot = getMediaRoot(kind);

  const articleMatch = file.match(/content\/articles\/([^/]+)\//);
  if (articleMatch) {
    const slug = sanitizeSegment(articleMatch[1]);
    return [mediaRoot, "articles", slug, kind === "image" ? "body" : kind];
  }

  const tutorialMatch = file.match(/content\/tutorials\/([^/.]+)\.ya?ml$/);
  if (tutorialMatch) {
    const slug = sanitizeSegment(tutorialMatch[1]);
    return [mediaRoot, "tutorials", slug, kind === "image" ? "media" : kind];
  }

  if (file.endsWith("shared/localArticles.generated.ts")) {
    return [mediaRoot, "migrated", "supabase", "generated-articles"];
  }

  if (file.endsWith("shared/localArticles.ts")) {
    return [mediaRoot, "migrated", "supabase", "local-articles"];
  }

  if (file.endsWith("shared/localPortfolios.generated.ts")) {
    return [mediaRoot, "migrated", "supabase", "generated-portfolios"];
  }

  if (file.endsWith("shared/localScenicProjects.ts")) {
    return [mediaRoot, "migrated", "supabase", "scenic-projects"];
  }

  if (file.endsWith("shared/publicContent.ts") || file.endsWith("shared/localAssistantScenic.ts")) {
    return [mediaRoot, "news"];
  }

  if (file.endsWith("client/src/pages/About.tsx")) {
    return [mediaRoot, "about", "page"];
  }

  if (file.endsWith("client/src/pages/SyllabusExperiential.tsx")) {
    return [mediaRoot, "syllabus", "experiential"];
  }

  if (file.endsWith("client/src/pages/Resume.tsx")) {
    return [mediaRoot, "downloads", "resume"];
  }

  if (file.endsWith("client/src/pages/DesignHistoryTimeline.tsx")) {
    return [mediaRoot, "studio", "apps", "design-history-timeline"];
  }

  if (file.endsWith("client/src/pages/DimensionReference.tsx")) {
    return [mediaRoot, "studio", "apps", "dimension-reference"];
  }

  return [mediaRoot, "migrated", "supabase", "misc"];
}

function buildTargetPath(file: string, url: string) {
  const kind = inferMediaKind(url);
  const parts = getTargetPrefix(file, kind).map(sanitizeSegment).filter(Boolean);
  return `${parts.join("/")}/${withHashedBasename(url)}`;
}

async function walkFiles(targetPath: string, output: string[]) {
  const abs = path.join(rootDir, targetPath);
  const entries = await readdir(abs, { withFileTypes: true }).catch(() => null);

  if (!entries) {
    if (allowedExtensions.has(path.extname(targetPath))) output.push(targetPath);
    return;
  }

  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === ".next" || entry.name === "node_modules") continue;
    const rel = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(rel, output);
      continue;
    }
    if (allowedExtensions.has(path.extname(entry.name))) output.push(rel);
  }
}

async function collectScans() {
  const files: string[] = [];
  for (const target of scanTargets) {
    await walkFiles(target, files);
  }

  const scans: FileScan[] = [];
  for (const file of files) {
    const text = await readFile(path.join(rootDir, file), "utf8");
    const urls = Array.from(new Set(text.match(supabaseUrlPattern) || []));
    if (urls.length) scans.push({ file, urls });
  }

  return scans;
}

async function fetchAsset(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "*/*",
      Referer: "https://www.brandonptdavis.com/",
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed for ${url}: ${response.status} ${response.statusText}`);
  }

  return {
    body: await response.arrayBuffer(),
    contentType: response.headers.get("content-type") || undefined,
  };
}

async function uploadToBlob(file: string, url: string) {
  const asset = await fetchAsset(url);
  const uploaded = await put(buildTargetPath(file, url), asset.body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: asset.contentType,
  });
  return uploaded.url;
}

async function main() {
  const scans = await collectScans();
  const allUrls = Array.from(new Set(scans.flatMap((scan) => scan.urls)));

  if (!scans.length) {
    console.log("No Supabase asset references found in active scan targets.");
    return;
  }

  console.log(`Found ${allUrls.length} Supabase asset URLs across ${scans.length} files.`);
  scans.forEach((scan) => {
    console.log(`- ${scan.file}: ${scan.urls.length} url(s)`);
  });

  if (!shouldWrite) {
    console.log("\nDry run target paths:");
    for (const scan of scans) {
      for (const url of scan.urls) {
        console.log(`${scan.file}\n  ${url}\n  -> ${buildTargetPath(scan.file, url)}`);
      }
    }
    console.log("\nRun with --write and BLOB_READ_WRITE_TOKEN to fetch and upload Supabase assets to Blob.");
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN.");
  }

  const replacements = new Map<string, string>();
  const failed: Array<{ file: string; url: string; error: string }> = [];

  for (const scan of scans) {
    for (const url of scan.urls) {
      if (replacements.has(url)) continue;
      try {
        const uploadedUrl = await uploadToBlob(scan.file, url);
        replacements.set(url, uploadedUrl);
        console.log(`Uploaded ${url} -> ${uploadedUrl}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failed.push({ file: scan.file, url, error: message });
        console.error(`Failed ${url}: ${message}`);
      }
    }
  }

  for (const scan of scans) {
    const abs = path.join(rootDir, scan.file);
    const original = await readFile(abs, "utf8");
    let next = original;
    for (const url of scan.urls) {
      const replacement = replacements.get(url);
      if (replacement) next = next.split(url).join(replacement);
    }
    if (next !== original) {
      await writeFile(abs, next, "utf8");
      console.log(`Updated ${scan.file}`);
    }
  }

  console.log(`Recovered ${replacements.size} Supabase asset URLs into Blob.`);
  if (failed.length) {
    console.log("Failed assets:");
    console.log(JSON.stringify(failed, null, 2));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
