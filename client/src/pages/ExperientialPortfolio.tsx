"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Box, Layers3, Lightbulb, UsersRound } from "lucide-react";

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
  "brand environment designer",
  "rendering and technical drawing portfolio",
  "event design case studies",
  "Brandon PT Davis",
].join(", ");

const experientialPortfolioLandingCopy = {
  title: "Experiential Design",
  subtitle: "Project-based concept, documentation, and built proof.",
  intro:
    "A selected body of experiential design work organized as case studies rather than separate media buckets. Renderings, technical drawing, and live documentation live together so each project can read from early concept through built outcome.",
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
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <div className="max-w-5xl">
              <p className="mb-5 text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-none tracking-[-0.035em] text-white/46">
                {experientialPortfolioLandingCopy.subtitle}
              </p>
              <h1 className="font-sans text-[clamp(3.2rem,7vw,7.1rem)] font-medium leading-[0.86] tracking-[-0.065em] text-white">
                {experientialPortfolioLandingCopy.title}
              </h1>
              <p className="mt-7 max-w-3xl text-[1.02rem] leading-7 text-white/62 md:text-[1.12rem]">
                {experientialPortfolioLandingCopy.intro}
              </p>
            </div>
          </div>
        </section>

        {projects.length > 0 ? (
          <section className="bg-[#111111] py-4 md:py-5">
            <div className="grid w-full gap-4 px-[clamp(1rem,2vw,1.75rem)] md:grid-cols-2">
              {projects.map((project, index) => {
                const href = getLocalExperientialProjectHref(project);

                return (
                  <a
                    key={project.slug}
                    href={href}
                    onClick={(event) => navigateWithTransition(event, href)}
                    className={`group block ${index % 3 === 0 ? "md:col-span-2" : ""}`}
                  >
                    <article className="bg-[#111111]">
                      <div
                        className="transition-card site-media-square relative aspect-[3/2] overflow-hidden bg-[#181818]"
                        style={{ viewTransitionName: `experiential-card-${project.slug}` } as CSSProperties}
                      >
                        {project.coverImageUrl ? (
                          <img
                            src={project.coverImageUrl}
                            alt={experientialAlt(project.title)}
                            className="site-media-square h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                            loading={index < 3 ? "eager" : "lazy"}
                            fetchPriority={index < 3 ? "high" : "auto"}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/42">
                            Image unavailable
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/84 via-black/34 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-[clamp(1.15rem,2.2vw,2rem)]">
                          <h2 className="max-w-[14ch] font-sans text-[clamp(1.55rem,2.4vw,2.9rem)] font-medium leading-[0.96] tracking-[-0.06em] text-white transition-colors group-hover:text-white/80">
                            {project.title}
                          </h2>
                          {project.year ? (
                            <p className="mt-2 text-[clamp(0.9rem,1.05vw,1.08rem)] leading-tight tracking-[-0.025em] text-white/72">
                              {project.year}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  </a>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="border-t border-white/12 bg-[#111111] py-18 md:py-24">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.72fr)] lg:items-start">
              <div className="space-y-5">
                <p className="text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-none tracking-[-0.035em] text-white/46">
                  Experiential notes
                </p>
                <h2 className="max-w-3xl font-sans text-[clamp(2.4rem,5vw,5.2rem)] font-medium leading-[0.88] tracking-[-0.075em] text-white">
                  Case studies that connect concept to installation.
                </h2>
                <p className="max-w-3xl text-[1.05rem] leading-7 text-white/68 md:text-[1.15rem] md:leading-8">
                  This portfolio focuses on experiential projects that move between concept
                  visualization, client communication, production coordination, and finished
                  installation. The work includes renderings, technical drawing, and completed
                  project imagery presented together so each case study can show the full path
                  from proposal to built result.
                </p>
                <p className="max-w-3xl text-[1.05rem] leading-7 text-white/54 md:text-[1.15rem] md:leading-8">
                  Rather than splitting those assets into separate categories, these projects are
                  organized around the design problem itself. The goal is to show how visual
                  intent gets communicated early, translated into practical documentation, and
                  carried through into real-world audience experience.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    icon: Lightbulb,
                    title: "Concept direction",
                    copy: "Renderings and mood studies for internal review, client presentation, and early alignment.",
                  },
                  {
                    icon: Layers3,
                    title: "Documentation",
                    copy: "Technical drawing and spatial planning that turn visual direction into buildable information.",
                  },
                  {
                    icon: UsersRound,
                    title: "Audience experience",
                    copy: "Finished-work documentation that shows how a concept becomes a real environment in context.",
                  },
                  {
                    icon: Box,
                    title: "Project storytelling",
                    copy: "Case studies organized around the design problem rather than separated into media buckets.",
                  },
                ].map(({ icon: Icon, title, copy }) => (
                  <div
                    key={title}
                    className="rounded-[1.5rem] bg-black p-6 text-white shadow-[0_18px_54px_rgba(0,0,0,0.28)] ring-1 ring-white/[0.07]"
                  >
                    <Icon className="mb-8 h-7 w-7 text-white/82" strokeWidth={1.8} aria-hidden="true" />
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
