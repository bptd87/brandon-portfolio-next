import CollaboratorsPage from "../../../client/src/pages/Collaborators";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Collaborators and Creative Partners",
  description:
    "Directors, designers, theatre companies, and recurring creative partners who shape Brandon PT Davis's scenic design practice.",
  pathname: "/about/collaborators",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/about/collaborators">
      <CollaboratorsPage />
    </NextPathProvider>
  );
}
