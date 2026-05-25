"use client";

import { useRef } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

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
import { getLocalTutorials } from "@shared/localStudio";
import type { ScenicProjectSummary } from "@shared/scenicProjectSummaries";
import {
  formatUpcomingDateRange,
  upcomingProductions,
} from "@shared/upcomingProductions";

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

const getPublishTimestamp = (...dates: Array<string | Date | null | undefined>) =>
  Math.max(
    ...dates.map(date => {
      const time = new Date(date || 0).getTime();
      return Number.isFinite(time) ? time : 0;
    })
  );

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
    description: "Rooms built for memory, pressure, and consequence.",
  },
  {
    title: "Comedy",
    match: ["Comedy"],
    href: "/tags/comedy",
    description: "Architecture for timing, surprise, and social pressure.",
  },
  {
    title: "Musical Theatre",
    match: ["Musical Theatre"],
    href: "/tags/musical-theatre",
    description: "Scenic worlds built for rhythm, transformation, and scale.",
  },
  {
    title: "Shakespeare",
    match: ["Shakespeare"],
    href: "/tags/shakespeare",
    description: "Classic texts held inside contemporary theatrical space.",
  },
  {
    title: "TYA",
    match: ["Theatre for Young Audiences"],
    href: "/tags/theatre-for-young-audiences",
    description: "Clear visual worlds for wonder, play, and young audiences.",
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
          <h1 className="max-w-[10ch] font-sans text-[clamp(3.4rem,8.2vw,8.8rem)] font-medium leading-[0.84] tracking-[-0.09em] text-white">
            Space makes the story visible.
          </h1>
          <p className="mt-8 max-w-[40rem] font-sans text-[clamp(1.1rem,1.8vw,1.65rem)] font-medium leading-[1.2] tracking-[-0.045em] text-white/68 md:mt-10">
            Scenic design for theatre, memory, and live performance. Production
            photos are the entry point; the work is how a room holds behavior,
            rhythm, and atmosphere.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#portfolio-index"
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
          <p className="mb-5 section-kicker text-black/48">
            Profile
          </p>
          <h2 className="font-sans text-[clamp(2.4rem,5.2vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.07em] text-black">
            Scenic design as atmosphere, architecture, and human behavior.
          </h2>
          <p className="mt-8 max-w-[56rem] text-[1rem] leading-8 tracking-[-0.01em] text-black/62 md:text-[1.08rem]">
            Brandon's work starts with how people move through a room: what a
            space remembers, what it hides, and how it shapes the rhythm of a
            performance. The portfolio collects production environments,
            renderings, and process images from regional theatre, summer stock,
            and academic stages.
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
  const nextProductions = upcomingProductions.slice(0, 4);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const scrollCards = (direction: "previous" | "next") => {
    cardsRef.current?.scrollBy({
      left: direction === "next" ? 620 : -620,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#f1f0ec] pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="px-[clamp(1.5rem,5vw,6rem)]">
        <div className="mb-10 grid gap-6 md:grid-cols-[minmax(0,0.72fr)_auto] md:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 text-[clamp(1.05rem,1.35vw,1.22rem)] font-medium leading-none tracking-[-0.04em] text-black/48">
              Upcoming Productions
            </p>
            <h2 className="max-w-[12ch] bg-gradient-to-r from-[#0a4cff] via-[#7b2cbf] to-[#c77dff] bg-clip-text font-sans text-[clamp(2.4rem,5vw,5.3rem)] font-medium leading-[0.94] tracking-[-0.068em] text-transparent">
              The season ahead.
            </h2>
          </div>
          <a
            href="/upcoming-productions"
            className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-[#9d4edd]/72 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-[#7b2cbf] transition-colors hover:border-[#7b2cbf] hover:text-black md:justify-self-end"
          >
            View calendar
          </a>
        </div>
      </div>

      <div
        ref={cardsRef}
        className="overflow-x-auto px-[clamp(1.5rem,5vw,6rem)] pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-w-max gap-5 pr-[clamp(1.5rem,5vw,6rem)]">
          {nextProductions.map((production, index) => (
            <a
              key={production.id}
              href={`/upcoming-productions/${production.id}`}
              className="group relative block w-[min(25rem,82vw)] overflow-hidden rounded-[1.7rem] bg-black ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-1 md:w-[29rem]"
            >
              <img
                src={production.imageUrl}
                alt={production.imageAlt}
                loading={index === 0 ? "eager" : "lazy"}
                className="aspect-square h-full w-full object-cover opacity-[0.92] transition duration-500 group-hover:scale-[1.018] group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.24)_46%,rgba(0,0,0,0.82)_100%)]" />

              <div className="absolute inset-0 flex flex-col justify-between p-7 text-white md:p-8">
                <div>
                  <p className="text-[0.92rem] font-medium tracking-[-0.02em] text-white/72">
                    {formatUpcomingDateRange(production)}
                  </p>
                </div>

                <div>
                  <h3 className="max-w-[11ch] font-sans text-[clamp(2.15rem,4vw,4rem)] font-medium leading-[0.9] tracking-[-0.08em] text-white">
                    {production.title}
                  </h3>
                  <p className="mt-4 max-w-[25rem] text-[0.98rem] leading-[1.42] tracking-[-0.02em] text-white/72">
                    {production.subtitle}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/22 pt-4">
                    <span className="min-w-0 truncate text-[0.95rem] font-medium tracking-[-0.02em] text-white/76">
                      {production.company}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="-mt-1 flex justify-end gap-3 px-[clamp(1.5rem,5vw,6rem)]">
        <button
          type="button"
          onClick={() => scrollCards("previous")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.08] text-black/62 transition-colors hover:bg-black hover:text-white"
          aria-label="Previous upcoming production cards"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollCards("next")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.12] text-black/72 transition-colors hover:bg-black hover:text-white"
          aria-label="Next upcoming production cards"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
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
    <section className="bg-[#f1f0ec] py-16 md:py-24">
      <div className="px-[clamp(1.5rem,5vw,6rem)]">
        <div className="mb-10 grid gap-6 md:grid-cols-[minmax(0,0.72fr)_auto] md:items-end">
          <div>
            <p className="mb-4 section-kicker text-black/42">
              Article + Tutorials
            </p>
            <h2 className="max-w-[13ch] bg-gradient-to-r from-[#0a4cff] via-[#7b2cbf] to-[#c77dff] bg-clip-text font-sans text-[clamp(2.4rem,5vw,5.3rem)] font-medium leading-[0.94] tracking-[-0.068em] text-transparent">
              Notes from the studio.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href="/articles"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#9d4edd] px-5 font-sans text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#c77dff]"
            >
              Articles
            </a>
            <a
              href="/studio/tutorials"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#9d4edd]/72 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-[#7b2cbf] transition-colors hover:border-[#7b2cbf] hover:text-black"
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.08] text-black/62 transition-colors hover:bg-black hover:text-white"
          aria-label="Previous studio cards"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollCards("next")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.12] text-black/72 transition-colors hover:bg-black hover:text-white"
          aria-label="Next studio cards"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>

    </section>
  );
}

function HomeCta() {
  return (
    <section className="group relative min-h-[72svh] overflow-hidden border-t border-white/10 bg-black">
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
            <HomeIntro />
            <PortfolioCategoryRows projects={projects} />
            <BrandonSection />
            <UpcomingSection />
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
