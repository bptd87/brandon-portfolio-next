"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "wouter";
import { Check, ChevronLeft, ChevronRight, Link2, Linkedin, Mail } from "lucide-react";

import DeferredYouTubeEmbed from "@/components/DeferredYouTubeEmbed";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import ScenicRenderingGallery from "@/components/ScenicRenderingGallery";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { copyTextToClipboard } from "@/lib/clipboard";
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
  sampleTitle: string;
  category: LocalExperientialCategory;
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

function getYoutubeBackgroundEmbedUrl(url: string) {
  const videoId = getYoutubeId(url);
  if (!videoId) return "";

  const params = new URLSearchParams({
    autoplay: "1",
    controls: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    loop: "1",
    modestbranding: "1",
    mute: "1",
    playsinline: "1",
    playlist: videoId,
    rel: "0",
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
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
      sampleTitle: sample.displayTitle,
      category: sample.category,
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

function SampleGallery({
  sample,
  onOpenImage,
}: {
  sample: LocalExperientialSample;
  onOpenImage: (key: string) => void;
}) {
  const mediaItems = getLocalExperientialMediaItems(sample);
  if (mediaItems.length === 0 && !sample.videoUrl) return null;

  const galleryItems = mediaItems.map((image, index) => ({
    id: `${sample.id}-${index}`,
    imageUrl: image.imageUrl,
    altText: image.altText,
    caption: image.caption || undefined,
    source: image.source,
  }));
  const displayGalleryItems =
    sample.videoUrl && sample.category === "live-events"
      ? galleryItems.filter((image) => image.source === "attached")
      : galleryItems;
  const nonTechnicalFrameClass = sample.category === "rendering" ? "aspect-[3/2] bg-black" : "aspect-video bg-black";
  const nonTechnicalImageClass = sample.category === "rendering" ? "object-contain" : "object-cover";

  return (
    <div className="space-y-5">
      {sample.videoUrl ? (
        <DeferredYouTubeEmbed
          videoId={getYoutubeId(sample.videoUrl)}
          title={sample.displayTitle}
          className="overflow-hidden rounded-[1.5rem]"
          eagerPoster
          showLabel={false}
        />
      ) : null}

      {sample.category === "technical-drawing" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {displayGalleryItems.map((image) => (
            <figure key={image.id} className="site-media-square bg-transparent">
              <button type="button" onClick={() => onOpenImage(image.id)} className="block w-full text-left">
                <div className="site-media-square flex aspect-[3/2] items-center justify-center overflow-hidden bg-black">
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    style={{ borderRadius: 0 }}
                    className="site-media-square block h-full w-full bg-white object-contain shadow-[0_0_0_1px_rgba(255,255,255,0.16)] transition-opacity duration-500 hover:opacity-90"
                  />
                </div>
              </button>
            </figure>
          ))}
        </div>
      ) : displayGalleryItems.length > 1 ? (
        <ScenicRenderingGallery
          items={displayGalleryItems}
          onOpen={onOpenImage}
          visibleCount={displayGalleryItems.length > 3 ? 4 : 3}
          containItems
        />
      ) : displayGalleryItems[0] ? (
        <figure className="space-y-3">
          <button type="button" onClick={() => onOpenImage(displayGalleryItems[0].id)} className="block w-full text-left">
            <div className={`overflow-hidden rounded-[1.5rem] ${nonTechnicalFrameClass}`}>
              <img
                src={displayGalleryItems[0].imageUrl}
                alt={displayGalleryItems[0].altText}
                className={`block h-full w-full transition-transform duration-500 hover:scale-[1.01] ${nonTechnicalImageClass}`}
              />
            </div>
          </button>
        </figure>
      ) : null}
    </div>
  );
}

function MediaSection({
  category,
  samples,
  onOpenImage,
}: {
  category: LocalExperientialCategory;
  samples: LocalExperientialSample[];
  onOpenImage: (key: string) => void;
}) {
  if (samples.length === 0) return null;

  return (
    <AnimatedSection>
      <div className="grid gap-8 border-t border-white/12 pt-10 md:grid-cols-[minmax(11rem,0.28fr)_minmax(0,1fr)] md:gap-12 md:pt-14">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="mb-4 text-[0.76rem] font-medium uppercase tracking-[0.18em] text-[#c9ff3d]">
            Project media
          </p>
          <h2 className="font-sans text-[clamp(1.85rem,2.7vw,2.8rem)] font-medium leading-[0.92] text-white">
            {MEDIA_LABELS[category]}
          </h2>
        </div>

        <div className="space-y-12 md:space-y-16">
          {samples.map((sample) => (
            <div key={sample.id} className="space-y-5">
              <h3 className="font-sans text-[clamp(1.35rem,2vw,1.95rem)] font-medium leading-[0.98] tracking-[-0.04em] text-white">
                {sample.displayTitle}
              </h3>
              <SampleGallery sample={sample} onOpenImage={onOpenImage} />
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

export default function ExperientialProjectDetail({
  slug: slugProp,
  currentPath,
  params,
}: ExperientialProjectDetailProps = {}) {
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
  const moreExperientialCardsRef = useRef<HTMLDivElement | null>(null);

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
      });
  }, [allProjects, project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 font-sans text-4xl tracking-[-0.05em]">Project Not Found</h1>
            <Link
              href="/projects/experiential"
              className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-sm text-white/72 transition-colors hover:border-white/22 hover:text-white"
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
  const detailImages = galleryImages.map((image) => ({
    imageUrl: image.imageUrl,
    caption: image.caption || image.sampleTitle,
    altText: image.altText,
  }));
  const projectDateLabel = project.year ? `${project.year}` : null;
  const mediaTypeLabel = project.mediaTypes.map((category) => MEDIA_LABELS[category]).join(" · ");
  const scrollMoreExperientialCards = (direction: "previous" | "next") => {
    moreExperientialCardsRef.current?.scrollBy({
      left: direction === "next" ? 760 : -760,
      behavior: "smooth",
    });
  };
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

  return (
    <div className="min-h-screen bg-black text-white">
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

      <main>
        <section className="bg-black px-[clamp(1.5rem,5vw,6rem)] pb-14 pt-28 md:pb-20 md:pt-36">
          <AnimatedSection>
            <header className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,0.44fr)] lg:items-end">
              <div>
                <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-[#c9ff3d]">
                  {projectDateLabel ? <span>{projectDateLabel}</span> : null}
                  <span>Experiential Design</span>
                </div>
                <h1 className="max-w-[12ch] font-sans text-[clamp(3.4rem,8vw,8.5rem)] font-medium leading-[0.84] text-white">
                  {project.title}
                </h1>
              </div>

              <div className="border-t border-white/22 pt-5">
                <p className="max-w-sm text-[clamp(1rem,1.2vw,1.12rem)] leading-7 text-white/66">
                  {project.heroSummary || project.summary}
                </p>
                <nav aria-label="Share this project" className="mt-6 flex items-center gap-1 text-white/52">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label={linkCopied ? "Project link copied" : "Copy project link"}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                  </button>
                  <a
                    href={emailShareUrl}
                    aria-label="Share project by email"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <a
                    href={linkedInShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share project on LinkedIn"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share project on Facebook"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[1rem] font-semibold leading-none no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    f
                  </a>
                </nav>
              </div>
            </header>
          </AnimatedSection>
        </section>

        <section className="border-y border-white/12 bg-[#0d0d0d] px-[clamp(1.5rem,5vw,6rem)] py-6 md:py-7">
          <AnimatedSection>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {[
                ["Role", "Scenic designer / artist"],
                ["Media", mediaTypeLabel || "Case study"],
                ["Context", project.year ? String(project.year) : "Project study"],
              ].map(([label, value]) => (
                <div key={label} className="min-w-[11rem]">
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/36">
                    {label}
                  </p>
                  <p className="mt-2 font-sans text-[1rem] font-medium leading-tight text-white/82">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {project.sections.length > 0 ? (
          <section className="container max-w-6xl pt-10 md:pt-14">
            <AnimatedSection>
              <div className="mx-auto grid max-w-[72rem] gap-8 pt-10 md:grid-cols-[minmax(11rem,0.28fr)_minmax(0,1fr)] md:gap-12">
                <div>
                  <p className="mb-4 text-[0.76rem] font-medium uppercase tracking-[0.18em] text-[#c9ff3d]">
                    Project note
                  </p>
                  <h2 className="font-sans text-[clamp(1.85rem,2.7vw,2.8rem)] font-medium leading-[0.92] text-white">
                    Context
                  </h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {project.sections.slice(0, 2).map((section) => (
                    <div key={section.heading} className="space-y-3">
                      <h3 className="font-sans text-[1.15rem] font-medium leading-tight text-white">
                        {section.heading}
                      </h3>
                      {section.paragraphs[0] ? (
                        <p className="max-w-xl text-[0.98rem] leading-7 tracking-[-0.01em] text-white/62">
                          {section.paragraphs[0]}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </section>
        ) : null}

        <section className="container max-w-6xl pt-12 pb-16 md:pt-16 md:pb-24">
          <div className="mx-auto max-w-[72rem] space-y-20 md:space-y-24">
            {project.renderings.length > 0 ? (
              <MediaSection category="rendering" samples={project.renderings} onOpenImage={openImageByKey} />
            ) : null}

            {project.technicalDrawings.length > 0 ? (
              <MediaSection
                category="technical-drawing"
                samples={project.technicalDrawings}
                onOpenImage={openImageByKey}
              />
            ) : null}

            {project.liveEvents.length > 0 ? (
              <MediaSection category="live-events" samples={project.liveEvents} onOpenImage={openImageByKey} />
            ) : null}
          </div>
        </section>

        {moreExperientialProjects.length > 0 ? (
          <section>
            <AnimatedSection>
              <div className="relative left-1/2 w-screen -translate-x-1/2 border-t border-white/12 bg-[#070707] pt-8 pb-12 md:pt-10 md:pb-16">
                <div className="px-[clamp(1.5rem,5vw,6rem)]">
                  <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[0.78rem] font-medium uppercase tracking-[0.18em] text-[#c9ff3d]">
                        More experiential
                      </p>
                      <h2 className="mt-3 max-w-[13ch] font-sans text-[clamp(2.4rem,5.2vw,5.4rem)] font-medium leading-[0.94] text-white">
                        More spatial work.
                      </h2>
                    </div>
                    <Link
                      href="/projects/experiential"
                      className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-white/22 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-white/72 transition-colors hover:border-[#c9ff3d]/80 hover:text-white"
                    >
                      View experiential
                    </Link>
                  </div>
                </div>

                <div
                  ref={moreExperientialCardsRef}
                  className="overflow-x-auto px-[clamp(1.5rem,5vw,6rem)] pb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <div className="flex min-w-max gap-5 pr-[clamp(1.5rem,5vw,6rem)]">
                    {moreExperientialProjects.slice(0, 12).map((item) => {
                      const isLive = item.mediaTypes.includes("live-events");
                      const frameClass = isLive ? "bg-black/85" : "bg-black/85";
                      const hasRendering = item.mediaTypes.includes("rendering");
                      const hasOnlyTechnical = item.mediaTypes.includes("technical-drawing") && !hasRendering;
                      const imageClass = hasRendering ? "object-contain" : "object-cover";

                      return (
                        <Link
                          key={item.slug}
                          href={getLocalExperientialProjectHref(item)}
                          className="group relative flex h-[30rem] w-[min(24rem,82vw)] flex-col justify-end overflow-hidden rounded-[2rem] bg-black text-white shadow-[0_20px_58px_rgba(0,0,0,0.32)] ring-1 ring-white/[0.06] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_26px_68px_rgba(0,0,0,0.4)] md:w-[25rem]"
                          aria-label={`Experiential design project: ${item.title}`}
                        >
                          <div className={`absolute inset-x-0 top-0 flex h-[70%] items-center justify-center overflow-hidden ${frameClass}`}>
                            {item.coverVideoUrl ? (
                              <>
                                <img
                                  src={item.coverImageUrl || getYoutubePosterUrl(item.coverVideoUrl)}
                                  alt={`${item.title} video preview poster`}
                                  className="site-media-square h-full w-full object-cover"
                                  loading="eager"
                                />
                                <iframe
                                  src={getYoutubeBackgroundEmbedUrl(item.coverVideoUrl)}
                                  title={`${item.title} video preview`}
                                  aria-label={`${item.title} video preview`}
                                  className="site-media-square pointer-events-none absolute left-1/2 top-1/2 h-[125%] w-[190%] -translate-x-1/2 -translate-y-1/2 border-0"
                                  allow="autoplay; encrypted-media; picture-in-picture"
                                  loading="eager"
                                />
                              </>
                            ) : item.coverImageUrl ? (
                              <ProgressiveImage
                                src={item.coverImageUrl}
                                alt={`${item.title} experiential design preview image`}
                                className={`h-full w-full transition-transform duration-700 group-hover:scale-[1.035] ${
                                  hasOnlyTechnical ? "site-media-square bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.16)]" : ""
                                } ${imageClass}`}
                                containerClassName={`h-full w-full ${hasOnlyTechnical ? "site-media-square" : ""}`}
                                sizes="(max-width: 768px) 82vw, 25rem"
                                width={1000}
                                aspectRatio="3 / 2"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#111111]">
                                <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#c9ff3d]/72">
                                  Documentation
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="absolute inset-x-0 bottom-0 h-[44%] bg-gradient-to-t from-black via-black/96 to-transparent" />
                          <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/24 to-transparent" />

                          <div className="relative z-10 p-6">
                            <p className="font-sans text-[0.74rem] font-semibold tracking-[-0.015em] text-[#c9ff3d]/82">
                              {[item.mediaTypes.map((category) => MEDIA_LABELS[category]).join(" / "), item.year]
                                .filter(Boolean)
                                .join(" / ")}
                            </p>
                            <h3 className="mt-3 max-w-[14ch] font-sans text-[1.7rem] font-medium leading-[0.96] tracking-[-0.055em] text-white">
                              {item.title}
                            </h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="-mt-5 flex justify-end gap-3 px-[clamp(1.5rem,5vw,6rem)]">
                  <button
                    type="button"
                    onClick={() => scrollMoreExperientialCards("previous")}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-white/62 transition-colors hover:bg-white hover:text-black"
                    aria-label="Previous experiential projects"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollMoreExperientialCards("next")}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-white/72 transition-colors hover:bg-white hover:text-black"
                    aria-label="Next experiential projects"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </section>
        ) : null}
      </main>

      {lightboxIndex !== null && detailImages.length > 0 ? (
        <Lightbox
          images={detailImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((current) => (current === null ? 0 : Math.min(current + 1, detailImages.length - 1)))
          }
          onPrev={() => setLightboxIndex((current) => (current === null ? 0 : Math.max(current - 1, 0)))}
        />
      ) : null}

      <Footer className="!mt-0" />
    </div>
  );
}
