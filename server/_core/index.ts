import "dotenv/config";
import express, { type Express } from "express";
import { createServer, type Server } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { generateRSSFeed } from "../rss";
import * as sitemap from "../sitemap";
// import imageProxyRouter from "../imageProxy"; // Import inside function to prevent crash on startup if sharp fails
import { sdk } from "./sdk";
import * as db from "../db";
import { supabase } from "../supabase";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import { fileURLToPath } from 'url';
import { compressionMiddleware } from "./compression";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

export async function createConfiguredApp(app?: Express, server?: Server): Promise<Express> {
  const expressApp = app || express();
  const defaultJsonParser = express.json({ limit: "1mb" });
  const defaultUrlEncodedParser = express.urlencoded({ limit: "1mb", extended: true });
  const largeJsonParser = express.json({ limit: "50mb" });
  const largeUrlEncodedParser = express.urlencoded({ limit: "50mb", extended: true });

  // Trust proxy headers so req.ip resolves correctly behind Cloudflare/Railway
  expressApp.set("trust proxy", true);

  if (process.env.NODE_ENV === "production") {
    expressApp.use(compressionMiddleware);
  }

  // Force canonical host/protocol for stronger SEO consolidation.
  expressApp.use((req, res, next) => {
    const host = String(req.get("host") || "").toLowerCase();
    const proto = String(req.get("x-forwarded-proto") || req.protocol || "").toLowerCase();
    const needsWww = host === "brandonptdavis.com";
    const needsHttps = host.endsWith("brandonptdavis.com") && proto && proto !== "https";

    if (needsWww || needsHttps) {
      const canonicalHost = host === "brandonptdavis.com" ? "www.brandonptdavis.com" : host;
      return res.redirect(301, `https://${canonicalHost}${req.originalUrl}`);
    }

    return next();
  });

  // Health check endpoint for deployment debugging
  expressApp.get("/health", (req: express.Request, res: express.Response) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        HAS_SUPABASE_URL: !!process.env.SUPABASE_URL,
        HAS_SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
        HAS_DATABASE_URL: !!process.env.DATABASE_URL
      }
    });
  });

  // Use larger body limits only where uploads/large payloads are expected.
  expressApp.use((req, res, next) => {
    const usesLargeBodyLimit = req.path.startsWith("/api/trpc");
    const jsonParser = usesLargeBodyLimit ? largeJsonParser : defaultJsonParser;
    const urlParser = usesLargeBodyLimit ? largeUrlEncodedParser : defaultUrlEncodedParser;

    jsonParser(req, res, err => {
      if (err) return next(err);
      urlParser(req, res, next);
    });
  });

  const slugifyLoose = (value: string) =>
    decodeURIComponent(value || "")
      .trim()
      .toLowerCase()
      .replace(/["']/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const redirect301 = (res: express.Response, target: string) => {
    res.redirect(301, target);
  };

  const legacySlugAliases: Record<string, string> = {
    // High-impression legacy scenic-insights slugs that no longer match current canonical slugs.
    "navigating-the-scenic-design-process-a-comprehensive-guide": "scenic-design-process",
    "understanding-computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care":
      "computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care",
    "scenic-rendering-principles": "what-makes-a-good-scenic-design-rendering",
    "the-art-of-presenting-theatre-design-a-guide-for-designers":
      "the-art-of-presenting-theatre-design-a-guide-for-designers",
    "sora-in-the-studio-testing-ais-potential-for-theatrical-design":
      "sora-in-the-studio-testing-ais-potential-for-theatrical-design",
    "the-lights-were-already-on-maude-adams-legacy-at-stephens-college":
      "the-lights-were-already-on-maude-adams-legacy-at-stephens-college",
    "red-line-caf": "red-line-cafe",
  };

  // Legacy SEO URL redirects to consolidate ranking signals.
  expressApp.get("/home", (_req, res) => redirect301(res, "/"));
  expressApp.get("/index.html", (_req, res) => redirect301(res, "/"));
  expressApp.get("/&", (_req, res) => redirect301(res, "/"));
  expressApp.get("/scale-converter", (_req, res) => redirect301(res, "/studio/apps/scale-calculator"));
  expressApp.get("/architecture-scale-converter", (_req, res) => redirect301(res, "/studio/apps/scale-calculator"));
  expressApp.get("/portfolio", (_req, res) => redirect301(res, "/projects"));
  expressApp.get("/directory", (_req, res) => redirect301(res, "/studio/directory"));
  expressApp.get("/scenic-studio", (_req, res) => redirect301(res, "/studio"));
  expressApp.get("/scenic-toolkit", (_req, res) => redirect301(res, "/studio/apps"));
  expressApp.get("/theatre-renderings", (_req, res) => redirect301(res, "/projects/rendering"));
  expressApp.get("/software", (_req, res) => redirect301(res, "/studio/apps"));
  expressApp.get("/store", (_req, res) => redirect301(res, "/contact"));
  expressApp.get("/press", (_req, res) => redirect301(res, "/news"));
  expressApp.get("/terms-of-use", (_req, res) => redirect301(res, "/privacy-policy"));
  expressApp.get("/upcoming-productions", (_req, res) => redirect301(res, "/news"));
  expressApp.get("/upcoming-productions/:slug", (_req, res) => redirect301(res, "/news"));
  expressApp.get("/aditional-design", (_req, res) => redirect301(res, "/projects"));
  expressApp.get("/design-portfolio/:slug", (_req, res) => redirect301(res, "/projects"));
  expressApp.get("/design-portfolio/:collection/:slug", async (req, res) => {
    const raw = req.params.slug || "";
    const slug = legacySlugAliases[slugifyLoose(raw)] || slugifyLoose(raw);
    if (!slug) return redirect301(res, "/projects");

    try {
      const project = await db.getProjectBySlug(slug);
      if (project?.status === "published") return redirect301(res, `/project/${slug}`);
      return redirect301(res, "/projects");
    } catch {
      return redirect301(res, "/projects");
    }
  });
  expressApp.get("/design-process/:slug", (_req, res) => redirect301(res, "/projects"));
  expressApp.get("/projects/scenic-design", (_req, res) => redirect301(res, "/projects"));
  expressApp.get("/projects", (req, res, next) => {
    const discipline = String(req.query.discipline || "").toLowerCase();
    if (!discipline) return next();
    if (discipline === "scenic_design") return redirect301(res, "/projects");
    if (discipline === "rendering") return redirect301(res, "/projects/rendering");
    if (discipline === "experiential_design") return redirect301(res, "/projects/experiential");
    return next();
  });
  expressApp.get("/scenic-insights", (_req, res) => redirect301(res, "/articles"));
  expressApp.get("/scenic-insights-all", (_req, res) => redirect301(res, "/articles"));
  expressApp.get("/scenic-insights-1", (_req, res) => redirect301(res, "/articles"));
  expressApp.get("/scneic-insights/:slug", (_req, res) => redirect301(res, "/articles"));
  expressApp.get("/scenic-insights-design-process", (_req, res) => redirect301(res, "/articles"));
  expressApp.get("/scenic-insights-design-philosophy", (_req, res) => redirect301(res, "/articles"));
  expressApp.get("/scenic-insights/category/:slug", (_req, res) => redirect301(res, "/articles"));
  expressApp.get("/scenic-insights/tag/:slug", (_req, res) => redirect301(res, "/articles"));
  expressApp.get("/articles/tag/:slug", (req, res) => {
    const tagSlug = slugifyLoose(req.params.slug || "");
    if (!tagSlug) return redirect301(res, "/articles");
    return redirect301(res, `/tags/${tagSlug}`);
  });
  expressApp.get("/news/category/:slug", (_req, res) => redirect301(res, "/news"));
  expressApp.get("/news/tag/:slug", (req, res) => {
    const tagSlug = slugifyLoose(req.params.slug || "");
    if (!tagSlug) return redirect301(res, "/news");
    return redirect301(res, `/tags/${tagSlug}`);
  });
  expressApp.get("/news", (req, res, next) => {
    const rawTag = String(req.query.tag || "").trim();
    if (!rawTag) return next();

    const decodeTwice = (value: string): string => {
      try {
        const once = decodeURIComponent(value);
        try {
          return decodeURIComponent(once);
        } catch {
          return once;
        }
      } catch {
        return value;
      }
    };

    const normalizedTag = decodeTwice(rawTag).replace(/\+/g, " ");
    const tagSlug = slugifyLoose(normalizedTag);
    if (!tagSlug) return redirect301(res, "/news");
    return redirect301(res, `/tags/${tagSlug}`);
  });
  expressApp.get("/feed", (_req, res) => redirect301(res, "/projects"));
  expressApp.get("/feed/category/:slug", (_req, res) => redirect301(res, "/projects"));
  expressApp.get("/feed/tag/:slug", (_req, res) => redirect301(res, "/projects"));
  expressApp.get("/feed-collection", (_req, res) => redirect301(res, "/projects"));
  expressApp.get("/feed-collection/category/:slug", (_req, res) => redirect301(res, "/projects"));
  expressApp.get("/feed-collection/:slug", (_req, res) => redirect301(res, "/projects"));
  expressApp.get("/resources/all", (_req, res) => redirect301(res, "/studio"));
  expressApp.get("/resources/designers-toolkit", (_req, res) => redirect301(res, "/studio/apps"));
  expressApp.get("/resources/vectorworks-vault", (_req, res) => redirect301(res, "/studio/tutorials"));
  expressApp.get("/resources/scenic-design-studio", (_req, res) => redirect301(res, "/studio/tutorials"));
  expressApp.get("/resources/scenic-design-studio/v", (_req, res) => redirect301(res, "/studio/tutorials"));
  expressApp.get("/resources/scenic-design-studio/vectorworks-tutorials", (_req, res) =>
    redirect301(res, "/studio/tutorials")
  );
  expressApp.get("/tutorial/:slug", (req, res) =>
    redirect301(res, `/resources/scenic-design-studio/v/${slugifyLoose(req.params.slug || "")}`)
  );
  expressApp.get("/scenic-design-studio/:slug", (req, res) =>
    redirect301(res, `/resources/scenic-design-studio/v/${slugifyLoose(req.params.slug || "")}`)
  );
  expressApp.get("/vectorworks-vault", (_req, res) => redirect301(res, "/studio/tutorials"));
  expressApp.get("/vectorworks-vault/tag/:slug", (_req, res) => redirect301(res, "/studio/tutorials"));
  expressApp.get("/vectorworks-vault/:slug", (_req, res) => redirect301(res, "/studio/tutorials"));

  expressApp.get("/scenic-insights/:slug", async (req, res) => {
    const originalSlug = slugifyLoose(req.params.slug || "");
    const slug = legacySlugAliases[originalSlug] || originalSlug;
    if (!slug) return redirect301(res, "/articles");

    try {
      const article = await db.getArticleBySlug(slug);
      if (article?.status === "published") return redirect301(res, `/articles/${slug}`);

      const newsItem = await db.getNewsBySlug(slug);
      if (newsItem?.status === "published") return redirect301(res, `/news/${slug}`);

      return redirect301(res, "/articles");
    } catch {
      return redirect301(res, "/articles");
    }
  });

  expressApp.get("/post/:slug", async (req, res) => {
    const originalSlug = slugifyLoose(req.params.slug || "");
    const slug = legacySlugAliases[originalSlug] || originalSlug;
    if (!slug) return redirect301(res, "/articles");

    try {
      const article = await db.getArticleBySlug(slug);
      if (article?.status === "published") return redirect301(res, `/articles/${slug}`);

      const newsItem = await db.getNewsBySlug(slug);
      if (newsItem?.status === "published") return redirect301(res, `/news/${slug}`);

      const project = await db.getProjectBySlug(slug);
      if (project?.status === "published") return redirect301(res, `/project/${slug}`);

      return redirect301(res, "/articles");
    } catch {
      return redirect301(res, "/articles");
    }
  });

  expressApp.get("/feed/:slug", async (req, res) => {
    const originalSlug = slugifyLoose(req.params.slug || "");
    const slug = legacySlugAliases[originalSlug] || originalSlug;
    if (!slug) return redirect301(res, "/projects");

    try {
      const project = await db.getProjectBySlug(slug);
      if (project?.status === "published") return redirect301(res, `/project/${slug}`);

      const newsItem = await db.getNewsBySlug(slug);
      if (newsItem?.status === "published") return redirect301(res, `/news/${slug}`);

      const article = await db.getArticleBySlug(slug);
      if (article?.status === "published") return redirect301(res, `/articles/${slug}`);

      return redirect301(res, "/projects");
    } catch {
      return redirect301(res, "/projects");
    }
  });

  expressApp.get("/projects/:slug", async (req, res) => {
    const originalSlug = slugifyLoose(req.params.slug || "");
    const slug = legacySlugAliases[originalSlug] || originalSlug;
    if (!slug) return redirect301(res, "/projects");

    try {
      const project = await db.getProjectBySlug(slug);
      if (project?.status === "published") return redirect301(res, `/project/${slug}`);
      return redirect301(res, "/projects");
    } catch {
      return redirect301(res, "/projects");
    }
  });

  expressApp.get("/scenic-design/:slug", async (req, res) => {
    const originalSlug = slugifyLoose(req.params.slug || "");
    const slug = legacySlugAliases[originalSlug] || originalSlug;
    if (!slug) return redirect301(res, "/projects");

    try {
      const project = await db.getProjectBySlug(slug);
      if (project?.status === "published") return redirect301(res, `/project/${slug}`);
      return redirect301(res, "/projects");
    } catch {
      return redirect301(res, "/projects");
    }
  });

  expressApp.get("/news/:slug", async (req, res, next) => {
    const originalSlug = slugifyLoose(req.params.slug || "");
    const slug = legacySlugAliases[originalSlug] || originalSlug;
    if (!slug) return redirect301(res, "/news");

    try {
      const newsItem = await db.getNewsBySlug(slug);
      if (newsItem?.status === "published") {
        if (slug !== originalSlug) return redirect301(res, `/news/${slug}`);
        return next();
      }

      const project = await db.getProjectBySlug(slug);
      if (project?.status === "published") return redirect301(res, `/project/${slug}`);

      const article = await db.getArticleBySlug(slug);
      if (article?.status === "published") return redirect301(res, `/articles/${slug}`);

      return redirect301(res, "/news");
    } catch {
      return redirect301(res, "/news");
    }
  });

  expressApp.get("/articles/:slug", async (req, res, next) => {
    const originalSlug = slugifyLoose(req.params.slug || "");
    const slug = legacySlugAliases[originalSlug] || originalSlug;
    if (!slug) return redirect301(res, "/articles");

    try {
      const article = await db.getArticleBySlug(slug);
      if (article?.status === "published") {
        if (slug !== originalSlug) return redirect301(res, `/articles/${slug}`);
        return next();
      }

      const newsItem = await db.getNewsBySlug(slug);
      if (newsItem?.status === "published") return redirect301(res, `/news/${slug}`);

      const project = await db.getProjectBySlug(slug);
      if (project?.status === "published") return redirect301(res, `/project/${slug}`);

      return redirect301(res, "/articles");
    } catch {
      return redirect301(res, "/articles");
    }
  });

  expressApp.get("/project/:slug", async (req, res, next) => {
    const originalSlug = slugifyLoose(req.params.slug || "");
    const slug = legacySlugAliases[originalSlug] || originalSlug;
    if (!slug) return redirect301(res, "/projects");

    try {
      const project = await db.getProjectBySlug(slug);
      if (project?.status === "published") {
        if (slug !== originalSlug) return redirect301(res, `/project/${slug}`);
        return next();
      }
      return redirect301(res, "/projects");
    } catch {
      return redirect301(res, "/projects");
    }
  });

  expressApp.get("/project", (_req, res) => {
    return redirect301(res, "/projects");
  });

  expressApp.get("/resources/scenic-design-studio/v/:slug", async (req, res) => {
    const originalSlug = slugifyLoose(req.params.slug || "");
    const slug = legacySlugAliases[originalSlug] || originalSlug;
    if (!slug) return redirect301(res, "/studio/tutorials");

    const tutorialSlugs = new Set([
      "navigating-user-interface",
      "understanding-classes",
      "understanding-design-layers",
      "installing-workspace-template",
      "basics-tool-palette",
      "sheet-layers",
      "2d-edit-modify-tricks",
      "resource-manager-basics",
      "understanding-symbols",
      "2d-annotations-dimensioning",
      "3d-modeling-basics",
      "hybrid-symbols",
      "basics-of-textures",
      "3d-modeling-tools",
      "creating-pdfs-without-plotter",
      "modeling-a-table",
      "creating-camera-rendering",
      "creating-2d-from-3d-models",
    ]);

    try {
      const article = await db.getArticleBySlug(slug);
      if (article?.status === "published") return redirect301(res, `/articles/${slug}`);
      const newsItem = await db.getNewsBySlug(slug);
      if (newsItem?.status === "published") return redirect301(res, `/news/${slug}`);
      if (tutorialSlugs.has(slug)) return redirect301(res, `/studio/tutorials/${slug}`);
      return redirect301(res, "/studio/tutorials");
    } catch {
      return redirect301(res, "/studio/tutorials");
    }
  });

  const seoAndFeedCachePaths = [
    "/sitemap.xml",
    "/image-sitemap.xml",
    "/video-sitemap.xml",
    "/sitemap-index.xml",
    "/robots.txt",
    "/api/news/rss",
    "/projects/rss.xml",
    "/articles/rss.xml",
    "/news/rss.xml",
    "/studio/tutorials/rss.xml",
  ];

  expressApp.use(seoAndFeedCachePaths, (_req, res, next) => {
    // Short cache to keep feeds and crawlers responsive without serving stale content for long.
    res.setHeader("Cache-Control", "public, max-age=900, s-maxage=3600, stale-while-revalidate=86400");
    next();
  });

  // Dev Login Bypass
  expressApp.get("/api/dev-login", async (req, res) => {
    try {
      if (process.env.NODE_ENV === "production") {
        res.status(404).send("Not found");
        return;
      }

      const openId = process.env.OWNER_OPEN_ID;
      if (!openId) {
        res.status(500).send("OWNER_OPEN_ID not set in environment");
        return;
      }

      const name = process.env.OWNER_NAME || "Dev User";

      // 1. Upsert User
      await db.upsertUser({
        openId,
        name,
        email: "dev@local.host",
        loginMethod: "dev-bypass",
        lastSignedIn: new Date(),
        role: "admin", // Force admin role for owner
      });

      // 2. Create Session
      const sessionToken = await sdk.createSessionToken(openId, {
        name,
        expiresInMs: ONE_YEAR_MS,
      });

      // 3. Set Cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // 4. Redirect to Admin
      res.redirect("/admin");
    } catch (error) {
      console.error("Dev login failed:", error);
      res.status(500).send("Dev login failed");
    }
  });

  // Sitemaps
  expressApp.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const xml = await sitemap.generateMainSitemap(baseUrl);
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  expressApp.get("/image-sitemap.xml", async (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const xml = await sitemap.generateImageSitemap(baseUrl);
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating image sitemap:", error);
      res.status(500).send("Error generating image sitemap");
    }
  });

  expressApp.get("/video-sitemap.xml", async (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const xml = await sitemap.generateVideoSitemap(baseUrl);
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating video sitemap:", error);
      res.status(500).send("Error generating video sitemap");
    }
  });

  expressApp.get("/sitemap-index.xml", (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const xml = sitemap.generateSitemapIndex(baseUrl);
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap index:", error);
      res.status(500).send("Error generating sitemap index");
    }
  });

  expressApp.get("/robots.txt", (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const txt = sitemap.generateRobotsTxt(baseUrl);
      res.header("Content-Type", "text/plain");
      res.send(txt);
    } catch (error) {
      console.error("Error generating robots.txt:", error);
      res.status(500).send("Error generating robots.txt");
    }
  });

  // Allow API crawling for rendering, but prevent API endpoints from being indexed as pages.
  expressApp.use("/api", (_req, res, next) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    next();
  });

  // tRPC API - Mount before image proxy so TRPC routes have priority
  expressApp.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Image proxy for on-demand resizing
  // Lazy load image proxy to prevent server crash if sharp fails
  expressApp.use("/api", async (req, res, next) => {
    try {
      const { default: imageProxyRouter } = await import("../imageProxy");
      imageProxyRouter(req, res, next);
    } catch (error) {
      console.error("Failed to load image proxy:", error);
      // Call next() instead of sending error so other middleware can handle it
      next(error);
    }
  });

  // RSS feeds
  expressApp.get("/api/news/rss", generateRSSFeed);

  expressApp.get("/api/downloads/scenic-3d-converter", async (_req, res) => {
    const bucket = "Downloads";
    const objectPath = "dist/Scenic-3D-Converter-Stable.zip";
    const downloadName = "Scenic-3D-Converter-Stable.zip";
    const timeoutMs = 8000;

    try {
      const signedUrlResult = await Promise.race([
        supabase.storage
          .from(bucket)
          .createSignedUrl(objectPath, 60 * 5, { download: downloadName }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Signed URL request timed out")), timeoutMs)
        ),
      ]);

      const { data, error } = signedUrlResult;

      if (error || !data?.signedUrl) {
        console.error("Failed to generate signed download URL:", error);
        return res.status(404).json({
          error: "Download not available",
          path: objectPath,
        });
      }

      return res.redirect(302, data.signedUrl);
    } catch (error) {
      console.error("Download redirect failed:", error);
      return res.status(500).json({
        error: "Unable to prepare download",
      });
    }
  });

  expressApp.get("/projects/rss.xml", async (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const xml = await sitemap.generateProjectsRSS(baseUrl);
      res.header("Content-Type", "application/rss+xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating projects RSS:", error);
      res.status(500).send("Error generating projects RSS");
    }
  });

  expressApp.get("/articles/rss.xml", async (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const xml = await sitemap.generateArticlesRSS(baseUrl);
      res.header("Content-Type", "application/rss+xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating articles RSS:", error);
      res.status(500).send("Error generating articles RSS");
    }
  });

  expressApp.get("/news/rss.xml", async (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const xml = await sitemap.generateNewsRSS(baseUrl);
      res.header("Content-Type", "application/rss+xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating news RSS:", error);
      res.status(500).send("Error generating news RSS");
    }
  });

  expressApp.get("/studio/tutorials/rss.xml", (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const xml = sitemap.generateTutorialsRSS(baseUrl);
      res.header("Content-Type", "application/rss+xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating tutorials RSS:", error);
      res.status(500).send("Error generating tutorials RSS");
    }
  });

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development" && server) {
    await setupVite(expressApp, server);
  } else {
    serveStatic(expressApp);
  }

  // Global Error Handler
  expressApp.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Global Port Error Handler Captured:", err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
      error: {
        message: err.message || "An unexpected error occurred",
        code: err.code || "INTERNAL_SERVER_ERROR",
        details: process.env.NODE_ENV === "development" ? err.stack : undefined
      }
    });
  });

  return expressApp;
}

// Standalone server startup (for local dev or non-serverless prod)
// Check if this module is the main module
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const startServer = async () => {
    const app = express();
    const server = createServer(app);

    await createConfiguredApp(app, server);

    const rawPort = process.env.PORT || "8080";
    const preferredPort = parseInt(rawPort);

    // Prevent binding to PostgreSQL port (common Railway env variable issue)
    if (preferredPort === 5432) {
      console.warn(`⚠️  PORT is set to 5432 (PostgreSQL). Using 8080 for HTTP server instead.`);
    }

    let port = preferredPort === 5432 ? 8080 : preferredPort;

    if (process.env.NODE_ENV !== "production") {
      port = await findAvailablePort(port);
      if (port !== preferredPort) {
        console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
      }
    } else {
      console.log(`Production mode: Binding strictly to PORT ${port}`);
    }

    server.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${port}/`);
    });
  };

  startServer().catch(console.error);
}
