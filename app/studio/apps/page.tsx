import StudioAppsPage from "../../../client/src/pages/StudioApps";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Studio Apps for Scenic Design Workflow",
  description:
    "Production-focused studio tools for architectural scale conversion, 3D printing, scenic paint, model making, drafting, and research.",
  pathname: "/studio/apps",
  image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scale-calculator-card-2026.jpg",
});

const studioApps = [
  {
    name: "Scenic 3D Converter",
    description:
      "Mac utility for converting 3D files into Vectorworks-friendly USD, USDZ, and 3DM outputs.",
    href: "/studio/apps/scenic-3d-converter",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scenic-3d-converter-card-2026.jpg",
    applicationCategory: "GraphicsApplication",
    operatingSystem: "macOS",
  },
  {
    name: "Architectural Scale Calculator for 3D Printing",
    description:
      "Convert full-size architectural and scenic dimensions into model scale millimeters for 3D printing, model making, and drafting.",
    href: "/studio/apps/scale-calculator",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scale-calculator-card-2026.jpg",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
  },
  {
    name: "Dimension Reference",
    description:
      "Quick reference for standard scenic, architectural, shop, furniture, and production dimensions.",
    href: "/studio/apps/dimension-reference",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/dimension-reference-card-2026.jpg",
    applicationCategory: "ReferenceApplication",
    operatingSystem: "Web",
  },
  {
    name: "Rosco Paint Calculator",
    description:
      "Scenic paint calculator for Rosco Off-Broadway colors, surface coverage, and paint shop mix planning.",
    href: "/studio/apps/rosco-paint-calculator",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/rosco-paint-calculator-card-2026.jpg",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
  },
  {
    name: "Commercial Paint Matcher",
    description:
      "Match sampled colors against Sherwin-Williams, Benjamin Moore, and BEHR libraries with brand filters and copyable color data.",
    href: "/studio/apps/commercial-paint-matcher",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/commercial-paint-matcher-card-2026.jpg",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
  },
  {
    name: "Design History Timeline",
    description:
      "Explore major design periods with visual references, color palettes, key figures, and architectural history context.",
    href: "/studio/apps/design-history-timeline",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/design-history-timeline-card-2026.jpg",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
  },
] as const;

const siteUrl = "https://www.brandonptdavis.com";

function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${siteUrl}${path}`;
}

function softwareApplicationSchema(app: (typeof studioApps)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    applicationCategory: app.applicationCategory,
    operatingSystem: app.operatingSystem,
    image: absoluteUrl(app.image),
    url: absoluteUrl(app.href),
    author: {
      "@type": "Person",
      name: "Brandon PT Davis",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Brandon PT Davis",
      url: siteUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.brandonptdavis.com" },
              { "@type": "ListItem", position: 2, name: "Studio", item: "https://www.brandonptdavis.com/studio" },
              { "@type": "ListItem", position: 3, name: "Apps", item: "https://www.brandonptdavis.com/studio/apps" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Studio Apps for Scenic Design Workflow",
            url: `${siteUrl}/studio/apps`,
            description:
              "Production-focused studio tools for architectural scale conversion, 3D printing, scenic paint, model making, drafting, and research.",
            about: [
              "Scenic design workflow",
              "Architectural scale conversion",
              "3D printing model scale calculator",
              "Scenic paint and drafting tools",
            ],
            primaryImageOfPage: absoluteUrl("https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scale-calculator-card-2026.jpg"),
            mainEntity: {
              "@type": "ItemList",
              name: "Studio Apps",
              itemListElement: studioApps.map((app, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: softwareApplicationSchema(app),
              })),
            },
          }),
        }}
      />
      {studioApps.map((app) => (
        <script
          key={app.href}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(softwareApplicationSchema(app)) }}
        />
      ))}
      <NextPathProvider currentPath="/studio/apps">
        <StudioAppsPage />
      </NextPathProvider>
    </>
  );
}
