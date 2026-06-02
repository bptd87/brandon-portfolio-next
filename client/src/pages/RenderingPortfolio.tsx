"use client";

import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioTopBar from "@/components/PortfolioTopBar";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getLocalRenderingGallery, getLocalRenderingProjects } from "@shared/localPortfolios";

const RENDERING_PORTFOLIO_URL = "https://www.brandonptdavis.com/projects/rendering";
const RENDERING_PORTFOLIO_TITLE = "Scenic Rendering Portfolio | Brandon PT Davis";
const RENDERING_PORTFOLIO_DESCRIPTION =
  "Scenic rendering portfolio by Brandon PT Davis, showing theatre concept renderings and visual studies used to test atmosphere, scale, and design intent before production.";
const RENDERING_PORTFOLIO_KEYWORDS = [
  "scenic rendering portfolio",
  "theatre renderings",
  "scenic design renderings",
  "stage design renderings",
  "production renderings",
  "theatre visualization",
  "pre-production visualization",
  "Brandon PT Davis",
].join(", ");

export default function RenderingPortfolio() {
  const projects = getLocalRenderingProjects().filter((project) => !project.galleryOnly);
  const galleryItems = getLocalRenderingGallery();
  const isLoading = false;

  // 1. Process Gallery Items (for the middle section)
  const galleryDisplayItems = galleryItems?.map(item => ({
    id: item.project?.id || 0,
    title: item.displayTitle || item.project?.title || '',
    imageUrl: item.project?.coverImageUrl || null,
    altText: item.altText || item.project?.title || '',
    slug: item.project?.slug || '',
    year: item.project?.year || null,
    client: item.project?.client,
    excerpt: item.project?.excerpt || item.project?.designNotes,
    designNotes: item.project?.designNotes,
    images: (item.project?.images || []).map(img => ({
      id: img.id,
      url: img.imageUrl || '',
      caption: img.caption,
      altText: img.altText
    }))
  })) || [];

  // 2. Process Featured Items (for the top section)
  // Filter out any projects that are already in the gallery to avoid duplicates
  const galleryProjectIds = new Set(galleryDisplayItems.map(item => item.id));

  const featuredDisplayItems = projects?.filter(p => !galleryProjectIds.has(p.id)).map(p => ({
    id: p.id,
    title: p.title,
    imageUrl: p.coverImageUrl || null,
    altText: p.title,
    slug: p.slug,
    year: p.year,
    client: p.client,
    excerpt: p.excerpt
  })) || [];

  const allRenderingItems = [...featuredDisplayItems, ...galleryDisplayItems]
    .filter((item) => item.slug && item.imageUrl)
    .filter((item, index, list) => list.findIndex((candidate) => candidate.slug === item.slug) === index);
  const renderingPortfolioImage =
    allRenderingItems[0]?.imageUrl || undefined;
  const renderingPortfolioUpdatedDate = (projects || []).reduce((latest, project) => {
    const candidate = project.updatedAt || project.publishedAt || project.createdAt;
    if (!candidate) return latest;
    const isoDate = new Date(candidate).toISOString().split("T")[0];
    return isoDate > latest ? isoDate : latest;
  }, "");
  const renderingPortfolioImages = Array.from(
    new Set(
      allRenderingItems
        .map((item) => item.imageUrl)
        .filter((value): value is string => Boolean(value))
    )
  ).slice(0, 12);
  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <SEO
        title={RENDERING_PORTFOLIO_TITLE}
        description={RENDERING_PORTFOLIO_DESCRIPTION}
        image={renderingPortfolioImage}
        imageAlt={allRenderingItems[0]?.altText || "Scenic rendering portfolio image"}
        keywords={RENDERING_PORTFOLIO_KEYWORDS}
        url={RENDERING_PORTFOLIO_URL}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Rendering", url: RENDERING_PORTFOLIO_URL },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Scenic Rendering Portfolio",
          url: RENDERING_PORTFOLIO_URL,
          description: RENDERING_PORTFOLIO_DESCRIPTION,
          about:
            "A portfolio of theatre renderings used to communicate light, material, atmosphere, and spatial intent before production.",
          primaryImageOfPage: renderingPortfolioImage,
          mainEntity: {
            name: "Rendering Projects",
            itemListElement: allRenderingItems
              .filter((item) => item.slug)
              .map((item, index) => ({
                position: index + 1,
                name: item.title,
                url: `${RENDERING_PORTFOLIO_URL}/${item.slug}`,
                datePublished: item.year ? `${item.year}-01-01` : undefined,
                image: item.imageUrl || undefined,
              })),
          },
        }}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: "Rendering",
          description: RENDERING_PORTFOLIO_DESCRIPTION,
          url: RENDERING_PORTFOLIO_URL,
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          genre: "Theatre Rendering",
          about:
            "Pre-production renderings built to support scenic collaboration, production alignment, and visual storytelling.",
          mainEntityOfPage: RENDERING_PORTFOLIO_URL,
          dateModified: renderingPortfolioUpdatedDate || undefined,
          keywords: RENDERING_PORTFOLIO_KEYWORDS.split(", "),
          image: renderingPortfolioImages,
          workExample: allRenderingItems
            .filter((item) => item.imageUrl)
            .slice(0, 12)
            .map((item) => ({
              type: "ImageObject" as const,
              contentUrl: item.imageUrl || "",
              name: item.title,
              caption: `${item.title} rendering by Brandon PT Davis`,
            })),
        }}
      />
      <Header />
      <PortfolioTopBar />

      <main>
        <section className="bg-[#111111] pt-12 md:pt-16">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 pb-4">
              <div>
                <p className="font-mono text-[0.68rem] uppercase leading-none tracking-[0.16em] text-white/46">
                  Rendering as scenic design.
                </p>
                <p className="mt-3 max-w-2xl text-[1rem] leading-6 text-white/58 md:text-[1.08rem]">
                  Concept images and production visualizations used to test atmosphere,
                  scale, color, and intent before the work reaches the stage.
                </p>
              </div>
              <p className="font-mono text-[0.72rem] uppercase leading-none tracking-[0.16em] text-white/42">
                {allRenderingItems.length} studies
              </p>
            </div>
            <div>
              <h1 className="font-sans text-7xl font-medium uppercase leading-[0.78] tracking-normal text-white sm:text-8xl md:text-[9rem] lg:text-[11rem] xl:text-[14rem]">
                Rendering
              </h1>
            </div>
          </div>
        </section>

        {allRenderingItems.length > 0 && (
          <section id="rendering" className="scroll-mt-24 border-t border-white/12 bg-[#111111]">
            <div className="grid w-full grid-cols-1 border-l border-white/12 md:grid-cols-4">
              {allRenderingItems.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/projects/rendering/${item.slug}`}
                  className={`group block border-b border-r border-white/12 ${index % 6 < 2 ? "md:col-span-2" : ""}`}
                >
                  <article className="bg-[#111111]">
                    <div className="site-media-square relative aspect-[4/3] overflow-hidden bg-[#181818]">
                      {item.imageUrl ? (
                        <ProgressiveImage
                          src={item.imageUrl}
                          alt={item.altText}
                          aspectRatio="4 / 3"
                          objectFit="cover"
                          containerClassName="site-media-square h-full w-full"
                          className="site-media-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                          loading={index < 3 ? "eager" : "lazy"}
                          fetchPriority={index < 3 ? "high" : "auto"}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/42">
                          Image unavailable
                        </div>
                      )}
                    </div>
                    <div className="grid min-h-[8.5rem] gap-3 border-t border-white/12 p-[clamp(0.9rem,1.5vw,1.2rem)] text-white md:grid-cols-[minmax(0,1fr)_auto]">
                      <div>
                        <p className="font-mono text-[0.66rem] uppercase leading-none tracking-[0.13em] text-white/80">
                          Rendering
                        </p>
                        <h2 className="mt-2 max-w-[18ch] font-sans text-[clamp(1.2rem,1.7vw,1.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white transition-colors group-hover:text-white/72">
                          {item.title}
                        </h2>
                      </div>
                      {[item.client, item.year].filter(Boolean).length > 0 ? (
                        <p className="max-w-[16ch] font-sans text-[0.94rem] leading-tight tracking-[-0.025em] text-white/52 md:text-right">
                          {[item.client, item.year].filter(Boolean).join(" / ")}
                        </p>
                      ) : null}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
