import ScaleCalculatorPage from "../../../../client/src/pages/ScaleCalculator";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = {
  ...buildPageMetadata({
    title: "3D Printing Scale Calculator",
    description:
      "Convert architectural and scenic dimensions into model scale millimeters for 3D printing, physical models, drafting, and shop workflows.",
    pathname: "/studio/apps/scale-calculator",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scale-calculator.jpg",
  }),
  appleWebApp: {
    capable: true,
    title: "Scale",
    statusBarStyle: "default",
  },
  icons: {
    apple: [
      {
        url: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scale-calculator-touch.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

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
              { "@type": "ListItem", position: 2, name: "Studio Apps", item: "https://www.brandonptdavis.com/studio/apps" },
              { "@type": "ListItem", position: 3, name: "Scale Calculator", item: "https://www.brandonptdavis.com/studio/apps/scale-calculator" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Architectural Scale Calculator for 3D Printing",
            alternateName: [
              "Scale Calculator",
              "3D Printing Scale Calculator",
              "Architectural Model Scale Calculator",
            ],
            description:
              "A free web app that converts full-size architectural and scenic dimensions into model scale millimeters for 3D printing, drafting, and physical model making.",
            applicationCategory: "DesignApplication",
            operatingSystem: "Web",
            image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scale-calculator.jpg",
            url: "https://www.brandonptdavis.com/studio/apps/scale-calculator",
            featureList: [
              "Convert full-size feet and inches to model scale millimeters",
              "Convert model millimeters back to full-size architectural dimensions",
              "Check common architectural scales including quarter-inch scale",
              "Compare model output against common 3D printer bed sizes",
            ],
            keywords:
              "architectural scale calculator, 3D printing scale calculator, model scale calculator, scenic design calculator, quarter inch scale",
            author: {
              "@type": "Person",
              name: "Brandon PT Davis",
              url: "https://www.brandonptdavis.com",
            },
            publisher: {
              "@type": "Person",
              name: "Brandon PT Davis",
              url: "https://www.brandonptdavis.com",
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
      <NextPathProvider currentPath="/studio/apps/scale-calculator">
        <ScaleCalculatorPage />
      </NextPathProvider>
    </>
  );
}
