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
import imageProxyRouter from "../imageProxy";
import { sdk } from "./sdk";
import * as db from "../db";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import { fileURLToPath } from 'url';

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

  // Configure body parser with larger size limit for file uploads
  expressApp.use(express.json({ limit: "50mb" }));
  expressApp.use(express.urlencoded({ limit: "50mb", extended: true }));

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

  // Image proxy for on-demand resizing
  expressApp.use("/api", imageProxyRouter);

  // RSS feeds
  expressApp.get("/api/news/rss", generateRSSFeed);

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

  // tRPC API
  expressApp.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

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

    const preferredPort = parseInt(process.env.PORT || "8080");
    let port = preferredPort;

    if (process.env.NODE_ENV !== "production") {
      port = await findAvailablePort(preferredPort);
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
