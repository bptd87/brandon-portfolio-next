import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
// @ts-ignore - critters has type issues with package.json exports
import Critters from "critters";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// Critical CSS inlining plugin using Critters
function vitePluginCriticalCSS(): Plugin {
  return {
    name: 'vite-plugin-critical-css',
    apply: 'build',
    async closeBundle() {
      // Run after build completes and files are written to disk
      const indexPath = path.resolve(import.meta.dirname, 'dist/public/index.html');
      
      if (!fs.existsSync(indexPath)) {
        console.warn('index.html not found, skipping critical CSS inlining');
        return;
      }
      
      const html = fs.readFileSync(indexPath, 'utf-8');
      
      const critters = new Critters({
        path: path.resolve(import.meta.dirname, 'dist/public'),
        publicPath: '/',
        preload: 'swap',
        noscriptFallback: true,
        inlineFonts: false, // Don't inline fonts, they're already optimized
        pruneSource: false, // Keep original CSS file for non-critical styles
      });
      
      try {
        const processed = await critters.process(html);
        fs.writeFileSync(indexPath, processed, 'utf-8');
        console.log('✓ Critical CSS inlined successfully');
      } catch (error) {
        console.error('Critical CSS inlining failed:', error);
      }
    },
  };
}

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginCriticalCSS(),
  VitePWA({
    registerType: 'autoUpdate',
    injectRegister: 'inline', // Inline SW registration to avoid render-blocking
    includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    manifest: {
      name: 'Brandon PT Davis | Scenic & Experiential Design',
      short_name: 'Brandon Davis',
      description: 'Scenic & Experiential Designer transforming theatrical spaces into immersive visual landscapes',
      theme_color: '#0a0a0a',
      background_color: '#0a0a0a',
      display: 'standalone',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
      runtimeCaching: [
        {
          urlPattern: /^\/api\/trpc\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 5 // 5 minutes
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^\/api\/img\?.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-proxy-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/.*\.cloudfront\.net\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'cdn-cache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            }
          }
        }
      ]
    }
  })
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
