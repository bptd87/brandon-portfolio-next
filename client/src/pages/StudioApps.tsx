"use client";

import Image from "next/image";
import { type CSSProperties } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { Link } from "wouter";
import { Apple, ArrowRight, ExternalLink } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import {
  HOME_BODY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";

type StudioApp = {
  title: string;
  description: string;
  icon: string;
  href: string;
  category: string;
  tone: string;
};

type AppleApp = {
  title: string;
  description: string;
  icon: string;
  href: string;
  platform: string;
  status: string;
};

const converterTool: StudioApp = {
  title: "Scenic 3D Converter",
  description:
    "A Mac utility for preparing 3D files for scenic workflows, with exports aimed at Vectorworks-friendly USD, USDZ, and 3DM handoffs.",
  icon: "/images/site-assets/studio-apps/svg/3d-file-convert.svg",
  href: "/studio/apps/scenic-3d-converter",
  category: "Mac Tool",
  tone: "Download",
};

const appleApps: AppleApp[] = [
  {
    title: "Foli",
    description:
      "A connected creative archive for organizing completed work and reusing it across portfolios, resumes, presentations, and publishing workflows.",
    icon: "/images/site-assets/studio-apps/native-icons/foli.jpg",
    href: "https://brandonptdavis.app/apps/foli",
    platform: "macOS",
    status: "In development",
  },
  {
    title: "RefRo",
    description:
      "A source-aware visual research archive and mood-board studio that keeps the context attached to every image.",
    icon: "/images/site-assets/studio-apps/native-icons/refro.jpg",
    href: "https://brandonptdavis.app/apps/refro",
    platform: "macOS",
    status: "Coming soon",
  },
  {
    title: "ArchMM",
    description:
      "A focused architectural scale and model-millimeter calculator for iPhone, built for drafting, model making, and 3D printing.",
    icon: "/images/site-assets/studio-apps/native-icons/archmm.png",
    href: "https://brandonptdavis.app/apps/archmm",
    platform: "iPhone",
    status: "Coming soon",
  },
  {
    title: "PaintHex",
    description:
      "Color matching, Rosco recipes, quantity planning, and paint-shop organization across Mac, iPad, and iPhone.",
    icon: "/images/site-assets/studio-apps/native-icons/painthex.png",
    href: "https://brandonptdavis.app/apps/painthex",
    platform: "Mac · iPad · iPhone",
    status: "In development",
  },
];

export default function StudioApps() {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const pageStyle = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;
  const mutedStyle = { color: homeTheme.muted } as CSSProperties;
  const appleAppCardStyle = {
    backgroundColor: homeTheme.accentSoft,
    borderColor: homeTheme.ghost,
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
                    className="mt-5 max-w-[10ch] text-[clamp(3.2rem,7vw,6.6rem)] font-bold leading-[0.9] tracking-[-0.06em]"
                    style={{ color: homeTheme.ink, fontFamily: HOME_BODY_FONT }}
                  >
                    Studio tools.
                  </h1>
                </div>
                <div className="max-w-[34rem] lg:justify-self-end">
                  <p
                    className="text-[clamp(1.05rem,1.55vw,1.35rem)] font-medium leading-[1.35] tracking-[0]"
                    style={mutedStyle}
                  >
                    Native tools for creative work across Mac, iPhone, and iPad.
                    Explore each app, follow its development, and find new
                    releases on the dedicated app site.
                  </p>
                  <a
                    href="https://brandonptdavis.app"
                    className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-[0.92rem] font-semibold transition-transform hover:-translate-y-0.5"
                    style={{
                      backgroundColor: homeTheme.controlBg,
                      color: homeTheme.controlInk,
                    }}
                    aria-label="Explore the Brandon PT Davis app site"
                  >
                    Explore the app site
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <p
                    className="mt-4 max-w-[30rem] text-[0.8rem] font-medium leading-5"
                    style={mutedStyle}
                  >
                    Foli, RefRo, ArchMM, PaintHex, and new native releases live
                    at brandonptdavis.app.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-10 md:py-14">
          <div className="mx-auto max-w-[76rem]">
            <AnimatedSection>
              <div
                className="grid gap-6 border-t pt-10 md:grid-cols-[minmax(0,0.8fr)_minmax(18rem,0.62fr)] md:items-end md:pt-14"
                style={{ borderColor: homeTheme.ghost }}
              >
                <div>
                  <p
                    className="flex items-center gap-2 text-[0.8rem] font-black uppercase tracking-[0.16em]"
                    style={mutedStyle}
                  >
                    <Apple
                      className="h-[1.05rem] w-[1.05rem]"
                      aria-hidden="true"
                    />
                    Apple Apps
                  </p>
                  <h2
                    className="mt-4 max-w-[11ch] text-[clamp(2.4rem,5vw,4.4rem)] font-bold leading-[0.94] tracking-[-0.055em]"
                    style={{ color: homeTheme.ink, fontFamily: HOME_BODY_FONT }}
                  >
                    Designed for Apple.
                  </h2>
                </div>
                <p
                  className="max-w-[34rem] text-[0.98rem] font-medium leading-7 md:justify-self-end"
                  style={mutedStyle}
                >
                  Product pages, platform plans, and release updates live at
                  brandonptdavis.app. The browser tools remain available by
                  their existing direct URLs.
                </p>
              </div>
            </AnimatedSection>

            <div className="mt-8 grid grid-cols-1 gap-4 [grid-auto-rows:1fr] sm:grid-cols-2">
              {appleApps.map((app, index) => (
                <AnimatedSection
                  key={app.title}
                  className="h-full"
                  delay={index * 55}
                >
                  <AppleAppCard app={app} style={appleAppCardStyle} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <MacAppFeatureCard
          app={converterTool}
          actionLabel="View Mac download"
          style={macFeatureStyle}
        />
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

function AppleAppCard({ app, style }: { app: AppleApp; style: CSSProperties }) {
  return (
    <a
      href={app.href}
      className="group grid h-full min-h-[15rem] grid-cols-[5.5rem_minmax(0,1fr)_auto] items-start gap-5 rounded-[1.5rem] border p-5 shadow-[0_18px_52px_rgba(17,17,17,0.06)] transition-transform hover:-translate-y-1 md:min-h-[17rem] md:grid-cols-[7rem_minmax(0,1fr)_auto] md:gap-6 md:p-7"
      style={style}
      aria-label={`Explore ${app.title} on Brandon PT Davis Apps`}
    >
      <Image
        src={app.icon}
        alt={`${app.title} app icon`}
        width={512}
        height={512}
        quality={92}
        unoptimized
        sizes="(max-width: 768px) 88px, 112px"
        className="h-[5.5rem] w-[5.5rem] rounded-[22%] object-cover shadow-[0_16px_38px_rgba(17,17,17,0.18)] md:h-28 md:w-28"
      />
      <div className="min-w-0">
        <p
          className="text-[0.62rem] font-semibold uppercase leading-4 tracking-[0.14em]"
          style={{ color: "color-mix(in srgb, currentColor 55%, transparent)" }}
        >
          {app.platform} · {app.status}
        </p>
        <h3
          className="mt-3 text-[clamp(1.75rem,4vw,3.2rem)] font-bold leading-[0.95] tracking-[-0.05em]"
          style={{ fontFamily: HOME_BODY_FONT }}
        >
          {app.title}
        </h3>
        <p className="mt-4 line-clamp-3 max-w-[34rem] text-[0.82rem] font-medium leading-5 opacity-60 md:text-[0.92rem] md:leading-6">
          {app.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-[0.86rem] font-semibold">
          View on app site <ArrowRight className="h-4 w-4" />
        </span>
      </div>
      <ExternalLink className="h-4 w-4 opacity-35 transition-opacity group-hover:opacity-100" />
    </a>
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
              className="mt-4 max-w-[13ch] text-[clamp(2.3rem,5.2vw,4.8rem)] font-bold leading-[0.95] tracking-[-0.05em]"
              style={{ fontFamily: HOME_BODY_FONT }}
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

function StudioAppIconMark({ icon, label }: { icon: string; label: string }) {
  if (icon.endsWith(".png")) {
    return (
      <Image
        src={icon}
        alt={`${label} icon`}
        width={512}
        height={512}
        className="aspect-square h-[74%] w-auto max-w-[74%] rounded-[22%] object-cover shadow-[0_22px_50px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-[1.04] md:h-[76%] md:max-w-[76%]"
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
