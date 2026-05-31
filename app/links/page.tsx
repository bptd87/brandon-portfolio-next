import LinksPage from "../../client/src/pages/Links";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Links",
  description: "A visual scenic design update feed with recent projects, production photos, writing, and contact links from Brandon PT Davis.",
  pathname: "/links",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/links">
      <LinksPage />
    </NextPathProvider>
  );
}
