"use client";

import React, { useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import { useLocation } from "wouter";
import Image from "next/image";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  SlidersHorizontal,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { formatUtcDate, getUtcYear } from "@/lib/date-format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
}: {
  article: ArticleCardItem;
  eager?: boolean;
  href: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <a href={href} onClick={(event) => onNavigate(event, href)}>
      <div className="group">
        <div
          className="transition-card relative aspect-[1/1] overflow-hidden rounded-xl bg-background/50"
          style={{ viewTransitionName: `article-card-${article.slug}` } as CSSProperties}
        >
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.coverImageAlt || `Cover image for article: ${decodeHTMLEntities(article.title)}`}
              fill
              quality={82}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading={eager ? "eager" : "lazy"}
              sizes="(min-width: 1280px) 29vw, (min-width: 768px) 30vw, 94vw"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>

        <div className="pt-4">
          <p className="text-[1.02rem] font-normal tracking-[-0.02em] text-white/88">
            {decodeHTMLEntities(article.title)}
          </p>
        </div>
      </div>
    </a>
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
      getLocalArticles().map((article) => ({
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
  const articleCollectionName =
    selectedCategory !== "all"
      ? `${selectedCategory} Articles`
      : selectedYear !== "all"
        ? `Articles from ${selectedYear}`
        : "Articles";
  const articleCollectionDescription =
    selectedCategory !== "all"
      ? `${selectedCategory} writing by Brandon PT Davis.`
      : selectedYear !== "all"
        ? `Article archive from ${selectedYear}.`
        : "Article archive covering scenic design practice, production strategy, and theatre process.";

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

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={articleArchiveTitle}
        description={articleArchiveDescription}
        image={allArticles[0]?.coverImageUrl || undefined}
        imageAlt={allArticles[0]?.coverImageAlt || allArticles[0]?.title || "Article archive cover image"}
        keywords={articleArchiveKeywords}
        url="https://www.brandonptdavis.com/articles"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Articles", url: "https://www.brandonptdavis.com/articles" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: articleCollectionName,
          url: "https://www.brandonptdavis.com/articles",
          description: articleCollectionDescription,
          about: "Scenic design writing and production insights by Brandon PT Davis.",
          primaryImageOfPage: allArticles[0]?.coverImageUrl || undefined,
          mainEntity: {
            name: articleCollectionName,
            itemListElement: sortedArticles.slice(0, 24).map((article, index) => ({
              position: index + 1,
              name: article.title,
              url: `https://www.brandonptdavis.com/articles/${article.slug}`,
              datePublished:
                article.publishedAt instanceof Date
                  ? article.publishedAt.toISOString()
                  : article.createdAt instanceof Date
                    ? article.createdAt.toISOString()
                    : article.publishedAt || article.createdAt || undefined,
              image: article.coverImageUrl || undefined,
            })),
          },
        }}
      />

      <Header />

      <main>
        <section className="border-b border-border/40 pb-8 pt-24 md:pb-10 md:pt-28">
          <div className="container max-w-[88rem]">
            <div className="max-w-3xl">
              <h1 className="font-sans text-[clamp(2.3rem,4.6vw,3.8rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                {currentHeading}
              </h1>
            </div>

            <div className="mt-10 flex flex-col gap-5 border-t border-border/35 pt-5">
              <div className="overflow-x-auto md:overflow-visible">
                <div className="flex min-w-max items-center gap-3 md:min-w-0 md:flex-wrap">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`rounded-full border px-4 py-2 text-[0.92rem] transition-colors ${
                      selectedCategory === "all"
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-border/40 text-white/52 hover:border-border hover:text-white/80"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full border px-4 py-2 text-[0.92rem] transition-colors ${
                        selectedCategory === category
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-border/40 text-white/52 hover:border-border hover:text-white/80"
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
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-border/50 px-4 text-sm text-white/82 transition-colors hover:border-border hover:text-white"
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
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-border/50 px-4 text-sm text-white/82 transition-colors hover:border-border hover:text-white"
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
          </div>
        </section>

        {sortedArticles.length > 0 ? (
          <>
            <section className="pb-20 pt-12 md:pb-28 md:pt-14">
              <div className="container max-w-[88rem]">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedArticles.map((article, index) => {
                      const href = itemHref(article);

                      return (
                        <div key={`${article.id}-${selectedCategory}-${selectedYear}-${sortKey}-${viewMode}`}>
                          <ArticleGridCard
                            article={article}
                            eager={index < 2}
                            href={href}
                            onNavigate={navigateWithTransition}
                          />
                          <div className="mt-2 text-sm text-white/45">
                            {[article.categoryName, formatArticleDate(article)]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border-t border-border/35">
                    {sortedArticles.map((article, index) => {
                      const href = itemHref(article);

                      return (
                        <a
                          key={`${article.id}-${selectedCategory}-${selectedYear}-${sortKey}-${viewMode}`}
                          href={href}
                          onClick={(event) => navigateWithTransition(event, href)}
                          className="group grid gap-4 border-b border-border/35 py-5 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8"
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
                              <p className="text-[1.12rem] font-normal tracking-[-0.025em] text-white/88">
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
              About These Articles
            </p>
            <div className="mt-4 grid gap-10 lg:grid-cols-2">
              <div className="space-y-5">
                <h2 className="font-sans text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
                  Writing on process, criticism, and production.
                </h2>
                <p className="max-w-3xl text-[1rem] leading-7 text-white/62 md:text-[1.05rem]">
                  This section gathers writing on scenic design practice, theatre process, and
                  production analysis. Some pieces are essays; others are profiles, interviews, or
                  published reflections tied to specific projects.
                </p>
                <p className="max-w-3xl text-[1rem] leading-7 text-white/55 md:text-[1.05rem]">
                  Together they document how design ideas are researched, communicated, and carried
                  into production, while also tracing the broader artistic questions behind the work.
                </p>
              </div>

              <div className="space-y-4 rounded-xl bg-card/20 p-6 md:p-8">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Focus Areas
                </h3>
                <ul className="space-y-3 text-sm text-white/62 md:text-base">
                  <li>Scenic design process and production method</li>
                  <li>Design communication, drafting, and rendering workflow</li>
                  <li>Critical writing on theatre and performance</li>
                  <li>Editorial features, interviews, and profiles</li>
                  <li>Context for the portfolio and the work behind it</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
