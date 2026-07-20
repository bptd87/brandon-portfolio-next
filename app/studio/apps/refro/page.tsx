import RefRoPage from "../../../../client/src/pages/RefRo";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "RefRo — Visual Research and Mood Boards for Mac",
  description:
    "Keep image sources and creative context together, organize a reusable research archive, and build polished mood boards with RefRo for Mac.",
  pathname: "/studio/apps/refro",
  image: "/assets/studio-apps/refro/04-presentation-editor.jpg",
});

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
            "@type": "SoftwareApplication",
            name: "RefRo: Reference Rover",
            applicationCategory: "DesignApplication",
            operatingSystem: "macOS 15 or later",
            description:
              "A source-aware visual research archive and mood-board studio for Mac.",
            url: "https://www.brandonptdavis.com/studio/apps/refro",
            author: {
              "@type": "Person",
              name: "Brandon Davis",
              url: "https://www.brandonptdavis.com",
            },
          }),
        }}
      />
      <NextPathProvider currentPath="/studio/apps/refro">
        <RefRoPage />
      </NextPathProvider>
    </>
  );
}
