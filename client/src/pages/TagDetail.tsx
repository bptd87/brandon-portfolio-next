"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { formatUtcDate } from "@/lib/date-format";
import { getProjectPath } from "@/lib/projectRoutes";
import { getLocalArticles } from "@shared/localArticles";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "@shared/learningPortal";
import { getLocalScenicProjects } from "@shared/localScenicProjects";
import {
  Drama,
  Laugh,
  Music,
  Theater,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { Link } from "wouter";

const INDEXABLE_TAG_MIN_ITEMS = 3;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const unslugify = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const scenicCategoryCopy: Record<string, string> = {
  comedy:
    "Scenic design for comedy, farce, and heightened theatrical worlds, where architecture has to support timing, pressure, surprise, and pace.",
  drama:
    "Scenic design for dramatic work, built around memory, atmosphere, intimacy, and the emotional pressure of the room.",
  shakespeare:
    "Scenic design for Shakespeare and classical text, shaped for language, repertory movement, and strong theatrical worlds.",
  "musical-theatre":
    "Scenic design for musicals, built around rhythm, transitions, ensemble movement, and a clear visual world for song.",
  "theatre-for-young-audiences":
    "Scenic design for theatre for young audiences, balancing clarity, scale, imagination, and the speed of live storytelling.",
};

const scenicCategoryTaglines: Record<string, string> = {
  comedy: "Timing, pressure, and the architecture of surprise.",
  drama: "Rooms for memory, intimacy, and consequence.",
  shakespeare: "Classic language held inside contemporary theatrical space.",
  "musical-theatre": "Rhythm, transformation, and scenic scale.",
  "theatre-for-young-audiences": "Clear worlds for wonder, play, and young audiences.",
};

const scenicCategoryIconMap: Record<string, LucideIcon> = {
  drama: Drama,
  comedy: Laugh,
  shakespeare: Theater,
  "musical-theatre": Music,
  "theatre-for-young-audiences": UsersRound,
};

const scenicCategoryCards = [
  {
    slug: "drama",
    title: "Drama",
    description: "Memory, intimacy, pressure, and the rooms that hold consequence.",
  },
  {
    slug: "comedy",
    title: "Comedy",
    description: "Timing, social pressure, surprise, and architecture that can turn fast.",
  },
  {
    slug: "musical-theatre",
    title: "Musical Theatre",
    description: "Rhythm, transformation, ensemble movement, and scenic scale.",
  },
  {
    slug: "shakespeare",
    title: "Shakespeare",
    description: "Classical language shaped through bold theatrical space.",
  },
  {
    slug: "theatre-for-young-audiences",
    title: "TYA",
    description: "Clear worlds for wonder, play, and young audiences.",
  },
];

const getProjectVenueLabel = (project: {
  client?: string | null;
  venue?: string | null;
}) => project.client || project.venue || null;

const getContentTimestamp = (item: {
  publishedAt?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  year?: number | null;
  month?: number | null;
}) => {
  if (item.year) {
    const monthIndex = item.month ? Math.max(item.month - 1, 0) : 6;
    return new Date(item.year, monthIndex, 1).getTime();
  }

  const fallback = item.publishedAt || item.updatedAt || item.createdAt;
  return fallback ? new Date(fallback).getTime() : 0;
};

type TagDetailProps = {
  slug?: string;
  params?: {
    slug?: string;
  };
};

export default function TagDetail({
  slug: slugProp,
  params,
}: TagDetailProps = {}) {
  const normalizedSlug = (
    slugProp ||
    params?.slug ||
    (typeof window !== "undefined"
      ? window.location.pathname.split("/").filter(Boolean).pop() || ""
      : "")
  ).toLowerCase();

  const projects = getLocalScenicProjects()
    .filter(project => project.tags.some(tag => tag.slug === normalizedSlug))
    .sort((a, b) => getContentTimestamp(b) - getContentTimestamp(a));

  const articles = getLocalArticles()
    .filter(article => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
    .filter(article =>
      (article.tags || []).some(tag => tag.slug === normalizedSlug)
    )
    .sort((a, b) => getContentTimestamp(b) - getContentTimestamp(a));

  const firstProjectTag = projects
    .flatMap(project => project.tags)
    .find(tag => tag.slug === normalizedSlug);
  const firstArticleTag = articles
    .flatMap(article => article.tags || [])
    .find(tag => tag.slug === normalizedSlug);

  const tagName =
    firstProjectTag?.name || firstArticleTag?.name || unslugify(normalizedSlug);
  const totalItems = projects.length + articles.length;
  const shouldNoindex = totalItems < INDEXABLE_TAG_MIN_ITEMS;
  const canonicalTagUrl = `https://www.brandonptdavis.com/tags/${normalizedSlug}`;
  const isScenicCategory =
    Boolean(scenicCategoryCopy[normalizedSlug]) && projects.length > 0;
  const pageDescription = isScenicCategory
    ? scenicCategoryCopy[normalizedSlug]
    : `Browse ${tagName} across scenic projects and writing by Brandon PT Davis.`;
  const heroTagline = scenicCategoryTaglines[normalizedSlug] || pageDescription;
  const getProjectPanelClass = (index: number) => {
    return index % 3 === 0 ? "md:col-span-2" : "";
  };

  if (!normalizedSlug || totalItems === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container flex min-h-[55vh] items-center justify-center">
          <div className="max-w-xl text-center">
            <h1 className="font-sans text-[clamp(2.2rem,4vw,4rem)] font-medium leading-[0.94] tracking-[-0.06em] text-foreground">
              Tag Not Found
            </h1>
            <p className="mt-4 text-[1.02rem] leading-[1.72] text-foreground/64">
              This tag archive is not available on the site right now.
            </p>
            <div className="mt-8">
              <Link
                href="/projects"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[0.96rem] tracking-[-0.015em] text-foreground/72 transition-colors hover:border-white/20 hover:text-foreground"
              >
                Browse Scenic Design
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={
          isScenicCategory
            ? `${tagName} Scenic Design | Brandon PT Davis`
            : `${tagName} | Brandon PT Davis`
        }
        description={pageDescription}
        url={canonicalTagUrl}
        noindex={shouldNoindex}
      />

      <div className="min-h-screen bg-[#111111] text-white">
        <Header />

        <main>
          <section className="bg-black px-[clamp(1.5rem,5vw,6rem)] pb-18 pt-28 md:pb-24 md:pt-32">
            <div className="mx-auto max-w-[88rem]">
              <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
                <h1 className="font-sans text-[clamp(3.2rem,7vw,6.8rem)] font-medium leading-[0.88] tracking-[-0.08em] text-white">
                  {tagName}
                </h1>
                <p className="mt-5 max-w-[38rem] bg-gradient-to-r from-[#2f6dff] via-[#6f2dff] to-[#a78bff] bg-clip-text font-sans text-[clamp(1.25rem,2.1vw,2rem)] font-medium leading-[1.08] tracking-[-0.055em] text-transparent">
                  {heroTagline}
                </p>
              </div>
            </div>
          </section>

          <div className="space-y-18 bg-[#111111] pb-20 md:pb-28">
            {projects.length > 0 ? (
              <section id="projects" className="px-[clamp(0.9rem,1.8vw,1.35rem)] py-[clamp(0.9rem,1.8vw,1.35rem)]">
                <div className="grid grid-cols-1 gap-[clamp(0.9rem,1.8vw,1.35rem)] md:grid-cols-2">
                  {projects.map((project, index) => (
                    <Link
                      key={project.id}
                      href={getProjectPath(project)}
                      className={`group block ${getProjectPanelClass(index)}`}
                    >
                      <article className="bg-[#111111]">
                        <div className="site-media-square relative aspect-[3/2] overflow-hidden bg-[#181818]">
                          {project.coverImageUrl ? (
                            <Image
                              src={project.coverImageUrl}
                              alt={`${project.title} scenic design by Brandon PT Davis`}
                              fill
                              quality={86}
                              priority={index < 2}
                              loading={index < 2 ? "eager" : "lazy"}
                              sizes={
                                index % 3 === 0
                                  ? "100vw"
                                  : "(max-width: 768px) 100vw, 50vw"
                              }
                              className="site-media-square object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                              style={{
                                objectPosition: project.coverImagePosition || "center",
                              }}
                            />
                          ) : null}
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/82 via-black/32 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-[clamp(1.15rem,2.2vw,2rem)]">
                            <h2 className="font-sans text-[clamp(1.45rem,2.1vw,2.4rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white transition-colors group-hover:text-white/80">
                              {project.title}
                            </h2>
                            <p className="mt-1.5 font-sans text-[clamp(0.96rem,1.1vw,1.08rem)] font-medium leading-[1.25] tracking-[-0.025em] text-white/58">
                              {getProjectVenueLabel(project) || "Scenic Design"}
                            </p>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section
              aria-labelledby="scenic-category-navigation"
              className="px-[clamp(1.5rem,5vw,6rem)] pt-6 md:pt-10"
            >
              <div className="mx-auto max-w-[88rem]">
                <h2
                  id="scenic-category-navigation"
                  className="font-sans text-[clamp(2rem,4vw,3.7rem)] font-medium leading-[0.96] tracking-[-0.065em] text-white/56"
                >
                  Browse scenic design categories.
                </h2>
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {scenicCategoryCards.map(category => {
                    const Icon = scenicCategoryIconMap[category.slug] || Theater;
                    const isActive = category.slug === normalizedSlug;

                    return (
                      <Link
                        key={category.slug}
                        href={`/tags/${category.slug}`}
                        className={`group flex min-h-[17rem] flex-col rounded-lg border p-7 transition-colors ${
                          isActive
                            ? "border-white/18 bg-black text-white"
                            : "border-white/8 bg-black/72 text-white hover:border-white/18 hover:bg-black"
                        }`}
                      >
                        <Icon className="h-7 w-7 text-white/82" strokeWidth={1.75} />
                        <h3 className="mt-10 font-sans text-[clamp(1.5rem,2vw,1.95rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white">
                          {category.title}
                        </h3>
                        <p className="mt-4 text-[0.98rem] leading-6 tracking-[-0.015em] text-white/58">
                          {category.description}
                        </p>
                        <span className="mt-auto pt-6 text-[0.96rem] font-medium tracking-[-0.02em] text-[#63a4ff] transition-colors group-hover:text-[#7c3cff]">
                          View category
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            {articles.length > 0 ? (
              <section id="articles" className="mx-auto max-w-[88rem] border-t border-white/10 px-[clamp(1.5rem,5vw,6rem)] pt-10">
                <div className="mb-8 flex items-center justify-between gap-6">
                  <h2 className="font-sans text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                    Articles
                  </h2>
                  <div className="text-sm tracking-[0.08em] text-white/42">
                    {articles.length}
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map(article => (
                    <Link
                      key={article.id}
                      href={
                        LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug)
                          ? `/studio/tutorials/${article.slug}`
                          : `/articles/${article.slug}`
                      }
                      className="group block border-t border-white/10 pt-4"
                    >
                      <div className="space-y-3">
                        <h3 className="font-sans text-[1.45rem] font-medium leading-[1.02] tracking-[-0.04em] text-white transition-colors group-hover:text-white/84">
                          {article.title}
                        </h3>
                        {article.excerpt ? (
                          <p className="line-clamp-4 text-[0.98rem] leading-[1.72] tracking-[-0.012em] text-white/58">
                            {article.excerpt}
                          </p>
                        ) : null}
                        <p className="text-[0.76rem] font-bold uppercase tracking-[0.24em] text-white/42">
                          {article.publishedAt
                            ? formatUtcDate(article.publishedAt, "long")
                            : "Article"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
