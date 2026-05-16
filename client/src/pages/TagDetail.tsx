"use client";

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
import { ArrowLeft } from "lucide-react";
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

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <main>
          <section className="border-b border-border/40 pb-8 pt-24 md:pb-10 md:pt-28">
            <div className="container max-w-[88rem]">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-[0.96rem] tracking-[-0.015em] text-foreground/56 transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Scenic Design
              </Link>

              <div className="mt-8 max-w-5xl">
                <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.24em] text-white/42">
                {isScenicCategory
                  ? "Brandon PT Davis / Scenic Design"
                  : "Brandon PT Davis"}
                </p>
                <h1 className="font-sans text-[clamp(3.2rem,7vw,7.1rem)] font-medium leading-[0.86] tracking-[-0.065em] text-white">
                  {tagName}
                </h1>
                <p className="mt-7 max-w-3xl text-[1.02rem] leading-7 tracking-[-0.01em] text-white/62 md:text-[1.12rem]">
                  {pageDescription}
                </p>
              </div>

              <div className="mt-10 border-t border-border/35 pt-5">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
                  {projects.length
                    ? `${projects.length} scenic design ${projects.length === 1 ? "project" : "projects"}`
                    : `${totalItems} ${totalItems === 1 ? "item" : "items"}`}
                </p>
              </div>
            </div>
          </section>

          <div className="container max-w-[88rem] space-y-18 pb-20 pt-12 md:pb-28 md:pt-14">
            {projects.length > 0 ? (
              <section id="projects">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {projects.map((project, index) => (
                    <Link
                      key={project.id}
                      href={getProjectPath(project)}
                      className="group block"
                    >
                      <div>
                        {project.coverImageUrl ? (
                          <div className="relative aspect-[4/3] overflow-hidden bg-background/50">
                            <Image
                              src={project.coverImageUrl}
                              alt={`${project.title} scenic design by Brandon PT Davis`}
                              fill
                              quality={82}
                              priority={index < 2}
                              loading={index < 2 ? "eager" : "lazy"}
                              sizes="(max-width: 640px) 100vw, (max-width: 1536px) 50vw, 33vw"
                              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                            />
                          </div>
                        ) : null}

                        <div className="pt-4">
                          <h2 className="text-[clamp(1.08rem,1.35vw,1.38rem)] font-normal leading-[1.02] tracking-[-0.035em] text-white/90 transition-colors group-hover:text-white">
                            {project.title}
                          </h2>
                          <p className="mt-2 text-sm tracking-[-0.01em] text-white/52">
                            {[getProjectVenueLabel(project), project.year]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                          {!isScenicCategory && project.excerpt ? (
                            <p className="line-clamp-3 text-[0.98rem] leading-[1.7] tracking-[-0.012em] text-foreground/58">
                              {project.excerpt}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {articles.length > 0 ? (
              <section id="articles" className="border-t border-white/10 pt-8">
                <div className="mb-8 flex items-center justify-between gap-6">
                  <h2 className="font-sans text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-foreground">
                    Articles
                  </h2>
                  <div className="text-sm tracking-[0.08em] text-foreground/42">
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
                        <h3 className="font-sans text-[1.45rem] font-medium leading-[1.02] tracking-[-0.04em] text-foreground transition-colors group-hover:text-foreground/84">
                          {article.title}
                        </h3>
                        {article.excerpt ? (
                          <p className="line-clamp-4 text-[0.98rem] leading-[1.72] tracking-[-0.012em] text-foreground/58">
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
      </div>
    </>
  );
}
