import HomePage from "../client/src/pages/Home";
import { NextPathProvider } from "../components/routing/NextPathProvider";
import { JsonLdScript } from "../components/seo/JsonLdScript";
import { absoluteUrl, buildPageMetadata } from "../lib/metadata";
import {
  BRANDON_ORGANIZATION_ID,
  BRANDON_PERSON_ID,
  BRANDON_WEBSITE_ID,
  getBreadcrumbJsonLd,
} from "../lib/seo/entities";
import { getLocalScenicProjects } from "../shared/localScenicProjects";
import {
  toScenicProjectSummary,
  type ScenicProjectSummary,
} from "../shared/scenicProjectSummaries";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Brandon PT Davis | Scenic Designer Portfolio",
  description:
    "Brandon PT Davis is a San Diego-based scenic designer creating theatre environments, concept renderings, and production design work for regional theatre and live performance.",
  pathname: "/",
});

function getHomePageJsonLd(projects: ScenicProjectSummary[]) {
  const featuredProjects = projects
    .filter(project => project.coverImageUrl)
    .slice(0, 12);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": absoluteUrl("/#home"),
      url: absoluteUrl("/"),
      name: "Brandon PT Davis | Scenic Designer Portfolio",
      description:
        "Selected scenic design projects, theatrical renderings, and production environments by Brandon PT Davis.",
      isPartOf: {
        "@id": BRANDON_WEBSITE_ID,
      },
      about: [
        {
          "@id": BRANDON_PERSON_ID,
        },
        {
          "@id": BRANDON_ORGANIZATION_ID,
        },
      ],
      mainEntity: {
        "@id": BRANDON_PERSON_ID,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": absoluteUrl("/#featured-scenic-design"),
      name: "Featured Scenic Design Portfolio",
      description: "Selected scenic design projects by Brandon PT Davis.",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: featuredProjects.length,
      itemListElement: featuredProjects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/project/${project.slug}`),
        item: {
          "@type": "CreativeWork",
          "@id": `${absoluteUrl(`/project/${project.slug}`)}#creative-work`,
          name: project.title,
          image: project.coverImageUrl,
          creator: {
            "@id": BRANDON_PERSON_ID,
          },
          genre: project.subcategory || "Scenic Design",
          dateCreated: project.year
            ? `${project.year}-${String(project.month || 1).padStart(2, "0")}-01`
            : undefined,
        },
      })),
    },
  ];
}

export default function Page() {
  const projects = getLocalScenicProjects().map(toScenicProjectSummary);

  return (
    <>
      <JsonLdScript id="home-page-json-ld" data={getHomePageJsonLd(projects)} />
      <JsonLdScript
        id="home-breadcrumb-json-ld"
        data={getBreadcrumbJsonLd([{ name: "Home", url: absoluteUrl("/") }])}
      />
      <NextPathProvider currentPath="/">
        <HomePage initialProjects={projects} />
      </NextPathProvider>
    </>
  );
}
