"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useRouter } from "next/navigation";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PortfolioTopBar from "@/components/PortfolioTopBar";
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
  "Experiential design portfolio by Brandon PT Davis, extending scenic design methods into immersive environments, brand activations, renderings, drafting, and finished work.";
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
  return "aspect-[4/3]";
}

function getProjectImageTreatment(project: LocalExperientialProject) {
  void project;
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
    void performNavigation();
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
      <PortfolioTopBar />

      <main>
        <section className="flex min-h-[min(72svh,46rem)] items-center justify-center bg-[#111111] px-[clamp(1.5rem,5vw,5.5rem)] py-14 text-center text-white md:py-16">
          <header className="mx-auto max-w-[66rem]">
            <p className="text-[0.82rem] font-medium tracking-[-0.01em] text-[#c9ff3d]">
              {projects.length} projects / Selected work
            </p>
            <h1 className="mx-auto mt-4 max-w-[12ch] font-sans text-[clamp(3rem,6.2vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.07em] text-white">
              {experientialPortfolioLandingCopy.title}
            </h1>
            <p className="mx-auto mt-5 max-w-[39rem] text-[clamp(1rem,1.2vw,1.18rem)] leading-[1.58] tracking-[-0.02em] text-white/78">
              {experientialPortfolioLandingCopy.intro}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.92rem] tracking-[-0.018em] text-white/52">
              <span>Renderings</span>
              <span>Technical drawing</span>
              <span>Finished work</span>
            </div>
          </header>
        </section>

        {projects.length > 0 ? (
          <section className="border-t border-white/12 bg-[#111111]">
            <div className="grid grid-cols-1 border-l border-white/12 md:grid-cols-4">
              {projects.map((project, index) => {
                const href = getLocalExperientialProjectHref(project);
                const isFeatureCard = index % 6 < 2;
                const imageTreatment = getProjectImageTreatment(project);

                return (
                  <a
                    key={project.slug}
                    href={href}
                    onClick={(event) => navigateWithTransition(event, href)}
                    className={`group block border-b border-r border-white/12 ${isFeatureCard ? "md:col-span-2" : ""}`}
                  >
                    <article className="bg-[#111111]">
                      <div
                        className={`transition-card site-media-square relative overflow-hidden ${imageTreatment.frame} ${getProjectCardAspect(project)}`}
                        style={{ viewTransitionName: `experiential-card-${project.slug}` } as CSSProperties}
                      >
                        {project.coverVideoUrl ? (
                          <>
                            <img
                              src={project.coverImageUrl || getYoutubePosterUrl(project.coverVideoUrl)}
                              alt={`${project.title} video preview poster`}
                              className="site-media-square h-full w-full object-cover object-center transition-opacity duration-500 group-hover:opacity-90"
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
                            className={`site-media-square h-full w-full object-center transition-opacity duration-500 group-hover:opacity-90 ${imageTreatment.image}`}
                            loading={index < 3 ? "eager" : "lazy"}
                            fetchPriority={index < 3 ? "high" : "auto"}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/42">
                            Image unavailable
                          </div>
                        )}
                      </div>
                      <div className="grid min-h-[8.5rem] gap-3 border-t border-white/12 p-[clamp(0.9rem,1.5vw,1.2rem)] text-white md:grid-cols-[minmax(0,1fr)_auto]">
                        <div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] font-medium uppercase leading-none tracking-[0.12em] text-[#c9ff3d]">
                            {project.mediaTypes.slice(0, 2).map((type) => (
                              <span key={type}>{MEDIA_LABELS[type]}</span>
                            ))}
                          </div>
                          <h2 className="mt-2 max-w-[18ch] font-sans text-[clamp(1.2rem,1.7vw,1.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white transition-colors group-hover:text-white/72">
                            {project.title}
                          </h2>
                        </div>
                        {project.year ? (
                          <p className="font-sans text-[clamp(1.3rem,2vw,2.1rem)] font-normal leading-none tracking-[-0.055em] text-[#c9ff3d]/82">
                            {project.year}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  </a>
                );
              })}
            </div>
          </section>
        ) : null}

        <Footer />
      </main>
    </div>
  );
}
