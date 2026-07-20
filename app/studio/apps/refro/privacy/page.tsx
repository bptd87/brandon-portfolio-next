import RefRoInfo from "../../../../../client/src/pages/RefRoInfo";
import { NextPathProvider } from "../../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../../lib/metadata";

export const dynamic = "force-static";
export const metadata = buildPageMetadata({
  title: "RefRo Privacy Policy",
  description:
    "How RefRo stores, processes, syncs, and protects visual research on macOS.",
  pathname: "/studio/apps/refro/privacy",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/refro/privacy">
      <RefRoInfo page="privacy" />
    </NextPathProvider>
  );
}
