import FAQPage from "../../client/src/pages/FAQ";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "FAQ",
  description: "Frequently asked questions about Brandon PT Davis and this site.",
  pathname: "/faq",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/faq">
      <FAQPage />
    </NextPathProvider>
  );
}
