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
const supabaseUrls = Array.from(
  new Set(
    [...articleBlock.matchAll(/https:\/\/xibkuwouvisabnfowthn\.supabase\.co\/storage\/v1\/object\/public\/article-images\/ghibli\/([^\s"'`]+)/g)].map(
      (match) => match[0]
    )
  )
);

if (!supabaseUrls.length) {
  throw new Error("No Supabase Ghibli image URLs found in article block.");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const toRawWixUrl = (supabaseUrl) => {
  const filename = decodeURIComponent(supabaseUrl.split("/ghibli/")[1] ?? "");
  if (!filename) {
    throw new Error(`Could not derive filename from ${supabaseUrl}`);
  }
  const dotIndex = filename.lastIndexOf(".");
  const wixFilename =
    dotIndex === -1
      ? `${filename}~mv2`
      : `${filename.slice(0, dotIndex)}~mv2${filename.slice(dotIndex)}`;
  return {
    filename,
    wixUrl: `https://static.wixstatic.com/media/${wixFilename}`,
  };
};

let updated = 0;
const failures = [];

for (const supabaseUrl of supabaseUrls) {
  const { filename, wixUrl } = toRawWixUrl(supabaseUrl);
  process.stdout.write(`Refreshing ${filename} from ${wixUrl}\n`);

  const response = await fetch(wixUrl);
  if (!response.ok) {
    failures.push(`${filename}: ${response.status} ${response.statusText}`);
    continue;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    failures.push(`${filename}: non-image response (${contentType || "unknown"})`);
    continue;
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!bytes.length) {
    failures.push(`${filename}: empty response`);
    continue;
  }

  const storagePath = `ghibli/${filename}`;
  const { error } = await supabase.storage.from("article-images").upload(storagePath, bytes, {
    contentType,
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    failures.push(`${filename}: upload failed (${error.message})`);
    continue;
  }

  updated += 1;
}

console.log(`Refreshed ${updated} Ghibli images from raw Wix originals.`);
if (failures.length) {
  console.log("Failures:");
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
}
