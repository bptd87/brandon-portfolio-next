"use client";

import Image from "next/image";
import { type CSSProperties, type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { useIsDesktopViewport } from "@/hooks/useIsDesktopViewport";
import { Link } from "wouter";
import {
  ArrowRight,
  ExternalLink,
  Smartphone,
  X,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { HOME_BODY_FONT, HOME_DISPLAY_FONT, useHomeDocumentTheme, useHomeTheme } from "@/lib/homeTheme";

type StudioApp = {
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  screenImage?: string;
  href: string;
  category: string;
  tone: string;
  accentColor: string;
  accentTextColor: string;
  cardColor: string;
  cardTextColor: string;
  cardMutedColor: string;
};

const converterTool: StudioApp = {
  title: "Scenic 3D Converter",
  shortTitle: "3D Convert",
  description:
    "A Mac utility for preparing 3D files for scenic workflows, with exports aimed at Vectorworks-friendly USD, USDZ, and 3DM handoffs.",
  image: "/assets/studio-apps/icons/scenic-3d-converter-card-2026.jpg",
  href: "/studio/apps/scenic-3d-converter",
  category: "Mac Tool",
  tone: "Download",
  accentColor: "#5f88a8",
  accentTextColor: "#ffffff",
  cardColor: "#5f88a8",
  cardTextColor: "#ffffff",
  cardMutedColor: "rgba(255,255,255,0.74)",
};

const allApps: StudioApp[] = [
  {
    title: "Scale Calculator",
    shortTitle: "Scale",
    description:
      "Convert architectural and scenic dimensions into model-scale millimeters for 3D printing, drafting, and physical model making.",
    image: "/assets/studio-apps/icons/scale-calculator-card-2026.jpg",
    screenImage: "/assets/studio-apps/scale-app-iphone.png",
    href: "/studio/apps/scale-calculator",
    category: "Calculator",
    tone: "Mobile tool",
    accentColor: "#d06934",
    accentTextColor: "#17120b",
    cardColor: "#b7653f",
    cardTextColor: "#ffffff",
    cardMutedColor: "rgba(255,255,255,0.74)",
  },
  {
    title: "Dimension Reference",
    shortTitle: "Dims",
    description:
      "Quick reference for standard dimensions and unit conversions in scenic and production design.",
    image: "/assets/studio-apps/icons/dimension-reference-card-2026.jpg",
    href: "/studio/apps/dimension-reference",
    category: "Reference",
    tone: "Shop reference",
    accentColor: "#c9891d",
    accentTextColor: "#17120b",
    cardColor: "#c98f24",
    cardTextColor: "#17120b",
    cardMutedColor: "rgba(23,18,11,0.68)",
  },
  {
    title: "Rosco Paint Calculator",
    shortTitle: "Rosco",
    description:
      "Professional scenic paint mixing calculator for Rosco Off-Broadway paints and color matching workflows.",
    image: "/assets/studio-apps/icons/rosco-paint-calculator-card-2026.jpg",
    href: "/studio/apps/rosco-paint-calculator",
    category: "Calculator",
    tone: "Paint shop",
    accentColor: "#3f5d62",
    accentTextColor: "#ffffff",
    cardColor: "#be6241",
    cardTextColor: "#ffffff",
    cardMutedColor: "rgba(255,255,255,0.74)",
  },
  {
    title: "Commercial Paint Matcher",
    shortTitle: "Paint Match",
    description:
      "Match sampled colors against Sherwin-Williams, Benjamin Moore, and BEHR libraries with brand filters and copyable color data.",
    image: "/assets/studio-apps/icons/commercial-paint-matcher-card-2026.jpg",
    href: "/studio/apps/commercial-paint-matcher",
    category: "Matcher",
    tone: "Paint library",
    accentColor: "#758967",
    accentTextColor: "#ffffff",
    cardColor: "#758967",
    cardTextColor: "#ffffff",
    cardMutedColor: "rgba(255,255,255,0.74)",
  },
  {
    title: "Design History Timeline",
    shortTitle: "History",
    description:
      "Explore major design periods with visual references, color palettes, and historical context.",
    image: "/assets/studio-apps/icons/design-history-timeline-card-2026.jpg",
    href: "/studio/apps/design-history-timeline",
    category: "Reference",
    tone: "Research",
    accentColor: "#8a5432",
    accentTextColor: "#ffffff",
    cardColor: "#8a5432",
    cardTextColor: "#ffffff",
    cardMutedColor: "rgba(255,255,255,0.74)",
  },
];

export default function StudioApps() {
  const apps = allApps;
  const isDesktopViewport = useIsDesktopViewport();
  const appTiles = isDesktopViewport ? apps : [...apps, converterTool];
  const [activeApp, setActiveApp] = useState<StudioApp | null>(null);
  const [isAppClosing, setIsAppClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const featuredApp = useMemo(() => apps[0], [apps]);
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const pageStyle = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;
  const displayStyle = {
    color: homeTheme.ink,
    fontFamily: HOME_DISPLAY_FONT,
  } as CSSProperties;
  const mutedStyle = { color: homeTheme.muted } as CSSProperties;
  const softPanelStyle = {
    backgroundColor: homeTheme.accentSoft,
    color: homeTheme.ink,
  } as CSSProperties;

  function openStudioApp(app: StudioApp) {
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

  function handleStudioAppLink(event: MouseEvent<HTMLAnchorElement>, app: StudioApp) {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(max-width: 767px)").matches
    ) {
      event.preventDefault();
      openStudioApp(app);
    }
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
        title="Studio Apps for Scenic Design"
        description="Production-focused calculators, reference tools, and utilities for scenic drafting, paint, modeling, and research."
        keywords="scenic design calculator, architecture scale converter, paint mixing calculator, Rosco paint, design history timeline, theatrical design tools, scenic design apps, web-based design tools"
        type="website"
        url="https://www.brandonptdavis.com/studio/apps"
      />

      <Header />
      <PublishingTopBar active="apps" tone="dark" />

      <main className="pb-0" style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}>
        <section className="px-[clamp(1.5rem,5vw,6rem)] pb-14 pt-28 md:pb-20 md:pt-32">
          <AnimatedSection>
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,0.58fr)] lg:items-end">
                <div>
                  <p className="text-[0.8rem] font-black uppercase tracking-[0.16em]" style={mutedStyle}>Studio Apps</p>
                  <h1 className="mt-5 max-w-[12ch] text-[clamp(3.2rem,7.2vw,7rem)] font-black uppercase leading-[0.86] tracking-[0]" style={displayStyle}>
                    Scenic tools for fast studio work.
                  </h1>
                </div>
                <div className="max-w-[34rem] lg:justify-self-end">
                  <p className="text-[clamp(1.05rem,1.55vw,1.35rem)] font-medium leading-[1.35] tracking-[0]" style={mutedStyle}>
                    Five mobile studio tools for scale conversion, 3D printing,
                    paint, reference, and research, plus a Mac converter for 3D
                    handoffs when the workflow needs to leave the browser.
                  </p>
                  <div className="mt-7 hidden grid-cols-3 gap-3 text-center sm:grid">
                    {["Scale", "Paint", "Reference"].map(
                      (item) => (
                        <div
                          key={item}
                          className="rounded-[1.25rem] px-3 py-4 shadow-[0_18px_48px_rgba(17,17,17,0.08)]"
                          style={softPanelStyle}
                        >
                          <p className="text-[0.72rem] font-black uppercase tracking-[0.14em]" style={mutedStyle}>
                            {item}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-12 md:py-16">
          <div className="mx-auto grid max-w-[76rem] gap-10 rounded-[2rem] p-6 shadow-[0_18px_54px_rgba(17,17,17,0.08)] md:p-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-center" style={softPanelStyle}>
            <AnimatedSection>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.78rem] font-black uppercase tracking-[0.16em]" style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}>
                  <Smartphone className="h-4 w-4" />
                  Mobile Studio Tool
                </div>
                <h2 className="mt-7 max-w-[10ch] text-[clamp(2.6rem,5.6vw,5.6rem)] font-black uppercase leading-[0.88] tracking-[0]" style={displayStyle}>
                  Scale checks for the printer bed.
                </h2>
                <p className="mt-7 max-w-xl text-[1rem] font-medium leading-7 tracking-[0]" style={mutedStyle}>
                  The scale calculator is built for architectural and scenic
                  model making: turn full-size feet and inches into millimeters,
                  then check whether the part fits a common 3D printer bed.
                </p>
                <Link
                  href={featuredApp.href}
                  onClick={(event) => handleStudioAppLink(event, featuredApp)}
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full px-6 text-[0.95rem] font-medium tracking-[-0.02em] text-black transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: featuredApp.accentColor,
                    color: featuredApp.accentTextColor,
                  }}
                >
                  Launch {featuredApp.shortTitle}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={90}>
              <Link
                href={featuredApp.href}
                onClick={(event) => handleStudioAppLink(event, featuredApp)}
                className="group mx-auto block w-full max-w-[28rem] text-left"
              >
                <div className="relative mx-auto aspect-[763/1574] max-w-[25rem] drop-shadow-[0_34px_80px_rgba(17,17,17,0.24)]">
                  <Image
                    src={featuredApp.screenImage ?? featuredApp.image}
                    alt={`${featuredApp.title} screen`}
                    fill
                    quality={80}
                    sizes="(max-width: 768px) 68vw, 24rem"
                    className="object-contain"
                  />
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-12">
          <div className="mx-auto grid max-w-[76rem] grid-cols-2 gap-5 [grid-auto-rows:1fr] md:grid-cols-2 lg:grid-cols-3">
            {appTiles.map((app, index) => (
              <AnimatedSection
                key={app.title}
                className={`h-full ${app === converterTool ? "md:hidden" : ""}`}
                delay={index * 55}
              >
                <Link
                  href={app.href}
                  onClick={(event) => handleStudioAppLink(event, app)}
                  className="group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.5rem] p-0 text-left shadow-[0_18px_54px_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-1 md:min-h-[27rem]"
                  style={
                    {
                      "--studio-app-card": app.cardColor,
                      "--studio-app-card-text": app.cardTextColor,
                      "--studio-app-card-muted": app.cardMutedColor,
                    } as CSSProperties
                  }
                >
                  <div className="site-media-square relative aspect-square w-full overflow-hidden bg-black">
                    <Image
                      src={app.image}
                      alt=""
                      fill
                      quality={75}
                      sizes="(max-width: 768px) 32vw, 33vw"
                      className="site-media-square object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col bg-[var(--studio-app-card)] p-3.5 pt-4 text-[var(--studio-app-card-text)] md:p-6 md:pt-7">
                    <p className="text-[0.58rem] font-medium uppercase leading-4 tracking-[0.16em] text-[var(--studio-app-card-muted)] md:text-[0.72rem] md:tracking-[0.18em]">
                      {app.category} / {app.tone}
                    </p>
                    <h3
                      className="mt-2 text-[clamp(1.25rem,5vw,1.72rem)] font-black uppercase leading-[0.95] tracking-[0] md:mt-3 md:max-w-[10ch] md:text-[clamp(1.9rem,3.4vw,3rem)]"
                      style={{ fontFamily: HOME_DISPLAY_FONT }}
                    >
                      <span className="md:hidden">{app.shortTitle}</span>
                      <span className="hidden md:inline">{app.title}</span>
                    </h3>
                    <p className="mt-4 hidden max-w-[28rem] text-[0.96rem] leading-6 tracking-[-0.015em] text-[var(--studio-app-card-muted)] md:block">
                      {app.description}
                    </p>
                    <div className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.82rem] font-medium tracking-[-0.02em] md:gap-2 md:pt-6 md:text-[0.95rem]">
                      Open tool
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {isDesktopViewport ? (
          <section className="px-[clamp(1.5rem,5vw,6rem)] py-14 md:py-18">
            <AnimatedSection>
              <div className="mx-auto grid max-w-[76rem] overflow-hidden rounded-[2rem] p-0 shadow-[0_34px_120px_rgba(17,17,17,0.16)] md:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] md:items-stretch" style={softPanelStyle}>
                <div className="site-media-square relative min-h-[18rem] overflow-hidden bg-black md:min-h-[24rem]">
                  <Image
                    src={converterTool.image}
                    alt={converterTool.title}
                    fill
                    quality={84}
                    sizes="(max-width: 768px) 86vw, 42rem"
                    className="site-media-square object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between px-5 py-8 md:px-8 md:py-10">
                  <div>
                    <p className="text-[0.8rem] font-black uppercase tracking-[0.16em]" style={mutedStyle}>
                      {converterTool.category}
                    </p>
                    <h2 className="mt-5 max-w-[10ch] text-[clamp(2.6rem,5.8vw,5.7rem)] font-black uppercase leading-[0.88] tracking-[0]" style={displayStyle}>
                      {converterTool.title}
                    </h2>
                    <p className="mt-7 max-w-2xl text-[1rem] font-medium leading-7 tracking-[0]" style={mutedStyle}>
                      {converterTool.description}
                    </p>
                  </div>

                  <Link
                    href={converterTool.href}
                    className="mt-8 inline-flex h-12 w-fit items-center justify-center rounded-full px-6 text-[0.95rem] font-black tracking-[0] transition-opacity hover:opacity-90"
                    style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
                  >
                    View Mac download
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </section>
        ) : null}

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-16 md:py-20">
          <div className="mx-auto grid max-w-[76rem] gap-10 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] md:items-end">
            <AnimatedSection>
              <div>
                <p className="text-[0.8rem] font-black uppercase tracking-[0.16em]" style={mutedStyle}>Home Screen</p>
                <h2 className="mt-5 max-w-[12ch] text-[clamp(2.5rem,5.8vw,5.6rem)] font-black uppercase leading-[0.88] tracking-[0]" style={displayStyle}>
                  Save the tools you use most.
                </h2>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={80}>
              <div className="grid gap-3 text-[1rem] font-medium leading-7 tracking-[0] sm:grid-cols-3" style={mutedStyle}>
                {[
                  "Open a Studio tool in Safari.",
                  "Tap Share, then Add to Home Screen.",
                  "Use it from the shop, classroom, or rehearsal room.",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="rounded-[1.25rem] p-5"
                    style={softPanelStyle}
                  >
                    <p className="mb-5 text-[0.76rem] font-black uppercase tracking-[0.18em]" style={mutedStyle}>
                      0{index + 1}
                    </p>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
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

function StudioAppScreen({
  app,
  isClosing,
  onBack,
}: {
  app: StudioApp | null;
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
            aria-label="Back to Studio Apps"
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
