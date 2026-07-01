import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import UpcomingProductionDetailPage from "../../../client/src/pages/UpcomingProductionDetail";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { JsonLdScript } from "../../../components/seo/JsonLdScript";
import { absoluteUrl, buildPageMetadata } from "../../../lib/metadata";
import { BRANDON_PERSON_ID, getBreadcrumbJsonLd } from "../../../lib/seo/entities";
import { resolveLegacyProjectPath } from "../../../shared/legacyRedirects";
import {
  getProductionEventById,
  productionEvents,
} from "../../../shared/upcomingProductions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return productionEvents.map((production) => ({ slug: production.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const production = getProductionEventById(slug);

  if (!production) {
    return buildPageMetadata({
      title: "Production Event Not Found",
      description: "The requested production event could not be found.",
      pathname: `/upcoming-productions/${slug}`,
      noindex: true,
    });
  }

  const pageLabel = production.status === "archived" ? "Production Archive" : "Upcoming Production";

  return buildPageMetadata({
    title: `${production.title} | ${pageLabel} | Brandon PT Davis`,
    description: production.description,
    pathname: `/upcoming-productions/${production.id}`,
    image: absoluteUrl(production.imageUrl),
    keywords: [
      production.title,
      production.company,
      production.director,
      "Brandon PT Davis",
      "scenic design",
    ].join(", "),
    type: "article",
  });
}

function getProductionJsonLd(production: NonNullable<ReturnType<typeof getProductionEventById>>) {
  const pageUrl = absoluteUrl(`/upcoming-productions/${production.id}`);

  return {
    "@context": "https://schema.org",
    "@type": "TheaterEvent",
    "@id": `${pageUrl}#event`,
    name: `${production.title} scenic design by Brandon PT Davis`,
    description: production.description,
    startDate: production.startDate,
    endDate: production.endDate,
    image: absoluteUrl(production.imageUrl),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: pageUrl,
    location: {
      "@type": "Place",
      name: production.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: production.location.city,
        addressRegion: production.location.region,
        addressCountry: "US",
      },
    },
    organizer: {
      "@type": "Organization",
      name: production.company,
      url: production.companyUrl,
    },
    workPerformed: {
      "@type": "CreativeWork",
      name: production.title,
    },
    contributor: [
      {
        "@type": "Person",
        "@id": BRANDON_PERSON_ID,
        name: "Brandon PT Davis",
        jobTitle: "Scenic Designer",
      },
      {
        "@type": "Person",
        name: production.director,
        jobTitle: "Director",
      },
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    sameAs: [production.sourceUrl, production.portfolioHref ? absoluteUrl(production.portfolioHref) : null].filter(
      Boolean
    ),
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const production = getProductionEventById(slug);

  if (!production) {
    const destination = resolveLegacyProjectPath(slug);
    if (destination) {
      permanentRedirect(destination);
    }
    notFound();
  }

  const pageUrl = absoluteUrl(`/upcoming-productions/${production.id}`);

  return (
    <>
      <JsonLdScript id={`${production.id}-event-json-ld`} data={getProductionJsonLd(production)} />
      <JsonLdScript
        id={`${production.id}-breadcrumb-json-ld`}
        data={getBreadcrumbJsonLd([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Upcoming Productions", url: absoluteUrl("/upcoming-productions") },
          { name: production.title, url: pageUrl },
        ])}
      />
      <NextPathProvider currentPath={`/upcoming-productions/${production.id}`}>
        <UpcomingProductionDetailPage production={production} />
      </NextPathProvider>
    </>
  );
}
