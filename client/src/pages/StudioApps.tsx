"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
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

type StudioApp = {
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  screenImage?: string;
  href: string;
  category: string;
  tone: string;
  accent: string;
};

const converterTool: StudioApp = {
  title: "Scenic 3D Converter",
  shortTitle: "3D Convert",
  description:
    "A Mac utility for preparing 3D files for scenic workflows, with exports aimed at Vectorworks-friendly USD, USDZ, and 3DM handoffs.",
  image: "/assets/studio-apps/icons/scenic-3d-converter.jpg",
  href: "/studio/apps/scenic-3d-converter",
  category: "Mac Tool",
  tone: "Download",
  accent: "from-[#5f7cff] to-[#9dd6ff]",
};

const allApps: StudioApp[] = [
  {
    title: "Scale Calculator",
    shortTitle: "Scale",
    description:
      "Convert architectural and scenic dimensions into model-scale millimeters for 3D printing, drafting, and physical model making.",
    image: "/assets/studio-apps/icons/scale-calculator.jpg",
    screenImage: "/assets/studio-apps/scale-app-iphone.png",
    href: "/studio/apps/scale-calculator",
    category: "Calculator",
    tone: "Mobile tool",
    accent: "from-[#ffffff] to-[#8f8f8f]",
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
    accent: "from-[#c9ff3d] to-[#58d68d]",
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
    accent: "from-[#ff5f57] to-[#ffd166]",
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
    accent: "from-[#f3eee4] to-[#7a8076]",
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
    accent: "from-[#7c3cff] to-[#ff9bd2]",
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
    <div className="min-h-screen bg-[#080808] text-white">
      <SEO
        title="Studio Apps for Scenic Design"
        description="Production-focused calculators, reference tools, and utilities for scenic drafting, paint, modeling, and research."
        keywords="scenic design calculator, architecture scale converter, paint mixing calculator, Rosco paint, design history timeline, theatrical design tools, scenic design apps, web-based design tools"
        type="website"
        url="https://www.brandonptdavis.com/studio/apps"
      />

      <Header />
      <PublishingTopBar active="apps" tone="dark" />

      <main className="pb-0">
        <section className="bg-[#080808] px-5 pb-14 pt-10 text-white md:px-8 md:pb-20 md:pt-14">
          <AnimatedSection>
            <div className="mx-auto max-w-[88rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,0.58fr)] lg:items-end">
                <div>
                  <p className="section-kicker text-white/38">Studio Apps</p>
                  <h1 className="mt-5 max-w-[11ch] font-sans text-[clamp(4rem,11vw,10.5rem)] font-medium leading-[0.82] tracking-[-0.085em] text-white">
                    Scenic tools for fast studio work.
                  </h1>
                </div>
                <div className="max-w-[34rem] lg:justify-self-end">
                  <p className="text-[clamp(1.08rem,1.55vw,1.4rem)] font-medium leading-[1.35] tracking-[-0.04em] text-white/66">
                    Five mobile studio tools for scale conversion, 3D printing,
                    paint, reference, and research, plus a Mac converter for 3D
                    handoffs when the workflow needs to leave the browser.
                  </p>
                  <div className="mt-7 hidden grid-cols-3 gap-3 text-center sm:grid">
                    {["Scale", "Paint", "Reference"].map(
                      (item) => (
                        <div
                          key={item}
                          className="rounded-[1.25rem] border border-white/10 bg-white/[0.055] px-3 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.24)]"
                        >
                          <p className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-white/44">
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

        <section className="border-y border-white/10 bg-[#111111] px-5 py-12 text-white md:px-8 md:py-16">
          <div className="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-center">
            <AnimatedSection>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-white/52">
                  <Smartphone className="h-4 w-4" />
                  Mobile Studio Tool
                </div>
                <h2 className="mt-7 max-w-[9ch] font-sans text-[clamp(2.8rem,7vw,7.4rem)] font-medium leading-[0.84] tracking-[-0.085em] text-white">
                  Scale checks for the printer bed.
                </h2>
                <p className="mt-7 max-w-xl text-[1rem] leading-7 tracking-[-0.015em] text-white/58">
                  The scale calculator is built for architectural and scenic
                  model making: turn full-size feet and inches into millimeters,
                  then check whether the part fits a common 3D printer bed.
                </p>
                <Link
                  href={featuredApp.href}
                  onClick={(event) => handleStudioAppLink(event, featuredApp)}
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-[0.95rem] font-medium tracking-[-0.02em] text-black transition-opacity hover:opacity-90"
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
                <div className="relative mx-auto aspect-[768/1572] max-w-[24rem] overflow-hidden shadow-[0_34px_120px_rgba(0,0,0,0.68)]">
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

        <section className="bg-[#f4f5f7] px-0 text-[#111111]">
          <div className="grid grid-cols-2 border-b border-black/8 [grid-auto-rows:1fr] md:grid-cols-2 lg:grid-cols-3">
            {appTiles.map((app, index) => (
              <AnimatedSection
                key={app.title}
                className={`h-full ${app === converterTool ? "md:hidden" : ""}`}
                delay={index * 55}
              >
                <Link
                  href={app.href}
                  onClick={(event) => handleStudioAppLink(event, app)}
                  className="group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-none border-b border-r border-black/8 bg-[#f4f5f7] p-0 text-left [border-radius:0] transition-colors hover:bg-white md:min-h-[27rem] md:border-t"
                >
                  <div className="site-media-square relative aspect-square w-full overflow-hidden rounded-none border-b border-black/8 bg-black [border-radius:0]">
                    <Image
                      src={app.image}
                      alt=""
                      fill
                      quality={75}
                      sizes="(max-width: 768px) 32vw, 33vw"
                      className="site-media-square object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-3.5 pt-4 md:p-6 md:pt-7">
                    <p className="text-[0.58rem] font-medium uppercase leading-4 tracking-[0.16em] text-black/38 md:text-[0.72rem] md:tracking-[0.18em] md:text-black/42">
                      {app.category} / {app.tone}
                    </p>
                    <h3 className="mt-2 font-sans text-[clamp(1.38rem,6vw,1.85rem)] font-medium leading-[0.9] tracking-[-0.07em] text-[#111111] md:mt-3 md:max-w-[10ch] md:text-[clamp(2rem,4vw,3.5rem)] md:tracking-[-0.075em]">
                      <span className="md:hidden">{app.shortTitle}</span>
                      <span className="hidden md:inline">{app.title}</span>
                    </h3>
                    <p className="mt-4 hidden max-w-[28rem] text-[0.96rem] leading-6 tracking-[-0.015em] text-black/54 md:block">
                      {app.description}
                    </p>
                    <div className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.82rem] font-medium tracking-[-0.02em] text-black/58 transition-colors group-hover:text-black md:gap-2 md:pt-6 md:text-[0.95rem] md:text-black/62">
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
          <section className="border-t border-white/10 bg-[#080808] px-5 py-14 text-white md:px-8 md:py-18">
            <AnimatedSection>
              <div className="mx-auto grid max-w-[88rem] overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.045] p-0 shadow-[0_34px_120px_rgba(0,0,0,0.38)] md:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] md:items-stretch">
                <div className="site-media-square relative min-h-[18rem] overflow-hidden rounded-none bg-black [border-radius:0] md:min-h-[24rem]">
                  <Image
                    src={converterTool.image}
                    alt={converterTool.title}
                    fill
                    quality={84}
                    sizes="(max-width: 768px) 86vw, 42rem"
                    className="site-media-square object-cover opacity-80"
                  />
                </div>

                <div className="flex flex-col justify-between px-5 py-8 md:px-8 md:py-10">
                  <div>
                    <p className="section-kicker text-white/38">
                      {converterTool.category}
                    </p>
                    <h2 className="mt-5 max-w-[9ch] font-sans text-[clamp(2.9rem,7vw,6.8rem)] font-medium leading-[0.84] tracking-[-0.08em] text-white">
                      {converterTool.title}
                    </h2>
                    <p className="mt-7 max-w-2xl text-[1rem] leading-7 tracking-[-0.015em] text-white/58">
                      {converterTool.description}
                    </p>
                  </div>

                  <Link
                    href={converterTool.href}
                    className="mt-8 inline-flex h-12 w-fit items-center justify-center rounded-full bg-white px-6 text-[0.95rem] font-medium tracking-[-0.02em] text-black transition-opacity hover:opacity-90"
                  >
                    View Mac download
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </section>
        ) : null}

        <section className="bg-[#111111] px-5 py-16 text-white md:px-8 md:py-20">
          <div className="mx-auto grid max-w-[88rem] gap-10 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] md:items-end">
            <AnimatedSection>
              <div>
                <p className="section-kicker text-white/38">Home Screen</p>
                <h2 className="mt-5 max-w-[11ch] font-sans text-[clamp(2.8rem,7vw,6.6rem)] font-medium leading-[0.84] tracking-[-0.08em] text-white">
                  Save the tools you use most.
                </h2>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={80}>
              <div className="grid gap-3 text-[1rem] leading-7 tracking-[-0.015em] text-white/58 sm:grid-cols-3">
                {[
                  "Open a Studio tool in Safari.",
                  "Tap Share, then Add to Home Screen.",
                  "Use it from the shop, classroom, or rehearsal room.",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="border-t border-white/12 pt-4"
                  >
                    <p className="mb-5 text-[0.76rem] font-medium uppercase tracking-[0.18em] text-white/34">
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

      <Footer />

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
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff5f57] text-[#6f1512] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.16)] transition-transform hover:scale-105"
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
