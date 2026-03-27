function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

export function resolveBlobMediaUrl(url?: string | null) {
  if (!url) return url ?? null;
  return url;
}

export function applyBlobMediaManifest<T>(value: T): T {
  if (typeof value === "string") {
    return resolveBlobMediaUrl(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => applyBlobMediaManifest(item)) as T;
  }

  if (isPlainObject(value)) {
    const nextEntries = Object.entries(value).map(([key, entryValue]) => [
      key,
      applyBlobMediaManifest(entryValue),
    ]);
    return Object.fromEntries(nextEntries) as T;
  }

  return value;
}
