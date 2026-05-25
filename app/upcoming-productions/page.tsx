import UpcomingProductionsPage from "../../client/src/pages/UpcomingProductions";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { JsonLdScript } from "../../components/seo/JsonLdScript";
import { absoluteUrl, buildPageMetadata } from "../../lib/metadata";
import { getBreadcrumbJsonLd } from "../../lib/seo/entities";
import { productionEvents, upcomingProductions } from "../../shared/upcomingProductions";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Upcoming Productions | Brandon PT Davis",
  description:
    "Upcoming scenic design productions and selected production archive pages by Brandon PT Davis.",
  pathname: "/upcoming-productions",
  image:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/upcoming-productions/upcoming-productions-hero.webp",
});

function getUpcomingProductionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/upcoming-productions#list"),
    name: "Upcoming scenic design productions and archive pages by Brandon PT Davis",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: productionEvents.length,
    itemListElement: productionEvents.map((production, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/upcoming-productions/${production.id}`),
      name: production.title,
    })),
  };
}

export default function Page() {
  return (
    <>
      <JsonLdScript id="upcoming-productions-json-ld" data={getUpcomingProductionJsonLd()} />
      <JsonLdScript
        id="upcoming-productions-breadcrumb-json-ld"
        data={getBreadcrumbJsonLd([
          { name: "Home", url: absoluteUrl("/") },
          { name: "About", url: absoluteUrl("/about") },
          { name: "Upcoming Productions", url: absoluteUrl("/upcoming-productions") },
        ])}
      />
      <NextPathProvider currentPath="/upcoming-productions">
        <UpcomingProductionsPage />
      </NextPathProvider>
    </>
  );
}
