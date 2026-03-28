import AboutPage from "../../client/src/pages/About";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "About Brandon PT Davis",
  description:
    "About Brandon PT Davis, a scenic designer working across theatre, rendering, experiential design, and scenic design education.",
  pathname: "/about",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/about">
      <AboutPage />
    </NextPathProvider>
  );
}
