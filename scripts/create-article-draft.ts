import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

type ArticleStatus = "draft" | "scheduled" | "published";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content", "articles");

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readArgs() {
  const args = process.argv.slice(2);
  const options = new Map<string, string>();
  const titleParts: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[index + 1];
      options.set(key, next && !next.startsWith("--") ? next : "true");

      if (next && !next.startsWith("--")) {
        index += 1;
      }

      continue;
    }

    titleParts.push(arg);
  }

  return {
    title: titleParts.join(" ").trim(),
    slug: options.get("slug"),
    category: options.get("category") || "Scenic Design",
    date: options.get("date"),
    status: options.get("status") as ArticleStatus | undefined,
  };
}

function normalizeStatus(status: ArticleStatus | undefined, date?: string): ArticleStatus {
  if (status === "draft" || status === "scheduled" || status === "published") {
    return status;
  }

  return date ? "scheduled" : "draft";
}

function normalizePublishedAt(date?: string) {
  if (!date) {
    return new Date().toISOString();
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return `${date}T09:00:00-07:00`;
  }

  return date;
}

async function pathExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const { title, slug: providedSlug, category, date, status: providedStatus } = readArgs();

  if (!title) {
    throw new Error(
      'Missing title. Example: pnpm article:new "Designing Small Rooms for Big Stories" --date 2026-07-15'
    );
  }

  const slug = slugify(providedSlug || title);
  const articleDir = path.join(CONTENT_ROOT, slug);

  if (await pathExists(articleDir)) {
    throw new Error(`Article already exists at ${path.relative(ROOT, articleDir)}`);
  }

  const status = normalizeStatus(providedStatus, date);
  const publishedAt = normalizePublishedAt(date);
  const meta = {
    type: "article",
    slug,
    title,
    status,
    featured: false,
    excerpt: "TODO: Add a one- or two-sentence summary for cards and search results.",
    category,
    seoTitle: title,
    seoDescription: "TODO: Add a search-friendly description of the article.",
    seoKeywords: [],
    cover: {
      asset: "",
      alt: `Cover image for ${title}.`,
    },
    tags: [],
    readTime: 1,
    publishedAt,
    updatedAt: publishedAt,
  };
  const blocks = [
    {
      type: "paragraph",
      text: "TODO: Start the article here.",
    },
  ];

  await fs.mkdir(articleDir, { recursive: true });
  await fs.writeFile(path.join(articleDir, "meta.yaml"), yaml.dump(meta, { lineWidth: 88 }), "utf8");
  await fs.writeFile(path.join(articleDir, "blocks.json"), `${JSON.stringify(blocks, null, 2)}\n`, "utf8");

  console.log(`Created ${path.relative(ROOT, articleDir)}`);
  console.log(`Status: ${status}`);
  console.log(`Published at: ${publishedAt}`);
  console.log("Edit meta.yaml and blocks.json, then run pnpm generate:file-first-article-overrides.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
