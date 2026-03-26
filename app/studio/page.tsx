import StudioPage from "../../client/src/pages/Studio";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Studio | Brandon PT Davis",
  description:
    "Studio resources for scenic design, including tutorials, articles, and the current reference directory.",
  pathname: "/studio",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio">
      <StudioPage />
    </NextPathProvider>
  );
}
