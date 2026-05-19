"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { Check, ChevronLeft, ChevronRight, Link2 } from "lucide-react";

import AboutNav from "@/components/AboutNav";
import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { copyTextToClipboard } from "@/lib/clipboard";
import { getLocalScenicProjects } from "@shared/localScenicProjects";

const getProjectTimestamp = (project: any) => {
  if (project.year) {
    const monthIndex = project.month ? Math.max(project.month - 1, 0) : 6;
    return new Date(project.year, monthIndex, 1).getTime();
  }

  const fallback = project.updatedAt || project.publishedAt || project.createdAt;
  return fallback ? new Date(fallback).getTime() : 0;
};

export default function CreativeStatement() {
  const galleryRailRef = useRef<HTMLDivElement | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const scenicDesignProjects = useMemo(
    () =>
      [...getLocalScenicProjects()].sort((a, b) => {
        const timeCompare = getProjectTimestamp(b) - getProjectTimestamp(a);
        if (timeCompare !== 0) return timeCompare;
        return a.title.localeCompare(b.title);
      }),
    []
  );

  const heroProject =
    scenicDesignProjects.find((project) => project.featured && project.coverImageUrl) ||
    scenicDesignProjects.find((project) => project.coverImageUrl);

  const statementGallery = scenicDesignProjects
    .filter((project) => !!project.coverImageUrl && !!project.slug)
    .slice(0, 9);

  const scrollGalleryBy = (direction: "prev" | "next") => {
    const rail = galleryRailRef.current;
    if (!rail) return;

    const firstCard = rail.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(
      window.getComputedStyle(rail).columnGap || window.getComputedStyle(rail).gap || "24"
    );
    const amount = firstCard ? firstCard.offsetWidth + gap : Math.max(rail.clientWidth * 0.72, 320);

    rail.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const getProjectHref = (project: { discipline?: string | null; slug?: string | null }) => {
    if (!project.slug) return "/portfolio";
    return project.discipline === "rendering"
      ? `/projects/rendering/${project.slug}`
      : `/project/${project.slug}`;
  };

  const handleShare = async () => {
    const path = "/creative-statement";
    const url =
      typeof window === "undefined" ? `https://www.brandonptdavis.com${path}` : `${window.location.origin}${path}`;

    const copied = await copyTextToClipboard(url);
    if (copied) {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Creative Design Statement | Scenic Design Philosophy"
        description="Exploring architecture, history, and storytelling through scenic design. A creative statement centered on narrative space, dramaturgy, and production collaboration."
        keywords="scenic design philosophy, creative statement scenic designer, theatrical storytelling, architectural design for stage, spatial narrative, theatre design approach"
        image={heroProject?.coverImageUrl ?? undefined}
        url="https://www.brandonptdavis.com/creative-statement"
        type="article"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "About", url: "https://www.brandonptdavis.com/about" },
          { name: "Creative Statement", url: "https://www.brandonptdavis.com/creative-statement" },
        ]}
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic Designer",
          url: "https://www.brandonptdavis.com",
          description:
            "Scenic designer exploring architecture, history, and storytelling to create narrative stage environments for theatre production.",
          knowsAbout: [
            "Scenic Design",
            "Spatial Storytelling",
            "Architectural Design",
            "Immersive Environments",
            "Historical Research",
            "Theatrical Collaboration",
          ],
        }}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: "Creative Statement: Architecture, History, and Narrative Storytelling",
          description:
            "A scenic design creative statement by Brandon PT Davis, articulating process, collaboration, and story-led spatial design.",
          url: "https://www.brandonptdavis.com/creative-statement",
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          datePublished: "2026-01-01",
          genre: "Scenic Design",
          keywords: [
            "creative statement",
            "scenic design philosophy",
            "theatre design process",
            "story-led design",
          ],
          image: heroProject?.coverImageUrl || undefined,
          about: "Scenic design philosophy and production collaboration",
        }}
      />

      <Header />
      <AboutNav />

      <main>
        <article className="overflow-hidden py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
            <header className="mx-auto max-w-[62rem] text-center">
              <AnimatedSection>
                <div className="flex flex-wrap items-center justify-center gap-4 text-[0.92rem] tracking-[-0.015em] text-foreground/54">
                  <span>Creative Statement</span>
                  <span>Scenic Design Philosophy</span>
                  <span>Brandon PT Davis</span>
                </div>

                <h1 className="mx-auto mt-5 max-w-[15ch] font-sans text-[clamp(2.7rem,5.8vw,5.9rem)] font-medium leading-[0.92] tracking-[-0.072em] text-foreground">
                  Architecture, history, and narrative storytelling.
                </h1>

                <p className="mx-auto mt-5 max-w-[42rem] text-[clamp(1rem,1.45vw,1.34rem)] leading-[1.62] tracking-[-0.018em] text-foreground/68">
                  My scenic design practice sits at the intersection of architecture, historical
                  thinking, and story-led space making. I am most interested in work where design
                  becomes part of how a production resonates, not just how it looks.
                </p>
              </AnimatedSection>

              {heroProject?.coverImageUrl ? (
                <AnimatedSection delay={140}>
                  <div className="group relative mx-auto mt-10 aspect-video max-w-[88rem] overflow-hidden bg-white/[0.02]">
                    <Image
                      src={heroProject.coverImageUrl}
                      alt={`${heroProject.title} scenic design production image`}
                      fill
                      priority
                      quality={88}
                      sizes="(min-width: 1280px) 1120px, 100vw"
                      className="object-cover transition-[filter,transform] duration-[1200ms] ease-out group-hover:scale-[1.018] group-hover:brightness-110"
                    />
                  </div>
                </AnimatedSection>
              ) : null}

              <AnimatedSection delay={260}>
                <div className="mx-auto mt-8 flex w-full max-w-[62rem] items-center justify-between gap-6 border-t border-white/14 pt-4 text-foreground/72">
                  <div className="flex flex-wrap items-center gap-4 text-[0.96rem] tracking-[-0.018em] sm:gap-5">
                    <span>Statement</span>
                    <span className="text-foreground/42">/</span>
                    <span>Scenic design practice</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 text-[0.96rem] tracking-[-0.018em] transition-colors hover:text-foreground"
                  >
                    {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                    <span>{linkCopied ? "Link copied" : "Share"}</span>
                  </button>
                </div>
              </AnimatedSection>
            </header>

            <AnimatedSection delay={360} className="mx-auto mt-14 max-w-[54rem]">
              <div className="space-y-8 text-[1.04rem] leading-[1.9] tracking-[-0.01em] text-foreground/76 md:text-[1.08rem]">
                <p>
                  My passion for scenic design falls somewhere between a love of architecture,
                  history, and narrative storytelling. I am drawn to projects that have meaning and
                  impact for the communities they serve. The productions I return to most are the
                  ones where the design does more than illustrate a setting and instead participates
                  in how the story is felt.
                </p>

                <p>
                  I think about space as an active dramatic partner. A room can apply pressure. A
                  wall can hold memory. A doorway can become a promise, a threat, or a question. I
                  am interested in scenic environments that give performers something specific to
                  push against while giving the audience a clear emotional architecture for the
                  story.
                </p>

                <blockquote className="my-12 border-y border-border/35 py-8 font-sans text-[clamp(1.9rem,4vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.055em] text-foreground md:my-14 md:py-10">
                  Scenic design should shape how a story is felt, not just where it appears to
                  happen.
                </blockquote>

                <p>
                  Collaboration is central to that work. I value every person involved in bringing
                  a production to life, beginning with the playwright and extending through the
                  director, design team, technicians, managers, carpenters, and artisans. The work
                  is strongest when the full production can move toward a shared spatial idea
                  together.
                </p>

                <p>
                  I especially care about the conversations that happen between departments, where
                  scenic design has to remain flexible enough to support lighting, costumes,
                  projections, movement, and performance. Collaboration is not a secondary value in
                  the work. It is part of the design itself.
                </p>

                <p>
                  My process usually starts with too many possibilities at once. Early conversations
                  with a director are about the text first: what they see, what the play requires,
                  and how a shared visual logic can emerge. From there I build digital models,
                  sketches, research boards, and renderings to explore and sculpt the world.
                </p>

                <blockquote className="my-12 border-l border-border/35 pl-7 font-sans text-[clamp(1.75rem,3vw,2.65rem)] font-medium leading-[1.12] tracking-[-0.05em] text-foreground/92 md:my-14 md:pl-9">
                  I am never afraid to start over, no matter where we are in the process.
                </blockquote>

                <p>
                  I care about the transition from rendering to drafting, where an idea has to
                  become clear enough to build, rehearse in, and perform inside. That part of the
                  process is not separate from the artistry. It is where the idea becomes accountable
                  to materials, labor, time, money, and the actual event of performance.
                </p>

                <p>
                  Whether I am working on a classic or a new play, I want the environment to feel
                  inevitable once it is revealed. The best designs carry the weight of revision
                  quietly. They feel resolved, even when they were hard-won through many iterations
                  and collaborative breakthroughs.
                </p>

                <p>
                  I am looking for clarity rather than spectacle for its own sake. The strongest
                  design choices are the ones that support performers, deepen the dramaturgy, and
                  make the audience feel that the world of the play could not have been built in any
                  other way.
                </p>

                <div className="border-t border-border/35 pt-8">
                  <p className="font-sans text-[1.35rem] font-medium tracking-[-0.03em] text-foreground">
                    Brandon PT Davis
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-7 text-foreground/54">
                    Scenic Designer
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </article>

        {statementGallery.length > 0 ? (
          <section className="border-t border-border/35 px-4 py-14 sm:px-6 md:py-20 lg:px-8">
            <div className="mx-auto max-w-[1120px]">
              <AnimatedSection className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Work Behind The Statement
                  </p>
                  <h2 className="mt-4 font-sans text-[clamp(1.8rem,3.5vw,3rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                    Production images connected to the same scenic design practice.
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollGalleryBy("prev")}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-foreground/65 transition-colors hover:border-border hover:text-foreground"
                    aria-label="Scroll gallery left"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollGalleryBy("next")}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-foreground/65 transition-colors hover:border-border hover:text-foreground"
                    aria-label="Scroll gallery right"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={140}>
                <div
                  ref={galleryRailRef}
                  className="mt-10 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {statementGallery.map((project) => (
                    <Link
                      key={project.id}
                      href={getProjectHref(project)}
                      className="group block w-[min(74vw,28rem)] shrink-0 snap-start md:w-[calc((100%_-_3rem)_/_3)]"
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-card/20">
                        <Image
                          src={project.coverImageUrl || ""}
                          alt={project.title}
                          fill
                          quality={82}
                          sizes="(max-width: 768px) 74vw, 33vw"
                          className="object-cover transition-[filter,transform] duration-700 group-hover:scale-[1.02] group-hover:brightness-110"
                        />
                      </div>
                      <p className="mt-3 font-sans text-[1rem] leading-7 text-foreground/74 transition-colors group-hover:text-foreground">
                        {project.title}
                      </p>
                      {project.client ? (
                        <p className="text-[0.95rem] leading-6 text-foreground/48 transition-colors group-hover:text-foreground/62">
                          {project.client}
                        </p>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
