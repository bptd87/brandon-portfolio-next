import CreativeStatementPage from "../../client/src/pages/CreativeStatement";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Creative Statement",
  description:
    "Creative statement on architecture, history, collaboration, and narrative storytelling in scenic design.",
  pathname: "/creative-statement",
  type: "article",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/creative-statement">
      <CreativeStatementPage />
    </NextPathProvider>
  );
}
