import PrivacyPage from "../../client/src/pages/Privacy";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Privacy",
  description: "Privacy policy for Brandon PT Davis.",
  pathname: "/privacy",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/privacy">
      <PrivacyPage />
    </NextPathProvider>
  );
}
