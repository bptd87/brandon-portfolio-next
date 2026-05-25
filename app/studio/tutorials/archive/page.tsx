import StudioTutorialsPage from "../../../../client/src/pages/StudioTutorials";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { JsonLdScript } from "../../../../components/seo/JsonLdScript";
import { absoluteUrl, buildPageMetadata } from "../../../../lib/metadata";
import { getBreadcrumbJsonLd } from "../../../../lib/seo/entities";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Studio Tutorial Archive",
  description:
    "Browse the archive of scenic design tutorials, Vectorworks lessons, and production workflow guides by Brandon PT Davis.",
  pathname: "/studio/tutorials/archive",
  type: "article",
});

export default function Page() {
  return (
    <>
      <JsonLdScript
        id="studio-tutorials-archive-breadcrumb-json-ld"
        data={getBreadcrumbJsonLd([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Studio", url: absoluteUrl("/studio") },
          { name: "Tutorials", url: absoluteUrl("/studio/tutorials") },
          { name: "Archive", url: absoluteUrl("/studio/tutorials/archive") },
        ])}
      />
      <NextPathProvider currentPath="/studio/tutorials/archive">
        <StudioTutorialsPage variant="archive" />
      </NextPathProvider>
    </>
  );
}
