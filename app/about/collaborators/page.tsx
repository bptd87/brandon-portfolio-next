import CollaboratorsPage from "../../../client/src/pages/Collaborators";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Collaborators",
  description:
    "Creative partners, directors, and theatre companies that shape Brandon PT Davis's design practice.",
  pathname: "/about/collaborators",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/about/collaborators">
      <CollaboratorsPage />
    </NextPathProvider>
  );
}
