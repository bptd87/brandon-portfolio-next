"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { Link } from "wouter";
import { ArrowRight, ExternalLink, Smartphone, X } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { STUDIO_TOOL_BASE } from "@/hooks/useStudioToolTheme";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";

type StudioApp = {
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  icon: string;
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
  image:
    "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scenic-3d-converter-card-2026.jpg",
  icon: "/images/site-assets/studio-apps/svg/3d-file-convert.svg",
  href: "/studio/apps/scenic-3d-converter",
  category: "Mac Tool",
  tone: "Download",
  accentColor: "#5f88a8",
  accentTextColor: "#ffffff",
  cardColor: "#5f88a8",
  cardTextColor: "#ffffff",
  cardMutedColor: "rgba(255,255,255,0.74)",
};

const refroApp: StudioApp = {
  title: "RefRo",
  shortTitle: "RefRo",
  description:
    "A source-aware visual research archive and mood-board studio for Mac, built to keep the idea attached to every image.",
  image: "/assets/studio-apps/refro/04-presentation-editor.jpg",
  icon: "/assets/studio-apps/refro/icon.png",
  href: "/studio/apps/refro",
  category: "Mac App",
  tone: "Coming soon",
  accentColor: "#2c2c2c",
  accentTextColor: "#f5f0e7",
  cardColor: "#2c2c2c",
  cardTextColor: "#f5f0e7",
  cardMutedColor: "rgba(245,240,231,0.72)",
};

const allApps: StudioApp[] = [
  {
    title: "Scale Calculator",
    shortTitle: "Scale",
    description:
      "Convert architectural and scenic dimensions into model-scale millimeters for 3D printing, drafting, and physical model making.",
    image:
      "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scale-calculator-card-2026.jpg",
    icon: "/images/site-assets/studio-apps/svg/scale-calculator.svg",
    screenImage:
      "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/scale-app-iphone.webp",
    href: "/studio/apps/scale-calculator",
    category: "Calculator",
    tone: "Mobile tool",
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
    image:
      "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/dimension-reference-card-2026.jpg",
    icon: "/images/site-assets/studio-apps/svg/dimensions.svg",
    href: "/studio/apps/dimension-reference",
    category: "Reference",
    tone: "Shop reference",
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
    image:
      "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/rosco-paint-calculator-card-2026.jpg",
    icon: "/images/site-assets/studio-apps/svg/rosco-paint.svg",
    href: "/studio/apps/rosco-paint-calculator",
    category: "Calculator",
    tone: "Paint shop",
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
    image:
      "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/commercial-paint-matcher-card-2026.jpg",
    icon: "/images/site-assets/studio-apps/svg/commercial-paint.svg",
    href: "/studio/apps/commercial-paint-matcher",
    category: "Matcher",
    tone: "Paint library",
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
    image:
      "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/design-history-timeline-card-2026.jpg",
    icon: "/images/site-assets/studio-apps/svg/timeline.svg",
    href: "/studio/apps/design-history-timeline",
    category: "Reference",
    tone: "Research",
    accentColor: "#dc30ff",
    accentTextColor: "#ffe3ff",
    cardColor: "#dc30ff",
    cardTextColor: "#ffffff",
    cardMutedColor: "rgba(255,255,255,0.74)",
  },
];

function getStudioAppCardStyle(app: StudioApp) {
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

export default function StudioApps() {
  const apps = allApps;
  const appTiles = apps;
  const [activeApp, setActiveApp] = useState<StudioApp | null>(null);
  const [isAppClosing, setIsAppClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const featuredApp = useMemo(
    () =>
      apps.find(app => app.href === "/studio/apps/scale-calculator") ?? apps[0],
    [apps]
  );
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
  const macFeatureStyle = {
    "--studio-app-card": homeTheme.controlBg,
    "--studio-app-card-text": homeTheme.controlInk,
    "--studio-app-card-muted": `color-mix(in srgb, ${homeTheme.controlInk} 72%, transparent)`,
    "--studio-app-accent": homeTheme.controlInk,
    "--studio-app-accent-text": homeTheme.controlBg,
    "--studio-app-icon-color": `color-mix(in srgb, ${homeTheme.controlInk} 76%, transparent)`,
    borderColor: homeTheme.ghost,
  } as CSSProperties;
  const studioFrameStyle = {
    "--studio-tool-bg": STUDIO_TOOL_BASE.bg,
    "--studio-tool-ink": STUDIO_TOOL_BASE.ink,
    "--studio-tool-muted": STUDIO_TOOL_BASE.muted,
    "--studio-tool-border": STUDIO_TOOL_BASE.border,
    "--studio-tool-panel": STUDIO_TOOL_BASE.panel,
    "--studio-tool-panel-strong": STUDIO_TOOL_BASE.panelStrong,
    "--studio-tool-control-bg":
      activeApp?.accentColor ?? STUDIO_TOOL_BASE.controlBg,
    "--studio-tool-control-ink":
      activeApp?.accentTextColor ?? STUDIO_TOOL_BASE.controlInk,
    backgroundColor: "rgba(44, 44, 44, 0.62)",
    color: STUDIO_TOOL_BASE.ink,
    fontFamily: HOME_BODY_FONT,
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

  function handleStudioAppLink(
    event: MouseEvent<HTMLAnchorElement>,
    app: StudioApp
  ) {
    if (app.href === "/studio/apps/refro") return;

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
    const originalBodyOverscrollBehavior =
      document.body.style.overscrollBehavior;

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
    <div
      className="min-h-screen transition-colors duration-500"
      style={pageStyle}
    >
      <SEO
        title="Studio Apps for Scenic Design"
        description="Production-focused calculators, reference tools, and utilities for scenic drafting, paint, modeling, and research."
        keywords="scenic design calculator, architecture scale converter, paint mixing calculator, Rosco paint, design history timeline, theatrical design tools, scenic design apps, web-based design tools"
        type="website"
        url="https://www.brandonptdavis.com/studio/apps"
      />

      <Header />
      <PublishingTopBar active="apps" tone="dark" />

      <main
        className="pb-0"
        style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}
      >
        <section className="px-[clamp(1.5rem,5vw,6rem)] pb-14 pt-28 md:pb-20 md:pt-32">
          <AnimatedSection>
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,0.58fr)] lg:items-end">
                <div>
                  <p
                    className="text-[0.8rem] font-black uppercase tracking-[0.16em]"
                    style={mutedStyle}
                  >
                    Studio Apps
                  </p>
                  <h1
                    className="mt-5 max-w-[12ch] text-[clamp(3.2rem,7.2vw,7rem)] font-black uppercase leading-[0.86] tracking-[0]"
                    style={displayStyle}
                  >
                    Scenic tools for fast studio work.
                  </h1>
                </div>
                <div className="max-w-[34rem] lg:justify-self-end">
                  <p
                    className="text-[clamp(1.05rem,1.55vw,1.35rem)] font-medium leading-[1.35] tracking-[0]"
                    style={mutedStyle}
                  >
                    Mobile studio tools for scale, paint, and reference, plus
                    purpose-built Mac apps for visual research and 3D handoffs.
                  </p>
                  <div className="mt-7 hidden grid-cols-3 gap-3 text-center sm:grid">
                    {["Scale", "Paint", "Reference"].map(item => (
                      <div
                        key={item}
                        className="rounded-[1.25rem] px-3 py-4 shadow-[0_18px_48px_rgba(17,17,17,0.08)]"
                        style={softPanelStyle}
                      >
                        <p
                          className="text-[0.72rem] font-black uppercase tracking-[0.14em]"
                          style={mutedStyle}
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <MacAppFeatureCard
          app={refroApp}
          actionLabel="View RefRo"
          style={macFeatureStyle}
        />

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-12 md:py-16">
          <div
            className="mx-auto grid max-w-[76rem] gap-10 rounded-[2rem] p-6 shadow-[0_18px_54px_rgba(17,17,17,0.08)] md:p-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-center"
            style={softPanelStyle}
          >
            <AnimatedSection>
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.78rem] font-black uppercase tracking-[0.16em]"
                  style={{
                    backgroundColor: homeTheme.controlBg,
                    color: homeTheme.controlInk,
                  }}
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile Studio Tool
                </div>
                <h2
                  className="mt-7 max-w-[10ch] text-[clamp(2.6rem,5.6vw,5.6rem)] font-black uppercase leading-[0.88] tracking-[0]"
                  style={displayStyle}
                >
                  Scale checks for the printer bed.
                </h2>
                <p
                  className="mt-7 max-w-xl text-[1rem] font-medium leading-7 tracking-[0]"
                  style={mutedStyle}
                >
                  The scale calculator is built for architectural and scenic
                  model making: turn full-size feet and inches into millimeters,
                  then check whether the part fits a common 3D printer bed.
                </p>
                <Link
                  href={featuredApp.href}
                  onClick={event => handleStudioAppLink(event, featuredApp)}
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
                onClick={event => handleStudioAppLink(event, featuredApp)}
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
                className="h-full"
                delay={index * 55}
              >
                <Link
                  href={app.href}
                  onClick={event => handleStudioAppLink(event, app)}
                  className="group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.5rem] border bg-[var(--studio-app-card)] p-3.5 text-left text-[var(--studio-app-card-text)] shadow-[0_18px_54px_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-1 md:min-h-[22rem] md:p-6"
                  style={getStudioAppCardStyle(app)}
                >
                  <div>
                    <p className="flex flex-wrap items-center gap-2 text-[0.58rem] font-medium uppercase leading-4 tracking-[0.16em] text-[var(--studio-app-card-muted)] md:text-[0.72rem] md:tracking-[0.18em]">
                      <span className="rounded-full bg-[var(--studio-app-accent)] px-2 py-1 text-[var(--studio-app-accent-text)]">
                        {app.category}
                      </span>
                      <span>{app.tone}</span>
                    </p>
                    <h3
                      className="mt-2 max-w-[9ch] text-[clamp(1.25rem,5vw,1.72rem)] font-black uppercase leading-[0.95] tracking-[0] md:mt-3 md:max-w-[10ch] md:text-[clamp(1.9rem,3.4vw,3rem)]"
                      style={{ fontFamily: HOME_DISPLAY_FONT }}
                    >
                      <span className="md:hidden">{app.shortTitle}</span>
                      <span className="hidden md:inline">{app.title}</span>
                    </h3>
                  </div>

                  <StudioAppIcon app={app} />

                  <p className="mt-3 max-w-[28rem] text-[0.8rem] leading-5 tracking-[-0.01em] text-[var(--studio-app-card-muted)] md:mt-4 md:text-[0.92rem] md:leading-6 md:tracking-[-0.015em]">
                    {app.description}
                  </p>
                  <div className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.82rem] font-medium tracking-[-0.02em] text-[var(--studio-app-card-text)] md:gap-2 md:pt-6 md:text-[0.95rem]">
                    Open tool
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <MacAppFeatureCard
          app={converterTool}
          actionLabel="View Mac download"
          style={macFeatureStyle}
        />

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-16 md:py-20">
          <div className="mx-auto grid max-w-[76rem] gap-10 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] md:items-end">
            <AnimatedSection>
              <div>
                <p
                  className="text-[0.8rem] font-black uppercase tracking-[0.16em]"
                  style={mutedStyle}
                >
                  Home Screen
                </p>
                <h2
                  className="mt-5 max-w-[12ch] text-[clamp(2.5rem,5.8vw,5.6rem)] font-black uppercase leading-[0.88] tracking-[0]"
                  style={displayStyle}
                >
                  Save the tools you use most.
                </h2>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={80}>
              <div
                className="grid gap-3 text-[1rem] font-medium leading-7 tracking-[0] sm:grid-cols-3"
                style={mutedStyle}
              >
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
                    <p
                      className="mb-5 text-[0.76rem] font-black uppercase tracking-[0.18em]"
                      style={mutedStyle}
                    >
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
        style={studioFrameStyle}
      />
    </div>
  );
}

function MacAppFeatureCard({
  app,
  actionLabel,
  style,
}: {
  app: StudioApp;
  actionLabel: string;
  style: CSSProperties;
}) {
  return (
    <section className="px-[clamp(1.5rem,5vw,6rem)] py-10 md:py-14">
      <AnimatedSection>
        <Link
          href={app.href}
          className="group mx-auto grid max-w-[76rem] overflow-hidden rounded-[2rem] border bg-[var(--studio-app-card)] p-6 text-[var(--studio-app-card-text)] shadow-[0_34px_120px_rgba(17,17,17,0.16)] transition-transform hover:-translate-y-1 md:grid-cols-[minmax(0,0.78fr)_minmax(16rem,0.62fr)] md:items-center md:gap-8 md:p-8"
          style={style}
        >
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 text-[0.72rem] font-medium uppercase leading-4 tracking-[0.18em] text-[var(--studio-app-card-muted)]">
              <span className="rounded-full bg-[var(--studio-app-accent)] px-2 py-1 text-[var(--studio-app-accent-text)]">
                {app.category}
              </span>
              <span>{app.tone}</span>
            </p>
            <h2
              className="mt-4 max-w-[10ch] text-[clamp(2.6rem,5.2vw,5.2rem)] font-black uppercase leading-[0.88] tracking-[0]"
              style={{ fontFamily: HOME_DISPLAY_FONT }}
            >
              {app.title}
            </h2>
            <p className="mt-6 max-w-2xl text-[1rem] font-medium leading-7 tracking-[0] text-[var(--studio-app-card-muted)]">
              {app.description}
            </p>
            <div className="mt-7 inline-flex items-center gap-2 text-[0.95rem] font-medium tracking-[-0.02em] text-[var(--studio-app-card-text)]">
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <div className="relative mt-6 flex h-[clamp(11rem,21vw,17rem)] items-center justify-center overflow-hidden text-[var(--studio-app-icon-color)] md:mt-0">
            <StudioAppIconMark icon={app.icon} label={app.title} />
          </div>
        </Link>
      </AnimatedSection>
    </section>
  );
}

function StudioAppIcon({ app }: { app: StudioApp }) {
  return (
    <div className="site-media-square relative my-3 flex h-[7.5rem] w-full items-center justify-center overflow-hidden text-[var(--studio-app-icon-color)] md:my-4 md:h-[10rem]">
      <StudioAppIconMark icon={app.icon} label={app.title} />
    </div>
  );
}

function StudioAppIconMark({ icon, label }: { icon: string; label: string }) {
  if (icon.endsWith(".png")) {
    return (
      <Image
        src={icon}
        alt={`${label} icon`}
        width={512}
        height={512}
        className="h-[74%] w-[74%] rounded-[22%] object-cover shadow-[0_22px_50px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-[1.04] md:h-[76%] md:w-[76%]"
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
      className="block h-[74%] w-[74%] bg-current drop-shadow-[0_0_1px_currentColor] transition-transform duration-300 group-hover:scale-[1.04] md:h-[76%] md:w-[76%]"
      style={maskStyle}
    />
  );
}

function StudioAppScreen({
  app,
  isClosing,
  onBack,
  style,
}: {
  app: StudioApp | null;
  isClosing: boolean;
  onBack: () => void;
  style: CSSProperties;
}) {
  if (!app) return null;

  const frameSrc = `${app.href}?studioFrame=1`;

  return (
    <div
      className="studio-app-overlay fixed inset-0 z-[120] flex flex-col overflow-hidden text-black backdrop-blur-sm md:grid md:place-items-center md:p-6"
      style={style}
      data-state={isClosing ? "closing" : "open"}
      role="dialog"
      aria-modal="true"
      aria-label={`${app.title} app screen`}
    >
      <div className="studio-app-shell studio-tool-page flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f3eee4] md:h-[min(54rem,88vh)] md:w-full md:max-w-[28rem] md:flex-none md:rounded-[2.4rem] md:border md:border-black/12 md:shadow-[0_34px_140px_rgba(0,0,0,0.42)]">
        <div className="studio-app-frame-topbar grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-black/10 bg-[#fbf7ef] px-4 shadow-[inset_0_1px_rgba(255,255,255,0.68)]">
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.16)] transition-transform hover:scale-105"
            style={{
              backgroundColor: app.accentColor,
              color: app.accentTextColor,
            }}
            aria-label="Back to Studio Apps"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="text-center">
            <p className="studio-app-frame-title text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-black/54">
              {app.shortTitle}
            </p>
          </div>
          <a
            href={app.href}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] transition-transform hover:scale-105"
            style={{
              backgroundColor: "var(--studio-tool-control-bg)",
              color: "var(--studio-tool-control-ink)",
            }}
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
