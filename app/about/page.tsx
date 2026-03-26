import AboutPage from "../../client/src/pages/About";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "About Brandon PT Davis",
  description:
    "Southern California scenic designer with production credits across regional theatre, summer stock, and education.",
  pathname: "/about",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/about">
      <AboutPage />
    </NextPathProvider>
  );
}
