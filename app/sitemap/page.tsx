import SitemapPage from "../../client/src/pages/Sitemap";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Sitemap",
  description: "HTML sitemap for Brandon PT Davis.",
  pathname: "/sitemap",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/sitemap">
      <SitemapPage />
    </NextPathProvider>
  );
}
