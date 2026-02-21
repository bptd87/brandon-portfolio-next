import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as db from "../db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import viteConfig from "../../vite.config";

type SeoMeta = {
  title: string;
  description: string;
  image: string;
  canonical: string;
  type: "website" | "article";
};

const DEFAULT_SITE_URL = "https://www.brandonptdavis.com";
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/android-chrome-512x512.png`;
const DEFAULT_META: Omit<SeoMeta, "canonical"> = {
  title: "Brandon PT Davis | Scenic Designer",
  description:
    "Professional scenic designer creating story-driven theatrical environments. Portfolio of productions, process, and design writing.",
  image: DEFAULT_OG_IMAGE,
  type: "website",
};

const escapeHtml = (value: string): string =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function replaceOrAppendMeta(html: string, attr: "name" | "property", key: string, content: string): string {
  const safeContent = escapeHtml(content);
  const metaTag = `<meta ${attr}="${key}" content="${safeContent}" />`;
  const regex = new RegExp(`<meta\\s+[^>]*${attr}=["']${escapeRegExp(key)}["'][^>]*>`, "i");
  if (regex.test(html)) return html.replace(regex, metaTag);
  return html.replace("</head>", `  ${metaTag}\n</head>`);
}

function replaceOrAppendCanonical(html: string, canonical: string): string {
  const safeCanonical = escapeHtml(canonical);
  const linkTag = `<link rel="canonical" href="${safeCanonical}" />`;
  const regex = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;
  if (regex.test(html)) return html.replace(regex, linkTag);
  return html.replace("</head>", `  ${linkTag}\n</head>`);
}

function injectSeoMeta(html: string, meta: SeoMeta): string {
  let next = html;
  next = next.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);
  next = replaceOrAppendMeta(next, "name", "description", meta.description);

  next = replaceOrAppendMeta(next, "property", "og:type", meta.type);
  next = replaceOrAppendMeta(next, "property", "og:url", meta.canonical);
  next = replaceOrAppendMeta(next, "property", "og:title", meta.title);
  next = replaceOrAppendMeta(next, "property", "og:description", meta.description);
  next = replaceOrAppendMeta(next, "property", "og:image", meta.image);
  next = replaceOrAppendMeta(next, "property", "og:site_name", "Brandon PT Davis");
  next = replaceOrAppendMeta(next, "property", "og:locale", "en_US");

  next = replaceOrAppendMeta(next, "name", "twitter:card", "summary_large_image");
  next = replaceOrAppendMeta(next, "name", "twitter:url", meta.canonical);
  next = replaceOrAppendMeta(next, "name", "twitter:title", meta.title);
  next = replaceOrAppendMeta(next, "name", "twitter:description", meta.description);
  next = replaceOrAppendMeta(next, "name", "twitter:image", meta.image);
  next = replaceOrAppendMeta(next, "name", "twitter:creator", "@brandonptdavis");
  next = replaceOrAppendMeta(next, "name", "twitter:site", "@brandonptdavis");

  return replaceOrAppendCanonical(next, meta.canonical);
}

function getRequestSiteUrl(req: express.Request): string {
  const proto = String(req.get("x-forwarded-proto") || req.protocol || "https").split(",")[0].trim();
  const host = String(req.get("x-forwarded-host") || req.get("host") || "www.brandonptdavis.com").split(",")[0].trim();
  return `${proto}://${host}`;
}

function absoluteUrl(origin: string, value?: string | null): string {
  if (!value) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(value)) return value;
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
}

function cleanSlug(value: string): string {
  return decodeURIComponent(value || "")
    .trim()
    .replace(/^[([{<"'`]+/, "")
    .replace(/[)\]}>"'`.,!?;:]+$/, "");
}

async function getDefaultShareImage(origin: string): Promise<string> {
  try {
    const [projects, articles, news] = await Promise.all([
      db.getAllProjects({ status: "published" }),
      db.getAllArticles({ status: "published" }),
      db.getAllNews({ status: "published" }),
    ]);

    const image =
      projects.find((p) => Boolean(p.coverImageUrl))?.coverImageUrl ||
      articles.find((a) => Boolean(a.coverImageUrl))?.coverImageUrl ||
      news.find((n) => Boolean(n.coverImageUrl))?.coverImageUrl;

    return absoluteUrl(origin, image || DEFAULT_OG_IMAGE);
  } catch {
    return absoluteUrl(origin, DEFAULT_OG_IMAGE);
  }
}

async function resolveSeoMeta(req: express.Request): Promise<SeoMeta> {
  const origin = getRequestSiteUrl(req);
  const pathOnly = req.path;
  const canonical = `${origin}${pathOnly === "/" ? "" : pathOnly}`;
  const decodedPath = decodeURIComponent(pathOnly);

  const articleMatch = decodedPath.match(/^\/articles\/([^/?#]+)$/i);
  if (articleMatch) {
    const slug = cleanSlug(articleMatch[1]);
    const article = await db.getArticleBySlug(slug);
    if (article?.status === "published") {
      return {
        title: article.seoTitle || article.title || DEFAULT_META.title,
        description: article.seoDescription || article.excerpt || DEFAULT_META.description,
        image: absoluteUrl(origin, article.coverImageUrl),
        canonical: `${origin}/articles/${article.slug}`,
        type: "article",
      };
    }
  }

  const newsMatch = decodedPath.match(/^\/news\/([^/?#]+)$/i);
  if (newsMatch) {
    const slug = cleanSlug(newsMatch[1]);
    const news = await db.getNewsBySlug(slug);
    if (news?.status === "published") {
      return {
        title: news.seoTitle || news.title || DEFAULT_META.title,
        description: news.seoDescription || news.excerpt || DEFAULT_META.description,
        image: absoluteUrl(origin, news.coverImageUrl),
        canonical: `${origin}/news/${news.slug}`,
        type: "article",
      };
    }
  }

  const projectMatch = decodedPath.match(/^\/project\/([^/?#]+)$/i);
  if (projectMatch) {
    const slug = cleanSlug(projectMatch[1]);
    const project = await db.getProjectBySlug(slug);
    if (project?.status === "published") {
      return {
        title: project.seoTitle || project.title || DEFAULT_META.title,
        description: project.seoDescription || project.excerpt || DEFAULT_META.description,
        image: absoluteUrl(origin, project.coverImageUrl),
        canonical: `${origin}/project/${project.slug}`,
        type: "website",
      };
    }
  }

  if (decodedPath === "/projects" || decodedPath === "/projects/scenic-design") {
    const projects = await db.getAllProjects({ status: "published", discipline: "scenic_design" });
    const hero = projects.find((p) => p.featured && p.coverImageUrl) || projects.find((p) => p.coverImageUrl);
    return {
      title: "Scenic Design | Brandon PT Davis",
      description: "Portfolio of scenic design productions by Brandon PT Davis.",
      image: absoluteUrl(origin, hero?.coverImageUrl || (await getDefaultShareImage(origin))),
      canonical: `${origin}/projects`,
      type: "website",
    };
  }

  if (decodedPath === "/news") {
    const newsItems = await db.getAllNews({ status: "published" });
    const hero = newsItems.find((n) => n.coverImageUrl);
    return {
      title: "Production News | Brandon PT Davis",
      description: "Production updates, press coverage, and milestones from scenic design work.",
      image: absoluteUrl(origin, hero?.coverImageUrl || (await getDefaultShareImage(origin))),
      canonical: `${origin}/news`,
      type: "website",
    };
  }

  if (decodedPath === "/articles") {
    const articles = await db.getAllArticles({ status: "published" });
    const hero = articles.find((a) => a.coverImageUrl);
    return {
      title: "Scenic Insights | Articles by Brandon PT Davis",
      description: "Articles on scenic design process, production craft, and storytelling.",
      image: absoluteUrl(origin, hero?.coverImageUrl || (await getDefaultShareImage(origin))),
      canonical: `${origin}/articles`,
      type: "website",
    };
  }

  if (decodedPath === "/studio" || decodedPath === "/studio/tutorials") {
    const articles = await db.getAllArticles({ status: "published" });
    const hero = articles.find((a) => a.coverImageUrl);
    return {
      title: decodedPath === "/studio" ? "Scenic Design Studio | Brandon PT Davis" : "Vectorworks Tutorials | Brandon PT Davis",
      description:
        decodedPath === "/studio"
          ? "Scenic design studio hub with tools, tutorials, and production resources."
          : "Vectorworks tutorials for scenic designers: drafting, modeling, and rendering workflows.",
      image: absoluteUrl(origin, hero?.coverImageUrl || (await getDefaultShareImage(origin))),
      canonical,
      type: "website",
    };
  }

  return { ...DEFAULT_META, canonical, image: await getDefaultShareImage(origin) };
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  
  // Skip SPA rendering for API and static file routes
  app.use("*", async (req, res, next) => {
    // Don't render SPA for these routes - let them fall through
    if (req.path.match(/\.(xml|txt|rss|json)$/) || 
        req.path.startsWith("/api/") ||
        req.path.startsWith("/sitemap")) {
      return next();
    }

    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      const meta = await resolveSeoMeta(req);
      const pageWithMeta = injectSeoMeta(page, meta);
      res.status(200).set({ "Content-Type": "text/html" }).end(pageWithMeta);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Static files are always in dist/public relative to the project root
  // We can find the project root relative to this file
  const distPath = path.resolve(__dirname, "../..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(
    express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache");
          return;
        }

        // Vite emits content-hashed assets; keep them immutable for max cache efficiency.
        if (/[.-][A-Za-z0-9_-]{8,}\.(js|css|mjs|png|jpe?g|gif|svg|webp|woff2?)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          return;
        }

        res.setHeader("Cache-Control", "public, max-age=86400");
      },
    })
  );

  // Fall through to index.html if the file doesn't exist
  // BUT: don't serve index.html for API, static file, or sitemap requests
  app.use("*", async (req, res) => {
    // Don't render SPA for these routes
    if (req.path.match(/\.(xml|txt|rss|json)$/) || 
        req.path.startsWith("/api/") ||
        req.path.startsWith("/sitemap")) {
      return res.status(404).send("Not found");
    }
    try {
      const indexPath = path.resolve(distPath, "index.html");
      const template = await fs.promises.readFile(indexPath, "utf-8");
      const meta = await resolveSeoMeta(req);
      const pageWithMeta = injectSeoMeta(template, meta);
      res.status(200).set({ "Content-Type": "text/html" }).end(pageWithMeta);
    } catch {
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
