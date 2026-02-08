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
  
  // Sitemaps
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const xml = await sitemap.generateMainSitemap();
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });
  
  app.get("/image-sitemap.xml", async (req, res) => {
    try {
      const xml = await sitemap.generateImageSitemap();
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating image sitemap:", error);
      res.status(500).send("Error generating image sitemap");
    }
  });
  
  app.get("/video-sitemap.xml", async (req, res) => {
    try {
      const xml = await sitemap.generateVideoSitemap();
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating video sitemap:", error);
      res.status(500).send("Error generating video sitemap");
    }
  });
  
  app.get("/sitemap-index.xml", (req, res) => {
    try {
      const xml = sitemap.generateSitemapIndex();
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap index:", error);
      res.status(500).send("Error generating sitemap index");
    }
  });
  
  app.get("/robots.txt", (req, res) => {
    try {
      const txt = sitemap.generateRobotsTxt();
      res.header("Content-Type", "text/plain");
      res.send(txt);
    } catch (error) {
      console.error("Error generating robots.txt:", error);
      res.status(500).send("Error generating robots.txt");
    }
  });
  
  // RSS feeds
  app.get("/api/news/rss", generateRSSFeed);
  
  app.get("/articles/rss.xml", async (req, res) => {
    try {
      const xml = await sitemap.generateArticlesRSS();
      res.header("Content-Type", "application/rss+xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating articles RSS:", error);
      res.status(500).send("Error generating articles RSS");
    }
  });
  
  app.get("/news/rss.xml", async (req, res) => {
    try {
      const xml = await sitemap.generateNewsRSS();
      res.header("Content-Type", "application/rss+xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating news RSS:", error);
      res.status(500).send("Error generating news RSS");
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
