"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionReveal from "@/components/MotionReveal";
import PortfolioTopBar from "@/components/PortfolioTopBar";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import { useIsDesktopViewport } from "@/hooks/useIsDesktopViewport";
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

type RenderingDisplayImage = {
  id: number;
  url: string;
  caption?: string | null;
  altText?: string | null;
};

type RenderingDisplayItem = {
  id: number;
  title: string;
  imageUrl: string | null;
  altText: string;
  slug: string;
  year: number | null;
  client?: string;
  excerpt?: string;
  designNotes?: string;
  images?: RenderingDisplayImage[];
};

const getRenderingImages = (item: RenderingDisplayItem) => {
  const images = [
    item.imageUrl
      ? {
          id: -1,
          url: item.imageUrl,
          caption: null,
          altText: item.altText || item.title,
        }
      : null,
    ...(item.images || []),
  ].filter((image): image is RenderingDisplayImage => Boolean(image?.url));

  return images.filter(
    (image, index, list) => list.findIndex((candidate) => candidate.url === image.url) === index
  );
};

export default function RenderingPortfolio() {
  const isDesktopViewport = useIsDesktopViewport();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const projects = getLocalRenderingProjects().filter((project) => !project.galleryOnly);
  const galleryItems = getLocalRenderingGallery();
  const isLoading = false;

  // 1. Process Gallery Items (for the middle section)
  const galleryDisplayItems: RenderingDisplayItem[] = galleryItems?.map(item => ({
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

  const featuredDisplayItems: RenderingDisplayItem[] = projects?.filter(p => !galleryProjectIds.has(p.id)).map(p => ({
    id: p.id,
    title: p.title,
    imageUrl: p.coverImageUrl || null,
    altText: p.title,
    slug: p.slug,
    year: p.year,
    client: p.client,
    excerpt: p.excerpt,
    designNotes: p.designNotes,
    images: (p.images || []).map(img => ({
      id: img.id,
      url: img.imageUrl || '',
      caption: img.caption,
      altText: img.altText
    }))
  })) || [];

  const allRenderingItems = [...featuredDisplayItems, ...galleryDisplayItems]
    .filter((item) => item.slug && item.imageUrl)
    .filter((item, index, list) => list.findIndex((candidate) => candidate.slug === item.slug) === index);
  const renderingPortfolioImage =
    allRenderingItems[0]?.imageUrl || undefined;
  const eagerRenderingCount = isDesktopViewport ? 3 : 1;
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
  const selectedItem =
    selectedItemIndex === null ? null : allRenderingItems[selectedItemIndex] || null;
  const selectedImages = selectedItem ? getRenderingImages(selectedItem) : [];
  const selectedImage = selectedImages[selectedImageIndex] || selectedImages[0] || null;
  const canMoveImage = selectedImages.length > 1;

  const openRenderingLightbox = (index: number) => {
    setSelectedItemIndex(index);
    setSelectedImageIndex(0);
  };

  const closeRenderingLightbox = () => {
    setSelectedItemIndex(null);
    setSelectedImageIndex(0);
  };

  const showPreviousImage = () => {
    setSelectedImageIndex((current) =>
      current > 0 ? current - 1 : Math.max(selectedImages.length - 1, 0)
    );
  };

  const showNextImage = () => {
    setSelectedImageIndex((current) =>
      selectedImages.length ? (current + 1) % selectedImages.length : 0
    );
  };

  useEffect(() => {
    if (!selectedItem) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRenderingLightbox();
      if (event.key === "ArrowLeft" && canMoveImage) showPreviousImage();
      if (event.key === "ArrowRight" && canMoveImage) showNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem, canMoveImage, selectedImages.length]);

  return (
    <div className="min-h-screen bg-white text-[#111111] [--background:#ffffff] [--border:rgba(17,17,17,0.14)] [--foreground:#111111]">
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
                url: `${RENDERING_PORTFOLIO_URL}#${item.slug}`,
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
        <section className="border-b border-black/10 px-[clamp(1.5rem,5vw,6rem)] py-14 md:py-20">
          <MotionReveal className="mx-auto max-w-[92rem]">
            <div>
              <h1 className="font-sans text-[clamp(3.8rem,9.2vw,10.5rem)] font-medium leading-[0.82] tracking-[-0.09em] text-[#111111]">
                Rendering
              </h1>
              <div className="mt-8 grid gap-5 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-start">
                <p className="max-w-3xl text-[clamp(1.08rem,1.55vw,1.34rem)] font-medium leading-8 tracking-[-0.024em] text-black/62">
                  Concept images and production visualizations used to test
                  atmosphere, scale, color, and intent before the work reaches
                  the stage.
                </p>
              </div>
            </div>
          </MotionReveal>
        </section>

        {allRenderingItems.length > 0 && (
          <section id="rendering" className="scroll-mt-24 py-0">
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {allRenderingItems.map((item, index) => (
                <MotionReveal
                  key={item.id}
                  delay={Math.min(index * 18, 220)}
                >
                  <button
                    type="button"
                    id={item.slug}
                    aria-label={`Open ${item.title} rendering gallery`}
                    onClick={() => openRenderingLightbox(index)}
                    className="group relative block aspect-square w-full overflow-hidden rounded-none border border-white bg-neutral-100 text-left focus:outline-none focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-black/70"
                  >
                    {item.imageUrl ? (
                      <ProgressiveImage
                        src={item.imageUrl}
                        alt={item.altText}
                        aspectRatio="1 / 1"
                        objectFit="cover"
                        containerClassName="h-full w-full"
                        className="h-full w-full object-cover transition duration-700 group-hover:brightness-110"
                        loading={index < eagerRenderingCount ? "eager" : "lazy"}
                        fetchPriority={index < eagerRenderingCount ? "high" : "auto"}
                        sizes="(max-width: 768px) 92vw, 44vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-black/42">
                        Image unavailable
                      </div>
                    )}
                  </button>
                </MotionReveal>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer tone="light" />

      {selectedItem && selectedImage ? (
        <div
          className="fixed inset-0 z-[100] flex bg-black/90 text-white backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedItem.title} rendering gallery`}
          onClick={closeRenderingLightbox}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/78 transition hover:bg-white/18 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-8 md:top-8"
            aria-label="Close rendering gallery"
            onClick={closeRenderingLightbox}
          >
            <X className="h-5 w-5" />
          </button>

          {canMoveImage ? (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 z-30 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/76 transition hover:bg-white/18 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:left-8"
                aria-label="Previous rendering"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 z-30 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/76 transition hover:bg-white/18 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-8"
                aria-label="Next rendering"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}

          <div
            className="flex min-h-0 w-full flex-col items-center justify-center gap-5 px-5 py-16 md:px-20 md:py-12"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex min-h-0 w-full flex-1 items-center justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.altText || selectedItem.title}
                className="max-h-[68vh] max-w-[92vw] object-contain md:max-h-[72vh]"
              />
            </div>

            <div className="w-full max-w-5xl text-center">
              <h2 className="font-sans text-[clamp(1.55rem,3vw,3.2rem)] font-medium leading-[0.92] tracking-[-0.055em]">
                {selectedItem.title}
              </h2>
              {selectedImage.caption ? (
                <p className="mx-auto mt-3 max-w-3xl text-[0.95rem] leading-6 text-white/62">
                  {selectedImage.caption}
                </p>
              ) : null}
              {selectedImages.length > 1 ? (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {selectedImages.map((image, index) => (
                    <button
                      key={`${image.id}-${image.url}`}
                      type="button"
                      aria-label={`Show rendering ${index + 1} of ${selectedImages.length}`}
                      aria-pressed={selectedImageIndex === index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-2.5 w-2.5 border border-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        selectedImageIndex === index ? "bg-white" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
