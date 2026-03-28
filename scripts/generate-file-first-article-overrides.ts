import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content", "articles");
const OUTPUT_PATH = path.join(ROOT, "shared", "fileFirstArticles.generated.ts");

type ArticleMeta = {
  slug: string;
  title: string;
  featured?: boolean;
  excerpt?: string;
  category?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  cover?: {
    asset?: string;
    alt?: string;
  };
  readTime?: number;
  publishedAt?: string;
  updatedAt?: string;
  sourcePublication?: string;
  sourceUrl?: string;
  linkedScenicProjectSlugs?: string[];
  series?: {
    name: string;
    slug: string;
    order: number;
  };
};

function toIdentifier(slug: string) {
  const cleaned = slug.replace(/[^a-zA-Z0-9]+/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const camel = parts
    .map((part, index) =>
      index === 0
        ? part.toLowerCase()
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join("");
  return `${camel || "article"}Blocks`;
}

function resolveCoverImageUrl(asset?: string) {
  if (!asset) return undefined;
  if (asset.startsWith("http://") || asset.startsWith("https://")) return asset;
  if (asset.startsWith("/")) return asset;
  if (asset.startsWith("assets/")) return `/${asset}`;
  return undefined;
}

function serialize(value: unknown) {
  return JSON.stringify(value, null, 2);
}

async function main() {
  const entries = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  const articleDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const imports: string[] = [];
  const fieldEntries: string[] = [];
  const contentEntries: string[] = [];

  for (const slug of articleDirs) {
    const articleDir = path.join(CONTENT_ROOT, slug);
    const metaPath = path.join(articleDir, "meta.yaml");
    const blocksImportPath = `../content/articles/${slug}/blocks.json`;
    const rawMeta = await fs.readFile(metaPath, "utf8");
    const meta = (yaml.load(rawMeta) ?? {}) as ArticleMeta;

    const importName = toIdentifier(slug);
    imports.push(`import ${importName} from "${blocksImportPath}";`);

    const fieldValue: Record<string, unknown> = {
      title: meta.title,
      featured: Boolean(meta.featured),
      excerpt: meta.excerpt || "",
      categoryName: meta.category || "Article",
      coverImageAlt: meta.cover?.alt || meta.title,
      seoTitle: meta.seoTitle || undefined,
      seoDescription: meta.seoDescription || undefined,
      seoKeywords: Array.isArray(meta.seoKeywords) ? meta.seoKeywords.join(", ") : undefined,
      readTime: meta.readTime,
      publishedAt: meta.publishedAt,
      updatedAt: meta.updatedAt,
      sourcePublication: meta.sourcePublication,
      sourceUrl: meta.sourceUrl,
      linkedScenicProjectSlugs: meta.linkedScenicProjectSlugs,
      series: meta.series,
    };

    const resolvedCoverImageUrl = resolveCoverImageUrl(meta.cover?.asset);
    if (resolvedCoverImageUrl) {
      fieldValue.coverImageUrl = resolvedCoverImageUrl;
    }

    Object.keys(fieldValue).forEach((key) => {
      if (fieldValue[key] === undefined) {
        delete fieldValue[key];
      }
    });

    fieldEntries.push(`  ${JSON.stringify(slug)}: ${serialize(fieldValue)},`);
    contentEntries.push(`  ${JSON.stringify(slug)}: ${importName},`);
  }

  const output = `${imports.join("\n")}

export const fileFirstArticleFieldsBySlug = {
${fieldEntries.join("\n")}
} as const;

export const fileFirstArticleContentBySlug = {
${contentEntries.join("\n")}
} as const;
`;

  await fs.writeFile(OUTPUT_PATH, output, "utf8");
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
