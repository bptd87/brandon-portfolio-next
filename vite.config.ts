import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import Beasties from "beasties";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// Critical CSS inlining plugin using Beasties (maintained Critters fork)
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

      const beasties = new Beasties({
        path: path.resolve(import.meta.dirname, 'dist/public'),
        publicPath: '/',
        preload: 'swap',
        noscriptFallback: true,
        inlineFonts: false, // Don't inline fonts, they're already optimized
        pruneSource: false, // Keep original CSS file for non-critical styles
      });

      try {
        const processed = await beasties.process(html);
        fs.writeFileSync(indexPath, processed, 'utf-8');
        console.log('✓ Critical CSS inlined successfully');
      } catch (error) {
        console.error('Critical CSS inlining failed:', error);
      }
    },
  };
}

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  const plugins = [
    react(),
    tailwindcss(),
    jsxLocPlugin(),
    vitePluginCriticalCSS(),
    !isDev &&
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'inline', // Inline SW registration to avoid render-blocking
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
          runtimeCaching: [
            // Always go to network for app API calls to avoid stale admin/data issues after deploys.
            {
              urlPattern: /^\/api\/trpc\/.*/i,
              handler: 'NetworkOnly',
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
        },
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
        }
      }),
  ].filter(Boolean) as Plugin[];

  return {
    plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'wouter',
      'lucide-react',
      '@trpc/client',
      '@trpc/react-query',
      '@tanstack/react-query',
      'framer-motion',
    ],
    exclude: ['@builder.io/vite-plugin-jsx-loc'],
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-dom/client'],
          // UI components and styling
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-slot',
            'framer-motion',
            'tailwind-merge',
            'clsx',
            'class-variance-authority'
          ],
          // Data fetching and API
          'data-vendor': [
            '@trpc/client',
            '@trpc/react-query',
            '@tanstack/react-query',
            'superjson'
          ],
          // Supabase (largest single dependency)
          'supabase-vendor': ['@supabase/supabase-js'],
          // Icons (separate chunk for better caching)
          'icons': ['lucide-react'],
          // Router and utils
          'utils-vendor': ['wouter', 'sonner', 'react-helmet-async']
        },
      },
    },
    // Enable chunk size warnings
    chunkSizeWarningLimit: 600,
    // Optimize dependencies
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn'],
      },
    },
  },
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 150,
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  };
});
