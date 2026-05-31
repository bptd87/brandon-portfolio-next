"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "wouter";
import { Check, Link2, Linkedin, Mail } from "lucide-react";

import DeferredYouTubeEmbed from "@/components/DeferredYouTubeEmbed";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { ProgressiveImage } from "@/components/ProgressiveImage";
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
  const imageClass = sample.category === "rendering" || sample.category === "technical-drawing" ? "object-contain" : "object-cover";
  const getFigureClass = (index: number) => {
    const pattern = index % 4;
    if (pattern === 1) return "md:ml-auto md:w-[58vw]";
    if (pattern === 2) return "md:w-[50vw]";
    if (pattern === 3) return "md:mx-auto md:w-[72vw]";
    return "w-full";
  };

  return (
    <div className="space-y-14 py-8 md:space-y-20 md:py-12">
      {sample.videoUrl ? (
        <div className="mx-auto w-full px-[clamp(1.5rem,5vw,6rem)]">
          <DeferredYouTubeEmbed
            videoId={getYoutubeId(sample.videoUrl)}
            title={sample.displayTitle}
            className="overflow-hidden rounded-none"
            eagerPoster
            showLabel={false}
          />
        </div>
      ) : null}

      {displayGalleryItems.length > 0 ? (
        <div className="space-y-14 md:space-y-20">
          {displayGalleryItems.map((image, index) => (
            <figure
              key={image.id}
              className={`bg-[#111111] px-[clamp(1.5rem,5vw,6rem)] ${getFigureClass(index)}`}
            >
              <button type="button" onClick={() => onOpenImage(image.id)} className="block w-full text-left">
                <div className="site-media-square flex min-h-[62vh] items-center justify-center overflow-hidden bg-[#111111] md:min-h-[72vh]">
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    style={{ borderRadius: 0 }}
                    className={`site-media-square block h-full w-full transition-opacity duration-500 hover:opacity-90 ${imageClass}`}
                  />
                </div>
              </button>
              {image.caption ? (
                <figcaption className="p-4 text-[0.92rem] leading-6 tracking-[-0.01em] text-white/56">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
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
      <div className="border-t border-white/12">
        <div className="grid gap-6 px-[clamp(1.5rem,5vw,6rem)] py-10 md:grid-cols-[minmax(12rem,0.34fr)_minmax(0,1fr)] md:gap-12 md:py-14">
          <div>
            <p className="mb-4 text-[0.76rem] font-medium uppercase tracking-[0.18em] text-[#c9ff3d]">
            Project media
            </p>
            <h2 className="font-sans text-[clamp(2.2rem,4vw,4.8rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">
              {MEDIA_LABELS[category]}
            </h2>
          </div>
        </div>

        <div>
          {samples.map((sample) => (
            <div key={sample.id}>
              <div className="border-y border-white/10 px-[clamp(1.5rem,5vw,6rem)] py-5">
                <h3 className="font-sans text-[clamp(1.35rem,2vw,1.95rem)] font-medium leading-[0.98] tracking-[-0.04em] text-white">
                  {sample.displayTitle}
                </h3>
              </div>
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
  const detailImages = galleryImages.map((image) => ({
    imageUrl: image.imageUrl,
    caption: image.caption || image.sampleTitle,
    altText: image.altText,
  }));
  const projectDateLabel = project.year ? `${project.year}` : null;
  const mediaTypeLabel = project.mediaTypes.map((category) => MEDIA_LABELS[category]).join(" · ");
  const portfolioNoteSections = project.sections.length
    ? project.sections
    : [{ heading: "Project Note", paragraphs: [project.summary] }];
  const portfolioTags = [
    "Experiential Design",
    ...project.mediaTypes.map((category) => MEDIA_LABELS[category]),
    project.year ? String(project.year) : null,
  ].filter((tag): tag is string => Boolean(tag));
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

        <section className="border-y border-white/12 bg-[#111111] px-[clamp(1.5rem,5vw,6rem)] py-16 text-white md:py-20">
          <AnimatedSection>
            <div className="mx-auto grid w-full max-w-[96rem] gap-x-12 gap-y-12 text-[0.92rem] leading-[1.38] tracking-[-0.018em] md:grid-cols-[minmax(12rem,0.58fr)_minmax(24rem,1.08fr)_minmax(14rem,0.52fr)]">
              <div className="space-y-8">
                <div>
                  <p className="mb-5 text-[0.82rem] font-medium uppercase tracking-[0.08em] text-[#c9ff3d]">
                    Info
                  </p>
                  <p>{project.title}</p>
                  {projectDateLabel ? <p>{projectDateLabel}</p> : null}
                </div>
                <dl className="space-y-2">
                  <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4">
                    <dt>Role:</dt>
                    <dd>Scenic designer / artist</dd>
                  </div>
                  <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4">
                    <dt>Media:</dt>
                    <dd>{mediaTypeLabel || "Project"}</dd>
                  </div>
                  {projectDateLabel ? (
                    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4">
                      <dt>Year:</dt>
                      <dd>{projectDateLabel}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              <div>
                <p className="mb-5 text-[0.82rem] font-medium uppercase tracking-[0.08em] text-[#c9ff3d]">
                  Description
                </p>
                <div className="space-y-8">
                  {portfolioNoteSections.map((section, sectionIndex) => (
                    <div key={`${section.heading}-${sectionIndex}`} className="space-y-5">
                      <p className="font-medium text-white">
                        {section.heading}
                      </p>
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex} className="text-white/72">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-5 text-[0.82rem] font-medium uppercase tracking-[0.08em] text-[#c9ff3d]">
                  Tags
                </p>
                <div className="space-y-2">
                  {portfolioTags.map((tag) => (
                    <p key={tag} className="text-white/64">
                      {tag}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>
        <section className="bg-[#111111] pt-12 pb-0 md:pt-16">
          <div>
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
          <section className="border-t border-white/12 bg-[#111111] pt-16 text-white md:pt-24">
            <AnimatedSection>
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

      <Footer />
    </div>
  );
}
