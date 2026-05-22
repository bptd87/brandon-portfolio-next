"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import { CreditNameLinks } from "@/components/CreditNameLinks";
import { copyTextToClipboard } from "@/lib/clipboard";
import { formatUtcDate } from "@/lib/date-format";
import { Button } from "@/components/ui/button";
import {
  getLocalScenicProjectBySlug,
  getLocalScenicProjects,
  type LocalScenicProjectMedia,
} from "@shared/localScenicProjects";
import { getLocalArticles } from "@shared/localArticles";
import { Check, ChevronLeft, ChevronRight, ExternalLink, Link2, Linkedin, Mail } from "lucide-react";

type ScenicProjectDetailProps = {
  slug?: string;
  currentPath?: string;
  params?: {
    slug?: string;
  };
};

type ImageOrientation = "landscape" | "portrait" | "square";

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

function useImageOrientation(src?: string | null): ImageOrientation {
  const [orientation, setOrientation] = useState<ImageOrientation>("landscape");

  useEffect(() => {
    if (!src) return;

    const image = new Image();
    image.src = src;
    image.onload = () => {
      const ratio = image.naturalWidth / image.naturalHeight;
      if (ratio > 1.08) {
        setOrientation("landscape");
      } else if (ratio < 0.92) {
        setOrientation("portrait");
      } else {
        setOrientation("square");
      }
    };
  }, [src]);

  return orientation;
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
    <div ref={wrapperRef} className="overflow-hidden rounded-2xl bg-black shadow-lg">
      <div className="relative h-[min(64vh,38rem)] w-full">
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

function ProjectGalleryFigure({
  item,
  onOpen,
  variant = "grid",
}: {
  item: LocalScenicProjectMedia & { imageUrl: string };
  onOpen: () => void;
  variant?: "single" | "lead" | "pair" | "grid" | "rail";
}) {
  const orientation = useImageOrientation(item.imageUrl);
  const isPortrait = item.display === "portrait" || orientation === "portrait";
  const shouldContain = item.display === "contain" || item.display === "portrait" || isPortrait;
  const isLead = variant === "lead";
  const isSingle = variant === "single";
  const isRail = variant === "rail";
  const aspectRatio = isPortrait
    ? "3 / 4"
    : orientation === "square"
      ? "1 / 1"
      : item.display === "full" || item.display === "wide" || isLead || isSingle
        ? "16 / 9"
        : "3 / 2";
  const sizes = isSingle
    ? "(min-width: 1280px) 80rem, calc(100vw - 2.5rem)"
    : isLead
      ? isPortrait
        ? "(min-width: 1280px) 42rem, (min-width: 768px) 62vw, calc(100vw - 2.5rem)"
        : "(min-width: 1280px) 88rem, calc(100vw - 2.5rem)"
      : variant === "pair" || variant === "rail"
        ? "(min-width: 1280px) 42rem, (min-width: 768px) 46vw, calc(100vw - 2.5rem)"
        : "(min-width: 1024px) 28vw, (min-width: 768px) 46vw, calc(100vw - 2.5rem)";
  const width = isLead || isSingle ? 1900 : variant === "pair" || variant === "rail" ? 1400 : 1100;

  if (isRail) {
    return (
      <figure className="site-media-square shrink-0 space-y-3">
        <button type="button" onClick={onOpen} className="site-media-square block text-left">
          <img
            src={item.imageUrl}
            alt={item.altText}
            className="site-media-square h-[clamp(16rem,32vw,30rem)] w-auto max-w-[84vw] bg-black object-contain transition-transform duration-500 hover:scale-[1.01]"
            loading="lazy"
            decoding="async"
          />
        </button>
        {item.caption ? (
          <figcaption className="max-w-[min(34rem,84vw)] text-[0.92rem] leading-6 tracking-[-0.01em] text-white/56">
            {item.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure
      className={`site-media-square space-y-3 ${isPortrait && (isLead || isSingle) ? "mx-auto max-w-[42rem]" : ""}`}
    >
      <button type="button" onClick={onOpen} className="site-media-square block w-full text-left">
        <ProgressiveImage
          src={item.imageUrl}
          alt={item.altText}
          className="site-media-square block w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
          containerClassName="site-media-square w-full"
          sizes={sizes}
          width={width}
          aspectRatio={aspectRatio}
          objectFit={shouldContain ? "contain" : "cover"}
          smartPosition
        />
      </button>
      {item.caption ? (
        <figcaption className="text-[0.92rem] leading-6 tracking-[-0.01em] text-white/56">
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [heroIntroProgress, setHeroIntroProgress] = useState(0);
  const [activeRenderingIndex, setActiveRenderingIndex] = useState(0);
  const heroIntroProgressRef = useRef(0);
  const introTouchYRef = useRef<number | null>(null);
  const moreScenicCardsRef = useRef<HTMLDivElement | null>(null);
  const galleryRailRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const allScenicProjects = getLocalScenicProjects();

  const scrollMoreScenicCards = (direction: "previous" | "next") => {
    moreScenicCardsRef.current?.scrollBy({
      left: direction === "next" ? 760 : -760,
      behavior: "smooth",
    });
  };

  const scrollGalleryRail = (key: string, direction: "previous" | "next") => {
    galleryRailRefs.current[key]?.scrollBy({
      left: direction === "next" ? 760 : -760,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const updateHeroScrollProgress = () => {
      setHeroScrollProgress(Math.min(Math.max(window.scrollY / 180, 0), 1));
    };

    updateHeroScrollProgress();
    window.addEventListener("scroll", updateHeroScrollProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateHeroScrollProgress);
  }, []);

  useEffect(() => {
    heroIntroProgressRef.current = 0;
    setHeroIntroProgress(0);

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
  }, [normalizedSlug]);

  const imageMedia = useMemo(
    () => (project?.media || []).filter((item): item is LocalScenicProjectMedia & { imageUrl: string } => item.type === "image" && !!item.imageUrl),
    [project]
  );
  const renderingMedia = useMemo(
    () => imageMedia.filter((item) => item.kind === "rendering"),
    [imageMedia]
  );

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
  const lightboxImages = imageMedia.map((item) => ({
    imageUrl: item.imageUrl || null,
    caption: item.caption || null,
    altText: item.altText || null,
  }));
  const imageIndexById = new Map(imageMedia.map((item, index) => [item.id, index]));

  const openLightboxFor = (mediaId: string) => {
    const index = imageIndexById.get(mediaId);
    if (index === undefined) return;
    setLightboxIndex(index);
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

  const productionGallerySectionIndexes: number[] = [];
  (() => {
    project.sections.forEach((section, index) => {
      if (section.type !== "gallery") return;

      const sectionItems = section.mediaIds
        .map((mediaId) => project.media.find((entry) => entry.id === mediaId))
        .filter(
          (item): item is LocalScenicProjectMedia & { imageUrl: string } =>
            Boolean(item && item.type === "image" && item.imageUrl)
        );
      const hasProductionImage = sectionItems.some((item) => item.kind === "production");
      const hasRenderingImage = sectionItems.some((item) => item.kind === "rendering");

      if (hasProductionImage && !hasRenderingImage) {
        productionGallerySectionIndexes.push(index);
      }
    });
  })();

  const lastProductionGalleryIndex = useMemo(() => {
    let found = -1;
    project.sections.forEach((section, index) => {
      if (
        section.type === "gallery" &&
        section.mediaIds.some((mediaId) => project.media.find((entry) => entry.id === mediaId)?.kind === "production")
      ) {
        found = index;
      }
    });
    return found;
  }, [project.media, project.sections]);

  const creativeTeamInsertIndex = useMemo(() => {
    if (lastProductionGalleryIndex < 0) return -1;
    const nextSection = project.sections[lastProductionGalleryIndex + 1];
    if (nextSection?.type === "text") {
      return lastProductionGalleryIndex + 1;
    }
    return lastProductionGalleryIndex;
  }, [lastProductionGalleryIndex, project.sections]);

  const creativeTeamGroups = useMemo(() => {
    return [...project.creativeTeam].sort((a, b) => {
      const priorityDiff = getCreditRolePriority(a.role) - getCreditRolePriority(b.role);
      if (priorityDiff !== 0) return priorityDiff;
      return getCreditRoleLabel(a.role).localeCompare(getCreditRoleLabel(b.role));
    });
  }, [project.creativeTeam]);

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
      });
  }, [allScenicProjects, project.slug, project.title]);

  const relatedArticles = useMemo(
    () =>
      getLocalArticles()
        .filter((article) => (article.linkedScenicProjectSlugs || []).includes(project.slug))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [project.slug]
  );
  const renderingFeatureImages = useMemo(
    () =>
      renderingMedia.map((image) => ({
        key: image.id,
        imageUrl: image.imageUrl,
        altText: image.altText || `${project.title} rendering image`,
        caption: image.caption || "",
      })),
    [project.title, renderingMedia]
  );

  useEffect(() => {
    setActiveRenderingIndex(0);
  }, [project.slug]);

  useEffect(() => {
    if (renderingFeatureImages.length <= 1) return;

    const timer = window.setTimeout(() => {
      setActiveRenderingIndex((current) => (current + 1) % renderingFeatureImages.length);
    }, 5200);

    return () => window.clearTimeout(timer);
  }, [activeRenderingIndex, renderingFeatureImages.length]);

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
  const heroProgress = Math.max(heroScrollProgress, heroIntroProgress);
  const heroTitleProgress = Math.min(Math.max((heroProgress - 0.08) / 0.92, 0), 1);

  const renderCreativeTeam = () => (
    <AnimatedSection>
      <div
        id="project-credits"
        className="relative left-1/2 w-screen -translate-x-1/2 scroll-mt-28 px-[clamp(1.5rem,5vw,5.5rem)] pt-16 md:pt-24"
      >
        <div className="mx-auto grid max-w-[54rem] gap-8 rounded-[1.8rem] bg-black px-6 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:px-8 md:py-10">
          <div>
            <p className="text-[clamp(1rem,1.35vw,1.22rem)] font-medium leading-none tracking-[-0.035em] text-white/46">
              Production Credits
            </p>
            <h2 className="mt-3 max-w-[11ch] font-sans text-[clamp(2.1rem,4vw,4.35rem)] font-medium leading-[0.9] tracking-[-0.07em] text-white">
              {project.title}
            </h2>
          </div>
          <div className="grid gap-x-10 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-2">
            {creativeTeamGroups.map((member) => {
              const roleLabel = getCreditRoleLabel(member.role);
              const content = (
                <>
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/38">
                    {roleLabel}
                  </span>
                  <span className="mt-1.5 block text-[1.02rem] leading-snug tracking-[-0.02em] text-white/84">
                    {member.url ? (
                      <a
                        href={member.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-white/78"
                      >
                        {member.name}
                      </a>
                    ) : (
                      <CreditNameLinks
                        name={member.name}
                        className="transition-colors hover:text-white/78"
                      />
                    )}
                  </span>
                </>
              );

              return (
                <div key={`${member.role}-${member.name}`} className="min-w-0">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );

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

      <main className="bg-[#111111] pb-20">
        <section
          className="project-hero-media site-media-square relative min-h-[calc(100svh-74px)] overflow-hidden border-b border-white/10 bg-black"
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
          <header className="relative flex min-h-[calc(100svh-74px)] w-full items-center justify-center px-[clamp(1.5rem,5vw,5.5rem)] py-20 text-center">
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
            </div>
          </header>
        </section>

        <section className="px-[clamp(1.5rem,5vw,5.5rem)] pt-28 md:pt-36">
          <AnimatedSection>
            <div className="mx-auto flex w-full max-w-[58rem] items-center justify-between gap-5 border-y border-white/16 py-4 text-white">
              <div className="min-w-0 text-[0.98rem] font-semibold tracking-[-0.025em] text-white/72">
                {project.client ? (
                  project.clientUrl ? (
                    <a
                      href={project.clientUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-0 items-center gap-2 transition-colors hover:text-white"
                    >
                      <Link2 className="h-4 w-4 shrink-0" />
                      <span className="truncate">{project.client}</span>
                    </a>
                  ) : (
                    <span>{project.client}</span>
                  )
                ) : (
                  <span>Scenic Design</span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label={linkCopied ? "Project link copied" : "Copy project link"}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/56 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                </button>
                <a
                  href={emailShareUrl}
                  aria-label="Share project by email"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/56 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href={linkedInShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share project on LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/56 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share project on Facebook"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[1rem] font-semibold leading-none text-white/56 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  f
                </a>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section id="project-process" className="container max-w-5xl scroll-mt-28 pt-24 md:pt-32">
          <div className="mx-auto max-w-[54rem] space-y-20 md:space-y-28">
            {project.sections.map((section, index) => (
              <div key={`${section.type}-${index}`} className="space-y-0">
                <AnimatedSection>
                  {section.type === "text" ? (
                    <div className="space-y-5">
                      {getDisplayHeading(section.heading) ? (
                        <h2 className="font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                          {getDisplayHeading(section.heading)}
                        </h2>
                      ) : null}
                      <div className="space-y-8">
                        {section.content.map((paragraph, paragraphIndex) => (
                          <p
                            key={paragraphIndex}
                            className="text-[1.04rem] leading-[1.9] tracking-[-0.01em] text-white/80"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {section.type === "gallery" ? (
                    (() => {
                      const galleryItems = section.mediaIds
                        .map((mediaId) => project.media.find((entry) => entry.id === mediaId))
                        .filter(
                          (item): item is LocalScenicProjectMedia & { imageUrl: string } =>
                            Boolean(item && item.type === "image" && item.imageUrl)
                        );
                      const isRenderingGallery =
                        galleryItems.length > 0 && galleryItems.every((item) => item.kind === "rendering");
                      if (isRenderingGallery) {
                        const safeRenderingIndex =
                          galleryItems.length > 0 ? activeRenderingIndex % galleryItems.length : 0;
                        const activeGalleryRendering = galleryItems[safeRenderingIndex] || galleryItems[0];

                        return (
                          <div className="relative left-1/2 w-screen -translate-x-1/2">
                            {getDisplayHeading(section.heading) ? (
                              <div className="px-5 pb-8 sm:px-8 lg:px-10">
                                <h2 className="mx-auto max-w-[54rem] font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                                  {getDisplayHeading(section.heading)}
                                </h2>
                              </div>
                            ) : null}
                            <figure className="site-media-square relative w-screen overflow-hidden bg-black">
                              <div className="site-media-square relative aspect-video w-screen bg-black">
                                {galleryItems.map((item, renderingIndex) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => openLightboxFor(item.id)}
                                    className={`site-media-square absolute inset-0 block h-full w-full text-left transition-opacity duration-700 ${
                                      renderingIndex === safeRenderingIndex ? "opacity-100" : "opacity-0"
                                    }`}
                                  >
                                    <img
                                      src={item.imageUrl}
                                      alt={item.altText}
                                      className="site-media-square absolute inset-0 h-full w-full bg-black object-cover"
                                      loading={renderingIndex === 0 ? "eager" : "lazy"}
                                      decoding={renderingIndex === 0 ? "sync" : "async"}
                                    />
                                  </button>
                                ))}
                                {galleryItems.length > 1 ? (
                                  <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/38 px-3 py-2 backdrop-blur-md">
                                    {galleryItems.map((item, renderingIndex) => (
                                      <button
                                        key={item.id}
                                        type="button"
                                        aria-label={`Show rendering image ${renderingIndex + 1}`}
                                        onClick={() => setActiveRenderingIndex(renderingIndex)}
                                        className={`h-1.5 overflow-hidden rounded-full transition-all duration-300 ${
                                          renderingIndex === safeRenderingIndex
                                            ? "w-12 bg-white/22"
                                            : "w-2.5 bg-white/38 hover:bg-white/58"
                                        }`}
                                      >
                                        {renderingIndex === safeRenderingIndex ? (
                                          <span
                                            key={`${item.id}-${safeRenderingIndex}`}
                                            className="rendering-progress-fill block h-full rounded-full bg-white"
                                          />
                                        ) : null}
                                      </button>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                              {activeGalleryRendering?.caption ? (
                                <figcaption className="mx-auto max-w-[58rem] px-5 pt-4 text-center text-[0.92rem] leading-6 tracking-[-0.01em] text-white/48">
                                  {activeGalleryRendering.caption}
                                </figcaption>
                              ) : null}
                            </figure>
                          </div>
                        );
                      }

                      const forceGrid = section.layout === "grid";
                      const forcePair = section.layout === "pair";
                      const forceLead = section.layout === "lead";
                      const galleryRailKey = `gallery-${index}`;
                      const isProductionOnlyGallery =
                        galleryItems.length > 0 && galleryItems.every((item) => item.kind === "production");
                      const isFinalProductionGallery =
                        isProductionOnlyGallery &&
                        index === lastProductionGalleryIndex &&
                        productionGallerySectionIndexes.length > 1;

                      if (
                        isFinalProductionGallery &&
                        galleryItems.length > 1 &&
                        !forcePair &&
                        !forceLead &&
                        !forceGrid
                      ) {
                        const featureItem = galleryItems[0];
                        const railItems = galleryItems.slice(1);

                        return (
                          <div className="relative left-1/2 w-screen -translate-x-1/2 space-y-10 px-[clamp(0.9rem,1.8vw,1.35rem)] md:space-y-12">
                            {getDisplayHeading(section.heading) ? (
                              <h2 className="mx-auto max-w-[54rem] font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                                {getDisplayHeading(section.heading)}
                              </h2>
                            ) : null}

                            <ProjectGalleryFigure
                              item={featureItem}
                              variant="lead"
                              onOpen={() => openLightboxFor(featureItem.id)}
                            />

                            <div className="space-y-5">
                              <div
                                ref={(element) => {
                                  galleryRailRefs.current[galleryRailKey] = element;
                                }}
                                className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                              >
                                <div className="flex min-w-max gap-[clamp(0.9rem,1.8vw,1.35rem)] pr-[clamp(0.9rem,1.8vw,1.35rem)]">
                                  {railItems.map((item) => (
                                    <div key={item.id} className="shrink-0">
                                      <ProjectGalleryFigure
                                        item={item}
                                        variant="rail"
                                        onOpen={() => openLightboxFor(item.id)}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {railItems.length > 1 ? (
                                <div className="flex justify-end gap-3">
                                  <button
                                    type="button"
                                    onClick={() => scrollGalleryRail(galleryRailKey, "previous")}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-white/62 transition-colors hover:bg-white hover:text-black"
                                    aria-label="Previous production images"
                                  >
                                    <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => scrollGalleryRail(galleryRailKey, "next")}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-white/72 transition-colors hover:bg-white hover:text-black"
                                    aria-label="Next production images"
                                  >
                                    <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      }

                      if (galleryItems.length === 1) {
                        const item = galleryItems[0];

                        return (
                          <div className="relative left-1/2 w-screen -translate-x-1/2 space-y-10 px-[clamp(0.9rem,1.8vw,1.35rem)] md:space-y-12">
                            {getDisplayHeading(section.heading) ? (
                              <h2 className="mx-auto max-w-[54rem] font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                                {getDisplayHeading(section.heading)}
                              </h2>
                            ) : null}
                            <ProjectGalleryFigure
                              item={item}
                              variant="single"
                              onOpen={() => openLightboxFor(item.id)}
                            />
                          </div>
                        );
                      }

                      if ((galleryItems.length === 2 || forcePair) && !forceLead && !forceGrid) {
                        return (
                          <div className="relative left-1/2 w-screen -translate-x-1/2 space-y-10 px-[clamp(0.9rem,1.8vw,1.35rem)] md:space-y-12">
                            {getDisplayHeading(section.heading) ? (
                              <h2 className="mx-auto max-w-[54rem] font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                                {getDisplayHeading(section.heading)}
                              </h2>
                            ) : null}
                            <div className="grid gap-[clamp(0.9rem,1.8vw,1.35rem)] md:grid-cols-2">
                              {galleryItems.map((item) => (
                                <ProjectGalleryFigure
                                  key={item.id}
                                  item={item}
                                  variant="pair"
                                  onOpen={() => openLightboxFor(item.id)}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      }

                      const firstPairItems = galleryItems.slice(0, 2);
                      const secondPairItems = galleryItems.slice(2, 4);
                      const featureItem = galleryItems[4];
                      const railItems = galleryItems.slice(5);

                      return (
                        <div className="relative left-1/2 w-screen -translate-x-1/2 space-y-10 px-[clamp(0.9rem,1.8vw,1.35rem)] md:space-y-12">
                          {getDisplayHeading(section.heading) ? (
                            <h2 className="mx-auto max-w-[54rem] font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                              {getDisplayHeading(section.heading)}
                            </h2>
                          ) : null}

                          {firstPairItems.length > 0 ? (
                            <div className="grid gap-[clamp(0.9rem,1.8vw,1.35rem)] md:grid-cols-2">
                              {firstPairItems.map((item) => (
                                <ProjectGalleryFigure
                                  key={item.id}
                                  item={item}
                                  variant="pair"
                                  onOpen={() => openLightboxFor(item.id)}
                                />
                              ))}
                            </div>
                          ) : null}

                          {secondPairItems.length > 0 ? (
                            secondPairItems.length === 1 ? (
                              <ProjectGalleryFigure
                                item={secondPairItems[0]}
                                variant="lead"
                                onOpen={() => openLightboxFor(secondPairItems[0].id)}
                              />
                            ) : (
                              <div className="grid gap-[clamp(0.9rem,1.8vw,1.35rem)] md:grid-cols-2">
                                {secondPairItems.map((item) => (
                                  <ProjectGalleryFigure
                                    key={item.id}
                                    item={item}
                                    variant="pair"
                                    onOpen={() => openLightboxFor(item.id)}
                                  />
                                ))}
                              </div>
                            )
                          ) : null}

                          {featureItem ? (
                            <ProjectGalleryFigure
                              item={featureItem}
                              variant="lead"
                              onOpen={() => openLightboxFor(featureItem.id)}
                            />
                          ) : null}

                          {railItems.length > 0 ? (
                            <div className="space-y-5">
                              <div
                                ref={(element) => {
                                  galleryRailRefs.current[galleryRailKey] = element;
                                }}
                                className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                              >
                                <div className="flex min-w-max gap-[clamp(0.9rem,1.8vw,1.35rem)] pr-[clamp(0.9rem,1.8vw,1.35rem)]">
                                  {railItems.map((item) => (
                                    <div key={item.id} className="shrink-0">
                                      <ProjectGalleryFigure
                                        item={item}
                                        variant="rail"
                                        onOpen={() => openLightboxFor(item.id)}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {railItems.length > 1 ? (
                                <div className="flex justify-end gap-3">
                                  <button
                                    type="button"
                                    onClick={() => scrollGalleryRail(galleryRailKey, "previous")}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-white/62 transition-colors hover:bg-white hover:text-black"
                                    aria-label="Previous production images"
                                  >
                                    <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => scrollGalleryRail(galleryRailKey, "next")}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-white/72 transition-colors hover:bg-white hover:text-black"
                                    aria-label="Next production images"
                                  >
                                    <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      );
                    })()
                  ) : null}

                  {section.type === "video" ? (
                    <div className="space-y-5">
                      {section.content?.map((paragraph, paragraphIndex) => (
                        <p
                          key={paragraphIndex}
                          className="text-[1.04rem] leading-[1.9] tracking-[-0.01em] text-white/80"
                        >
                          {paragraph}
                        </p>
                      ))}
                      {(() => {
                        const media = project.media.find((entry) => entry.id === section.mediaId);
                        if (!media?.videoUrl) return null;
                        return <AutoPlayEmbed url={media.videoUrl} title={`${project.title} walkthrough`} />;
                      })()}
                    </div>
                  ) : null}
                </AnimatedSection>
                {project.creativeTeam.length > 0 && index === creativeTeamInsertIndex ? renderCreativeTeam() : null}
              </div>
            ))}
          </div>
        </section>

        {(project.creativeTeam.length > 0 || project.links?.length || relatedArticles.length > 0 || moreScenicProjects.length > 0) ? (
          <section className="container max-w-[88rem] pt-14 md:pt-18">
            {(project.links?.length || relatedArticles.length > 0) ? (
              <AnimatedSection className="mb-20 md:mb-28">
                <div className="mx-auto max-w-[54rem] rounded-[1.55rem] bg-black px-6 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.26)] md:px-8 md:py-8">
                  <div className="mb-6 grid gap-3 border-b border-white/10 pb-6 md:grid-cols-[minmax(0,0.62fr)_minmax(18rem,0.38fr)] md:items-end">
                    <div>
                      <p className="text-[clamp(1rem,1.35vw,1.22rem)] font-medium leading-none tracking-[-0.035em] text-white/46">
                        Project links
                      </p>
                      <h2 className="mt-3 font-sans text-[clamp(1.8rem,3vw,3.1rem)] font-medium leading-[0.92] tracking-[-0.065em] text-white">
                        Related project context.
                      </h2>
                    </div>
                    <p className="max-w-[23rem] text-[0.98rem] leading-6 tracking-[-0.02em] text-white/54 md:justify-self-end">
                      Production pages and writing connected to this scenic design.
                    </p>
                  </div>
                  <div className="divide-y divide-white/10">
                    {relatedArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/articles/${article.slug}`}
                        className="group grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                      >
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem] font-medium tracking-[-0.01em] text-white/42">
                            <span>Article</span>
                            <span>{article.series?.name || article.categoryName}</span>
                            <span>{formatUtcDate(article.publishedAt, "short")}</span>
                          </div>
                          <h3 className="text-[1.15rem] leading-snug tracking-[-0.035em] text-white/88 transition-colors group-hover:text-white md:text-[1.32rem]">
                            {article.title}
                          </h3>
                        </div>
                        <span className="inline-flex items-center gap-2 text-[0.9rem] tracking-[-0.01em] text-white/42 transition-colors group-hover:text-white/72">
                          Read
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </Link>
                    ))}
                    {(project.links || []).map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                      >
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem] font-medium tracking-[-0.01em] text-white/42">
                            <span>Production page</span>
                            {project.year ? <span>{project.year}</span> : null}
                          </div>
                          <h3 className="text-[1.15rem] leading-snug tracking-[-0.035em] text-white/88 transition-colors group-hover:text-white md:text-[1.32rem]">
                            {link.label}
                          </h3>
                        </div>
                        <span className="inline-flex items-center gap-2 text-[0.9rem] tracking-[-0.01em] text-white/42 transition-colors group-hover:text-white/72">
                          Open
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ) : null}

            {moreScenicProjects.length > 0 ? (
              <AnimatedSection>
                <div className="relative left-1/2 w-screen -translate-x-1/2 border-t border-white/12 bg-[#111111] py-16 md:py-24">
                  <div className="px-[clamp(1.5rem,5vw,6rem)]">
                    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-none tracking-[-0.035em] text-white/46">
                          Scenic design portfolio
                        </p>
                        <h2 className="mt-3 max-w-[12ch] bg-gradient-to-r from-[#2f6dff] via-[#9d4edd] to-[#d6a8ff] bg-clip-text pb-[0.08em] font-sans text-[clamp(2.4rem,5.2vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.075em] text-transparent">
                          More scenic design.
                        </h2>
                      </div>
                      <Link
                        href="/projects"
                        className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-[#9d4edd]/72 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-[#e0aaff] transition-colors hover:border-[#c77dff] hover:text-white"
                      >
                        View portfolio
                      </Link>
                    </div>
                  </div>

                  <div
                    ref={moreScenicCardsRef}
                    className="overflow-x-auto px-[clamp(1.5rem,5vw,6rem)] pb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    <div className="flex min-w-max gap-5 pr-[clamp(1.5rem,5vw,6rem)]">
                      {moreScenicProjects.slice(0, 12).map((item) => (
                      <Link
                        key={item.slug}
                        href={`/project/${item.slug}`}
                        className="group relative flex h-[30rem] w-[min(21rem,78vw)] flex-col justify-end overflow-hidden rounded-[2rem] bg-black p-6 text-white shadow-[0_20px_58px_rgba(0,0,0,0.32)] ring-1 ring-white/[0.06] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_26px_68px_rgba(0,0,0,0.4)] md:w-[22rem]"
                        aria-label={`Scenic design project: ${item.title}`}
                      >
                        {item.coverImageUrl ? (
                          <img
                            src={item.coverImageUrl}
                            alt={`${item.title} scenic design image`}
                            className="site-media-square absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                            loading="lazy"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-black/18" />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/88 via-black/48 to-transparent" />
                        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/28 to-transparent" />

                        <div className="relative z-10">
                          <p className="font-sans text-[0.74rem] font-semibold tracking-[-0.015em] text-white/68">
                            {item.subcategory || "Scenic Design"}
                          </p>
                          <h3 className="mt-3 max-w-[13ch] font-sans text-[1.64rem] font-medium leading-[0.98] tracking-[-0.055em] text-white">
                            {item.title}
                          </h3>
                          <p className="mt-4 max-w-[18rem] text-[0.94rem] leading-6 tracking-[-0.012em] text-white/68">
                            {[item.client || item.subcategory, item.year].filter(Boolean).join(" / ")}
                          </p>
                        </div>
                      </Link>
                      ))}
                    </div>
                  </div>

                  <div className="-mt-5 flex justify-end gap-3 px-[clamp(1.5rem,5vw,6rem)]">
                    <button
                      type="button"
                      onClick={() => scrollMoreScenicCards("previous")}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-white/62 transition-colors hover:bg-white hover:text-black"
                      aria-label="Previous scenic design projects"
                    >
                      <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollMoreScenicCards("next")}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-white/72 transition-colors hover:bg-white hover:text-black"
                      aria-label="Next scenic design projects"
                    >
                      <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ) : null}
          </section>
        ) : null}
      </main>

      {lightboxIndex !== null ? (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((current) => (current === null ? current : Math.min(current + 1, lightboxImages.length - 1)))}
          onPrev={() => setLightboxIndex((current) => (current === null ? current : Math.max(current - 1, 0)))}
        />
      ) : null}
      <Footer />
    </div>
  );
}
