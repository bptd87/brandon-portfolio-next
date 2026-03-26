import TermsPage from "../../client/src/pages/Terms";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Terms",
  description: "Terms of use for Brandon PT Davis.",
  pathname: "/terms",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/terms">
      <TermsPage />
    </NextPathProvider>
  );
}
