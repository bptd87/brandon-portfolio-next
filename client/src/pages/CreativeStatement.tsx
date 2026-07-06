"use client";

import Image from "next/image";
import { useMemo, type CSSProperties } from "react";
import { Link } from "wouter";
import { Download } from "lucide-react";

import AboutNav from "@/components/AboutNav";
import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileSectionHero from "@/components/ProfileSectionHero";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getLocalScenicProjects } from "@shared/localScenicProjects";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";

const STATEMENT_PDF_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/pdf/downloads/site/brandon-pt-davis-creative-statement-93eb8f2125.pdf";
const RENDERING_CHAPTER_IMAGE_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/generated-portfolios/project-90041-gallery-150199-ef242aeb.webp";
const REVEAL_CHAPTER_IMAGE_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90017-gallery-150070-34f3888b.webp";

const statementParagraphs = [
  "My passion for scenic design falls somewhere between a love of architecture, history, and narrative storytelling. I'm drawn to projects that have meaning and impact for the communities they serve. I'm especially interested in productions where the design does more than illustrate a setting and becomes part of how the story resonates.",
  "I value every collaborator involved in bringing a production to life. That starts with the hidden collaborator, the playwright, and extends to the director, the creative team, and the production teams. I also enjoy working closely with company managers, carpenters, and artisans to realize the best version of the creative team's vision within each unique venue.",
  "My process often begins with a lot of ideas that pull in different directions. Early conversations with the director focus on the text: What do they see, and how can we shape a shared vision? From that point forward, I build digital models to explore and sculpt the world. I'm never afraid to start over, no matter where we are in the process.",
  "I love the energy of collaborative design conversations, when ideas start bouncing between departments and the production finds its rhythm. Technically, I thrive in the transition from rendering to drafting, translating concepts into fully buildable spaces. I'm drawn to designs where structure and detail work together, and where every choice supports both the narrative and the performers onstage.",
  "Whether I'm working on a classic or a new play, my goal is to create environments that feel inevitable once they're revealed. Ideally, the design feels like it couldn't have been any other way, even if it took many revisions and collaborative breakthroughs to get there.",
];

const statementChapters = [
  {
    label: "Architecture + History + Story",
    title: "The room is never only a room.",
    body: statementParagraphs[0],
  },
  {
    label: "Creative room / Shop floor",
    title: "The work begins before the model and continues through the shop.",
    body: statementParagraphs[1],
  },
  {
    label: "Text → Model → Revision",
    title: "A first idea is a doorway, not a destination.",
    body: statementParagraphs[2],
  },
  {
    label: "Rendering → Drafting → Construction",
    title: "The image has to become a place performers can trust.",
    body: statementParagraphs[3],
  },
  {
    label: "Revision + Breakthrough → Reveal",
    title: "When the world arrives, it should feel inevitable.",
    body: statementParagraphs[4],
  },
] as const;

const getProjectTimestamp = (project: any) => {
  if (project.year) {
    const monthIndex = project.month ? Math.max(project.month - 1, 0) : 6;
    return new Date(project.year, monthIndex, 1).getTime();
  }

  const fallback = project.updatedAt || project.publishedAt || project.createdAt;
  return fallback ? new Date(fallback).getTime() : 0;
};

export default function CreativeStatement() {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
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
    .slice(0, 8);

  const statementVisuals = statementGallery.slice(0, 5);
  const openingVisual = heroProject || statementVisuals[0];
  const renderingChapterVisual = {
    coverImageUrl: RENDERING_CHAPTER_IMAGE_URL,
    title: "Rendering study",
    year: null,
    slug: null,
    discipline: null,
  };
  const revealChapterVisual = {
    coverImageUrl: REVEAL_CHAPTER_IMAGE_URL,
    title: "All My Sons",
    year: null,
    slug: "all-my-sons",
    discipline: "scenic_design",
  };

  const getProjectHref = (project: { discipline?: string | null; slug?: string | null }) => {
    if (!project.slug) return "/portfolio";
    return project.discipline === "rendering"
      ? `/projects/rendering/${project.slug}`
      : `/project/${project.slug}`;
  };

  return (
    <div
      className="about-profile-light min-h-screen transition-colors duration-500"
      style={
        {
          backgroundColor: homeTheme.bg,
          color: homeTheme.ink,
          fontFamily: HOME_BODY_FONT,
          "--background": homeTheme.bg,
          "--foreground": homeTheme.ink,
          "--border": homeTheme.ghost,
        } as CSSProperties
      }
    >
      <SEO
        title="Creative Design Statement | Scenic Design Philosophy"
        description="A downloadable creative statement by Brandon PT Davis on scenic design, architecture, history, collaboration, and story-led theatrical environments."
        keywords="scenic design philosophy, creative statement scenic designer, theatrical storytelling, architectural design for stage, spatial narrative, theatre design approach"
        image={heroProject?.coverImageUrl ?? undefined}
        url="https://www.brandonptdavis.com/creative-statement"
        type="article"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Profile", url: "https://www.brandonptdavis.com/about" },
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
            "Scenic designer exploring architecture, history, collaboration, and narrative storytelling to create buildable stage environments for theatre production.",
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
            "A scenic design creative statement by Brandon PT Davis, articulating architecture, collaboration, process, and story-led spatial design.",
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
        <ProfileSectionHero
          canonicalPath="/creative-statement"
          description="A statement on scenic design as spatial storytelling, collaboration, architecture, history, and practical theatrical memory."
          imageAlt="Notebook icon for creative statement"
          imageSrc="/images/about/icons/creative-statement-icon.png"
          showImage={false}
          title="Creative Statement"
          updatedAt="July 5, 2026"
        />

        <section
          className="px-5 py-5 sm:px-8 md:px-[clamp(3rem,7vw,7rem)]"
          style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}
        >
          <div className="mx-auto flex max-w-[88rem] justify-center">
            <a
              href={STATEMENT_PDF_URL}
              download
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-5 text-[0.92rem] font-black uppercase tracking-[0.02em] transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
            >
              <Download className="h-4 w-4" />
              Download statement
            </a>
          </div>
        </section>

        <article
          id="statement"
          className="px-[clamp(1.5rem,5vw,6rem)] py-[clamp(4rem,8vw,7rem)]"
          style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}
        >
          <AnimatedSection className="mx-auto max-w-[74rem]">
            <div className="space-y-[clamp(3rem,7vw,6rem)]">
              {statementChapters.map((chapter, index) => {
                const visual =
                  index === 3
                    ? renderingChapterVisual
                    : index === 4
                      ? revealChapterVisual
                      : statementVisuals[index] || openingVisual;
                const shouldFlip = index % 2 === 1;

                return (
                  <section
                    key={chapter.label}
                    className={`grid gap-7 md:grid-cols-[minmax(0,0.92fr)_minmax(18rem,0.72fr)] md:items-center md:gap-[clamp(2.5rem,5vw,5rem)] ${
                      shouldFlip ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="mx-auto max-w-[40rem] md:mx-0">
                      <h3
                        className="text-balance text-[clamp(1.9rem,3.5vw,3.2rem)] font-black uppercase leading-[0.92] tracking-[0]"
                        style={{
                          color: homeTheme.ink,
                          fontFamily: HOME_DISPLAY_FONT,
                          fontStretch: "condensed",
                        }}
                      >
                        {chapter.title}
                      </h3>
                      <p
                        className="mt-5 text-[1rem] font-medium leading-8 tracking-[-0.02em] md:text-[1.08rem]"
                        style={{ color: homeTheme.muted }}
                      >
                        {chapter.body}
                      </p>
                      {visual?.slug ? (
                        <Link
                          href={getProjectHref(visual)}
                          className="mt-6 inline-flex text-[0.86rem] font-black uppercase tracking-[0.05em] transition-transform hover:-translate-y-0.5"
                          style={{ color: homeTheme.ink }}
                        >
                          {visual.title}
                        </Link>
                      ) : null}
                    </div>

                    {visual?.coverImageUrl ? (
                      <Link
                        href={visual.slug ? getProjectHref(visual) : "#statement"}
                        className="site-media-square group relative block aspect-[4/3] overflow-hidden rounded-[1.65rem] shadow-[0_26px_70px_rgba(0,0,0,0.16)]"
                        aria-label={visual.slug ? `Open ${visual.title}` : visual.title}
                      >
                        <Image
                          src={visual.coverImageUrl}
                          alt={visual.title}
                          fill
                          quality={86}
                          sizes="(min-width: 1024px) 34rem, 92vw"
                          className="site-media-square object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        />
                      </Link>
                    ) : null}
                  </section>
                );
              })}
            </div>

            <div
              className="mx-auto mt-[clamp(4rem,8vw,7rem)] flex max-w-[44rem] flex-col items-center px-6 py-8 text-center sm:px-10"
              style={{ color: homeTheme.ink }}
            >
              <h2
                className="text-balance text-[clamp(1.9rem,3.5vw,3.2rem)] font-black uppercase leading-[0.92] tracking-[0]"
                style={{
                  color: homeTheme.ink,
                  fontFamily: HOME_DISPLAY_FONT,
                  fontStretch: "condensed",
                }}
              >
                Scenic design as a world that could not be any other way.
              </h2>
              <p
                className="mt-5 max-w-[32rem] text-[1rem] font-medium leading-7 tracking-[-0.02em]"
                style={{ color: homeTheme.muted }}
              >
                Read the formal PDF, then return to the work as the ideas move from text to rooms,
                revisions, and reveal.
              </p>
              <a
                href={STATEMENT_PDF_URL}
                download
                className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[0.84rem] font-black uppercase tracking-[0.02em] transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
              >
                <Download className="h-4 w-4" />
                Download statement
              </a>
            </div>
          </AnimatedSection>
        </article>
      </main>

      <Footer tone="light" />
    </div>
  );
}
