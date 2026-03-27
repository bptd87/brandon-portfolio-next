import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  typedRoutes: false,
  typescript: {
    // Temporary deploy unblock while legacy admin/server TypeScript debt is cleaned up.
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [75, 82, 84],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xibkuwouvisabnfowthn.supabase.co",
      },
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
    root: __dirname,
  },
  async redirects() {
    return [
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
