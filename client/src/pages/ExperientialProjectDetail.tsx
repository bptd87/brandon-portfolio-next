"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { Link } from "wouter";
import { Check, Link2, Linkedin, Mail } from "lucide-react";

import DeferredYouTubeEmbed from "@/components/DeferredYouTubeEmbed";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MotionReveal from "@/components/MotionReveal";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { copyTextToClipboard } from "@/lib/clipboard";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  HOME_REFERENCE_BLACK,
  useHomeTheme,
} from "@/lib/homeTheme";
import {
  getLocalExperientialMediaItems,
  getLocalExperientialProjectBySlug,
  getLocalExperientialProjectHref,
  getLocalExperientialProjects,
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

function getYoutubeId(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return url.split("/").pop() || "";
  }
}

function getYoutubePosterUrl(url: string) {
  const videoId = getYoutubeId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : "";
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

function getProjectTimestamp(project: LocalExperientialProject) {
  if (project.updatedAt) {
    const timestamp = new Date(project.updatedAt).getTime();
    if (!Number.isNaN(timestamp)) return timestamp;
  }

  if (project.year) return new Date(project.year, 6, 1).getTime();
  return 0;
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
              <div className="overflow-hidden rounded-[1.35rem] shadow-[0_1.4rem_4rem_rgba(0,0,0,0.16)]">
                <DeferredYouTubeEmbed
                  videoId={getYoutubeId(tile.videoUrl)}
                  title={tile.title}
                  className="overflow-hidden rounded-[1.35rem]"
                  playbackMode="dialog"
                  showLabel={false}
                />
              </div>
            </div>
          );
        }

        imageIndex += 1;
        const currentImageIndex = imageIndex;
        const blockClass = getExperientialMediaBlockClass(currentImageIndex, imageCount);
        const isFullWidth = blockClass.includes("md:col-span-12");
        const objectClass = tile.category === "technical-drawing" ? "object-contain" : "object-cover";

        return (
          <figure key={tile.key} className={blockClass}>
            <button
              type="button"
              onClick={() => onOpenImage(tile.key)}
              className={`block w-full overflow-hidden rounded-[1.35rem] text-left shadow-[0_1.4rem_4rem_rgba(0,0,0,0.16)] focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-black/40 ${getExperientialMediaAspectClass(tile.category, isFullWidth)}`}
            >
              <div className="h-full w-full overflow-hidden bg-black">
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
  const [linkCopied, setLinkCopied] = useState(false);
  const lightboxScrollRef = useRef<HTMLDivElement | null>(null);

  const allProjects = getLocalExperientialProjects();
  const galleryImages = useMemo(() => (project ? buildProjectGalleryImages(project) : []), [project]);
  const imageIndexByKey = useMemo(
    () => new Map(galleryImages.map((image, index) => [image.key, index])),
    [galleryImages]
  );
  const moreExperientialProjects = useMemo(() => {
    if (!project) return [];

    return allProjects
      .filter((item) => item.slug !== project.slug)
      .sort((a, b) => {
        const timeCompare = getProjectTimestamp(b) - getProjectTimestamp(a);
        if (timeCompare !== 0) return timeCompare;
        return a.title.localeCompare(b.title);
      })
      .slice(0, 6);
  }, [allProjects, project]);

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
  const encodedProjectTitle = encodeURIComponent(project.title);
  const encodedProjectUrl = encodeURIComponent(projectUrl);
  const emailShareUrl = `mailto:?subject=${encodedProjectTitle}&body=${encodedProjectTitle}%0A%0A${encodedProjectUrl}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedProjectUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedProjectUrl}`;
  const selectedLightboxImage = lightboxIndex === null ? null : galleryImages[lightboxIndex] || null;
  const projectDateLabel = project.year ? `${project.year}` : null;
  const mediaTypeLabel = project.mediaTypes.map((category) => MEDIA_LABELS[category]).join(" · ");
  const portfolioNoteSections = project.sections.length
    ? project.sections
    : [{ heading: "Project Note", paragraphs: [project.summary] }];
  const narrativeParagraphs = portfolioNoteSections.flatMap((section) => section.paragraphs);
  const heroImageUrl = galleryImages[0]?.imageUrl || project.coverImageUrl || "";
  const openImageByKey = (key: string) => {
    const nextIndex = imageIndexByKey.get(key);
    if (nextIndex === undefined) return;
    setLightboxIndex(nextIndex);
  };
  const handleCopyLink = async () => {
    const copied = await copyTextToClipboard(projectUrl);
    if (copied) {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } else {
      setLinkCopied(false);
    }
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

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={
        {
          "--background": homeTheme.bg,
          "--foreground": homeTheme.ink,
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
      <Header />

      <main className="relative z-10" style={{ backgroundColor: homeTheme.bg }}>
        <section
          className="flex min-h-[100svh] items-center justify-center"
          style={
            {
              "--project-hero-pad": "clamp(2rem, 5vw, 5rem)",
              backgroundColor: homeTheme.bg,
              padding: "var(--project-hero-pad)",
            } as CSSProperties
          }
        >
          <div
            className="relative mx-auto flex w-full max-w-[88rem] overflow-hidden rounded-[1.75rem] shadow-[0_1.6rem_5rem_rgba(0,0,0,0.2)]"
            style={{
              minHeight: "calc(100svh - var(--project-hero-pad) - var(--project-hero-pad))",
            }}
          >
            {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt={project.coverAltText || `${project.title} hero image`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/34 to-black/10" />
            <header className="relative z-10 mt-auto grid w-full gap-[clamp(2rem,5vw,5rem)] px-[clamp(1.35rem,4vw,4rem)] pb-[clamp(2.5rem,7vh,5rem)] pt-[clamp(9rem,24vh,16rem)] lg:grid-cols-[minmax(0,0.62fr)_minmax(18rem,0.38fr)] lg:items-center">
              <MotionReveal eager>
                <div>
                  <h1
                    className="max-w-[11ch] text-[clamp(3rem,6.4vw,7rem)] font-black uppercase leading-[0.86] tracking-[0] text-white"
                    style={{ fontFamily: HOME_DISPLAY_FONT }}
                  >
                    {project.title}
                  </h1>
                </div>
              </MotionReveal>

              <MotionReveal eager delay={140}>
                <div className="max-w-[30rem] pt-5 lg:justify-self-end">
                  <p className="max-w-[31rem] text-[clamp(1rem,1.25vw,1.24rem)] font-normal leading-[1.52] tracking-[-0.025em] text-white/70">
                    {project.heroSummary || project.summary}
                  </p>
                  <nav aria-label="Share this project" className="mt-6 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      aria-label={linkCopied ? "Project link copied" : "Copy project link"}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/62 transition-colors hover:bg-white/[0.08] hover:text-white"
                    >
                      {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                    </button>
                    <a
                      href={emailShareUrl}
                      aria-label="Share project by email"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/62 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                    <a
                      href={linkedInShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share project on LinkedIn"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/62 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                      href={facebookShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share project on Facebook"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[1rem] font-semibold leading-none text-white/62 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                    >
                      f
                    </a>
                  </nav>
                </div>
              </MotionReveal>
            </header>
          </div>
        </section>

        <section
          className="px-[clamp(1.5rem,7vw,8rem)]"
          style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}
        >
          <MotionReveal>
            <div
              className="mx-auto flex w-full max-w-[86rem] items-center justify-between gap-5 py-4 text-[0.92rem] font-black uppercase tracking-[0.04em]"
              style={{ color: homeTheme.muted, fontFamily: HOME_DISPLAY_FONT }}
            >
              <span className="min-w-0 truncate text-left">
                {mediaTypeLabel || "Experiential Design"}
              </span>
              {projectDateLabel ? <span className="shrink-0 text-right">{projectDateLabel}</span> : null}
            </div>
          </MotionReveal>

          <MotionReveal delay={80}>
            <div className="mx-auto grid w-full max-w-[86rem] gap-x-[clamp(2.5rem,5vw,5rem)] gap-y-10 py-8 text-[0.92rem] leading-[1.38] tracking-[-0.018em] md:grid-cols-[minmax(20rem,0.92fr)_minmax(15rem,0.5fr)] md:py-10">
              <div className="max-w-[38rem] space-y-5 text-left hyphens-auto [text-wrap:pretty] md:max-w-none md:space-y-4 md:text-justify">
                <p className="text-left">
                  <span
                    className="text-[0.96rem] font-black uppercase tracking-[0.04em]"
                    style={{ fontFamily: HOME_DISPLAY_FONT }}
                  >
                    Description
                  </span>
                </p>
                {narrativeParagraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>

              <dl className="space-y-2.5">
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
                  <dt style={{ color: homeTheme.muted }}>Role</dt>
                  <dd>Experiential designer / artist</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
                  <dt style={{ color: homeTheme.muted }}>Media</dt>
                  <dd>{mediaTypeLabel || "Project"}</dd>
                </div>
                {projectDateLabel ? (
                  <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
                    <dt style={{ color: homeTheme.muted }}>Year</dt>
                    <dd>{projectDateLabel}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </MotionReveal>
        </section>

        <section
          className="[contain-intrinsic-size:1px_1800px] [content-visibility:auto]"
          style={{ backgroundColor: homeTheme.bg }}
        >
          <div className="mx-auto w-full max-w-[86rem] px-[clamp(1.5rem,5vw,5.5rem)] py-[clamp(2rem,5vw,4rem)]">
            <ProjectMediaBlock samples={project.samples} onOpenImage={openImageByKey} />
          </div>
        </section>

        {moreExperientialProjects.length > 0 ? (
          <section
            className="pt-16 [contain-intrinsic-size:1px_960px] [content-visibility:auto] md:pt-24"
            style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}
          >
            <div className="px-[clamp(1.5rem,5vw,6rem)] pb-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <h2
                  className="max-w-[14ch] text-[clamp(2.6rem,5.2vw,5.4rem)] font-black uppercase leading-[0.86] tracking-[0]"
                  style={{ color: homeTheme.ink, fontFamily: HOME_DISPLAY_FONT }}
                >
                  More experiential.
                </h2>
                <Link
                  href="/projects/experiential"
                  className="inline-flex h-11 w-fit items-center justify-center rounded-full px-5 text-[0.82rem] font-black uppercase tracking-[0.04em] transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: homeTheme.controlBg,
                    color: homeTheme.controlInk,
                    fontFamily: HOME_DISPLAY_FONT,
                  }}
                >
                  Experiential index
                </Link>
              </div>
            </div>

            <div className="mx-auto grid w-full max-w-[86rem] grid-cols-1 gap-[clamp(1rem,2vw,1.5rem)] px-[clamp(1.5rem,5vw,6rem)] pb-[clamp(4rem,7vw,7rem)] md:grid-cols-4">
              {moreExperientialProjects.map((item, index) => {
                const previewImageUrl =
                  item.coverImageUrl || (item.coverVideoUrl ? getYoutubePosterUrl(item.coverVideoUrl) : "");

                return (
                  <MotionReveal
                    key={item.slug}
                    className={index % 6 < 2 ? "md:col-span-2" : ""}
                    delay={(index % 4) * 80}
                  >
                    <Link
                      href={getLocalExperientialProjectHref(item)}
                      className="group block h-full text-current no-underline"
                      aria-label={`Experiential design project: ${item.title}`}
                    >
                      <article className="h-full">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] shadow-[0_1.2rem_3.6rem_rgba(0,0,0,0.14)]">
                          {previewImageUrl ? (
                            <img
                              src={previewImageUrl}
                              alt={`${item.title} experiential design preview image`}
                              className="site-media-square block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : null}
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/64 via-black/24 to-transparent px-5 pb-5 pt-16 text-white">
                            <h3
                              className="max-w-[18ch] text-[clamp(1.25rem,2vw,2.1rem)] font-black uppercase leading-[0.9] tracking-[0]"
                              style={{ fontFamily: HOME_DISPLAY_FONT }}
                            >
                              {item.title}
                            </h3>
                            <p className="mt-2 max-w-[20ch] text-[0.94rem] font-medium leading-tight tracking-[-0.025em] text-white/72">
                              {[item.mediaTypes.map((category) => MEDIA_LABELS[category]).join(" / "), item.year]
                                .filter(Boolean)
                                .join("  ")}
                            </p>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </MotionReveal>
                );
              })}
            </div>
          </section>
        ) : null}
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
            className="absolute right-[clamp(1rem,2.6vw,2rem)] top-[clamp(1rem,2.6vw,2rem)] z-[102] inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/10 text-[1.45rem] font-normal leading-none text-black transition hover:bg-black/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close project image gallery"
          >
            ×
          </button>
          <div
            className="relative h-full w-full overflow-hidden rounded-[1.65rem] bg-white shadow-[0_2rem_6rem_rgba(0,0,0,0.28)]"
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
                      className="max-h-full w-auto max-w-full rounded-[1.1rem] object-contain"
                      draggable={false}
                    />
                  </div>
                  {item.caption || item.altText ? (
                    <figcaption
                      className="mt-4 max-w-[38rem] text-center text-[0.82rem] font-medium leading-snug tracking-[-0.015em]"
                      style={{ color: HOME_REFERENCE_BLACK, fontFamily: HOME_BODY_FONT }}
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

      <Footer />
    </div>
  );
}
