"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  Drama,
  Heart,
  Laugh,
  Music,
  Theater,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { ProjectGridSkeleton } from "@/components/SkeletonLoaders";
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
const HOME_SCENIC_DESIGN_BLUE = "#496784";
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
            0% { opacity: 0; transform: translateY(0.8rem) scale(0.94); filter: blur(10px); }
            62% { opacity: 1; transform: translateY(0) scale(1.018); filter: blur(0); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes home-loader-title {
            0% { opacity: 0; transform: translateY(0.4rem); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes home-loader-out {
            0% { opacity: 1; }
            100% { opacity: 0; visibility: hidden; }
          }
        `}
      </style>
      <div className="flex w-[min(78vw,32rem)] flex-col items-center">
        <img
          src={HOME_LOGO_SRC}
          alt=""
          className="h-auto w-full select-none object-contain opacity-0 motion-safe:animate-[home-loader-logo_860ms_cubic-bezier(0.22,1,0.36,1)_160ms_forwards]"
          draggable={false}
        />
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

const HOME_GALLERY_FRAMES = [
  { aspect: "aspect-[4/3]", spacing: "mb-[clamp(1.7rem,3.2vw,3.9rem)]" },
  {
    aspect: "aspect-[6/5]",
    spacing: "mb-[clamp(2rem,4vw,5rem)] lg:mt-[clamp(0.7rem,1.8vw,2.4rem)]",
  },
  { aspect: "aspect-[16/10]", spacing: "mb-[clamp(1.9rem,3.6vw,4.4rem)]" },
  { aspect: "aspect-[5/4]", spacing: "mb-[clamp(1.45rem,2.8vw,3.4rem)]" },
  {
    aspect: "aspect-[3/2]",
    spacing: "mb-[clamp(2.2rem,4.6vw,5.4rem)] lg:mt-[clamp(1.2rem,2.8vw,3.6rem)]",
  },
  { aspect: "aspect-[1/1]", spacing: "mb-[clamp(1.65rem,3.1vw,3.8rem)]" },
  { aspect: "aspect-[3/2]", spacing: "mb-[clamp(2.25rem,4.8vw,5.8rem)]" },
  {
    aspect: "aspect-[5/4]",
    spacing: "mb-[clamp(1.5rem,3vw,3.7rem)] md:mt-[clamp(0.45rem,1.4vw,1.8rem)]",
  },
  { aspect: "aspect-[4/3]", spacing: "mb-[clamp(2rem,4.2vw,5rem)]" },
  {
    aspect: "aspect-[1/1]",
    spacing: "mb-[clamp(1.7rem,3.5vw,4.1rem)] lg:mt-[clamp(1rem,2.4vw,3rem)]",
  },
  { aspect: "aspect-[16/11]", spacing: "mb-[clamp(2.15rem,4.5vw,5.2rem)]" },
  { aspect: "aspect-[6/5]", spacing: "mb-[clamp(1.55rem,3vw,3.5rem)]" },
  { aspect: "aspect-[6/5]", spacing: "mb-[clamp(2rem,4vw,4.8rem)]" },
  {
    aspect: "aspect-[5/4]",
    spacing: "mb-[clamp(1.8rem,3.8vw,4.6rem)] md:mt-[clamp(0.8rem,2vw,2.6rem)]",
  },
  { aspect: "aspect-[3/2]", spacing: "mb-[clamp(2.35rem,5vw,6rem)]" },
  { aspect: "aspect-[1/1]", spacing: "mb-[clamp(1.6rem,3.2vw,3.8rem)]" },
  {
    aspect: "aspect-[13/8]",
    spacing: "mb-[clamp(2.1rem,4.4vw,5.2rem)] lg:mt-[clamp(0.55rem,1.5vw,2rem)]",
  },
  { aspect: "aspect-[5/4]", spacing: "mb-[clamp(1.7rem,3.4vw,4.2rem)]" },
];

const HOME_FEATURED_DESIGN_SLUGS = [
  "the-penelopiad",
  "million-dollar-quartet",
  "the-glass-menagerie",
  "romero",
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
}: {
  projects: ScenicProjectSummary[];
}) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
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

  const identityCards: HomeFeatureCard[] = [
    { kind: "brand" as const, title: "Brandon PT Davis Scenic Design" },
    ...featuredDesignCards,
  ].slice(0, 5);
  const activeCard = identityCards[activeCardIndex] || identityCards[0];
  const activeCardKey = `${activeCard.kind}-${activeCard.title}`;

  useEffect(() => {
    if (identityCards.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveCardIndex(index => (index + 1) % identityCards.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [identityCards.length]);

  return (
    <section className="bg-white px-[clamp(1rem,3vw,2.8rem)] pb-[clamp(1.6rem,4vw,3.5rem)] pt-[clamp(6rem,9vw,7.5rem)] text-black">
      <style>{`
        @keyframes home-identity-card-in {
          0% { opacity: 0; transform: translateY(0.65rem); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        @keyframes home-identity-media-in {
          0% { opacity: 0; transform: scale(1.025); }
          100% { opacity: 0.82; transform: scale(1); }
        }
      `}</style>
      <div
        className="group relative flex aspect-[16/10] items-center justify-center overflow-hidden text-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-white md:aspect-auto md:min-h-[min(78svh,48rem)]"
        style={{ backgroundColor: HOME_SCENIC_DESIGN_BLUE }}
      >
        {activeCard.kind === "image" && activeCard.image ? (
          <>
            <img
              key={activeCardKey}
              src={activeCard.image}
              alt=""
              aria-hidden="true"
              className="site-media-square absolute inset-0 h-full w-full object-cover opacity-82 transition-[opacity,transform] duration-700 motion-safe:animate-[home-identity-media-in_760ms_cubic-bezier(0.22,1,0.36,1)_forwards] group-hover:scale-[1.018] group-hover:opacity-90"
              draggable={false}
            />
            {activeCard.href ? (
              <a
                href={activeCard.href}
                aria-label={`View ${activeCard.title}`}
                className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              />
            ) : null}
          </>
        ) : null}
        <div
          className={`absolute inset-0 transition-colors duration-700 ${
            activeCard.kind === "brand" ? "" : "bg-black/26"
          }`}
          style={
            activeCard.kind === "brand"
              ? { backgroundColor: HOME_SCENIC_DESIGN_BLUE }
              : undefined
          }
        />
        {activeCard.kind === "brand" ? (
          <div
            key={activeCardKey}
            className="relative flex w-full max-w-[54rem] flex-col items-center px-6 motion-safe:animate-[home-identity-card-in_760ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
          >
            <img
              src={HOME_LOGO_SRC}
              alt=""
              aria-hidden="true"
              className="h-auto w-[min(42rem,78vw)] select-none object-contain opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform duration-700 group-hover:scale-[1.015]"
              draggable={false}
            />
            <h1 className="sr-only">Brandon PT Davis Scenic Design</h1>
            <p className="mt-[clamp(1.35rem,3vw,2.4rem)] max-w-[44rem] font-sans text-[clamp(0.82rem,1.2vw,1.05rem)] font-semibold uppercase leading-[1.25] tracking-[0.42em] text-white drop-shadow-[0_8px_22px_rgba(0,0,0,0.45)]">
              SCENIC DESIGN
            </p>
          </div>
        ) : (
          <>
            <h1 className="sr-only">Brandon PT Davis Scenic Design</h1>
            <div
              key={activeCardKey}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/82 via-black/40 to-transparent px-[clamp(1rem,4vw,3rem)] pb-[clamp(4.25rem,7vw,5.6rem)] pt-28 text-left motion-safe:animate-[home-identity-card-in_760ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
            >
              <p className="font-sans text-[0.82rem] font-semibold leading-none text-white/58">
                Featured Design
              </p>
              <p className="mt-3 max-w-[20ch] font-sans text-[clamp(2rem,5vw,5rem)] font-medium leading-[0.9] tracking-[-0.07em] text-white">
                {activeCard.title}
              </p>
              {activeCard.meta ? (
                <p className="mt-3 max-w-[28rem] font-sans text-[clamp(0.9rem,1.35vw,1.12rem)] font-medium leading-tight tracking-[-0.02em] text-white/68">
                  {activeCard.meta}
                </p>
              ) : null}
            </div>
          </>
        )}
        <div
          className="absolute bottom-[clamp(1.5rem,3vw,2.3rem)] left-1/2 z-20 flex -translate-x-1/2 gap-4"
        >
          {identityCards.map((card, index) => (
            <button
              key={`${card.kind}-${card.title}`}
              type="button"
              aria-label={`Show ${card.title}`}
              aria-pressed={activeCardIndex === index}
              onClick={() => setActiveCardIndex(index)}
              className={`h-2 w-2 border-2 border-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black ${
                activeCardIndex === index ? "bg-white" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeMinimalGallery({
  projects,
}: {
  projects: ScenicProjectSummary[];
}) {
  const galleryProjects = projects
    .filter(project => project.coverImageUrl)
    .slice(0, 30);

  if (!galleryProjects.length) return null;

  return (
    <section
      id="recent-designs"
      className="bg-white px-[clamp(1rem,3vw,2.8rem)] pb-[clamp(3rem,7vw,6rem)] pt-[clamp(1rem,2.4vw,1.8rem)] text-black"
      aria-labelledby="home-gallery-title"
    >
      <h2 id="home-gallery-title" className="sr-only">
        Recent scenic design work.
      </h2>

      <div className="columns-2 gap-[clamp(0.8rem,2.6vw,3rem)] md:columns-2 lg:columns-3">
        {galleryProjects.map((project, index) => {
          const frame =
            HOME_GALLERY_FRAMES[index % HOME_GALLERY_FRAMES.length];
          const meta = [project.client, project.year].filter(Boolean).join(" / ");

          return (
            <a
              key={project.slug}
              href={getProjectPath(project)}
              className={`group block break-inside-avoid text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-white ${frame.spacing}`}
              aria-label={`${project.title} scenic design by Brandon PT Davis`}
            >
              <article>
                <div
                  className={`relative overflow-hidden bg-neutral-100 ${frame.aspect}`}
                >
                  <Image
                    src={project.coverImageUrl || ""}
                    alt={`${project.title} scenic design by Brandon PT Davis`}
                    fill
                    quality={index < 4 ? 86 : 78}
                    priority={index < 4}
                    loading={index < 4 ? "eager" : "lazy"}
                    fetchPriority={index < 4 ? "high" : "auto"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="site-media-square object-cover object-center transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] group-hover:brightness-[0.72]"
                    style={{
                      objectPosition: project.coverImagePosition || "center",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 hidden items-end bg-black/0 p-5 opacity-0 transition-[background-color,opacity] duration-500 group-hover:bg-black/28 group-hover:opacity-100 md:flex">
                    <div className="translate-y-3 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <h2 className="font-sans text-[clamp(1.45rem,2.3vw,2.55rem)] font-medium leading-[0.92] tracking-[-0.065em] text-white">
                        {project.title}
                      </h2>
                      {meta ? (
                        <p className="mt-2 max-w-[20rem] font-sans text-[0.86rem] font-medium leading-tight tracking-[-0.018em] text-white/72">
                          {meta}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="sr-only">
                  <h2 className="font-sans text-[1.1rem] font-medium leading-tight tracking-[-0.035em] text-black">
                    {project.title}
                  </h2>
                  {meta ? (
                    <p className="mt-1 text-[0.82rem] leading-tight tracking-[-0.015em] text-black/50">
                      {meta}
                    </p>
                  ) : null}
                </div>
              </article>
            </a>
          );
        })}
      </div>

      <div className="mx-auto mt-[clamp(3rem,7vw,6rem)] max-w-[58rem] pb-[clamp(1rem,3vw,2.5rem)] text-center">
        <p className="font-sans text-[clamp(1.28rem,2.25vw,2.05rem)] font-medium leading-[1.18] tracking-[-0.055em] text-black">
          Brandon PT Davis is a San Diego-based scenic designer creating
          theatrical environments, renderings, and story-driven spaces for
          plays, musicals, Shakespeare, theatre for young audiences, and
          collaborative live performance.
        </p>
        <a
          href="/projects"
          className="mt-8 inline-flex text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-black/48 transition-colors hover:text-black"
        >
          View full portfolio
        </a>
      </div>
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

function HomeMinimalFooter() {
  return (
    <footer className="border-t border-black/10 bg-white px-[clamp(1rem,3vw,2.8rem)] py-7 text-black">
      <div className="flex flex-col gap-4 text-[0.82rem] tracking-[-0.01em] text-black/48 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Brandon PT Davis. Scenic Design.</p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-5 gap-y-2"
        >
          {[
            ["Portfolio", "/projects"],
            ["About", "/about"],
            ["Contact", "/contact"],
            ["Privacy", "/privacy"],
            ["Sitemap", "/sitemap"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="transition-colors hover:text-black"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default function Home({
  initialProjects,
}: {
  initialProjects: ScenicProjectSummary[];
}) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlBackground = html.style.backgroundColor;
    const previousBodyBackground = body.style.backgroundColor;
    const previousColorScheme = html.style.colorScheme;

    html.style.backgroundColor = "#ffffff";
    body.style.backgroundColor = "#ffffff";
    html.style.colorScheme = "light";

    return () => {
      html.style.backgroundColor = previousHtmlBackground;
      body.style.backgroundColor = previousBodyBackground;
      html.style.colorScheme = previousColorScheme;
    };
  }, []);

  const projects = sortScenicProjectsChronologically(initialProjects);
  const projectsLoading = false;
  const featuredProject =
    projects.find(project => project.coverImageUrl) || projects[0];
  return (
    <div data-page-shell="home" className="min-h-screen bg-white text-black">
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

      <main className="bg-white">
        {projectsLoading ? (
          <ProjectGridSkeleton />
        ) : featuredProject ? (
          <>
            <HomeIdentityCard projects={projects} />
            <HomeMinimalGallery projects={projects} />
            <HomeMinimalFooter />
          </>
        ) : null}
      </main>
    </div>
  );
}
