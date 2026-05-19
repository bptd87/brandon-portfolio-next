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
import { getLocalRenderingProjectForProduction } from "@shared/localPortfolios";
import { Check, Link2 } from "lucide-react";

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
  variant?: "single" | "lead" | "pair" | "grid";
}) {
  const orientation = useImageOrientation(item.imageUrl);
  const isPortrait = item.display === "portrait" || orientation === "portrait";
  const shouldContain = item.display === "contain" || item.display === "portrait" || isPortrait;
  const isLead = variant === "lead";
  const isSingle = variant === "single";
  const aspectRatio = isPortrait
    ? "3 / 4"
    : orientation === "square"
      ? "1 / 1"
      : item.display === "full" || item.display === "wide" || isLead || isSingle
        ? "16 / 9"
        : "4 / 3";
  const sizes = isSingle
    ? "(min-width: 1280px) 80rem, calc(100vw - 2.5rem)"
    : isLead
      ? isPortrait
        ? "(min-width: 1280px) 42rem, (min-width: 768px) 62vw, calc(100vw - 2.5rem)"
        : "(min-width: 1280px) 88rem, calc(100vw - 2.5rem)"
      : variant === "pair"
        ? "(min-width: 1280px) 42rem, (min-width: 768px) 46vw, calc(100vw - 2.5rem)"
        : "(min-width: 1024px) 28vw, (min-width: 768px) 46vw, calc(100vw - 2.5rem)";
  const width = isLead || isSingle ? 1900 : variant === "pair" ? 1400 : 1100;

  return (
    <figure
      className={`space-y-3 ${isPortrait && (isLead || isSingle) ? "mx-auto max-w-[42rem]" : ""}`}
    >
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <ProgressiveImage
          src={item.imageUrl}
          alt={item.altText}
          className="block w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
          containerClassName="w-full"
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
  const allScenicProjects = getLocalScenicProjects();

  const imageMedia = useMemo(
    () => (project?.media || []).filter((item): item is LocalScenicProjectMedia & { imageUrl: string } => item.type === "image" && !!item.imageUrl),
    [project]
  );
  const productionImages = useMemo(
    () => imageMedia.filter((item) => item.kind === "production"),
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
  const lightboxImages = imageMedia.map((item) => ({
    imageUrl: item.imageUrl || null,
    caption: item.caption || null,
    altText: item.altText || null,
  }));
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const projectDateLabel = project.year
    ? project.month && project.month >= 1 && project.month <= 12
      ? `${monthNames[project.month - 1]} ${project.year}`
      : `${project.year}`
    : null;
  const directorCredit =
    project.creativeTeam.find((member) => {
      const role = member.role.toLowerCase().trim();
      return (
        role === "director" ||
        role.includes("directed") ||
        (role.includes("director") &&
          !role.includes("associate") &&
          !role.includes("music director"))
      );
    })?.name || null;
  const productionRecordItems = [
    project.client
      ? { label: "Company", value: project.client, href: project.clientUrl || null }
      : null,
    project.location ? { label: "Location", value: project.location, href: null } : null,
    projectDateLabel ? { label: "Date", value: projectDateLabel, href: null } : null,
    directorCredit ? { label: "Director", value: directorCredit, href: null } : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href: string | null }>;

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
  const relatedRenderingProject = useMemo(
    () =>
      getLocalRenderingProjectForProduction({
        title: project.title,
        client: project.client,
        year: project.year,
      }),
    [project.client, project.title, project.year]
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

  const renderCreativeTeam = () => (
    <AnimatedSection>
      <div
        id="project-credits"
        className="relative left-1/2 w-screen max-w-[88rem] -translate-x-1/2 scroll-mt-28 px-5 pt-16 sm:px-8 md:pt-24 lg:px-10"
      >
        <div className="grid gap-8 border-y border-white/14 py-8 md:grid-cols-[minmax(12rem,0.45fr)_minmax(0,1fr)] md:gap-14 md:py-10">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/44">
              Production Credits
            </p>
            <h2 className="mt-3 font-sans text-[clamp(1.75rem,3vw,3.1rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">
              {project.title}
            </h2>
          </div>
          <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {creativeTeamGroups.map((member) => {
              const roleLabel = getCreditRoleLabel(member.role);
              const content = (
                <>
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/44">
                    {roleLabel}
                  </span>
                  <span className="mt-1.5 block text-[1rem] leading-snug tracking-[-0.02em] text-white/82">
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
    <div className="min-h-screen bg-black text-white">
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

      <main className="pb-20">
        <section className="relative min-h-[calc(100svh-74px)] overflow-hidden border-b border-white/10 bg-black">
          {project.coverImageUrl ? (
            <img
              src={project.coverImageUrl}
              alt={`${project.title} scenic design cover image`}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: project.coverImagePosition || "center" }}
              loading="eager"
              fetchPriority="high"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.2)_52%,rgba(0,0,0,0.84)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.1)_58%,rgba(0,0,0,0.3)_100%)]" />
          <AnimatedSection>
            <header className="relative flex min-h-[calc(100svh-74px)] w-full items-end px-[clamp(1.5rem,5vw,5.5rem)] pb-10 pt-20 md:pb-16">
              <div className="max-w-[76rem]">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-white/72">
                  <span>{project.subcategory || "Scenic Design"}</span>
                  {projectDateLabel ? <span>{projectDateLabel}</span> : null}
                </div>
                <h1 className="mt-5 max-w-[14ch] font-sans text-[clamp(3.1rem,7vw,7.4rem)] font-normal leading-[0.88] tracking-[-0.07em] text-white">
                  {project.title}
                </h1>
                <p className="mt-7 max-w-[44rem] text-[clamp(1.02rem,1.35vw,1.28rem)] leading-[1.66] tracking-[-0.02em] text-white/82">
                  {project.excerpt}
                </p>
                <nav
                  aria-label="Project sections"
                  className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.94rem] tracking-[-0.02em] text-white/72"
                >
                  <a href="#project-process" className="transition-colors hover:text-white">
                    Process
                  </a>
                  {project.creativeTeam.length > 0 ? (
                    <a href="#project-credits" className="transition-colors hover:text-white">
                      Credits
                    </a>
                  ) : null}
                </nav>
              </div>
            </header>
          </AnimatedSection>
        </section>

        <section className="px-[clamp(1.5rem,5vw,5.5rem)]">
          <AnimatedSection>
            <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 border-b border-white/14 py-5 text-white md:flex-row md:items-center md:justify-between">
              <dl className="flex flex-1 flex-wrap items-center gap-x-7 gap-y-3">
                {productionRecordItems.map((item) => (
                  <div key={item.label} className="flex items-baseline gap-2">
                    <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/42">
                      {item.label}
                    </dt>
                    <dd className="text-[0.94rem] leading-snug tracking-[-0.02em] text-white/80">
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-white"
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 self-start text-[0.96rem] tracking-[-0.02em] text-white/72 transition-colors hover:text-white"
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                <span>{linkCopied ? "Link copied" : "Share"}</span>
              </button>
            </div>
          </AnimatedSection>
        </section>

        <section id="project-process" className="container max-w-5xl scroll-mt-28 pt-14 md:pt-18">
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
                      const forceGrid = section.layout === "grid";
                      const forcePair = section.layout === "pair";
                      const forceLead = section.layout === "lead";

                      if (galleryItems.length === 1) {
                        const item = galleryItems[0];

                        return (
                          <div className="relative left-1/2 w-screen max-w-[88rem] -translate-x-1/2 space-y-10 px-5 sm:px-8 md:space-y-12 lg:px-10">
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

                      const leadItem = forceGrid ? null : galleryItems[0];
                      const remainingItems = forceGrid ? galleryItems : galleryItems.slice(1);

                      return (
                        <div className="relative left-1/2 w-screen max-w-[88rem] -translate-x-1/2 space-y-10 px-5 sm:px-8 md:space-y-12 lg:px-10">
                          {getDisplayHeading(section.heading) ? (
                            <h2 className="mx-auto max-w-[54rem] font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                              {getDisplayHeading(section.heading)}
                            </h2>
                          ) : null}
                          {(galleryItems.length === 2 || forcePair) && !forceLead && !forceGrid ? (
                            <div className="grid gap-8 md:grid-cols-2">
                              {galleryItems.map((item) => (
                                <ProjectGalleryFigure
                                  key={item.id}
                                  item={item}
                                  variant="pair"
                                  onOpen={() => openLightboxFor(item.id)}
                                />
                              ))}
                            </div>
                          ) : null}
                          {(galleryItems.length > 2 || forceLead) && leadItem && !forcePair ? (
                            <ProjectGalleryFigure
                              item={leadItem}
                              variant="lead"
                              onOpen={() => openLightboxFor(leadItem.id)}
                            />
                          ) : null}
                          {(galleryItems.length > 2 || forceGrid) && remainingItems.length > 0 && !forcePair ? (
                            <div className="flex flex-wrap justify-center gap-8">
                              {remainingItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
                                >
                                  <ProjectGalleryFigure
                                    item={item}
                                    variant="grid"
                                    onOpen={() => openLightboxFor(item.id)}
                                  />
                                </div>
                              ))}
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

        {(project.creativeTeam.length > 0 || project.links?.length || relatedArticles.length > 0 || relatedRenderingProject || moreScenicProjects.length > 0) ? (
          <section className="container max-w-[88rem] pt-14 md:pt-18">
            {(project.links?.length || relatedArticles.length > 0 || relatedRenderingProject) ? (
              <AnimatedSection>
                <div className="border-t border-white/14 pt-7">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/44">
                      Project Links
                    </p>
                  </div>
                  <div className="divide-y divide-white/10">
                    {relatedRenderingProject ? (
                      <Link
                        key={relatedRenderingProject.slug}
                        href={`/projects/rendering/${relatedRenderingProject.slug}`}
                        className="group grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="relative h-16 w-16 flex-none overflow-hidden bg-black/85">
                            {relatedRenderingProject.coverImageUrl ? (
                              <ProgressiveImage
                                src={relatedRenderingProject.coverImageUrl}
                                alt={`${relatedRenderingProject.title} rendering series cover image`}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                containerClassName="h-full w-full"
                                sizes="4rem"
                                width={160}
                                aspectRatio="1 / 1"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[1.02rem] leading-snug tracking-[-0.02em] text-white/88 transition-colors group-hover:text-white">
                              {relatedRenderingProject.title}
                            </h3>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.86rem] tracking-[-0.01em] text-white/48">
                              <span>Rendering Series</span>
                              {relatedRenderingProject.client ? <span>{relatedRenderingProject.client}</span> : null}
                              {relatedRenderingProject.year ? <span>{relatedRenderingProject.year}</span> : null}
                            </div>
                          </div>
                        </div>
                        <span className="text-[0.86rem] tracking-[-0.01em] text-white/42 transition-colors group-hover:text-white/72">
                          View
                        </span>
                      </Link>
                    ) : null}
                    {relatedArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/articles/${article.slug}`}
                        className="group grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="relative h-16 w-16 flex-none overflow-hidden bg-black/85">
                            {article.coverImageUrl ? (
                              <ProgressiveImage
                                src={article.coverImageUrl}
                                alt={article.coverImageAlt || `${article.title} article cover image`}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                containerClassName="h-full w-full"
                                sizes="4rem"
                                width={160}
                                aspectRatio="1 / 1"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[1.02rem] leading-snug tracking-[-0.02em] text-white/88 transition-colors group-hover:text-white">
                              {article.title}
                            </h3>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.86rem] tracking-[-0.01em] text-white/48">
                              <span>{article.series?.name || article.categoryName}</span>
                              <span>{formatUtcDate(article.publishedAt, "short")}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[0.86rem] tracking-[-0.01em] text-white/42 transition-colors group-hover:text-white/72">
                          Read
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
                            <h3 className="text-[1.02rem] leading-snug tracking-[-0.02em] text-white/88 transition-colors group-hover:text-white">
                              {link.label}
                            </h3>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.86rem] tracking-[-0.01em] text-white/48">
                              <span>External Production Link</span>
                              {project.year ? <span>{project.year}</span> : null}
                            </div>
                          </div>
                          <span className="text-[0.86rem] tracking-[-0.01em] text-white/42 transition-colors group-hover:text-white/72">
                            Open
                          </span>
                        </a>
                      ))}
                  </div>
                </div>
              </AnimatedSection>
            ) : null}

            {moreScenicProjects.length > 0 ? (
              <AnimatedSection>
                <div className="pt-14 md:pt-18">
                  <div className="mb-6 h-px w-full bg-border/60" />
                  <p className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/44">
                    More Scenic Designs
                  </p>
                  <div className="grid gap-x-8 gap-y-0 border-y border-white/10 md:grid-cols-2">
                    {moreScenicProjects.slice(0, 12).map((item) => (
                      <Link
                        key={item.slug}
                        href={`/project/${item.slug}`}
                        className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-white/10 py-4 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0"
                      >
                        <div className="min-w-0">
                          <h3 className="truncate text-[1rem] font-normal tracking-[-0.02em] text-white/82 transition-colors group-hover:text-white">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-[0.86rem] tracking-[-0.01em] text-white/45">
                            {[item.client || item.subcategory, item.year].filter(Boolean).join("  ")}
                          </p>
                        </div>
                        <span className="text-[0.84rem] text-white/35 transition-colors group-hover:text-white/68">
                          View
                        </span>
                      </Link>
                    ))}
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
