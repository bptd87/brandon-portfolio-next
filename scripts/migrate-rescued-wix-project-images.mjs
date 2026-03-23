import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

const TARGET_SLUGS = [
  "the-bald-soprano",
  "not-now-darling",
  "bingo-the-winning-musical",
  "the-complete-works-of-william-shakespeare-abridged",
  "the-liar",
  "a-smalltowne-christmas",
  "the-glass-menagerie-2011",
  "urinetown-2021",
];

const PROJECT_FILE = path.resolve("shared/localScenicProjects.ts");
const BUCKET = "project-images";
const PUBLIC_BASE = `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const source = await fs.readFile(PROJECT_FILE, "utf8");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractProjectBlock = (content, slug) => {
  const slugPattern = `slug: "${slug}"`;
  const slugIndex = content.indexOf(slugPattern);
  if (slugIndex === -1) {
    throw new Error(`Could not find slug block for ${slug}`);
  }

  const start = content.lastIndexOf("const ", slugIndex);
  const end = content.indexOf("\n};", slugIndex);
  if (start === -1 || end === -1) {
    throw new Error(`Could not isolate project block for ${slug}`);
  }

  return {
    start,
    end: end + "\n};".length,
    text: content.slice(start, end + "\n};".length),
  };
};

const getUrlExtension = (url, contentType) => {
  const parsed = new URL(url);
  const pathname = parsed.pathname;
  const fromPath = path.extname(pathname).replace(".", "").toLowerCase();
  if (fromPath && fromPath !== "com") return fromPath;

  const normalizedType = (contentType || "").toLowerCase();
  if (normalizedType.includes("jpeg")) return "jpg";
  if (normalizedType.includes("png")) return "png";
  if (normalizedType.includes("webp")) return "webp";
  if (normalizedType.includes("avif")) return "avif";
  return "jpg";
};

const urlsBySlug = new Map();

for (const slug of TARGET_SLUGS) {
  const block = extractProjectBlock(source, slug);
  const urls = Array.from(
    new Set(
      [...block.text.matchAll(/https:\/\/static\.wixstatic\.com\/media\/[^"\s)]+/g)].map(
        (match) => match[0]
      )
    )
  );
  urlsBySlug.set(slug, urls);
}

let nextContent = source;

for (const slug of TARGET_SLUGS) {
  const urls = urlsBySlug.get(slug) || [];
  for (const url of urls) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const hash = createHash("sha1").update(url).digest("hex").slice(0, 10);
    const extension = getUrlExtension(url, response.headers.get("content-type"));
    const fileName = `${slug}-${hash}.${extension}`;
    const objectPath = `rescued/${slug}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(objectPath, buffer, {
      contentType: response.headers.get("content-type") || undefined,
      cacheControl: "31536000",
      upsert: true,
    });

    if (uploadError) {
      throw new Error(`Failed to upload ${objectPath}: ${uploadError.message}`);
    }

    const publicUrl = `${PUBLIC_BASE}/${objectPath}`;
    nextContent = nextContent.replace(new RegExp(escapeRegExp(url), "g"), publicUrl);
    console.log(`${slug}: ${url} -> ${publicUrl}`);
  }
}

await fs.writeFile(PROJECT_FILE, nextContent);
console.log("Updated local scenic project URLs.");
