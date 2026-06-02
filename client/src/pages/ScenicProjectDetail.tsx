"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { CreditNameLinks } from "@/components/CreditNameLinks";
import { copyTextToClipboard } from "@/lib/clipboard";
import { Button } from "@/components/ui/button";
import {
  getLocalScenicProjectBySlug,
  getLocalScenicProjects,
  type LocalScenicProjectMedia,
} from "@shared/localScenicProjects";
import { getLocalArticles } from "@shared/localArticles";
import { Check, ChevronDown, ChevronRight, ChevronUp, ExternalLink, Link2, Linkedin, Mail } from "lucide-react";

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
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [heroIntroProgress, setHeroIntroProgress] = useState(0);
  const [isMobileHero, setIsMobileHero] = useState(false);
  const [activeRenderingIndex, setActiveRenderingIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const heroIntroProgressRef = useRef(0);
  const introTouchYRef = useRef<number | null>(null);
  const allScenicProjects = getLocalScenicProjects();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobileHero = () => setIsMobileHero(mediaQuery.matches);

    updateMobileHero();
    mediaQuery.addEventListener("change", updateMobileHero);
    return () => mediaQuery.removeEventListener("change", updateMobileHero);
  }, []);

  useEffect(() => {
    const updateHeroScrollProgress = () => {
      setHeroScrollProgress(Math.min(Math.max(window.scrollY / 180, 0), 1));
    };

    updateHeroScrollProgress();
    window.addEventListener("scroll", updateHeroScrollProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateHeroScrollProgress);
  }, []);

  useEffect(() => {
    if (isMobileHero) {
      heroIntroProgressRef.current = 1;
      setHeroIntroProgress(1);
      return;
    }

    heroIntroProgressRef.current = 0;
    setHeroIntroProgress(0);
    setIsDescriptionExpanded(false);

    const advanceIntro = (delta: number) => {
      if (delta <= 0 || window.scrollY > 2 || heroIntroProgressRef.current >= 1) {
        return false;
      }

      const nextProgress = Math.min(1, heroIntroProgressRef.current + delta / 420);
      heroIntroProgressRef.current = nextProgress;
      setHeroIntroProgress(nextProgress);
      return true;
    };

    const handleWheel = (event: WheelEvent) => {
      if (advanceIntro(event.deltaY)) {
        event.preventDefault();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      introTouchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      const previousY = introTouchYRef.current;
      if (currentY == null || previousY == null) return;

      const delta = previousY - currentY;
      introTouchYRef.current = currentY;
      if (advanceIntro(delta)) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isMobileHero, normalizedSlug]);

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
  const moreScenicProjects = useMemo(() => {
    const getProjectTimestamp = (item: any) => {
      if (item.year) {
        const month = item.month && item.month >= 1 && item.month <= 12 ? item.month - 1 : 0;
        return new Date(item.year, month, 1).getTime();
      }
      const explicitDate = item.updatedAt || item.publishedAt || item.createdAt;
      if (explicitDate) return new Date(explicitDate).getTime();
      return 0;
    };

    return (allScenicProjects || [])
      .filter((item) => item.slug !== project.slug && item.title !== project.title)
      .sort((a, b) => {
        const timeCompare = getProjectTimestamp(b) - getProjectTimestamp(a);
        if (timeCompare !== 0) return timeCompare;
        return a.title.localeCompare(b.title);
      })
      .slice(0, 6);
  }, [allScenicProjects, project.slug, project.title]);
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
  const rawHeroProgress = Math.max(heroScrollProgress, heroIntroProgress);
  const heroProgress = isMobileHero ? 1 : rawHeroProgress;
  const heroTitleProgress = isMobileHero ? 1 : Math.min(Math.max((heroProgress - 0.08) / 0.92, 0), 1);
  const projectMetaItems = [
    project.client ? { label: "Company", value: project.client } : null,
    project.location ? { label: "Location", value: project.location } : null,
    project.year ? { label: "Year", value: String(project.year) } : null,
    project.subcategory ? { label: "Type", value: project.subcategory } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));
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

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <SEO
        title={scenicSeoTitle}
        description={scenicSeoDescription}
        image={project.coverImageUrl || undefined}
        imageAlt={`${project.title} scenic design cover image`}
        type="website"
        keywords={scenicSeoKeywords}
        url={projectUrl}
      />
      <Header />

      <main className="bg-[#111111]">
        <section
          className="project-hero-media site-media-square relative min-h-[64svh] overflow-hidden border-b border-white/10 bg-black md:min-h-[calc(100svh-74px)]"
          style={{ borderRadius: 0 }}
        >
          {project.coverImageUrl ? (
            <img
              src={project.coverImageUrl}
              alt={`${project.title} scenic design cover image`}
              className="project-hero-media site-media-square absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: project.coverImagePosition || "center", borderRadius: 0 }}
              loading="eager"
              fetchPriority="high"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.08)_52%,rgba(0,0,0,0.42)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.04)_58%,rgba(0,0,0,0.12)_100%)]" />
          <div
            className="absolute inset-0 transition-colors duration-200"
            style={{ backgroundColor: `rgba(0, 0, 0, ${heroProgress * 0.52})` }}
          />
          <header className="relative flex min-h-[64svh] w-full items-center justify-center px-[clamp(1.5rem,5vw,5.5rem)] py-14 text-center md:min-h-[calc(100svh-74px)] md:py-20">
            <div
              className="mx-auto max-w-[58rem] transition-opacity duration-150"
              style={{ opacity: heroTitleProgress }}
            >
              <div className="text-[0.82rem] font-semibold tracking-[-0.01em] text-white/72">
                Scenic Design
              </div>
              <h1 className="mx-auto mt-5 max-w-[13ch] font-sans text-[clamp(3.2rem,7vw,7.2rem)] font-normal leading-[0.9] tracking-[-0.07em] text-white">
                {project.title}
              </h1>
              <p className="mx-auto mt-7 max-w-[43rem] text-[clamp(1.02rem,1.35vw,1.28rem)] leading-[1.66] tracking-[-0.02em] text-white/82">
                {project.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-center gap-2">
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
          </header>
        </section>

        <section className="bg-[#111111] px-[clamp(1.5rem,5vw,5.5rem)] py-16 text-white md:py-20">
          <AnimatedSection>
            <div className="mx-auto grid w-full max-w-[96rem] gap-x-12 gap-y-12 text-[0.92rem] leading-[1.38] tracking-[-0.018em] md:grid-cols-[minmax(12rem,0.58fr)_minmax(24rem,1.08fr)_minmax(20rem,0.82fr)_minmax(14rem,0.52fr)]">
              <div className="space-y-8">
                <div>
                  <p className="mb-5 text-[0.82rem] font-medium uppercase tracking-[0.08em]">
                    Info
                  </p>
                  <p>{project.title}</p>
                  {project.client ? <p>{project.client}</p> : null}
                  {project.year ? <p>{project.year}</p> : null}
                </div>
                {projectMetaItems.length ? (
                  <dl className="space-y-2">
                    {projectMetaItems.map((item) => (
                      <div key={item.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4">
                        <dt>{item.label}:</dt>
                        <dd>
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>

              <div>
                <div className="text-[0.9rem] leading-[1.48] text-white">
                  {projectNarrativeSections.length ? (
                    hasNarrativeHeadings ? (
                      <div className="space-y-5">
                        {projectNarrativeSections.map((section, sectionIndex) => (
                          <div key={`${section.heading || "description"}-${sectionIndex}`} className="space-y-2.5">
                            {section.heading ? <p className="font-medium text-white">{section.heading}</p> : null}
                            {section.content.map((paragraph, paragraphIndex) => (
                              <p key={paragraphIndex}>{paragraph}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4 text-justify hyphens-auto [text-wrap:pretty]">
                        <p className="text-left">
                          <span className="text-[0.82rem] font-medium uppercase tracking-[0.08em] text-white">
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
                            className="inline-flex appearance-none items-center gap-1.5 border-0 bg-transparent p-0 pt-1 text-left text-[0.72rem] font-medium uppercase tracking-[0.12em] text-white/72 transition-colors hover:text-white"
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
                    <div className="space-y-4 text-justify hyphens-auto [text-wrap:pretty]">
                      <p className="text-left">
                        <span className="text-[0.82rem] font-medium uppercase tracking-[0.08em] text-white">
                          Description
                        </span>
                      </p>
                      <p>{project.excerpt}</p>
                    </div>
                  )}
                </div>
              </div>

              <div id="project-credits" className="scroll-mt-28">
                <p className="mb-5 text-[0.82rem] font-medium uppercase tracking-[0.08em]">
                  Credits
                </p>
                <div className="space-y-2">
                  {creativeTeamGroups.map((member) => (
                    <div
                      key={`${member.role}-${member.name}`}
                      className="grid min-w-0 grid-cols-[8.5rem_minmax(0,1fr)] gap-4"
                    >
                      <span>{getCreditRoleLabel(member.role)}:</span>
                      <span>
                        {member.url ? (
                          <a
                            href={member.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white"
                          >
                            {member.name}
                          </a>
                        ) : (
                          <CreditNameLinks
                            name={member.name}
                            className="underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white"
                          />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-5 text-[0.82rem] font-medium uppercase tracking-[0.08em]">
                  Tags
                </p>
                {project.tags.length ? (
                  <div className="space-y-1.5">
                    {project.tags.map((tag) => (
                      <Link
                        key={tag.slug}
                        href={`/tags/${tag.slug}`}
                        className="block underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                ) : null}

                {projectInfoLinks.length ? (
                  <div className="mt-9">
                    <p className="mb-5 text-[0.82rem] font-medium uppercase tracking-[0.08em]">
                      Links
                    </p>
                    <div className="space-y-3">
                      {projectInfoLinks.map((link) =>
                        link.external ? (
                          <a
                            key={`${link.kind}-${link.href}`}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start justify-between gap-3 underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          </a>
                        ) : (
                          <Link
                            key={`${link.kind}-${link.href}`}
                            href={link.href}
                            className="group flex items-start justify-between gap-3 underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white"
                          >
                            <span>{link.label}</span>
                            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section id="project-process" className="scroll-mt-28 bg-[#111111]">
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <div>
              {visualMediaItems.map((item, index) => {
                const isFullWidth =
                  item.mediaType === "image" && (index === 0 || item.display === "full" || item.display === "wide");
                const alignClass = isFullWidth
                  ? "w-screen"
                  : index % 2 === 0
                    ? "ml-auto w-full md:w-[50vw]"
                    : "mr-auto w-full md:w-[50vw]";

                return (
                  <AnimatedSection key={item.key} className="site-media-square">
                    <figure className="site-media-square space-y-4">
                      {item.mediaType === "image" ? (
                        <img
                          src={item.imageUrl}
                          alt={item.altText}
                          className={`site-media-square block bg-[#111111] object-contain ${alignClass} ${
                            isFullWidth ? "h-auto" : "aspect-[3/2]"
                          }`}
                          loading={index < 2 ? "eager" : "lazy"}
                          decoding={index < 2 ? "sync" : "async"}
                        />
                      ) : item.mediaType === "video" ? (
                        <div className={alignClass}>
                          <AutoPlayEmbed url={item.videoUrl} title={item.title} />
                        </div>
                      ) : (
                        <div className={`site-media-square relative aspect-[3/2] overflow-hidden bg-black ${alignClass}`}>
                          {item.items.map((rendering, renderingIndex) => (
                            <img
                              key={rendering.key}
                              src={rendering.imageUrl}
                              alt={rendering.altText}
                              className={`site-media-square absolute inset-0 h-full w-full bg-black object-contain transition-opacity duration-700 ${
                                renderingIndex === safeRenderingIndex ? "opacity-100" : "opacity-0"
                              }`}
                              loading={renderingIndex === 0 ? "eager" : "lazy"}
                              decoding={renderingIndex === 0 ? "sync" : "async"}
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
                          className={`max-w-[44rem] px-[clamp(1.5rem,5vw,5.5rem)] text-[0.9rem] leading-6 tracking-[-0.01em] text-white/48 ${
                            !isFullWidth && index % 2 === 0 ? "ml-auto md:w-[50vw]" : ""
                          }`}
                        >
                          {item.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {moreScenicProjects.length > 0 ? (
          <section className="bg-[#111111] border-t border-white/12 pt-16 text-white md:pt-24">
            <AnimatedSection>
              <div className="px-[clamp(1.5rem,5vw,6rem)] pb-10">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="max-w-[12ch] font-sans text-[clamp(2.6rem,5.6vw,6rem)] font-medium leading-[0.88] tracking-[-0.07em] text-white">
                    More scenic design.
                  </h2>
                  <Link
                    href="/projects"
                    className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-white/18 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-white/72 transition-colors hover:border-white/38 hover:text-white"
                  >
                    Portfolio index
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 border-l border-white/12 md:grid-cols-4">
                  {moreScenicProjects.map((item, index) => (
                    <Link
                      key={item.slug}
                      href={`/project/${item.slug}`}
                      className={`group block border-b border-r border-white/12 text-white ${
                        index % 6 < 2 ? "md:col-span-2" : ""
                      }`}
                    >
                      <article className="bg-[#111111]">
                        <div className="site-media-square relative aspect-[4/3] overflow-hidden bg-[#181818]">
                          {item.coverImageUrl ? (
                            <img
                              src={item.coverImageUrl}
                              alt={`${item.title} scenic design cover image`}
                              className="site-media-square h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-[0.88]"
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                        <div className="min-h-[8.5rem] border-t border-white/12 p-[clamp(0.9rem,1.5vw,1.2rem)] text-white">
                          <h3 className="max-w-[18ch] font-sans text-[clamp(1.2rem,1.7vw,1.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white transition-colors group-hover:text-white/72">
                            {item.title}
                          </h3>
                          {item.client ? (
                            <p className="mt-2 max-w-[18ch] font-sans text-[0.94rem] leading-tight tracking-[-0.025em] text-white/52">
                              {item.client}
                            </p>
                          ) : null}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
            </AnimatedSection>
          </section>
        ) : null}

      </main>

      <Footer />
    </div>
  );
}
