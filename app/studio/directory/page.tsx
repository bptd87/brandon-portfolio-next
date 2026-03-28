import StudioDirectoryPage from "../../../client/src/pages/StudioDirectory";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Scenic Design Resource Directory | Brandon PT Davis",
  description:
    "Curated scenic design directory of theatre organizations, software, archives, drafting references, and production suppliers.",
  pathname: "/studio/directory",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/directory">
      <StudioDirectoryPage />
    </NextPathProvider>
  );
}
