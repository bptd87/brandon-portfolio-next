import StudioAppsPage from "../../../client/src/pages/StudioApps";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Studio Apps for Scenic Design Workflow",
  description:
    "Production-focused calculators, reference tools, and utilities for scenic drafting, paint, modeling, and research.",
  pathname: "/studio/apps",
});

const studioApps = [
  {
    title: "Scenic 3D Converter (Mac)",
    href: "/studio/apps/scenic-3d-converter",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-scenic-3d-converter.png",
  },
  {
    title: "Scale Calculator",
    href: "/studio/apps/scale-calculator",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-scale-calculator.png",
  },
  {
    title: "Dimension Reference",
    href: "/studio/apps/dimension-reference",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-dimension-reference.png",
  },
  {
    title: "Rosco Paint Calculator",
    href: "/studio/apps/rosco-paint-calculator",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-rosco-paint-calculator.png",
  },
  {
    title: "Design History Timeline",
    href: "/studio/apps/design-history-timeline",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-design-history-timeline.png",
  },
] as const;

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
            name: "Scenic Design Tools",
            url: "https://www.brandonptdavis.com/studio/apps",
            description:
              "Production-focused scenic design apps for drafting, scale, paint, modeling, and research.",
            about: "Studio applications for scenic design workflow.",
            primaryImageOfPage:
              "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-scenic-3d-converter.png",
            mainEntity: {
              "@type": "ItemList",
              name: "Studio Apps",
              itemListElement: studioApps.map((app, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: app.title,
                url: `https://www.brandonptdavis.com${app.href}`,
                image: `https://www.brandonptdavis.com${app.image}`,
              })),
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Scenic 3D Converter for Vectorworks (Mac)",
            description:
              "Finder quick-action utility for converting 3D files into Vectorworks-friendly USD, USDZ, and 3DM outputs.",
            applicationCategory: "GraphicsApplication",
            operatingSystem: "macOS",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            url: "https://www.brandonptdavis.com/studio/apps/scenic-3d-converter",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Scale Calculator - Scenic Design Tool",
            description:
              "Convert between architectural and model scales. Essential for drafting and model building in theatrical design.",
            applicationCategory: "DesignApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            url: "https://www.brandonptdavis.com/studio/apps/scale-calculator",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Rosco Paint Calculator - Scenic Paint Mixing",
            description:
              "Professional scenic paint mixing calculator with advanced 5-step color matching engine for Rosco Off-Broadway paints.",
            applicationCategory: "DesignApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            url: "https://www.brandonptdavis.com/studio/apps/rosco-paint-calculator",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Design History Timeline - Architecture Reference",
            description:
              "Explore major design periods from Ancient Egypt to Contemporary architecture with detailed information, color palettes, and key figures.",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            url: "https://www.brandonptdavis.com/studio/apps/design-history-timeline",
          }),
        }}
      />
      <NextPathProvider currentPath="/studio/apps">
        <StudioAppsPage />
      </NextPathProvider>
    </>
  );
}
