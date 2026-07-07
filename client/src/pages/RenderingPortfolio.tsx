"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionReveal from "@/components/MotionReveal";
import PortfolioTopBar from "@/components/PortfolioTopBar";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import { useIsDesktopViewport } from "@/hooks/useIsDesktopViewport";
import { HOME_BODY_FONT, HOME_DISPLAY_FONT, useHomeTheme } from "@/lib/homeTheme";
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
  const { homeTheme } = useHomeTheme();
  const isDesktopViewport = useIsDesktopViewport();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const lightboxTrackRef = useRef<HTMLDivElement | null>(null);
  const lightboxScrollFrameRef = useRef<number | null>(null);
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
  const previousImage =
    selectedImages.length > 1
      ? selectedImages[(selectedImageIndex - 1 + selectedImages.length) % selectedImages.length]
      : null;
  const nextImage =
    selectedImages.length > 1
      ? selectedImages[(selectedImageIndex + 1) % selectedImages.length]
      : null;
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

  useEffect(() => {
    if (!selectedItem || !selectedImage) return undefined;

    const frameId = window.requestAnimationFrame(() => {
      const selectedSlide = lightboxTrackRef.current?.querySelector<HTMLElement>(
        `[data-lightbox-index="${selectedImageIndex}"]`
      );

      selectedSlide?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [selectedImageIndex, selectedItem, selectedImage]);

  const syncRenderingIndexFromLightboxScroll = () => {
    if (lightboxScrollFrameRef.current !== null) return;

    lightboxScrollFrameRef.current = window.requestAnimationFrame(() => {
      lightboxScrollFrameRef.current = null;
      const track = lightboxTrackRef.current;
      if (!track) return;

      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      const slides = [...track.querySelectorAll<HTMLElement>("[data-lightbox-index]")];
      const closestSlide = slides.reduce<HTMLElement | null>((closest, slide) => {
        if (!closest) return slide;

        const slideRect = slide.getBoundingClientRect();
        const closestRect = closest.getBoundingClientRect();
        const slideDistance = Math.abs(slideRect.left + slideRect.width / 2 - trackCenter);
        const closestDistance = Math.abs(closestRect.left + closestRect.width / 2 - trackCenter);

        return slideDistance < closestDistance ? slide : closest;
      }, null);

      const closestIndex = Number(closestSlide?.dataset.lightboxIndex);
      if (!Number.isNaN(closestIndex) && closestIndex !== selectedImageIndex) {
        setSelectedImageIndex(closestIndex);
      }
    });
  };

  return (
    <div
      className="min-h-screen [--border:rgba(17,17,17,0.14)]"
      style={{
        "--background": homeTheme.bg,
        "--foreground": homeTheme.ink,
        backgroundColor: homeTheme.bg,
        color: homeTheme.ink,
        fontFamily: HOME_BODY_FONT,
      } as CSSProperties}
    >
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

      <main className="relative z-10" style={{ backgroundColor: homeTheme.bg }}>
        <section className="px-[clamp(2rem,8vw,9rem)] pb-[clamp(3rem,6vw,5rem)] pt-[clamp(8rem,12vw,11rem)] text-center">
          <MotionReveal className="mx-auto max-w-[42rem]">
            <div>
              <h1
                className="mx-auto max-w-[10.5ch] text-balance text-[clamp(3.1rem,7vw,6.8rem)] font-black uppercase leading-[0.84] tracking-[0]"
                style={{
                  color: homeTheme.ink,
                  fontFamily: HOME_DISPLAY_FONT,
                  fontStretch: "condensed",
                }}
              >
                RENDERING
              </h1>
              <p
                className="mx-auto mt-5 max-w-[30rem] text-center text-[clamp(0.98rem,1.2vw,1.12rem)] font-medium leading-7 tracking-[-0.02em]"
                style={{ color: homeTheme.muted }}
              >
                Concept images and production visualizations used to test
                atmosphere, scale, color, and intent before the work reaches
                the stage.
              </p>
            </div>
          </MotionReveal>
        </section>

        {allRenderingItems.length > 0 && (
          <section
            id="rendering"
            className="scroll-mt-24 px-[clamp(1.5rem,7vw,8rem)] pb-[clamp(4rem,8vw,7rem)]"
          >
            <div className="mx-auto grid w-full max-w-[64rem] grid-cols-1 gap-[clamp(2.25rem,5vw,4.25rem)] px-[clamp(1rem,3vw,2rem)] sm:grid-cols-2 lg:grid-cols-3">
              {allRenderingItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  id={item.slug}
                  aria-label={`Open ${item.title} rendering gallery`}
                  onClick={() => openRenderingLightbox(index)}
                  className="portfolio-focus-card group relative block aspect-square w-full overflow-hidden rounded-[0.85rem] bg-neutral-100 text-left shadow-[0_1rem_2.4rem_rgba(0,0,0,0.12)] ring-1 ring-black/5 focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-black/70"
                >
                  {item.imageUrl ? (
                    <ProgressiveImage
                      src={item.imageUrl}
                      alt={item.altText}
                      aspectRatio="1 / 1"
                      objectFit="cover"
                      containerClassName="portfolio-focus-media h-full w-full"
                      className="h-full w-full object-cover"
                      loading={index < eagerRenderingCount ? "eager" : "lazy"}
                      fetchPriority={index < eagerRenderingCount ? "high" : "auto"}
                      sizes="(max-width: 768px) 92vw, 44vw"
                      enableScrollAnimation={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-black/42">
                      Image unavailable
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer tone="light" />

      {selectedItem && selectedImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 backdrop-blur-sm"
          style={{
            backgroundColor: "color-mix(in srgb, var(--foreground) 42%, transparent)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedItem.title} rendering gallery`}
          onClick={closeRenderingLightbox}
        >
          <button
            type="button"
            className="absolute right-5 top-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full shadow-[0_1rem_2.5rem_rgba(0,0,0,0.18)] transition hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 md:right-8 md:top-8"
            style={{
              backgroundColor: homeTheme.controlBg,
              color: homeTheme.controlInk,
            }}
            aria-label="Close rendering gallery"
            onClick={closeRenderingLightbox}
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[1.5rem] py-[clamp(4.5rem,7vw,6rem)]"
            style={{
              backgroundColor: homeTheme.bg,
              color: homeTheme.ink,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              ref={lightboxTrackRef}
              className="flex min-h-0 w-full flex-1 snap-x snap-mandatory items-center gap-[clamp(1rem,4vw,5rem)] overflow-x-auto overscroll-x-contain px-[clamp(1rem,18vw,26rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onScroll={syncRenderingIndexFromLightboxScroll}
              onWheel={(event) => {
                if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
                event.currentTarget.scrollLeft += event.deltaY;
              }}
            >
              {selectedImages.map((image, index) => (
                <div
                  key={`${image.id}-${image.url}`}
                  data-lightbox-index={index}
                  className="grid h-full min-w-[min(78vw,56rem)] snap-center place-items-center"
                >
                  <img
                    src={image.url}
                    alt={image.altText || selectedItem.title}
                    draggable={false}
                    className="max-h-[78vh] max-w-full select-none rounded-[0.8rem] object-contain"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 w-full px-6 text-center">
              <p
                className="mx-auto max-w-[42rem] text-[0.95rem] font-medium leading-6 tracking-[-0.02em]"
                style={{ color: homeTheme.muted }}
              >
                {selectedImage.caption || selectedItem.title}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
