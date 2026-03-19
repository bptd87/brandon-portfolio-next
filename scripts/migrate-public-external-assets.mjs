import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const rootDir = process.cwd();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const targets = [
  {
    file: "shared/localArticles.generated.ts",
    bucket: "article-images",
    pathPrefix: "migrated/external",
  },
  {
    file: "shared/localPortfolios.generated.ts",
    bucket: "project-images",
    pathPrefix: "migrated/external",
  },
  {
    file: "client/src/pages/DimensionReference.tsx",
    bucket: "portfolio",
    pathPrefix: "dimension-reference",
  },
  {
    file: "client/src/pages/Resume.tsx",
    bucket: "Downloads",
    pathPrefix: "resume",
  },
];

const tutorialLogoTarget = {
  file: "client/src/pages/TutorialDetail.tsx",
  bucket: "about-images",
  path: "site-assets/publisher-logo-favicon-32.png",
  localSource: "client/public/favicon-32x32.png",
  replacePattern:
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/YiqCsZPgtoSSsQyE.png",
};

const externalUrlPattern = /https?:\/\/[^\s"'`)]*/g;

function isExternalAsset(url) {
  return (
    url.includes("cloudinary.com") ||
    url.includes("manuscdn.com") ||
    url.includes("manus-user-assets") ||
    url.includes("manus.im")
  );
}

function getExtFromContentType(contentType) {
  if (!contentType) return ".bin";
  const clean = contentType.split(";")[0].trim().toLowerCase();
  const map = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "application/pdf": ".pdf",
  };
  return map[clean] || ".bin";
}

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function uploadExternalUrl(url, bucket, pathPrefix) {
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

  const body = Buffer.from(await response.arrayBuffer());
  const urlObj = new URL(url);
  const pathname = decodeURIComponent(urlObj.pathname);
  const rawBase = path.basename(pathname) || "asset";
  const extFromPath = path.extname(rawBase);
  const ext = extFromPath || getExtFromContentType(response.headers.get("content-type"));
  const base = sanitizeName(path.basename(rawBase, extFromPath || ext)) || "asset";
  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 10);
  const uploadPath = `${pathPrefix}/${base}-${hash}${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(uploadPath, body, {
    contentType: response.headers.get("content-type") || undefined,
    upsert: true,
  });

  if (error) {
    throw new Error(`Upload failed for ${url} -> ${bucket}/${uploadPath}: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(uploadPath);
  return data.publicUrl;
}

async function uploadLocalFile(localPath, bucket, uploadPath) {
  const body = await fs.readFile(path.join(rootDir, localPath));
  const { error } = await supabase.storage.from(bucket).upload(uploadPath, body, {
    contentType: "image/png",
    upsert: true,
  });
  if (error) {
    throw new Error(`Upload failed for ${localPath} -> ${bucket}/${uploadPath}: ${error.message}`);
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(uploadPath);
  return data.publicUrl;
}

const replacements = new Map();
const failed = [];

for (const target of targets) {
  const abs = path.join(rootDir, target.file);
  const original = await fs.readFile(abs, "utf8");
  const matches = Array.from(new Set((original.match(externalUrlPattern) || []).filter(isExternalAsset)));
  let next = original;

  for (const url of matches) {
    if (!replacements.has(url) && !failed.find((item) => item.url === url)) {
      try {
        const publicUrl = await uploadExternalUrl(url, target.bucket, target.pathPrefix);
        replacements.set(url, publicUrl);
        console.log(`Uploaded ${url} -> ${publicUrl}`);
      } catch (error) {
        failed.push({ file: target.file, url, error: error.message });
        console.error(`Skipped ${url}: ${error.message}`);
      }
    }
    if (replacements.has(url)) {
      next = next.split(url).join(replacements.get(url));
    }
  }

  if (next !== original) {
    await fs.writeFile(abs, next, "utf8");
    console.log(`Updated ${target.file}`);
  }
}

{
  const abs = path.join(rootDir, tutorialLogoTarget.file);
  const original = await fs.readFile(abs, "utf8");
  const publicUrl = await uploadLocalFile(
    tutorialLogoTarget.localSource,
    tutorialLogoTarget.bucket,
    tutorialLogoTarget.path
  );
  const next = original.split(tutorialLogoTarget.replacePattern).join(publicUrl);
  if (next !== original) {
    await fs.writeFile(abs, next, "utf8");
    console.log(`Updated ${tutorialLogoTarget.file}`);
  }
}

console.log(`Migrated ${replacements.size + 1} public asset references to Supabase.`);
if (failed.length) {
  console.log("Failed assets:");
  console.log(JSON.stringify(failed, null, 2));
}
