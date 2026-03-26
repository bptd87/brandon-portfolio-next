import type { LocalArticle, LocalArticleBlock } from "../../../shared/localArticles";

const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
  hellip: "...",
  ndash: "-",
  mdash: "-",
  lsquo: "'",
  rsquo: "'",
  ldquo: '"',
  rdquo: '"',
};

export function decodeHtmlEntities(value: string) {
  if (!value) return "";

  return String(value)
    .replace(/&#(\d+);/g, (match, rawValue) => {
      const code = Number.parseInt(rawValue, 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    })
    .replace(/&#x([0-9a-f]+);/gi, (match, rawValue) => {
      const code = Number.parseInt(rawValue, 16);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    })
    .replace(/&([a-z]+);/gi, (entity, name) => NAMED_HTML_ENTITIES[name.toLowerCase()] ?? entity);
}

export function formatArticleDate(value?: string | null) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getArticlePath(slug: string) {
  return `/articles/${slug}`;
}

export function getArticleHeadingId(text: string, index: number) {
  const base = decodeHtmlEntities(text || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base ? `${base}-${index}` : `heading-${index}`;
}

export function getArticleWordCount(blocks: LocalArticleBlock[]) {
  const text = blocks
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      if (typeof block.text === "string") return block.text;
      if (typeof block.content === "string") return block.content;
      if (Array.isArray(block.items)) return block.items.join(" ");
      return "";
    })
    .join(" ");

  return text.split(/\s+/).filter(Boolean).length;
}

export function resolveArticleBlocks(article: LocalArticle) {
  if (Array.isArray(article.content)) return article.content;

  if (typeof article.content === "string") {
    try {
      const parsed = JSON.parse(article.content);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [{ type: "html", content: article.content }];
    }
  }

  return [];
}

export function getYouTubeId(url: string) {
  const match = url.match(
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  );
  return match && match[2].length === 11 ? match[2] : null;
}
