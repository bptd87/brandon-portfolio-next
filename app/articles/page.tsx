import type { Metadata } from "next";

import ArticlesPage from "../../client/src/pages/Articles";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = buildPageMetadata({
  title: "Scenic Design Articles",
  description:
    "Articles on scenic design, rendering, theatre history, production thinking, and visual storytelling by Brandon PT Davis.",
  pathname: "/articles",
  type: "article",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/articles">
      <ArticlesPage />
    </NextPathProvider>
  );
}
