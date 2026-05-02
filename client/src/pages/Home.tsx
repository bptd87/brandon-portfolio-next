"use client";

import { type MouseEvent } from "react";
import { useLocation } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import { ProjectGridSkeleton } from "@/components/SkeletonLoaders";
import { StickyShowcase } from "@/components/StickyShowcase";
import { getProjectPath } from "@/lib/projectRoutes";
import {
  scenicShowcaseProps,
  sortScenicProjectsChronologically,
  splitScenicShowcaseProjects,
} from "@/lib/scenicShowcase";
import {
  LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG,
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "@shared/learningPortal";
import { getLocalArticles, type LocalArticle } from "@shared/localArticles";
import { getLocalTutorials, type LocalTutorial } from "@shared/localStudio";
import type { ScenicProjectSummary } from "@shared/scenicProjectSummaries";

const homeLandingCopy = {
  subtitle: "Brandon PT Davis",
  title: "Scenic design, rendering, and learning resources shaped by story.",
  intro:
    "Based in San Diego, Brandon builds theatre environments, rendering studies, and practical learning resources for artists who care about story, clarity, and how an idea moves from sketch to stage.",
} as const;

type HomeCard = {
  title: string;
  description: string;
  eyebrow: string;
  href: string;
  imageAlt: string;
  imageUrl?: string | null;
};

const studioToolCards: HomeCard[] = [
  {
    title: "Scenic 3D Converter",
    description:
      "A Mac utility for turning SketchUp-style model files into cleaner USDZ assets for scenic rendering workflows.",
    eyebrow: "Studio tool",
    href: "/studio/apps/scenic-3d-converter",
    imageAlt: "Scenic 3D Converter app interface",
    imageUrl:
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-scenic-3d-converter.png",
  },
  {
    title: "Scale Calculator",
    description:
      "Quick theatre scale conversions for drafting, model making, and checking dimensions before they become problems.",
    eyebrow: "Studio tool",
    href: "/studio/apps/scale-calculator",
    imageAlt: "Scale Calculator studio app interface",
    imageUrl:
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-scale-calculator.png",
  },
  {
    title: "Dimension Reference",
    description:
      "A compact reference for common scenic design dimensions, human scale checks, and drafting context.",
    eyebrow: "Studio tool",
    href: "/studio/apps/dimension-reference",
    imageAlt: "Dimension Reference studio app interface",
    imageUrl:
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-dimension-reference.png",
  },
];

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

function HomeCardGrid({
  description,
  items,
  label,
  linkHref,
  linkLabel,
  title,
}: {
  description: string;
  items: HomeCard[];
  label: string;
  linkHref: string;
  linkLabel: string;
  title: string;
}) {
  if (!items.length) return null;

  return (
    <section className="border-t border-white/10 py-16 md:py-24">
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

        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            return (
              <a key={item.href} href={item.href} className="group block">
                {item.imageUrl ? (
                  <ProgressiveImage
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    aspectRatio="1 / 1"
                    containerClassName="bg-white/[0.035]"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    sizes="(min-width: 1024px) 32vw, (min-width: 768px) 50vw, 100vw"
                    width={860}
                    enableScrollAnimation={false}
                  />
                ) : (
                  <div className="relative aspect-square overflow-hidden rounded-[0.8rem] bg-[radial-gradient(circle_at_20%_18%,rgba(108,190,255,0.42),transparent_32%),radial-gradient(circle_at_78%_72%,rgba(255,119,188,0.32),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.025))]" />
                )}
                <div className="pt-5">
                  <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">
                    {item.eyebrow}
                  </p>
                  <h3 className="font-sans text-[1.28rem] font-normal leading-[1.08] tracking-[-0.04em] text-white md:text-[1.45rem]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-6 tracking-[-0.01em] text-white/48">
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
  const [, setLocation] = useLocation();
  const projects = sortScenicProjectsChronologically(initialProjects);
  const projectsLoading = false;
  const { featuredProject, showcaseRailProjects, showcaseGridProjects } =
    splitScenicShowcaseProjects(projects);
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
                  <p className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                    {heroSubtitle}
                  </p>
                  <h1 className="font-sans text-[clamp(2.3rem,4.6vw,3.8rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                    {heroTitle}
                  </h1>
                  <p className="mt-6 max-w-3xl text-[1rem] leading-7 tracking-[-0.01em] text-white/58 md:text-[1.05rem]">
                    {heroIntro}
                  </p>
                </div>
              </div>
            </section>

            <StickyShowcase
              continuationItems={showcaseGridProjects.slice(0, 9)}
              featuredItem={featuredProject}
              itemAlt={scenicAlt}
              itemHref={getProjectPath}
              onNavigate={navigateWithTransition}
              railItems={showcaseRailProjects.slice(0, 4)}
              title={featuredProject.title}
              {...scenicShowcaseProps}
            />

            <HomeCardGrid
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

            <HomeCardGrid
              label="Studio"
              title="Small tools for practical production work."
              description="A growing set of utilities for scenic drafting, file conversion, reference, and the repeatable math that supports design work."
              linkHref="/studio/apps"
              linkLabel="View studio tools"
              items={studioToolCards}
            />

            <HomeCta />
          </>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
