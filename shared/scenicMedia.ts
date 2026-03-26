import { scenicBlobManifest } from "./scenicBlobManifest";

export const SCENIC_BLOB_ROOT = "images/projects/scenic-design";

function stripQueryAndHash(input: string) {
  return input.split("#")[0]?.split("?")[0] ?? input;
}

function getFilenameFromUrl(sourceUrl: string) {
  const cleanUrl = stripQueryAndHash(sourceUrl);
  const lastSegment = cleanUrl.split("/").pop() || "asset";
  return lastSegment || "asset";
}

function sanitizePathSegment(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "asset";
}

export function getScenicBlobFolder(projectSlug: string) {
  return `${SCENIC_BLOB_ROOT}/${sanitizePathSegment(projectSlug)}`;
}

export function getScenicBlobPath(projectSlug: string, mediaId: string, sourceUrl: string) {
  const sourceFilename = getFilenameFromUrl(sourceUrl);
  const extension = sourceFilename.includes(".")
    ? sourceFilename.split(".").pop()
    : "webp";
  const basename = sanitizePathSegment(mediaId || sourceFilename.replace(/\.[^.]+$/, ""));
  return `${getScenicBlobFolder(projectSlug)}/${basename}.${extension}`;
}

export function resolveScenicMediaUrl(url?: string | null) {
  if (!url) return url ?? null;
  return scenicBlobManifest[url] || url;
}

export function applyScenicMediaManifest<T extends { coverImageUrl?: string | null; media?: Array<any> }>(
  project: T
): T {
  return {
    ...project,
    coverImageUrl: resolveScenicMediaUrl(project.coverImageUrl),
    media: Array.isArray(project.media)
      ? project.media.map((item) =>
          item?.type === "image" && item?.imageUrl
            ? { ...item, imageUrl: resolveScenicMediaUrl(item.imageUrl) }
            : item
        )
      : project.media,
  };
}

