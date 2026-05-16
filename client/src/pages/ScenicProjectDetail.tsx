"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
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
    const rolePriority = (role: string) => {
      const normalized = role.toLowerCase().trim();
      if (normalized.includes("music and lyrics")) return 0;
      if (normalized.includes("book by")) return 0;
      if (normalized.includes("written by") || normalized === "by" || normalized.includes("playwright") || normalized.includes("created by")) return 1;
      if (normalized.includes("adapted by")) return 2;
      if (normalized === "lyrics by") return 3;
      if (normalized === "music by") return 4;
      if (normalized.includes("original concept")) return 5;
      if (normalized.includes("directed")) return 6;
      if (normalized === "director" || (normalized.includes("director") && !normalized.includes("associate") && !normalized.includes("music director"))) return 6;
      if (normalized.includes("associate director")) return 7;
      if (normalized.includes("choreo")) return 8;
      if (normalized.includes("music director")) return 9;
      if (normalized.includes("scenic")) return 10;
      if (normalized.includes("costume")) return 11;
      if (normalized.includes("lighting")) return 12;
      if (normalized.includes("sound")) return 13;
      if (normalized.includes("projection")) return 14;
      if (normalized.includes("assistant")) return 15;
      return 50;
    };

    return [...project.creativeTeam]
      .filter((member) => {
        const normalizedName = member.name.toLowerCase().trim();
        const normalizedRole = member.role.toLowerCase().trim();
        return !(normalizedName === "brandon pt davis" && normalizedRole.includes("scenic"));
      })
      .sort((a, b) => {
        const priorityDiff = rolePriority(a.role) - rolePriority(b.role);
        if (priorityDiff !== 0) return priorityDiff;
        return a.role.localeCompare(b.role);
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
              const normalizedRole = member.role.toLowerCase().trim();
              const isDirectorCredit =
                normalizedRole === "director" ||
                normalizedRole.includes("directed") ||
                (normalizedRole.includes("director") &&
                  !normalizedRole.includes("associate") &&
                  !normalizedRole.includes("music director"));
              const content = (
                <>
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/44">
                    {isDirectorCredit ? "Directed by" : member.role}
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
            <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 border-b border-white/14 py-5 text-white md:flex-row md:items-start md:justify-between">
              <dl className="grid flex-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                {productionRecordItems.map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/42">
                      {item.label}
                    </dt>
                    <dd className="text-[0.96rem] leading-snug tracking-[-0.02em] text-white/82">
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
          <div className="mx-auto max-w-[54rem] space-y-24 md:space-y-32">
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
                            className="text-[1.03rem] leading-[1.9] tracking-[-0.01em] text-white/72"
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
                      if (galleryItems.length === 1) {
                        const item = galleryItems[0];

                        return (
                          <div className="relative left-1/2 w-screen max-w-[88rem] -translate-x-1/2 space-y-10 px-5 sm:px-8 md:space-y-12 lg:px-10">
                            {getDisplayHeading(section.heading) ? (
                              <h2 className="mx-auto max-w-[54rem] font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                                {getDisplayHeading(section.heading)}
                              </h2>
                            ) : null}
                            <figure className="mx-auto w-full max-w-[80rem] space-y-3">
                              <button
                                type="button"
                                onClick={() => openLightboxFor(item.id)}
                                className="block w-full text-left"
                              >
                                <ProgressiveImage
                                  src={item.imageUrl}
                                  alt={item.altText}
                                  className="block w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
                                  containerClassName="w-full"
                                  sizes="(min-width: 1280px) 80rem, calc(100vw - 2.5rem)"
                                  width={1800}
                                  aspectRatio="16 / 9"
                                  smartPosition
                                />
                              </button>
                              {item.caption ? (
                                <figcaption className="text-[0.92rem] leading-6 tracking-[-0.01em] text-white/56">
                                  {item.caption}
                                </figcaption>
                              ) : null}
                            </figure>
                          </div>
                        );
                      }

                      const firstPair = galleryItems.slice(0, 2);
                      const remainingItems = galleryItems.slice(2);

                      return (
                        <div className="relative left-1/2 w-screen max-w-[88rem] -translate-x-1/2 space-y-10 px-5 sm:px-8 md:space-y-12 lg:px-10">
                          {getDisplayHeading(section.heading) ? (
                            <h2 className="mx-auto max-w-[54rem] font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                              {getDisplayHeading(section.heading)}
                            </h2>
                          ) : null}
                          {firstPair.length > 0 ? (
                            <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1.55fr)_minmax(16rem,0.82fr)] md:gap-16 lg:gap-24">
                              {firstPair.map((item, itemIndex) => (
                                <figure
                                  key={item.id}
                                  className={`self-end space-y-3 ${itemIndex === 1 ? "md:pb-10 lg:pb-14" : ""}`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => openLightboxFor(item.id)}
                                    className="block w-full text-left"
                                  >
                                    <ProgressiveImage
                                      src={item.imageUrl}
                                      alt={item.altText}
                                      className="block w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
                                      containerClassName="w-full"
                                      sizes={
                                        itemIndex === 0
                                          ? "(min-width: 1280px) 52rem, (min-width: 768px) 58vw, calc(100vw - 2.5rem)"
                                          : "(min-width: 1280px) 28rem, (min-width: 768px) 32vw, calc(100vw - 2.5rem)"
                                      }
                                      width={itemIndex === 0 ? 1800 : 1100}
                                      aspectRatio="4 / 3"
                                    />
                                  </button>
                                  {item.caption ? (
                                    <figcaption className="text-[0.92rem] leading-6 tracking-[-0.01em] text-white/56">
                                      {item.caption}
                                    </figcaption>
                                  ) : null}
                                </figure>
                              ))}
                            </div>
                          ) : null}
                          {remainingItems.length > 0 ? (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                              {remainingItems.map((item) => (
                                <figure key={item.id} className="space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => openLightboxFor(item.id)}
                                    className="block w-full text-left"
                                  >
                                    <ProgressiveImage
                                      src={item.imageUrl}
                                      alt={item.altText}
                                      className="block w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
                                      containerClassName="w-full"
                                      sizes="(min-width: 1024px) 28vw, (min-width: 768px) 46vw, calc(100vw - 2.5rem)"
                                      width={1100}
                                      aspectRatio="4 / 3"
                                    />
                                  </button>
                                  {item.caption ? (
                                    <figcaption className="text-[0.92rem] leading-6 tracking-[-0.01em] text-white/56">
                                      {item.caption}
                                    </figcaption>
                                  ) : null}
                                </figure>
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
                          className="text-[1.03rem] leading-[1.9] tracking-[-0.01em] text-white/72"
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
          <section className="container max-w-[88rem] pt-16 md:pt-20">
            {(project.links?.length || relatedArticles.length > 0 || relatedRenderingProject) ? (
              <AnimatedSection>
                <div className="pt-18 md:pt-24">
                  <div className="mb-8 flex items-center justify-between gap-4 border-t border-white/14 pt-6">
                    <p className="font-sans text-[1.15rem] tracking-[-0.02em] text-white">
                      Related Project Links
                    </p>
                  </div>
                  <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
                    {relatedRenderingProject ? (
                      <Link key={relatedRenderingProject.slug} href={`/projects/rendering/${relatedRenderingProject.slug}`}>
                        <div className="group flex cursor-pointer items-start gap-5">
                          <div className="relative h-36 w-36 flex-none overflow-hidden bg-black/85">
                            {relatedRenderingProject.coverImageUrl ? (
                              <ProgressiveImage
                                src={relatedRenderingProject.coverImageUrl}
                                alt={`${relatedRenderingProject.title} rendering series cover image`}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                containerClassName="h-full w-full"
                                sizes="9rem"
                                width={288}
                                aspectRatio="1 / 1"
                              />
                            ) : null}
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,71,0.08)_0%,rgba(22,64,133,0.16)_55%,rgba(10,18,38,0.42)_100%)]" />
                          </div>
                          <div className="min-w-0 pt-1">
                            <h3 className="text-[1.22rem] leading-[1.18] tracking-[-0.03em] text-white/92 transition-colors group-hover:text-white">
                              {relatedRenderingProject.title}
                            </h3>
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] tracking-[-0.01em] text-white/52">
                              <span>Rendering Series</span>
                              {relatedRenderingProject.client ? <span>{relatedRenderingProject.client}</span> : null}
                              {relatedRenderingProject.year ? <span>{relatedRenderingProject.year}</span> : null}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null}
                    {relatedArticles.map((article) => (
                      <Link key={article.slug} href={`/articles/${article.slug}`}>
                        <div className="group flex cursor-pointer items-start gap-5">
                          <div className="relative h-36 w-36 flex-none overflow-hidden bg-black/85">
                            {article.coverImageUrl ? (
                              <ProgressiveImage
                                src={article.coverImageUrl}
                                alt={article.coverImageAlt || `${article.title} article cover image`}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                containerClassName="h-full w-full"
                                sizes="9rem"
                                width={288}
                                aspectRatio="1 / 1"
                              />
                            ) : null}
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,71,0.08)_0%,rgba(22,64,133,0.16)_55%,rgba(10,18,38,0.42)_100%)]" />
                          </div>
                          <div className="min-w-0 pt-1">
                            <h3 className="text-[1.22rem] leading-[1.18] tracking-[-0.03em] text-white/92 transition-colors group-hover:text-white">
                              {article.title}
                            </h3>
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] tracking-[-0.01em] text-white/52">
                              <span>{article.series?.name || article.categoryName}</span>
                              <span>{formatUtcDate(article.publishedAt, "short")}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {(project.links || []).map((link, linkIndex) => {
                      const previewImage = productionImages[linkIndex % Math.max(productionImages.length, 1)];
                      return (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-start gap-5"
                        >
                          <div className="relative h-36 w-36 flex-none overflow-hidden bg-black/85">
                            {previewImage?.imageUrl ? (
                              <ProgressiveImage
                                src={previewImage.imageUrl}
                                alt={previewImage.altText || `${link.label} related coverage image`}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                containerClassName="h-full w-full"
                                sizes="9rem"
                                width={288}
                                aspectRatio="1 / 1"
                              />
                            ) : null}
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,71,0.18)_0%,rgba(22,64,133,0.42)_55%,rgba(10,18,38,0.74)_100%)]" />
                          </div>
                          <div className="min-w-0 pt-1">
                            <h3 className="text-[1.22rem] leading-[1.18] tracking-[-0.03em] text-white/92 transition-colors group-hover:text-white">
                              {link.label}
                            </h3>
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] tracking-[-0.01em] text-white/52">
                              <span>Production Link</span>
                              {project.year ? <span>{project.year}</span> : null}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </AnimatedSection>
            ) : null}

            {moreScenicProjects.length > 0 ? (
              <AnimatedSection>
                <div className="pt-18 md:pt-24">
                  <div className="mb-12 h-px w-full bg-border/60" />
                  <p className="mb-8 font-sans text-[1.15rem] tracking-[-0.02em] text-white">
                    More Scenic Designs
                  </p>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                    {moreScenicProjects.map((item) => (
                      <Link key={item.slug} href={`/project/${item.slug}`} className="group block">
                        <div className="relative aspect-[4/3] overflow-hidden bg-black/85">
                          {item.coverImageUrl ? (
                            <ProgressiveImage
                              src={item.coverImageUrl}
                              alt={`${item.title} scenic design project cover image`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              containerClassName="h-full w-full"
                              sizes="(min-width: 768px) 30vw, 96vw"
                              width={900}
                              aspectRatio="4 / 3"
                            />
                          ) : <div className="h-full w-full bg-muted" />}
                        </div>
                        <div className="pt-3">
                          <h3 className="text-[1.02rem] font-normal tracking-[-0.02em] text-white/88 transition-colors group-hover:text-white">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-[0.92rem] tracking-[-0.01em] text-white/52">
                            {[item.client || item.subcategory, item.year].filter(Boolean).join("  ")}
                          </p>
                        </div>
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
    </div>
  );
}
