import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
import path from "path";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import viteConfig from "../../vite.config";

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
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
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

  app.use(express.static(distPath));

  // Fall through to index.html if the file doesn't exist
  // BUT: don't serve index.html for API, static file, or sitemap requests
  app.use("*", (req, res) => {
    // Don't render SPA for these routes
    if (req.path.match(/\.(xml|txt|rss|json)$/) || 
        req.path.startsWith("/api/") ||
        req.path.startsWith("/sitemap")) {
      return res.status(404).send("Not found");
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
