"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { Link } from "wouter";

import DeferredYouTubeEmbed from "@/components/DeferredYouTubeEmbed";
import Header from "@/components/Header";
import MotionReveal from "@/components/MotionReveal";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeTheme,
} from "@/lib/homeTheme";
import {
  getLocalExperientialMediaItems,
  getLocalExperientialProjectBySlug,
  type LocalExperientialCategory,
  type LocalExperientialProject,
  type LocalExperientialSample,
} from "@shared/localPortfolios";

type ExperientialProjectDetailProps = {
  slug?: string;
  currentPath?: string;
  params?: {
    slug?: string;
  };
};

type ProjectGalleryImage = {
  key: string;
  imageUrl: string;
  altText: string;
  caption: string;
};

const MEDIA_LABELS: Record<LocalExperientialCategory, string> = {
  rendering: "Rendering",
  "technical-drawing": "Technical Drawing",
  "live-events": "Finished Work",
};

const DESCRIPTION_MEDIA_LABELS: Record<LocalExperientialCategory, string> = {
  rendering: "Rendering",
  "technical-drawing": "Technical Drafting",
  "live-events": "Finished Work",
};

const DESCRIPTION_HIGHLIGHT_TERMS = [
  "Rendering",
  "Renderings",
  "Technical Drafting",
  "Technical Drawing",
  "Technical Drawings",
  "Drafting",
  "Finished Work",
  "Live Event",
  "Live Events",
  "Experiential Design",
  "Brand Activation",
  "Brand Activations",
  "Environmental Graphic",
  "Environmental Graphics",
  "Mixed Media",
  "Large Scale Prints",
  "Commercial Rendering",
  "3D Rendering",
  "First Bank",
  "Toyota",
  "Toyota Gold Cup",
  "Concord",
  "Park and Shop",
  "Brompton",
  "Woody Creek Distillery",
  "RAB",
  "Red Line Cafe",
  "The Industrial",
  "UTEP",
];

function getYoutubeId(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return url.split("/").pop() || "";
  }
}

function escapeHighlightTerm(term: string) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildDescriptionHighlightTerms(project: LocalExperientialProject) {
  const terms = new Set(DESCRIPTION_HIGHLIGHT_TERMS);
  terms.add(project.title);
  project.samples.forEach((sample) => {
    terms.add(sample.displayTitle);
  });

  return [...terms]
    .map((term) => term.trim())
    .filter((term) => term.length > 2)
    .sort((a, b) => b.length - a.length);
}

function renderHighlightedDescriptionText(text: string, highlightTerms: string[]) {
  if (!highlightTerms.length) return text;

  const highlightPattern = new RegExp(`(${highlightTerms.map(escapeHighlightTerm).join("|")})`, "gi");
  const highlightLookup = new Set(highlightTerms.map((term) => term.toLowerCase()));

  return text.split(highlightPattern).map((part, index) => {
    if (highlightLookup.has(part.toLowerCase())) {
      return (
        <strong key={`${part}-${index}`} className="font-black">
          {part}
        </strong>
      );
    }

    return part;
  });
}

function joinDescriptionKeywords(keywords: string[]) {
  if (keywords.length <= 1) return keywords[0] || "";
  if (keywords.length === 2) return `${keywords[0]} and ${keywords[1]}`;
  return `${keywords.slice(0, -1).join(", ")}, and ${keywords[keywords.length - 1]}`;
}

function buildMinimalProjectDescription(project: LocalExperientialProject) {
  const summary = project.heroSummary || project.summary;
  const mediaKeywords = project.mediaTypes.map((category) => DESCRIPTION_MEDIA_LABELS[category]);
  const keywordPrefix = joinDescriptionKeywords(mediaKeywords);

  if (!keywordPrefix) return summary;

  const lowerSummary = summary.toLowerCase();
  const alreadyIncludesKeyword = mediaKeywords.some((keyword) =>
    lowerSummary.includes(keyword.toLowerCase())
  );

  if (alreadyIncludesKeyword) return summary;

  return `${keywordPrefix} for ${project.title}. ${summary}`;
}

function buildProjectGalleryImages(project: LocalExperientialProject): ProjectGalleryImage[] {
  return project.samples.flatMap((sample) =>
    getLocalExperientialMediaItems(sample).map((image, index) => ({
      key: `${sample.id}-${index}`,
      imageUrl: image.imageUrl,
      altText: image.altText,
      caption: image.caption,
    }))
  );
}

function getExperientialMediaAspectClass(category: LocalExperientialCategory, isFullWidth: boolean) {
  if (category === "technical-drawing") return "aspect-[3/2]";
  return isFullWidth ? "aspect-[16/9]" : "aspect-[3/2]";
}

function getExperientialMediaBlockClass(imageIndex: number, imageCount: number) {
  if (imageCount <= 2 || imageIndex === 0) return "md:col-span-12";

  const afterLeadCount = imageCount - 1;
  if (afterLeadCount % 2 === 1 && imageIndex === imageCount - 1) return "md:col-span-12";
  return "md:col-span-6";
}

type ProjectMediaTile =
  | {
      type: "video";
      key: string;
      videoUrl: string;
      title: string;
    }
  | {
      type: "image";
      key: string;
      imageUrl: string;
      altText: string;
      category: LocalExperientialCategory;
    };

function buildProjectMediaTiles(samples: LocalExperientialSample[]): ProjectMediaTile[] {
  const imageBuckets: ProjectMediaTile[][] = [];
  const videoTiles: ProjectMediaTile[] = [];

  samples.forEach((sample) => {
    const mediaItems = getLocalExperientialMediaItems(sample);
    const indexedMediaItems = mediaItems.map((image, index) => ({ image, index }));
    const imageItems =
      sample.videoUrl && sample.category === "live-events"
        ? indexedMediaItems.filter((item) => item.image.source === "attached")
        : indexedMediaItems;

    const imageTiles: ProjectMediaTile[] = imageItems.map(({ image, index }) => ({
      type: "image",
      key: `${sample.id}-${index}`,
      imageUrl: image.imageUrl,
      altText: image.altText,
      category: sample.category,
    }));

    if (imageTiles.length) imageBuckets.push(imageTiles);

    if (sample.videoUrl) {
      videoTiles.push({
        type: "video",
        key: `${sample.id}-video`,
        videoUrl: sample.videoUrl,
        title: sample.displayTitle,
      });
    }
  });

  const imageTiles: ProjectMediaTile[] = [];
  const maxBucketLength = Math.max(0, ...imageBuckets.map((bucket) => bucket.length));
  for (let index = 0; index < maxBucketLength; index += 1) {
    imageBuckets.forEach((bucket) => {
      const tile = bucket[index];
      if (tile) imageTiles.push(tile);
    });
  }

  return [...imageTiles, ...videoTiles];
}

function ProjectMediaBlock({
  samples,
  onOpenImage,
}: {
  samples: LocalExperientialSample[];
  onOpenImage: (key: string) => void;
}) {
  const tiles = buildProjectMediaTiles(samples);
  const imageCount = tiles.filter((tile) => tile.type === "image").length;
  let imageIndex = -1;

  if (tiles.length === 0) return null;

  return (
    <div className="grid w-full grid-flow-dense grid-cols-1 gap-[clamp(1rem,2vw,1.6rem)] md:grid-cols-12">
      {tiles.map((tile) => {
        if (tile.type === "video") {
          return (
            <div key={tile.key} className="md:col-span-12">
              <div className="overflow-hidden rounded-[1.15rem] shadow-[0_1.4rem_4rem_rgba(0,0,0,0.16)]">
                <DeferredYouTubeEmbed
                  videoId={getYoutubeId(tile.videoUrl)}
                  title={tile.title}
                  className="overflow-hidden"
                  playbackMode="dialog"
                  showLabel={false}
                  squareFrame
                />
              </div>
            </div>
          );
        }

        imageIndex += 1;
        const currentImageIndex = imageIndex;
        const blockClass = getExperientialMediaBlockClass(currentImageIndex, imageCount);
        const isFullWidth = blockClass.includes("md:col-span-12");
        const isTechnicalDrawing = tile.category === "technical-drawing";
        const objectClass = isTechnicalDrawing ? "object-contain" : "object-cover";
        const frameClass = isTechnicalDrawing ? "bg-white p-[clamp(0.35rem,0.8vw,0.7rem)]" : "bg-black";

        return (
          <figure key={tile.key} className={blockClass}>
            <button
              type="button"
              onClick={() => onOpenImage(tile.key)}
              className={`block w-full overflow-hidden rounded-[1.15rem] text-left shadow-[0_1.4rem_4rem_rgba(0,0,0,0.16)] focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-black/40 ${getExperientialMediaAspectClass(tile.category, isFullWidth)}`}
            >
              <div className={`h-full w-full overflow-hidden ${frameClass}`}>
                <img
                  src={tile.imageUrl}
                  alt={tile.altText}
                  className={`block h-full w-full transition-opacity duration-500 hover:opacity-90 ${objectClass}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </button>
          </figure>
        );
      })}
    </div>
  );
}

export default function ExperientialProjectDetail({
  slug: slugProp,
  currentPath,
  params,
}: ExperientialProjectDetailProps = {}) {
  const { homeTheme } = useHomeTheme();
  const pathname = usePathname();
  const resolvedPath =
    currentPath ||
    pathname ||
    "/projects/experiential";
  const normalizedSlug = String(
    slugProp ||
      params?.slug ||
      pathname?.split("/").filter(Boolean).pop() ||
      ""
  )
    .trim()
    .toLowerCase();
  const project = getLocalExperientialProjectBySlug(normalizedSlug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxScrollRef = useRef<HTMLDivElement | null>(null);

  const galleryImages = useMemo(() => (project ? buildProjectGalleryImages(project) : []), [project]);
  const imageIndexByKey = useMemo(
    () => new Map(galleryImages.map((image, index) => [image.key, index])),
    [galleryImages]
  );

  if (!project) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink, fontFamily: HOME_BODY_FONT }}
      >
        <Header />
        <div className="container flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="text-center">
            <h1
              className="mb-4 text-4xl font-black uppercase tracking-[0]"
              style={{ fontFamily: HOME_DISPLAY_FONT }}
            >
              Project Not Found
            </h1>
            <Link
              href="/projects/experiential"
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.04em] transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: homeTheme.controlBg,
                color: homeTheme.controlInk,
                fontFamily: HOME_DISPLAY_FONT,
              }}
            >
              Back to Experiential
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const projectUrl = `https://www.brandonptdavis.com${resolvedPath}`;
  const selectedLightboxImage = lightboxIndex === null ? null : galleryImages[lightboxIndex] || null;
  const descriptionHighlightTerms = buildDescriptionHighlightTerms(project);
  const minimalProjectDescription = buildMinimalProjectDescription(project);
  const openImageByKey = (key: string) => {
    const nextIndex = imageIndexByKey.get(key);
    if (nextIndex === undefined) return;
    setLightboxIndex(nextIndex);
  };

  useEffect(() => {
    if (!selectedLightboxImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
    };

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedLightboxImage]);

  useEffect(() => {
    if (!selectedLightboxImage || lightboxIndex === null) return;

    window.requestAnimationFrame(() => {
      const selectedImage = lightboxScrollRef.current?.querySelector<HTMLElement>(
        `[data-lightbox-index="${lightboxIndex}"]`
      );
      selectedImage?.scrollIntoView({ block: "nearest", inline: "center" });
    });
  }, [selectedLightboxImage, lightboxIndex]);

  useEffect(() => {
    const isQuickView =
      new URLSearchParams(window.location.search).get("quickView") === "1";
    if (!isQuickView) return;

    document.documentElement.classList.add("project-quick-view");

    return () => {
      document.documentElement.classList.remove("project-quick-view");
    };
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={
        {
          "--background": homeTheme.bg,
          "--foreground": homeTheme.ink,
          "--project-page-pad": "clamp(2rem, 5vw, 5rem)",
          "--project-hero-bottom-pad": "clamp(0.75rem, 2vw, 1.5rem)",
          backgroundColor: homeTheme.bg,
          color: homeTheme.ink,
          fontFamily: HOME_BODY_FONT,
        } as CSSProperties
      }
    >
      <SEO
        title={project.seoTitle}
        description={project.seoDescription}
        image={project.coverImageUrl || undefined}
        imageAlt={`${project.title} experiential design cover image`}
        type="website"
        url={projectUrl}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Experiential", url: "https://www.brandonptdavis.com/projects/experiential" },
          { name: project.title, url: projectUrl },
        ]}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: project.title,
          description: project.seoDescription,
          image: project.coverImageUrl || undefined,
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          dateCreated: project.year ? `${project.year}-01-01` : undefined,
          dateModified: project.updatedAt || undefined,
          genre: "Experiential Design",
          keywords: project.mediaTypes.map((category) => MEDIA_LABELS[category]),
          mainEntityOfPage: projectUrl,
          url: projectUrl,
          workExample:
            galleryImages.slice(0, 12).map((image) => ({
              type: "ImageObject" as const,
              contentUrl: image.imageUrl,
              caption: image.caption || undefined,
              name: image.altText || `${project.title} experiential design image`,
              description: image.caption || project.seoDescription,
              thumbnailUrl: image.imageUrl,
            })) || undefined,
          isPartOf: {
            name: "Experiential Design Portfolio",
            url: "https://www.brandonptdavis.com/projects/experiential",
          },
        }}
      />
      <style>
        {`
          .project-quick-view,
          .project-quick-view body {
            scrollbar-width: none;
          }

          .project-quick-view::-webkit-scrollbar,
          .project-quick-view body::-webkit-scrollbar {
            display: none;
            height: 0;
            width: 0;
          }

        `}
      </style>
      <Header />

      <main className="relative z-10 flex flex-col" style={{ backgroundColor: homeTheme.bg }}>
        <section
          className="px-[var(--project-page-pad)] pb-[clamp(1.75rem,4vw,3.5rem)] pt-[clamp(8rem,15vh,11rem)]"
          style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink, order: 1 }}
        >
          <header className="mx-auto max-w-[42rem] text-center">
            <MotionReveal eager>
              <h1
                className="text-[clamp(3rem,6vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[0]"
                style={{ color: homeTheme.ink, fontFamily: HOME_DISPLAY_FONT }}
              >
                {project.title.toUpperCase()}
              </h1>
            </MotionReveal>

            <MotionReveal eager delay={120}>
              <p
                className="mx-auto mt-4 max-w-[34rem] text-[clamp(1rem,1.25vw,1.2rem)] font-medium leading-[1.35] tracking-[-0.025em]"
                style={{ color: homeTheme.muted }}
              >
                {renderHighlightedDescriptionText(minimalProjectDescription, descriptionHighlightTerms)}
              </p>
            </MotionReveal>
          </header>
        </section>

        <section
          className="scroll-mt-28 px-[var(--project-page-pad)] [contain-intrinsic-size:1px_1800px] [content-visibility:auto]"
          style={{ backgroundColor: homeTheme.bg, order: 2 }}
        >
          <div className="mx-auto w-full max-w-[64rem] pb-[clamp(2rem,5vw,4rem)] pt-[clamp(0.75rem,2vw,1.25rem)]">
            <ProjectMediaBlock samples={project.samples} onOpenImage={openImageByKey} />
          </div>
        </section>
      </main>

      {selectedLightboxImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/58 p-[clamp(0.75rem,2vw,1.5rem)] backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Project image"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="absolute right-[clamp(1rem,2.6vw,2rem)] top-[clamp(1rem,2.6vw,2rem)] z-[102] inline-flex h-11 w-11 items-center justify-center rounded-full text-[1.45rem] font-normal leading-none shadow-[0_1rem_2.5rem_rgba(0,0,0,0.18)] transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            style={{
              backgroundColor: homeTheme.controlBg,
              color: homeTheme.controlInk,
            }}
            onClick={() => setLightboxIndex(null)}
            aria-label="Close project image gallery"
          >
            ×
          </button>
          <div
            className="relative h-full w-full overflow-hidden shadow-[0_2rem_6rem_rgba(0,0,0,0.28)]"
            style={{ backgroundColor: homeTheme.bg }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              ref={lightboxScrollRef}
              className="flex h-full snap-x snap-mandatory items-center gap-[clamp(1.25rem,4vw,4rem)] overflow-x-auto overflow-y-hidden px-[clamp(1.5rem,7vw,8rem)] py-[clamp(3.5rem,7vh,6rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {galleryImages.map((item, index) => (
                <figure
                  key={item.key}
                  data-lightbox-index={index}
                  className="flex h-full min-w-[min(82vw,46rem)] snap-center flex-col items-center justify-center"
                >
                  <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.altText}
                      className="max-h-full w-auto max-w-full object-contain"
                      draggable={false}
                    />
                  </div>
                  {item.caption || item.altText ? (
                    <figcaption
                      className="mt-4 max-w-[38rem] text-center text-[0.82rem] font-medium leading-snug tracking-[-0.015em]"
                      style={{ color: homeTheme.ink, fontFamily: HOME_BODY_FONT }}
                    >
                      {item.caption || item.altText}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
