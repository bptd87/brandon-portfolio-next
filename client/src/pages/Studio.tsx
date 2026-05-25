"use client";

import { useMemo, useRef } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
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
    title: "Scenic 3D Converter (Mac)",
    description:
      "Finder quick action workflow to convert 3D files locally into Vectorworks-friendly USD, USDZ, and 3DM outputs.",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-scenic-3d-converter.png",
    href: "/studio/apps/scenic-3d-converter",
    category: "Utility",
    cta: "Open tool",
  },
  {
    title: "Scale Calculator",
    description:
      "Convert between architectural and model scales for drafting, model building, and production workflow.",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-scale-calculator.png",
    href: "/studio/apps/scale-calculator",
    category: "Calculator",
    cta: "Launch app",
  },
  {
    title: "Dimension Reference",
    description:
      "Quick reference for standard dimensions and unit conversions in scenic and production design.",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-dimension-reference.png",
    href: "/studio/apps/dimension-reference",
    category: "Reference",
    cta: "Open reference",
  },
  {
    title: "Rosco Paint Calculator",
    description:
      "Professional scenic paint mixing calculator for Rosco Off-Broadway paints and color matching workflows.",
    image: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-app-rosco-paint-calculator.png",
    href: "/studio/apps/rosco-paint-calculator",
    category: "Calculator",
    cta: "Launch app",
  },
] as const;

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
  const appCardsRef = useRef<HTMLDivElement | null>(null);
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
  const scrollAppCards = (direction: "previous" | "next") => {
    appCardsRef.current?.scrollBy({
      left: direction === "next" ? 620 : -620,
      behavior: "smooth",
    });
  };

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

      <main className="pb-24">
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

        <section className="bg-[#f1f0ec] pb-20 pt-16 md:pb-28 md:pt-24">
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

          <div
            ref={appCardsRef}
            className="overflow-x-auto px-[clamp(1.5rem,5vw,6rem)] pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex min-w-max gap-5 pr-[clamp(1.5rem,5vw,6rem)]">
              {apps.map((app, index) => (
                <Link
                  key={app.href}
                  href={app.href}
                  className="group relative block w-[min(25rem,82vw)] overflow-hidden rounded-[1.7rem] bg-black ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-1 md:w-[29rem]"
                >
                  <img
                    src={app.image}
                    alt={app.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="aspect-square h-full w-full object-cover opacity-[0.92] transition duration-500 group-hover:scale-[1.018] group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.24)_46%,rgba(0,0,0,0.82)_100%)]" />

                  <div className="absolute inset-0 flex flex-col justify-between p-7 text-white md:p-8">
                    <div>
                      <p className="text-[0.92rem] font-medium tracking-[-0.02em] text-white/72">
                        {app.category}
                      </p>
                    </div>

                    <div>
                      <h3 className="max-w-[11ch] font-sans text-[clamp(2.15rem,4vw,4rem)] font-medium leading-[0.9] tracking-[-0.08em] text-white">
                        {app.title}
                      </h3>
                      <p className="mt-4 max-w-[25rem] text-[0.98rem] leading-[1.42] tracking-[-0.02em] text-white/72">
                        {app.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/22 pt-4">
                        <span className="min-w-0 truncate text-[0.95rem] font-medium tracking-[-0.02em] text-white/76">
                          {app.cta}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="-mt-1 flex justify-end gap-3 px-[clamp(1.5rem,5vw,6rem)]">
            <button
              type="button"
              onClick={() => scrollAppCards("previous")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.08] text-black/62 transition-colors hover:bg-black hover:text-white"
              aria-label="Previous studio app cards"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollAppCards("next")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.12] text-black/72 transition-colors hover:bg-black hover:text-white"
              aria-label="Next studio app cards"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
