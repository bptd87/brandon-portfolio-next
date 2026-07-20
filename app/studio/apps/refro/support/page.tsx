import RefRoInfo from "../../../../../client/src/pages/RefRoInfo";
import { NextPathProvider } from "../../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../../lib/metadata";

export const dynamic = "force-static";
export const metadata = buildPageMetadata({
  title: "RefRo Support",
  description:
    "Support, system requirements, permissions, importing, iCloud, and troubleshooting guidance for RefRo on macOS.",
  pathname: "/studio/apps/refro/support",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/refro/support">
      <RefRoInfo page="support" />
    </NextPathProvider>
  );
}
