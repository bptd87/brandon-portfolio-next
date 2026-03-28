import CreativeStatementPage from "../../client/src/pages/CreativeStatement";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Creative Statement on Scenic Design",
  description:
    "A creative statement on scenic design, architecture, history, collaboration, and story-led space making in live performance.",
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
