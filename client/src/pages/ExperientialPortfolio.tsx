"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Box, Layers3, Lightbulb } from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import {
  getLocalExperientialProjectHref,
  getLocalExperientialProjects,
  type LocalExperientialProject,
} from "@shared/localPortfolios";
import { getConfiguredSiteUrl } from "../../../lib/env/site";

const EXPERIENTIAL_PORTFOLIO_URL = "https://www.brandonptdavis.com/projects/experiential";
const EXPERIENTIAL_PORTFOLIO_TITLE = "Experiential Design Portfolio | Brandon PT Davis";
const EXPERIENTIAL_PORTFOLIO_DESCRIPTION =
  "Experiential design portfolio by Brandon PT Davis featuring project-based case studies that combine renderings, technical drawing, and finished work into a single narrative.";
const EXPERIENTIAL_PORTFOLIO_KEYWORDS = [
  "experiential design portfolio",
  "experiential project portfolio",
  "spatial design portfolio",
  "rendering and technical drawing portfolio",
  "event design case studies",
  "Brandon PT Davis",
].join(", ");

const MEDIA_LABELS: Record<LocalExperientialProject["mediaTypes"][number], string> = {
  rendering: "Rendering",
  "technical-drawing": "Technical Drawing",
  "live-events": "Finished Work",
};

const experientialPortfolioLandingCopy = {
  title: "Experiential Design",
  subtitle: "Spatial work, renderings, drafting, and independent experiments.",
  intro:
    "A focused archive of work adjacent to scenic design: open-air venues, brand environments, documentation, and visual studies.",
} as const;

const experientialContextCards = [
  {
    icon: Lightbulb,
    title: "Spatial idea",
    copy: "Projects begin with a clear visual premise: how the place should feel, where attention lands, and what the audience enters.",
  },
  {
    icon: Layers3,
    title: "Visual proof",
    copy: "Renderings, walkthroughs, and drafting translate that premise into something clients, shops, and collaborators can read quickly.",
  },
  {
    icon: Box,
    title: "Built read",
    copy: "Finished documentation shows whether the idea holds up in scale, movement, light, and real guest or audience flow.",
  },
] as const;

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

function getProjectCardAspect(project: LocalExperientialProject, isFeatureCard: boolean) {
  if (project.mediaTypes.includes("technical-drawing")) {
    return "aspect-[3/2]";
  }

  if (project.mediaTypes.includes("live-events")) {
    return "aspect-video";
  }

  return isFeatureCard ? "aspect-video" : "aspect-[3/2]";
}

function getProjectImageTreatment(project: LocalExperientialProject) {
  const hasRendering = project.mediaTypes.includes("rendering");
  const hasOnlyTechnicalDrawing = project.mediaTypes.includes("technical-drawing") && !hasRendering;

  if (hasOnlyTechnicalDrawing) {
    return {
      frame: "bg-[#181818]",
      image: "object-contain",
    };
  }

  return {
    frame: "bg-[#181818]",
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

function getYoutubeEmbedUrl(url: string) {
  const videoId = getYoutubeId(url);
  if (!videoId) return "";

  try {
    const params = new URLSearchParams({
      autoplay: "1",
      controls: "0",
      disablekb: "1",
      fs: "0",
      iv_load_policy: "3",
      loop: "1",
      modestbranding: "1",
      mute: "1",
      playsinline: "1",
      playlist: videoId,
      rel: "0",
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  } catch {
    return "";
  }
}

function getYoutubePosterUrl(url: string) {
  const videoId = getYoutubeId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : "";
}

export default function ExperientialPortfolio() {
  const router = useRouter();
  const projects = sortExperientialProjectsChronologically(getLocalExperientialProjects());
  const featuredProject = projects[0];
  const experientialAlt = (title: string) => `${title} experiential design by Brandon PT Davis`;
  const latestProjectUpdateDate = projects
    .map((project) => project.updatedAt)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
    ?.split("T")[0];
  const animateCardDeparture = async (target: HTMLElement) => {
    const card = target.querySelector(".transition-card") as HTMLElement | null;
    if (!card || typeof card.animate !== "function") return;
    const animation = card.animate(
      [
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: "scale(0.975)", filter: "brightness(1.08)" },
      ],
      { duration: 150, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
    );

    try {
      await animation.finished;
    } catch {
      // Ignore interrupted animation.
    }
  };

  const navigateWithTransition = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const anchor = event.currentTarget;
    const navigate = () => router.push(href);
    const performNavigation = async () => {
      await animateCardDeparture(anchor);
      navigate();
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };

    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        void performNavigation();
      });
    } else {
      void performNavigation();
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
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

      <main>
        <section className="border-b border-white/10 bg-black pb-8 pt-24 md:pb-10 md:pt-28">
          <div className="container max-w-[88rem]">
            <div className="max-w-5xl">
              <p className="mb-5 section-kicker text-[#c9ff3d]/72">
                {experientialPortfolioLandingCopy.subtitle}
              </p>
              <h1 className="font-sans text-[clamp(3.2rem,7vw,7.1rem)] font-medium leading-[0.86] tracking-[-0.065em] text-white">
                {experientialPortfolioLandingCopy.title}
              </h1>
              <p className="mt-7 max-w-3xl text-[1.02rem] leading-7 text-white/62 md:text-[1.12rem]">
                {experientialPortfolioLandingCopy.intro}
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-border/35 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-3 text-[1.02rem] text-white/52">
                <span className="text-white">{projects.length} projects</span>
                <span>Renderings</span>
                <span>Technical drawing</span>
                <span>Finished work</span>
              </div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#c9ff3d]/72">
                Selected work
              </p>
            </div>
          </div>
        </section>

        {projects.length > 0 ? (
          <section className="bg-[#111111] px-[clamp(0.9rem,1.8vw,1.35rem)] py-[clamp(0.9rem,1.8vw,1.35rem)] pb-20 md:pb-28">
            <div className="grid grid-cols-1 gap-[clamp(0.9rem,1.8vw,1.35rem)] md:grid-cols-2">
              {projects.map((project, index) => {
                const href = getLocalExperientialProjectHref(project);
                const isFeatureCard = index % 3 === 0;
                const imageTreatment = getProjectImageTreatment(project);

                return (
                  <a
                    key={project.slug}
                    href={href}
                    onClick={(event) => navigateWithTransition(event, href)}
                    className={`group block ${isFeatureCard ? "md:col-span-2" : ""}`}
                  >
                    <article className="bg-[#111111]">
                      <div
                        className={`transition-card site-media-square relative overflow-hidden ${imageTreatment.frame} ${getProjectCardAspect(project, isFeatureCard)}`}
                        style={{ viewTransitionName: `experiential-card-${project.slug}` } as CSSProperties}
                      >
                        {project.coverVideoUrl ? (
                          <>
                            <img
                              src={project.coverImageUrl || getYoutubePosterUrl(project.coverVideoUrl)}
                              alt={`${project.title} video preview poster`}
                              className="site-media-square h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                              loading={index < 3 ? "eager" : "lazy"}
                              fetchPriority={index < 3 ? "high" : "auto"}
                            />
                            <iframe
                              src={getYoutubeEmbedUrl(project.coverVideoUrl)}
                              title={`${project.title} video preview`}
                              aria-label={`${project.title} video preview`}
                              className="site-media-square pointer-events-none absolute left-1/2 top-1/2 h-full w-[120%] -translate-x-1/2 -translate-y-1/2 border-0"
                              allow="autoplay; encrypted-media; picture-in-picture"
                              loading="eager"
                            />
                          </>
                        ) : project.coverImageUrl ? (
                          <img
                            src={project.coverImageUrl}
                            alt={experientialAlt(project.title)}
                            className={`site-media-square h-full w-full object-center transition-transform duration-700 ease-out group-hover:scale-[1.025] ${imageTreatment.image}`}
                            loading={index < 3 ? "eager" : "lazy"}
                            fetchPriority={index < 3 ? "high" : "auto"}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/42">
                            Image unavailable
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/82 via-black/32 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-[clamp(1.15rem,2.2vw,2rem)]">
                          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[#c9ff3d]/78">
                            {project.mediaTypes.slice(0, 2).map((type) => (
                              <span key={type}>{MEDIA_LABELS[type]}</span>
                            ))}
                            {project.year ? <span>{project.year}</span> : null}
                          </div>
                          <h2 className="font-sans text-[clamp(1.45rem,2.1vw,2.4rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white transition-colors group-hover:text-white/80">
                            {project.title}
                          </h2>
                        </div>
                      </div>
                    </article>
                  </a>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="border-t border-white/12 bg-[#111111] py-16 md:py-22">
          <div className="container max-w-[88rem]">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(26rem,0.78fr)] lg:items-start">
              <div>
                <p className="section-kicker text-[#c9ff3d]/72">Portfolio context</p>
                <h2 className="mt-4 max-w-3xl font-sans text-[clamp(2.35rem,5vw,5.05rem)] font-medium leading-[0.9] tracking-[-0.075em] text-white">
                  Work that moves between concept and space.
                </h2>
                <p className="mt-6 max-w-2xl text-[1.02rem] leading-7 text-white/58 md:text-[1.12rem] md:leading-8">
                  This section sits near scenic design, but follows the project instead of the medium. Some entries are
                  renderings, some are walkthroughs, some are documentation; the through-line is spatial thinking.
                </p>
              </div>

              <div className="grid gap-3">
                {experientialContextCards.map(({ icon: Icon, title, copy }) => (
                  <div
                    key={title}
                    className="rounded-[1.5rem] bg-black p-6 text-white shadow-[0_18px_54px_rgba(0,0,0,0.28)] ring-1 ring-white/[0.07]"
                  >
                    <Icon className="mb-8 h-7 w-7 text-[#c9ff3d]/82" strokeWidth={1.8} aria-hidden="true" />
                    <h3 className="max-w-[14ch] font-sans text-[1.55rem] font-medium leading-[0.96] tracking-[-0.055em] text-white">
                      {title}
                    </h3>
                    <p className="mt-4 max-w-md text-[0.98rem] leading-6 text-white/58">
                      {copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
