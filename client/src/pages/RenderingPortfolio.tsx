"use client";

import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getLocalArticles } from "@shared/localArticles";
import { getLocalRenderingGallery, getLocalRenderingProjects } from "@shared/localPortfolios";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const RENDERING_PORTFOLIO_URL = "https://www.brandonptdavis.com/projects/rendering";
const RENDERING_PORTFOLIO_TITLE = "Scenic Rendering Portfolio | Brandon PT Davis";
const RENDERING_PORTFOLIO_DESCRIPTION =
  "Scenic rendering portfolio by Brandon PT Davis featuring theatre concept renderings, alternate views, and production visualization developed to support directors, collaborators, and scenic teams.";
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
  const showcaseItems = allRenderingItems.slice(0, 5);
  const relatedRenderingArticles = getLocalArticles()
    .filter(
      (article) =>
        article.series?.slug === "vectorworks-rendering" ||
        article.tags?.some((tag) => tag.slug === "scenic-rendering")
    )
    .sort((a, b) => {
      const seriesOrder = (a.series?.order || 99) - (b.series?.order || 99);
      if (seriesOrder !== 0) return seriesOrder;
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    })
    .slice(0, 4);
  const [activeShowcaseIndex, setActiveShowcaseIndex] = useState(0);
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
    <div className="min-h-screen bg-background">
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

      {showcaseItems.length > 0 ? (
        <section className="relative min-h-[calc(100svh-74px)] overflow-hidden border-b border-white/10 bg-background">
          <div className="absolute inset-0">
            {showcaseItems.map((item, index) => (
              <img
                key={item.slug}
                src={item.imageUrl || ""}
                alt={item.altText}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                  index === activeShowcaseIndex ? "opacity-100" : "opacity-0"
                }`}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            ))}
            <div className="absolute inset-0 bg-black/12" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.34)_36%,rgba(0,0,0,0.04)_74%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/48 to-transparent" />
          </div>

          <div className="relative flex min-h-[calc(100svh-74px)] items-end px-[clamp(1.5rem,5vw,6rem)] pb-10 pt-14 md:pb-14">
            <div className="w-full">
              <div className="max-w-[58rem]">
                {showcaseItems.map((item, index) => {
                  const active = index === activeShowcaseIndex;

                  return (
                    <a
                      key={item.slug}
                      href={`/projects/rendering/${item.slug}`}
                      onMouseEnter={() => setActiveShowcaseIndex(index)}
                      onFocus={() => setActiveShowcaseIndex(index)}
                      className={`group block w-fit transition-colors ${
                        active ? "text-white" : "text-white/58 hover:text-white"
                      }`}
                    >
                      <span className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-sans text-[clamp(1.8rem,4vw,4.15rem)] font-medium leading-[0.94] tracking-[-0.064em]">
                          {item.title}
                        </span>
                        {item.year ? (
                          <span className="font-sans text-[clamp(0.8rem,1.4vw,1.05rem)] font-semibold leading-none tracking-[0.04em] text-white/70">
                            {item.year}
                          </span>
                        ) : null}
                      </span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end text-white/64">
                <a
                  href="#rendering"
                  className="inline-flex w-fit items-center gap-3 font-sans text-sm font-medium uppercase tracking-[0.12em] text-white/72 transition-colors hover:text-white"
                >
                  Scroll
                  <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {allRenderingItems.length > 0 && (
        <section id="rendering" className="scroll-mt-24 px-[clamp(1.5rem,5vw,6rem)] py-16 md:py-20">
          <div className="mx-auto max-w-[96rem]">
            <div className="border-t border-white/14 pt-5">
              <div>
                <h1 className="max-w-[12ch] font-sans text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.86] tracking-[-0.074em] text-white">
                  Rendering
                </h1>
                <p className="mt-6 max-w-[42rem] text-[1rem] leading-7 tracking-[-0.015em] text-white/62 md:text-[1.08rem]">
                  Concept images, scenic studies, and production visualizations used to test
                  atmosphere, scale, color, and story before the work reaches the stage.
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-14 md:space-y-16">
              {allRenderingItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/rendering/${item.slug}`}
                  className="group grid gap-5 border-t border-white/12 pt-5 md:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.55fr)] md:items-start"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-white/[0.02]">
                    {item.imageUrl ? (
                      <ProgressiveImage
                        src={item.imageUrl}
                        alt={item.altText}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/42">
                        Image unavailable
                      </div>
                    )}
                  </div>
                  <div className="md:pt-1">
                    <p className="text-[0.82rem] uppercase tracking-[0.18em] text-white/42">
                      {[item.client, item.year].filter(Boolean).join(" · ")}
                    </p>
                    <h3 className="mt-4 font-sans text-[clamp(1.8rem,3vw,3.35rem)] font-normal leading-[0.94] tracking-[-0.06em] text-white transition-colors group-hover:text-white/76">
                      {item.title}
                    </h3>
                    {item.excerpt ? (
                      <p className="mt-5 max-w-[30rem] text-[0.98rem] leading-7 tracking-[-0.02em] text-white/62">
                        {item.excerpt}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedRenderingArticles.length > 0 ? (
        <section className="border-t border-white/12 px-[clamp(1.5rem,5vw,6rem)] py-16 md:py-20">
          <div className="mx-auto max-w-[96rem]">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                Rendering Notes
              </p>
              <h2 className="font-sans text-[clamp(2rem,4vw,4rem)] font-normal leading-[0.92] tracking-[-0.065em] text-white">
                Process writing and Vectorworks rendering workflow.
              </h2>
            </div>
            <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
              {relatedRenderingArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/studio/tutorials/${article.slug}`}
                  className="group block border-t border-white/12 pt-5"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-white/[0.02]">
                    <ProgressiveImage
                      src={article.coverImageUrl}
                      alt={article.coverImageAlt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="pt-4">
                    <p className="text-[0.78rem] uppercase tracking-[0.18em] text-white/42">
                      {article.series?.name || article.categoryName}
                    </p>
                    <h3 className="mt-3 font-sans text-[1.32rem] font-normal leading-[1.02] tracking-[-0.04em] text-white transition-colors group-hover:text-white/72">
                      {article.title}
                    </h3>
                    <p className="mt-4 text-[0.94rem] leading-6 tracking-[-0.01em] text-white/56">
                      {article.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[0.9rem] tracking-[-0.015em] text-white/68 transition-colors group-hover:text-white">
                      Read tutorial
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </div>
  );
}
