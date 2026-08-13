import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const nextConfig: NextConfig = {
  devIndicators: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  typedRoutes: false,
  outputFileTracingRoot: projectRoot,
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.0.23"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    qualities: [70, 74, 75, 78, 80, 82, 84, 86, 88, 92],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  turbopack: {
    root: projectRoot,
  },
  async headers() {
    return [
      {
        source: "/:path*\\.(jpg|jpeg|png|webp|avif|svg|ico)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/data/:path*\\.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/news/:path*",
        destination: "/articles",
        permanent: true,
      },
      {
        source: "/upcoming-productions/:path*",
        destination: "/projects/scenic-design",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/projects/scenic-models",
        destination: "/projects/rendering",
        permanent: true,
      },
      {
        source: "/projects/scenic-models/:slug",
        destination: "/projects/rendering/:slug",
        permanent: true,
      },
      {
        source: "/projects/tags/:slug",
        destination: "/tags/:slug",
        permanent: true,
      },
      {
        source: "/scale-converter",
        destination: "/studio/apps/scale-calculator",
        permanent: true,
      },
      {
        source: "/studio/apps/paint-finder",
        destination: "/studio/apps/commercial-paint-matcher",
        permanent: true,
      },
      {
        source: "/studio/apps/classical-orders",
        destination: "/studio/apps/design-history-timeline",
        permanent: true,
      },
      {
        source: "/directory",
        destination: "/studio/directory",
        permanent: true,
      },
      {
        source: "/scenic-insights-all",
        destination: "/articles",
        permanent: true,
      },
      {
        source: "/scenic-insights-design-philosophy",
        destination: "/articles",
        permanent: true,
      },
      {
        source: "/articles/navigating-the-scenic-design-process-a-comprehensive-guide",
        destination: "/articles/scenic-design-process",
        permanent: true,
      },
      {
        source: "/articles/scenic-rendering-principles",
        destination: "/articles/what-makes-a-good-scenic-design-rendering",
        permanent: true,
      },
      {
        source:
          "/articles/understanding-computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care",
        destination:
          "/articles/computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care",
        permanent: true,
      },
      {
        source: "/articles/the-modern-theatrical-design-portfolio",
        destination: "/articles/online-portfolio-theatrical-design-2026",
        permanent: true,
      },
      {
        source: "/project/rss.xml",
        destination: "/projects/rss.xml",
        permanent: true,
      },
      {
        source:
          "/scenic-insights/sora-in-the-studio-testing-ais-potential-for-theatrical-design",
        destination:
          "/articles/sora-in-the-studio-testing-ais-potential-for-theatrical-design",
        permanent: true,
      },
    ];
  },
};

export default withMDX(nextConfig);
