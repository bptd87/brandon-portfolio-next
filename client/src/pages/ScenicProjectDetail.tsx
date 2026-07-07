"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { AnimatedSection } from "@/components/AnimatedSection";
import MotionReveal from "@/components/MotionReveal";
import { SEO } from "@/components/SEO";
import { CreditNameLinks } from "@/components/CreditNameLinks";
import { ExternalLinkPreview } from "@/components/ExternalLinkPreview";
import { copyTextToClipboard } from "@/lib/clipboard";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeTheme,
} from "@/lib/homeTheme";
import { Button } from "@/components/ui/button";
import {
  getLocalScenicProjectBySlug,
  type LocalScenicProjectMedia,
} from "@shared/localScenicProjects";
import { getLocalArticles } from "@shared/localArticles";
import { Check, ChevronDown, ChevronUp, Link2, Linkedin, Mail } from "lucide-react";

type ScenicProjectDetailProps = {
  slug?: string;
  currentPath?: string;
  params?: {
    slug?: string;
  };
};

type VisualImageMediaItem = {
  mediaType: "image";
  key: string;
  id: string;
  imageUrl: string;
  altText: string;
  caption?: string;
  display?: LocalScenicProjectMedia["display"];
  kind?: LocalScenicProjectMedia["kind"];
};

type VisualMediaItem =
  | VisualImageMediaItem
  | {
      mediaType: "video";
      key: string;
      id: string;
      videoUrl: string;
      title: string;
      caption?: string;
    }
  | {
      mediaType: "renderingGallery";
      key: string;
      id: string;
      items: VisualImageMediaItem[];
      caption?: string;
    };

const scenicMediaObjectPositions: Record<string, string> = {
  "gm-prod-11": "50% 18%",
  "hoh-prod-2": "50% 0%",
  "hoh-prod-6": "50% 0%",
};

function getScenicMediaObjectPosition(mediaId: string) {
  return scenicMediaObjectPositions[mediaId] ?? "50% 50%";
}

function getScenicMediaAspectClass(
  display: LocalScenicProjectMedia["display"] | undefined,
  index: number,
  isFullWidth: boolean
) {
  if (display === "portrait") return "aspect-[4/5]";
  if (display === "wide" || display === "full" || isFullWidth || index % 3 === 0) {
    return "aspect-[16/9]";
  }
  return "aspect-[4/3]";
}

function getScenicMediaBlockClass(
  item: VisualMediaItem,
  index: number,
  isFullWidth: boolean
) {
  if (isFullWidth) return "md:col-span-12";
  if (item.mediaType === "video" || item.mediaType === "renderingGallery") {
    return "md:col-span-12";
  }
  if (index > 0 && index % 3 === 0) return "md:col-span-12";
  return "md:col-span-6";
}

function getEmbedUrl(url: string): string {
  if (!url) return "";
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

function getAutoEmbedUrl(url: string, autoplay: boolean): string {
  if (!url) return "";
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      controls: "1",
      mute: "1",
    });
    if (autoplay) {
      params.set("autoplay", "1");
      params.set("loop", "1");
      params.set("playlist", videoId);
    }
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }
  return getEmbedUrl(url);
}

function AutoPlayEmbed({ url, title }: { url: string; title: string }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio > 0.55);
      },
      { threshold: [0.35, 0.55, 0.75] }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="site-media-square overflow-hidden bg-black">
      <div className="relative aspect-video w-full">
        <iframe
          key={isInView ? "autoplay" : "paused"}
          src={getAutoEmbedUrl(url, isInView)}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function getCreditRolePriority(role: string) {
  const normalized = role.toLowerCase().trim();
  if (
    normalized.includes("book") ||
    normalized === "by" ||
    normalized.includes("written") ||
    normalized.includes("playwright") ||
    normalized.includes("adapted") ||
    normalized.includes("conceived") ||
    normalized.includes("created") ||
    normalized.includes("composer") ||
    normalized === "music" ||
    normalized.includes("music by") ||
    normalized.includes("lyrics") ||
    normalized.includes("original concept")
  ) {
    return 0;
  }
  if (
    normalized.includes("directed") ||
    normalized === "director" ||
    (normalized.includes("director") &&
      !normalized.includes("associate") &&
      !normalized.includes("music director"))
  ) {
    return 1;
  }
  if (normalized.includes("associate director")) return 2;
  if (normalized.includes("choreo")) return 3;
  if (normalized.includes("music director") || normalized.includes("music direction")) return 4;
  if (normalized.includes("scenic")) return 5;
  if (normalized.includes("costume")) return 6;
  if (normalized.includes("lighting")) return 7;
  if (normalized.includes("sound")) return 8;
  if (normalized.includes("projection")) return 9;
  if (normalized.includes("puppetry")) return 10;
  if (normalized.includes("assistant")) return 11;
  return 50;
}

function getCreditRoleLabel(role: string) {
  const normalized = role.toLowerCase().trim();
  if (normalized.includes("co-scenic")) return "Co-Scenic Design";
  if (normalized.includes("scenic") && normalized.includes("lighting")) {
    return "Scenic and Lighting Design";
  }
  if (normalized.includes("scenic")) return "Scenic Design";
  if (normalized.includes("costume")) return "Costume Design";
  if (normalized.includes("lighting")) return "Lighting Design";
  if (normalized.includes("sound")) return "Sound Design";
  if (normalized.includes("projection")) return "Projection Design";
  if (normalized.includes("directed") && normalized.includes("choreo")) {
    return "Direction and Choreography";
  }
  if (normalized === "director" || normalized === "directed by") return "Directed by";
  if (normalized.includes("associate director")) return "Associate Direction";
  if (normalized.includes("choreo")) return "Choreography";
  if (normalized.includes("music director") || normalized.includes("music direction")) {
    return "Music Direction";
  }
  if (normalized.includes("music and lyrics") || normalized.includes("music & lyrics")) {
    return "Music and Lyrics";
  }
  if (normalized.includes("book") && normalized.includes("lyrics")) return "Book and Lyrics";
  if (normalized.includes("book")) return "Book by";
  if (normalized.includes("music by") || normalized === "music") return "Music by";
  if (normalized.includes("lyrics")) return "Lyrics by";
  if (normalized.includes("written")) return "Written by";
  if (normalized.includes("adapted")) return "Adapted by";
  if (normalized.includes("from the book")) return "From the book by";
  if (normalized === "by" || normalized.includes("playwright")) return "Written by";
  return role;
}

export default function ScenicProjectDetail({
  slug: slugProp,
  currentPath,
  params,
}: ScenicProjectDetailProps = {}) {
  const { homeTheme } = useHomeTheme();
  const getDisplayHeading = (heading?: string | null) => {
    return String(heading || "").trim();
  };

  const resolvedPath =
    currentPath || (typeof window !== "undefined" ? window.location.pathname : "/project");
  const normalizedSlug = String(
    slugProp ||
      params?.slug ||
      (typeof window !== "undefined"
        ? window.location.pathname.split("/").filter(Boolean).pop() || ""
        : "")
  )
    .trim()
    .toLowerCase();
  const project = getLocalScenicProjectBySlug(normalizedSlug);
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeRenderingIndex, setActiveRenderingIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedVisualImage, setSelectedVisualImage] = useState<VisualImageMediaItem | null>(
    null
  );
  const lightboxScrollRef = useRef<HTMLDivElement | null>(null);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Project Not Found</h2>
          <Link href="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const projectUrl = `https://www.brandonptdavis.com${resolvedPath}`;
  const encodedProjectUrl = encodeURIComponent(projectUrl);
  const encodedProjectTitle = encodeURIComponent(project.title);
  const emailShareUrl = `mailto:?subject=${encodedProjectTitle}&body=${encodedProjectTitle}%0A%0A${encodedProjectUrl}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedProjectUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedProjectUrl}`;
  const handleCopyLink = async () => {
    const copied = await copyTextToClipboard(projectUrl);
    if (copied) {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } else {
      setLinkCopied(false);
    }
  };

  const creativeTeamGroups = useMemo(() => {
    return [...project.creativeTeam].sort((a, b) => {
      const priorityDiff = getCreditRolePriority(a.role) - getCreditRolePriority(b.role);
      if (priorityDiff !== 0) return priorityDiff;
      return getCreditRoleLabel(a.role).localeCompare(getCreditRoleLabel(b.role));
    });
  }, [project.creativeTeam]);

  const relatedArticles = useMemo(
    () =>
      getLocalArticles()
        .filter((article) => (article.linkedScenicProjectSlugs || []).includes(project.slug))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [project.slug]
  );
  const scenicSeoTitle =
    project.seoTitle ||
    `${project.title} Scenic Design${project.client ? ` | ${project.client}` : ""} | Brandon PT Davis`;
  const scenicSeoDescription =
    project.seoDescription ||
    project.excerpt ||
    `${project.title} scenic design by Brandon PT Davis${project.client ? ` for ${project.client}` : ""}.`;
  const scenicSeoKeywords =
    project.seoKeywords ||
    [
      project.title,
      project.subcategory,
      project.client,
      project.location,
      String(project.year || ""),
      "scenic design",
      "Brandon PT Davis",
    ]
      .filter(Boolean)
      .join(", ");
  const projectInfoLinks = [
    project.clientUrl
      ? {
          label: project.client || "Production page",
          href: project.clientUrl,
          kind: "Production",
          external: true,
        }
      : null,
    ...(project.links || []).map((link) => ({
      label: link.label,
      href: link.url,
      kind: "Link",
      external: true,
    })),
    ...relatedArticles.slice(0, 2).map((article) => ({
      label: article.title,
      href: `/articles/${article.slug}`,
      kind: "Article",
      external: false,
    })),
  ].filter(
    (
      item
    ): item is {
      label: string;
      href: string;
      kind: string;
      external: boolean;
    } => Boolean(item)
  );
  const projectNarrativeSections = project.sections.flatMap((section) => {
    if (section.type === "text" && section.content.length > 0) {
      return [{ heading: getDisplayHeading(section.heading), content: section.content }];
    }
    if (section.type === "video" && section.content?.length) {
      return [{ heading: getDisplayHeading(section.heading), content: section.content }];
    }
    return [];
  });
  const hasNarrativeHeadings = projectNarrativeSections.some((section) => Boolean(section.heading));
  const projectNarrativeParagraphs = projectNarrativeSections.flatMap((section) => section.content);
  const shouldClampNarrative = !hasNarrativeHeadings && projectNarrativeParagraphs.length > 2;
  const visibleNarrativeParagraphs =
    shouldClampNarrative && !isDescriptionExpanded
      ? projectNarrativeParagraphs.slice(0, 2)
      : projectNarrativeParagraphs;
  const visualSections = project.sections.filter((section) => section.type !== "text");
  const visualMediaItems: VisualMediaItem[] = visualSections.flatMap<VisualMediaItem>((section, sectionIndex) => {
    if (section.type === "gallery") {
      const galleryItems = section.mediaIds
        .flatMap<VisualImageMediaItem>((mediaId, mediaIndex) => {
          const item = project.media.find((entry) => entry.id === mediaId);
          if (!item || item.type !== "image" || !item.imageUrl) return [];
          return [
            {
              mediaType: "image" as const,
              key: `${sectionIndex}-${mediaIndex}-${item.id}`,
              id: item.id,
              imageUrl: item.imageUrl,
              altText: item.altText,
              caption: item.caption,
              display: item.display,
              kind: item.kind,
            },
          ];
        });

      const isRenderingGallery =
        galleryItems.length > 1 && galleryItems.every((item) => item.kind === "rendering");

      if (isRenderingGallery) {
        return [
          {
            mediaType: "renderingGallery" as const,
            key: `${sectionIndex}-rendering-gallery`,
            id: `${sectionIndex}-rendering-gallery`,
            items: galleryItems,
            caption: galleryItems.find((item) => item.caption)?.caption,
          },
        ];
      }

      return galleryItems;
    }

    if (section.type === "video") {
      const media = project.media.find((entry) => entry.id === section.mediaId);
      if (!media?.videoUrl) return [];
      return [
        {
          mediaType: "video" as const,
          key: `${sectionIndex}-${section.mediaId}`,
          id: section.mediaId,
          videoUrl: media.videoUrl,
          title: `${project.title} walkthrough`,
          caption: media.caption || getDisplayHeading(section.heading),
        },
      ];
    }

    return [];
  });
  const renderingGalleryItem = visualMediaItems.find(
    (item): item is Extract<VisualMediaItem, { mediaType: "renderingGallery" }> =>
      item.mediaType === "renderingGallery"
  );
  const renderingGalleryItems = renderingGalleryItem?.items || [];
  const safeRenderingIndex =
    renderingGalleryItems.length > 0 ? activeRenderingIndex % renderingGalleryItems.length : 0;
  const lightboxImageItems = useMemo(
    () =>
      visualMediaItems.filter(
        (item): item is VisualImageMediaItem => item.mediaType === "image"
      ),
    [visualMediaItems]
  );
  const selectedVisualImageIndex = selectedVisualImage
    ? lightboxImageItems.findIndex((item) => item.key === selectedVisualImage.key)
    : -1;

  useEffect(() => {
    setActiveRenderingIndex(0);
  }, [project.slug]);

  useEffect(() => {
    if (renderingGalleryItems.length <= 1) return;

    const timer = window.setTimeout(() => {
      setActiveRenderingIndex((current) => (current + 1) % renderingGalleryItems.length);
    }, 5200);

    return () => window.clearTimeout(timer);
  }, [activeRenderingIndex, renderingGalleryItems.length]);

  useEffect(() => {
    if (!selectedVisualImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedVisualImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedVisualImage]);

  useEffect(() => {
    const isQuickView =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("quickView") === "1" &&
      window.parent !== window;

    if (!isQuickView) return;

    window.parent.postMessage(
      { type: "portfolioQuickViewLightbox", open: Boolean(selectedVisualImage) },
      window.location.origin
    );

    return () => {
      window.parent.postMessage(
        { type: "portfolioQuickViewLightbox", open: false },
        window.location.origin
      );
    };
  }, [selectedVisualImage]);

  useEffect(() => {
    if (!selectedVisualImage || selectedVisualImageIndex < 0) return;

    window.requestAnimationFrame(() => {
      const selectedImage = lightboxScrollRef.current?.querySelector<HTMLElement>(
        `[data-lightbox-index="${selectedVisualImageIndex}"]`
      );
      selectedImage?.scrollIntoView({ block: "nearest", inline: "center" });
    });
  }, [selectedVisualImage, selectedVisualImageIndex]);

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
        title={scenicSeoTitle}
        description={scenicSeoDescription}
        image={project.coverImageUrl || undefined}
        imageAlt={`${project.title} scenic design cover image`}
        type="website"
        keywords={scenicSeoKeywords}
        url={projectUrl}
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
          className="flex min-h-[100svh] items-center justify-center"
          style={
            {
              backgroundColor: homeTheme.bg,
              order: 1,
              padding: "var(--project-page-pad) var(--project-page-pad) var(--project-hero-bottom-pad)",
            } as CSSProperties
          }
        >
          <div
            className="relative mx-auto flex w-full max-w-[86rem] overflow-hidden rounded-[1.75rem]"
            style={{
              minHeight: "calc(100svh - var(--project-page-pad) - var(--project-hero-bottom-pad))",
            }}
          >
            {project.coverImageUrl ? (
              <Image
                src={project.coverImageUrl}
                alt={`${project.title} scenic design cover image`}
                fill
                priority
                quality={84}
                sizes="(max-width: 900px) 100vw, 86rem"
                className="object-cover"
                style={{ objectPosition: project.coverImagePosition || "center" }}
                fetchPriority="high"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/34 to-black/10" />
            <header
              className="relative z-10 mt-auto grid w-full gap-[clamp(2rem,5vw,5rem)] px-[clamp(1.35rem,4vw,4rem)] pb-[clamp(2.5rem,7vh,5rem)] pt-[clamp(9rem,24vh,16rem)] lg:grid-cols-[minmax(0,0.62fr)_minmax(18rem,0.38fr)] lg:items-center"
            >
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
                <p
                  className="max-w-[31rem] text-[clamp(1rem,1.25vw,1.24rem)] font-normal leading-[1.52] tracking-[-0.025em] text-white/70"
                >
                  {project.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-2">
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
                </div>
              </div>
              </MotionReveal>
            </header>
          </div>
        </section>

        <section
          className="px-[var(--project-page-pad)]"
          style={{
            backgroundColor: homeTheme.bg,
            color: homeTheme.ink,
            order: 3,
          }}
        >
          <MotionReveal>
          <div
            className="mx-auto flex w-full max-w-[86rem] items-center justify-between gap-5 py-4 text-[0.92rem] font-black uppercase tracking-[0.04em]"
            style={{ color: homeTheme.muted, fontFamily: HOME_DISPLAY_FONT }}
          >
            <span className="min-w-0 truncate text-left">
              {project.client || "Scenic Design"}
            </span>
            {project.year ? (
              <span className="shrink-0 text-right">{project.year}</span>
            ) : null}
          </div>
          </MotionReveal>

          <MotionReveal delay={80}>
            <div
              id="scenic-project-details"
              className="mx-auto grid w-full max-w-[86rem] gap-x-[clamp(2.5rem,5vw,5rem)] gap-y-10 py-8 text-[0.92rem] leading-[1.38] tracking-[-0.018em] md:grid-cols-[minmax(20rem,0.92fr)_minmax(15rem,0.5fr)_minmax(12rem,0.36fr)] md:py-10"
              style={{
                color: homeTheme.ink,
              }}
            >
              <div>
                <div
                  className="text-[0.98rem] leading-[1.66] md:text-[0.9rem] md:leading-[1.48]"
                  style={{ color: homeTheme.ink }}
                >
                  {projectNarrativeSections.length ? (
                    hasNarrativeHeadings ? (
                      <div className="space-y-6 md:space-y-5">
                        {projectNarrativeSections.map((section, sectionIndex) => (
                          <div key={`${section.heading || "description"}-${sectionIndex}`} className="space-y-3.5 md:space-y-2.5">
                            {section.heading ? (
                              <p className="font-black uppercase tracking-[0.04em]" style={{ fontFamily: HOME_DISPLAY_FONT }}>
                                {section.heading}
                              </p>
                            ) : null}
                            {section.content.map((paragraph, paragraphIndex) => (
                              <p key={paragraphIndex}>{paragraph}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="max-w-[38rem] space-y-5 text-left hyphens-auto [text-wrap:pretty] md:max-w-none md:space-y-4 md:text-justify">
                        <p className="text-left">
                          <span
                            className="text-[0.96rem] font-black uppercase tracking-[0.04em]"
                            style={{ fontFamily: HOME_DISPLAY_FONT }}
                          >
                            Description
                          </span>
                        </p>
                        {visibleNarrativeParagraphs.map((paragraph, paragraphIndex) => (
                          <p key={paragraphIndex}>{paragraph}</p>
                        ))}
                        {shouldClampNarrative ? (
                          <button
                            type="button"
                            onClick={() => setIsDescriptionExpanded((expanded) => !expanded)}
                            className="inline-flex appearance-none items-center gap-1.5 border-0 bg-transparent p-0 pt-1 text-left text-[0.72rem] font-black uppercase tracking-[0.12em] transition-opacity hover:opacity-70 md:pt-1"
                            style={{ color: homeTheme.ink, fontFamily: HOME_DISPLAY_FONT }}
                            aria-expanded={isDescriptionExpanded}
                          >
                            {isDescriptionExpanded ? "Show less" : "Show more"}
                            {isDescriptionExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                          </button>
                        ) : null}
                      </div>
                    )
                  ) : (
                    <div className="max-w-[38rem] space-y-5 text-left hyphens-auto [text-wrap:pretty] md:max-w-none md:space-y-4 md:text-justify">
                      <p className="text-left">
                          <span
                            className="text-[0.96rem] font-black uppercase tracking-[0.04em]"
                            style={{ fontFamily: HOME_DISPLAY_FONT }}
                          >
                            Description
                          </span>
                      </p>
                      <p>{project.excerpt}</p>
                    </div>
                  )}
                </div>
              </div>

              <div id="project-credits" className="scroll-mt-28">
                <p
                  className="mb-5 text-[0.96rem] font-black uppercase tracking-[0.04em]"
                  style={{ fontFamily: HOME_DISPLAY_FONT }}
                >
                  Credits
                </p>
                <div className="space-y-2.5">
                  {creativeTeamGroups.map((member) => (
                    <div
                      key={`${member.role}-${member.name}`}
                      className="grid min-w-0 grid-cols-[8.5rem_minmax(0,1fr)] gap-4"
                    >
                      <span style={{ color: homeTheme.muted }}>{getCreditRoleLabel(member.role)}</span>
                      <span style={{ color: homeTheme.ink }}>
                        {member.url ? (
                          <ExternalLinkPreview
                            href={member.url}
                            className="no-underline transition-opacity hover:opacity-70"
                            previewLabel={member.name}
                          >
                            {member.name}
                          </ExternalLinkPreview>
                        ) : (
                          <CreditNameLinks
                            name={member.name}
                            className="no-underline transition-opacity hover:opacity-70"
                          />
                        )}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

              {projectInfoLinks.length ? (
                <div>
                  <p
                    className="mb-5 text-[0.96rem] font-black uppercase tracking-[0.04em]"
                    style={{ fontFamily: HOME_DISPLAY_FONT }}
                  >
                    Links
                  </p>
                  <div className="space-y-2.5">
                    {projectInfoLinks.map((link) =>
                      link.external ? (
                        <ExternalLinkPreview
                          key={`${link.kind}-${link.href}`}
                          href={link.href}
                          className="block no-underline transition-opacity hover:opacity-70"
                          style={{ color: homeTheme.ink }}
                          previewLabel={link.label}
                        >
                          {link.label}
                        </ExternalLinkPreview>
                      ) : (
                        <Link
                          key={`${link.kind}-${link.href}`}
                          href={link.href}
                          className="block no-underline transition-opacity hover:opacity-70"
                          style={{ color: homeTheme.ink }}
                        >
                          {link.label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div aria-hidden="true" />
              )}
            </div>
          </MotionReveal>
        </section>

        <section
          id="project-process"
          className="scroll-mt-28 px-[var(--project-page-pad)] [contain-intrinsic-size:1px_2400px] [content-visibility:auto]"
          style={{ backgroundColor: homeTheme.bg, order: 2 }}
        >
          <div className="mx-auto w-full max-w-[86rem] pb-[clamp(2rem,5vw,4rem)] pt-[clamp(0.75rem,2vw,1.25rem)]">
            <div className="grid w-full grid-flow-dense grid-cols-1 gap-[clamp(1rem,2vw,1.6rem)] md:grid-cols-12">
              {visualMediaItems.map((item, index) => {
                const isFullWidth =
                  item.mediaType === "image" && (index === 0 || item.display === "full" || item.display === "wide");
                const blockClass = getScenicMediaBlockClass(item, index, isFullWidth);

                return (
                  <MotionReveal
                    key={item.key}
                    className={blockClass}
                    delay={(index % 4) * 60}
                  >
                    <figure>
                      {item.mediaType === "image" ? (
                        <button
                          type="button"
                          aria-label={`Open ${item.altText}`}
                          className={`relative block w-full overflow-hidden rounded-[1.35rem] text-left focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-black/40 ${getScenicMediaAspectClass(
                            item.display,
                            index,
                            isFullWidth
                          )}`}
                          onClick={() => setSelectedVisualImage(item)}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.altText}
                            className="absolute inset-0 h-full w-full object-cover"
                            style={{ objectPosition: getScenicMediaObjectPosition(item.id) }}
                            loading="lazy"
                            decoding="async"
                          />
                        </button>
                      ) : item.mediaType === "video" ? (
                        <div className="overflow-hidden rounded-[1.35rem]">
                          <AutoPlayEmbed url={item.videoUrl} title={item.title} />
                        </div>
                      ) : (
                        <div className="relative aspect-[3/2] overflow-hidden rounded-[1.35rem] bg-black">
                          {item.items.map((rendering, renderingIndex) => (
                            <img
                              key={rendering.key}
                              src={rendering.imageUrl}
                              alt={rendering.altText}
                              className={`absolute inset-0 h-full w-full bg-black object-contain transition-opacity duration-700 ${
                                renderingIndex === safeRenderingIndex ? "opacity-100" : "opacity-0"
                              }`}
                              loading="lazy"
                              decoding="async"
                            />
                          ))}

                          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/42 px-3 py-2 backdrop-blur-md">
                            {item.items.map((rendering, renderingIndex) => (
                              <button
                                key={rendering.key}
                                type="button"
                                aria-label={`Show rendering ${renderingIndex + 1}`}
                                onClick={() => setActiveRenderingIndex(renderingIndex)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  renderingIndex === safeRenderingIndex
                                    ? "w-10 bg-white"
                                    : "w-2.5 bg-white/42 hover:bg-white/70"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {item.caption ? (
                        <figcaption
                          className="px-2 py-3 text-[0.82rem] leading-5 tracking-[-0.01em]"
                          style={{ color: homeTheme.muted }}
                        >
                          {item.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  </MotionReveal>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {selectedVisualImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/58 p-[clamp(0.75rem,2vw,1.5rem)] backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Project image"
          onClick={() => setSelectedVisualImage(null)}
        >
          <button
            type="button"
            className="absolute right-[clamp(1rem,2.6vw,2rem)] top-[clamp(1rem,2.6vw,2rem)] z-[102] inline-flex h-11 w-11 items-center justify-center rounded-full text-[1.45rem] font-normal leading-none shadow-[0_1rem_2.5rem_rgba(0,0,0,0.18)] transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            style={{
              backgroundColor: homeTheme.controlBg,
              color: homeTheme.controlInk,
            }}
            onClick={() => setSelectedVisualImage(null)}
            aria-label="Close project image gallery"
          >
            ×
          </button>
          <div
            className="relative h-full w-full overflow-hidden rounded-[1.65rem] shadow-[0_2rem_6rem_rgba(0,0,0,0.28)]"
            style={{ backgroundColor: homeTheme.bg }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              ref={lightboxScrollRef}
              className="flex h-full snap-x snap-mandatory items-center gap-[clamp(1.25rem,4vw,4rem)] overflow-x-auto overflow-y-hidden px-[clamp(1.5rem,7vw,8rem)] py-[clamp(3.5rem,7vh,6rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {lightboxImageItems.map((item, index) => (
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
