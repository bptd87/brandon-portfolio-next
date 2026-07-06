"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useRouter } from "next/navigation";

import Footer from "@/components/Footer";
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
  const { homeTheme } = useHomeTheme();
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
      <style jsx global>{`
        .experiential-landing-media,
        .experiential-landing-media:has(> img),
        .experiential-landing-media img,
        img.experiential-landing-image {
          border-radius: 1.65rem !important;
        }
      `}</style>

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
            <div className="mx-auto grid w-full max-w-[86rem] grid-cols-1 gap-[clamp(1rem,2vw,1.6rem)] md:grid-cols-6">
              {projects.map((project, index) => {
                const href = getLocalExperientialProjectHref(project);
                const isFeatureCard = index % 5 < 2;
                const imageTreatment = getProjectImageTreatment(project);

                return (
                  <MotionReveal
                    key={project.slug}
                    className={`${isFeatureCard ? "md:col-span-3" : "md:col-span-2"} h-full`}
                    delay={(index % 4) * 70}
                  >
                    <a
                      href={href}
                      onClick={(event) => navigateWithTransition(event, href)}
                      className="portfolio-focus-card group block h-full text-current no-underline"
                    >
                      <article className="h-full">
                        <div
                          className={`portfolio-focus-media transition-card experiential-landing-media relative overflow-hidden rounded-[1.65rem] shadow-[0_1.2rem_3.6rem_rgba(0,0,0,0.14)] ring-1 ring-black/5 ${imageTreatment.frame} ${getProjectCardAspect(project)}`}
                          style={{ viewTransitionName: `experiential-card-${project.slug}` } as CSSProperties}
                        >
                          {project.coverVideoUrl ? (
                            <img
                              src={project.coverImageUrl || getYoutubePosterUrl(project.coverVideoUrl)}
                              alt={`${project.title} video preview poster`}
                              className="experiential-landing-image h-full w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.018]"
                              loading={index < eagerProjectCount ? "eager" : "lazy"}
                              fetchPriority={index < eagerProjectCount ? "high" : "auto"}
                            />
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
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/66 via-black/24 to-transparent px-5 pb-5 pt-16 text-white">
                            <h2
                              className="max-w-[18ch] text-[clamp(1.35rem,2.2vw,2.35rem)] font-black uppercase leading-[0.9] tracking-[0]"
                              style={{ fontFamily: HOME_DISPLAY_FONT }}
                            >
                              {project.title}
                            </h2>
                            {project.year ? (
                              <p className="mt-2 text-[0.88rem] font-medium leading-tight tracking-[-0.015em] text-white/70">
                                {project.year}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    </a>
                  </MotionReveal>
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
