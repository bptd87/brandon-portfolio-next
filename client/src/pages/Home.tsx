"use client";

import { type MouseEvent } from "react";
import { useLocation } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { ProjectGridSkeleton } from "@/components/SkeletonLoaders";
import { StickyShowcase } from "@/components/StickyShowcase";
import { getProjectPath } from "@/lib/projectRoutes";
import {
  scenicShowcaseProps,
  sortScenicProjectsChronologically,
  splitScenicShowcaseProjects,
} from "@/lib/scenicShowcase";
import type { ScenicProjectSummary } from "@shared/scenicProjectSummaries";

const homeLandingCopy = {
  subtitle: "Brandon PT Davis",
  title: "Scenic design, rendering, and experiential work shaped by story.",
  intro:
    "A portfolio of theatre environments, concept renderings, and experiential design work built around story, architecture, and the emotional logic of performance.",
} as const;

export default function Home({ initialProjects }: { initialProjects: ScenicProjectSummary[] }) {
  const [, setLocation] = useLocation();
  const projects = sortScenicProjectsChronologically(initialProjects);
  const projectsLoading = false;
  const { featuredProject, showcaseRailProjects, showcaseGridProjects } =
    splitScenicShowcaseProjects(projects);
  const scenicAlt = (title: string) => `${title} scenic design by Brandon PT Davis`;
  const heroTitle = homeLandingCopy.title;
  const heroSubtitle = homeLandingCopy.subtitle;
  const heroIntro = homeLandingCopy.intro;

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
    <>
      <SEO
        title="Brandon PT Davis | Scenic Designer"
        description="San Diego-based union scenic designer creating story-driven environments for regional theatre, summer stock, and academic production."
        keywords="scenic designer, scenic design portfolio, USA 829 scenic designer, San Diego scenic designer, Southern California scenic designer, regional theatre design, stage design, Brandon PT Davis"
        image={featuredProject?.coverImageUrl || undefined}
        imageAlt={
          featuredProject
            ? `${featuredProject.title} scenic design cover image`
            : "Brandon PT Davis scenic design portfolio"
        }
        url="https://www.brandonptdavis.com"
      />

      <Header />

      <main>
        {projectsLoading ? (
          <ProjectGridSkeleton />
        ) : featuredProject ? (
          <>
            <section className="relative overflow-hidden border-b border-border/40 pb-10 pt-24 md:pb-14 md:pt-32">
              <div className="pointer-events-none absolute inset-0">
                <div className="hero-stage-panel absolute inset-x-0 inset-y-0" />
                <div className="hero-stage-sweep absolute left-[8%] top-[14%] h-48 w-[72%] rounded-full blur-3xl md:left-[14%] md:top-[18%] md:h-56 md:w-[58%]" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-background" />
              </div>
              <div className="container max-w-[88rem]">
                <div className="relative max-w-3xl py-2">
                  <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.24em] text-white/42">
                    {heroSubtitle}
                  </p>
                  <h1 className="font-sans text-[clamp(2.3rem,4.6vw,3.8rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                    {heroTitle}
                  </h1>
                  <p className="mt-6 max-w-3xl text-[1rem] leading-7 text-white/58 md:text-[1.05rem]">
                    {heroIntro}
                  </p>
                </div>
              </div>
            </section>

            <StickyShowcase
              continuationItems={showcaseGridProjects}
              featuredItem={featuredProject}
              itemAlt={scenicAlt}
              itemHref={getProjectPath}
              onNavigate={navigateWithTransition}
              railItems={showcaseRailProjects}
              title={featuredProject.title}
              {...scenicShowcaseProps}
            />
          </>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
