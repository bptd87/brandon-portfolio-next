import AboutPage from "../../client/src/pages/About";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { JsonLdScript } from "../../components/seo/JsonLdScript";
import { absoluteUrl, buildPageMetadata } from "../../lib/metadata";
import { getAboutProfilePageJsonLd, getBreadcrumbJsonLd } from "../../lib/seo/entities";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "About Brandon PT Davis",
  description:
    "About Brandon PT Davis, a scenic designer working across theatre, rendering, experiential design, and scenic design education.",
  pathname: "/about",
});

export default function Page() {
  return (
    <>
      <JsonLdScript id="about-profile-json-ld" data={getAboutProfilePageJsonLd()} />
      <JsonLdScript
        id="about-breadcrumb-json-ld"
        data={getBreadcrumbJsonLd([
          { name: "Home", url: absoluteUrl("/") },
          { name: "About", url: absoluteUrl("/about") },
        ])}
      />
      <NextPathProvider currentPath="/about">
        <AboutPage />
      </NextPathProvider>
    </>
  );
}
