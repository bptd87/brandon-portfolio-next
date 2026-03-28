"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const apps = [
  {
    title: "Scenic 3D Converter (Mac)",
    description:
      "Finder quick action workflow to convert 3D files locally into Vectorworks-friendly USD, USDZ, and 3DM outputs.",
    image: "/assets/studio/studio-app-scenic-3d-converter.png",
    href: "/studio/apps/scenic-3d-converter",
    category: "Utility",
    cta: "Open tool",
  },
  {
    title: "Scale Calculator",
    description:
      "Convert between architectural and model scales for drafting, model building, and production workflow.",
    image: "/assets/studio/studio-app-scale-calculator.png",
    href: "/studio/apps/scale-calculator",
    category: "Calculator",
    cta: "Launch app",
  },
  {
    title: "Dimension Reference",
    description:
      "Quick reference for standard dimensions and unit conversions in scenic and production design.",
    image: "/assets/studio/studio-app-dimension-reference.png",
    href: "/studio/apps/dimension-reference",
    category: "Reference",
    cta: "Open reference",
  },
  {
    title: "Rosco Paint Calculator",
    description:
      "Professional scenic paint mixing calculator for Rosco Off-Broadway paints and color matching workflows.",
    image: "/assets/studio/studio-app-rosco-paint-calculator.png",
    href: "/studio/apps/rosco-paint-calculator",
    category: "Calculator",
    cta: "Launch app",
  },
  {
    title: "Design History Timeline",
    description:
      "Explore major design periods with visual references, color palettes, and historical context.",
    image: "/assets/studio/studio-app-design-history-timeline.png",
    href: "/studio/apps/design-history-timeline",
    category: "Reference",
    cta: "Open timeline",
  },
  {
    title: "Classical Orders",
    description: "Reference guide for classical architecture, proportion, and the major column orders.",
    image: "/assets/studio/studio-app-classical-orders.png",
    href: "/studio/apps/classical-orders",
    category: "Reference",
    cta: "View page",
    needsRebuild: true,
  },
  {
    title: "Paint Finder",
    description:
      "Search and compare theatrical paint colors across manufacturers for scenic paint planning.",
    image: "/assets/studio/studio-app-paint-finder.png",
    href: "/studio/apps/paint-finder",
    category: "Tool",
    cta: "View tool",
    needsRebuild: true,
  },
];

export default function StudioApps() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Studio Apps for Scenic Design Workflow"
        description="Production-focused calculators, reference tools, and utilities for scenic drafting, paint, modeling, and research."
        keywords="scenic design calculator, architecture scale converter, paint mixing calculator, Rosco paint, design history timeline, theatrical design tools, scenic design apps, web-based design tools"
        type="website"
        url="https://www.brandonptdavis.com/studio/apps"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
          { name: "Apps", url: "https://www.brandonptdavis.com/studio/apps" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Scenic Design Tools",
          url: "https://www.brandonptdavis.com/studio/apps",
          description: "Production-focused scenic design apps for drafting, scale, paint, modeling, and research.",
          about: "Studio applications for scenic design workflow.",
          primaryImageOfPage:
            "https://www.brandonptdavis.com/assets/studio/studio-app-scenic-3d-converter.png",
          mainEntity: {
            name: "Studio Apps",
            itemListElement: apps.map((app, index) => ({
              position: index + 1,
              name: app.title,
              url: `https://www.brandonptdavis.com${app.href}`,
              image: `https://www.brandonptdavis.com${app.image}`,
            })),
          },
        }}
      />
      <StructuredData
        type="SoftwareApplication"
        softwareApplication={{
          name: "Scenic 3D Converter for Vectorworks (Mac)",
          description:
            "Finder quick-action utility for converting 3D files into Vectorworks-friendly USD, USDZ, and 3DM outputs.",
          applicationCategory: "GraphicsApplication",
          operatingSystem: "macOS",
          offers: {
            price: "0",
            priceCurrency: "USD",
          },
          url: "https://www.brandonptdavis.com/studio/apps/scenic-3d-converter",
        }}
      />
      <StructuredData
        type="SoftwareApplication"
        softwareApplication={{
          name: "Scale Calculator - Scenic Design Tool",
          description:
            "Convert between architectural and model scales. Essential for drafting and model building in theatrical design.",
          applicationCategory: "DesignApplication",
          operatingSystem: "Web",
          offers: {
            price: "0",
            priceCurrency: "USD",
          },
          url: "https://www.brandonptdavis.com/studio/apps/scale-calculator",
        }}
      />
      <StructuredData
        type="SoftwareApplication"
        softwareApplication={{
          name: "Rosco Paint Calculator - Scenic Paint Mixing",
          description:
            "Professional scenic paint mixing calculator with advanced 5-step color matching engine for Rosco Off-Broadway paints.",
          applicationCategory: "DesignApplication",
          operatingSystem: "Web",
          offers: {
            price: "0",
            priceCurrency: "USD",
          },
          url: "https://www.brandonptdavis.com/studio/apps/rosco-paint-calculator",
        }}
      />
      <StructuredData
        type="SoftwareApplication"
        softwareApplication={{
          name: "Design History Timeline - Architecture Reference",
          description:
            "Explore 30 major design periods from Ancient Egypt to Contemporary architecture with detailed information, color palettes, and key figures.",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          offers: {
            price: "0",
            priceCurrency: "USD",
          },
          url: "https://www.brandonptdavis.com/studio/apps/design-history-timeline",
        }}
      />

      <Header />

      <main className="px-6 pb-24 pt-24 md:pt-28">
        <section className="mx-auto max-w-6xl border-b border-border/18 pb-14">
          <AnimatedSection>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 text-[0.92rem] font-medium text-foreground/56 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Studio
            </Link>

            <div className="mx-auto mt-8 max-w-5xl text-center">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
                Studio Apps
              </p>
              <h1 className="mt-5 font-sans text-[clamp(3rem,6vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
                Scenic design tools for drafting, paint, modeling, and research.
              </h1>
              <p className="mx-auto mt-7 max-w-3xl text-[1.06rem] leading-8 text-foreground/62 md:text-[1.14rem]">
                Practical calculators, reference tools, and utilities built for scenic workflow,
                whether you are drafting at a desk, mixing paint in the shop, or checking dimensions on site.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.95rem] text-foreground/56">
              <div>{apps.length} apps</div>
              <div>Mobile-friendly</div>
              <div>Production-focused</div>
              <div>Browser-based + Mac utilities</div>
            </div>
          </AnimatedSection>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                App Library
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2.1rem,4vw,3.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                Practical tools for production-ready scenic workflow.
              </h2>
            </div>
          </AnimatedSection>

          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {apps.map((app, index) => (
              <AnimatedSection key={app.title} delay={index * 70}>
                <Link href={app.href} className="group block">
                  <article className="border-t border-border/14 pt-4">
                    <div className="relative overflow-hidden rounded-[1rem] border border-border/16 bg-card/10">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={app.image}
                          alt={app.title}
                          fill
                          quality={82}
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 22vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/5" />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                        {app.category}
                      </p>
                      {app.needsRebuild ? (
                        <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/34">
                          In progress
                        </p>
                      ) : null}
                    </div>

                    <h3 className="mt-3 font-sans text-[1.28rem] font-medium leading-[1.08] tracking-[-0.04em] text-foreground">
                      {app.title}
                    </h3>
                    <p className="mt-3 max-w-[34rem] text-[0.93rem] leading-6 text-foreground/60">
                      {app.description}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-[0.9rem] font-medium text-foreground/68 transition-colors group-hover:text-foreground">
                      {app.cta}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </article>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl border-t border-border/18 pt-16">
          <div className="grid gap-12 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] xl:items-center">
            <AnimatedSection>
              <div className="overflow-hidden rounded-[1.15rem] border border-border/18 bg-card/10">
                <div className="relative aspect-square w-full">
                  <Image
                    src="/assets/studio/studio-app-iphone-install.png"
                    alt="Illustrative artwork showing how to save a website as an app on iPhone"
                    fill
                    quality={82}
                    sizes="(max-width: 1280px) 92vw, 42vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={80}>
              <div className="max-w-[40rem]">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                  iPhone Setup
                </p>
                <h2 className="mt-4 font-sans text-[clamp(2rem,3.8vw,3rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
                  Save any Studio tool to your home screen like an app.
                </h2>
                <div className="mt-8 space-y-5">
                  <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-4 border-t border-border/16 pt-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[0.85rem] font-medium text-foreground/72">
                      1
                    </div>
                    <p className="pt-1 text-[1rem] leading-7 text-foreground/64">
                      Open any Studio tool in Safari on your iPhone.
                    </p>
                  </div>
                  <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-4 border-t border-border/16 pt-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[0.85rem] font-medium text-foreground/72">
                      2
                    </div>
                    <p className="pt-1 text-[1rem] leading-7 text-foreground/64">
                      Tap the Share button, then choose Add to Home Screen.
                    </p>
                  </div>
                  <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-4 border-t border-border/16 pt-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[0.85rem] font-medium text-foreground/72">
                      3
                    </div>
                    <p className="pt-1 text-[1rem] leading-7 text-foreground/64">
                      Name it, save it, and reopen it from your home screen whenever you need it.
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-border/16 pt-5">
                  <p className="text-[0.98rem] leading-7 text-foreground/62">
                    This is the fastest way to keep scale, paint, and reference tools handy during
                    build, paint, and tech.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="mx-auto mt-18 max-w-6xl border-t border-border/18 pt-16">
          <AnimatedSection>
            <div className="rounded-[2rem] bg-white/8 px-6 py-14 text-center md:px-12 md:py-16">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                Studio Workflow
              </p>
              <h2 className="mx-auto mt-5 max-w-3xl font-sans text-[clamp(2.3rem,4.5vw,4rem)] font-medium leading-[1.02] tracking-[-0.055em] text-foreground">
                Use the tools that support research, drafting, paint, and day-to-day production.
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/studio/directory"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[0.95rem] font-medium text-black transition-colors hover:bg-white/90"
                >
                  Open scenic toolkit
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href="/studio/tutorials"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-[0.95rem] font-medium text-foreground transition-colors hover:bg-white/14"
                >
                  Watch tutorials
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </div>
  );
}
