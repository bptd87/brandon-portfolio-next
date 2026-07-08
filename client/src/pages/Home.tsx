"use client";

import { useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Drama,
  Heart,
  Laugh,
  Music,
  Theater,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { ProjectGridSkeleton } from "@/components/SkeletonLoaders";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  type HomeColorTheme,
  useHomeTheme,
} from "@/lib/homeTheme";
import { getProjectPath } from "@/lib/projectRoutes";
import { sortScenicProjectsChronologically } from "@/lib/scenicShowcase";
import { RETIRED_LEARNING_ARTICLE_SLUG_SET } from "@shared/learningPortal";
import { getLocalArticles } from "@shared/localArticles";
import {
  getLocalExperientialProjectHref,
  getLocalExperientialProjects,
  getLocalRenderingGallery,
} from "@shared/localPortfolios";
import type { ScenicProjectSummary } from "@shared/scenicProjectSummaries";

const HOME_HERO_IMAGE_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90051-gallery-150232-69e3ddad.webp";
const ABOUT_HEADSHOT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/brandon-pt-davis-about-home.jpg";
const HOME_CTA_IMAGE_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90053-gallery-150197-48389e80.webp";
const HOME_RENDERING_FLIP_WORDS = [
  "renderings",
  "drawings",
  "installations",
  "environments",
];
const HOME_LOGO_SRC = "/images/site-assets/brand/brandon-pt-davis-white.png";
const HOME_LOADER_EXIT_START_MS = 1280;
const HOME_LOADER_DONE_MS = 1860;
const HOME_FEATURED_SCENIC_SLUGS = [
  "the-glass-menagerie",
  "million-dollar-quartet",
  "the-penelopiad",
  "tomas-and-the-library-lady",
  "romero",
  "boeing-boeing",
  "alls-well-that-ends-well",
  "the-merry-wives-of-windsor",
];

type PublishCard = {
  kind: "Article";
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

type ProcessCard = {
  title: string;
  text: string;
};

function FlipWords({
  words,
  duration = 3000,
  className = "",
}: {
  words: string[];
  duration?: number;
  className?: string;
}) {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;

    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length);
    }, duration);

    return () => window.clearInterval(timer);
  }, [duration, words.length]);

  return (
    <span
      className={`relative inline-grid overflow-visible align-baseline ${className}`}
      aria-hidden="true"
    >
      {words.map((word) => (
        <span
          key={`measure-${word}`}
          className="invisible col-start-1 row-start-1 whitespace-nowrap"
        >
          {word}
        </span>
      ))}
      <span
        key={words[wordIndex]}
        className="col-start-1 row-start-1 inline-block whitespace-nowrap motion-safe:animate-[home-flip-word_560ms_cubic-bezier(0.22,1,0.36,1)]"
      >
        {words[wordIndex]}
      </span>
    </span>
  );
}

function TextGenerateEffect({
  lines,
  className = "",
  duration = 620,
  stagger = 58,
  startDelay = 160,
  active = true,
}: {
  lines: string[];
  className?: string;
  duration?: number;
  stagger?: number;
  startDelay?: number;
  active?: boolean;
}) {
  let wordIndex = 0;

  return (
    <span className={className} aria-hidden="true">
      {lines.map((line) => (
        <span key={line} className="block">
          {line.split(" ").map((word, lineWordIndex, lineWords) => {
            const delay = startDelay + wordIndex * stagger;
            wordIndex += 1;

            return (
              <span
                key={`${line}-${word}-${delay}`}
                className={`inline-block opacity-0 motion-reduce:opacity-100 ${
                  active
                    ? "motion-safe:animate-[home-text-generate_620ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
                    : ""
                } ${
                  lineWordIndex < lineWords.length - 1 ? "mr-[0.18em]" : ""
                }`}
                style={{
                  animationDelay: `${delay}ms`,
                  animationDuration: `${duration}ms`,
                }}
              >
                {word}
                {" "}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

function HomeLogoLoader({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const exitTimer = window.setTimeout(() => setExiting(true), HOME_LOADER_EXIT_START_MS);
    const removeTimer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, HOME_LOADER_DONE_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-black text-white ${
        exiting ? "motion-safe:animate-[home-loader-out_580ms_cubic-bezier(0.22,1,0.36,1)_forwards]" : ""
      }`}
    >
      <style>
        {`
          @keyframes home-loader-logo {
            0% { opacity: 0; transform: translateY(1.2rem) scale(0.86) rotate(-2deg); filter: blur(12px); }
            42% { opacity: 1; transform: translateY(-0.5rem) scale(1.05) rotate(1.5deg); filter: blur(0); }
            62% { opacity: 1; transform: translateY(0.18rem) scale(0.98) rotate(-0.8deg); filter: blur(0); }
            78% { opacity: 1; transform: translateY(-0.14rem) scale(1.012) rotate(0.4deg); filter: blur(0); }
            100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); filter: blur(0); }
          }
          @keyframes home-loader-title {
            0% { opacity: 0; transform: translateY(0.4rem); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes home-loader-orbit {
            0% { opacity: 0; transform: translate(-50%, -50%) rotate(0deg) scale(0.78); }
            18% { opacity: 0.72; transform: translate(-50%, -50%) rotate(54deg) scale(1); }
            100% { opacity: 0.28; transform: translate(-50%, -50%) rotate(360deg) scale(1); }
          }
          @keyframes home-loader-out {
            0% { opacity: 1; }
            100% { opacity: 0; visibility: hidden; }
          }
        `}
      </style>
      <div className="flex w-[min(78vw,32rem)] flex-col items-center">
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 border-t-white/72 opacity-0 motion-safe:animate-[home-loader-orbit_1240ms_cubic-bezier(0.2,0.86,0.34,1)_90ms_forwards]" />
          <img
            src={HOME_LOGO_SRC}
            alt=""
            className="relative h-auto w-full select-none object-contain opacity-0 motion-safe:animate-[home-loader-logo_980ms_cubic-bezier(0.18,0.98,0.28,1.22)_150ms_forwards]"
            draggable={false}
          />
        </div>
        <p className="mt-5 font-sans text-[0.68rem] font-semibold uppercase leading-none tracking-[0.54em] text-white/72 opacity-0 motion-safe:animate-[home-loader-title_520ms_cubic-bezier(0.22,1,0.36,1)_720ms_forwards]">
          Scenic Design
        </p>
      </div>
    </div>
  );
}

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
    .filter(card => card.image);

  return articleCards
    .filter(card => card.image)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 4);
};

const portfolioCategoryRows: Array<{
  title: string;
  match: string[];
  href: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Drama",
    match: ["Drama"],
    href: "/tags/drama",
    icon: Drama,
    description:
      "Rooms under pressure. Places where memory, grief, class, and consequence become visible.",
  },
  {
    title: "Comedy",
    match: ["Comedy"],
    href: "/tags/comedy",
    icon: Laugh,
    description:
      "Spaces tuned for timing: entrances, exits, reversals, hiding places, and social misreadings.",
  },
  {
    title: "Musical Theatre",
    match: ["Musical Theatre"],
    href: "/tags/musical-theatre",
    icon: Music,
    description:
      "Design that can carry rhythm, scale, spectacle, and emotional turn-on-a-dime transformation.",
  },
  {
    title: "Shakespeare",
    match: ["Shakespeare"],
    href: "/tags/shakespeare",
    icon: Theater,
    description:
      "Old texts reframed through contemporary space, civic pressure, ritual, and bodies in public.",
  },
  {
    title: "TYA",
    match: ["Theatre for Young Audiences"],
    href: "/tags/theatre-for-young-audiences",
    icon: UsersRound,
    description:
      "Clear, generous environments for young audiences: playful enough to invite, precise enough to guide.",
  },
];

const processCards: ProcessCard[] = [
  {
    title: "Research + Dramaturgy",
    text:
      "Design choices rooted in text, context, period, metaphor, and the production's central questions.",
  },
  {
    title: "Visualization",
    text:
      "Sketches, models, renderings, and drawings that help the team understand atmosphere, scale, movement, and intent.",
  },
  {
    title: "Production Thinking",
    text:
      "Scenic ideas shaped for actors, directors, shops, budgets, schedules, venues, and audiences.",
  },
];

function HomeIntro({ introReady }: { introReady: boolean }) {
  return (
    <section
      id="portfolio-categories"
      className="relative min-h-[calc(100svh-64px)] overflow-hidden bg-black md:min-h-[calc(100svh-74px)]"
    >
      <style>
        {`
          @keyframes home-text-generate {
            0% { opacity: 0; transform: translateY(0.2em); filter: blur(8px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes home-answer-punch {
            0% { opacity: 0; transform: translateY(0.18em) scale(0.82); filter: blur(10px); }
            58% { opacity: 1; transform: translateY(0) scale(1.08); filter: blur(0); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes home-answer-copy {
            0% { opacity: 0; transform: translateY(0.65rem); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <img
        src={HOME_HERO_IMAGE_URL}
        alt="Scenic rendering by Brandon PT Davis"
        className="site-media-square absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/22" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.52)_46%,rgba(0,0,0,0.84)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.48)_34%,rgba(0,0,0,0.08)_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/74 via-black/24 to-transparent" />

      <div className="relative flex min-h-[calc(100svh-64px)] items-end px-[clamp(1rem,5vw,6rem)] pb-12 pt-20 md:min-h-[calc(100svh-74px)] md:items-center md:px-[clamp(1.5rem,5vw,6rem)] md:py-24">
        <div
          className={`relative z-10 max-w-[56rem] ${
            introReady
              ? "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-5 motion-safe:duration-700"
              : ""
          }`}
        >
          <p className="mb-5 font-sans text-[1rem] font-medium leading-none tracking-[-0.035em] text-white/78 md:mb-7 md:text-[clamp(1rem,1.45vw,1.22rem)]">
            Brandon PT Davis Scenic Design
          </p>
          <h1
            aria-label="If all the world is a stage, then is the scenic designer its architect?"
            className="max-w-[min(64rem,100%)] font-sans text-[clamp(2.35rem,13vw,3.65rem)] font-medium leading-[0.96] tracking-[-0.04em] text-white md:text-[clamp(2.85rem,5.75vw,6.5rem)] md:leading-[0.92]"
          >
            <span className="md:hidden">
              <span className="block">If all the world is a stage, </span>
              <span className="block">then is the scenic designer </span>
              <span className="block">its architect?</span>
            </span>
            <TextGenerateEffect
              className="hidden md:block"
              active={introReady}
              lines={[
                "If all the world is a stage,",
                "then is the scenic designer",
                "its architect?",
              ]}
            />
          </h1>
          <p className="mt-5 max-w-[43rem] font-sans text-[1.1rem] font-medium leading-[1.22] tracking-[-0.04em] text-white/72 md:mt-9 md:text-[clamp(1.16rem,2vw,1.9rem)] md:leading-[1.16] md:tracking-[-0.045em]">
            <span className={`block text-white md:mb-3 md:text-[clamp(2.75rem,5vw,5.65rem)] md:font-medium md:leading-[0.82] md:tracking-[-0.08em] md:opacity-0 motion-reduce:md:opacity-100 ${
              introReady
                ? "motion-safe:md:animate-[home-answer-punch_760ms_cubic-bezier(0.18,1.35,0.28,1)_1250ms_forwards]"
                : ""
            }`}>
              No.
            </span>
            <span className={`block text-white md:opacity-0 motion-reduce:md:opacity-100 ${
              introReady
                ? "motion-safe:md:animate-[home-answer-copy_560ms_ease_1640ms_forwards]"
                : ""
            }`}>
              The scenic designer is its storyteller.
            </span>
            <span className={`mt-2 block max-w-[40rem] text-white/68 md:opacity-0 motion-reduce:md:opacity-100 ${
              introReady
                ? "motion-safe:md:animate-[home-answer-copy_560ms_ease_1840ms_forwards]"
                : ""
            }`}>
              Using space, image, and metaphor, scenic design transforms ideas into places
              where stories can unfold.
            </span>
          </p>
          <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row md:mt-8 md:flex-wrap">
            <a
              href="/projects"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#6f2dff] px-5 font-sans text-[0.98rem] font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#7c3cff]"
            >
              View portfolio
            </a>
            <a
              href="/about"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#6f2dff]/72 px-5 font-sans text-[0.98rem] font-medium tracking-[-0.02em] text-[#a78bff] transition-colors hover:border-[#7c3cff] hover:text-white"
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
                <dt className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.24em] text-[#7c3cff]">
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

const getFeaturedProjectPanelClass = (index: number) => {
  return index % 6 < 2 ? "md:col-span-2" : "";
};

const getFeaturedProjectImageSizes = (index: number) => {
  return index % 6 < 2
    ? "(max-width: 768px) 100vw, 50vw"
    : "(max-width: 768px) 100vw, 25vw";
};

const getExperientialProjectPanelClass = (index: number) => {
  return index < 2 ? "md:col-span-2" : "";
};

const HOME_FEATURED_DESIGN_SLUGS = [
  "the-penelopiad",
  "the-merry-wives-of-windsor",
  "million-dollar-quartet",
  "dont-dress-for-dinner",
];

type HomeFeatureCard = {
  kind: "brand" | "image";
  title: string;
  href?: string;
  image?: string;
  meta?: string;
};

function HomeIdentityCard({
  projects,
  theme,
}: {
  projects: ScenicProjectSummary[];
  theme: HomeColorTheme;
}) {
  const [heroMounted, setHeroMounted] = useState(false);
  const [heroCardsEntered, setHeroCardsEntered] = useState(false);
  const [isHeroStackHovered, setIsHeroStackHovered] = useState(false);
  const [heroStackMotion, setHeroStackMotion] = useState({ x: 0, y: 0 });
  const featuredDesignCards: HomeFeatureCard[] = HOME_FEATURED_DESIGN_SLUGS
    .map(slug => projects.find(project => project.slug === slug))
    .filter(
      (project): project is ScenicProjectSummary =>
        Boolean(project?.coverImageUrl)
    )
    .map(project => ({
      kind: "image" as const,
      title: project.title,
      href: getProjectPath(project),
      image: project.coverImageUrl || "",
      meta: project.client || "",
    }));

  const stackCards = featuredDesignCards.slice(0, 4);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHeroMounted(true));
    const enteredTimer = window.setTimeout(() => setHeroCardsEntered(true), 1380);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(enteredTimer);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden px-[clamp(1rem,3vw,2.8rem)] pb-[clamp(1.25rem,3vw,2rem)] pt-[clamp(3.75rem,5.5vw,4.75rem)] transition-colors duration-500"
      data-home-mounted={heroMounted ? "true" : "false"}
      data-home-cards-entered={heroCardsEntered ? "true" : "false"}
      style={
        {
          "--home-display-font": HOME_DISPLAY_FONT,
          backgroundColor: theme.bg,
          color: theme.ink,
          fontFamily: "var(--home-display-font)",
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes home-stack-float {
          0%, 100% {
            transform: translateY(var(--home-card-y)) rotate(var(--home-card-rotate)) scale(1);
          }
          42% {
            transform: translateY(calc(var(--home-card-y) + var(--home-card-rise))) rotate(calc(var(--home-card-rotate) + var(--home-card-wobble))) scale(1.012);
          }
          64% {
            transform: translateY(calc(var(--home-card-y) + (var(--home-card-rise) * -0.18))) rotate(calc(var(--home-card-rotate) - var(--home-card-wobble))) scale(0.996);
          }
        }

        @keyframes home-stack-enter {
          0% {
            opacity: 0;
            transform: translate3d(
              calc(-50% + var(--home-card-x) + var(--home-card-offset-x)),
              calc(-50% + var(--home-card-y) + var(--home-card-offset-y)),
              0
            ) rotate(calc(var(--home-card-rotate) - 5deg)) scale(0.82);
            filter: blur(10px);
          }
          48% {
            opacity: 1;
            transform: translate3d(
              calc(-50% + var(--home-card-x) + (var(--home-card-offset-x) * -0.12)),
              calc(-50% + var(--home-card-y) - 0.72rem),
              0
            ) rotate(calc(var(--home-card-rotate) + 2deg)) scale(1.045);
            filter: blur(0);
          }
          72% {
            opacity: 1;
            transform: translate3d(
              calc(-50% + var(--home-card-x)),
              calc(-50% + var(--home-card-y) + 0.18rem),
              0
            ) rotate(calc(var(--home-card-rotate) - 0.7deg)) scale(0.988);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translate3d(
              calc(-50% + var(--home-card-x)),
              calc(-50% + var(--home-card-y)),
              0
            ) rotate(var(--home-card-rotate)) scale(var(--home-card-scale));
            filter: blur(0);
          }
        }

        @keyframes home-role-drift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(0.45rem); }
        }

        @keyframes home-stack-stage-float {
          0%, 100% { transform: translateY(0) rotate(-0.15deg); }
          45% { transform: translateY(-0.85rem) rotate(0.35deg); }
          72% { transform: translateY(0.18rem) rotate(-0.22deg); }
        }

        @keyframes home-stack-boop {
          0%, 100% {
            opacity: 1;
            transform: translateY(calc(var(--home-card-y) - 0.35rem)) rotate(var(--home-card-rotate)) scale(1.02);
          }
          36% {
            opacity: 1;
            transform: translateY(calc(var(--home-card-y) - 1.05rem)) rotate(calc(var(--home-card-rotate) + var(--home-card-wobble))) scale(1.055);
          }
          68% {
            opacity: 1;
            transform: translateY(calc(var(--home-card-y) - 0.18rem)) rotate(calc(var(--home-card-rotate) - 0.6deg)) scale(0.998);
          }
        }

        @keyframes home-palette-spinner {
          0%, 100% { transform: rotate(0deg) scale(1); }
          28% { transform: rotate(14deg) scale(1.08); }
          56% { transform: rotate(-10deg) scale(0.96); }
          78% { transform: rotate(6deg) scale(1.03); }
        }

        @keyframes home-palette-idle {
          0%, 100% { transform: translateY(0) scale(1); }
          48% { transform: translateY(-0.34rem) scale(1.04); }
          64% { transform: translateY(0.08rem) scale(0.98); }
        }

        @keyframes home-palette-dot-pop {
          0% { transform: translate(0, 0) scale(0.2); opacity: 0; }
          72% { transform: translate(var(--home-swatch-x), var(--home-swatch-y)) scale(1.14); opacity: 1; }
          100% { transform: translate(var(--home-swatch-x), var(--home-swatch-y)) scale(1); opacity: 1; }
        }

        .home-hero-top,
        .home-hero-bottom {
          opacity: 0;
          transition: opacity 1.2s cubic-bezier(0.39, 0.575, 0.565, 1);
          transition-delay: 260ms;
        }

        .home-hero-title,
        .home-hero-role {
          opacity: 0;
          transform: translateY(0.25ch) scaleY(0);
          transform-origin: bottom;
          transition:
            opacity 260ms ease,
            transform 900ms cubic-bezier(0.16, 1.28, 0.32, 1);
          will-change: transform, opacity;
        }

        .home-hero-role {
          transition-delay: 380ms;
        }

        [data-home-mounted="true"] .home-hero-top,
        [data-home-mounted="true"] .home-hero-bottom {
          opacity: 1;
        }

        [data-home-mounted="true"] .home-hero-title,
        [data-home-mounted="true"] .home-hero-role {
          opacity: 1;
          transform: translateY(0) scaleY(1);
        }

        [data-home-mounted="true"] .home-hero-role {
          animation: home-role-drift 5.4s cubic-bezier(0.45, 0, 0.2, 1) 1.15s infinite;
        }

        .home-stack-stage {
          position: relative;
          transform-origin: 50% 50%;
          touch-action: pan-y;
          user-select: none;
        }

        .home-stack-float {
          position: absolute;
          inset: 0;
          animation: home-stack-stage-float 5.8s cubic-bezier(0.45, 0, 0.2, 1) 1.4s infinite;
        }

        .home-stack-stage:hover .home-stack-float,
        .home-stack-stage:focus-within .home-stack-float,
        .home-stack-stage[data-peeking="true"] .home-stack-float {
          animation-play-state: paused;
        }

        .home-stack-card {
          animation: none;
          left: 50%;
          opacity: 0;
          top: 50%;
          transform: translate3d(
            calc(-50% + var(--home-card-offset-x)),
            calc(-50% + var(--home-card-offset-y)),
            0
          ) rotate(calc(var(--home-card-rotate) - 5deg)) scale(0.82);
          transform-origin: 50% 70%;
          transition:
            filter 360ms ease,
            transform 1080ms cubic-bezier(0.13, 1.92, 0.16, 1);
          user-select: none;
          -webkit-user-drag: none;
          will-change: transform;
        }

        .home-stack-card-shadow {
          background: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0) 68%);
          border-radius: inherit;
          filter: blur(10px);
          inset: auto 8% -15% 8%;
          pointer-events: none;
          position: absolute;
          height: 25%;
          transform: translate3d(0, 0.7rem, 0) scaleX(0.92);
          transition: transform 1080ms cubic-bezier(0.13, 1.92, 0.16, 1), opacity 360ms ease;
          z-index: -1;
        }

        .home-stack-card img {
          user-select: none;
          -webkit-user-drag: none;
        }

        @media (max-width: 767px) {
          .home-stack-stage {
            height: clamp(8.75rem, 34vw, 10.75rem) !important;
            width: min(88vw, 26rem) !important;
          }

          .home-stack-card {
            width: clamp(6.85rem, 27vw, 8.6rem) !important;
          }
        }

        [data-home-mounted="true"] .home-stack-card {
          animation: home-stack-enter 900ms cubic-bezier(0.18, 0.98, 0.28, 1.18) forwards;
          animation-delay: var(--home-card-delay);
        }

        [data-home-cards-entered="true"] .home-stack-card {
          animation: none;
          opacity: 1;
          transform: translate3d(
            calc(-50% + var(--home-card-x)),
            calc(-50% + var(--home-card-y)),
            0
          ) rotate(var(--home-card-rotate)) scale(var(--home-card-scale));
        }

        .home-stack-stage:hover .home-stack-card,
        .home-stack-stage:focus-within .home-stack-card,
        .home-stack-stage[data-peeking="true"] .home-stack-card {
          animation: none;
          opacity: 1;
          transform: translate3d(
            calc(-50% + var(--home-card-hover-x) + var(--home-card-motion-x)),
            calc(-50% + var(--home-card-hover-y) + var(--home-card-motion-y)),
            0
          ) rotate(var(--home-card-hover-rotate)) scale(var(--home-card-hover-scale));
        }

        .home-stack-stage:hover .home-stack-card-shadow,
        .home-stack-stage:focus-within .home-stack-card-shadow,
        .home-stack-stage[data-peeking="true"] .home-stack-card-shadow {
          opacity: 0.82;
          transform: translate3d(
            var(--home-card-shadow-x),
            calc(1rem + var(--home-card-shadow-y)),
            0
          ) scaleX(1.08);
        }

        @media (prefers-reduced-motion: reduce) {
          .home-hero-top,
          .home-hero-bottom,
          .home-hero-title,
          .home-hero-role {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .home-stack-card {
            animation: none !important;
            opacity: 1 !important;
            transform: translate3d(
              calc(-50% + var(--home-card-x)),
              calc(-50% + var(--home-card-y)),
              0
            ) rotate(var(--home-card-rotate)) scale(var(--home-card-scale)) !important;
          }

          .home-stack-stage,
          .home-stack-float {
            animation: none !important;
            transition: none !important;
          }

          .home-palette-spinner,
          .home-palette-swatch {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mx-auto grid min-h-[calc(100svh-5.5rem)] max-w-[92rem] grid-rows-[auto_1fr_auto] place-items-center text-center">
        <div
          className="home-hero-top pt-0 text-[0.72rem] font-black uppercase leading-[1] tracking-[0.09em]"
          style={{ fontFamily: HOME_DISPLAY_FONT }}
        >
          <p>San Diego, California</p>
          <a
            href="mailto:brandon@brandonptdavis.com"
            className="mt-2 block text-[0.56rem] font-medium transition-colors hover:opacity-70"
            style={{ color: theme.muted, fontFamily: HOME_BODY_FONT }}
          >
            BRANDON@BRANDONPTDAVIS.COM
          </a>
        </div>

        <div className="flex flex-col items-center gap-[min(4rem,6vw)]">
          <h1
            className="home-hero-title max-w-[12em] text-center text-[clamp(3.2rem,5.7vw,6.85rem)] font-black uppercase leading-[0.82] tracking-[0] text-balance"
            style={{
              fontFamily: "var(--home-display-font)",
              fontStretch: "condensed",
            }}
          >
            BRANDON PT DAVIS
          </h1>

          <div className="relative flex min-h-[clamp(18.5rem,38vw,33rem)] w-full max-w-[74rem] flex-col items-center justify-center gap-[clamp(1.15rem,2.5vw,2rem)]">
            <div className="relative z-10 flex w-full items-center justify-center">
              <div
                className="home-stack-stage h-[clamp(11.25rem,25vw,19.5rem)] w-[min(96vw,66rem)]"
                role="group"
                aria-label="Featured scenic design image stack"
                data-peeking={isHeroStackHovered ? "true" : "false"}
                onContextMenu={event => event.preventDefault()}
                onMouseEnter={() => setIsHeroStackHovered(true)}
                onMouseLeave={() => {
                  setIsHeroStackHovered(false);
                  setHeroStackMotion({ x: 0, y: 0 });
                }}
                onPointerEnter={() => setIsHeroStackHovered(true)}
                onPointerMove={event => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
                  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
                  setIsHeroStackHovered(true);
                  setHeroStackMotion({
                    x: Math.max(-1, Math.min(1, x)),
                    y: Math.max(-1, Math.min(1, y)),
                  });
                }}
                onPointerLeave={() => {
                  setIsHeroStackHovered(false);
                  setHeroStackMotion({ x: 0, y: 0 });
                }}
              >
                <div className="home-stack-float">
                  {stackCards.map((card, index) => {
                    const rotation =
                      ["-1.6deg", "-3.6deg", "4.8deg", "-0.9deg"][index] || "0deg";
                    const translateX =
                      [
                        "clamp(-18rem, -24vw, -5.75rem)",
                        "clamp(-6.4rem, -8vw, -2.35rem)",
                        "clamp(2.35rem, 8vw, 5.5rem)",
                        "clamp(5.75rem, 24vw, 17.2rem)",
                      ][index] || "0rem";
                    const translateY =
                      ["1.45rem", "-1.65rem", "0.9rem", "-0.75rem"][index] || "0rem";
                    const restScale =
                      ["0.98", "1.04", "1.02", "1.03"][index] || "1";
                    const layerOrder =
                      [1, 2, 3, 4][index] || index + 1;
                    const hoverX =
                      [
                        "clamp(-22.8rem, -29vw, -6.55rem)",
                        "clamp(-9.2rem, -11vw, -2.9rem)",
                        "clamp(3rem, 11vw, 8.6rem)",
                        "clamp(6.6rem, 29vw, 22.5rem)",
                      ][index] ||
                      "0rem";
                    const hoverY =
                      ["2.65rem", "-3.1rem", "2.2rem", "-2rem"][index] ||
                      "0rem";
                    const hoverRotation =
                      ["-5.5deg", "-5.2deg", "8deg", "-2deg"][index] || rotation;
                    const hoverScale =
                      ["1.045", "1.08", "1.065", "1.07"][index] || "1.06";
                    const motionXStrength =
                      [-22, -10, 13, 24][index] || 0;
                    const motionYStrength =
                      [14, -18, 16, -12][index] || 0;
                    const motionX = `${heroStackMotion.x * motionXStrength}px`;
                    const motionY = `${heroStackMotion.y * motionYStrength}px`;
                    const shadowX = `${heroStackMotion.x * motionXStrength * -0.18}px`;
                    const shadowY = `${heroStackMotion.y * motionYStrength * 0.16}px`;

                    return (
                      <div
                        key={card.title}
                        role="img"
                        aria-label={`${card.title} scenic design by Brandon PT Davis`}
                        className="home-stack-card group absolute grid aspect-square w-[clamp(9rem,19vw,18.5rem)] select-none overflow-hidden rounded-[1.15rem] shadow-[0_2.2rem_5rem_rgba(0,0,0,0.2)] ring-1 ring-black/5 transition-[filter,transform] duration-500 hover:brightness-105"
                        style={
                          {
                            zIndex: layerOrder,
                            "--home-card-rotate": rotation,
                            "--home-card-scale": restScale,
                            "--home-card-x": translateX,
                            "--home-card-y": translateY,
                            "--home-card-wobble": `${index % 2 === 0 ? "-" : ""}1.2deg`,
                            "--home-card-rise": `${-5 - index}px`,
                            "--home-card-duration": `${5.2 + index * 0.45}s`,
                            "--home-card-delay": `${180 + index * 100}ms`,
                            "--home-card-offset-x": "0rem",
                            "--home-card-offset-y": "1rem",
                            "--home-card-hover-x": hoverX,
                            "--home-card-hover-y": hoverY,
                            "--home-card-hover-rotate": hoverRotation,
                            "--home-card-hover-scale": hoverScale,
                            "--home-card-motion-x": motionX,
                            "--home-card-motion-y": motionY,
                            "--home-card-shadow-x": shadowX,
                            "--home-card-shadow-y": shadowY,
                            borderColor: theme.accent,
                            backgroundColor: theme.accentSoft,
                          } as CSSProperties
                        }
                      >
                        <span className="home-stack-card-shadow" aria-hidden="true" />
                        <Image
                          src={card.image || ""}
                          alt={`${card.title} scenic design by Brandon PT Davis`}
                          fill
                          priority={index < 4}
                          loading={index < 4 ? "eager" : "lazy"}
                          fetchPriority={index < 4 ? "high" : "auto"}
                          sizes="(max-width: 768px) 48vw, 16rem"
                          draggable={false}
                          onDragStart={event => event.preventDefault()}
                          className="site-media-square pointer-events-none object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <span className="sr-only">
                          {card.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p
              className="home-hero-role relative z-0 mx-auto max-w-[12em] text-[clamp(3.2rem,5.7vw,6.85rem)] font-black uppercase leading-[0.82] tracking-[0] text-balance"
              style={{
                color: theme.ghost,
                fontFamily: "var(--home-display-font)",
                fontStretch: "condensed",
              }}
            >
              <span className="block">SCENIC</span>
              <span className="block">DESIGNER</span>
            </p>
          </div>
        </div>

        <div className="home-hero-bottom pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-[clamp(1.2rem,2vw,1.8rem)]">
          <p
            className="text-[0.72rem] font-black uppercase leading-none tracking-[0.09em]"
            style={{ fontFamily: HOME_DISPLAY_FONT }}
          >
            COLLABORATIONS INCLUDE
          </p>
          <p
            className="mx-auto mt-2 max-w-[68rem] text-[0.56rem] font-medium uppercase leading-[1.45] tracking-[0.08em]"
            style={{ color: theme.muted, fontFamily: HOME_BODY_FONT }}
          >
            <span className="block">
              SOUTH COAST REPERTORY, MAPLES REPERTORY THEATRE, THEATRE SILCO,
            </span>
            <span className="mt-1 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              NEW SWAN SHAKESPEARE FESTIVAL, OKOBOJI SUMMER THEATRE, AMONG
              OTHERS
              <Heart className="h-[1em] w-[1em] fill-none" strokeWidth={1.7} />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function HomeMinimalGallery({
  projects,
  theme,
}: {
  projects: ScenicProjectSummary[];
  theme: HomeColorTheme;
}) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const carouselTrackRef = useRef<HTMLDivElement | null>(null);
  const gallerySectionRef = useRef<HTMLElement | null>(null);
  const portfolioGridRef = useRef<HTMLDivElement | null>(null);
  const [featuredInView, setFeaturedInView] = useState(false);
  const [activePortfolioProject, setActivePortfolioProject] =
    useState<ScenicProjectSummary | null>(null);
  const [isPortfolioLightboxOpen, setIsPortfolioLightboxOpen] = useState(false);
  const galleryProjects = projects
    .filter(project => project.coverImageUrl);
  const carouselProjects = galleryProjects.slice(0, 8);
  const carouselItems = [
    ...carouselProjects,
    ...carouselProjects,
    ...carouselProjects,
  ];
  const moreProjects = galleryProjects;

  useEffect(() => {
    const carousel = carouselRef.current;
    const track = carouselTrackRef.current;
    if (!carousel || !track || carouselProjects.length === 0) return;

    let offset = 0;
    let step = 0;
    let cycle = 0;
    let isDragging = false;
    let lockDrag = false;
    let startX = 0;
    let startY = 0;
    let startOffset = 0;
    let didDrag = false;
    let slideWidth = 0;
    let trackPaddingLeft = 0;

    const normalizeOffset = (value: number) => {
      if (!cycle) return 0;
      return ((value - cycle) % cycle + cycle) % cycle + cycle;
    };

    const measureCarousel = () => {
      const slides = Array.from(
        track.querySelectorAll<HTMLElement>("[data-home-feature-slide]")
      );
      const firstSlide = slides[0];
      if (!firstSlide) return slides;

      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      trackPaddingLeft = parseFloat(styles.paddingLeft || "0") || 0;
      slideWidth = firstSlide.offsetWidth;
      step = slideWidth + gap;
      cycle = step * carouselProjects.length;

      return slides;
    };

    const setInitialOffset = () => {
      const slides = measureCarousel();
      if (!slides.length || !step) return;

      const centerIndex = carouselProjects.length + 1;
      offset =
        trackPaddingLeft +
        centerIndex * step +
        slideWidth / 2 -
        carousel.clientWidth / 2;
    };

    const renderCarousel = () => {
      const slides = measureCarousel();
      if (!slides.length || !cycle) return;

      const center = carousel.clientWidth / 2;

      offset = normalizeOffset(offset);
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;

      slides.forEach((slide, index) => {
        const slideCenter = trackPaddingLeft + index * step + slideWidth / 2 - offset;
        const distanceFromCenter = slideCenter - center;
        const curveY = Math.cos(distanceFromCenter * (Math.PI / 1000)) * -48 + 48;
        const rotate = distanceFromCenter * 0.03;
        const opacity = Math.max(
          0.18,
          Math.min(1, Math.cos(distanceFromCenter * (Math.PI / 600)))
        );
        const button = slide.querySelector<HTMLElement>("[data-home-feature-button]");

        slide.style.transform = `translateY(${curveY}px) rotate(${rotate}deg)`;
        if (button) button.style.opacity = opacity.toString();
      });
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      isDragging = true;
      lockDrag = false;
      didDrag = false;
      startX = event.clientX;
      startY = event.clientY;
      startOffset = offset;
      try {
        carousel.setPointerCapture?.(event.pointerId);
      } catch {
        // Pointer capture is best-effort for touch drag.
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      if (!lockDrag) {
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 6) {
          isDragging = false;
          return;
        }

        if (Math.abs(deltaX) < 6) return;
        lockDrag = true;
      }

      event.preventDefault();
      didDrag = true;
      offset = normalizeOffset(startOffset - deltaX);
      renderCarousel();
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      lockDrag = false;
      try {
        carousel.releasePointerCapture?.(event.pointerId);
      } catch {
        // The browser may already release capture after touch cancellation.
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (!didDrag) return;
      event.preventDefault();
      event.stopPropagation();
      didDrag = false;
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      offset = normalizeOffset(offset + event.deltaX);
      renderCarousel();
    };

    setInitialOffset();
    renderCarousel();
    carousel.addEventListener("pointerdown", handlePointerDown);
    carousel.addEventListener("pointermove", handlePointerMove);
    carousel.addEventListener("pointerup", handlePointerUp);
    carousel.addEventListener("pointercancel", handlePointerUp);
    carousel.addEventListener("click", handleClick, true);
    carousel.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", renderCarousel);

    return () => {
      carousel.removeEventListener("pointerdown", handlePointerDown);
      carousel.removeEventListener("pointermove", handlePointerMove);
      carousel.removeEventListener("pointerup", handlePointerUp);
      carousel.removeEventListener("pointercancel", handlePointerUp);
      carousel.removeEventListener("click", handleClick, true);
      carousel.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", renderCarousel);
    };
  }, [carouselProjects.length]);

  useEffect(() => {
    const section = gallerySectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setFeaturedInView(true);
      return;
    }

    let isRevealed = false;
    let frame = 0;
    let hashDelay = 0;
    const scrollRoot = document.querySelector<HTMLElement>("[data-home-scroll-root]");
    let observer: IntersectionObserver | null = null;

    const reveal = () => {
      if (isRevealed) return;
      isRevealed = true;
      setFeaturedInView(true);
      observer?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      scrollRoot?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };

    const checkVisibility = () => {
      if (isRevealed) return;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      if (rect.top < viewportHeight * 0.9 && rect.bottom > viewportHeight * 0.1) {
        reveal();
      }
    };

    const handleScroll = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(checkVisibility);
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
      },
      {
        rootMargin: "0px 0px -14% 0px",
        threshold: 0.18,
      }
    );

    observer.observe(section);
    frame = window.requestAnimationFrame(checkVisibility);
    hashDelay = window.setTimeout(checkVisibility, 160);
    window.addEventListener("scroll", handleScroll, { passive: true });
    scrollRoot?.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(hashDelay);
      observer?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      scrollRoot?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const grid = portfolioGridRef.current;
    if (!grid) return;

    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-home-portfolio-card]")
    );
    if (!cards.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      cards.forEach(card => {
        card.dataset.inview = "true";
      });
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.inview = "true";
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.18,
      }
    );

    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [moreProjects.length]);

  useEffect(() => {
    if (!activePortfolioProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePortfolioProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePortfolioProject]);

  useEffect(() => {
    if (!activePortfolioProject) {
      setIsPortfolioLightboxOpen(false);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "portfolioQuickViewLightbox") return;
      setIsPortfolioLightboxOpen(Boolean(event.data.open));
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      setIsPortfolioLightboxOpen(false);
    };
  }, [activePortfolioProject]);

  if (!galleryProjects.length) return null;

  return (
    <section
      id="recent-designs"
      ref={gallerySectionRef}
      data-featured-inview={featuredInView ? "true" : "false"}
      className="overflow-hidden px-[clamp(1rem,3vw,2.8rem)] pb-[clamp(5rem,9vw,8rem)] pt-[clamp(5rem,10vw,9rem)] transition-colors duration-500"
      style={{
        backgroundColor: theme.bg,
        color: theme.ink,
        fontFamily: HOME_DISPLAY_FONT,
      }}
      aria-labelledby="home-gallery-title"
    >
      <style>{`
        @keyframes home-featured-text-in {
          0% {
            opacity: 0;
            transform: translateY(0.35rem) scaleY(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }

        @keyframes home-featured-subtitle-in {
          0% {
            opacity: 0;
            transform: translateY(0.7rem);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes home-featured-media-in {
          0% {
            opacity: 0;
            transform: translateY(24%) scale(0.8);
          }
          52% {
            opacity: 1;
            transform: translateY(-0.9rem) scale(1.045);
          }
          72% {
            opacity: 1;
            transform: translateY(0.22rem) scale(0.988);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes home-featured-button-in {
          0% {
            transform: translateY(0.75rem) scale(0.94);
          }
          58% {
            transform: translateY(-0.25rem) scale(1.04);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        .home-featured-strip-card {
          transform-origin: 50% 70vw;
          touch-action: pan-y;
          will-change: transform;
        }

        .home-featured-carousel,
        .home-featured-strip-track {
          touch-action: pan-y;
          user-select: none;
        }

        .home-featured-carousel img {
          user-select: none;
          -webkit-user-drag: none;
        }

        .home-featured-title,
        .home-featured-subtitle {
          opacity: 1;
          transform: translateY(0) scaleY(1);
          transform-origin: bottom;
          will-change: transform, opacity;
        }

        .home-featured-subtitle {
          transform: translateY(0);
        }

        [data-featured-inview="true"] .home-featured-title {
          animation: home-featured-text-in 940ms cubic-bezier(0.16, 1.28, 0.32, 1) both;
        }

        [data-featured-inview="true"] .home-featured-subtitle {
          animation: home-featured-subtitle-in 780ms cubic-bezier(0.16, 1, 0.3, 1) 150ms both;
        }

        .home-featured-media {
          opacity: 1;
          transform: translateY(0) scale(1);
          transform-origin: 50% 70%;
          will-change: transform, opacity;
        }

        [data-featured-inview="true"] .home-featured-media {
          animation: home-featured-media-in 1080ms cubic-bezier(0.18, 1.42, 0.24, 1) both;
          animation-delay: calc(var(--home-feature-delay, 0) * 80ms + 220ms);
        }

        .home-featured-button {
          transform: translateY(0) scale(1);
          transform-origin: center;
        }

        [data-featured-inview="true"] .home-featured-button {
          animation: home-featured-button-in 880ms cubic-bezier(0.18, 1.42, 0.24, 1) both;
          animation-delay: calc(var(--home-feature-delay, 0) * 80ms + 340ms);
        }

        .home-portfolio-card {
          opacity: 0;
          transform: translate3d(0, 2.4rem, 0) scale(0.84);
          transition:
            opacity 520ms ease,
            transform 980ms cubic-bezier(0.18, 1.42, 0.24, 1);
          transition-delay: var(--home-portfolio-delay, 0ms);
          will-change: opacity, transform;
        }

        .home-portfolio-card[data-inview="true"] {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }

        .home-portfolio-media {
          transform: scale(0.72);
          transition:
            box-shadow 520ms ease,
            transform 980ms cubic-bezier(0.18, 1.42, 0.24, 1);
          transition-delay: var(--home-portfolio-delay, 0ms);
          will-change: transform;
        }

        .home-portfolio-card[data-inview="true"] .home-portfolio-media {
          transform: scale(1);
        }

        .home-portfolio-shadow {
          background: rgba(0, 0, 0, 0.16);
          border-radius: 0.85rem;
          box-shadow:
            0 1.2rem 2.8rem rgba(0, 0, 0, 0.08),
            0 4.5rem 5.5rem rgba(0, 0, 0, 0.07),
            0 8rem 7rem rgba(0, 0, 0, 0.035);
          filter: blur(18px);
          inset: 5% 4% -3%;
          opacity: 0;
          position: absolute;
          transform: translate3d(0, 1.25rem, 0) scale(0.76);
          transition:
            opacity 620ms ease,
            transform 980ms cubic-bezier(0.18, 1.42, 0.24, 1);
          transition-delay: var(--home-portfolio-delay, 0ms);
        }

        .home-portfolio-card[data-inview="true"] .home-portfolio-shadow {
          opacity: 0.72;
          transform: translate3d(0, 0.75rem, 0) scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .home-featured-title,
          .home-featured-subtitle,
          .home-featured-media,
          .home-featured-button {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .home-featured-strip-card {
            transform: none !important;
          }

          .home-portfolio-card,
          .home-portfolio-media,
          .home-portfolio-shadow {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="mx-auto mb-[clamp(3rem,6vw,5rem)] max-w-[56rem] text-center">
        <h2
          id="home-gallery-title"
          className="home-featured-title text-[clamp(3.8rem,7vw,7rem)] font-black uppercase leading-[0.82] tracking-[-0.02em]"
          style={{ fontFamily: HOME_DISPLAY_FONT, fontStretch: "condensed" }}
        >
          FEATURED DESIGN
        </h2>
        <p
          className="home-featured-subtitle mt-3 text-[clamp(0.92rem,1.2vw,1.05rem)] font-medium"
          style={{ fontFamily: HOME_BODY_FONT }}
        >
          Select recent and notable projects
        </p>
      </div>

      <div
        ref={carouselRef}
        className="home-featured-carousel relative left-1/2 ml-[-50vw] w-screen cursor-grab overflow-x-clip py-[clamp(2.5rem,5vw,5rem)] active:cursor-grabbing"
        style={
          {
            "--home-feature-size": "min(33rem,84vw)",
            "--home-feature-media": "min(28rem,76vw)",
            "--home-feature-gap": "16px",
          } as CSSProperties
        }
      >
        <div
          ref={carouselTrackRef}
          className="home-featured-strip-track flex h-[clamp(31rem,41vw,43rem)] w-max items-center gap-[var(--home-feature-gap)] px-[max(1rem,calc((100vw-var(--home-feature-size))/2))] will-change-transform"
        >
          {carouselItems.map((project, index) => {
            const meta = [project.client, project.year].filter(Boolean).join(" / ");

            const projectHref = getProjectPath(project);
            const isDuplicateSlide = index >= carouselProjects.length;

            return (
              <div
                key={`${project.slug}-${index}`}
                data-home-feature-slide
                className="home-featured-strip-card group flex h-full w-[var(--home-feature-size)] shrink-0 flex-col items-center justify-center gap-4"
                style={
                  {
                    color: theme.ink,
                    "--home-feature-delay": `${index % carouselProjects.length}`,
                  } as CSSProperties
                }
                aria-hidden={isDuplicateSlide ? "true" : undefined}
              >
                <article className="flex h-full flex-col items-center justify-center gap-4">
                  <div
                    className="home-featured-media relative aspect-square w-[var(--home-feature-media)] select-none overflow-hidden rounded-[1rem] shadow-[0_1.15rem_2.6rem_rgba(0,0,0,0.16)] ring-1 ring-black/5"
                    style={{ backgroundColor: theme.accentSoft }}
                    onContextMenu={event => event.preventDefault()}
                    onDragStart={event => event.preventDefault()}
                  >
                    <Image
                      src={project.coverImageUrl || ""}
                      alt={`${project.title} scenic design by Brandon PT Davis`}
                      fill
                      quality={index < 8 ? 86 : 78}
                      priority={index < 3}
                      loading={index < 3 ? "eager" : "lazy"}
                      fetchPriority={index < 3 ? "high" : "auto"}
                      sizes="(max-width: 768px) 76vw, 28rem"
                      draggable={false}
                      onContextMenu={event => event.preventDefault()}
                      className="site-media-square pointer-events-none select-none object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                      style={{
                        objectPosition: project.coverImagePosition || "center",
                      }}
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <a
                      href={projectHref}
                      data-home-feature-button
                      aria-label={`View ${project.title}`}
                      tabIndex={isDuplicateSlide ? -1 : undefined}
                      className="home-featured-button inline-flex max-w-[92%] items-center justify-center rounded-full px-8 py-4 text-center text-[1rem] font-normal uppercase leading-none shadow-[0_0.65rem_1.3rem_rgba(0,0,0,0.12)] transition-transform hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
                      style={{
                        backgroundColor: theme.accentSoft,
                        color: theme.ink,
                      }}
                    >
                      {project.title}
                    </a>
                  </div>
                  {meta ? <span className="sr-only">{meta}</span> : null}
                </article>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-[clamp(5rem,10vw,8rem)] max-w-[56rem] text-center">
        <h2>
          <a
            href="/projects"
            className="inline-flex text-[clamp(3.8rem,7vw,7rem)] font-black uppercase leading-[0.82] tracking-[-0.02em] transition-opacity hover:opacity-70"
            style={{
              color: theme.ink,
              fontFamily: HOME_DISPLAY_FONT,
              fontStretch: "condensed",
            }}
          >
            PORTFOLIO
          </a>
        </h2>
        <p
          className="mt-3 text-[clamp(0.92rem,1.2vw,1.05rem)] font-medium"
          style={{ fontFamily: HOME_BODY_FONT }}
        >
          Take a scroll, stay a while
        </p>
      </div>

      <div
        ref={portfolioGridRef}
        className="mx-auto mt-[clamp(4rem,8vw,7rem)] grid max-w-[64rem] gap-[clamp(2.25rem,5vw,4.25rem)] px-[clamp(1rem,3vw,2rem)] pb-[clamp(4rem,8vw,7rem)] sm:grid-cols-2 lg:grid-cols-3"
      >
        {moreProjects.map((project, index) => {
          const meta = project.client || "";

          return (
            <button
              key={project.slug}
              type="button"
              data-home-portfolio-card
              data-inview="false"
              className="home-portfolio-card group grid place-items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
              style={
                {
                  color: theme.ink,
                  "--home-portfolio-delay": `${(index % 3) * 95}ms`,
                } as CSSProperties
              }
              aria-label={`${project.title} scenic design by Brandon PT Davis`}
              onClick={() => setActivePortfolioProject(project)}
            >
              <article className="w-full">
                <div
                  className="relative aspect-square"
                >
                  <div className="home-portfolio-shadow" aria-hidden="true" />
                  <div
                    className="home-portfolio-media relative h-full overflow-hidden rounded-[0.85rem] shadow-[0_1rem_2.4rem_rgba(0,0,0,0.12)] ring-1 ring-black/5"
                    style={{ backgroundColor: theme.accentSoft }}
                  >
                    <Image
                      src={project.coverImageUrl || ""}
                      alt={`${project.title} scenic design by Brandon PT Davis`}
                      fill
                      quality={index < 4 ? 86 : 78}
                      priority={index < 3}
                      loading={index < 3 ? "eager" : "lazy"}
                      fetchPriority={index < 3 ? "high" : "auto"}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 44vw, 23rem"
                      className="site-media-square object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.018]"
                      style={{
                        objectPosition: project.coverImagePosition || "center",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-end bg-black/18 p-4 opacity-100 transition-[background-color,opacity] duration-500 md:bg-black/0 md:p-5 md:opacity-0 md:group-hover:bg-black/18 md:group-hover:opacity-100">
                      <div className="translate-y-0 opacity-100 transition-[opacity,transform] duration-500 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                        <h2
                          className="text-[clamp(1.35rem,7vw,2.55rem)] font-black uppercase leading-[0.86] tracking-[0] text-white md:text-[clamp(1.45rem,2.3vw,2.55rem)]"
                          style={{ fontFamily: HOME_DISPLAY_FONT }}
                        >
                          {project.title}
                        </h2>
                        {meta ? (
                          <p className="mt-2 max-w-[20rem] text-[0.86rem] font-bold uppercase leading-tight text-white/72">
                            {meta}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sr-only">
                  <h2 className="font-sans text-[1.1rem] font-medium leading-tight">
                    {project.title}
                  </h2>
                  {meta ? (
                    <p className="mt-1 text-[0.82rem] leading-tight">
                      {meta}
                    </p>
                  ) : null}
                </div>
              </article>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-[clamp(3rem,7vw,6rem)] max-w-[58rem] pb-[clamp(1rem,3vw,2.5rem)] text-center">
        <p className="font-sans text-[clamp(1.28rem,2.25vw,2.05rem)] font-medium leading-[1.18]">
          Brandon PT Davis is a San Diego-based scenic designer creating
          theatrical environments, renderings, and story-driven spaces for
          plays, musicals, Shakespeare, theatre for young audiences, and
          collaborative live performance.
        </p>
        <a
          href="/projects"
          className="mt-8 inline-flex text-[0.78rem] font-black uppercase transition-opacity hover:opacity-70"
          style={{ color: theme.accent }}
        >
          View full portfolio
        </a>
      </div>

      {activePortfolioProject && typeof document !== "undefined" ? createPortal(
        <div
          className="fixed inset-0 z-[2147483646] overflow-hidden bg-black/42 p-[clamp(0.55rem,1.5vw,1.25rem)] backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`home-portfolio-modal-${activePortfolioProject.slug}`}
          onClick={() => setActivePortfolioProject(null)}
        >
          <div
            className="relative h-[calc(100dvh-clamp(1.1rem,3vw,2.5rem))] w-full overflow-hidden rounded-[clamp(1.5rem,3vw,2.8rem)] shadow-[0_2rem_5rem_rgba(0,0,0,0.28)]"
            style={{ backgroundColor: theme.bg }}
            onClick={event => event.stopPropagation()}
          >
            <h2
              id={`home-portfolio-modal-${activePortfolioProject.slug}`}
              className="sr-only"
            >
              {activePortfolioProject.title}
            </h2>

            <iframe
              key={activePortfolioProject.slug}
              src={`${getProjectPath(activePortfolioProject)}?quickView=1`}
              title={`${activePortfolioProject.title} portfolio project`}
              className="absolute inset-0 h-full w-full border-0"
              style={{
                backgroundColor: theme.bg,
              }}
            />

            <button
              type="button"
              aria-label="Close portfolio project"
              className={`absolute right-[clamp(2rem,3.4vw,3.2rem)] top-[clamp(1.35rem,2.6vw,2.4rem)] z-[5] grid h-12 w-12 place-items-center rounded-full shadow-[0_1rem_2.5rem_rgba(0,0,0,0.22)] transition-[opacity,transform] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 ${
                isPortfolioLightboxOpen ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
              style={{
                backgroundColor: theme.controlBg,
                color: theme.controlInk,
              }}
              onClick={() => setActivePortfolioProject(null)}
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>
        </div>,
        document.body
      ) : null}
    </section>
  );
}

function HomeFeaturedScenicGrid({
  projects,
}: {
  projects: ScenicProjectSummary[];
}) {
  const featuredProjects = HOME_FEATURED_SCENIC_SLUGS.map(slug =>
    projects.find(project => project.slug === slug && project.coverImageUrl)
  ).filter((project): project is ScenicProjectSummary => Boolean(project));

  if (!featuredProjects.length) return null;

  return (
    <section
      id="featured-scenic-work"
      className="border-t border-white/12 bg-[#111111] text-white"
    >
      <div className="grid gap-8 border-b border-white/12 px-[clamp(1.25rem,4vw,5rem)] py-[clamp(3rem,7vw,6rem)] lg:grid-cols-[0.9fr_1.2fr] lg:items-end">
        <FadeUpReveal>
          <p className="section-kicker mb-5 text-white/42">Featured Scenic Design</p>
          <h2 className="max-w-[13ch] font-sans text-[clamp(2.6rem,6.2vw,6.9rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">
            Places where the story becomes visible.
          </h2>
        </FadeUpReveal>
        <FadeUpReveal className="max-w-[44rem] lg:justify-self-end" delay={120}>
          <p className="font-sans text-[clamp(1.18rem,2.1vw,2.05rem)] font-medium leading-[1.08] tracking-[-0.052em] text-white/78">
            A curated selection of scenic environments for plays, musicals,
            Shakespeare, comedy, and theatre for young audiences. Each design
            begins with the same question: what does this story need the
            audience to see, feel, and understand before anyone says a word?
          </p>
          <a
            href="/projects"
            className="mt-7 inline-flex h-10 items-center justify-center rounded-full bg-[#6f2dff] px-5 font-sans text-[0.95rem] font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#7c3cff]"
          >
            View full portfolio
          </a>
        </FadeUpReveal>
      </div>

      <div className="portfolio-focus-grid grid grid-cols-1 border-l border-white/12 md:grid-cols-4">
        {featuredProjects.map((project, index) => (
          <FadeUpReveal
            key={project.slug}
            className={`${getFeaturedProjectPanelClass(index)} h-full`}
            delay={90 + index * 70}
          >
            <a
              href={getProjectPath(project)}
              className="portfolio-focus-card group block h-full border-b border-r border-white/12"
              aria-label={`${project.title} scenic design by Brandon PT Davis`}
            >
              <article className="h-full bg-[#111111]">
                <div className="portfolio-focus-media site-media-square relative aspect-[4/3] overflow-hidden bg-[#181818]">
                  <Image
                    src={project.coverImageUrl || ""}
                    alt={`${project.title} scenic design by Brandon PT Davis`}
                    fill
                    quality={index < 2 ? 84 : 78}
                    className="site-media-square object-cover object-center motion-safe:scale-[1.015] motion-safe:transition-transform motion-safe:duration-[1300ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.055]"
                    priority={index < 2}
                    loading={index < 2 ? "eager" : "lazy"}
                    fetchPriority={index < 2 ? "high" : "auto"}
                    sizes={getFeaturedProjectImageSizes(index)}
                  />
                </div>
                <div className="portfolio-focus-copy min-h-[8.5rem] border-t border-white/12 p-[clamp(0.9rem,1.5vw,1.2rem)] text-white">
                  <h3 className="max-w-[18ch] font-sans text-[clamp(1.2rem,1.7vw,1.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white transition-colors duration-500 group-hover:text-[#a78bff]">
                    {project.title}
                  </h3>
                  {project.client ? (
                    <p className="mt-2 max-w-[18ch] font-sans text-[0.94rem] leading-tight tracking-[-0.025em] text-white/52">
                      {project.client}
                    </p>
                  ) : null}
                </div>
              </article>
            </a>
          </FadeUpReveal>
        ))}
      </div>
    </section>
  );
}

function HomePortfolioExploreStrip() {
  return (
    <section className="border-t border-white/12 bg-black text-white">
      <div className="grid gap-8 px-[clamp(1.25rem,4vw,5rem)] py-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <FadeUpReveal>
          <p className="section-kicker mb-4 text-white/42">Explore</p>
          <h2 className="max-w-[13ch] font-sans text-[clamp(2rem,4.5vw,4.6rem)] font-medium leading-[0.92] tracking-[-0.065em] text-white">
            Different stories ask for different rooms.
          </h2>
        </FadeUpReveal>
        <FadeUpReveal className="max-w-[42rem] font-sans text-[clamp(1.02rem,1.55vw,1.35rem)] font-medium leading-[1.22] tracking-[-0.035em] text-white/62" delay={110}>
          Move through the work by the kind of story being staged, from rooms
          under pressure to worlds built for rhythm, language, comedy, and young
          audiences.
        </FadeUpReveal>
      </div>

      <div className="grid border-l border-t border-white/12 sm:grid-cols-2 lg:grid-cols-5">
        {portfolioCategoryRows.map((row, index) => {
          const Icon = row.icon;

          return (
            <FadeUpReveal
              key={row.title}
              className="h-full"
              delay={90 + index * 65}
            >
              <a
                href={row.href}
                className="group block h-full min-h-[15rem] border-b border-r border-white/12 bg-[#111111] p-[clamp(1rem,2vw,1.35rem)] transition-colors hover:bg-[#181818] lg:min-h-[18rem]"
              >
                <Icon
                  aria-hidden="true"
                  className="mb-8 h-6 w-6 text-[#7c3cff] transition-[color,transform] duration-500 group-hover:-translate-y-1 group-hover:text-white"
                  strokeWidth={1.7}
                />
                <h3 className="font-sans text-[clamp(1.25rem,1.7vw,1.7rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white transition-colors duration-500 group-hover:text-[#a78bff]">
                  {row.title}
                </h3>
                <p className="mt-4 max-w-[22rem] text-[0.92rem] leading-6 tracking-[-0.018em] text-white/54">
                  {row.description}
                </p>
              </a>
            </FadeUpReveal>
          );
        })}
      </div>
    </section>
  );
}

function FadeUpReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const revealRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = revealRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={revealRef}
      className={`motion-reveal ${isVisible ? "motion-reveal--visible" : ""} ${className} transition-[opacity,transform,filter] duration-[760ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-0 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ProcessSection() {
  return (
    <section className="border-t border-white/12 bg-[#111111] text-white">
      <div className="grid gap-12 px-[clamp(1.25rem,4vw,5rem)] py-[clamp(4.5rem,8vw,7rem)] lg:grid-cols-[0.86fr_1.34fr] lg:items-start lg:pb-[clamp(3rem,5vw,4.5rem)]">
        <FadeUpReveal>
          <p className="section-kicker mb-5 text-white/42">Process</p>
          <h2 className="max-w-[12ch] font-sans text-[clamp(2.35rem,5.8vw,6.2rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">
            Start with the question the room has to answer.
          </h2>
        </FadeUpReveal>

        <div className="lg:pt-[clamp(2.25rem,5.2vw,5.25rem)]">
          <FadeUpReveal delay={90}>
            <div className="max-w-[52rem] space-y-6 font-sans text-[clamp(1.08rem,1.6vw,1.38rem)] font-medium leading-[1.32] tracking-[-0.035em] text-white/72">
              <p>
                Every production asks something different of its space. Some
                plays need a room that traps people together. Some need a world
                that can turn on a dime. Some need a visual metaphor strong
                enough to carry memory, myth, or music.
              </p>
              <p>
                Brandon's design process moves from script analysis and research
                into sketches, models, renderings, drafting, production
                conversations, and built space. The work is collaborative,
                practical, and story-first.
              </p>
            </div>
          </FadeUpReveal>
        </div>
      </div>

      <div className="grid border-l border-t border-white/12 md:grid-cols-3">
        {processCards.map((card, index) => (
          <FadeUpReveal key={card.title} delay={120 + index * 95}>
            <article className="flex min-h-[16rem] h-full flex-col border-b border-r border-white/12 bg-black/24 p-[clamp(1rem,2vw,1.5rem)] lg:min-h-[18rem]">
              <p className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.24em] text-[#7c3cff]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-8 max-w-[13ch] font-sans text-[clamp(1.55rem,2.6vw,2.7rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white">
                {card.title}
              </h3>
              <p className="mt-auto max-w-[28rem] pt-8 text-[1rem] leading-6 tracking-[-0.02em] text-white/56">
                {card.text}
              </p>
            </article>
          </FadeUpReveal>
        ))}
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
  const fullWidthRows = rows.slice(0, 3);
  const splitRows = rows.slice(3, 5);

  if (!rows.length) return null;

  const renderCategoryPanel = (
    row: (typeof rows)[number],
    options: {
      split?: boolean;
      stackIndex?: number;
      stagePanel?: boolean;
      frameTop?: boolean;
      frameBottom?: boolean;
    } = {}
  ) => {
    const leadProject = row.projects[0];
    const isSplit = options.split === true;
    const isStagePanel = options.stagePanel === true;
    const stackIndex = options.stackIndex;
    const alignRight =
      row.title === "Drama" ||
      row.title === "Musical Theatre" ||
      row.title === "TYA";
    const contentAlignment = alignRight
      ? "items-start text-left md:items-end md:text-right"
      : "items-start text-left";
    const overlayPosition = alignRight
      ? "justify-end md:pr-[clamp(2rem,7vw,8rem)]"
      : "justify-start md:pl-[clamp(2rem,7vw,8rem)]";
    const overlayGradient = alignRight
      ? "md:bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.14)_42%,rgba(0,0,0,0.58)_100%)]"
      : "md:bg-[linear-gradient(90deg,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.14)_58%,rgba(0,0,0,0)_100%)]";

    return (
      <article
        key={row.title}
        className={`group relative min-h-[72svh] overflow-hidden bg-[#f1f0ec] ${
          isStagePanel
            ? "md:h-full md:min-h-0"
            : isSplit
            ? "md:min-h-screen"
            : "md:sticky md:top-0 md:h-screen md:min-h-screen"
        }`}
        style={stackIndex ? { zIndex: stackIndex } : undefined}
      >
        {leadProject ? (
          <a
            href={getProjectPath(leadProject)}
            className={`site-media-square relative block h-[72svh] w-full overflow-hidden ${
              isStagePanel ? "md:h-full" : "md:h-screen"
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
          className={`pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.2)_42%,rgba(0,0,0,0.78)_100%)] ${overlayGradient}`}
          aria-hidden="true"
        />
        {isStagePanel && !isSplit ? (
          <div
            className={`pointer-events-none absolute inset-0 border-x-[20px] border-[#f1f0ec] ${
              options.frameTop === false ? "" : "border-t-[20px]"
            } ${
              options.frameBottom === false ? "" : "border-b-[20px]"
            }`}
            aria-hidden="true"
          />
        ) : null}
        <div
          className={`absolute inset-0 flex items-end px-[clamp(1rem,5vw,6rem)] py-10 md:items-center md:px-[clamp(1.5rem,5vw,6rem)] md:py-16 ${overlayPosition}`}
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
              className={`pointer-events-auto mt-6 flex flex-col gap-3 min-[420px]:flex-row ${
                alignRight ? "md:justify-end" : "md:justify-start"
              }`}
            >
              <a
                href={row.href}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#6f2dff] px-5 font-sans text-[0.95rem] font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#7c3cff]"
              >
                View collection
              </a>
              {leadProject ? (
                <a
                  href={getProjectPath(leadProject)}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#6f2dff]/72 px-5 font-sans text-[0.95rem] font-medium tracking-[-0.02em] text-[#a78bff] transition-colors hover:border-[#7c3cff] hover:text-white"
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

  return (
    <section
      id="portfolio-index"
      className="border-t border-black/10 bg-[#f1f0ec] md:bg-black"
    >
      <div className="space-y-4 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(1rem,2vw,1.5rem)] md:hidden">
        {fullWidthRows.map((row, index) =>
          renderCategoryPanel(row, { stackIndex: index + 1 })
        )}

        {splitRows.length ? (
          <div
            className="grid gap-4 md:sticky md:top-0 md:h-screen md:grid-cols-2 md:gap-0"
            style={{ zIndex: fullWidthRows.length + 1 }}
          >
            {splitRows.map(row => renderCategoryPanel(row, { split: true }))}
          </div>
        ) : null}

        <BrandonSection stacked stackIndex={fullWidthRows.length + (splitRows.length ? 2 : 1)} />
      </div>

      <div className="hidden bg-black md:block">
        {fullWidthRows.map((row, index) => (
          <SettlingPanel key={row.title} className="h-screen overflow-hidden bg-black" delay={index * 70}>
            {renderCategoryPanel(row, {
              stagePanel: true,
              frameTop: index === 0,
              frameBottom: !(splitRows.length && index === fullWidthRows.length - 1),
            })}
          </SettlingPanel>
        ))}

        {splitRows.length ? (
          <SettlingPanel className="grid h-screen grid-cols-2 gap-5 bg-[#f1f0ec] p-5" delay={fullWidthRows.length * 70}>
            {splitRows.map(row =>
              renderCategoryPanel(row, { split: true, stagePanel: true })
            )}
          </SettlingPanel>
        ) : null}

        <SettlingPanel
          className="h-screen overflow-hidden bg-[#c66f46]"
          delay={(fullWidthRows.length + (splitRows.length ? 1 : 0)) * 70}
        >
          <BrandonSection stagePanel />
        </SettlingPanel>
      </div>
    </section>
  );
}

function SettlingPanel({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -14% 0px", threshold: 0.18 }
    );

    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={panelRef}
      className={`${className} transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 ${
        isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-12 scale-[0.982] opacity-80"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function BrandonSection({
  stacked = false,
  stackIndex,
  stagePanel = false,
}: {
  stacked?: boolean;
  stackIndex?: number;
  stagePanel?: boolean;
}) {
  return (
    <section
      className={`relative min-h-[68svh] overflow-hidden border-t border-black/10 bg-[#c66f46] ${
        stagePanel ? "md:h-full md:min-h-0" : "md:min-h-screen"
      } ${
        stacked ? "md:sticky md:top-0" : ""
      }`}
      style={stacked && stackIndex ? { zIndex: stackIndex } : undefined}
    >
      <img
        src={ABOUT_HEADSHOT_URL}
        alt="Brandon PT Davis against an orange wall"
        className="site-media-square absolute inset-0 h-full w-full object-cover object-[76%_center] md:object-center"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(241,240,236,0.12)_0%,rgba(241,240,236,0.52)_45%,rgba(241,240,236,0.88)_100%)] md:bg-[linear-gradient(90deg,rgba(241,240,236,0.74)_0%,rgba(241,240,236,0.42)_35%,rgba(241,240,236,0.02)_68%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/18 to-transparent" />
      <div
        className={`relative flex min-h-[68svh] items-end px-[clamp(1rem,5vw,6rem)] py-12 md:items-center md:px-[clamp(1.5rem,5vw,6rem)] md:py-28 ${
          stagePanel ? "md:h-full md:min-h-0" : "md:min-h-screen"
        }`}
      >
        <div className="max-w-[48rem]">
          <p className="mb-5 section-kicker text-black/48">Profile</p>
          <h2 className="font-sans text-[clamp(2.05rem,10vw,3.35rem)] font-medium leading-[0.94] tracking-[-0.065em] text-black md:text-[clamp(2.4rem,5.2vw,5.8rem)] md:leading-[0.92] md:tracking-[-0.07em]">
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
          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row md:mt-9 md:flex-wrap">
            <a
              href="/about"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#6f2dff] px-5 text-sm font-medium text-white transition-colors hover:bg-[#7c3cff]"
            >
              About Brandon
            </a>
            <a
              href="/resume"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#6f2dff]/72 px-5 text-sm font-medium text-[#4f2fd8] transition-colors hover:border-[#4f2fd8] hover:text-black"
            >
              Resume / CV
            </a>
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
    .slice(0, 6);
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
    <section className="bg-black text-white">
      <style>
        {`
          @keyframes home-flip-word {
            0% { opacity: 0; transform: translateY(0.48em); filter: blur(6px); }
            55% { opacity: 1; filter: blur(0); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }

          @keyframes home-rendering-rail {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}
      </style>

      <div className="grid gap-8 border-t border-white/12 px-[clamp(1.25rem,4vw,5rem)] py-[clamp(3rem,7vw,6rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(24rem,0.85fr)] lg:items-end">
        <FadeUpReveal>
          <p className="section-kicker mb-5 text-white/42">
            Rendering + Experiential Design
          </p>
          <h2
            className="max-w-[22ch] font-sans text-[clamp(2.35rem,4.7vw,5.2rem)] font-medium leading-[0.98] tracking-[-0.065em] text-white"
            aria-label="Designing renderings, drawings, installations, and environments beyond the proscenium."
          >
            <span className="block md:whitespace-nowrap">
              Designing{" "}
              <FlipWords
                words={HOME_RENDERING_FLIP_WORDS}
                className="text-[#7c3cff]"
              />
            </span>
            <span className="block md:whitespace-nowrap">
              beyond the proscenium.
            </span>
          </h2>
        </FadeUpReveal>
        <FadeUpReveal className="max-w-[44rem] lg:justify-self-end" delay={120}>
          <p className="font-sans text-[clamp(1.08rem,1.75vw,1.5rem)] font-medium leading-[1.22] tracking-[-0.04em] text-white/66">
            Renderings, drawings, installations, and commercial environments
            still begin with a scenic question: how should a space guide
            attention, feeling, memory, and action?
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
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
        </FadeUpReveal>
      </div>

      {experientialProjects.length ? (
        <div className="portfolio-focus-grid grid grid-cols-1 border-l border-t border-white/12 md:grid-cols-4">
          {experientialProjects.map((project, index) => (
            <FadeUpReveal
              key={project.slug}
              className={`${getExperientialProjectPanelClass(index)} h-full`}
              delay={100 + index * 75}
            >
              <a
                href={getLocalExperientialProjectHref(project)}
                className="portfolio-focus-card group block h-full border-b border-r border-white/12"
              >
                <article className="h-full bg-[#111111]">
                  <div className="portfolio-focus-media site-media-square relative aspect-[4/3] overflow-hidden bg-[#181818]">
                    <img
                      src={project.coverImageUrl || ""}
                      alt={
                        project.coverAltText ||
                        `${project.title} experiential design by Brandon PT Davis`
                      }
                      className="site-media-square h-full w-full object-cover motion-safe:scale-[1.015] motion-safe:transition-transform motion-safe:duration-[1300ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.055]"
                      loading="lazy"
                    />
                  </div>
                  <div className="portfolio-focus-copy min-h-[8.5rem] border-t border-white/12 p-[clamp(0.9rem,1.5vw,1.2rem)] text-white">
                    <p className="font-sans text-[0.74rem] font-semibold tracking-[-0.015em] text-white/42">
                      Experiential Design
                    </p>
                    <h3 className="mt-3 max-w-[18ch] font-sans text-[clamp(1.2rem,1.7vw,1.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white transition-colors duration-500 group-hover:text-[#a78bff]">
                      {project.title}
                    </h3>
                  </div>
                </article>
              </a>
            </FadeUpReveal>
          ))}
        </div>
      ) : null}

      {renderingRailCards.length ? (
        <FadeUpReveal className="border-t border-white/12" delay={140}>
          <div className="h-[12.5rem] overflow-hidden md:h-[14rem]">
            <div className="flex h-full w-max gap-0 motion-safe:animate-[home-rendering-rail_54s_linear_infinite] motion-safe:md:hover:[animation-play-state:paused]">
              {movingRenderingCards.map((card, index) => (
                <a
                  key={`${card.href}-${index}`}
                  href={card.href}
                  className="portfolio-focus-card group block h-full w-[16rem] shrink-0 border-b border-r border-white/12 md:w-[18rem]"
                >
                  <article className="h-full bg-[#0f0f0f]">
                    <div className="site-media-square relative h-full overflow-hidden bg-[#181818]">
                      <img
                        src={card.image}
                        alt={card.imageAlt}
                        className="site-media-square h-full w-full object-cover motion-safe:scale-[1.015] motion-safe:transition-transform motion-safe:duration-[1200ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.055]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.12)_46%,rgba(0,0,0,0.84)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="font-sans text-[0.68rem] font-semibold tracking-[-0.015em] text-white/52">
                          Rendering
                        </p>
                        <h3 className="mt-2 max-w-[15ch] font-sans text-[1.08rem] font-medium leading-[0.96] tracking-[-0.05em] text-white transition-colors duration-500 group-hover:text-[#a78bff] md:text-[1.22rem]">
                          {card.title}
                        </h3>
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </div>
        </FadeUpReveal>
      ) : null}
    </section>
  );
}

function PublishSection() {
  const publishCards = getHomePublishCards();

  return (
    <section className="bg-black py-16 text-white md:py-24">
      <div className="px-[clamp(1.5rem,5vw,6rem)]">
        <div className="mb-10 grid gap-8 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] md:items-end">
          <FadeUpReveal>
            <p className="mb-4 section-kicker text-white">
              Articles
            </p>
            <h2 className="max-w-[13ch] bg-gradient-to-r from-[#0a4cff] via-[#4f2fd8] to-[#7c3cff] bg-clip-text font-sans text-[clamp(2.4rem,5vw,5.3rem)] font-medium leading-[0.94] tracking-[-0.068em] text-transparent">
              Notes from the studio.
            </h2>
          </FadeUpReveal>
          <FadeUpReveal delay={110}>
            <div className="max-w-[48rem] space-y-5 font-sans text-[clamp(1.02rem,1.45vw,1.24rem)] font-medium leading-[1.34] tracking-[-0.03em] text-white/66">
              <p>
                Writing on scenic design, rendering workflows, theatrical
                storytelling, teaching, process, and the ways scenic thinking
                can move beyond the stage.
              </p>
              <p>
                These articles open the studio process: how designs develop,
                how renderings communicate, how tools support the work, and how
                theatrical space can teach us to look more carefully at the
                built world.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/articles"
              className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 font-sans text-sm font-medium tracking-[-0.02em] text-black transition-colors hover:bg-white/86"
            >
              Articles
            </a>
            </div>
          </FadeUpReveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {publishCards.map((card, index) => (
            <FadeUpReveal
              key={`${card.kind}-${card.href}`}
              className="h-full"
              delay={120 + index * 80}
            >
              <a
                href={card.href}
                className="group relative flex h-[25rem] flex-col justify-end overflow-hidden rounded-[1.25rem] bg-black p-5 text-white shadow-[0_12px_28px_rgba(0,0,0,0.2)] ring-1 ring-white/10 transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(0,0,0,0.24)] md:h-[28rem] md:rounded-[1.5rem] md:p-6"
                aria-label={`${card.kind}: ${card.title}`}
              >
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="site-media-square absolute inset-0 h-full w-full object-cover motion-safe:scale-[1.015] motion-safe:transition-transform motion-safe:duration-[1200ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.055]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/18" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/88 via-black/48 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/28 to-transparent" />

                <div className="relative z-10">
                  <p className="font-sans text-[0.74rem] font-semibold tracking-[-0.015em] text-white/68">
                    {card.kind}
                  </p>
                  <h3 className="mt-3 max-w-[13ch] font-sans text-[1.64rem] font-medium leading-[0.98] tracking-[-0.055em] text-white transition-colors duration-500 group-hover:text-[#a78bff]">
                    {card.title}
                  </h3>
                  <p className="mt-4 max-w-[18rem] text-[0.94rem] leading-6 tracking-[-0.012em] text-white/68">
                    {card.description}
                  </p>
                </div>
              </a>
            </FadeUpReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeCta() {
  return (
    <section className="group relative min-h-[62svh] overflow-hidden bg-black md:min-h-[72svh]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black via-black/82 to-transparent"
        aria-hidden="true"
      />
      <img
        src={HOME_CTA_IMAGE_URL}
        alt="The Merry Wives of Windsor scenic design detail by Brandon PT Davis"
        className="site-media-square absolute inset-0 h-full w-full object-cover motion-safe:scale-[1.02] motion-safe:transition-transform motion-safe:duration-[1600ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/28" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.48)_44%,rgba(0,0,0,0.86)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.42)_36%,rgba(0,0,0,0.08)_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/42 to-transparent" />

      <div className="relative flex min-h-[62svh] items-end px-[clamp(1rem,5vw,6rem)] pb-10 pt-20 md:min-h-[72svh] md:px-[clamp(1.5rem,5vw,6rem)] md:pb-16">
        <div className="max-w-3xl">
          <p className="mb-4 section-kicker text-white/46">
            Portfolio / Contact
          </p>
          <h2 className="font-sans text-[clamp(2.2rem,11vw,3.6rem)] font-medium leading-[0.94] tracking-[-0.065em] text-white md:text-[clamp(2.6rem,5.8vw,6.2rem)] md:leading-[0.9] md:tracking-[-0.07em]">
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
  const { homeTheme } = useHomeTheme();

  const projects = sortScenicProjectsChronologically(initialProjects);
  const projectsLoading = false;
  const featuredProject =
    projects.find(project => project.coverImageUrl) || projects[0];
  return (
    <div
      data-page-shell="home"
      data-home-scroll-root
      className="flex min-h-screen flex-col transition-colors duration-500"
      style={{
        backgroundColor: homeTheme.bg,
        color: homeTheme.ink,
        fontFamily: HOME_DISPLAY_FONT,
      }}
    >
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

      <main className="flex-1" style={{ backgroundColor: homeTheme.bg }}>
        {projectsLoading ? (
          <ProjectGridSkeleton />
        ) : featuredProject ? (
          <>
            <div className="relative z-10" style={{ backgroundColor: homeTheme.bg }}>
              <HomeIdentityCard projects={projects} theme={homeTheme} />
              <HomeMinimalGallery projects={projects} theme={homeTheme} />
            </div>
            <Footer
              tone="light"
              variant="immersive"
            />
          </>
        ) : null}
      </main>
    </div>
  );
}
