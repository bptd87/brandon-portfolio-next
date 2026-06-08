"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "wouter";
import { Check, Link2, Linkedin, Mail } from "lucide-react";

import DeferredYouTubeEmbed from "@/components/DeferredYouTubeEmbed";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
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
    <div className="grid w-full grid-cols-1 bg-black md:grid-cols-12">
      {tiles.map((tile) => {
        if (tile.type === "video") {
          return (
            <div key={tile.key} className="bg-black md:col-span-12">
              <DeferredYouTubeEmbed
                videoId={getYoutubeId(tile.videoUrl)}
                title={tile.title}
                className="overflow-hidden rounded-none"
                playbackMode="dialog"
                showLabel={false}
              />
            </div>
          );
        }

        imageIndex += 1;
        const currentImageIndex = imageIndex;
        const blockClass = getExperientialMediaBlockClass(currentImageIndex, imageCount);
        const isFullWidth = blockClass.includes("md:col-span-12");
        const objectClass = tile.category === "technical-drawing" ? "object-contain" : "object-cover";

        return (
          <figure
            key={tile.key}
            className={`bg-black ${blockClass}`}
          >
            <button type="button" onClick={() => onOpenImage(tile.key)} className="block w-full text-left">
              <div className={`overflow-hidden bg-black ${getExperientialMediaAspectClass(tile.category, isFullWidth)}`}>
                <img
                  src={tile.imageUrl}
                  alt={tile.altText}
                  style={{ borderRadius: 0 }}
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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
        <section className="relative flex min-h-[76vh] overflow-hidden bg-black px-[clamp(1.5rem,5vw,6rem)] pb-12 pt-28 md:min-h-[82vh] md:pb-16 md:pt-36">
          {heroImageUrl ? (
            <img
              src={heroImageUrl}
              alt={project.coverAltText || `${project.title} hero image`}
              className="absolute inset-0 h-full w-full object-cover grayscale"
              loading="eager"
              decoding="async"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/58" />
          <header className="relative z-10 mt-auto grid w-full gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,0.5fr)] lg:items-end">
            <div>
              <div className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8rem] font-medium tracking-[0.08em] text-[#c9ff3d]">
                {projectDateLabel ? <span>{projectDateLabel}</span> : null}
                <span>Experiential Design</span>
              </div>
              <h1 className="max-w-[10.5ch] font-sans text-[clamp(4rem,10vw,11rem)] font-medium leading-[0.82] tracking-[-0.085em] text-white">
                {project.title}
              </h1>
            </div>

            <div className="border-t border-white/22 pt-5">
              <p className="max-w-[31rem] text-[clamp(1.18rem,2vw,2.05rem)] font-medium leading-[1.32] tracking-[-0.045em] text-white/82">
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
        </section>

        <section className="border-y border-white/12 bg-[#111111] px-[clamp(1.5rem,5vw,6rem)] text-white">
          <button
            type="button"
            onClick={() => setIsDetailsOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-5 py-4 text-left text-[0.92rem] tracking-[-0.015em] text-white/72 transition-colors hover:text-white"
            aria-expanded={isDetailsOpen}
          >
            <span className="text-[#c9ff3d]">Details</span>
            <span className="text-right text-white/48">
              {[mediaTypeLabel, projectDateLabel].filter(Boolean).join(" / ")}
            </span>
          </button>

          {isDetailsOpen ? (
            <div className="grid w-full gap-x-16 gap-y-8 border-t border-white/10 py-7 text-[0.92rem] leading-[1.52] tracking-[-0.018em] md:grid-cols-[minmax(14rem,0.5fr)_minmax(28rem,1fr)]">
              <dl className="space-y-2">
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
                  <dt className="text-[#c9ff3d]/80">Project</dt>
                  <dd className="text-white/70">{project.title}</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
                  <dt className="text-[#c9ff3d]/80">Role</dt>
                  <dd className="text-white/70">Experiential designer / artist</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
                  <dt className="text-[#c9ff3d]/80">Media</dt>
                  <dd className="text-white/70">{mediaTypeLabel || "Project"}</dd>
                </div>
                {projectDateLabel ? (
                  <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
                    <dt className="text-[#c9ff3d]/80">Year</dt>
                    <dd className="text-white/70">{projectDateLabel}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="max-w-[52rem] space-y-5 text-white/68">
                {narrativeParagraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>
            </div>
          ) : null}
        </section>
        <section className="bg-black pb-0 [contain-intrinsic-size:1px_1800px] [content-visibility:auto]">
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <ProjectMediaBlock samples={project.samples} onOpenImage={openImageByKey} />
          </div>
        </section>

        {moreExperientialProjects.length > 0 ? (
          <section className="border-t border-white/12 bg-[#111111] pt-16 text-white [contain-intrinsic-size:1px_960px] [content-visibility:auto] md:pt-24">
            <div className="px-[clamp(1.5rem,5vw,6rem)] pb-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="max-w-[12ch] font-sans text-[clamp(2.6rem,5.6vw,6rem)] font-medium leading-[0.88] tracking-[-0.07em] text-white">
                  More experiential.
                </h2>
                <Link
                  href="/projects/experiential"
                  className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-white/18 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-white/72 transition-colors hover:border-white/38 hover:text-white"
                >
                  Experiential index
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 border-l border-white/12 md:grid-cols-4">
              {moreExperientialProjects.map((item, index) => {
                const previewImageUrl = item.coverImageUrl || (item.coverVideoUrl ? getYoutubePosterUrl(item.coverVideoUrl) : "");

                return (
                  <Link
                    key={item.slug}
                    href={getLocalExperientialProjectHref(item)}
                    className={`group block border-b border-r border-white/12 text-white ${
                      index % 6 < 2 ? "md:col-span-2" : ""
                    }`}
                    aria-label={`Experiential design project: ${item.title}`}
                  >
                    <div className="site-media-square relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-none bg-[#181818]">
                      {previewImageUrl ? (
                        <img
                          src={previewImageUrl}
                          alt={`${item.title} experiential design preview image`}
                          className="site-media-square block h-full w-full rounded-none object-cover transition-opacity duration-500 group-hover:opacity-90"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#111111]">
                          <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#c9ff3d]/72">
                            Documentation
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-h-[8.5rem] border-t border-white/12 p-[clamp(0.9rem,1.5vw,1.2rem)] text-white">
                      <h3 className="max-w-[18ch] font-sans text-[clamp(1.2rem,1.7vw,1.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white transition-colors group-hover:text-white/72">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-[18ch] font-sans text-[0.94rem] leading-tight tracking-[-0.025em] text-white/52">
                        {[item.mediaTypes.map((category) => MEDIA_LABELS[category]).join(" / "), item.year]
                          .filter(Boolean)
                          .join("  ")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </main>

      {selectedLightboxImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/82 px-4 py-16 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Project image"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 px-2 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/70 md:right-8 md:top-8"
            onClick={() => setLightboxIndex(null)}
          >
            Close
          </button>
          <div
            className="relative max-h-full max-w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedLightboxImage.imageUrl}
              alt={selectedLightboxImage.altText}
              className="max-h-[82vh] w-auto max-w-[92vw] object-contain"
            />
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}
