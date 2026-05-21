"use client";

import { useRef, useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getLocalArticles } from "@shared/localArticles";
import { getLocalRenderingGallery, getLocalRenderingProjects } from "@shared/localPortfolios";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Layers3,
  Lightbulb,
} from "lucide-react";

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
    .slice(0, 8);
  const articleCardsRef = useRef<HTMLDivElement | null>(null);
  const scrollArticleCards = (direction: "previous" | "next") => {
    articleCardsRef.current?.scrollBy({
      left: direction === "next" ? 760 : -760,
      behavior: "smooth",
    });
  };
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

      <main>
        <section className="border-b border-white/10 bg-black pb-8 pt-24 md:pb-10 md:pt-28">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <div className="max-w-5xl">
              <p className="mb-5 text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-none tracking-[-0.035em] text-white/46">
                Rendering portfolio
              </p>
              <h1 className="font-sans text-[clamp(3.2rem,7vw,7.1rem)] font-medium leading-[0.86] tracking-[-0.065em] text-white">
                Visual studies for scenic space.
              </h1>
              <p className="mt-7 max-w-3xl text-[1.02rem] leading-7 text-white/62 md:text-[1.12rem]">
                Concept images, scenic studies, and production visualizations used to test
                atmosphere, scale, color, and story before the work reaches the stage.
              </p>
            </div>
          </div>
        </section>

        {allRenderingItems.length > 0 && (
          <section id="rendering" className="scroll-mt-24 bg-[#111111] py-4 md:py-5">
            <div className="grid w-full gap-4 px-[clamp(1rem,2vw,1.75rem)] md:grid-cols-2">
              {allRenderingItems.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/projects/rendering/${item.slug}`}
                  className={`group block ${index % 3 === 0 ? "md:col-span-2" : ""}`}
                >
                  <article className="bg-[#111111]">
                    <div className="site-media-square relative aspect-[3/2] overflow-hidden bg-[#181818]">
                      {item.imageUrl ? (
                        <ProgressiveImage
                          src={item.imageUrl}
                          alt={item.altText}
                          aspectRatio="3 / 2"
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
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/84 via-black/34 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-[clamp(1.15rem,2.2vw,2rem)]">
                        <h2 className="max-w-[14ch] font-sans text-[clamp(1.55rem,2.4vw,2.9rem)] font-medium leading-[0.96] tracking-[-0.06em] text-white transition-colors group-hover:text-white/80">
                          {item.title}
                        </h2>
                        {[item.client, item.year].filter(Boolean).length > 0 ? (
                          <p className="mt-2 text-[clamp(0.9rem,1.05vw,1.08rem)] leading-tight tracking-[-0.025em] text-white/72">
                            {[item.client, item.year].filter(Boolean).join(" / ")}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="border-t border-white/12 bg-[#111111] py-18 md:py-24">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.72fr)] lg:items-start">
            <div className="space-y-5">
              <p className="text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-none tracking-[-0.035em] text-white/46">
                Rendering notes
              </p>
              <h2 className="max-w-3xl font-sans text-[clamp(2.4rem,5vw,5.2rem)] font-medium leading-[0.88] tracking-[-0.075em] text-white">
                Images that make the next conversation clearer.
              </h2>
              <p className="max-w-3xl text-[1.05rem] leading-7 text-white/68 md:text-[1.15rem] md:leading-8">
                These renderings are working images: fast enough to support iteration, detailed
                enough to communicate atmosphere, and specific enough to help collaborators see
                the room before it exists.
              </p>
              <p className="max-w-3xl text-[1.05rem] leading-7 text-white/54 md:text-[1.15rem] md:leading-8">
                The portfolio includes concept work, scenic visualization, Vectorworks studies,
                and atmospheric images that connect research, drafting, light, material, and
                storytelling.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                {
                  icon: Lightbulb,
                  title: "Atmosphere",
                  copy: "Light, color, and mood studies that clarify the emotional temperature of a design.",
                },
                {
                  icon: Layers3,
                  title: "Spatial intent",
                  copy: "Images that test scale, composition, depth, and how the stage picture reads from the house.",
                },
                {
                  icon: Box,
                  title: "Production alignment",
                  copy: "Renderings built to support conversations with directors, shops, students, and collaborators.",
                },
              ].map(({ icon: Icon, title, copy }) => (
                <div
                  key={title}
                  className="rounded-[1.5rem] bg-black p-6 text-white shadow-[0_18px_54px_rgba(0,0,0,0.28)] ring-1 ring-white/[0.07]"
                >
                  <Icon className="mb-8 h-7 w-7 text-white/82" strokeWidth={1.8} aria-hidden="true" />
                  <h3 className="max-w-[14ch] font-sans text-[1.55rem] font-medium leading-[0.96] tracking-[-0.055em] text-white">
                    {title}
                  </h3>
                  <p className="mt-4 max-w-md text-[0.98rem] leading-6 text-white/58">
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
          </div>
        </section>

        {relatedRenderingArticles.length > 0 ? (
          <section className="border-t border-white/12 bg-[#111111] py-16 md:py-24">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-none tracking-[-0.035em] text-white/46">
                  Rendering tutorials
                </p>
                <h2 className="mt-3 max-w-[13ch] bg-gradient-to-r from-[#2f6dff] via-[#9d4edd] to-[#d6a8ff] bg-clip-text font-sans text-[clamp(2.4rem,5.2vw,5.4rem)] font-medium leading-[0.9] tracking-[-0.075em] text-transparent">
                  Process notes from the studio.
                </h2>
              </div>
              <a
                href="/studio/tutorials"
                className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-[#9d4edd]/72 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-[#e0aaff] transition-colors hover:border-[#c77dff] hover:text-white"
              >
                View tutorials
              </a>
            </div>
          </div>

          <div
            ref={articleCardsRef}
            className="overflow-x-auto px-[clamp(1.5rem,5vw,6rem)] pb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex min-w-max gap-5 pr-[clamp(1.5rem,5vw,6rem)]">
              {relatedRenderingArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/studio/tutorials/${article.slug}`}
                  className="group relative flex h-[30rem] w-[min(21rem,78vw)] flex-col justify-end overflow-hidden rounded-[2rem] bg-black p-6 text-white shadow-[0_20px_58px_rgba(0,0,0,0.32)] ring-1 ring-white/[0.06] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_26px_68px_rgba(0,0,0,0.4)] md:w-[22rem]"
                >
                  <ProgressiveImage
                    src={article.coverImageUrl}
                    alt={article.coverImageAlt}
                    className="site-media-square absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-black/18" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/88 via-black/48 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/28 to-transparent" />

                  <div className="relative z-10">
                    <p className="font-sans text-[0.74rem] font-semibold tracking-[-0.015em] text-white/68">
                      {article.series?.name || article.categoryName || "Tutorial"}
                    </p>
                    <h3 className="mt-3 max-w-[13ch] font-sans text-[1.64rem] font-medium leading-[0.98] tracking-[-0.055em] text-white">
                      {article.title}
                    </h3>
                    <p className="mt-4 max-w-[18rem] text-[0.94rem] leading-6 tracking-[-0.012em] text-white/68">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 px-[clamp(1.5rem,5vw,6rem)]">
            <button
              type="button"
              onClick={() => scrollArticleCards("previous")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-white/62 transition-colors hover:bg-white hover:text-black"
              aria-label="Previous rendering tutorials"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollArticleCards("next")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-white/72 transition-colors hover:bg-white hover:text-black"
              aria-label="Next rendering tutorials"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
