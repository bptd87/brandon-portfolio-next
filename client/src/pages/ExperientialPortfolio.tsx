"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import Header from "@/components/Header";
import MotionReveal from "@/components/MotionReveal";
import PortfolioTopBar from "@/components/PortfolioTopBar";
import { SEO } from "@/components/SEO";
import { useIsDesktopViewport } from "@/hooks/useIsDesktopViewport";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeTheme,
} from "@/lib/homeTheme";
import StructuredData from "@/components/StructuredData";
import {
  getLocalExperientialProjectHref,
  getLocalExperientialProjects,
  type LocalExperientialProject,
} from "@shared/localPortfolios";
import { getConfiguredSiteUrl } from "../../../lib/env/site";

const EXPERIENTIAL_PORTFOLIO_URL = "https://www.brandonptdavis.com/projects/experiential";
const EXPERIENTIAL_PORTFOLIO_PATH = "/projects/experiential";
const EXPERIENTIAL_PORTFOLIO_TITLE = "Experiential Design Portfolio | Brandon PT Davis";
const EXPERIENTIAL_PORTFOLIO_DESCRIPTION =
  "Experiential design portfolio by Brandon PT Davis, extending scenic design methods into immersive environments, brand activations, renderings, drafting, and finished work.";
const EXPERIENTIAL_PORTFOLIO_KEYWORDS = [
  "experiential design portfolio",
  "experiential project portfolio",
  "spatial design portfolio",
  "rendering and technical drawing portfolio",
  "event design case studies",
  "Brandon PT Davis",
].join(", ");

const experientialPortfolioLandingCopy = {
  title: "Experiential Design",
  subtitle: "Scenic design methods beyond the theatre.",
  intro:
    "Selected work where scenic thinking moves into audience flow, brand environments, technical drawing, and built experience.",
} as const;

const SITE_URL = getConfiguredSiteUrl();

function getExperientialProjectTimestamp(project: LocalExperientialProject) {
  if (project.year) {
    const monthIndex = project.month ? Math.max(0, Math.min(11, project.month - 1)) : 6;
    return new Date(project.year, monthIndex, 1).getTime();
  }

  if (project.updatedAt) {
    const timestamp = new Date(project.updatedAt).getTime();
    if (!Number.isNaN(timestamp)) return timestamp;
  }

  return 0;
}

function sortExperientialProjectsChronologically(projects: LocalExperientialProject[]) {
  return [...projects].sort((a, b) => {
    const timeCompare = getExperientialProjectTimestamp(b) - getExperientialProjectTimestamp(a);
    if (timeCompare !== 0) return timeCompare;
    return a.title.localeCompare(b.title);
  });
}

function getProjectCardAspect(project: LocalExperientialProject) {
  void project;
  return "aspect-square";
}

function getProjectImageTreatment(project: LocalExperientialProject) {
  void project;
  return {
    frame: "bg-neutral-100",
    image: "object-cover",
  };
}

function getYoutubeId(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return "";
  }
}

function getYoutubePosterUrl(url: string) {
  const videoId = getYoutubeId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : "";
}

function getAutoplayPreviewUrl(url: string) {
  const videoId = getYoutubeId(url);
  if (!videoId) return url;

  const params = new URLSearchParams({
    autoplay: "1",
    cc_load_policy: "0",
    controls: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    loop: "1",
    modestbranding: "1",
    mute: "1",
    origin: SITE_URL,
    playsinline: "1",
    playlist: videoId,
    rel: "0",
    showinfo: "0",
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export default function ExperientialPortfolio() {
  const { homeTheme } = useHomeTheme();
  const isDesktopViewport = useIsDesktopViewport();
  const projects = sortExperientialProjectsChronologically(getLocalExperientialProjects());
  const eagerProjectCount = isDesktopViewport ? 3 : 1;
  const featuredProject = projects[0];
  const [activePortfolioProject, setActivePortfolioProject] = useState<LocalExperientialProject | null>(null);
  const [isPortfolioLightboxOpen, setIsPortfolioLightboxOpen] = useState(false);
  const experientialAlt = (title: string) => `${title} experiential design by Brandon PT Davis`;
  const getProjectFromCurrentUrl = () => {
    if (typeof window === "undefined") return null;

    const currentPath = window.location.pathname.replace(/\/$/, "");
    return (
      projects.find((project) => getLocalExperientialProjectHref(project) === currentPath) ||
      null
    );
  };
  const closeProjectQuickView = (updateUrl = true) => {
    setActivePortfolioProject(null);

    if (!updateUrl || typeof window === "undefined") return;

    const historyState = window.history.state as { experientialPortfolioModal?: string } | null;
    if (historyState?.experientialPortfolioModal) {
      window.history.back();
      return;
    }

    if (window.location.pathname.replace(/\/$/, "") !== EXPERIENTIAL_PORTFOLIO_PATH) {
      window.history.replaceState(null, "", EXPERIENTIAL_PORTFOLIO_PATH);
    }
  };
  const openProjectQuickView = (
    event: MouseEvent<HTMLAnchorElement>,
    project: LocalExperientialProject
  ) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    setActivePortfolioProject(project);

    if (typeof window !== "undefined") {
      const projectHref = getLocalExperientialProjectHref(project);
      if (window.location.pathname.replace(/\/$/, "") !== projectHref) {
        window.history.pushState(
          { experientialPortfolioModal: project.slug },
          "",
          projectHref
        );
      }
    }
  };
  const latestProjectUpdateDate = projects
    .map((project) => project.updatedAt)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
    ?.split("T")[0];

  useEffect(() => {
    if (!activePortfolioProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProjectQuickView();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePortfolioProject]);

  useEffect(() => {
    const syncModalFromUrl = () => {
      setActivePortfolioProject(getProjectFromCurrentUrl());
    };

    syncModalFromUrl();
    window.addEventListener("popstate", syncModalFromUrl);

    return () => {
      window.removeEventListener("popstate", syncModalFromUrl);
    };
  }, []);

  useEffect(() => {
    if (!activePortfolioProject) {
      setIsPortfolioLightboxOpen(false);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "portfolioQuickViewLightbox") return;
      setIsPortfolioLightboxOpen(Boolean(event.data.open));
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      setIsPortfolioLightboxOpen(false);
    };
  }, [activePortfolioProject]);

  return (
    <div
      className="flex min-h-screen flex-col transition-colors duration-500"
      style={
        {
          "--background": homeTheme.bg,
          "--foreground": homeTheme.ink,
          backgroundColor: homeTheme.bg,
          color: homeTheme.ink,
          fontFamily: HOME_BODY_FONT,
        } as CSSProperties
      }
    >
      <SEO
        title={EXPERIENTIAL_PORTFOLIO_TITLE}
        description={EXPERIENTIAL_PORTFOLIO_DESCRIPTION}
        image={featuredProject?.coverImageUrl || undefined}
        imageAlt={
          featuredProject
            ? `${featuredProject.title} experiential design cover image`
            : "Experiential design portfolio cover image"
        }
        keywords={EXPERIENTIAL_PORTFOLIO_KEYWORDS}
        url={EXPERIENTIAL_PORTFOLIO_URL}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Experiential Design Portfolio", url: EXPERIENTIAL_PORTFOLIO_URL },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Experiential Design Portfolio",
          url: EXPERIENTIAL_PORTFOLIO_URL,
          description: EXPERIENTIAL_PORTFOLIO_DESCRIPTION,
          about: "Experiential design projects presented as unified case studies.",
          primaryImageOfPage: featuredProject?.coverImageUrl || undefined,
          mainEntity: {
            name: "Experiential Design Portfolio",
            itemListElement: projects.slice(0, 40).map((project, index) => ({
              position: index + 1,
              name: project.title,
              url: `${SITE_URL}${getLocalExperientialProjectHref(project)}`,
              datePublished: project.year ? `${project.year}-01-01` : undefined,
              image: project.coverImageUrl || undefined,
            })),
          },
        }}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: "Experiential Design Portfolio",
          description: EXPERIENTIAL_PORTFOLIO_DESCRIPTION,
          url: EXPERIENTIAL_PORTFOLIO_URL,
          creator: {
            name: "Brandon PT Davis",
            url: `${SITE_URL}/about`,
          },
          genre: "Experiential Design",
          about: "Project-based experiential design portfolio",
          mainEntityOfPage: EXPERIENTIAL_PORTFOLIO_URL,
          dateModified: latestProjectUpdateDate,
          keywords: EXPERIENTIAL_PORTFOLIO_KEYWORDS.split(", "),
          image: projects
            .slice(0, 12)
            .map((project) => project.coverImageUrl)
            .filter((url): url is string => Boolean(url)),
          workExample: projects
            .slice(0, 20)
            .map((project) => ({
              type: "ImageObject" as const,
              contentUrl: project.coverImageUrl || "",
              name: project.title,
              caption: `${project.title} experiential design by Brandon PT Davis`,
            }))
            .filter((item) => item.contentUrl),
        }}
      />

      <Header />
      <PortfolioTopBar />

      <main className="relative z-10 flex-1" style={{ backgroundColor: homeTheme.bg }}>
        <section
          className="px-[clamp(2rem,8vw,9rem)] pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(8rem,12vw,11rem)]"
          style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}
        >
          <header className="mx-auto w-full max-w-[54rem] text-center">
            <MotionReveal>
              <h1
                className="mx-auto max-w-[10.5ch] text-balance text-[clamp(3.2rem,7vw,7rem)] font-black uppercase leading-[0.84] tracking-[0]"
                style={{
                  color: homeTheme.ink,
                  fontFamily: HOME_DISPLAY_FONT,
                  fontStretch: "condensed",
                }}
              >
                {experientialPortfolioLandingCopy.title.toUpperCase()}
              </h1>
            </MotionReveal>
            <MotionReveal delay={120}>
              <p
                className="mx-auto mt-5 max-w-[30rem] text-[clamp(0.98rem,1.2vw,1.12rem)] font-medium leading-7 tracking-[-0.02em]"
                style={{ color: homeTheme.muted }}
              >
                {experientialPortfolioLandingCopy.intro}
              </p>
            </MotionReveal>
          </header>
        </section>

        {projects.length > 0 ? (
          <section
            className="px-[clamp(1.5rem,7vw,8rem)] pb-[clamp(4rem,8vw,7rem)]"
            style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}
          >
            <div className="mx-auto grid w-full max-w-[64rem] grid-cols-1 gap-[clamp(2.25rem,5vw,4.25rem)] px-[clamp(1rem,3vw,2rem)] sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => {
                const imageTreatment = getProjectImageTreatment(project);
                const projectHref = getLocalExperientialProjectHref(project);

                return (
                  <MotionReveal
                    key={project.slug}
                    delay={(index % 4) * 70}
                  >
                    <a
                      href={projectHref}
                      className="home-portfolio-card group grid w-full place-items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
                      style={
                        {
                          color: homeTheme.ink,
                          "--home-portfolio-delay": `${(index % 3) * 95}ms`,
                        } as CSSProperties
                      }
                      aria-label={`${project.title} experiential design by Brandon PT Davis`}
                      onClick={(event) => openProjectQuickView(event, project)}
                    >
                      <article className="w-full">
                        <div
                          className={`portfolio-focus-media experiential-landing-media relative overflow-hidden rounded-[0.85rem] shadow-[0_1rem_2.4rem_rgba(0,0,0,0.12)] ring-1 ring-black/5 ${imageTreatment.frame} ${getProjectCardAspect(project)}`}
                          style={{ viewTransitionName: `experiential-card-${project.slug}` } as CSSProperties}
                        >
                          {project.coverVideoUrl ? (
                            <>
                              {project.coverImageUrl ? (
                                <img
                                  src={project.coverImageUrl || getYoutubePosterUrl(project.coverVideoUrl)}
                                  alt={`${project.title} video preview poster`}
                                  className="experiential-landing-image absolute inset-0 h-full w-full object-cover object-center"
                                  loading={index < eagerProjectCount ? "eager" : "lazy"}
                                  fetchPriority={index < eagerProjectCount ? "high" : "auto"}
                                />
                              ) : null}
                              <iframe
                                src={getAutoplayPreviewUrl(project.coverVideoUrl)}
                                title={`${project.title} video preview`}
                                className="pointer-events-none absolute left-1/2 top-1/2 h-[115%] w-[205%] -translate-x-1/2 -translate-y-1/2 scale-[1.08]"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                frameBorder="0"
                                loading={index < eagerProjectCount ? "eager" : "lazy"}
                                tabIndex={-1}
                                aria-hidden="true"
                              />
                            </>
                          ) : project.coverImageUrl ? (
                            <img
                              src={project.coverImageUrl}
                              alt={experientialAlt(project.title)}
                              className={`experiential-landing-image h-full w-full object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.018] ${imageTreatment.image}`}
                              loading={index < eagerProjectCount ? "eager" : "lazy"}
                              fetchPriority={index < eagerProjectCount ? "high" : "auto"}
                            />
                          ) : (
                            <div
                              className="flex h-full w-full items-center justify-center text-[0.75rem] font-black uppercase tracking-[0.12em]"
                              style={{ color: homeTheme.muted, fontFamily: HOME_DISPLAY_FONT }}
                            >
                              Image unavailable
                            </div>
                          )}
                          <div className="pointer-events-none absolute inset-0 flex items-end bg-black/18 p-4 opacity-100 transition-[background-color,opacity] duration-500 md:bg-black/0 md:p-5 md:opacity-0 md:group-hover:bg-black/18 md:group-hover:opacity-100">
                            <div className="translate-y-0 opacity-100 transition-[opacity,transform] duration-500 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                              <h2
                                className="text-[clamp(1.35rem,7vw,2.55rem)] font-black uppercase leading-[0.86] tracking-[0] text-white md:text-[clamp(1.45rem,2.3vw,2.55rem)]"
                                style={{ fontFamily: HOME_DISPLAY_FONT }}
                              >
                                {project.title.toUpperCase()}
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div className="sr-only">
                          <h2 className="font-sans text-[1.1rem] font-medium leading-tight">
                            {project.title}
                          </h2>
                        </div>
                      </article>
                    </a>
                  </MotionReveal>
                );
              })}
            </div>
          </section>
        ) : null}

        {activePortfolioProject && typeof document !== "undefined" ? createPortal(
          <div
            className="fixed inset-0 z-[2147483646] overflow-hidden bg-black/42 p-[clamp(0.55rem,1.5vw,1.25rem)] backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`experiential-portfolio-modal-${activePortfolioProject.slug}`}
            onClick={() => closeProjectQuickView()}
          >
            <div
              className="relative h-[calc(100dvh-clamp(1.1rem,3vw,2.5rem))] w-full overflow-hidden rounded-none shadow-[0_2rem_5rem_rgba(0,0,0,0.28)]"
              style={{ backgroundColor: homeTheme.bg }}
              onClick={(event) => event.stopPropagation()}
            >
              <h2
                id={`experiential-portfolio-modal-${activePortfolioProject.slug}`}
                className="sr-only"
              >
                {activePortfolioProject.title}
              </h2>

              <iframe
                key={activePortfolioProject.slug}
                src={`${getLocalExperientialProjectHref(activePortfolioProject)}?quickView=1`}
                title={`${activePortfolioProject.title} experiential portfolio project`}
                className="absolute inset-0 h-full w-full border-0"
                style={{ backgroundColor: homeTheme.bg }}
              />

              <button
                type="button"
                aria-label="Close experiential portfolio project"
                className={`absolute right-[clamp(0.75rem,1.6vw,1.15rem)] top-[clamp(0.75rem,1.6vw,1.15rem)] z-[5] grid h-12 w-12 place-items-center rounded-full shadow-[0_1rem_2.5rem_rgba(0,0,0,0.22)] transition-[opacity,transform] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 ${
                  isPortfolioLightboxOpen ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
                style={{
                  backgroundColor: homeTheme.controlBg,
                  color: homeTheme.controlInk,
                }}
                onClick={() => closeProjectQuickView()}
              >
                <X className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>
          </div>,
          document.body
        ) : null}
      </main>
    </div>
  );
}
