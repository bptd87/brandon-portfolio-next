import ResumePage from "../../client/src/pages/Resume";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Resume and Scenic Design Credits",
  description:
    "Resume, CV, teaching history, awards, and selected scenic design credits across regional theatre, summer stock, and academic production.",
  pathname: "/resume",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/resume">
      <ResumePage />
    </NextPathProvider>
  );
}
