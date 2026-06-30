"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useRouter } from "next/navigation";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MotionReveal from "@/components/MotionReveal";
import PortfolioTopBar from "@/components/PortfolioTopBar";
import { SEO } from "@/components/SEO";
import { useIsDesktopViewport } from "@/hooks/useIsDesktopViewport";
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

export default function ExperientialPortfolio() {
  const isDesktopViewport = useIsDesktopViewport();
  const router = useRouter();
  const projects = sortExperientialProjectsChronologically(getLocalExperientialProjects());
  const eagerProjectCount = isDesktopViewport ? 3 : 1;
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
    <div className="flex min-h-screen flex-col bg-white text-[#111111] [--background:#ffffff] [--border:rgba(17,17,17,0.14)] [--foreground:#111111]">
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

      <main className="flex-1">
        <section className="bg-white px-[clamp(1.5rem,5vw,6rem)] pb-10 pt-12 text-[#111111] md:pt-16">
          <header className="w-full">
            <MotionReveal>
              <h1 className="max-w-[13ch] font-sans text-[clamp(4.2rem,12vw,12.8rem)] font-medium leading-[0.82] tracking-[-0.07em] text-[#111111]">
                {experientialPortfolioLandingCopy.title}
              </h1>
            </MotionReveal>
            <MotionReveal delay={120}>
              <p className="mt-6 max-w-2xl text-[1rem] leading-6 text-black/58 md:text-[1.08rem]">
                {experientialPortfolioLandingCopy.intro}
              </p>
            </MotionReveal>
          </header>
        </section>

        {projects.length > 0 ? (
          <section className="border-t border-black/10 bg-white">
            <div className="portfolio-focus-grid grid grid-cols-1 border-l border-black/10 md:grid-cols-4">
              {projects.map((project, index) => {
                const href = getLocalExperientialProjectHref(project);
                const isFeatureCard = index % 6 < 2;
                const imageTreatment = getProjectImageTreatment(project);

                return (
                  <div
                    key={project.slug}
                    className={`${isFeatureCard ? "md:col-span-2" : ""} h-full`}
                  >
                    <a
                      href={href}
                      onClick={(event) => navigateWithTransition(event, href)}
                      className="portfolio-focus-card group block h-full border-b border-r border-black/10"
                    >
                      <article className="h-full bg-white">
                        <div
                          className={`portfolio-focus-media transition-card site-media-square relative overflow-hidden ${imageTreatment.frame} ${getProjectCardAspect(project)}`}
                          style={{ viewTransitionName: `experiential-card-${project.slug}` } as CSSProperties}
                        >
                          {project.coverVideoUrl ? (
                            <img
                              src={project.coverImageUrl || getYoutubePosterUrl(project.coverVideoUrl)}
                              alt={`${project.title} video preview poster`}
                              className="site-media-square h-full w-full object-cover object-center"
                              loading={index < eagerProjectCount ? "eager" : "lazy"}
                              fetchPriority={index < eagerProjectCount ? "high" : "auto"}
                            />
                          ) : project.coverImageUrl ? (
                            <img
                              src={project.coverImageUrl}
                              alt={experientialAlt(project.title)}
                              className={`site-media-square h-full w-full object-center ${imageTreatment.image}`}
                              loading={index < eagerProjectCount ? "eager" : "lazy"}
                              fetchPriority={index < eagerProjectCount ? "high" : "auto"}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-black/42">
                              Image unavailable
                            </div>
                          )}
                        </div>
                        <div className="portfolio-focus-copy grid min-h-[8.5rem] gap-3 border-t border-black/10 p-[clamp(0.9rem,1.5vw,1.2rem)] text-[#111111] md:grid-cols-[minmax(0,1fr)_auto]">
                          <div>
                            <h2 className="max-w-[18ch] font-sans text-[clamp(1.2rem,1.7vw,1.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-[#111111] transition-opacity group-hover:opacity-70">
                              {project.title}
                            </h2>
                          </div>
                          {project.year ? (
                            <p className="font-sans text-[clamp(1.3rem,2vw,2.1rem)] font-normal leading-none tracking-[-0.055em] text-black/52">
                              {project.year}
                            </p>
                          ) : null}
                        </div>
                      </article>
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <Footer tone="light" />
      </main>
    </div>
  );
}
