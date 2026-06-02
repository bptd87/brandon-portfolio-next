import BecomingPage from "../../../client/src/pages/Becoming";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";
import { becomingPhotos } from "../../../shared/becomingPhotos.generated";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Photography Portfolio",
  description:
    "A chronological photography portfolio and visual reference archive shaped by observation, attention, and scenic design practice.",
  pathname: "/projects/photography",
  image: becomingPhotos[0]?.src,
  type: "article",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/projects/photography">
      <BecomingPage />
    </NextPathProvider>
  );
}
