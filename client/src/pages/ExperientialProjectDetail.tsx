"use client";

import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, Link2, Play } from "lucide-react";

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

const SECTION_COPY: Record<LocalExperientialCategory, string> = {
  rendering:
    "Renderings establish tone, hierarchy, and the visual argument of the project before the work is translated into coordination and execution.",
  "technical-drawing":
    "Technical drawings carry the project from concept into coordination, clarifying dimensions, relationships, and the information production teams need to move forward.",
  "live-events":
    "Finished work and live-event views show how the project behaved in real conditions once audience flow, venue context, and production realities entered the picture.",
};

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const videoId = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return `https://www.youtube.com/embed/${url.split("/").pop() || ""}`;
  }
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
  }));

  return (
    <div className="space-y-6">
      {sample.videoUrl ? (
        <div className="overflow-hidden rounded-xl bg-black">
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src={getYoutubeEmbedUrl(sample.videoUrl)}
              title={sample.displayTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}

      {sample.category === "technical-drawing" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {galleryItems.map((image) => (
            <figure key={image.id} className="space-y-3">
              <button type="button" onClick={() => onOpenImage(image.id)} className="block w-full text-left">
                <div className="flex aspect-square items-center justify-center overflow-hidden bg-white">
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    className="block h-full w-full object-contain transition-transform duration-500 hover:scale-[1.01]"
                  />
                </div>
              </button>
              {image.caption ? (
                <figcaption className="text-[0.92rem] leading-6 tracking-[-0.01em] text-white/56">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : galleryItems.length > 1 ? (
        <ScenicRenderingGallery
          items={galleryItems}
          onOpen={onOpenImage}
          visibleCount={2}
          squareItems
        />
      ) : galleryItems[0] ? (
        <figure className="space-y-3">
          <button type="button" onClick={() => onOpenImage(galleryItems[0].id)} className="block w-full text-left">
            <div className="aspect-square overflow-hidden bg-black">
              <img
                src={galleryItems[0].imageUrl}
                alt={galleryItems[0].altText}
                className="block h-full w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
              />
            </div>
          </button>
          {galleryItems[0].caption ? (
            <figcaption className="text-[0.92rem] leading-6 tracking-[-0.01em] text-white/56">
              {galleryItems[0].caption}
            </figcaption>
          ) : null}
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
      <div className="space-y-12 md:space-y-16">
        <div className="space-y-5">
          <h2 className="font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
            {MEDIA_LABELS[category]}
          </h2>
          <p className="text-[1.03rem] leading-[1.9] tracking-[-0.01em] text-white/72">
            {SECTION_COPY[category]}
          </p>
        </div>

        <div className="space-y-16 md:space-y-20">
          {samples.map((sample) => (
            <div key={sample.id} className="space-y-5">
              <div className="space-y-4">
                <h3 className="font-sans text-[clamp(1.55rem,2.4vw,2.2rem)] font-medium leading-[0.98] tracking-[-0.04em] text-white">
                  {sample.displayTitle}
                </h3>
                {sample.description ? (
                  <p className="text-[1.03rem] leading-[1.9] tracking-[-0.01em] text-white/72">
                    {sample.description}
                  </p>
                ) : null}
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
  const [location] = useLocation();
  const resolvedPath =
    currentPath ||
    location ||
    (typeof window !== "undefined" ? window.location.pathname : "/projects/experiential");
  const normalizedSlug = String(
    slugProp ||
      params?.slug ||
      (typeof window !== "undefined"
        ? window.location.pathname.split("/").filter(Boolean).pop() || ""
        : "")
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
  const detailImages = galleryImages.map((image) => ({
    imageUrl: image.imageUrl,
    caption: image.caption || image.sampleTitle,
    altText: image.altText,
  }));
  const heroImageIndex = project.coverImageUrl
    ? galleryImages.findIndex((image) => image.imageUrl === project.coverImageUrl)
    : -1;
  const projectDateLabel = project.year ? `${project.year}` : null;
  const mediaTypeLabel = project.mediaTypes.map((category) => MEDIA_LABELS[category]).join(" · ");
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

      <main className="pb-20">
        <section className="px-6 pt-12 md:px-10 md:pt-16">
          <AnimatedSection>
            <header className="mx-auto flex w-full max-w-[62rem] flex-col items-center text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.98rem] tracking-[-0.02em] text-white/56">
                {projectDateLabel ? <span>{projectDateLabel}</span> : null}
                <span>Experiential Design</span>
              </div>
              <h1 className="mt-8 max-w-[12ch] font-sans text-[clamp(3rem,7vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.07em] text-white">
                {project.title}
              </h1>
              <p className="mt-8 max-w-[42rem] text-[clamp(1.08rem,1.5vw,1.36rem)] leading-[1.72] tracking-[-0.02em] text-white/68">
                {project.heroSummary || project.summary}
              </p>
            </header>
          </AnimatedSection>
        </section>

        <section className="px-6 pt-8 md:px-10 md:pt-10">
          <AnimatedSection>
            <div className="mx-auto w-full max-w-[62rem]">
              {project.coverImageUrl ? (
                <div className="overflow-hidden bg-black">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(heroImageIndex >= 0 ? heroImageIndex : 0)}
                    className="block w-full text-left"
                  >
                    <ProgressiveImage
                      src={project.coverImageUrl}
                      alt={`${project.title} experiential design cover image`}
                      className="block w-full max-h-[min(74vh,48rem)] object-cover"
                      loading="eager"
                      fetchPriority="high"
                      sizes="(max-width: 768px) 100vw, 62rem"
                    />
                  </button>
                </div>
              ) : (
                <div className="flex min-h-[24rem] items-center justify-center rounded-xl border border-dashed border-white/12 bg-white/[0.03]">
                  <Play className="h-10 w-10 text-white/28" />
                </div>
              )}
            </div>
          </AnimatedSection>
        </section>

        <section className="px-6 pt-8 md:px-10">
          <AnimatedSection>
            <div className="mx-auto flex w-full max-w-[62rem] items-center justify-between gap-6 border-t border-white/14 py-4 text-white/72">
              <div className="flex flex-wrap items-center gap-5">
                <span className="text-[0.98rem] tracking-[-0.02em]">{mediaTypeLabel}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 text-[0.98rem] tracking-[-0.02em] transition-colors hover:text-white"
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                <span>{linkCopied ? "Link copied" : "Share"}</span>
              </button>
            </div>
          </AnimatedSection>
        </section>

        <section className="container max-w-5xl pt-14 md:pt-18">
          <div className="mx-auto max-w-[54rem] space-y-24 md:space-y-32">
            <AnimatedSection>
              <div className="space-y-16 md:space-y-20">
                {project.sections.map((section, index) => (
                  <div key={`${section.heading}-${index}`} className="space-y-5">
                    <h2 className="font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                      {section.heading}
                    </h2>
                    <div className="space-y-8">
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <p
                          key={`${section.heading}-${paragraphIndex}`}
                          className="text-[1.03rem] leading-[1.9] tracking-[-0.01em] text-white/72"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

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
          <section className="container max-w-[88rem] pt-18 md:pt-24">
            <AnimatedSection>
              <div>
                <div className="mb-12 h-px w-full bg-border/60" />
                <p className="mb-8 font-sans text-[1.15rem] tracking-[-0.02em] text-white">
                  All Experiential Projects
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                  {moreExperientialProjects.map((item) => (
                    <Link key={item.slug} href={getLocalExperientialProjectHref(item)} className="group block">
                      <div className="relative aspect-[1/1] overflow-hidden bg-black/85">
                        {item.coverImageUrl ? (
                          <ProgressiveImage
                            src={item.coverImageUrl}
                            alt={`${item.title} experiential design preview image`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            containerClassName="h-full w-full"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            width={900}
                            aspectRatio="1 / 1"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <div className="pt-3">
                        <h3 className="text-[1.02rem] font-normal tracking-[-0.02em] text-white/88 transition-colors group-hover:text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-[0.92rem] tracking-[-0.01em] text-white/52">
                          {[item.mediaTypes.map((category) => MEDIA_LABELS[category]).join(" · "), item.year]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    </Link>
                  ))}
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

      <Footer />
    </div>
  );
}
