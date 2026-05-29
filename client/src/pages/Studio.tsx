"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { Link } from "wouter";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import PublishingCard from "@/components/PublishingCard";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "@shared/learningPortal";
import { getLocalArticles } from "@shared/localArticles";

const apps = [
  {
    title: "Scenic 3D Converter",
    shortTitle: "3D Convert",
    description:
      "A Mac utility for preparing 3D files for scenic workflows, with exports aimed at Vectorworks-friendly USD, USDZ, and 3DM handoffs.",
    image: "/assets/studio-apps/icons/scenic-3d-converter.jpg",
    href: "/studio/apps/scenic-3d-converter",
    category: "Mac Tool",
    tone: "Download",
    cta: "View Mac download",
    launchMode: "page",
  },
  {
    title: "Scale Calculator",
    shortTitle: "Scale",
    description:
      "Convert architectural and scenic dimensions into model-scale millimeters for 3D printing, drafting, and physical model making.",
    image: "/assets/studio-apps/icons/scale-calculator.jpg",
    href: "/studio/apps/scale-calculator",
    category: "Calculator",
    tone: "Mobile tool",
    cta: "Launch app",
    launchMode: "app",
  },
  {
    title: "Dimension Reference",
    shortTitle: "Dims",
    description:
      "Quick reference for standard dimensions and unit conversions in scenic and production design.",
    image: "/assets/studio-apps/icons/dimension-reference.jpg",
    href: "/studio/apps/dimension-reference",
    category: "Reference",
    tone: "Shop reference",
    cta: "Open reference",
    launchMode: "app",
  },
  {
    title: "Rosco Paint Calculator",
    shortTitle: "Rosco",
    description:
      "Professional scenic paint mixing calculator for Rosco Off-Broadway paints and color matching workflows.",
    image: "/assets/studio-apps/icons/rosco-paint-calculator.jpg",
    href: "/studio/apps/rosco-paint-calculator",
    category: "Calculator",
    tone: "Paint shop",
    cta: "Launch app",
    launchMode: "app",
  },
  {
    title: "Commercial Paint Matcher",
    shortTitle: "Paint Match",
    description:
      "Match sampled colors against Sherwin-Williams, Benjamin Moore, and BEHR libraries with brand filters and copyable color data.",
    image: "/assets/studio-apps/icons/commercial-paint-matcher.jpg",
    href: "/studio/apps/commercial-paint-matcher",
    category: "Matcher",
    tone: "Paint library",
    cta: "Launch app",
    launchMode: "app",
  },
  {
    title: "Design History Timeline",
    shortTitle: "History",
    description:
      "Explore major design periods with visual references, color palettes, and historical context.",
    image: "/assets/studio-apps/icons/design-history-timeline.jpg",
    href: "/studio/apps/design-history-timeline",
    category: "Reference",
    tone: "Research",
    cta: "Open timeline",
    launchMode: "app",
  },
] as const;

type StudioTool = (typeof apps)[number];

const studioToolCardClass =
  "group flex h-full min-h-[32rem] w-full flex-col overflow-hidden rounded-none border-b border-r border-black/10 bg-[#f4f5f7] p-0 text-left [border-radius:0] transition-colors hover:bg-white md:min-h-[36rem]";

const studioLinks = [
  {
    title: "Tutorials",
    href: "/studio/tutorials",
    category: "Learning",
    imageTitle: "Tutorials",
    description: "Vectorworks lessons and learning articles for scenic drafting, rendering, and workflow.",
    cta: "Open tutorials",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-tutorials-cover.png",
  },
  {
    title: "Articles",
    href: "/articles",
    category: "Writing",
    imageTitle: "Articles",
    description: "Process notes, scenic design practice, drafting decisions, and production-facing writing.",
    cta: "Read articles",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-articles-cover.png",
  },
  {
    title: "Scenic Directory",
    href: "/studio/directory",
    category: "Reference",
    imageTitle: "Directory",
    description: "A curated shelf of resources, archives, organizations, and research references.",
    cta: "Browse directory",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-directory-cover.png",
  },
] as const;

function getArticleTimestamp(value?: string | Date | null) {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export default function Studio() {
  const recentCardsRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [activeApp, setActiveApp] = useState<StudioTool | null>(null);
  const [isAppClosing, setIsAppClosing] = useState(false);
  const latestArticles = useMemo(
    () =>
      getLocalArticles()
        .filter((article) => !LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
        .filter((article) => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
        .sort((a, b) => getArticleTimestamp(b.publishedAt || b.createdAt) - getArticleTimestamp(a.publishedAt || a.createdAt))
        .slice(0, 4),
    []
  );
  const scrollRecentCards = (direction: "previous" | "next") => {
    recentCardsRef.current?.scrollBy({
      left: direction === "next" ? 760 : -760,
      behavior: "smooth",
    });
  };

  function openStudioApp(app: StudioTool) {
    if (app.launchMode === "page") {
      window.location.href = app.href;
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      window.location.href = app.href;
      return;
    }

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setIsAppClosing(false);
    setActiveApp(app);
  }

  function closeStudioApp() {
    if (!activeApp || isAppClosing) return;

    setIsAppClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setActiveApp(null);
      setIsAppClosing(false);
      closeTimerRef.current = null;
    }, 220);
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!activeApp) return;

    const scrollY = window.scrollY;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlHeight = document.documentElement.style.height;
    const originalHtmlOverscrollBehavior =
      document.documentElement.style.overscrollBehavior;
    const originalOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;
    const originalBodyOverscrollBehavior = document.body.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overscrollBehavior = "none";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeStudioApp();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.height = originalHtmlHeight;
      document.documentElement.style.overscrollBehavior =
        originalHtmlOverscrollBehavior;
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.body.style.overscrollBehavior = originalBodyOverscrollBehavior;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeApp]);

  return (
    <div className="min-h-screen bg-[#f1f0ec] text-[#111111] [--background:#f1f0ec] [--border:rgba(17,17,17,0.14)] [--foreground:#111111]">
      <SEO
        title="Publish | Scenic Design Articles, Tutorials & Directory"
        description="Published scenic design resources by Brandon PT Davis, including articles, Vectorworks tutorials, and a curated scenic directory."
        keywords="scenic design articles, Vectorworks tutorials, scenic design directory, theatre design resources, Brandon PT Davis publish"
        type="website"
        url="https://www.brandonptdavis.com/studio"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Publish", url: "https://www.brandonptdavis.com/studio" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Scenic Design Publish Index",
          url: "https://www.brandonptdavis.com/studio",
          description: "Publish hub for scenic design articles, tutorials, and references.",
          about: "Scenic design education and workflow resources by Brandon PT Davis.",
          primaryImageOfPage: studioLinks[0].image,
          mainEntity: {
            name: "Published Resources",
            itemListElement: [
              ...studioLinks.map((item, index) => ({
                position: index + 1,
                name: item.title,
                url: `https://www.brandonptdavis.com${item.href}`,
                image: item.image,
              })),
              ...apps.map((app, index) => ({
                position: studioLinks.length + index + 1,
                name: app.title,
                url: `https://www.brandonptdavis.com${app.href}`,
                image: app.image,
              })),
            ],
          },
        }}
      />

      <Header />
      <PublishingTopBar tone="white" />

      <main className="pb-0">
        <section className="mx-auto max-w-[76rem] border-b border-black/10 px-[clamp(1.5rem,5vw,6rem)] py-16 md:py-20">
          <AnimatedSection>
            <div className="mx-auto max-w-4xl text-center">
              <p className="section-kicker text-foreground/40">
                Publish
              </p>
              <h1 className="mt-5 font-sans text-[clamp(3rem,6vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
                Scenic design writing, tutorials, and references.
              </h1>
              <p className="mx-auto mt-7 max-w-3xl text-[1.02rem] leading-8 text-foreground/62 md:text-[1.12rem]">
                A publish index for articles, tutorials, and references that support scenic drafting,
                research, rendering, and production workflow.
              </p>
            </div>
          </AnimatedSection>
        </section>

        <section className="mx-auto mt-14 max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)]">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-kicker text-foreground/38">
                Publish Index
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2.1rem,4vw,3.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                Articles, tutorials, and references in one place.
              </h2>
            </div>
          </AnimatedSection>

          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {studioLinks.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 70}>
                <PublishingCard
                  href={item.href}
                  title={item.title}
                  imageUrl={item.image}
                  imageAlt={item.title}
                  metaLabel={item.category}
                  description={item.description}
                  actionLabel={item.cta}
                  eager={index === 0}
                />
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="mt-20 bg-[#f1f0ec] py-16 md:py-24">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <div className="mb-10 grid gap-6 md:grid-cols-[minmax(0,0.72fr)_auto] md:items-end">
              <div>
                <p className="mb-4 section-kicker text-black/42">
                  Latest Articles
                </p>
                <h2 className="max-w-[13ch] bg-gradient-to-r from-[#0a4cff] via-[#7b2cbf] to-[#c77dff] bg-clip-text font-sans text-[clamp(2.4rem,5vw,5.3rem)] font-medium leading-[0.94] tracking-[-0.068em] text-transparent">
                  Notes from the studio.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link
                  href="/articles"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#9d4edd] px-5 font-sans text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#c77dff]"
                >
                  Articles
                </Link>
                <Link
                  href="/studio/tutorials"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#9d4edd]/72 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-[#7b2cbf] transition-colors hover:border-[#7b2cbf] hover:text-black"
                >
                  Tutorials
                </Link>
              </div>
            </div>
          </div>

          {latestArticles.length > 0 ? (
            <>
              <div
                ref={recentCardsRef}
                className="overflow-x-auto px-[clamp(1.5rem,5vw,6rem)] pb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="flex min-w-max gap-5 pr-[clamp(1.5rem,5vw,6rem)]">
                  {latestArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="group relative flex h-[30rem] w-[min(21rem,78vw)] flex-col justify-end overflow-hidden rounded-[2rem] bg-black p-6 text-white shadow-[0_12px_28px_rgba(0,0,0,0.2)] ring-1 ring-black/[0.04] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(0,0,0,0.24)] md:w-[22rem]"
                      aria-label={`Article: ${article.title}`}
                    >
                      {article.coverImageUrl ? (
                        <img
                          src={article.coverImageUrl}
                          alt={article.coverImageAlt || article.title}
                          className="site-media-square absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                          loading="lazy"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-black/18" />
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/88 via-black/48 to-transparent" />
                      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/28 to-transparent" />

                      <div className="relative z-10">
                        <p className="font-sans text-[0.74rem] font-semibold tracking-[-0.015em] text-white/68">
                          {article.categoryName || "Article"}
                        </p>
                        <h3 className="mt-3 max-w-[13ch] font-sans text-[1.64rem] font-medium leading-[0.98] tracking-[-0.055em] text-white">
                          {article.title}
                        </h3>
                        {article.excerpt ? (
                          <p className="mt-4 max-w-[18rem] text-[0.94rem] leading-6 tracking-[-0.012em] text-white/68">
                            {article.excerpt}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="-mt-5 flex justify-end gap-3 px-[clamp(1.5rem,5vw,6rem)]">
                <button
                  type="button"
                  onClick={() => scrollRecentCards("previous")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.08] text-black/62 transition-colors hover:bg-black hover:text-white"
                  aria-label="Previous studio article cards"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRecentCards("next")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.12] text-black/72 transition-colors hover:bg-black hover:text-white"
                  aria-label="Next studio article cards"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
            </>
          ) : (
            <AnimatedSection>
              <div className="mx-[clamp(1.5rem,5vw,6rem)] border-t border-black/10 pt-8 text-center text-black/52">
                Articles coming soon.
              </div>
            </AnimatedSection>
          )}
        </section>

        <section className="bg-[#f1f0ec] pt-16 md:pt-24">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <div className="mb-10 grid gap-6 md:grid-cols-[minmax(0,0.72fr)_auto] md:items-end">
              <div className="max-w-3xl">
                <p className="mb-4 text-[clamp(1.05rem,1.35vw,1.22rem)] font-medium leading-none tracking-[-0.04em] text-black/48">
                  Studio Tools
                </p>
                <h2 className="max-w-[12ch] bg-gradient-to-r from-[#0a4cff] via-[#7b2cbf] to-[#c77dff] bg-clip-text font-sans text-[clamp(2.4rem,5vw,5.3rem)] font-medium leading-[0.94] tracking-[-0.068em] text-transparent">
                  Practical design utilities.
                </h2>
              </div>
              <Link
                href="/studio/apps"
                className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-[#9d4edd]/72 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-[#7b2cbf] transition-colors hover:border-[#7b2cbf] hover:text-black md:justify-self-end"
              >
                View all tools
              </Link>
            </div>
          </div>

          <div className="grid border-y border-black/10 [grid-auto-rows:1fr] md:grid-cols-2 xl:grid-cols-3">
            {apps.map((app, index) => (
              <AnimatedSection key={app.href} className="h-full">
                {app.launchMode === "page" ? (
                  <Link href={app.href} className={studioToolCardClass}>
                    <StudioToolCardContent app={app} index={index} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openStudioApp(app)}
                    className={studioToolCardClass}
                  >
                    <StudioToolCardContent app={app} index={index} />
                  </button>
                )}
              </AnimatedSection>
            ))}
          </div>
        </section>
      </main>

      <Footer tone="light" />
      <StudioAppScreen
        app={activeApp}
        isClosing={isAppClosing}
        onBack={closeStudioApp}
      />
    </div>
  );
}

function StudioToolCardContent({
  app,
  index,
}: {
  app: StudioTool;
  index: number;
}) {
  return (
    <>
      <div className="site-media-square aspect-square w-full overflow-hidden rounded-none border-b border-black/10 bg-black [border-radius:0]">
        <img
          src={app.image}
          alt={app.title}
          loading={index === 0 ? "eager" : "lazy"}
          className="site-media-square h-full w-full rounded-none object-cover [border-radius:0]"
        />
      </div>

      <div className="flex flex-1 flex-col px-5 py-6 md:px-7 md:py-8">
        <div className="mb-7 flex items-center justify-between gap-4">
          <p className="text-[0.72rem] font-semibold uppercase leading-none tracking-[0.26em] text-black/46">
            {app.category} / {app.tone}
          </p>
          <span className="text-[0.72rem] font-semibold leading-none tracking-[0.26em] text-black/28">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="max-w-[10ch] font-sans text-[clamp(2.35rem,5.8vw,4.65rem)] font-medium leading-[0.86] tracking-[-0.085em] text-black">
          {app.title}
        </h3>
        <p className="mt-5 max-w-[34rem] text-[1rem] leading-[1.42] tracking-[-0.025em] text-black/58 md:text-[1.08rem]">
          {app.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-9 text-[1rem] font-medium tracking-[-0.03em] text-black/68 transition-colors group-hover:text-black">
          <span>{app.cta}</span>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  );
}

function StudioAppScreen({
  app,
  isClosing,
  onBack,
}: {
  app: StudioTool | null;
  isClosing: boolean;
  onBack: () => void;
}) {
  if (!app) return null;

  const frameSrc = `${app.href}?studioFrame=1`;

  return (
    <div
      className="studio-app-overlay fixed inset-0 z-[120] flex flex-col overflow-hidden bg-[#f3eee4] text-black md:grid md:place-items-center md:bg-black/72 md:p-6"
      data-state={isClosing ? "closing" : "open"}
      role="dialog"
      aria-modal="true"
      aria-label={`${app.title} app screen`}
    >
      <div className="studio-app-shell flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f3eee4] md:h-[min(54rem,88vh)] md:w-full md:max-w-[28rem] md:flex-none md:rounded-[2.4rem] md:border md:border-black/12 md:shadow-[0_34px_140px_rgba(0,0,0,0.42)]">
        <div className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-black/10 bg-[#fbf7ef] px-4 shadow-[inset_0_1px_rgba(255,255,255,0.68)]">
          <button
            type="button"
            onClick={onBack}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff5f57] text-[#6f1512] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.16)] transition-transform hover:scale-105"
            aria-label="Back to Studio"
          >
            <X className="h-3.5 w-3.5 opacity-0 transition-opacity hover:opacity-70" />
          </button>
          <div className="text-center">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-black/54">
              {app.shortTitle}
            </p>
          </div>
          <a
            href={app.href}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-black/46 transition-colors hover:bg-black/6 hover:text-black"
            aria-label={`Open ${app.title} as full page`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="min-h-0 flex-1 bg-[#f3eee4]">
          <iframe
            key={app.href}
            title={app.title}
            src={frameSrc}
            className="studio-app-iframe h-full w-full border-0 bg-[#f3eee4]"
            loading="lazy"
            allow="clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}
