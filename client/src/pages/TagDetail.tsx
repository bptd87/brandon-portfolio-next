"use client";

import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { formatUtcDate } from "@/lib/date-format";
import { getProjectPath } from "@/lib/projectRoutes";
import { getLocalArticles } from "@shared/localArticles";
import { getLocalScenicProjects } from "@shared/localScenicProjects";
import { ArrowLeft, Briefcase, FileText } from "lucide-react";
import { Link } from "wouter";

const INDEXABLE_TAG_MIN_ITEMS = 3;

type TagPageSection = {
  id: string;
  label: string;
  count: number;
  icon: typeof Briefcase;
};

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
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

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

export default function TagDetail({ slug: slugProp, params }: TagDetailProps = {}) {
  const normalizedSlug = (
    slugProp ||
    params?.slug ||
    (typeof window !== "undefined"
      ? window.location.pathname.split("/").filter(Boolean).pop() || ""
      : "")
  ).toLowerCase();

  const projects = getLocalScenicProjects()
    .filter((project) => project.tags.some((tag) => tag.slug === normalizedSlug))
    .sort((a, b) => getContentTimestamp(b) - getContentTimestamp(a));

  const articles = getLocalArticles()
    .filter((article) => (article.tags || []).some((tag) => tag.slug === normalizedSlug))
    .sort((a, b) => getContentTimestamp(b) - getContentTimestamp(a));

  const firstProjectTag = projects
    .flatMap((project) => project.tags)
    .find((tag) => tag.slug === normalizedSlug);
  const firstArticleTag = articles
    .flatMap((article) => article.tags || [])
    .find((tag) => tag.slug === normalizedSlug);

  const tagName = firstProjectTag?.name || firstArticleTag?.name || unslugify(normalizedSlug);
  const totalItems = projects.length + articles.length;
  const shouldNoindex = totalItems < INDEXABLE_TAG_MIN_ITEMS;
  const canonicalTagUrl = `https://www.brandonptdavis.com/tags/${normalizedSlug}`;

  const sections: TagPageSection[] = [
    { id: "projects", label: "Projects", count: projects.length, icon: Briefcase },
    { id: "articles", label: "Articles", count: articles.length, icon: FileText },
  ].filter((section) => section.count > 0);

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
                href="/articles"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[0.96rem] tracking-[-0.015em] text-foreground/72 transition-colors hover:border-white/20 hover:text-foreground"
              >
                Browse Articles
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
        title={`${tagName} | Brandon PT Davis`}
        description={`Browse all content tagged with ${tagName} across scenic projects and articles.`}
        url={canonicalTagUrl}
        noindex={shouldNoindex}
      />

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <main className="pb-20 pt-10 md:pt-14">
          <section className="container max-w-6xl">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-[0.96rem] tracking-[-0.015em] text-foreground/56 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Articles
            </Link>

            <div className="mt-10 max-w-4xl border-t border-white/10 pt-10">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/42">Tag Archive</p>
              <h1 className="mt-4 max-w-[12ch] font-sans text-[clamp(2.8rem,6vw,5.4rem)] font-medium leading-[0.9] tracking-[-0.065em] text-foreground">
                {tagName}
              </h1>
              <p className="mt-5 max-w-3xl text-[clamp(1.02rem,1.2vw,1.14rem)] leading-[1.72] tracking-[-0.014em] text-foreground/64">
                {totalItems} {totalItems === 1 ? "item" : "items"} gathered across scenic projects and essays.
              </p>
            </div>

            {sections.length > 0 ? (
              <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center justify-between border border-white/10 px-4 py-4 text-foreground/72 transition-colors hover:border-white/18 hover:text-foreground"
                    >
                      <span className="inline-flex items-center gap-3 text-[0.98rem] tracking-[-0.015em]">
                        <Icon className="h-4 w-4" />
                        {section.label}
                      </span>
                      <span className="text-sm text-foreground/46">{section.count}</span>
                    </a>
                  );
                })}
              </div>
            ) : null}
          </section>

          <div className="container mt-16 max-w-6xl space-y-18">
            {projects.length > 0 ? (
              <section id="projects" className="border-t border-white/10 pt-8">
                <div className="mb-8 flex items-center justify-between gap-6">
                  <h2 className="font-sans text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-foreground">
                    Projects
                  </h2>
                  <div className="text-sm tracking-[0.08em] text-foreground/42">{projects.length}</div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <Link key={project.id} href={getProjectPath(project)} className="group block">
                      <div className="space-y-4">
                        {project.coverImageUrl ? (
                          <div className="overflow-hidden bg-black">
                            <img
                              src={project.coverImageUrl}
                              alt={project.title}
                              className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                            />
                          </div>
                        ) : null}

                        <div className="space-y-2">
                          <h3 className="font-sans text-[1.6rem] font-medium leading-[1.02] tracking-[-0.04em] text-foreground transition-colors group-hover:text-foreground/84">
                            {project.title}
                          </h3>
                          <p className="text-[0.76rem] font-bold uppercase tracking-[0.24em] text-white/42">
                            {[project.client, project.year].filter(Boolean).join("  ")}
                          </p>
                          {project.excerpt ? (
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
                  <div className="text-sm tracking-[0.08em] text-foreground/42">{articles.length}</div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="group block border-t border-white/10 pt-4">
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
