"use client";

import { useMemo, type MouseEvent } from "react";
import { useLocation } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { StickyShowcase } from "@/components/StickyShowcase";
import StructuredData from "@/components/StructuredData";
import { scenicShowcaseProps, splitScenicShowcaseProjects } from "@/lib/scenicShowcase";
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
    "A selected body of experiential work organized as project case studies rather than separate media buckets. Renderings, technical drawing, and finished work live together so each page can show the full design story from early concept through real-world execution.",
} as const;

const SITE_URL = getConfiguredSiteUrl();

function getExperientialProjectTimestamp(project: LocalExperientialProject) {
  if (project.updatedAt) {
    const timestamp = new Date(project.updatedAt).getTime();
    if (!Number.isNaN(timestamp)) return timestamp;
  }

  if (project.year) return new Date(project.year, 6, 1).getTime();
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
  const [, setLocation] = useLocation();
  const projects = sortExperientialProjectsChronologically(getLocalExperientialProjects());
  const { featuredProject, showcaseRailProjects, showcaseGridProjects } =
    splitScenicShowcaseProjects(projects);
  const experientialAlt = (title: string) => `${title} experiential design by Brandon PT Davis`;
  const latestProjectUpdateDate = projects
    .map((project) => project.updatedAt)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
    ?.split("T")[0];
  const showcaseFeaturedItem = useMemo(
    () =>
      featuredProject
        ? {
            id: featuredProject.slug,
            slug: featuredProject.slug,
            title: featuredProject.title,
            client: undefined,
            year: featuredProject.year,
            coverImageUrl: featuredProject.coverImageUrl,
          }
        : null,
    [featuredProject]
  );
  const showcaseRailItems = useMemo(
    () =>
      showcaseRailProjects.map((project) => ({
        id: project.slug,
        slug: project.slug,
        title: project.title,
        client: undefined,
        year: project.year,
        coverImageUrl: project.coverImageUrl,
      })),
    [showcaseRailProjects]
  );
  const showcaseContinuationItems = useMemo(
    () =>
      showcaseGridProjects.map((project) => ({
        id: project.slug,
        slug: project.slug,
        title: project.title,
        client: undefined,
        year: project.year,
        coverImageUrl: project.coverImageUrl,
      })),
    [showcaseGridProjects]
  );

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
    const navigate = () => setLocation(href);
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
    <div className="min-h-screen">
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
        <section className="border-b border-border/40 pb-8 pt-24 md:pb-10 md:pt-28">
          <div className="container max-w-[88rem]">
            <div className="max-w-3xl">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.24em] text-white/42">
                {experientialPortfolioLandingCopy.subtitle}
              </p>
              <h1 className="font-sans text-[clamp(2.3rem,4.6vw,3.8rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                {experientialPortfolioLandingCopy.title}
              </h1>
              <p className="mt-6 max-w-3xl text-[1rem] leading-7 text-white/58 md:text-[1.05rem]">
                {experientialPortfolioLandingCopy.intro}
              </p>
            </div>
          </div>
        </section>

        {showcaseFeaturedItem ? (
          <StickyShowcase
            continuationItems={showcaseContinuationItems}
            featuredItem={showcaseFeaturedItem}
            itemAlt={experientialAlt}
            itemHref={(item) => getLocalExperientialProjectHref({ slug: item.slug })}
            onNavigate={navigateWithTransition}
            railItems={showcaseRailItems}
            title={featuredProject.title}
            {...scenicShowcaseProps}
          />
        ) : null}

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="container max-w-[88rem]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
              About This Portfolio
            </p>
            <div className="mt-4 grid gap-10 lg:grid-cols-2">
              <div className="space-y-5">
                <h2 className="font-sans text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
                  Experiential Design in Practice
                </h2>
                <p className="max-w-3xl text-[1rem] leading-7 text-white/62 md:text-[1.05rem]">
                  This portfolio focuses on experiential projects that move between concept
                  visualization, client communication, production coordination, and finished
                  installation. The work includes renderings, technical drawing, and completed
                  project imagery presented together so each case study can show the full path
                  from proposal to built result.
                </p>
                <p className="max-w-3xl text-[1rem] leading-7 text-white/55 md:text-[1.05rem]">
                  Rather than splitting those assets into separate categories, these projects are
                  organized around the design problem itself. The goal is to show how visual
                  intent gets communicated early, translated into practical documentation, and
                  carried through into real-world audience experience.
                </p>
              </div>

              <div className="space-y-4 rounded-xl bg-card/20 p-6 md:p-8">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Core Focus Areas
                </h3>
                <ul className="space-y-3 text-sm text-white/62 md:text-base">
                  <li>Concept renderings for internal review, client presentations, and alignment</li>
                  <li>Technical drawing that turns visual direction into buildable information</li>
                  <li>Project storytelling that keeps design intent visible across phases</li>
                  <li>Finished-work documentation that shows the installed experience in context</li>
                  <li>Design support for branded environments, events, and spatial activations</li>
                </ul>
                <p className="pt-2 text-xs uppercase tracking-[0.18em] text-white/42">
                  Concept to installation • Southern California • Available nationally
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
