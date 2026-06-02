"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { ProjectGridSkeleton } from "@/components/SkeletonLoaders";
import { getProjectPath } from "@/lib/projectRoutes";
import { sortScenicProjectsChronologically } from "@/lib/scenicShowcase";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "@shared/learningPortal";
import { getLocalArticles } from "@shared/localArticles";
import {
  getLocalExperientialProjectHref,
  getLocalExperientialProjects,
  getLocalRenderingGallery,
} from "@shared/localPortfolios";
import { getLocalTutorials } from "@shared/localStudio";
import type { ScenicProjectSummary } from "@shared/scenicProjectSummaries";
import { upcomingProductions } from "@shared/upcomingProductions";

const HOME_HERO_IMAGE_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90051-gallery-150232-69e3ddad.webp";
const ABOUT_HEADSHOT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/brandon-pt-davis-about-home.jpg";
const HOME_CTA_IMAGE_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90053-gallery-150197-48389e80.webp";

type PublishCard = {
  kind: "Article" | "Tutorial";
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  timestamp: number;
};

type HomeRenderingRailCard = {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  meta: string;
};

const getPublishTimestamp = (...dates: Array<string | Date | null | undefined>) =>
  Math.max(
    ...dates.map(date => {
      const time = new Date(date || 0).getTime();
      return Number.isFinite(time) ? time : 0;
    })
  );

const getProjectTimestamp = (input: {
  updatedAt?: string | null;
  createdAt?: string | null;
  year?: number | null;
  month?: number | null;
}) => {
  if (input.year) {
    const monthIndex = input.month ? Math.max(0, Math.min(11, input.month - 1)) : 6;
    return new Date(input.year, monthIndex, 1).getTime();
  }

  const explicitDate = input.updatedAt || input.createdAt;
  if (explicitDate) {
    const timestamp = new Date(explicitDate).getTime();
    if (Number.isFinite(timestamp)) return timestamp;
  }

  return 0;
};

const cleanPublishTitle = (title: string) =>
  title
    .replace(/^Vectorworks Tutorial:\s*/i, "")
    .replace(/^Vectorworks Quick Tip:\s*/i, "")
    .trim();

const cleanPublishDescription = (value?: string | null) => {
  const text = String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "Studio notes, process writing, and practical scenic design resources.";
  if (text.length <= 118) return text;
  return `${text.slice(0, 115).trim()}...`;
};

const getHomePublishCards = (): PublishCard[] => {
  const localArticles = getLocalArticles();

  const articleCards = localArticles
    .filter(article => !LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
    .filter(article => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
    .map(article => ({
      kind: "Article" as const,
      title: cleanPublishTitle(article.title),
      description: cleanPublishDescription(article.excerpt || article.seoDescription),
      href: `/articles/${article.slug}`,
      image: article.coverImageUrl,
      imageAlt: article.coverImageAlt || `Cover image for ${article.title}`,
      timestamp: getPublishTimestamp(article.publishedAt, article.updatedAt, article.createdAt),
    }))
    .filter(card => card.image)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 4);

  const tutorialArticleCards = localArticles
    .filter(article => LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
    .map(article => ({
      kind: "Tutorial" as const,
      title: cleanPublishTitle(article.title),
      description: cleanPublishDescription(article.excerpt || article.seoDescription),
      href: `/studio/tutorials/${article.slug}`,
      image: article.coverImageUrl,
      imageAlt: article.coverImageAlt || `Cover image for ${article.title}`,
      timestamp: getPublishTimestamp(article.publishedAt, article.updatedAt, article.createdAt),
    }));

  const tutorialCards = getLocalTutorials()
    .filter(tutorial => (tutorial.status || "published") === "published")
    .map(tutorial => ({
      kind: "Tutorial" as const,
      title: cleanPublishTitle(tutorial.title),
      description: cleanPublishDescription(tutorial.description || tutorial.overview),
      href: `/studio/tutorials/${tutorial.slug}`,
      image:
        tutorial.cover_image ||
        "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-1.png",
      imageAlt: `Tutorial cover for ${cleanPublishTitle(tutorial.title)}`,
      timestamp: getPublishTimestamp(
        tutorial.published_at,
        tutorial.updated_at,
        tutorial.created_at
      ),
    }));

  const latestTutorialCards = [...tutorialArticleCards, ...tutorialCards]
    .filter(card => card.image)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 4);

  return Array.from({ length: 4 }).flatMap((_, index) =>
    [articleCards[index], latestTutorialCards[index]].filter(Boolean)
  );
};

const portfolioCategoryRows: Array<{
  title: string;
  match: string[];
  href: string;
  description: string;
}> = [
  {
    title: "Drama",
    match: ["Drama"],
    href: "/tags/drama",
    description:
      "Rooms under pressure. Places where memory, grief, class, and consequence become visible.",
  },
  {
    title: "Comedy",
    match: ["Comedy"],
    href: "/tags/comedy",
    description:
      "Spaces tuned for timing: entrances, exits, reversals, hiding places, and social misreadings.",
  },
  {
    title: "Musical Theatre",
    match: ["Musical Theatre"],
    href: "/tags/musical-theatre",
    description:
      "Design that can carry rhythm, scale, spectacle, and emotional turn-on-a-dime transformation.",
  },
  {
    title: "Shakespeare",
    match: ["Shakespeare"],
    href: "/tags/shakespeare",
    description:
      "Old texts reframed through contemporary space, civic pressure, ritual, and bodies in public.",
  },
  {
    title: "TYA",
    match: ["Theatre for Young Audiences"],
    href: "/tags/theatre-for-young-audiences",
    description:
      "Clear, generous environments for young audiences: playful enough to invite, precise enough to guide.",
  },
];

function HomeIntro() {
  return (
    <section
      id="portfolio-categories"
      className="relative min-h-[calc(100svh-74px)] overflow-hidden bg-black"
    >
      <img
        src={HOME_HERO_IMAGE_URL}
        alt="Scenic rendering by Brandon PT Davis"
        className="site-media-square absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/22" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.48)_34%,rgba(0,0,0,0.08)_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/74 via-black/24 to-transparent" />

      <div className="relative flex min-h-[calc(100svh-74px)] items-center px-[clamp(1.5rem,5vw,6rem)] py-24">
        <div className="relative z-10 max-w-[56rem] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-5 motion-safe:duration-700">
          <p className="mb-7 font-sans text-[clamp(1rem,1.45vw,1.22rem)] font-medium leading-none tracking-[-0.035em] text-white/78">
            Brandon PT Davis Scenic Design
          </p>
          <h1
            aria-label="If all the world is a stage, then is the scenic designer its architect?"
            className="max-w-[min(64rem,100%)] font-sans text-[clamp(2.85rem,5.75vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.04em] text-white"
          >
            <span className="block">If all the world is a stage, </span>
            <span className="block">then is the scenic designer </span>
            <span className="block">its architect?</span>
          </h1>
          <p className="mt-7 max-w-[43rem] font-sans text-[clamp(1.16rem,2vw,1.9rem)] font-medium leading-[1.16] tracking-[-0.045em] text-white/72 md:mt-9">
            <span className="block text-white">No. </span>
            Scenic design gives form to the story's reflection of our world.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/projects"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#9d4edd] px-5 font-sans text-[0.98rem] font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#c77dff]"
            >
              View portfolio
            </a>
            <a
              href="/about"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#9d4edd]/72 px-5 font-sans text-[0.98rem] font-medium tracking-[-0.02em] text-[#e0aaff] transition-colors hover:border-[#c77dff] hover:text-white"
            >
              About Brandon
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeThesisSection() {
  const ideas = [
    {
      label: "Pressure",
      text: "Rooms that make behavior visible.",
    },
    {
      label: "Memory",
      text: "Spaces that carry what happened before the play begins.",
    },
    {
      label: "Transformation",
      text: "Designs that let the story change in front of us.",
    },
  ];

  return (
    <section className="border-t border-white/10 bg-black text-white">
      <div className="grid gap-12 px-[clamp(1.5rem,5vw,6rem)] py-[clamp(4.5rem,9vw,8rem)] lg:grid-cols-[0.9fr_1.35fr] lg:items-end">
        <div>
          <p className="section-kicker mb-6 text-white/42">Position</p>
          <h2 className="max-w-[12ch] font-sans text-[clamp(2.6rem,6.2vw,6.9rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">
            Not architecture exactly.
          </h2>
        </div>

        <div className="max-w-[48rem]">
          <p className="font-sans text-[clamp(1.35rem,2.6vw,2.75rem)] font-medium leading-[1.04] tracking-[-0.055em] text-white/88">
            A scenic designer does not build the world. They decide which
            version of the world the story needs us to see.
          </p>

          <dl className="mt-12 grid gap-7 border-t border-white/12 pt-8 md:grid-cols-3">
            {ideas.map(idea => (
              <div key={idea.label}>
                <dt className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.24em] text-[#c77dff]">
                  {idea.label}
                </dt>
                <dd className="mt-3 max-w-[15rem] font-sans text-[1.05rem] font-medium leading-[1.35] tracking-[-0.025em] text-white/62">
                  {idea.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function PortfolioCategoryRows({
  projects,
}: {
  projects: ScenicProjectSummary[];
}) {
  const rows = portfolioCategoryRows
    .map(row => ({
      ...row,
      projects: projects
        .filter(
          project =>
            project.coverImageUrl &&
            row.match.includes(project.subcategory || "")
        )
        .slice(0, 8),
    }))
    .filter(row => row.projects.length);

  if (!rows.length) return null;

  const renderCategoryPanel = (
    row: (typeof rows)[number],
    options: { split?: boolean } = {}
  ) => {
    const leadProject = row.projects[0];
    const isSplit = options.split === true;
    const alignRight =
      row.title === "Drama" ||
      row.title === "Musical Theatre" ||
      row.title === "TYA";
    const contentAlignment = alignRight
      ? "items-end text-right"
      : "items-start text-left";
    const overlayPosition = alignRight
      ? "justify-end md:pr-[clamp(2rem,7vw,8rem)]"
      : "justify-start md:pl-[clamp(2rem,7vw,8rem)]";
    const overlayGradient = alignRight
      ? "bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.14)_42%,rgba(0,0,0,0.58)_100%)]"
      : "bg-[linear-gradient(90deg,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.14)_58%,rgba(0,0,0,0)_100%)]";

    return (
      <article
        key={row.title}
        className={`group relative overflow-hidden bg-[#f1f0ec] ${
          isSplit ? "min-h-[78svh]" : "min-h-[94svh]"
        }`}
      >
        {leadProject ? (
          <a
            href={getProjectPath(leadProject)}
            className={`site-media-square relative block w-full overflow-hidden ${
              isSplit ? "h-[78svh]" : "h-[94svh]"
            }`}
            aria-label={`${leadProject.title} scenic design by Brandon PT Davis`}
          >
            <img
              src={leadProject.coverImageUrl || ""}
              alt={`${leadProject.title} scenic design by Brandon PT Davis`}
              className="site-media-square h-full w-full object-cover"
              loading="lazy"
            />
          </a>
        ) : null}

        <div
          className={`pointer-events-none absolute inset-0 ${overlayGradient}`}
          aria-hidden="true"
        />
        <div
          className={`absolute inset-0 flex items-center px-[clamp(1.5rem,5vw,6rem)] py-16 ${overlayPosition}`}
        >
          <div
            className={`flex max-w-[min(34rem,88vw)] flex-col ${contentAlignment}`}
          >
            <h2
              className={`font-sans font-semibold leading-[0.9] tracking-[-0.078em] text-white ${
                isSplit
                  ? "text-[clamp(2.45rem,4.5vw,4.6rem)]"
                  : "text-[clamp(3rem,5.7vw,6.1rem)]"
              }`}
            >
              {row.title}
            </h2>
            <p
              className={`mt-4 font-sans font-medium leading-[1.16] tracking-[-0.045em] text-white/70 ${
                isSplit
                  ? "max-w-[27rem] text-[clamp(1rem,1.42vw,1.22rem)]"
                  : "max-w-[34rem] text-[clamp(1.08rem,1.7vw,1.48rem)]"
              }`}
            >
              {row.description}
            </p>
            <div
              className={`pointer-events-auto mt-6 flex flex-wrap gap-3 ${
                alignRight ? "justify-end" : "justify-start"
              }`}
            >
              <a
                href={row.href}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#9d4edd] px-5 font-sans text-[0.95rem] font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#c77dff]"
              >
                View collection
              </a>
              {leadProject ? (
                <a
                  href={getProjectPath(leadProject)}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#9d4edd]/72 px-5 font-sans text-[0.95rem] font-medium tracking-[-0.02em] text-[#e0aaff] transition-colors hover:border-[#c77dff] hover:text-white"
                >
                  Featured project
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    );
  };

  const fullWidthRows = rows.slice(0, 3);
  const splitRows = rows.slice(3, 5);

  return (
    <section
      id="portfolio-index"
      className="border-t border-black/10 bg-[#f1f0ec]"
    >
      <div className="space-y-4 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(1rem,2vw,1.5rem)]">
        {fullWidthRows.map(row => renderCategoryPanel(row))}

        {splitRows.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {splitRows.map(row => renderCategoryPanel(row, { split: true }))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function BrandonSection() {
  return (
    <section className="relative min-h-[82svh] overflow-hidden border-t border-black/10 bg-[#c66f46]">
      <img
        src={ABOUT_HEADSHOT_URL}
        alt="Brandon PT Davis against an orange wall"
        className="site-media-square absolute inset-0 h-full w-full object-cover object-center"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(241,240,236,0.74)_0%,rgba(241,240,236,0.42)_35%,rgba(241,240,236,0.02)_68%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/18 to-transparent" />

      <div className="relative flex min-h-[82svh] items-center px-[clamp(1.5rem,5vw,6rem)] py-20 md:py-28">
        <div className="max-w-[48rem]">
          <p className="mb-5 section-kicker text-black/48">Profile</p>
          <h2 className="font-sans text-[clamp(2.4rem,5.2vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.07em] text-black">
            Scenic design from San Diego, with room for the world.
          </h2>
          <Heart
            aria-hidden="true"
            className="mt-6 h-8 w-8 fill-black text-black md:h-10 md:w-10"
            strokeWidth={1.75}
          />
          <p className="mt-8 max-w-[56rem] text-[1rem] leading-8 tracking-[-0.01em] text-black/62 md:text-[1.08rem]">
            Based in San Diego, I design theatrical spaces that make behavior
            visible: rooms under pressure, places with memory, and environments
            that shift as the story changes. The portfolio gathers production
            environments, renderings, and process work from theatre, academic,
            and collaborative design practice.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="/about"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#9d4edd] px-5 text-sm font-medium text-white transition-colors hover:bg-[#c77dff]"
            >
              About Brandon
            </a>
            <a
              href="/resume"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#9d4edd]/72 px-5 text-sm font-medium text-[#7b2cbf] transition-colors hover:border-[#7b2cbf] hover:text-black"
            >
              Resume / CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function UpcomingSection() {
  const nextProductions = upcomingProductions;
  const [activeProductionIndex, setActiveProductionIndex] = useState(0);
  const [productionWheelProgress, setProductionWheelProgress] = useState(0);
  const [productionWheelOpacity, setProductionWheelOpacity] = useState(1);
  const [productionWheelSpacing, setProductionWheelSpacing] = useState(148);
  const [productionWheelPin, setProductionWheelPin] = useState<
    "before" | "fixed" | "after"
  >("before");
  const sectionRef = useRef<HTMLElement | null>(null);
  const wheelStageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateWheel = () => {
      const section = sectionRef.current;
      const stage = wheelStageRef.current;
      if (!section || !stage) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(
        1,
        section.offsetHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
      const exactIndex = progress * nextProductions.length;
      const loopedIndex =
        ((exactIndex % nextProductions.length) + nextProductions.length) %
        nextProductions.length;
      const exitFade = progress > 0.82 ? Math.max(0, (1 - progress) / 0.18) : 1;

      setProductionWheelProgress(loopedIndex);
      setProductionWheelOpacity(exitFade);
      setActiveProductionIndex(
        Math.round(loopedIndex) % nextProductions.length
      );
      setProductionWheelSpacing(
        Math.min(200, Math.max(118, stage.clientHeight * 0.21))
      );
      setProductionWheelPin(
        rect.top > 0
          ? "before"
          : rect.bottom < window.innerHeight
            ? "after"
            : "fixed"
      );
    };

    updateWheel();
    window.addEventListener("scroll", updateWheel, { passive: true });
    window.addEventListener("resize", updateWheel);
    return () => {
      window.removeEventListener("scroll", updateWheel);
      window.removeEventListener("resize", updateWheel);
    };
  }, [nextProductions.length]);

  return (
    <section
      ref={sectionRef}
      aria-label="Upcoming productions"
      className="relative min-h-[520vh] bg-black text-white"
    >
      <div
        className="flex h-screen flex-col overflow-hidden bg-black"
        style={{
          position: productionWheelPin === "fixed" ? "fixed" : "absolute",
          top: productionWheelPin === "after" ? "auto" : 0,
          bottom: productionWheelPin === "after" ? 0 : "auto",
          left: 0,
          right: 0,
          opacity: productionWheelOpacity,
          transition: "opacity 180ms ease",
        }}
      >
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 w-[min(92vw,48rem)] -translate-x-1/2 px-[clamp(1.5rem,5vw,6rem)] pt-10 text-center md:pt-14">
          <p className="section-kicker mb-4 text-white">
            Upcoming Productions
          </p>
          <h2 className="mx-auto flex items-center justify-center gap-3 font-sans text-[clamp(2.25rem,4.4vw,4.65rem)] font-medium leading-[1] tracking-[-0.055em] text-white">
            <CalendarDays
              className="h-[0.82em] w-[0.82em] shrink-0"
              strokeWidth={1.65}
              aria-hidden="true"
            />
            <span>The season ahead.</span>
          </h2>
        </div>

        <div
          ref={wheelStageRef}
          className="relative min-h-0 flex-1 overflow-hidden pt-16"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36 bg-gradient-to-b from-black via-black/92 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-black via-black/92 to-transparent" />

          <div
            className="absolute inset-0"
            style={{ perspective: "1250px", transformStyle: "preserve-3d" }}
          >
            {nextProductions.map((production, index) => {
              const wheelLength = nextProductions.length;
              let distance = index - productionWheelProgress;
              if (distance > wheelLength / 2) distance -= wheelLength;
              if (distance < -wheelLength / 2) distance += wheelLength;

              const absDistance = Math.abs(distance);
              const isActive = activeProductionIndex === index;
              const isVisible = absDistance < 2.86;
              const scale = Math.max(0.76, 1 - absDistance * 0.075);
              const scaleY = Math.max(0.42, 1 - absDistance * 0.18);
              const opacity = isActive
                ? 1
                : Math.max(0.1, 0.31 - absDistance * 0.045);
              const arc = distance * 0.62;
              const rotateX = distance * -23;
              const skewX = distance * -5;
              const translateY = Math.sin(arc) * productionWheelSpacing * 1.26;
              const translateZ = (Math.cos(arc) - 1) * 320;
              const isLongTitle = production.title.length > 22;
              const isMediumTitle = production.title.length > 14;

              return (
                <a
                  key={production.id}
                  href={`/upcoming-productions/${production.id}`}
                  aria-label={`View ${production.title}`}
                  className="group absolute left-1/2 top-1/2 flex w-auto max-w-[88vw] items-center justify-center text-center"
                  style={{
                    opacity: isVisible ? opacity : 0,
                    pointerEvents: isVisible ? "auto" : "none",
                    transform: `translate(-50%, -50%) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) skewX(${skewX}deg) scale(${scale}) scaleY(${scaleY})`,
                    transformStyle: "preserve-3d",
                    transition: "opacity 160ms ease",
                  }}
                >
                  <span
                    className={`whitespace-nowrap font-sans font-medium uppercase leading-[0.78] tracking-[-0.078em] transition-colors duration-300 group-hover:text-white ${
                      isLongTitle
                        ? "text-[2.5rem] sm:text-[3.5rem] md:text-[4.7rem] lg:text-[5.8rem] xl:text-[6.6rem]"
                        : isMediumTitle
                          ? "text-[3rem] sm:text-[4.1rem] md:text-[5.3rem] lg:text-[6.6rem] xl:text-[7.5rem]"
                          : "text-[3.45rem] sm:text-[4.9rem] md:text-[6.3rem] lg:text-[8rem] xl:text-[9rem]"
                    } ${isActive ? "text-white" : "text-white/16"}`}
                  >
                    {production.title}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
function HomeExperientialAndRenderingSection() {
  const experientialProjects = getLocalExperientialProjects()
    .filter(project => project.coverImageUrl)
    .sort(
      (a, b) =>
        getProjectTimestamp({
          updatedAt: b.updatedAt,
          year: b.year,
          month: b.month,
        }) -
        getProjectTimestamp({
          updatedAt: a.updatedAt,
          year: a.year,
          month: a.month,
        })
    )
    .slice(0, 4);
  const renderingRailCards: HomeRenderingRailCard[] = getLocalRenderingGallery()
    .map(item => ({
      href: item.project?.slug
        ? `/projects/rendering/${item.project.slug}`
        : "",
      image: item.project?.coverImageUrl || "",
      imageAlt:
        item.altText ||
        item.project?.title ||
        "Scenic rendering by Brandon PT Davis",
      title: item.displayTitle || item.project?.title || "Rendering study",
      meta: [item.project?.client, item.project?.year]
        .filter(Boolean)
        .join(" / "),
    }))
    .filter(card => card.href && card.image)
    .filter(
      (card, index, list) =>
        list.findIndex(candidate => candidate.href === card.href) === index
    )
    .slice(0, 10);
  const movingRenderingCards = [...renderingRailCards, ...renderingRailCards];

  if (!experientialProjects.length && !renderingRailCards.length) return null;

  return (
    <section className="bg-black py-12 text-white md:py-16">
      <style>
        {`
          @keyframes home-rendering-rail {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}
      </style>

      <div className="px-[clamp(1.5rem,5vw,6rem)]">
        <div className="mx-auto mb-10 flex max-w-[70rem] flex-col items-center text-center">
          <p className="section-kicker mb-4 text-white">
            Rendering + Experiential Design
          </p>
          <h2 className="flex items-center justify-center gap-4 font-sans text-[clamp(2.35rem,4.8vw,5.15rem)] font-medium leading-[1] tracking-[-0.055em] text-white">
            <Box
              className="h-[0.78em] w-[0.78em] shrink-0"
              strokeWidth={1.65}
              aria-hidden="true"
            />
            <span>The same scenic eye, across medium and scale.</span>
          </h2>
          <p className="mt-6 max-w-[47rem] font-sans text-[clamp(1.05rem,1.65vw,1.45rem)] font-medium leading-[1.3] tracking-[-0.035em] text-white/56">
            Renderings, drawings, installations, and commercial environments
            carry the same questions as the theatre work: what does the space
            ask people to notice, feel, remember, or do?
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="/projects/experiential"
              className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-white/24 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-white/78 transition-colors hover:border-white hover:text-white"
            >
              View experiential
            </a>
            <a
              href="/projects/rendering"
              className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-white/16 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-white/62 transition-colors hover:border-white hover:text-white"
            >
              View renderings
            </a>
          </div>
        </div>
      </div>

      {experientialProjects.length ? (
        <div className="grid gap-3 px-[clamp(1rem,2vw,1.5rem)] md:grid-cols-2">
          {experientialProjects.map((project, index) => (
            <a
              key={project.slug}
              href={getLocalExperientialProjectHref(project)}
              className="site-media-square group relative block aspect-[3/2] overflow-hidden rounded-none bg-white/[0.04] ring-1 ring-white/10 transition duration-300 hover:-translate-y-1"
            >
              <img
                src={project.coverImageUrl || ""}
                alt={
                  project.coverAltText ||
                  `${project.title} experiential design by Brandon PT Davis`
                }
                className="site-media-square h-full w-full rounded-none object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                loading={index < 2 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.82)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="font-sans text-[0.74rem] font-semibold tracking-[-0.015em] text-white/68">
                  Experiential Design
                </p>
                <h3 className="mt-3 max-w-[15ch] font-sans text-[clamp(1.45rem,2.1vw,2.15rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">
                  {project.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      ) : null}

      {renderingRailCards.length ? (
        <div className={experientialProjects.length ? "mt-3" : ""}>
          <div className="h-[8rem] overflow-hidden md:h-[11rem]">
            <div className="flex h-full w-max gap-3 px-[clamp(1rem,2vw,1.5rem)] motion-safe:animate-[home-rendering-rail_52s_linear_infinite] motion-safe:hover:[animation-play-state:paused]">
              {movingRenderingCards.map((card, index) => (
                <a
                  key={`${card.href}-${index}`}
                  href={card.href}
                  className="site-media-square group relative block h-full w-[min(15.5rem,64vw)] shrink-0 overflow-hidden rounded-none bg-black ring-1 ring-white/10 md:w-[18rem]"
                >
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="site-media-square h-full w-full rounded-none object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.78)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <p className="font-sans text-[0.74rem] font-semibold tracking-[-0.015em] text-white/62">
                      Rendering
                    </p>
                    <h3 className="mt-2 max-w-[14ch] font-sans text-[1.22rem] font-medium leading-[0.96] tracking-[-0.045em] text-white md:text-[1.35rem]">
                      {card.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PublishSection() {
  const publishCards = getHomePublishCards();
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const scrollCards = (direction: "previous" | "next") => {
    cardsRef.current?.scrollBy({
      left: direction === "next" ? 760 : -760,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-black py-16 text-white md:py-24">
      <div className="px-[clamp(1.5rem,5vw,6rem)]">
        <div className="mb-10 grid gap-6 md:grid-cols-[minmax(0,0.72fr)_auto] md:items-end">
          <div>
            <p className="mb-4 section-kicker text-white">
              Article + Tutorials
            </p>
            <h2 className="max-w-[13ch] bg-gradient-to-r from-[#0a4cff] via-[#7b2cbf] to-[#c77dff] bg-clip-text font-sans text-[clamp(2.4rem,5vw,5.3rem)] font-medium leading-[0.94] tracking-[-0.068em] text-transparent">
              Notes from the studio.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href="/articles"
              className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 font-sans text-sm font-medium tracking-[-0.02em] text-black transition-colors hover:bg-white/86"
            >
              Articles
            </a>
            <a
              href="/studio/tutorials"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/24 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-white/72 transition-colors hover:border-white hover:text-white"
            >
              Tutorials
            </a>
          </div>
        </div>
      </div>

      <div
        ref={cardsRef}
        className="overflow-x-auto px-[clamp(1.5rem,5vw,6rem)] pb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-w-max gap-5 pr-[clamp(1.5rem,5vw,6rem)]">
          {publishCards.map(card => (
            <a
              key={`${card.kind}-${card.href}`}
              href={card.href}
              className="group relative flex h-[30rem] w-[min(21rem,78vw)] flex-col justify-end overflow-hidden rounded-[2rem] bg-black p-6 text-white shadow-[0_12px_28px_rgba(0,0,0,0.2)] ring-1 ring-black/[0.04] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(0,0,0,0.24)] md:w-[22rem]"
              aria-label={`${card.kind}: ${card.title}`}
            >
              <img
                src={card.image}
                alt={card.imageAlt}
                className="site-media-square absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/18" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/88 via-black/48 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/28 to-transparent" />

              <div className="relative z-10">
                <p className="font-sans text-[0.74rem] font-semibold tracking-[-0.015em] text-white/68">
                  {card.kind}
                </p>
                <h3 className="mt-3 max-w-[13ch] font-sans text-[1.64rem] font-medium leading-[0.98] tracking-[-0.055em] text-white">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-[18rem] text-[0.94rem] leading-6 tracking-[-0.012em] text-white/68">
                  {card.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="-mt-5 flex justify-end gap-3 px-[clamp(1.5rem,5vw,6rem)]">
        <button
          type="button"
          onClick={() => scrollCards("previous")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-white/62 transition-colors hover:bg-white hover:text-black"
          aria-label="Previous studio cards"
        >
          <ChevronLeft
            className="h-5 w-5"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          onClick={() => scrollCards("next")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-white/72 transition-colors hover:bg-white hover:text-black"
          aria-label="Next studio cards"
        >
          <ChevronRight
            className="h-5 w-5"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </button>
      </div>
    </section>
  );
}

function HomeCta() {
  return (
    <section className="group relative min-h-[72svh] overflow-hidden bg-black">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black via-black/82 to-transparent"
        aria-hidden="true"
      />
      <img
        src={HOME_CTA_IMAGE_URL}
        alt="The Merry Wives of Windsor scenic design detail by Brandon PT Davis"
        className="site-media-square absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/28" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.42)_36%,rgba(0,0,0,0.08)_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/42 to-transparent" />

      <div className="relative flex min-h-[72svh] items-end px-[clamp(1.5rem,5vw,6rem)] pb-12 pt-24 md:pb-16">
        <div className="max-w-3xl">
          <p className="mb-4 section-kicker text-white/46">
            Portfolio / Contact
          </p>
          <h2 className="font-sans text-[clamp(2.6rem,5.8vw,6.2rem)] font-medium leading-[0.9] tracking-[-0.07em] text-white">
            Start with the space.
          </h2>
          <p className="mt-5 max-w-xl text-[0.98rem] leading-7 tracking-[-0.01em] text-white/64 md:text-[1.05rem]">
            Explore the scenic design archive or start a conversation about a
            production, collaboration, or upcoming design process.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 font-sans text-[1rem] font-medium tracking-[-0.02em] text-white/72 transition-colors hover:text-white"
            >
              Contact
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="/projects"
              className="group inline-flex items-center gap-2 font-sans text-[1rem] font-medium tracking-[-0.02em] text-white/52 transition-colors hover:text-white"
            >
              View Portfolio
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home({
  initialProjects,
}: {
  initialProjects: ScenicProjectSummary[];
}) {
  const projects = sortScenicProjectsChronologically(initialProjects);
  const projectsLoading = false;
  const featuredProject =
    projects.find(project => project.coverImageUrl) || projects[0];
  return (
    <>
      <SEO
        title="Brandon PT Davis | Scenic Designer"
        description="San Diego-based union scenic designer giving form to how stories reflect our world through theatre environments, renderings, and production design."
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
            <HomeIntro />
            <HomeThesisSection />
            <PortfolioCategoryRows projects={projects} />
            <BrandonSection />
            <UpcomingSection />
            <HomeExperientialAndRenderingSection />
            <PublishSection />
            <HomeCta />
            <div className="bg-black">
              <Footer />
            </div>
          </>
        ) : null}
      </main>
    </>
  );
}
