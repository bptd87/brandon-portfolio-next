"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Link } from "wouter";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

import AboutNav from "@/components/AboutNav";
import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileSectionHero from "@/components/ProfileSectionHero";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getLocalScenicProjects } from "@shared/localScenicProjects";

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

const chapterTextPositions = [
  "md:items-start md:justify-end md:text-left",
  "md:items-end md:justify-end md:text-right",
  "md:items-start md:justify-center md:text-left",
  "md:items-end md:justify-center md:text-right",
  "md:items-center md:justify-end md:text-center",
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
    <div className="min-h-screen bg-black text-white [--background:#000000] [--border:rgba(255,255,255,0.14)] [--foreground:#ffffff]">
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
      <AboutNav tone="dark" />

      <main>
        <ProfileSectionHero
          canonicalPath="/creative-statement"
          description="A statement on scenic design as spatial storytelling, collaboration, architecture, history, and theatrical memory."
          imageAlt="Notebook icon for creative statement"
          imageSrc="/images/about/icons/creative-statement-icon.png"
          title="Creative Statement"
          updatedAt="May 22, 2026"
          tone="dark"
        />

        <section className="border-y border-white/10 bg-black px-5 py-5 sm:px-8 md:px-[clamp(3rem,7vw,7rem)]">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-[42rem] text-[0.98rem] leading-7 tracking-[-0.018em] text-white/54">
              Start with the formal statement, then move through the visual version below as each
              idea becomes space, process, and performance.
            </p>
            <a
              href={STATEMENT_PDF_URL}
              download
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 text-[0.92rem] font-medium tracking-[-0.015em] text-black transition-colors hover:bg-[color-mix(in_oklch,var(--accent-articles)_28%,white)]"
            >
              <Download className="h-4 w-4" />
              Download statement
            </a>
          </div>
        </section>

        <article id="statement">
          {statementChapters.map((chapter, index) => {
            const visual =
              index === 3
                ? renderingChapterVisual
                : index === 4
                  ? revealChapterVisual
                  : statementVisuals[index] || openingVisual;
            const positionClass = chapterTextPositions[index] || chapterTextPositions[0];

            return (
              <section
                key={chapter.label}
                className="relative isolate min-h-[100svh] overflow-hidden bg-black text-white"
              >
                {visual?.coverImageUrl ? (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.06, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.45 }}
                    transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={visual.coverImageUrl}
                      alt={visual.title}
                      fill
                      priority={index === 0}
                      quality={86}
                      sizes="100vw"
                      className="object-contain"
                    />
                  </motion.div>
                ) : null}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.74))]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.78))]" />
                <div className="absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,rgba(0,0,0,0.5),transparent)]" />

                <div className={`relative z-10 flex min-h-[100svh] px-5 py-12 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-20 ${positionClass}`}>
                  <motion.div
                    className="max-w-[46rem]"
                    initial={{ opacity: 0, y: 44, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, amount: 0.55 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="font-mono text-[0.78rem] uppercase tracking-[0.24em] text-white/58">
                      0{index + 1} · {chapter.label}
                    </p>
                    <h2 className="mt-5 font-sans text-[clamp(3rem,8vw,8.9rem)] font-semibold leading-[0.86] tracking-[-0.08em] text-white">
                      {chapter.title}
                    </h2>
                    <p className="mt-7 text-[clamp(1.08rem,1.65vw,1.36rem)] leading-[1.68] tracking-[-0.03em] text-white/78">
                      {chapter.body}
                    </p>
                    {visual?.slug ? (
                      <Link
                        href={getProjectHref(visual)}
                        className="mt-7 inline-flex border-b border-white/40 pb-1 text-[0.95rem] font-medium tracking-[-0.02em] text-white/76 transition-colors hover:border-white hover:text-white"
                      >
                        {visual.title}
                      </Link>
                    ) : visual ? (
                      <p className="mt-7 inline-flex border-b border-white/24 pb-1 text-[0.95rem] font-medium tracking-[-0.02em] text-white/58">
                        {visual.title}
                      </p>
                    ) : null}
                  </motion.div>
                </div>
              </section>
            );
          })}
        </article>

        <section className="bg-black px-5 py-16 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-24">
          <AnimatedSection className="mx-auto flex min-h-[68svh] max-w-[88rem] border-y border-white/12 py-14 md:py-20">
            <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(18rem,0.3fr)] lg:items-center">
              <div>
                <p className="font-mono text-[0.8rem] uppercase tracking-[0.22em] text-white/34">
                  Brandon PT Davis
                </p>
                <h2 className="mt-5 max-w-[14.5ch] bg-[linear-gradient(115deg,#ffffff_0%,color-mix(in_oklch,var(--accent-articles)_88%,white)_36%,var(--accent-articles)_68%,#ffffff_100%)] bg-clip-text font-sans text-[3rem] font-semibold leading-[0.96] tracking-[0] text-transparent sm:text-[4.7rem] lg:text-[6.25rem]">
                  Scenic design as a world that could not be any other way.
                </h2>
              </div>
              <div className="max-w-[26rem] space-y-6 lg:justify-self-end">
                <p className="text-[1.08rem] leading-[1.75] tracking-[0] text-white/58 sm:text-[1.18rem]">
                  Read the formal statement as a PDF, then return to the visual sequence as the
                  ideas move from text to rooms, revisions, and reveal.
                </p>
                <a
                  href={STATEMENT_PDF_URL}
                  download
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.92rem] font-medium tracking-[0] text-black transition-colors hover:bg-[color-mix(in_oklch,var(--accent-articles)_28%,white)]"
                >
                  <Download className="h-4 w-4" />
                  Download statement
                </a>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer tone="dark" />
    </div>
  );
}
