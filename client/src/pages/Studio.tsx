"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ExternalLink,
  X,
} from "lucide-react";
import { Link } from "wouter";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { HOME_BODY_FONT, HOME_DISPLAY_FONT, useHomeDocumentTheme, useHomeTheme } from "@/lib/homeTheme";
import {
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "@shared/learningPortal";
import { getTutorialArticles } from "@shared/articleTutorials";
import { getLocalArticles } from "@shared/localArticles";

const apps = [
  {
    title: "Scenic 3D Converter",
    shortTitle: "3D Convert",
    description:
      "A Mac utility for preparing 3D files for scenic workflows, with exports aimed at Vectorworks-friendly USD, USDZ, and 3DM handoffs.",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scenic-3d-converter-card-2026.jpg",
    icon: "/images/site-assets/studio-apps/svg/3d-file-convert.svg",
    href: "/studio/apps/scenic-3d-converter",
    category: "Mac Tool",
    tone: "Download",
    cta: "View Mac download",
    launchMode: "page",
    accentColor: "#5f88a8",
    accentTextColor: "#ffffff",
    cardColor: "#5f88a8",
    cardTextColor: "#ffffff",
    cardMutedColor: "rgba(255,255,255,0.74)",
  },
  {
    title: "Scale Calculator",
    shortTitle: "Scale",
    description:
      "Convert architectural and scenic dimensions into model-scale millimeters for 3D printing, drafting, and physical model making.",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scale-calculator-card-2026.jpg",
    icon: "/images/site-assets/studio-apps/svg/scale-calculator.svg",
    href: "/studio/apps/scale-calculator",
    category: "Calculator",
    tone: "Mobile tool",
    cta: "Launch app",
    launchMode: "app",
    accentColor: "#ff6f00",
    accentTextColor: "#20180f",
    cardColor: "#b7653f",
    cardTextColor: "#ffffff",
    cardMutedColor: "rgba(255,255,255,0.74)",
  },
  {
    title: "Dimension Reference",
    shortTitle: "Dims",
    description:
      "Quick reference for standard dimensions and unit conversions in scenic and production design.",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/dimension-reference-card-2026.jpg",
    icon: "/images/site-assets/studio-apps/svg/dimensions.svg",
    href: "/studio/apps/dimension-reference",
    category: "Reference",
    tone: "Shop reference",
    cta: "Open reference",
    launchMode: "app",
    accentColor: "#052f8b",
    accentTextColor: "#a8f4ff",
    cardColor: "#c98f24",
    cardTextColor: "#17120b",
    cardMutedColor: "rgba(23,18,11,0.68)",
  },
  {
    title: "Rosco Paint Calculator",
    shortTitle: "Rosco",
    description:
      "Professional scenic paint mixing calculator for Rosco Off-Broadway paints and color matching workflows.",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/rosco-paint-calculator-card-2026.jpg",
    icon: "/images/site-assets/studio-apps/svg/rosco-paint.svg",
    href: "/studio/apps/rosco-paint-calculator",
    category: "Calculator",
    tone: "Paint shop",
    cta: "Launch app",
    launchMode: "app",
    accentColor: "#dc30ff",
    accentTextColor: "#ffe3ff",
    cardColor: "#be6241",
    cardTextColor: "#ffffff",
    cardMutedColor: "rgba(255,255,255,0.74)",
  },
  {
    title: "Commercial Paint Matcher",
    shortTitle: "Paint Match",
    description:
      "Match sampled colors against Sherwin-Williams, Benjamin Moore, and BEHR libraries with brand filters and copyable color data.",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/commercial-paint-matcher-card-2026.jpg",
    icon: "/images/site-assets/studio-apps/svg/commercial-paint.svg",
    href: "/studio/apps/commercial-paint-matcher",
    category: "Matcher",
    tone: "Paint library",
    cta: "Launch app",
    launchMode: "app",
    accentColor: "#003f1c",
    accentTextColor: "#baff00",
    cardColor: "#003f1c",
    cardTextColor: "#ffffff",
    cardMutedColor: "rgba(255,255,255,0.74)",
  },
  {
    title: "Design History Timeline",
    shortTitle: "History",
    description:
      "Explore major design periods with visual references, color palettes, and historical context.",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/design-history-timeline-card-2026.jpg",
    icon: "/images/site-assets/studio-apps/svg/timeline.svg",
    href: "/studio/apps/design-history-timeline",
    category: "Reference",
    tone: "Research",
    cta: "Open timeline",
    launchMode: "app",
    accentColor: "#dc30ff",
    accentTextColor: "#ffe3ff",
    cardColor: "#dc30ff",
    cardTextColor: "#ffffff",
    cardMutedColor: "rgba(255,255,255,0.74)",
  },
] as const;

type StudioTool = (typeof apps)[number];

const studioToolCardClass =
  "group flex h-full min-h-[28rem] w-full flex-col overflow-hidden rounded-[1.75rem] border bg-[var(--studio-app-card)] p-5 text-left text-[var(--studio-app-card-text)] shadow-[0_18px_54px_rgba(17,17,17,0.12)] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(17,17,17,0.16)] md:min-h-[30rem] md:p-6";

const studioLinks = [
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

const STUDIO_HEADER_TOP_GRAPHIC =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/publish/article-top.png";
const STUDIO_HEADER_BOTTOM_GRAPHIC = "/images/publish/article-bottom.png";

const articleSwatches = [
  { background: "#ff6f00", text: "#20180f", muted: "rgba(32,24,15,0.72)" },
  { background: "#1385f6", text: "#a8f4ff", muted: "rgba(5,47,139,0.78)" },
  { background: "#35ad62", text: "#003f1c", muted: "rgba(0,63,28,0.76)" },
] as const;

function getArticleTimestamp(value?: string | Date | null) {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function getStudioAppCardStyle(app: StudioTool) {
  return {
    "--studio-app-card": `color-mix(in srgb, ${app.accentColor} 86%, black)`,
    "--studio-app-card-text": app.accentTextColor,
    "--studio-app-card-muted": `color-mix(in srgb, ${app.accentTextColor} 72%, transparent)`,
    "--studio-app-accent": app.accentTextColor,
    "--studio-app-accent-text": app.accentColor,
    "--studio-app-icon-color": `color-mix(in srgb, ${app.accentColor} 18%, white)`,
    borderColor: `color-mix(in srgb, ${app.accentColor} 72%, black)`,
  } as CSSProperties;
}

export default function Studio() {
  const closeTimerRef = useRef<number | null>(null);
  const [activeApp, setActiveApp] = useState<StudioTool | null>(null);
  const [isAppClosing, setIsAppClosing] = useState(false);
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const latestArticles = useMemo(
    () =>
      [...getLocalArticles(), ...getTutorialArticles()]
        .filter((article) => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
        .sort((a, b) => getArticleTimestamp(b.publishedAt || b.createdAt) - getArticleTimestamp(a.publishedAt || a.createdAt))
        .slice(0, 3),
    []
  );
  const pageStyle = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
    "--background": homeTheme.bg,
    "--foreground": homeTheme.ink,
    "--border": homeTheme.ghost,
  } as CSSProperties;
  const displayStyle = {
    color: homeTheme.ink,
    fontFamily: HOME_DISPLAY_FONT,
    fontStretch: "condensed",
  } as CSSProperties;
  const mutedStyle = { color: homeTheme.muted } as CSSProperties;
  const headerGraphicStyle = { opacity: 1 } as CSSProperties;
  const softPanelStyle = {
    backgroundColor: homeTheme.accentSoft,
    color: homeTheme.ink,
  } as CSSProperties;

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
    <div className="min-h-screen transition-colors duration-500" style={pageStyle}>
      <SEO
        title="Studio | Articles, Apps & Directory"
        description="Studio hub for articles, design tools, and curated scenic design references by Brandon PT Davis."
        keywords="scenic design articles, scenic design directory, theatre design resources, Brandon PT Davis publish"
        type="website"
        url="https://www.brandonptdavis.com/studio"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Scenic Design Studio Index",
          url: "https://www.brandonptdavis.com/studio",
          description: "Studio hub for scenic design articles, tools, and references.",
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

      <main
        className="relative z-10 pb-0 transition-colors duration-500"
        style={{ backgroundColor: homeTheme.bg }}
      >
        <section className="px-[clamp(1.5rem,5vw,6rem)] pb-12 pt-28 md:pb-18 md:pt-32">
          <AnimatedSection>
            <div className="mx-auto flex max-w-[76rem] flex-col items-center gap-7 text-center md:gap-10">
              <Image
                src={STUDIO_HEADER_TOP_GRAPHIC}
                alt=""
                width={1960}
                height={484}
                priority
                className="site-media-square pointer-events-none h-auto w-full max-w-[62rem] select-none object-contain"
                style={headerGraphicStyle}
              />
              <h1
                className="max-w-[10ch] text-[clamp(4.6rem,13vw,12rem)] font-black uppercase leading-[0.78] tracking-[0]"
                style={displayStyle}
              >
                STUDIO
              </h1>
              <Image
                src={STUDIO_HEADER_BOTTOM_GRAPHIC}
                alt=""
                width={1960}
                height={484}
                priority
                className="site-media-square pointer-events-none h-auto w-full max-w-[62rem] select-none object-contain"
                style={headerGraphicStyle}
              />
            </div>
          </AnimatedSection>
        </section>

        <section className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)] py-10 md:py-14">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2
              className="text-[clamp(2.4rem,5vw,5.4rem)] font-black uppercase leading-[0.84] tracking-[0]"
              style={displayStyle}
            >
              ARTICLES
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/articles"
                className="inline-flex h-11 items-center rounded-full px-5 text-[0.9rem] font-black uppercase tracking-[0.04em] shadow-[0_10px_28px_rgba(17,17,17,0.1)] transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
              >
                Articles
              </Link>
              <Link
                href="/articles/archive"
                className="inline-flex h-11 items-center rounded-full px-5 text-[0.9rem] font-black uppercase tracking-[0.04em] transition-transform hover:-translate-y-0.5"
                style={softPanelStyle}
              >
                Archive
              </Link>
            </div>
          </div>

          {latestArticles.length > 0 ? (
            <div className="grid auto-rows-fr gap-6 md:grid-cols-3">
              {latestArticles.map((article, index) => {
                const swatch = articleSwatches[index % articleSwatches.length];
                return (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] shadow-[0_18px_54px_rgba(17,17,17,0.12)] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(17,17,17,0.16)]"
                    aria-label={`Article: ${article.title}`}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      {article.coverImageUrl ? (
                        <img
                          src={article.coverImageUrl}
                          alt={article.coverImageAlt || article.title}
                          className="site-media-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      ) : null}
                    </div>
                      <div
                        className="flex min-h-[12.5rem] flex-1 flex-col px-5 py-5 sm:px-6"
                        style={{ backgroundColor: swatch.background, color: swatch.text }}
                      >
                      <p className="text-[0.86rem] font-black uppercase tracking-[0.04em]" style={{ color: swatch.muted }}>
                        {article.categoryName || "Article"}
                      </p>
                      <h3 className="mt-4 line-clamp-3 max-w-[20rem] text-[clamp(1.18rem,1.38vw,1.48rem)] font-black leading-[1.02] tracking-[0]">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </section>

        <section className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)] pb-12 md:pb-16">
          <Link
            href="/studio/directory"
            className="group grid overflow-hidden rounded-[2rem] shadow-[0_18px_54px_rgba(17,17,17,0.13)] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(17,17,17,0.16)] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
            style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
          >
            <div className="flex min-h-[24rem] flex-col px-6 py-7 sm:px-8 sm:py-9 md:min-h-[30rem]">
              <p className="text-[0.9rem] font-black uppercase tracking-[0.06em] opacity-70">
                Scenic Directory
              </p>
              <h2
                className="mt-8 max-w-[12ch] text-[clamp(3rem,6vw,6.4rem)] font-black uppercase leading-[0.82] tracking-[0]"
                style={{ fontFamily: HOME_DISPLAY_FONT, fontStretch: "condensed" }}
              >
                DIRECTORY
              </h2>
              <p className="mt-7 max-w-[34rem] text-[1.02rem] font-medium leading-7 tracking-[0] opacity-72">
                A curated set of theatre organizations, archives, software references, suppliers, and production resources for scenic design work.
              </p>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[1rem] font-black uppercase tracking-[0.04em]">
                Browse directory
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
            <div className="relative min-h-[18rem] bg-white/8 md:min-h-full">
              <Image
                src={studioLinks[1].image}
                alt="Scenic Directory"
                fill
                className="object-cover opacity-[0.92] transition-transform duration-700 group-hover:scale-[1.025]"
                sizes="(min-width: 1024px) 38rem, 94vw"
              />
            </div>
          </Link>
        </section>

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-12 md:py-16">
          <div className="mx-auto max-w-[76rem]">
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2
                className="max-w-[11ch] text-[clamp(2.4rem,5vw,5.4rem)] font-black uppercase leading-[0.84] tracking-[0]"
                style={displayStyle}
              >
                APPS
              </h2>
              <Link
                href="/studio/apps"
                className="inline-flex h-11 w-fit items-center rounded-full px-5 text-[0.9rem] font-black uppercase tracking-[0.04em] transition-transform hover:-translate-y-0.5 md:justify-self-end"
                style={softPanelStyle}
              >
                View all apps
              </Link>
            </div>
          </div>

          <div className="mx-auto grid max-w-[76rem] auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
            {apps.map((app, index) => (
              <AnimatedSection key={app.href} className="h-full">
                {app.launchMode === "page" ? (
                  <Link href={app.href} className={studioToolCardClass} style={getStudioAppCardStyle(app)}>
                    <StudioToolCardContent app={app} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openStudioApp(app)}
                    className={studioToolCardClass}
                    style={getStudioAppCardStyle(app)}
                  >
                    <StudioToolCardContent app={app} />
                  </button>
                )}
              </AnimatedSection>
            ))}
          </div>
        </section>
      </main>

      <Footer
        tone="light"
        backgroundColor={homeTheme.footerBg}
        displayTextColor={homeTheme.footerDisplay}
        textColor={homeTheme.footerInk}
      />
      <StudioAppScreen
        app={activeApp}
        isClosing={isAppClosing}
        onBack={closeStudioApp}
      />
    </div>
  );
}

function StudioToolCardContent({ app }: { app: StudioTool }) {
  return (
    <>
      <div>
        <p className="flex flex-wrap items-center gap-2 text-[0.66rem] font-medium uppercase leading-4 tracking-[0.18em] text-[var(--studio-app-card-muted)]">
          <span className="rounded-full bg-[var(--studio-app-accent)] px-2 py-1 text-[var(--studio-app-accent-text)]">
            {app.category}
          </span>
          <span>{app.tone}</span>
        </p>
        <h3
          className="mt-3 max-w-[10ch] text-[clamp(1.9rem,3.4vw,3rem)] font-black uppercase leading-[0.95] tracking-[0]"
          style={{ fontFamily: HOME_DISPLAY_FONT }}
        >
          {app.title}
        </h3>
      </div>

      <StudioToolIcon app={app} />

      <p className="mt-5 max-w-[28rem] text-[0.96rem] leading-6 tracking-[-0.015em] text-[var(--studio-app-card-muted)]">
        {app.description}
      </p>
      <div className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.95rem] font-medium tracking-[-0.02em] text-[var(--studio-app-card-text)]">
        {app.cta}
        <ArrowUpRight
          className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </>
  );
}

function StudioToolIcon({ app }: { app: StudioTool }) {
  return (
    <div className="site-media-square relative my-5 flex aspect-square w-full items-center justify-center overflow-hidden text-[var(--studio-app-icon-color)]">
      <StudioToolIconMark icon={app.icon} label={app.title} />
    </div>
  );
}

function StudioToolIconMark({ icon, label }: { icon: string; label: string }) {
  const maskStyle = {
    WebkitMaskImage: `url(${icon})`,
    maskImage: `url(${icon})`,
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  } as CSSProperties;

  return (
    <span
      aria-label={`${label} icon`}
      role="img"
      className="block h-[74%] w-[74%] bg-current drop-shadow-[0_0_1px_currentColor] transition-transform duration-300 group-hover:scale-[1.04]"
      style={maskStyle}
    />
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
            className="flex h-7 w-7 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.16)] transition-transform hover:scale-105"
            style={{ backgroundColor: app.accentColor, color: app.accentTextColor }}
            aria-label="Back to Studio"
          >
            <X className="h-3.5 w-3.5 opacity-0 transition-opacity hover:opacity-70" />
          </button>
          <div className="text-center">
            <p className="text-[0.82rem] font-semibold tracking-[-0.01em] text-black/54">
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
