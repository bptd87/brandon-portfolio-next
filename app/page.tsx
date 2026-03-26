import HomePage from "../client/src/pages/Home";
import { NextPathProvider } from "../components/routing/NextPathProvider";
import { buildPageMetadata } from "../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Brandon PT Davis | Scenic Designer",
  description:
    "Union scenic designer in Southern California creating story-driven environments for regional theatre, summer stock, and academic production.",
  pathname: "/",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/">
      <HomePage />
    </NextPathProvider>
  );
}
