"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, ExternalLink, FolderOpen, Loader2, Search, Trash2, UploadCloud } from "lucide-react";

const BUCKETS = [
  "portfolio",
  "project-images",
  "article-images",
  "about-images",
  "news-images",
  "article_audio",
  "portfolio-images",
] as const;

type AssetItem = {
  id: string;
  name: string;
  path: string;
  bucket: string;
  publicUrl: string;
  assetRef: string;
  size: number | null;
  mimeType: string | null;
  createdAt?: string | null;
};

type AssetPreset = {
  label: string;
  bucket: (typeof BUCKETS)[number];
  prefix: string;
  uploadPath: string;
};

type AssetManagerMode = "workbench" | "assets" | "uploads" | "snippets";

const ASSET_PRESETS: AssetPreset[] = [
  {
    label: "Shared Portfolio",
    bucket: "portfolio",
    prefix: "portfolio/shared/",
    uploadPath: "portfolio/shared/",
  },
  {
    label: "Project Images",
    bucket: "project-images",
    prefix: "",
    uploadPath: "",
  },
  {
    label: "Article Images",
    bucket: "article-images",
    prefix: "",
    uploadPath: "",
  },
  {
    label: "About Media",
    bucket: "about-images",
    prefix: "",
    uploadPath: "",
  },
  {
    label: "News / Press",
    bucket: "news-images",
    prefix: "",
    uploadPath: "",
  },
  {
    label: "Audio",
    bucket: "article_audio",
    prefix: "",
    uploadPath: "",
  },
];

function getAssetKind(item: AssetItem) {
  const source = `${item.mimeType || ""} ${item.name}`.toLowerCase();
  if (source.includes("image/") || /\.(png|jpe?g|webp|gif|avif|svg)$/.test(source)) return "image";
  if (source.includes("video/") || /\.(mp4|webm|mov|m4v)$/.test(source)) return "video";
  if (source.includes("audio/") || /\.(mp3|wav|m4a|aac|ogg)$/.test(source)) return "audio";
  return "file";
}

function formatBytes(value: number | null) {
  if (!value) return null;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function buildSnippet(item: AssetItem, mode: "yaml" | "mdx" | "object") {
  const alt = item.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");

  if (mode === "object") {
    return `{
  src: "${item.publicUrl}",
  alt: "${alt}",
  caption: "",
}`;
  }

  if (mode === "mdx") {
    return `<Figure\n  asset="${item.assetRef}"\n  alt="${item.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")}"\n  caption=""\n/>`;
  }

  return `- asset: "${item.assetRef}"\n  alt: "${alt}"\n  caption: ""`;
}

export function AssetManager({
  title,
  description,
  standalone = true,
  mode = "assets",
  initialBucket = "portfolio",
  initialPrefix = "",
  initialUploadPath,
}: {
  title: string;
  description: string;
  standalone?: boolean;
  mode?: AssetManagerMode;
  initialBucket?: (typeof BUCKETS)[number];
  initialPrefix?: string;
  initialUploadPath?: string;
}) {
  const [bucket, setBucket] = useState<(typeof BUCKETS)[number]>(initialBucket);
  const [prefix, setPrefix] = useState(initialPrefix);
  const [uploadPath, setUploadPath] = useState(
    initialUploadPath ?? initialPrefix ?? "portfolio/shared/"
  );
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [selected, setSelected] = useState<AssetItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const snippetYaml = useMemo(() => (selected ? buildSnippet(selected, "yaml") : ""), [selected]);
  const snippetMdx = useMemo(() => (selected ? buildSnippet(selected, "mdx") : ""), [selected]);
  const snippetObject = useMemo(() => (selected ? buildSnippet(selected, "object") : ""), [selected]);
  const selectedKind = selected ? getAssetKind(selected) : "file";
  const filteredAssets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return assets;

    return assets.filter((item) => {
      const haystack = `${item.name} ${item.path} ${item.assetRef}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [assets, query]);

  async function loadAssets(overrides?: {
    bucket?: (typeof BUCKETS)[number];
    prefix?: string;
  }) {
    const nextBucket = overrides?.bucket ?? bucket;
    const nextPrefix = overrides?.prefix ?? prefix;
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const params = new URLSearchParams({
        bucket: nextBucket,
        prefix: nextPrefix,
      });
      const response = await fetch(`/api/admin/assets?${params.toString()}`);
      const payload = (await response.json()) as { items?: AssetItem[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load assets.");
      }

      const nextItems = payload.items || [];
      setAssets(nextItems);
      setSelected((current) => {
        if (!nextItems.length) return null;
        if (current) {
          const matching = nextItems.find((item) => item.id === current.id);
          if (matching) return matching;
        }
        return nextItems[0] ?? null;
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load assets.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadAssets({ bucket: initialBucket, prefix: initialPrefix });
  }, [initialBucket, initialPrefix]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    setError("");
    setMessage("");

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.set("bucket", bucket);
        formData.set("path", `${uploadPath.replace(/^\/+/, "")}${file.name}`);
        formData.set("file", file);

        const response = await fetch("/api/admin/assets", {
          method: "POST",
          body: formData,
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(payload.error || `Failed to upload ${file.name}.`);
        }
      }

      setMessage(`Uploaded ${files.length} file${files.length === 1 ? "" : "s"}.`);
      await loadAssets();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Failed to upload.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function handleDelete(item: AssetItem) {
    if (!window.confirm(`Delete ${item.path}?`)) return;

    setError("");
    setMessage("");

    const response = await fetch("/api/admin/assets", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucket: item.bucket,
        path: item.path,
      }),
    });

    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setError(payload?.error || "Failed to delete asset.");
      return;
    }

    setMessage(`Deleted ${item.name}.`);
    setAssets((current) => current.filter((entry) => entry.id !== item.id));
    if (selected?.id === item.id) setSelected(null);
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setMessage("Copied to clipboard.");
  }

  async function applyPreset(preset: AssetPreset) {
    setBucket(preset.bucket);
    setPrefix(preset.prefix);
    setUploadPath(preset.uploadPath);
    setQuery("");
    await loadAssets({ bucket: preset.bucket, prefix: preset.prefix });
  }

  const modeLabel =
    mode === "workbench"
      ? "Build from media"
      : mode === "uploads"
        ? "Upload and place"
        : mode === "snippets"
          ? "Copy page-ready snippets"
          : "Browse and place media";

  const content = (
      <main className={standalone ? "container max-w-[88rem] py-12" : ""}>
        <section className="border-b border-border/20 pb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
            {modeLabel}
          </p>
          <h1 className="mt-4 font-sans text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.06em] text-foreground">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-[1rem] leading-7 text-foreground/62">{description}</p>
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-border/25 bg-card/20 p-6">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                  Quick Focus
                </span>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ASSET_PRESETS.map((preset) => {
                    const active = preset.bucket === bucket && preset.prefix === prefix;
                    return (
                      <button
                        key={`${preset.bucket}-${preset.prefix}-${preset.label}`}
                        type="button"
                        onClick={() => {
                          void applyPreset(preset);
                        }}
                        className={`inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors ${
                          active
                            ? "border-foreground/25 bg-foreground text-background"
                            : "border-border/35 text-foreground/72 hover:bg-foreground/[0.04] hover:text-foreground"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1fr)]">
                <label className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                    Bucket
                  </span>
                  <select
                    value={bucket}
                    onChange={(event) => setBucket(event.target.value as (typeof BUCKETS)[number])}
                    className="h-11 w-full rounded-2xl border border-border/40 bg-background px-4 text-sm"
                  >
                    {BUCKETS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                    List Prefix
                  </span>
                  <input
                    value={prefix}
                    onChange={(event) => setPrefix(event.target.value)}
                    placeholder="portfolio/shared/"
                    className="h-11 w-full rounded-2xl border border-border/40 bg-background px-4 text-sm"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                    Upload Prefix
                  </span>
                  <input
                    value={uploadPath}
                    onChange={(event) => setUploadPath(event.target.value)}
                    placeholder="portfolio/shared/"
                    className="h-11 w-full rounded-2xl border border-border/40 bg-background px-4 text-sm"
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    void loadAssets();
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border/40 px-5 text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Browse Assets
                </button>
                <label className="inline-flex cursor-pointer h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload
                  <input type="file" multiple className="hidden" onChange={handleUpload} />
                </label>
              </div>

              {message ? <p className="mt-4 text-sm text-emerald-400">{message}</p> : null}
              {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
            </div>

            <div className="rounded-[1.5rem] border border-border/25 bg-card/20 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                    Assets
                  </p>
                  <p className="mt-2 text-sm text-foreground/58">
                    Browse current assets and select one for a snippet.
                  </p>
                </div>
                {isLoading || isUploading ? <Loader2 className="h-5 w-5 animate-spin text-foreground/48" /> : null}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <label className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                    Filter Loaded Assets
                  </span>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/34" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search name, path, or asset ref"
                      className="h-11 w-full rounded-2xl border border-border/40 bg-background pl-11 pr-4 text-sm"
                    />
                  </div>
                </label>
                <div className="text-sm text-foreground/52">
                  {filteredAssets.length} of {assets.length} visible
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {assets.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/35 px-4 py-10 text-center text-sm text-foreground/48">
                    Load a bucket/prefix to see assets here.
                  </div>
                ) : null}
                {assets.length > 0 && filteredAssets.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/35 px-4 py-10 text-center text-sm text-foreground/48">
                    No loaded assets match that search.
                  </div>
                ) : null}
                {filteredAssets.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 transition-colors ${
                      selected?.id === item.id ? "border-foreground/30 bg-foreground/[0.04]" : "border-border/25 bg-background/40"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <button type="button" onClick={() => setSelected(item)} className="flex min-w-0 flex-1 gap-4 text-left">
                        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/25 bg-background/70">
                          {getAssetKind(item) === "image" ? (
                            <img
                              src={item.publicUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : getAssetKind(item) === "video" ? (
                            <video
                              src={item.publicUrl}
                              className="h-full w-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                            />
                          ) : (
                            <span className="px-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/36">
                              {getAssetKind(item)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                          <p className="mt-1 truncate text-xs text-foreground/46">{item.assetRef}</p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-foreground/42">
                            {item.mimeType ? <span>{item.mimeType}</span> : null}
                            {formatBytes(item.size) ? <span>{formatBytes(item.size)}</span> : null}
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copy(item.publicUrl)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/35 transition-colors hover:bg-foreground/[0.04]"
                          title="Copy public URL"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/35 text-rose-400 transition-colors hover:bg-rose-500/10"
                          title="Delete asset"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-border/25 bg-card/20 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                Selected Asset
              </p>
              {selected ? (
                <div className="mt-4 space-y-4 text-sm">
                    <div className="overflow-hidden rounded-[1.5rem] border border-border/25 bg-background/60">
                    {selectedKind === "image" ? (
                      <img
                        src={selected.publicUrl}
                        alt={selected.name}
                        className="max-h-[26rem] w-full object-contain"
                      />
                    ) : selectedKind === "video" ? (
                      <video
                        src={selected.publicUrl}
                        controls
                        playsInline
                        className="max-h-[26rem] w-full bg-black object-contain"
                      />
                    ) : selectedKind === "audio" ? (
                      <div className="p-6">
                        <audio src={selected.publicUrl} controls className="w-full" />
                      </div>
                    ) : (
                      <div className="flex min-h-[12rem] items-center justify-center px-6 text-center text-sm text-foreground/48">
                        Preview unavailable for this file type. Copy the URL or open the asset in a new tab.
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-foreground">{selected.name}</p>
                  <p className="break-all text-foreground/58">{selected.assetRef}</p>
                  <p className="break-all text-xs text-foreground/42">{selected.bucket}/{selected.path}</p>
                  <a href={selected.publicUrl} target="_blank" rel="noreferrer" className="break-all text-sky-400 hover:underline">
                    {selected.publicUrl}
                  </a>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => copy(selected.publicUrl)}
                      className="inline-flex h-10 items-center justify-center rounded-full border border-border/35 px-4 text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
                    >
                      Copy Public URL
                    </button>
                    <button
                      type="button"
                      onClick={() => copy(selected.assetRef)}
                      className="inline-flex h-10 items-center justify-center rounded-full border border-border/35 px-4 text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
                    >
                      Copy Asset Ref
                    </button>
                    <a
                      href={selected.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-border/35 px-4 text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
                    >
                      Open Asset
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-foreground/48">Pick an asset to generate snippets.</p>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-border/25 bg-card/20 p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                  YAML Snippet
                </p>
                {selected ? (
                  <button type="button" onClick={() => copy(snippetYaml)} className="text-xs font-medium text-foreground/62 hover:text-foreground">
                    Copy
                  </button>
                ) : null}
              </div>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-background/70 p-4 text-xs leading-6 text-foreground/72">
                <code>{snippetYaml || "# Select an asset to generate YAML."}</code>
              </pre>
            </div>

            <div className="rounded-[1.5rem] border border-border/25 bg-card/20 p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                  MDX Snippet
                </p>
                {selected ? (
                  <button type="button" onClick={() => copy(snippetMdx)} className="text-xs font-medium text-foreground/62 hover:text-foreground">
                    Copy
                  </button>
                ) : null}
              </div>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-background/70 p-4 text-xs leading-6 text-foreground/72">
                <code>{snippetMdx || "{/* Select an asset to generate MDX. */}"}</code>
              </pre>
            </div>

            <div className="rounded-[1.5rem] border border-border/25 bg-card/20 p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                  Object Snippet
                </p>
                {selected ? (
                  <button type="button" onClick={() => copy(snippetObject)} className="text-xs font-medium text-foreground/62 hover:text-foreground">
                    Copy
                  </button>
                ) : null}
              </div>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-background/70 p-4 text-xs leading-6 text-foreground/72">
                <code>{snippetObject || "{ src: \"\", alt: \"\", caption: \"\" }"}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>
  );

  if (!standalone) {
    return content;
  }

  return <div className="min-h-screen bg-background text-foreground">{content}</div>;
}
