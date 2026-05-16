"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useLocation } from "wouter";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { formatUtcDate } from "@/lib/date-format";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG,
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  type LearningPortalTag,
} from "@shared/learningPortal";
import { getLocalArticles } from "@shared/localArticles";
import { getLocalTutorials } from "@shared/localStudio";

type SortKey = "newest" | "alphabetical" | "duration";
type ViewMode = "grid" | "list";

type TutorialCardItem = {
  id: number | string;
  slug: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  duration?: string | number | null;
  category?: string | null;
  difficulty?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  tags?: LearningPortalTag[];
};

type LearningArticleItem = {
  id: number | string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  publishedAt?: string | Date | null;
  createdAt?: string | Date | null;
  readTime?: number | null;
  categoryName?: string | null;
  tags?: LearningPortalTag[];
};

type LearningCardItem = {
  id: string;
  title: string;
  summary: string;
  href: string;
  coverImageUrl?: string | null;
  coverImageAlt: string;
  categoryLabel: string;
  difficultyLabel?: string | null;
  metaLabel: string;
  tags: LearningPortalTag[];
  searchableText: string;
  timestamp: number;
  durationSort: number;
};

const CATEGORY_LABELS = [
  { slug: "getting-started", name: "Getting Started" },
  { slug: "2d-drafting", name: "2D Drafting" },
  { slug: "3d-modeling", name: "3D Modeling" },
  { slug: "rendering", name: "Rendering" },
] as const;

const DIFFICULTY_LABELS = [
  { slug: "beginner", name: "Beginner" },
  { slug: "intermediate", name: "Intermediate" },
  { slug: "advanced", name: "Advanced" },
] as const;

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "newest", label: "Newest first" },
  { key: "alphabetical", label: "Article title" },
  { key: "duration", label: "Longest first" },
];

const TUTORIAL_COVER_VARIANTS = {
  "getting-started": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-3.png",
  ],
  "2d-drafting": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-3.png",
  ],
  "3d-modeling": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-3.png",
  ],
  rendering: [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-3.png",
  ],
} as const;

const normalizeToken = (value: string | null | undefined) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getStableVariantIndex = (value: string, total: number) => {
  const hash = value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return hash % total;
};

const getCategoryLabel = (value: string | null | undefined) => {
  const normalized = normalizeToken(value);
  return CATEGORY_LABELS.find((category) => category.slug === normalized)?.name || value || "Tutorial";
};

const getDifficultyLabel = (value: string | null | undefined) => {
  const normalized = normalizeToken(value);
  return DIFFICULTY_LABELS.find((difficulty) => difficulty.slug === normalized)?.name || value || "General";
};

const getTutorialSummary = (tutorial: TutorialCardItem) => {
  if (tutorial.description && String(tutorial.description).trim()) {
    return tutorial.description;
  }

  const category = getCategoryLabel(tutorial.category);
  const difficulty = getDifficultyLabel(tutorial.difficulty);
  const topic = tutorial.title
    .replace(/^Vectorworks Tutorial:\s*/i, "")
    .replace(/^Vectorworks Quick Tip:\s*/i, "")
    .trim();

  return `${category} tutorial covering ${topic} with a ${difficulty.toLowerCase()} workflow focus.`;
};

const getTutorialTimestamp = (tutorial: TutorialCardItem) =>
  new Date(tutorial.publishedAt || tutorial.createdAt || tutorial.updatedAt || 0).getTime();

const getArticleTimestamp = (article: LearningArticleItem) =>
  new Date(article.publishedAt || article.createdAt || 0).getTime();

const formatLearningDate = (date: string | Date | null | undefined) =>
  formatUtcDate(date, "short");

const getTagNames = (tags: LearningPortalTag[] | null | undefined) =>
  (tags || []).map((tag) => tag.name).filter(Boolean);

const formatDuration = (duration: TutorialCardItem["duration"]) => {
  if (!duration) return "10 min";

  if (typeof duration === "string") {
    if (duration.includes(":")) {
      const [mins] = duration.split(":");
      return `${mins || duration} min`;
    }

    return duration;
  }

  return `${Math.max(1, Math.floor(Number(duration) / 60))} min`;
};

const formatReadTime = (readTime: LearningArticleItem["readTime"]) =>
  `${Math.max(1, Number(readTime || 5))} min read`;

const getTutorialCoverImage = (tutorial: TutorialCardItem) => {
  const category = normalizeToken(tutorial.category);
  const variants =
    TUTORIAL_COVER_VARIANTS[category as keyof typeof TUTORIAL_COVER_VARIANTS] ||
    TUTORIAL_COVER_VARIANTS["getting-started"];
  const variantIndex = getStableVariantIndex(String(tutorial.slug || tutorial.id), variants.length);

  return {
    src: variants[variantIndex],
    alt: `Abstract tutorial cover for ${getCategoryLabel(tutorial.category)}`,
  };
};

function LearningGridCard({ item, eager }: { item: LearningCardItem; eager?: boolean }) {
  return (
    <a href={item.href} className="group block">
      <div className="relative aspect-[1/1] overflow-hidden bg-background/50">
        {item.coverImageUrl ? (
          <Image
            src={item.coverImageUrl}
            alt={item.coverImageAlt}
            fill
            quality={84}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading={eager ? "eager" : "lazy"}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 94vw"
          />
        ) : (
          <div className="h-full w-full bg-white/[0.04]" />
        )}
      </div>
      <div className="pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
          {item.metaLabel}
        </p>
        <p className="mt-2 text-[1.02rem] font-normal tracking-[-0.02em] text-white/88">
          {item.title}
        </p>
      </div>
    </a>
  );
}

function FeaturedLearningCard({ item }: { item: LearningCardItem }) {
  return (
    <a href={item.href} className="group block">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-end">
        <div className="relative aspect-[1/1] overflow-hidden bg-background/50 md:aspect-[4/3] lg:aspect-[16/9]">
          {item.coverImageUrl ? (
            <Image
              src={item.coverImageUrl}
              alt={item.coverImageAlt}
              fill
              quality={86}
              priority
              sizes="(min-width: 1280px) 58vw, (min-width: 768px) 82vw, 94vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="h-full w-full bg-white/[0.04]" />
          )}
        </div>

        <div className="max-w-xl pb-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
            Latest · {item.metaLabel}
          </p>
          <h2 className="mt-3 font-sans text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">
            {item.title}
          </h2>
          <p className="mt-4 text-[1rem] leading-7 text-white/58">{item.summary}</p>
        </div>
      </div>
    </a>
  );
}

export default function StudioTutorials() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const allTutorials = useMemo<TutorialCardItem[]>(
    () =>
      getLocalTutorials().map((tutorial: any) => ({
        id: tutorial.id,
        slug: String(tutorial.slug || tutorial.id),
        title: tutorial.title,
        description: tutorial.description,
        coverImage: tutorial.cover_image,
        duration: tutorial.duration,
        category: tutorial.category,
        difficulty: tutorial.difficulty,
        publishedAt: tutorial.published_at,
        createdAt: tutorial.created_at,
        updatedAt: tutorial.updated_at,
        tags: tutorial.tags || [],
      })),
    []
  );

  const learningArticles = useMemo<LearningArticleItem[]>(() => {
    return getLocalArticles()
      .filter((article) => LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
      .map((article) => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        coverImageUrl: article.coverImageUrl,
        coverImageAlt: article.coverImageAlt,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        readTime: article.readTime,
        categoryName: article.categoryName,
        tags: article.tags || [],
      }))
      .sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
  }, []);

  const combinedLearningItems = useMemo<LearningCardItem[]>(() => {
    const tutorialItems = allTutorials.map((tutorial) => {
      const cover = getTutorialCoverImage(tutorial);
      const summary = getTutorialSummary(tutorial);
      const categoryLabel = getCategoryLabel(tutorial.category);
      const difficultyLabel = getDifficultyLabel(tutorial.difficulty);
      const dateLabel = formatLearningDate(tutorial.publishedAt || tutorial.createdAt);
      const tagNames = getTagNames(tutorial.tags);
      const metaLabel = [
        categoryLabel,
        dateLabel,
        difficultyLabel,
        formatDuration(tutorial.duration),
      ]
        .filter(Boolean)
        .join(" · ");

      return {
        id: `tutorial-${tutorial.slug}`,
        title: tutorial.title,
        summary,
        href: `/studio/tutorials/${tutorial.slug}`,
        coverImageUrl: cover.src,
        coverImageAlt: cover.alt,
        categoryLabel,
        difficultyLabel,
        metaLabel,
        tags: tutorial.tags || [],
        searchableText: [
          tutorial.title,
          summary,
          tutorial.category,
          tutorial.difficulty,
          metaLabel,
          ...tagNames,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
        timestamp: getTutorialTimestamp(tutorial),
        durationSort: Number(tutorial.duration || 0),
      };
    });

    const articleItems = learningArticles.map((article) => {
      const summary = article.excerpt || `${article.title} article guide for scenic design learning.`;
      const categoryLabel =
        LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG[article.slug] || article.categoryName || "Learning";
      const dateLabel = formatLearningDate(article.publishedAt || article.createdAt);
      const tagNames = getTagNames(article.tags);
      const metaLabel = [categoryLabel, dateLabel, formatReadTime(article.readTime)]
        .filter(Boolean)
        .join(" · ");

      return {
        id: `article-${article.slug}`,
        title: article.title,
        summary,
        href: `/studio/tutorials/${article.slug}`,
        coverImageUrl: article.coverImageUrl,
        coverImageAlt: article.coverImageAlt || `Cover image for ${article.title}`,
        categoryLabel,
        difficultyLabel: null,
        metaLabel,
        tags: article.tags || [],
        searchableText: [article.title, summary, article.categoryName, metaLabel, ...tagNames]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
        timestamp: getArticleTimestamp(article),
        durationSort: Number(article.readTime || 0) * 60,
      };
    });

    return [...tutorialItems, ...articleItems].sort((a, b) => {
      const timeCompare = b.timestamp - a.timestamp;
      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });
  }, [allTutorials, learningArticles]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(combinedLearningItems.map((item) => item.categoryLabel).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [combinedLearningItems]);

  const difficulties = useMemo(() => {
    return Array.from(
      new Set(
        allTutorials
          .map((tutorial) => getDifficultyLabel(tutorial.difficulty))
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [allTutorials]);

  const filteredLearningItems = useMemo(() => {
    return combinedLearningItems.filter((item) => {
      if (selectedCategory !== "all" && item.categoryLabel !== selectedCategory) {
        return false;
      }

      if (selectedDifficulty !== "all" && item.difficultyLabel !== selectedDifficulty) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!item.searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [combinedLearningItems, searchQuery, selectedCategory, selectedDifficulty]);

  const sortedLearningItems = useMemo(() => {
    const list = [...filteredLearningItems];

    list.sort((a, b) => {
      if (sortKey === "alphabetical") {
        return a.title.localeCompare(b.title);
      }

      if (sortKey === "duration") {
        return b.durationSort - a.durationSort;
      }

      const timeCompare = b.timestamp - a.timestamp;
      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [filteredLearningItems, sortKey]);

  const showFeaturedLearning =
    viewMode === "grid" &&
    selectedCategory === "all" &&
    selectedDifficulty === "all" &&
    !searchQuery.trim() &&
    sortKey === "newest";
  const featuredLearningItem = showFeaturedLearning ? sortedLearningItems[0] : null;
  const gridLearningItems = featuredLearningItem ? sortedLearningItems.slice(1) : sortedLearningItems;

  const activeFilterCount =
    (selectedDifficulty !== "all" ? 1 : 0) + (searchQuery.trim() ? 1 : 0);
  const currentHeading = selectedCategory !== "all" ? selectedCategory : "Scenic Design Learning";

  const tutorialArchiveTitle =
    selectedCategory !== "all"
      ? `${selectedCategory} Tutorials | Brandon PT Davis`
      : "Scenic Design Learning | Brandon PT Davis";
  const tutorialArchiveDescription =
    selectedCategory !== "all"
      ? `Browse ${selectedCategory.toLowerCase()} tutorials by Brandon PT Davis, shaped for scenic drafting, modeling, rendering, and production workflow.`
      : "A scenic design learning portal by Brandon PT Davis, combining Vectorworks video lessons, article guides, drafting references, rendering workflows, and design process resources.";
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={tutorialArchiveTitle}
        description={tutorialArchiveDescription}
        keywords="vectorworks tutorials, scenic design tutorials, drafting tutorials, rendering tutorials, theatrical design workflow"
        url="https://www.brandonptdavis.com/studio/tutorials"
      />
      <Header />

      <main>
        <section className="border-b border-border/40 pb-8 pt-24 md:pb-10 md:pt-28">
          <div className="container max-w-[88rem]">
            <div className="max-w-3xl">
              <h1 className="font-sans text-[clamp(2.3rem,4.6vw,3.8rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                {currentHeading}
              </h1>
              <p className="mt-5 max-w-3xl text-[1rem] leading-7 text-white/58 md:text-[1.05rem]">
                Lessons, article guides, and references for scenic designers learning to draft,
                model, render, present, and think through production work with more clarity.
              </p>
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
                <div className="relative min-w-[16rem] flex-1 md:max-w-sm">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/42" />
                  <Input
                    placeholder="Search learning"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-10 rounded-full border-border/50 bg-background pl-9 text-sm text-white placeholder:text-white/35"
                  />
                </div>

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
                          <p className="text-xs text-white/52">Refine by difficulty level.</p>
                        </div>
                        {selectedDifficulty !== "all" ? (
                          <button
                            type="button"
                            onClick={() => setSelectedDifficulty("all")}
                            className="text-xs text-white/55 transition-colors hover:text-white"
                          >
                            Clear
                          </button>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                          Difficulty
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedDifficulty("all")}
                            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                              selectedDifficulty === "all"
                                ? "border-white/30 bg-white/10 text-white"
                                : "border-border/50 text-white/62 hover:border-border hover:text-white"
                            }`}
                          >
                            All levels
                          </button>
                          {difficulties.map((difficulty) => (
                            <button
                              key={difficulty}
                              type="button"
                              onClick={() => setSelectedDifficulty(difficulty)}
                              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                                selectedDifficulty === difficulty
                                  ? "border-white/30 bg-white/10 text-white"
                                  : "border-border/50 text-white/62 hover:border-border hover:text-white"
                              }`}
                            >
                              {difficulty}
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

        {sortedLearningItems.length > 0 ? (
          <>
            <section className="pb-20 pt-12 md:pb-28 md:pt-14">
              <div className="container max-w-[88rem]">
                {viewMode === "grid" ? (
                  <>
                    {featuredLearningItem ? (
                      <div className="mb-12 md:mb-16">
                        <FeaturedLearningCard item={featuredLearningItem} />
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {gridLearningItems.map((item, index) => (
                        <LearningGridCard
                          key={`${item.id}-${selectedCategory}-${selectedDifficulty}-${sortKey}-${viewMode}`}
                          eager={!featuredLearningItem && index < 2}
                          item={item}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="border-t border-border/35">
                    {sortedLearningItems.map((item) => (
                      <a
                        key={`${item.id}-${selectedCategory}-${selectedDifficulty}-${sortKey}-${viewMode}`}
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          setLocation(item.href);
                        }}
                        className="group grid gap-4 border-b border-border/35 py-5 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8"
                      >
                        <div className="space-y-2 text-sm text-white/48">
                          <p className="text-white/82">{item.categoryLabel}</p>
                          <p>{item.metaLabel}</p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[1.12rem] font-normal tracking-[-0.025em] text-white/88">
                            {item.title}
                          </p>
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/52">
                            {item.summary}
                          </p>
                          <div className="mt-3 text-sm text-white/52">Read article</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="pb-24 pt-16">
            <div className="container max-w-[88rem] text-center">
              <p className="text-white/55">No learning articles match the current filters.</p>
            </div>
          </section>
        )}

        <section className="border-t border-border/35 py-16 md:py-20">
          <div className="container max-w-[88rem]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
              About These Tutorials
            </p>
            <div className="mt-4 grid gap-10 lg:grid-cols-2">
              <div className="space-y-5">
                <h2 className="font-sans text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
                  Tutorials as an archive, not just a training shelf.
                </h2>
                <p className="max-w-3xl text-[1rem] leading-7 text-white/62 md:text-[1.05rem]">
                  This page is shifting toward the same editorial logic as the Articles archive:
                  clearer indexing, cleaner filtering, and a format that can eventually support a
                  more blog-like tutorial publishing rhythm.
                </p>
                <p className="max-w-3xl text-[1rem] leading-7 text-white/55 md:text-[1.05rem]">
                  For now, the focus is on making the landing page feel more like an archive of
                  posts and less like a separate app section, while still keeping the tutorials easy
                  to browse by category, difficulty, and duration.
                </p>
              </div>

              <div className="space-y-4 rounded-xl bg-card/20 p-6 md:p-8">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Archive Direction
                </h3>
                <ul className="space-y-3 text-sm text-white/62 md:text-base">
                  <li>Cleaner editorial landing page structure</li>
                  <li>Archive-style grid and list views</li>
                  <li>Category-led browsing like Articles</li>
                  <li>Room for tutorial publishing to feel more like a blog</li>
                  <li>Better alignment between writing and teaching sections</li>
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
