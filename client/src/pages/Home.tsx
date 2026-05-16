"use client";

import Image from "next/image";
import { useState } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import { ProjectGridSkeleton } from "@/components/SkeletonLoaders";
import { formatUtcDate } from "@/lib/date-format";
import { getProjectPath } from "@/lib/projectRoutes";
import { sortScenicProjectsChronologically } from "@/lib/scenicShowcase";
import {
  LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG,
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "@shared/learningPortal";
import { getLocalArticles, type LocalArticle } from "@shared/localArticles";
import {
  getLocalExperientialProjectHref,
  getLocalExperientialProjects,
  getLocalRenderingProjects,
} from "@shared/localPortfolios";
import { getLocalTutorials, type LocalTutorial } from "@shared/localStudio";
import type { ScenicProjectSummary } from "@shared/scenicProjectSummaries";
import { upcomingProductions } from "@shared/upcomingProductions";
import { Box, CalendarDays, ImageIcon, NotebookPen, Shapes } from "lucide-react";

const homeLandingCopy = {
  subtitle: "Brandon PT Davis",
  title: "Scenic design, rendering, and learning resources shaped by story.",
  intro:
    "Based in San Diego, Brandon builds theatre environments, rendering studies, and practical learning resources for artists who care about story, clarity, and how an idea moves from sketch to stage.",
} as const;

const ABOUT_HEADSHOT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";

const homeCategories = [
  {
    title: "Scenic Design",
    eyebrow: "Portfolio",
    description: "Production environments for plays, musicals, Shakespeare, and regional theatre.",
    href: "/projects",
    Icon: ImageIcon,
  },
  {
    title: "Rendering",
    eyebrow: "Process",
    description: "Concept images, visual studies, and presentation work.",
    href: "/projects/rendering",
    Icon: Box,
  },
  {
    title: "Experiential",
    eyebrow: "Environments",
    description: "Brand, event, retail, and visualization case studies.",
    href: "/projects/experiential",
    Icon: Shapes,
  },
  {
    title: "Upcoming",
    eyebrow: "Calendar",
    description: "Current and upcoming production work.",
    href: "/upcoming-productions",
    Icon: CalendarDays,
  },
  {
    title: "Studio",
    eyebrow: "Writing",
    description: "Articles, tutorials, and studio resources.",
    href: "/studio",
    Icon: NotebookPen,
  },
] as const;

type HomeCard = {
  title: string;
  description: string;
  eyebrow: string;
  href: string;
  imageAlt: string;
  imageUrl?: string | null;
};

const TUTORIAL_COVER_VARIANTS = {
  "getting-started": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-3.png",
  ],
  "2d-drafting": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-3.png",
  ],
  "3d-modeling": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-3.png",
  ],
  rendering: [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-3.png",
  ],
} as const;

const normalizeToken = (value: string | null | undefined) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getStableVariantIndex = (value: string, total: number) => {
  const hash = value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return hash % total;
};

const getTutorialCoverImage = (tutorial: LocalTutorial) => {
  const category = normalizeToken(tutorial.category);
  const variants =
    TUTORIAL_COVER_VARIANTS[category as keyof typeof TUTORIAL_COVER_VARIANTS] ||
    TUTORIAL_COVER_VARIANTS["getting-started"];
  const variantIndex = getStableVariantIndex(String(tutorial.slug || tutorial.id), variants.length);

  return {
    src: variants[variantIndex],
    alt: `Abstract learning cover for ${tutorial.title}`,
  };
};

const articleToCard = (article: LocalArticle): HomeCard => ({
  title: article.title,
  description: article.excerpt,
  eyebrow: article.categoryName || "Article",
  href: `/articles/${article.slug}`,
  imageAlt: article.coverImageAlt || `${article.title} article cover`,
  imageUrl: article.coverImageUrl,
});

const tutorialToCard = (tutorial: LocalTutorial): HomeCard => ({
  title: tutorial.title,
  description: tutorial.description || tutorial.overview || "A practical scenic design learning resource.",
  eyebrow: tutorial.category || "Learning",
  href: `/studio/tutorials/${tutorial.slug}`,
  imageAlt: getTutorialCoverImage(tutorial).alt,
  imageUrl: getTutorialCoverImage(tutorial).src,
});

const learningArticleToCard = (article: LocalArticle): HomeCard => ({
  title: article.title,
  description: article.excerpt,
  eyebrow: LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG[article.slug] || article.categoryName || "Learning",
  href: `/studio/tutorials/${article.slug}`,
  imageAlt: article.coverImageAlt || `${article.title} learning article cover`,
  imageUrl: article.coverImageUrl,
});

const publishedTime = (date?: string | null) => {
  const time = new Date(date || 0).getTime();
  return Number.isFinite(time) ? time : 0;
};

function RecentProductionHero({ projects }: { projects: ScenicProjectSummary[] }) {
  const heroProjects = projects.filter((project) => project.coverImageUrl).slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = heroProjects[activeIndex] || heroProjects[0];

  if (!activeProject) return null;

  return (
    <section className="relative min-h-[calc(100svh-74px)] overflow-hidden border-b border-white/10 bg-background">
      <div className="absolute inset-0">
        {heroProjects.map((project, index) => (
          <Image
            key={project.slug}
            src={project.coverImageUrl || ""}
            alt={`${project.title} scenic design by Brandon PT Davis`}
            fill
            quality={86}
            priority={index === 0}
            sizes="100vw"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.3)_34%,rgba(0,0,0,0.02)_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/46 to-transparent" />
      </div>

      <div className="relative flex min-h-[calc(100svh-74px)] items-end px-[clamp(1.5rem,5vw,6rem)] pb-10 pt-14 md:pb-14">
        <div className="w-full">
          <p className="mb-6 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-white/58">
            Recent Scenic Design
          </p>

          <div className="max-w-[49rem]">
            {heroProjects.map((project, index) => {
              const active = index === activeIndex;
              return (
                <a
                  key={project.slug}
                  href={getProjectPath(project)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className={`group block w-fit transition-colors ${
                    active ? "text-white" : "text-white/58 hover:text-white"
                  }`}
                >
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-sans text-[clamp(1.8rem,4vw,4.15rem)] font-medium leading-[0.94] tracking-[-0.064em]">
                      {project.title}
                    </span>
                    {project.year ? (
                      <span className="font-sans text-[clamp(0.8rem,1.4vw,1.05rem)] font-semibold leading-none tracking-[0.04em] text-white/70">
                        {project.year}
                      </span>
                    ) : null}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 text-white/64 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="font-sans text-[0.95rem] leading-7 tracking-[-0.01em]">
                {activeProject.client ? `${activeProject.client}. ` : ""}
                {homeLandingCopy.intro}
              </p>
            </div>
            <a
              href="#recent-work"
              className="inline-flex w-fit items-center gap-3 font-sans text-sm font-medium uppercase tracking-[0.12em] text-white/72 transition-colors hover:text-white"
            >
              Scroll
              <span aria-hidden="true" className="text-2xl leading-none">
                ↓
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryStripSection() {
  return (
    <section className="border-b border-white/10 bg-background">
      <div className="px-[clamp(1.5rem,5vw,6rem)]">
        <div className="grid divide-y divide-white/10 border-x border-white/10 md:grid-cols-5 md:divide-x md:divide-y-0">
          {homeCategories.map(({ Icon, description, eyebrow, href, title }) => (
            <a
              key={href}
              href={href}
              className="group min-h-[10.5rem] px-4 py-5 transition-colors hover:bg-white/[0.035] md:px-5 md:py-6"
            >
              <div className="flex h-full flex-col justify-between gap-5">
                <div className="flex items-center justify-between gap-4">
                  <Icon className="h-5 w-5 text-white/64 transition-colors group-hover:text-white" />
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/34">
                    {eyebrow}
                  </span>
                </div>
                <div>
                  <h2 className="font-sans text-[1.18rem] font-medium leading-[1.02] tracking-[-0.04em] text-white">
                    {title}
                  </h2>
                  <p className="mt-3 max-w-[16rem] text-[0.88rem] leading-5 tracking-[-0.01em] text-white/46">
                    {description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentWorkSection({ projects }: { projects: ScenicProjectSummary[] }) {
  const recentProjects = projects.filter((project) => project.coverImageUrl).slice(0, 6);
  if (!recentProjects.length) return null;

  return (
    <section id="recent-work" className="border-t border-white/10 py-16 md:py-24">
      <div className="px-[clamp(1.5rem,5vw,6rem)]">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-white/38">
              Recent Production Work
            </p>
            <h2 className="font-sans text-[clamp(2rem,4vw,3.35rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">
              Scenic design projects from the current archive.
            </h2>
          </div>
          <a
            href="/projects"
            className="group inline-flex w-fit items-center gap-2 font-sans text-sm font-medium tracking-[-0.01em] text-white/76 transition-colors hover:text-white"
          >
            View portfolio
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              -&gt;
            </span>
          </a>
        </div>

        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {recentProjects.map((project) => (
            <a key={project.slug} href={getProjectPath(project)} className="group block border-t border-white/12 pt-4">
              <ProgressiveImage
                src={project.coverImageUrl || ""}
                alt={`${project.title} scenic design by Brandon PT Davis`}
                aspectRatio="16 / 10"
                containerClassName="bg-white/[0.035]"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                sizes="(min-width: 1280px) 31vw, (min-width: 768px) 48vw, 100vw"
                width={900}
                enableScrollAnimation={false}
              />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-sans text-[1.22rem] font-medium leading-[1.05] tracking-[-0.04em] text-white">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/48">
                    {[project.client, project.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function RenderingProcessSection() {
  const renderingProjects = getLocalRenderingProjects()
    .filter((project) => !project.galleryOnly && project.coverImageUrl)
    .slice(0, 4);

  if (!renderingProjects.length) return null;

  return (
    <section className="border-t border-white/10 py-16 md:py-24">
      <div className="px-[clamp(1.5rem,5vw,6rem)]">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-white/38">
              Rendering / Process
            </p>
            <h2 className="font-sans text-[clamp(2rem,4vw,3.35rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">
              Visual studies for atmosphere, scale, and production conversation.
            </h2>
          </div>
          <a
            href="/projects/rendering"
            className="group inline-flex w-fit items-center gap-2 font-sans text-sm font-medium tracking-[-0.01em] text-white/76 transition-colors hover:text-white"
          >
            View rendering
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              -&gt;
            </span>
          </a>
        </div>

        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {renderingProjects.map((project) => (
            <a
              key={project.slug}
              href={`/projects/rendering/${project.slug}`}
              className="group block border-t border-white/12 pt-4"
            >
              <ProgressiveImage
                src={project.coverImageUrl || ""}
                alt={`${project.title} rendering by Brandon PT Davis`}
                aspectRatio="4 / 3"
                containerClassName="bg-white/[0.035]"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                sizes="(min-width: 1280px) 24vw, (min-width: 768px) 48vw, 100vw"
                width={760}
                enableScrollAnimation={false}
              />
              <h3 className="mt-4 font-sans text-[1.18rem] font-medium leading-[1.04] tracking-[-0.04em] text-white">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/48">
                {[project.client, project.year].filter(Boolean).join(" · ")}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperientialSection() {
  const experientialProjects = getLocalExperientialProjects()
    .filter((project) => project.coverImageUrl)
    .slice(0, 4);

  if (!experientialProjects.length) return null;

  return (
    <section className="border-t border-white/10 py-16 md:py-24">
      <div className="px-[clamp(1.5rem,5vw,6rem)]">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-white/38">
              Experiential Design
            </p>
            <h2 className="font-sans text-[clamp(2rem,4vw,3.35rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">
              Brand environments, activations, and project-based visualization.
            </h2>
          </div>
          <a
            href="/projects/experiential"
            className="group inline-flex w-fit items-center gap-2 font-sans text-sm font-medium tracking-[-0.01em] text-white/76 transition-colors hover:text-white"
          >
            View experiential
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              -&gt;
            </span>
          </a>
        </div>

        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {experientialProjects.map((project) => (
            <a
              key={project.slug}
              href={getLocalExperientialProjectHref(project)}
              className="group block border-t border-white/12 pt-4"
            >
              <ProgressiveImage
                src={project.coverImageUrl}
                alt={project.coverAltText}
                aspectRatio="4 / 3"
                containerClassName="bg-white/[0.035]"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                sizes="(min-width: 1280px) 24vw, (min-width: 768px) 48vw, 100vw"
                width={760}
                enableScrollAnimation={false}
              />
              <h3 className="mt-4 font-sans text-[1.18rem] font-medium leading-[1.04] tracking-[-0.04em] text-white">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/48">
                {[project.mediaTypes.map((type) => type.replace("-", " ")).join(" / "), project.year]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandonSection() {
  return (
    <section className="border-t border-white/10 py-16 md:py-24">
      <div className="grid gap-10 px-[clamp(1.5rem,5vw,6rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div className="max-w-3xl">
          <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-white/38">
            Brandon PT Davis
          </p>
          <h2 className="font-sans text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.94] tracking-[-0.065em] text-white">
            A scenic designer building theatrical space around story, behavior, and clarity.
          </h2>
          <p className="mt-7 max-w-2xl text-[1rem] leading-8 tracking-[-0.01em] text-white/58 md:text-[1.06rem]">
            Based in San Diego, Brandon PT Davis creates scenic environments for regional theatre,
            summer stock, academic production, and adjacent visual work. His practice moves between
            production photography, drafting, research, and collaboration with directors and creative
            teams.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/about" className="inline-flex h-11 items-center rounded-full border border-white/22 px-5 text-sm font-medium text-white transition-colors hover:border-white/36 hover:bg-white/[0.05]">
              About Brandon
            </a>
            <a href="/resume" className="inline-flex h-11 items-center rounded-full border border-white/12 px-5 text-sm font-medium text-white/64 transition-colors hover:border-white/24 hover:text-white">
              Resume / CV
            </a>
          </div>
        </div>

        <div className="relative overflow-hidden border border-white/10 bg-white/[0.035] lg:justify-self-end">
          <div className="relative aspect-[4/3] w-full lg:w-[min(42vw,44rem)]">
            <img
              src={ABOUT_HEADSHOT_URL}
              alt="Brandon PT Davis - scenic designer"
              className="h-full w-full object-cover object-[50%_16%]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function UpcomingSection() {
  const nextProductions = upcomingProductions.slice(0, 4);

  return (
    <section className="border-t border-white/10 py-16 md:py-24">
      <div className="px-[clamp(1.5rem,5vw,6rem)]">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-white/38">
              Upcoming Productions
            </p>
            <h2 className="font-sans text-[clamp(2rem,4vw,3.35rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">
              Current scenic design calendar.
            </h2>
          </div>
          <a href="/upcoming-productions" className="group inline-flex w-fit items-center gap-2 font-sans text-sm font-medium tracking-[-0.01em] text-white/76 transition-colors hover:text-white">
            View calendar
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              -&gt;
            </span>
          </a>
        </div>

        <div className="divide-y divide-white/12 border-y border-white/12">
          {nextProductions.map((production) => (
            <a
              key={production.id}
              href={`/upcoming-productions/${production.id}`}
              className="grid gap-5 py-5 transition-colors hover:bg-white/[0.025] md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            >
              <div>
                <p className="font-sans text-[1.45rem] font-medium leading-[1.02] tracking-[-0.05em] text-white md:text-[1.9rem]">
                  {production.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/48">
                  {production.company} · Directed by {production.director}
                </p>
              </div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/46">
                {formatUtcDate(production.startDate, "short")} - {formatUtcDate(production.endDate, "short")}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeCardGrid({
  description,
  id,
  items,
  label,
  linkHref,
  linkLabel,
  title,
}: {
  description: string;
  id?: string;
  items: HomeCard[];
  label: string;
  linkHref: string;
  linkLabel: string;
  title: string;
}) {
  if (!items.length) return null;

  return (
    <section id={id} className="border-t border-white/10 py-16 md:py-24">
      <div className="container max-w-[88rem]">
        <div className="mb-9 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-white/38">
              {label}
            </p>
            <h2 className="max-w-4xl font-sans text-[clamp(2rem,4vw,3.35rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">
              {title}
            </h2>
            <p className="mt-5 max-w-2xl text-[1rem] leading-7 tracking-[-0.01em] text-white/52 md:text-[1.05rem]">
              {description}
            </p>
          </div>
          <a
            href={linkHref}
            className="group inline-flex w-fit items-center gap-2 font-sans text-sm font-medium tracking-[-0.01em] text-white/76 transition-colors hover:text-white"
          >
            {linkLabel}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              -&gt;
            </span>
          </a>
        </div>

        <div className="divide-y divide-white/12 border-y border-white/12">
          {items.map((item) => {
            return (
              <a
                key={item.href}
                href={item.href}
                className="group grid gap-5 py-5 transition-colors hover:bg-white/[0.025] md:grid-cols-[minmax(13rem,0.34fr)_minmax(0,1fr)] md:items-start md:gap-7"
              >
                {item.imageUrl ? (
                  <ProgressiveImage
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    aspectRatio="4 / 3"
                    containerClassName="bg-white/[0.035]"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    sizes="(min-width: 768px) 30vw, 100vw"
                    width={620}
                    enableScrollAnimation={false}
                  />
                ) : (
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.035]" />
                )}
                <div className="md:pt-1">
                  <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">
                    {item.eyebrow}
                  </p>
                  <h3 className="max-w-[42rem] font-sans text-[clamp(1.35rem,2.2vw,2.2rem)] font-normal leading-[1.02] tracking-[-0.05em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-[42rem] text-[0.98rem] leading-7 tracking-[-0.01em] text-white/50">
                    {item.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HomeCta() {
  return (
    <section className="relative border-y border-border/25 px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-white/8 bg-white/[0.06] px-6 py-16 text-center md:px-12 md:py-20">
          <h2 className="mx-auto max-w-4xl font-sans text-[clamp(2.4rem,4.5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.06em] text-foreground">
            Start a project with a designer who can think concept through execution.
          </h2>
          <div className="mt-10 flex justify-center">
            <a
              href="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 font-sans text-[0.95rem] font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-white/14"
            >
              <span>Start a Project</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home({ initialProjects }: { initialProjects: ScenicProjectSummary[] }) {
  const projects = sortScenicProjectsChronologically(initialProjects);
  const projectsLoading = false;
  const featuredProject = projects.find((project) => project.coverImageUrl) || projects[0];
  const localArticles = getLocalArticles();
  const articleCards = localArticles
    .filter((article) => !LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
    .filter((article) => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
    .slice(0, 6)
    .map(articleToCard);
  const tutorialCards = [
    ...getLocalTutorials()
      .filter((tutorial) => tutorial.status !== "draft")
      .map((tutorial) => ({
        card: tutorialToCard(tutorial),
        timestamp: publishedTime(tutorial.published_at || tutorial.created_at || tutorial.updated_at),
      })),
    ...localArticles
      .filter((article) => LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
      .map((article) => ({
        card: learningArticleToCard(article),
        timestamp: publishedTime(article.publishedAt || article.createdAt || article.updatedAt),
      })),
  ]
    .sort((a, b) => {
      const timeCompare = b.timestamp - a.timestamp;
      if (timeCompare !== 0) return timeCompare;
      return a.card.title.localeCompare(b.card.title);
    })
    .slice(0, 6)
    .map((item) => item.card);
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
            <RecentProductionHero projects={projects} />
            <CategoryStripSection />
            <RecentWorkSection projects={projects} />
            <RenderingProcessSection />
            <ExperientialSection />
            <UpcomingSection />
            <BrandonSection />

            <HomeCardGrid
              id="home-writing"
              label="Writing"
              title="Articles on process, theatre, and visual thinking."
              description="Longer-form writing sits close to the portfolio: reflections on scenic design, production process, interviews, and the ideas behind the work."
              linkHref="/articles"
              linkLabel="View articles"
              items={articleCards}
            />

            <HomeCardGrid
              label="Learning"
              title="Learning articles for scenic design and Vectorworks."
              description="The learning portal brings tutorial-based articles, rendering workflows, and studio process notes into one place for students and working designers."
              linkHref="/studio/tutorials"
              linkLabel="View learning"
              items={tutorialCards}
            />

            <HomeCta />
          </>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
