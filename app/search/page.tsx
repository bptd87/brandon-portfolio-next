import SearchPage from "../../client/src/pages/Search";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Search the Site",
  description:
    "Search projects, articles, tutorials, collaborators, and credits across the Brandon PT Davis site.",
  pathname: "/search",
  noindex: true,
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/search">
      <SearchPage />
    </NextPathProvider>
  );
}
