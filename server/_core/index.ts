import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
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

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Dev Login Bypass
  app.get("/api/dev-login", async (req, res) => {
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
  app.get("/sitemap.xml", async (req, res) => {
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
  
  app.get("/image-sitemap.xml", async (req, res) => {
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
  
  app.get("/video-sitemap.xml", async (req, res) => {
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
  
  app.get("/sitemap-index.xml", (req, res) => {
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
  
  app.get("/robots.txt", (req, res) => {
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
  app.use("/api", imageProxyRouter);
  
  // RSS feeds
  app.get("/api/news/rss", generateRSSFeed);
  
  app.get("/articles/rss.xml", async (req, res) => {
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
  
  app.get("/news/rss.xml", async (req, res) => {
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
  
  app.get("/studio/tutorials/rss.xml", (req, res) => {
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
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
