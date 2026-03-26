"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import ScenicRenderingGallery from "@/components/ScenicRenderingGallery";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { formatUtcDate } from "@/lib/date-format";
import { Button } from "@/components/ui/button";
import { getLocalScenicProjectBySlug, getLocalScenicProjects, type LocalScenicProjectMedia } from "@shared/localScenicProjects";
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

  const imageIndexById = new Map(imageMedia.map((item, index) => [item.id, index]));

  const openLightboxFor = (mediaId: string) => {
    const index = imageIndexById.get(mediaId);
    if (index === undefined) return;
    setLightboxIndex(index);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } catch {
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
      if (normalized.includes("music director")) return 6;
      if (normalized.includes("directed")) return 99;
      if (normalized === "director" || (normalized.includes("director") && !normalized.includes("associate"))) return 99;
      if (normalized.includes("associate director") || normalized.includes("choreo")) return 7;
      if (normalized.includes("scenic")) return 8;
      if (normalized.includes("costume")) return 9;
      if (normalized.includes("lighting")) return 10;
      if (normalized.includes("sound")) return 11;
      if (normalized.includes("projection")) return 12;
      if (normalized.includes("assistant")) return 13;
      return 50;
    };

    return [...project.creativeTeam].sort((a, b) => {
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
      <div className="pt-20 md:pt-28">
        <div className="mx-auto w-full max-w-[24rem]">
          <div className="space-y-6 text-center md:space-y-7">
            <div className="space-y-2">
              <span className="block font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                Production
              </span>
              <span className="block font-sans text-[2.05rem] font-semibold uppercase tracking-[-0.03em] text-white md:text-[2.55rem]">
                {project.title}
              </span>
            </div>
            {creativeTeamGroups.map((member) => {
              const normalizedRole = member.role.toLowerCase().trim();
              const isAuthorshipCredit =
                normalizedRole.includes("book by") ||
                normalizedRole.includes("written by") ||
                normalizedRole === "by" ||
                normalizedRole.includes("playwright") ||
                normalizedRole.includes("created by") ||
                normalizedRole.includes("adapted by") ||
                normalizedRole === "music by" ||
                normalizedRole === "lyrics by" ||
                normalizedRole === "music and lyrics";
              const isDirectorCredit =
                normalizedRole === "director" ||
                normalizedRole.includes("directed") ||
                (normalizedRole.includes("director") &&
                  !normalizedRole.includes("associate") &&
                  !normalizedRole.includes("music director"));
              const content = (
                <>
                  <span
                    className={`block font-sans font-semibold uppercase tracking-[0.1em] text-white/58 ${
                      isDirectorCredit ? "text-[0.82rem]" : "text-[0.68rem]"
                    }`}
                  >
                    {isDirectorCredit ? "Directed by" : member.role}
                  </span>
                  <span
                    className={`mt-2 block font-sans tracking-[-0.03em] text-white ${
                      isDirectorCredit
                        ? "text-[2.4rem] font-semibold leading-[1.02]"
                        : isAuthorshipCredit
                          ? "text-[1.28rem] font-semibold leading-[1.12]"
                          : "text-[1.18rem] font-normal leading-[1.14]"
                    }`}
                  >
                    {member.name}
                  </span>
                </>
              );

              return member.url ? (
                <a
                  key={`${member.role}-${member.name}`}
                  href={member.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-colors hover:text-white"
                >
                  {content}
                </a>
              ) : (
                <div key={`${member.role}-${member.name}`}>
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
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Projects", url: "https://www.brandonptdavis.com/projects" },
          { name: project.title, url: projectUrl },
        ]}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: project.title,
          description: scenicSeoDescription,
          image: project.coverImageUrl || undefined,
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          dateCreated: project.year ? `${project.year}-01-01` : undefined,
          datePublished: project.publishedAt || undefined,
          dateModified: project.updatedAt || undefined,
          genre: project.subcategory || "Scenic Design",
          keywords: scenicSeoKeywords.split(",").map((part) => part.trim()).filter(Boolean),
          mainEntityOfPage: projectUrl,
          url: projectUrl,
          locationCreated: project.client
            ? {
                name: project.client,
                ...(project.location
                  ? {
                      address: {
                        addressLocality: project.location,
                      },
                    }
                  : {}),
              }
            : undefined,
          workExample:
            imageMedia.slice(0, 12).map((item) => ({
              type: "ImageObject" as const,
              contentUrl: item.imageUrl,
              caption: item.caption || undefined,
              name: item.altText || `${project.title} scenic design image`,
              description: item.caption || scenicSeoDescription,
              thumbnailUrl: item.imageUrl,
            })) || undefined,
          contributor:
            project.creativeTeam.map((member) => ({
              type: "Person" as const,
              name: member.name,
              roleName: member.role,
            })) || undefined,
          isPartOf: {
            name: "Scenic Design Portfolio",
            url: "https://www.brandonptdavis.com/projects",
          },
          mentions: [
            ...(relatedRenderingProject
              ? [
                  {
                    type: "CreativeWork",
                    name: `${relatedRenderingProject.title} rendering series`,
                    url: `https://www.brandonptdavis.com/projects/rendering/${relatedRenderingProject.slug}`,
                  },
                ]
              : []),
            ...relatedArticles.slice(0, 3).map((article) => ({
              type: "Article",
              name: article.title,
              url: `https://www.brandonptdavis.com/articles/${article.slug}`,
            })),
          ],
        }}
      />
      <Header />

      <main className="pb-20">
        <section className="px-6 pt-12 md:px-10 md:pt-16">
          <AnimatedSection>
            <header className="mx-auto flex w-full max-w-[62rem] flex-col items-center text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.98rem] tracking-[-0.02em] text-white/56">
                {projectDateLabel ? <span>{projectDateLabel}</span> : null}
                <span>{project.subcategory || "Scenic Design"}</span>
              </div>
              <h1 className="mt-8 max-w-[12ch] font-sans text-[clamp(3rem,7vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.07em] text-white">
                {project.title}
              </h1>
              <p className="mt-8 max-w-[42rem] text-[clamp(1.08rem,1.5vw,1.36rem)] leading-[1.72] tracking-[-0.02em] text-white/68">
                {project.excerpt}
              </p>
            </header>
          </AnimatedSection>
        </section>

        <section className="px-6 pt-8 md:px-10 md:pt-10">
          <AnimatedSection>
            <div className="mx-auto w-full max-w-[62rem]">
              {project.coverImageUrl ? (
                <div
                  className="overflow-hidden rounded-xl bg-black"
                  style={{
                    maxHeight: "min(74vh,48rem)",
                  }}
                >
                  <ProgressiveImage
                    src={project.coverImageUrl}
                    alt={`${project.title} scenic design cover image`}
                    className="block w-full"
                    containerClassName="w-full"
                    objectFit={project.coverImageFit === "contain" ? "contain" : "cover"}
                    loading="eager"
                    fetchPriority="high"
                    sizes="(min-width: 1200px) 62rem, calc(100vw - 3rem)"
                    width={1600}
                  />
                </div>
              ) : null}
            </div>
          </AnimatedSection>
        </section>

        <section className="px-6 pt-8 md:px-10">
          <AnimatedSection>
            <div className="mx-auto flex w-full max-w-[62rem] items-center justify-between gap-6 border-t border-white/14 py-4 text-white/72">
              <div className="flex flex-wrap items-center gap-5">
                {project.clientUrl ? (
                  <a
                    href={project.clientUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.98rem] tracking-[-0.02em] transition-colors hover:text-white"
                  >
                    {project.client}
                  </a>
                ) : project.client ? (
                  <span className="text-[0.98rem] tracking-[-0.02em]">{project.client}</span>
                ) : null}
                {project.location ? (
                  <span className="text-[0.98rem] tracking-[-0.02em] text-white/56">{project.location}</span>
                ) : null}
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
            {project.sections.map((section, index) => (
              <div key={`${section.type}-${index}`} className="space-y-0">
                <AnimatedSection>
                  {section.type === "text" ? (
                    <div className="space-y-5">
                      {section.heading ? (
                        <h2 className="font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                          {section.heading}
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
                      const isRenderingGallery = galleryItems.length > 1 && galleryItems.every((item) => item.kind === "rendering");

                      if (isRenderingGallery) {
                        return (
                          <ScenicRenderingGallery items={galleryItems} onOpen={openLightboxFor} visibleCount={2} />
                        );
                      }

                      if (galleryItems.length > 2) {
                        return (
                          <div className="relative left-1/2 w-screen max-w-[88rem] -translate-x-1/2 px-6 sm:px-10 lg:px-14">
                            <ScenicRenderingGallery items={galleryItems} onOpen={openLightboxFor} visibleCount={3} />
                          </div>
                        );
                      }

                      const firstPair = galleryItems.slice(0, 2);

                      return (
                        <div className="relative left-1/2 w-screen max-w-[72rem] -translate-x-1/2 px-8 sm:px-12 lg:px-16 space-y-10 md:space-y-12">
                          {section.heading ? (
                            <h2 className="mx-auto max-w-[54rem] font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                              {section.heading}
                            </h2>
                          ) : null}
                          {firstPair.length > 0 ? (
                            <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:gap-12">
                              {firstPair.map((item, itemIndex) => (
                                <figure
                                  key={item.id}
                                  className="self-end space-y-3"
                                >
                                  <button
                                    type="button"
                                    onClick={() => openLightboxFor(item.id)}
                                    className="block w-full text-left"
                                  >
                                    <ProgressiveImage
                                      src={item.imageUrl}
                                      alt={item.altText}
                                      className="block w-full rounded-xl object-cover transition-transform duration-500 hover:scale-[1.01]"
                                      containerClassName="w-full"
                                      sizes="(min-width: 1024px) 40vw, 100vw"
                                      width={1400}
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
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <p className="font-sans text-[1.15rem] tracking-[-0.02em] text-white">
                      News, Reviews & Insights
                    </p>
                  </div>
                  <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
                    {relatedRenderingProject ? (
                      <Link key={relatedRenderingProject.slug} href={`/projects/rendering/${relatedRenderingProject.slug}`}>
                        <div className="group flex cursor-pointer items-start gap-5">
                          <div className="relative h-36 w-36 flex-none overflow-hidden rounded-xl bg-black/85">
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
                          <div className="relative h-36 w-36 flex-none overflow-hidden rounded-xl bg-black/85">
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
                          <div className="relative h-36 w-36 flex-none overflow-hidden rounded-xl bg-black/85">
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
                              <span>News, Reviews & Insights</span>
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
                    All Scenic Designs
                  </p>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                    {moreScenicProjects.map((item) => (
                      <Link key={item.id} href={`/project/${item.slug}`} className="group block">
                        <div className="relative aspect-[1/1] overflow-hidden rounded-xl bg-black/85">
                          {item.coverImageUrl ? (
                            <ProgressiveImage
                              src={item.coverImageUrl}
                              alt={`${item.title} scenic design project cover image`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              containerClassName="h-full w-full"
                              sizes="(min-width: 768px) 30vw, 96vw"
                              width={900}
                              aspectRatio="1 / 1"
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
