import type { Metadata } from "next";

import ArticlesArchivePage from "../../../client/src/pages/ArticlesArchive";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { JsonLdScript } from "../../../components/seo/JsonLdScript";
import { absoluteUrl, buildPageMetadata } from "../../../lib/metadata";
import { BRANDON_PERSON_ID, getBreadcrumbJsonLd } from "../../../lib/seo/entities";

export const dynamic = "force-static";

export const metadata: Metadata = buildPageMetadata({
  title: "Article Archive",
  description:
    "A chronological archive of scenic design articles, Vectorworks tutorials, and studio writing by Brandon PT Davis.",
  pathname: "/articles/archive",
  type: "article",
});

export default function Page() {
  const archiveJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/articles/archive")}#collection`,
    name: "Article Archive",
    url: absoluteUrl("/articles/archive"),
    description:
      "A chronological archive of scenic design articles, Vectorworks tutorials, and studio writing by Brandon PT Davis.",
    inLanguage: "en-US",
    author: {
      "@id": BRANDON_PERSON_ID,
    },
  };

  return (
    <>
      <JsonLdScript
        id="articles-archive-page-json-ld"
        data={[
          getBreadcrumbJsonLd([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Articles", url: absoluteUrl("/articles") },
            { name: "Archive", url: absoluteUrl("/articles/archive") },
          ]),
          archiveJsonLd,
        ]}
      />
      <NextPathProvider currentPath="/articles/archive">
        <ArticlesArchivePage />
      </NextPathProvider>
    </>
  );
}
