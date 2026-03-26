import AccessibilityPage from "../../client/src/pages/Accessibility";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Accessibility",
  description: "Accessibility statement for Brandon PT Davis.",
  pathname: "/accessibility",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/accessibility">
      <AccessibilityPage />
    </NextPathProvider>
  );
}
