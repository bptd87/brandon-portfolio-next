import LinksPage from "../../client/src/pages/Links";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Links",
  description: "Quick links and destination pages across the Brandon PT Davis site.",
  pathname: "/links",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/links">
      <LinksPage />
    </NextPathProvider>
  );
}
