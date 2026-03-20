import fs from "node:fs/promises";
import path from "node:path";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const filePath = path.resolve("shared/localArticles.ts");
const source = await fs.readFile(filePath, "utf8");

const startMarker = "const ghibliImmersiveDiningArticle: LocalArticle = {";
const endMarker = "\n};\n\nconst dbBackedArticles";
const startIndex = source.indexOf(startMarker);
const endIndex = source.indexOf(endMarker, startIndex);

if (startIndex === -1 || endIndex === -1) {
  throw new Error("Could not locate Ghibli article block.");
}

const articleBlock = source.slice(startIndex, endIndex);
const wixUrls = Array.from(
  new Set(
    [...articleBlock.matchAll(/https:\/\/(?:static|video)\.wixstatic\.com\/[^\s"'`]+/g)].map((match) =>
      match[0]
    )
  )
);

if (!wixUrls.length) {
  throw new Error("No Wix media URLs found in article block.");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const imageBucket = "article-images";
const videoBucket = "article-videos";

const makeFilename = (url) => {
  if (url.includes("video.wixstatic.com/video/")) {
    const match = url.match(/video\/([^/]+)\/[^/]+\/mp4\/file\.mp4$/);
    const id = match?.[1] ?? `video-${Date.now()}`;
    return `${id}.mp4`;
  }

  const match = url.match(/media\/([^~\/?]+)~mv2\.(jpe?g|jpg|png|webp)/i);
  if (match) {
    return `${match[1]}.${match[2].toLowerCase()}`;
  }

  const fallback = url.split("/").pop()?.split("?")[0] ?? `asset-${Date.now()}`;
  return fallback.replace(/[^a-zA-Z0-9._-]+/g, "-");
};

const replacements = new Map();

const ensureVideoBucket = async () => {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(`Failed to list storage buckets: ${listError.message}`);
  }

  const hasVideoBucket = buckets.some((bucket) => bucket.name === videoBucket);
  if (hasVideoBucket) return;

  const { error: createError } = await supabase.storage.createBucket(videoBucket, {
    public: true,
  });

  if (createError) {
    throw new Error(`Failed to create ${videoBucket} bucket: ${createError.message}`);
  }
};

await ensureVideoBucket();

for (const url of wixUrls) {
  const filename = makeFilename(url);
  const isVideo = filename.endsWith(".mp4");
  const bucket = isVideo ? videoBucket : imageBucket;
  const storagePath = `ghibli/${filename}`;
  process.stdout.write(`Uploading ${bucket}/${storagePath}\n`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const contentType =
    response.headers.get("content-type") ??
    (filename.endsWith(".mp4")
      ? "video/mp4"
      : filename.endsWith(".png")
        ? "image/png"
        : filename.endsWith(".webp")
          ? "image/webp"
          : "image/jpeg");

  const { error } = await supabase.storage.from(bucket).upload(storagePath, bytes, {
    contentType,
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw new Error(`Failed to upload ${storagePath}: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  replacements.set(url, data.publicUrl);
}

let updatedSource = source;
for (const [from, to] of replacements.entries()) {
  updatedSource = updatedSource.split(from).join(to);
}

await fs.writeFile(filePath, updatedSource);

console.log(`Uploaded ${replacements.size} media files and rewrote article URLs.`);
