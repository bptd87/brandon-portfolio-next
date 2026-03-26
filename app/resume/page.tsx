import ResumePage from "../../client/src/pages/Resume";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Resume",
  description:
    "Production history, teaching, training, and portfolio-linked scenic design credits.",
  pathname: "/resume",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/resume">
      <ResumePage />
    </NextPathProvider>
  );
}
