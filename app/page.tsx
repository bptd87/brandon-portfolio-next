import HomePage from "../client/src/pages/Home";
import { NextPathProvider } from "../components/routing/NextPathProvider";
import { buildPageMetadata } from "../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Scenic Designer for Theatre, Rendering, and Experiential Work",
  description:
    "Brandon PT Davis is a scenic designer creating theatre environments, concept renderings, and experiential design work for regional productions, universities, and branded spaces.",
  pathname: "/",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/">
      <HomePage />
    </NextPathProvider>
  );
}
