"use client";

import React, { useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import { useLocation } from "wouter";
import Image from "next/image";
import {
  ArrowUpDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  SlidersHorizontal,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { formatUtcDate, getUtcYear } from "@/lib/date-format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "@shared/learningPortal";
import { getLocalArticles } from "@shared/localArticles";

type ArticleCardItem = {
  id: number | string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  publishedAt?: string | Date | null;
  createdAt?: string | Date | null;
  readTime?: number | null;
  categoryName?: string | null;
};

type SortKey = "newest" | "oldest" | "title" | "category";
type ViewMode = "grid" | "list";

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "title", label: "Article title" },
  { key: "category", label: "Category" },
];

const decodeHTMLEntities = (text: string): string => {
  if (typeof document === "undefined") return text;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

const getArticleTimestamp = (article: ArticleCardItem) => {
  return new Date(article.publishedAt || article.createdAt || 0).getTime();
};

const formatArticleDate = (article: ArticleCardItem) => {
  const source = article.publishedAt || article.createdAt;
  if (!source) return null;
  return formatUtcDate(source, "short");
};

const getArticleYear = (article: ArticleCardItem) => {
  const source = article.publishedAt || article.createdAt;
  if (!source) return null;
  return getUtcYear(source);
};

const normalizeCategoryParam = (value: string | null) => {
  switch (value) {
    case "Technology & Tutorials":
      return "Tools & Technology";
    case "Design Philosophy":
      return "Scenic Design";
    case "Scenic Design Process":
      return "Design Process";
    case "Musical Theatre & Cinema":
      return "Performance History & Culture";
    case "Editorial Profiles":
      return "Profiles & Interviews";
    default:
      return value || "all";
  }
};

function ArticleGridCard({
  article,
  eager,
  href,
  onNavigate,
  stagger = 0,
}: {
  article: ArticleCardItem;
  eager?: boolean;
  href: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  stagger?: number;
}) {
  const meta = [article.categoryName, formatArticleDate(article), article.readTime ? `${article.readTime} min read` : null]
    .filter(Boolean)
    .join(" / ");

  return (
    <AnimatedSection delay={Math.min(stagger * 70, 420)}>
      <a href={href} onClick={(event) => onNavigate(event, href)} className="group block">
      <div>
        <div
          className="transition-card relative aspect-[16/10] overflow-hidden bg-background/50"
          style={{ viewTransitionName: `article-card-${article.slug}` } as CSSProperties}
        >
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.coverImageAlt || `Cover image for article: ${decodeHTMLEntities(article.title)}`}
              fill
              quality={82}
              className="object-cover transition-[filter,transform] duration-[900ms] ease-out group-hover:scale-[1.04] group-hover:brightness-110"
              loading={eager ? "eager" : "lazy"}
              sizes="(min-width: 1280px) 29vw, (min-width: 768px) 30vw, 94vw"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>

        <div className="pt-4">
          {meta ? (
            <p className="mb-2 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-white/38">
              {meta}
            </p>
          ) : null}
          <p className="max-w-[24rem] text-[1.08rem] font-normal leading-[1.08] tracking-[-0.035em] text-white/92 transition-transform duration-500 group-hover:translate-x-1">
            {decodeHTMLEntities(article.title)}
          </p>
          {article.excerpt ? (
            <p className="mt-3 line-clamp-2 max-w-[28rem] text-[0.94rem] leading-6 text-white/54">
              {decodeHTMLEntities(article.excerpt)}
            </p>
          ) : null}
          <span className="mt-5 block h-px w-full origin-left scale-x-0 bg-white/45 transition-transform duration-700 group-hover:scale-x-100" />
        </div>
      </div>
      </a>
    </AnimatedSection>
  );
}

function FeaturedArticle({
  article,
  href,
  onNavigate,
}: {
  article: ArticleCardItem;
  href: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const meta = [article.categoryName, formatArticleDate(article), article.readTime ? `${article.readTime} min read` : null]
    .filter(Boolean)
    .join(" / ");

  return (
    <AnimatedSection>
      <a
        href={href}
        onClick={(event) => onNavigate(event, href)}
        className="group grid gap-6 border-b border-white/12 pb-12 md:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.75fr)] md:gap-10 md:pb-16"
      >
      <div
        className="transition-card relative aspect-[16/9] overflow-hidden bg-background/50"
        style={{ viewTransitionName: `article-card-${article.slug}` } as CSSProperties}
      >
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt || `Cover image for article: ${decodeHTMLEntities(article.title)}`}
            fill
            priority
            quality={88}
            className="object-cover transition-[filter,transform] duration-[1200ms] ease-out group-hover:scale-[1.035] group-hover:brightness-110"
            sizes="(min-width: 1280px) 58vw, (min-width: 768px) 62vw, 100vw"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      <div className="flex min-h-full flex-col justify-end">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white/38">
          Featured Writing
        </p>
        {meta ? <p className="mt-4 text-[0.75rem] uppercase tracking-[0.18em] text-white/44">{meta}</p> : null}
        <h2 className="mt-3 max-w-[13ch] font-sans text-[clamp(2.1rem,4.8vw,4.8rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">
          {decodeHTMLEntities(article.title)}
        </h2>
        {article.excerpt ? (
          <p className="mt-5 max-w-[34rem] text-[1rem] leading-7 text-white/62 md:text-[1.05rem]">
            {decodeHTMLEntities(article.excerpt)}
          </p>
        ) : null}
        <div className="mt-8 flex items-center gap-3 text-[0.95rem] text-white/72 transition-colors group-hover:text-white">
          <span>Read article</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
      </a>
    </AnimatedSection>
  );
}

export default function Articles() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window === "undefined") return "all";
    return normalizeCategoryParam(new URLSearchParams(window.location.search).get("category"));
  });
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    if (typeof window === "undefined") return "all";
    return new URLSearchParams(window.location.search).get("year") || "all";
  });
  const [sortKey, setSortKey] = useState<SortKey>(() => {
    if (typeof window === "undefined") return "newest";
    const value = new URLSearchParams(window.location.search).get("sort");
    return value === "oldest" || value === "title" || value === "category" ? value : "newest";
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "grid";
    return new URLSearchParams(window.location.search).get("view") === "list" ? "list" : "grid";
  });

  const allArticles = useMemo<ArticleCardItem[]>(
    () =>
      getLocalArticles()
        .filter((article) => !LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
        .filter((article) => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
        .map((article) => ({
          id: article.id,
          slug: article.slug,
          title: decodeHTMLEntities(article.title),
          excerpt: article.excerpt,
          coverImageUrl: article.coverImageUrl,
          coverImageAlt: article.coverImageAlt,
          publishedAt: article.publishedAt,
          createdAt: article.createdAt,
          readTime: article.readTime,
          categoryName: normalizeCategoryParam(article.categoryName || null),
        })),
    []
  );

  const categories = useMemo(() => {
    return Array.from(
      new Set(allArticles.map((article) => article.categoryName).filter((value): value is string => Boolean(value)))
    ).sort((a, b) => a.localeCompare(b));
  }, [allArticles]);

  const yearOptions = useMemo(() => {
    return Array.from(
      new Set(allArticles.map((article) => getArticleYear(article)).filter((value): value is string => Boolean(value)))
    ).sort((a, b) => Number(b) - Number(a));
  }, [allArticles]);

  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      if (selectedCategory !== "all" && article.categoryName !== selectedCategory) {
        return false;
      }

      if (selectedYear !== "all" && getArticleYear(article) !== selectedYear) {
        return false;
      }

      return true;
    });
  }, [allArticles, selectedCategory, selectedYear]);

  const sortedArticles = useMemo(() => {
    const list = [...filteredArticles];

    list.sort((a, b) => {
      if (sortKey === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortKey === "category") {
        const categoryCompare = (a.categoryName || "").localeCompare(b.categoryName || "");
        if (categoryCompare !== 0) return categoryCompare;
        return getArticleTimestamp(b) - getArticleTimestamp(a);
      }

      const timeCompare = getArticleTimestamp(b) - getArticleTimestamp(a);
      if (timeCompare !== 0) {
        return sortKey === "oldest" ? -timeCompare : timeCompare;
      }

      return a.title.localeCompare(b.title);
    });

    return list;
  }, [filteredArticles, sortKey]);

  const activeFilterCount = (selectedYear !== "all" ? 1 : 0);
  const isDefaultAllView =
    selectedCategory === "all" && selectedYear === "all" && sortKey === "newest";
  const currentHeading =
    selectedCategory !== "all" ? selectedCategory : selectedYear !== "all" ? selectedYear : "Articles";
  const articleArchiveTitle =
    selectedCategory !== "all"
      ? `${selectedCategory} Articles | Brandon PT Davis`
      : selectedYear !== "all"
        ? `Articles from ${selectedYear} | Brandon PT Davis`
        : "Scenic Design Articles | Brandon PT Davis";
  const articleArchiveDescription =
    selectedCategory !== "all"
      ? `Read ${selectedCategory.toLowerCase()} articles by Brandon PT Davis, connecting scenic design, production thinking, and visual storytelling.`
      : selectedYear !== "all"
        ? `Browse Brandon PT Davis articles published in ${selectedYear}, covering scenic design, process, rendering, and theatre practice.`
        : "Articles by Brandon PT Davis on scenic design, design process, rendering communication, themed entertainment, and performance culture.";
  const articleArchiveKeywords = [
    "scenic design articles",
    "theatre design writing",
    "Brandon PT Davis articles",
    selectedCategory !== "all" ? selectedCategory : null,
    selectedYear !== "all" ? `${selectedYear} theatre articles` : null,
  ]
    .filter(Boolean)
    .join(", ");
  const animateCardDeparture = async (target: HTMLElement) => {
    const card = target.querySelector(".transition-card") as HTMLElement | null;
    if (!card || typeof card.animate !== "function") return;
    const animation = card.animate(
      [
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: "scale(0.975)", filter: "brightness(1.08)" },
      ],
      { duration: 150, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
    );
    try {
      await animation.finished;
    } catch {
      // Ignore interrupted animation.
    }
  };

  const navigateWithTransition = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const anchor = event.currentTarget;
    const navigate = () => setLocation(href);
    const performNavigation = async () => {
      await animateCardDeparture(anchor);
      navigate();
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        void performNavigation();
      });
    } else {
      void performNavigation();
    }
  };

  const itemHref = (article: ArticleCardItem) => `/articles/${article.slug}`;
  const showFeaturedArticle = viewMode === "grid" && isDefaultAllView && Boolean(sortedArticles[0]);
  const featuredArticle = showFeaturedArticle ? sortedArticles[0] : null;
  const displayedArticles = featuredArticle ? sortedArticles.slice(1) : sortedArticles;

  return (
    <div className="publish-editorial min-h-screen bg-[#f1f0ec] text-[#111111]">
      <SEO
        title={articleArchiveTitle}
        description={articleArchiveDescription}
        image={allArticles[0]?.coverImageUrl || undefined}
        imageAlt={allArticles[0]?.coverImageAlt || allArticles[0]?.title || "Article archive cover image"}
        keywords={articleArchiveKeywords}
        url="https://www.brandonptdavis.com/articles"
      />
      <Header />

      <main>
        <section className="pb-8 pt-24 md:pb-10 md:pt-28">
          <div className="container max-w-[88rem]">
            <AnimatedSection>
              <div className="grid gap-6 border-b border-white/12 pb-8 md:grid-cols-[minmax(0,0.72fr)_minmax(20rem,0.28fr)] md:items-end md:pb-10">
                <div>
                  <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-white/38">
                    Brandon PT Davis / Writing
                  </p>
                  <h1 className="font-sans text-[clamp(2.5rem,6vw,6.6rem)] font-medium leading-[0.88] tracking-[-0.075em] text-white">
                    {currentHeading}
                  </h1>
                </div>
                <p className="max-w-[28rem] text-[1rem] leading-7 text-white/62 md:text-[1.05rem]">
                  Notes, essays, interviews, and production context from a scenic design practice.
                  The writing sits close to the portfolio: process, taste, collaboration, and the
                  work behind the image.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={120}>
              <div className="mt-6 flex flex-col gap-5 md:mt-8">
                <div className="overflow-x-auto md:overflow-visible">
                  <div className="flex min-w-max items-center gap-5 md:min-w-0 md:flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("all")}
                      className={`border-b pb-2 text-[0.78rem] uppercase tracking-[0.18em] transition-colors ${
                        selectedCategory === "all"
                          ? "border-white text-white"
                          : "border-transparent text-white/42 hover:border-white/30 hover:text-white/80"
                      }`}
                    >
                      All
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`border-b pb-2 text-[0.78rem] uppercase tracking-[0.18em] transition-colors ${
                          selectedCategory === category
                            ? "border-white text-white"
                            : "border-transparent text-white/42 hover:border-white/30 hover:text-white/80"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-border/50 px-4 text-sm text-white/72 transition-colors hover:border-border hover:text-white"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filter
                      {activeFilterCount > 0 ? (
                        <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium leading-none text-background">
                          {activeFilterCount}
                        </span>
                      ) : null}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-[min(24rem,calc(100vw-2rem))] rounded-3xl border-border/60 bg-background/95 p-5"
                  >
                    <div className="space-y-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-white">Filter articles</p>
                          <p className="text-xs text-white/52">Refine by publication year.</p>
                        </div>
                        {selectedYear !== "all" && (
                          <button
                            type="button"
                            onClick={() => setSelectedYear("all")}
                            className="text-xs text-white/55 transition-colors hover:text-white"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                          Date
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedYear("all")}
                            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                              selectedYear === "all"
                                ? "border-white/30 bg-white/10 text-white"
                                : "border-border/50 text-white/62 hover:border-border hover:text-white"
                            }`}
                          >
                            All dates
                          </button>
                          {yearOptions.map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() => setSelectedYear(year)}
                              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                                selectedYear === year
                                  ? "border-white/30 bg-white/10 text-white"
                                  : "border-border/50 text-white/62 hover:border-border hover:text-white"
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-border/50 px-4 text-sm text-white/72 transition-colors hover:border-border hover:text-white"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      Sort
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-2xl border-border/60 bg-background/95 p-2"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option.key}
                        onClick={() => setSortKey(option.key)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm"
                      >
                        <span>{option.label}</span>
                        {sortKey === option.key ? <Check className="h-4 w-4" /> : null}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="inline-flex h-10 items-center rounded-full border border-border/50 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      viewMode === "grid"
                        ? "bg-foreground text-background"
                        : "text-white/55 hover:text-white"
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      viewMode === "list"
                        ? "bg-foreground text-background"
                        : "text-white/55 hover:text-white"
                    }`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {sortedArticles.length > 0 ? (
          <>
            <section className="pb-20 pt-10 md:pb-28 md:pt-12">
              <div className="container max-w-[88rem]">
                {viewMode === "grid" ? (
                  <div className="space-y-10 md:space-y-14">
                    {featuredArticle ? (
                      <FeaturedArticle
                        article={featuredArticle}
                        href={itemHref(featuredArticle)}
                        onNavigate={navigateWithTransition}
                      />
                    ) : null}

                    {displayedArticles.length > 0 ? (
                      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {displayedArticles.map((article, index) => {
                          const href = itemHref(article);

                          return (
                            <ArticleGridCard
                              key={`${article.id}-${selectedCategory}-${selectedYear}-${sortKey}-${viewMode}`}
                              article={article}
                              eager={!featuredArticle && index < 2}
                              href={href}
                              onNavigate={navigateWithTransition}
                              stagger={index}
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="border-t border-border/35">
                    {sortedArticles.map((article) => {
                      const href = itemHref(article);

                      return (
                        <a
                          key={`${article.id}-${selectedCategory}-${selectedYear}-${sortKey}-${viewMode}`}
                          href={href}
                          onClick={(event) => navigateWithTransition(event, href)}
                          className="group grid gap-4 border-b border-border/35 py-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8"
                        >
                          <div className="space-y-2 text-sm text-white/48">
                            <p className="text-white/82">{article.categoryName || "Article"}</p>
                            <p>
                              {[formatArticleDate(article), article.readTime ? `${article.readTime} min read` : null]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-[1.25rem] font-normal leading-[1.05] tracking-[-0.04em] text-white/92 transition-transform duration-500 group-hover:translate-x-1">
                              {article.title}
                            </p>
                            {article.excerpt ? (
                              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/52">
                                {article.excerpt}
                              </p>
                            ) : null}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="pb-24 pt-16">
            <div className="container max-w-[88rem] text-center">
              <p className="text-white/55">No articles match the current filters.</p>
            </div>
          </section>
        )}

        <section className="border-t border-border/35 py-16 md:py-20">
          <div className="container max-w-[88rem]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
              Reading Paths
            </p>
            <div className="mt-6 grid border-t border-white/12 md:grid-cols-3">
              {[
                ["Process", "How scenic ideas move from research, drafting, models, and rehearsal into a built production."],
                ["Context", "Notes around theatre, performance culture, and the artistic questions behind the portfolio."],
                ["Profiles", "Interviews, press, and editorial pieces that place the work inside a wider creative practice."],
              ].map(([title, description]) => (
                <div key={title} className="border-b border-white/12 py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                  <h2 className="text-[1.35rem] font-normal leading-none tracking-[-0.045em] text-white">
                    {title}
                  </h2>
                  <p className="mt-4 max-w-[24rem] text-[0.98rem] leading-7 text-white/58">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
