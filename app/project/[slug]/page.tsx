import { notFound, permanentRedirect } from "next/navigation";

import ScenicProjectDetailPage from "../../../client/src/pages/ScenicProjectDetail";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { JsonLdScript } from "../../../components/seo/JsonLdScript";
import { absoluteUrl, buildPageMetadata } from "../../../lib/metadata";
import {
  BRANDON_ORGANIZATION_ID,
  BRANDON_PERSON_ID,
  BRANDON_WEBSITE_ID,
  getBreadcrumbJsonLd,
} from "../../../lib/seo/entities";
import { resolveLegacyProjectPath } from "../../../shared/legacyRedirects";
import {
  getLocalScenicProjectBySlug,
  getLocalScenicProjects,
  type LocalScenicProject,
} from "../../../shared/localScenicProjects";

type ScenicProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getLocalScenicProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ScenicProjectPageProps) {
  const { slug } = await params;
  const project = getLocalScenicProjectBySlug(slug);
  if (!project) return {};

  return buildPageMetadata({
    title: project.seoTitle || `${project.title} | Scenic Design`,
    description: project.seoDescription || project.excerpt,
    pathname: `/project/${project.slug}`,
    image: project.coverImageUrl,
    keywords: project.seoKeywords || undefined,
    type: "article",
  });
}

function compactList(values: Array<string | number | null | undefined>) {
  return values
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

function uniqueList(values: string[]) {
  return [...new Set(values)];
}

function getProjectDate(project: LocalScenicProject) {
  if (!project.year) return undefined;
  const month = String(project.month || 1).padStart(2, "0");
  return `${project.year}-${month}-01`;
}

function getScenicProjectJsonLd(project: LocalScenicProject) {
  const pathname = `/project/${project.slug}`;
  const projectUrl = absoluteUrl(pathname);
  const description = project.seoDescription || project.excerpt;
  const imageMedia = project.media.filter((item) => item.type === "image" && item.imageUrl);
  const imageUrls = uniqueList(
    compactList([project.coverImageUrl, ...imageMedia.map((item) => item.imageUrl)]).slice(0, 16)
  );
  const keywords = uniqueList([
    ...compactList([project.title, project.subcategory, project.client, project.location, project.year]),
    ...project.tags.map((tag) => tag.name),
    ...(project.seoKeywords || "").split(",").map((keyword) => keyword.trim()).filter(Boolean),
    "scenic design",
    "theatre set design",
    "Brandon PT Davis",
  ]);

  return [
    getBreadcrumbJsonLd([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Projects", url: absoluteUrl("/projects") },
      { name: project.title, url: projectUrl },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${projectUrl}#webpage`,
      url: projectUrl,
      name: project.seoTitle || `${project.title} Scenic Design`,
      description,
      isPartOf: {
        "@id": BRANDON_WEBSITE_ID,
      },
      about: [
        {
          "@id": `${projectUrl}#creative-work`,
        },
        {
          "@id": BRANDON_PERSON_ID,
        },
      ],
      primaryImageOfPage: project.coverImageUrl
        ? {
            "@type": "ImageObject",
            url: project.coverImageUrl,
            caption: `${project.title} scenic design by Brandon PT Davis.`,
          }
        : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${projectUrl}#creative-work`,
      name: project.title,
      headline: project.seoTitle || `${project.title} Scenic Design`,
      description,
      url: projectUrl,
      mainEntityOfPage: {
        "@id": `${projectUrl}#webpage`,
      },
      creator: {
        "@id": BRANDON_PERSON_ID,
      },
      author: {
        "@id": BRANDON_PERSON_ID,
      },
      publisher: {
        "@id": BRANDON_ORGANIZATION_ID,
      },
      image: imageUrls,
      dateCreated: getProjectDate(project),
      datePublished: project.publishedAt || getProjectDate(project),
      dateModified: project.updatedAt || project.publishedAt || getProjectDate(project),
      genre: project.subcategory || "Scenic Design",
      keywords: keywords.join(", "),
      isPartOf: {
        "@type": "CollectionPage",
        name: "Scenic Design Portfolio",
        url: absoluteUrl("/projects"),
      },
      locationCreated: project.client || project.location
        ? {
            "@type": "Place",
            name: project.client || project.location,
            address: project.location
              ? {
                  "@type": "PostalAddress",
                  addressLocality: project.location,
                }
              : undefined,
          }
        : undefined,
      contributor: project.creativeTeam.map((member) => ({
        "@type": "Person",
        name: member.name,
        roleName: member.role,
        url: member.url,
      })),
      workExample: imageMedia.slice(0, 12).map((item) => ({
        "@type": "ImageObject",
        contentUrl: item.imageUrl,
        name: item.altText || `${project.title} scenic design image`,
        caption: item.caption || item.altText || undefined,
        thumbnailUrl: item.imageUrl,
      })),
    },
  ];
}

export default async function Page({ params }: ScenicProjectPageProps) {
  const { slug } = await params;
  const project = getLocalScenicProjectBySlug(slug);

  if (!project) {
    const destination = resolveLegacyProjectPath(slug);
    if (!destination) {
      notFound();
    }
    permanentRedirect(destination);
  }

  return (
    <>
      <JsonLdScript id={`project-${project.slug}-json-ld`} data={getScenicProjectJsonLd(project)} />
      <NextPathProvider currentPath={`/project/${slug}`}>
        <ScenicProjectDetailPage slug={slug} currentPath={`/project/${slug}`} />
      </NextPathProvider>
    </>
  );
}
