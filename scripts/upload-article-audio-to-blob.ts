import { put } from "@vercel/blob";
import { config as loadEnv } from "dotenv";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

loadEnv({ path: ".env", override: false });
loadEnv({ path: ".env.local", override: false });

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has("--write");
const rootDir = process.cwd();
const publicDir = path.join(rootDir, "client/public");
const articlesFile = path.join(rootDir, "shared/localArticles.ts");
const localAudioPattern = /url:\s*"(?<url>\/audio\/articles\/[^"]+\.(?:mp3|wav|m4a|aac|ogg|flac))"/g;

function contentTypeFor(filePath: string) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".mp3":
      return "audio/mpeg";
    case ".wav":
      return "audio/wav";
    case ".m4a":
      return "audio/mp4";
    case ".aac":
      return "audio/aac";
    case ".ogg":
      return "audio/ogg";
    case ".flac":
      return "audio/flac";
    default:
      return undefined;
  }
}

function blobPathFor(localUrl: string, body: Buffer) {
  const parsed = path.parse(localUrl);
  const hash = createHash("sha1").update(body).digest("hex").slice(0, 10);
  const folder = path.dirname(localUrl).replace(/^\/audio\//, "audio/");

  return `${folder}/${parsed.name}-${hash}${parsed.ext}`;
}

async function main() {
  const source = await readFile(articlesFile, "utf8");
  const localAudioUrls = Array.from(source.matchAll(localAudioPattern), (match) => match.groups?.url).filter(
    (url): url is string => Boolean(url)
  );
  const uniqueLocalAudioUrls = Array.from(new Set(localAudioUrls));

  if (!uniqueLocalAudioUrls.length) {
    console.log("No local article audio URLs found in shared/localArticles.ts.");
    return;
  }

  if (shouldWrite && !process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN. Run `vercel env pull .env.local --yes` after the Blob store is connected.");
  }

  const replacements = new Map<string, string>();

  for (const localUrl of uniqueLocalAudioUrls) {
    const localPath = path.join(publicDir, localUrl);
    const body = await readFile(localPath);
    const targetPath = blobPathFor(localUrl, body);

    if (!shouldWrite) {
      console.log(`${localUrl} -> ${targetPath}`);
      continue;
    }

    const uploaded = await put(targetPath, body, {
      access: "public",
      addRandomSuffix: false,
      contentType: contentTypeFor(localPath),
    });

    console.log(`Uploaded ${localUrl} -> ${uploaded.url}`);
    replacements.set(localUrl, uploaded.url);
  }

  if (!shouldWrite) {
    console.log("\nDry run only. Run with --write after BLOB_READ_WRITE_TOKEN is available.");
    return;
  }

  let nextSource = source;

  for (const [localUrl, blobUrl] of replacements) {
    nextSource = nextSource.split(localUrl).join(blobUrl);
  }

  if (nextSource !== source) {
    await writeFile(articlesFile, nextSource, "utf8");
    console.log(`Updated ${path.relative(rootDir, articlesFile)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
