"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Layers3,
  MonitorPlay,
  PenTool,
  Presentation,
  Ruler,
  SlidersHorizontal,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AnimatedSection } from "@/components/AnimatedSection";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { SEO } from "@/components/SEO";
import { formatUtcDate } from "@/lib/date-format";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG,
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  type LearningPortalTag,
} from "@shared/learningPortal";
import { getLocalArticles } from "@shared/localArticles";
import { getLocalTutorials } from "@shared/localStudio";

const ITEMS_PER_PAGE = 8;

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

type CategoryStyle = {
  icon: LucideIcon;
  color: string;
  bg: string;
  chip: string;
};

const LEARNING_CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Getting Started": {
    icon: BookOpen,
    color: "text-[#5f16ff]",
    bg: "bg-[#5f16ff]/12",
    chip: "bg-[#5f16ff] text-white",
  },
  "2D Drafting": {
    icon: Ruler,
    color: "text-[#0057ff]",
    bg: "bg-[#0057ff]/12",
    chip: "bg-[#0057ff] text-white",
  },
  "3D Modeling": {
    icon: Layers3,
    color: "text-[#008c84]",
    bg: "bg-[#008c84]/12",
    chip: "bg-[#008c84] text-white",
  },
  Rendering: {
    icon: MonitorPlay,
    color: "text-[#e0007a]",
    bg: "bg-[#e0007a]/12",
    chip: "bg-[#e0007a] text-white",
  },
  "Design Communication": {
    icon: Presentation,
    color: "text-[#ff7a00]",
    bg: "bg-[#ff7a00]/[0.14]",
    chip: "bg-[#ff7a00] text-white",
  },
  "Career & Practice": {
    icon: BriefcaseBusiness,
    color: "text-[#c36a00]",
    bg: "bg-[#ffb000]/20",
    chip: "bg-[#ffb000] text-white",
  },
  "Design Process": {
    icon: PenTool,
    color: "text-[#5f16ff]",
    bg: "bg-[#5f16ff]/12",
    chip: "bg-[#5f16ff] text-white",
  },
  Portfolio: {
    icon: FileText,
    color: "text-[#008c84]",
    bg: "bg-[#008c84]/12",
    chip: "bg-[#008c84] text-white",
  },
  Technology: {
    icon: Ruler,
    color: "text-[#0057ff]",
    bg: "bg-[#0057ff]/12",
    chip: "bg-[#0057ff] text-white",
  },
  "Design Thinking": {
    icon: Sparkles,
    color: "text-[#ce2fff]",
    bg: "bg-[#ce2fff]/[0.14]",
    chip: "bg-[#ce2fff] text-white",
  },
};

const DEFAULT_LEARNING_CATEGORY_STYLE: CategoryStyle = {
  icon: Sparkles,
  color: "text-[#006cff]",
  bg: "bg-[#006cff]/12",
  chip: "bg-[#006cff] text-white",
};

const getLearningCategoryStyle = (category: string | null | undefined) =>
  LEARNING_CATEGORY_STYLES[category || ""] || DEFAULT_LEARNING_CATEGORY_STYLE;

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

function LearningGridCard({
  item,
  eager,
  onCategoryNavigate,
  stagger = 0,
}: {
  item: LearningCardItem;
  eager?: boolean;
  onCategoryNavigate: (category: string | null | undefined) => void;
  stagger?: number;
}) {
  const categoryStyle = getLearningCategoryStyle(item.categoryLabel);
  const CategoryIcon = categoryStyle.icon;
  const dateLabel = item.metaLabel.split(" · ")[1] || item.metaLabel;

  return (
    <AnimatedSection delay={Math.min(stagger * 70, 420)}>
      <a
        href={item.href}
        className="group block h-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_14px_34px_rgba(17,17,17,0.07)] ring-1 ring-black/[0.04] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(17,17,17,0.11)]"
      >
        <div className="flex h-full flex-col">
        <div className="publish-card-media relative aspect-[16/9] overflow-hidden bg-black/[0.04]">
          {item.coverImageUrl ? (
            <Image
              src={item.coverImageUrl}
              alt={item.coverImageAlt}
              fill
              quality={84}
              className="publish-card-image object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
              loading={eager ? "eager" : "lazy"}
              sizes="(min-width: 1280px) 29vw, (min-width: 768px) 30vw, 94vw"
            />
          ) : (
            <div className="h-full w-full bg-white/[0.04]" />
          )}
        </div>
        <div className="flex min-h-[13.75rem] flex-1 flex-col px-8 pb-8 pt-7">
          <div className="mb-5 flex items-center gap-2">
            <span
              role="link"
              tabIndex={0}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onCategoryNavigate(item.categoryLabel);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onCategoryNavigate(item.categoryLabel);
                }
              }}
              className={`publish-category-chip inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold leading-none tracking-[-0.015em] shadow-[0_5px_16px_rgba(17,17,17,0.12)] transition-transform hover:scale-[1.025] ${categoryStyle.chip}`}
            >
              <CategoryIcon className="h-4 w-4" strokeWidth={2.8} />
              {item.categoryLabel}
            </span>
          </div>
          <p className="max-w-[27rem] text-[1.55rem] font-semibold leading-[1.02] tracking-[-0.058em] text-[#111111] transition-colors duration-500 group-hover:text-[#7b2cff]">
            {item.title}
          </p>
          <span className="mt-auto pt-8 text-[1rem] font-semibold tracking-[-0.025em] text-[#6f6b64]">
            {dateLabel}
          </span>
        </div>
        </div>
      </a>
    </AnimatedSection>
  );
}

export default function StudioTutorials() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState(selectedCategory);
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredLearningItems = useMemo(() => {
    return combinedLearningItems.filter((item) => {
      if (selectedCategory !== "all" && item.categoryLabel !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [combinedLearningItems, selectedCategory]);

  const sortedLearningItems = useMemo(() => {
    const list = [...filteredLearningItems];

    list.sort((a, b) => {
      const timeCompare = b.timestamp - a.timestamp;
      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [filteredLearningItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(sortedLearningItems.length / ITEMS_PER_PAGE));
  const pagedLearningItems = sortedLearningItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const activeFilterCount = selectedCategory !== "all" ? 1 : 0;
  const currentHeading = selectedCategory !== "all" ? selectedCategory : "Scenic Design Learning";

  const openFilter = () => {
    setDraftCategory(selectedCategory);
    setFilterOpen(true);
  };

  const applyFilters = () => {
    setSelectedCategory(draftCategory);
    setFilterOpen(false);
  };

  const navigateToCategory = (category: string | null | undefined) => {
    const nextCategory = category || "all";
    setSelectedCategory(nextCategory);
    if (typeof window !== "undefined") {
      const query = nextCategory === "all" ? "" : `?category=${encodeURIComponent(nextCategory)}`;
      window.history.pushState(null, "", `/studio/tutorials${query}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const tutorialArchiveTitle =
    selectedCategory !== "all"
      ? `${selectedCategory} Tutorials | Brandon PT Davis`
      : "Scenic Design Learning | Brandon PT Davis";
  const tutorialArchiveDescription =
    selectedCategory !== "all"
      ? `Browse ${selectedCategory.toLowerCase()} tutorials by Brandon PT Davis, shaped for scenic drafting, modeling, rendering, and production workflow.`
      : "A scenic design learning portal by Brandon PT Davis, combining Vectorworks video lessons, article guides, drafting references, rendering workflows, and design process resources.";
  return (
    <div className="publish-editorial min-h-screen bg-[#f1f0ec] text-[#111111]">
      <SEO
        title={tutorialArchiveTitle}
        description={tutorialArchiveDescription}
        keywords="vectorworks tutorials, scenic design tutorials, drafting tutorials, rendering tutorials, theatrical design workflow"
        url="https://www.brandonptdavis.com/studio/tutorials"
      />
      <Header />
      <PublishingTopBar active="tutorials" />

      <main>
        <section className="pb-8 pt-0 md:pb-12">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <AnimatedSection>
              <div className="mx-auto mt-14 grid max-w-[76rem] gap-6 border-b border-black/12 pb-8 md:mt-18 md:grid-cols-[minmax(0,0.72fr)_minmax(20rem,0.28fr)] md:items-end md:pb-10">
                <div>
                <p className="mb-5 text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-none tracking-[-0.035em] text-[#6f6b64]">
                  Brandon PT Davis + Tutorials
                </p>
                <h1 className="font-sans text-[clamp(3.2rem,7vw,7.1rem)] font-medium leading-[0.86] tracking-[-0.075em] text-[#111111]">
                  {currentHeading}
                </h1>
                </div>
                <p className="max-w-[31rem] text-[1.05rem] leading-7 text-[#5d5851] md:text-[1.12rem]">
                  Tutorials, article guides, and studio references for scenic designers learning to
                  draft, model, render, present, and think through production work with more clarity.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogContent
            showCloseButton={false}
            overlayClassName="bg-[#f1f0ec]/55 backdrop-blur-2xl"
            className="max-h-[min(88vh,46rem)] max-w-[min(46rem,calc(100vw-2rem))] overflow-y-auto rounded-[1.7rem] border-0 bg-[#fbfaf7] p-8 text-[#111111] shadow-[0_35px_110px_rgba(17,17,17,0.24)] sm:p-10"
          >
            <DialogClose className="absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.06] text-[#6f6b64] transition-colors hover:bg-black/[0.1] hover:text-[#111111]">
              <X className="h-5 w-5" />
              <span className="sr-only">Close filters</span>
            </DialogClose>
            <div className="pl-14 sm:pl-16">
              <DialogTitle className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.06em]">
                Filter by
              </DialogTitle>
            </div>

            <div className="mt-10 space-y-9">
              <div>
                <p className="mb-4 text-[0.92rem] font-semibold tracking-[-0.02em] text-[#6f6b64]">Category</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setDraftCategory("all")}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[1rem] font-semibold tracking-[-0.025em] transition-colors ${
                      draftCategory === "all"
                        ? "bg-[#111111] text-[#fbfaf7]"
                        : "bg-black/[0.055] text-[#24211f] hover:bg-black/[0.09]"
                    }`}
                  >
                    <PenTool className="h-4 w-4" strokeWidth={2.8} />
                    All
                  </button>
                  {categories.map((category) => {
                    const categoryStyle = getLearningCategoryStyle(category);
                    const CategoryIcon = categoryStyle.icon;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setDraftCategory(category)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[1rem] font-semibold tracking-[-0.025em] transition-colors ${
                          draftCategory === category
                            ? `${categoryStyle.bg} ${categoryStyle.color} ring-1 ring-current/25`
                            : "bg-black/[0.055] text-[#24211f] hover:bg-black/[0.09]"
                        }`}
                      >
                        <CategoryIcon className="h-4 w-4" strokeWidth={2.8} />
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={applyFilters}
                  className="rounded-full bg-[#7b2cff] px-7 py-3 text-[1rem] font-semibold tracking-[-0.025em] text-white transition-colors hover:bg-[#6822e6]"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftCategory("all");
                  }}
                  className="rounded-full bg-black/[0.055] px-5 py-3 text-[1rem] font-semibold tracking-[-0.025em] text-[#5d5851] transition-colors hover:bg-black/[0.09] hover:text-[#111111]"
                >
                  Clear
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {sortedLearningItems.length > 0 ? (
          <>
            <section className="pb-20 pt-12 md:pb-28 md:pt-14">
              <div className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)]">
                <div className="mb-8 flex items-center justify-start">
                  <button
                    type="button"
                    onClick={openFilter}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#fbfaf7] px-5 text-[0.95rem] font-semibold tracking-[-0.02em] text-[#111111] shadow-[0_8px_28px_rgba(17,17,17,0.08)] ring-1 ring-black/[0.08] transition-colors hover:bg-white"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                    {activeFilterCount > 0 ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#111111] px-1.5 text-[0.72rem] leading-none text-[#f1f0ec]">
                        {activeFilterCount}
                      </span>
                    ) : null}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                  {pagedLearningItems.map((item, index) => (
                      <LearningGridCard
                        key={`${item.id}-${selectedCategory}-${currentPage}`}
                        eager={index < 2}
                        item={item}
                        onCategoryNavigate={navigateToCategory}
                        stagger={index}
                      />
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => changePage(page)}
                        className={`h-10 min-w-10 rounded-full px-3 text-[0.95rem] font-semibold tracking-[-0.02em] transition-colors ${
                          currentPage === page
                            ? "bg-[#111111] text-[#fbfaf7]"
                            : "bg-[#fbfaf7] text-[#5d5851] shadow-sm ring-1 ring-black/[0.06] hover:text-[#111111]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          </>
        ) : (
          <section className="pb-24 pt-16">
            <div className="container max-w-[88rem] text-center">
              <p className="text-[#5d5851]">No learning articles match the current filters.</p>
            </div>
          </section>
        )}

        <section className="border-t border-black/10 py-16 md:py-20">
          <div className="container max-w-[88rem]">
            <AnimatedSection>
              <p className="text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-none tracking-[-0.035em] text-[#6f6b64]">
                Learning Paths
              </p>
              <div className="mt-6 grid border-t border-black/10 md:grid-cols-3">
                {[
                  [
                    "Drafting",
                    "Clean drawing habits, 2D organization, and scenic documentation workflows that support production communication.",
                  ],
                  [
                    "Modeling",
                    "Practical 3D processes for scenic designers moving from spatial ideas into working digital environments.",
                  ],
                  [
                    "Rendering",
                    "Presentation image workflows for atmosphere, light, materials, and visual storytelling in scenic design.",
                  ],
                ].map(([title, body]) => (
                  <div
                    key={title}
                    className="border-b border-black/10 py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                  >
                    <h2 className="text-[1.1rem] font-semibold leading-tight tracking-[-0.03em] text-[#111111]">
                      {title}
                    </h2>
                    <p className="mt-3 max-w-[26rem] text-[0.94rem] leading-6 text-[#5d5851]">
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
