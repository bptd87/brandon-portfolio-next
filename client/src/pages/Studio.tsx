"use client";

import { type CSSProperties, useMemo } from "react";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { Link } from "wouter";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";
import { RETIRED_LEARNING_ARTICLE_SLUG_SET } from "@shared/learningPortal";
import { getTutorialArticles } from "@shared/articleTutorials";
import { getLocalArticles } from "@shared/localArticles";

const apps = [
  {
    title: "Foli",
    shortTitle: "Foli",
    description:
      "A connected creative archive for organizing completed work across portfolios, resumes, presentations, and publishing workflows.",
    image:
      "https://www.brandonptdavis.com/images/site-assets/studio-apps/native-icons/foli.jpg",
    icon: "/images/site-assets/studio-apps/native-icons/foli.jpg",
    href: "https://brandonptdavis.app/apps/foli",
    category: "macOS",
    tone: "In development",
    cta: "View on app site",
    launchMode: "page",
    accentColor: "#151515",
    accentTextColor: "#f7f3eb",
    cardColor: "#151515",
    cardTextColor: "#f7f3eb",
    cardMutedColor: "rgba(247,243,235,0.72)",
  },
  {
    title: "RefRo",
    shortTitle: "RefRo",
    description:
      "A source-aware visual research archive and mood-board studio that keeps context attached to every image.",
    image:
      "https://www.brandonptdavis.com/images/site-assets/studio-apps/native-icons/refro.jpg",
    icon: "/images/site-assets/studio-apps/native-icons/refro.jpg",
    href: "https://brandonptdavis.app/apps/refro",
    category: "macOS",
    tone: "Coming soon",
    cta: "View on app site",
    launchMode: "page",
    accentColor: "#292525",
    accentTextColor: "#f5eee6",
    cardColor: "#292525",
    cardTextColor: "#f5eee6",
    cardMutedColor: "rgba(245,238,230,0.72)",
  },
  {
    title: "ArchMM",
    shortTitle: "ArchMM",
    description:
      "An architectural scale and model-millimeter calculator for iPhone, built for drafting, model making, and 3D printing.",
    image:
      "https://www.brandonptdavis.com/images/site-assets/studio-apps/native-icons/archmm.png",
    icon: "/images/site-assets/studio-apps/native-icons/archmm.png",
    href: "https://brandonptdavis.app/apps/archmm",
    category: "iPhone",
    tone: "Coming soon",
    cta: "View on app site",
    launchMode: "page",
    accentColor: "#403b35",
    accentTextColor: "#f8f1e8",
    cardColor: "#403b35",
    cardTextColor: "#f8f1e8",
    cardMutedColor: "rgba(248,241,232,0.72)",
  },
  {
    title: "PaintHex",
    shortTitle: "PaintHex",
    description:
      "Color matching, Rosco recipes, quantity planning, and paint-shop organization across Mac, iPad, and iPhone.",
    image:
      "https://www.brandonptdavis.com/images/site-assets/studio-apps/native-icons/painthex.png",
    icon: "/images/site-assets/studio-apps/native-icons/painthex.png",
    href: "https://brandonptdavis.app/apps/painthex",
    category: "Mac · iPad · iPhone",
    tone: "In development",
    cta: "View on app site",
    launchMode: "page",
    accentColor: "#233323",
    accentTextColor: "#f1f5e9",
    cardColor: "#233323",
    cardTextColor: "#f1f5e9",
    cardMutedColor: "rgba(241,245,233,0.72)",
  },
] as const;

type StudioTool = (typeof apps)[number];

const studioLinks = [
  {
    title: "Articles",
    href: "/articles",
    category: "Writing",
    imageTitle: "Articles",
    description:
      "Process notes, scenic design practice, drafting decisions, and production-facing writing.",
    cta: "Read articles",
    image:
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-articles-cover.png",
  },
  {
    title: "Scenic Directory",
    href: "/studio/directory",
    category: "Reference",
    imageTitle: "Directory",
    description:
      "A curated shelf of resources, archives, organizations, and research references.",
    cta: "Browse directory",
    image:
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-directory-cover.png",
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

export default function Studio() {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const latestArticles = useMemo(
    () =>
      [...getLocalArticles(), ...getTutorialArticles()]
        .filter(article => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
        .sort(
          (a, b) =>
            getArticleTimestamp(b.publishedAt || b.createdAt) -
            getArticleTimestamp(a.publishedAt || a.createdAt)
        )
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

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={pageStyle}
    >
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
          description:
            "Studio hub for scenic design articles, tools, and references.",
          about:
            "Scenic design education and workflow resources by Brandon PT Davis.",
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
                style={{
                  backgroundColor: homeTheme.controlBg,
                  color: homeTheme.controlInk,
                }}
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
                      style={{
                        backgroundColor: swatch.background,
                        color: swatch.text,
                      }}
                    >
                      <p
                        className="text-[0.86rem] font-black uppercase tracking-[0.04em]"
                        style={{ color: swatch.muted }}
                      >
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
            style={{
              backgroundColor: homeTheme.controlBg,
              color: homeTheme.controlInk,
            }}
          >
            <div className="flex min-h-[24rem] flex-col px-6 py-7 sm:px-8 sm:py-9 md:min-h-[30rem]">
              <p className="text-[0.9rem] font-black uppercase tracking-[0.06em] opacity-70">
                Scenic Directory
              </p>
              <h2
                className="mt-8 max-w-[12ch] text-[clamp(3rem,6vw,6.4rem)] font-black uppercase leading-[0.82] tracking-[0]"
                style={{
                  fontFamily: HOME_DISPLAY_FONT,
                  fontStretch: "condensed",
                }}
              >
                DIRECTORY
              </h2>
              <p className="mt-7 max-w-[34rem] text-[1.02rem] font-medium leading-7 tracking-[0] opacity-72">
                A curated set of theatre organizations, archives, software
                references, suppliers, and production resources for scenic
                design work.
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
          <a
            href="https://brandonptdavis.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group mx-auto grid max-w-[76rem] overflow-hidden rounded-[2rem] p-7 shadow-[0_20px_64px_rgba(17,17,17,0.12)] transition-transform duration-300 hover:-translate-y-1 md:grid-cols-[minmax(0,0.8fr)_minmax(20rem,0.55fr)] md:items-center md:gap-10 md:p-10"
            style={{
              backgroundColor: homeTheme.controlBg,
              color: homeTheme.controlInk,
            }}
            aria-label="Visit the Brandon PT Davis app site"
          >
            <div>
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] opacity-60">
                Brandon PT Davis Apps
              </p>
              <h2 className="mt-5 max-w-[12ch] text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[0.92] tracking-[-0.055em]">
                Creative tools, built for Apple platforms.
              </h2>
              <span className="mt-8 inline-flex items-center gap-2 text-[1rem] font-semibold">
                Visit app site
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-4 md:mt-0 md:gap-5">
              {apps.map(app => (
                <Image
                  key={app.title}
                  src={app.icon}
                  alt={`${app.title} app icon`}
                  width={512}
                  height={512}
                  quality={92}
                  unoptimized
                  sizes="(min-width: 768px) 10rem, 38vw"
                  className="aspect-square w-full rounded-[22%] object-cover shadow-[0_16px_42px_rgba(0,0,0,0.24)] transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ))}
            </div>
          </a>
        </section>
      </main>

      <Footer
        tone="light"
        backgroundColor={homeTheme.footerBg}
        displayTextColor={homeTheme.footerDisplay}
        textColor={homeTheme.footerInk}
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
          className="mt-3 max-w-[12ch] text-[clamp(1.9rem,3.4vw,3rem)] font-bold leading-[0.95] tracking-[-0.045em]"
          style={{ fontFamily: HOME_BODY_FONT }}
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
  if (/\.(?:png|jpe?g|webp)$/i.test(icon)) {
    return (
      <Image
        src={icon}
        alt={`${label} app icon`}
        width={512}
        height={512}
        quality={92}
        sizes="(min-width: 1280px) 20rem, (min-width: 768px) 40vw, 88vw"
        className="h-[78%] w-[78%] rounded-[22%] object-cover shadow-[0_22px_52px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover:scale-[1.025]"
      />
    );
  }

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
            style={{
              backgroundColor: app.accentColor,
              color: app.accentTextColor,
            }}
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
