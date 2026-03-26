import StudioDirectoryPage from "../../../client/src/pages/StudioDirectory";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Scenic Directory | Brandon PT Davis",
  description:
    "Curated directory of scenic resources, organizations, archives, and reference links.",
  pathname: "/studio/directory",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/directory">
      <StudioDirectoryPage />
    </NextPathProvider>
  );
}
