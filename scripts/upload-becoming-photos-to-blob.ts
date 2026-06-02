import { put } from "@vercel/blob";
import { config as loadEnv } from "dotenv";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { becomingPhotos } from "../shared/becomingPhotos.generated";

loadEnv({ path: ".env", override: false });
loadEnv({ path: ".env.local", override: false });

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has("--write");
const rootDir = process.cwd();
const publicDir = path.join(rootDir, "client/public");
const outputFile = path.join(rootDir, "shared/becomingPhotos.generated.ts");

function extToContentType(filePath: string) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".avif":
      return "image/avif";
    default:
      return undefined;
  }
}

function localImagePath(src: string) {
  if (!src.startsWith("/")) {
    throw new Error(`Expected a local public image path, received ${src}`);
  }

  return path.join(publicDir, src);
}

function blobPathFor(src: string, body: Buffer) {
  const parsed = path.parse(src);
  const hash = createHash("sha1").update(body).digest("hex").slice(0, 10);
  return `images/about/becoming/${parsed.name}-${hash}${parsed.ext}`;
}

function serializeValue(value: unknown) {
  return JSON.stringify(value);
}

function serializePhoto(photo: (typeof becomingPhotos)[number]) {
  return `  { id: ${serializeValue(photo.id)}, title: ${serializeValue(photo.title)}, location: ${serializeValue(photo.location)}, caption: ${serializeValue(photo.caption)}, alt: ${serializeValue(photo.alt)}, src: ${serializeValue(photo.src)}, width: ${photo.width}, height: ${photo.height}, takenAt: ${serializeValue(photo.takenAt)} },`;
}

async function main() {
  if (shouldWrite && !process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN. Add it to .env.local or run `vercel env pull .env.local --yes` after the Blob store is connected.");
  }

  const nextPhotos = [];

  for (const photo of becomingPhotos) {
    if (!photo.src.startsWith("/images/about/becoming/")) {
      console.log(`Skipping ${photo.id}; already remote or outside the becoming image folder.`);
      nextPhotos.push(photo);
      continue;
    }

    const absolutePath = localImagePath(photo.src);
    const body = await readFile(absolutePath);
    const targetPath = blobPathFor(photo.src, body);

    if (!shouldWrite) {
      console.log(`${photo.src} -> ${targetPath}`);
      nextPhotos.push(photo);
      continue;
    }

    const uploaded = await put(targetPath, body, {
      access: "public",
      addRandomSuffix: false,
      contentType: extToContentType(absolutePath),
    });

    console.log(`Uploaded ${photo.id} -> ${uploaded.url}`);
    nextPhotos.push({ ...photo, src: uploaded.url });
  }

  if (!shouldWrite) {
    console.log("\nDry run only. Run with --write after BLOB_READ_WRITE_TOKEN is available.");
    return;
  }

  const generated = `export type BecomingPhoto = {
  id: string;
  title: string;
  location: string;
  caption: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  takenAt: string;
};

export const becomingPhotos = [
${nextPhotos.map(serializePhoto).join("\n")}
] satisfies BecomingPhoto[];
`;

  await writeFile(outputFile, generated, "utf8");
  console.log(`Wrote ${path.relative(rootDir, outputFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
