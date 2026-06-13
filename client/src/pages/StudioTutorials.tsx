"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MotionReveal from "@/components/MotionReveal";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { SEO } from "@/components/SEO";
import { formatUtcDate } from "@/lib/date-format";
import {
  LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG,
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  type LearningPortalTag,
} from "@shared/learningPortal";
import { getLocalArticles } from "@shared/localArticles";
import { getLocalTutorials } from "@shared/localStudio";

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
  timestamp: number;
  monthKey: string;
  monthLabel: string;
  yearLabel: string;
};

type StudioTutorialsProps = {
  variant?: "landing" | "archive";
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

const cleanTitle = (title: string) =>
  title
    .replace(/^Vectorworks Tutorial:\s*/i, "")
    .replace(/^Vectorworks Quick Tip:\s*/i, "")
    .trim();

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
  return `${category} tutorial with a ${difficulty.toLowerCase()} workflow focus for scenic design production.`;
};

const getTutorialTimestamp = (tutorial: TutorialCardItem) =>
  new Date(tutorial.publishedAt || tutorial.createdAt || tutorial.updatedAt || 0).getTime();

const getArticleTimestamp = (article: LearningArticleItem) =>
  new Date(article.publishedAt || article.createdAt || 0).getTime();

const formatLearningDate = (date: string | Date | null | undefined) =>
  formatUtcDate(date, "short");

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
  if (tutorial.coverImage) {
    return {
      src: tutorial.coverImage,
      alt: `Tutorial cover for ${cleanTitle(tutorial.title)}`,
    };
  }

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

const getMonthKey = (timestamp: number) => {
  if (!timestamp || Number.isNaN(timestamp)) return "undated";
  const date = new Date(timestamp);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};

const getMonthLabel = (timestamp: number) => {
  if (!timestamp || Number.isNaN(timestamp)) return "Undated";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(timestamp));
};

const getYearLabel = (timestamp: number) => {
  if (!timestamp || Number.isNaN(timestamp)) return "Undated";
  return String(new Date(timestamp).getUTCFullYear());
};

const getCategoryChipClass = (category: string) => {
  const token = normalizeToken(category);
  if (token.includes("render")) return "bg-[#0066cc] text-white";
  if (token.includes("model")) return "bg-[#0a7d73] text-white";
  if (token.includes("draft")) return "bg-[#6f2dff] text-white";
  if (token.includes("career") || token.includes("practice")) return "bg-[#d97800] text-white";
  return "bg-[#1d1d1f] text-white";
};

function StoryImage({
  item,
  priority = false,
  sizes,
}: {
  item: LearningCardItem;
  priority?: boolean;
  sizes: string;
}) {
  if (!item.coverImageUrl) {
    return <div className="h-full w-full bg-[#e8e8ed]" />;
  }

  return (
    <Image
      src={item.coverImageUrl}
      alt={item.coverImageAlt}
      fill
      priority={priority}
      quality={86}
      className="learning-card-image object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
      sizes={sizes}
    />
  );
}

function FeaturedStory({ item, priority = false }: { item: LearningCardItem; priority?: boolean }) {
  return (
    <a href={item.href} className="publish-motion-card group block">
      <div className="learning-card-media relative aspect-[16/8.2] min-h-[18rem] overflow-hidden rounded-[1.65rem] bg-[#e8e8ed] shadow-[0_24px_70px_rgba(29,29,31,0.08)] md:min-h-[30rem]">
        <StoryImage item={item} priority={priority} sizes="(min-width: 1280px) 76rem, 92vw" />
      </div>
      <div className="learning-card-copy pt-8">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.82rem] font-semibold uppercase leading-none tracking-[-0.01em] ${getCategoryChipClass(item.categoryLabel)}`}>
          {item.categoryLabel}
        </span>
        <h2 className="mt-4 max-w-[15ch] text-[clamp(2.5rem,5vw,4.9rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-[#1d1d1f]">
          {item.title}
        </h2>
        <p className="mt-5 text-[1.15rem] font-medium tracking-[-0.025em] text-[#6e6e73]">
          {item.metaLabel}
        </p>
      </div>
    </a>
  );
}

function StoryGroup({
  featuredItem,
  spotlightItems,
  priority = false,
}: {
  featuredItem: LearningCardItem;
  spotlightItems: LearningCardItem[];
  priority?: boolean;
}) {
  return (
    <section className="bg-[#f1f0ec] pb-24 md:pb-32">
      <div className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)]">
        <MotionReveal>
          <FeaturedStory item={featuredItem} priority={priority} />
        </MotionReveal>
        {spotlightItems.length ? (
          <div className="mt-20 grid gap-9 md:grid-cols-2">
            {spotlightItems.map((item, index) => (
              <MotionReveal key={item.id} delay={120 + index * 90}>
                <SpotlightCard item={item} />
              </MotionReveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SpotlightCard({ item }: { item: LearningCardItem }) {
  return (
    <a href={item.href} className="publish-motion-card group block">
      <div className="learning-card-media relative aspect-[1.02/1] overflow-hidden rounded-[1.65rem] bg-[#e8e8ed]">
        <StoryImage item={item} sizes="(min-width: 1024px) 36vw, 90vw" />
      </div>
      <div className="learning-card-copy pt-6">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.78rem] font-semibold uppercase leading-none tracking-[-0.01em] ${getCategoryChipClass(item.categoryLabel)}`}>
          {item.categoryLabel}
        </span>
        <h3 className="mt-4 max-w-[16ch] text-[clamp(1.55rem,2.7vw,2.25rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#1d1d1f]">
          {item.title}
        </h3>
        <p className="mt-4 text-[1.02rem] font-medium tracking-[-0.02em] text-[#6e6e73]">
          {item.metaLabel}
        </p>
      </div>
    </a>
  );
}

function ArchiveRow({ item }: { item: LearningCardItem }) {
  return (
    <MotionReveal>
      <a
        href={item.href}
        className="publish-motion-card group grid gap-6 border-t border-[#d2d2d7] py-8 transition-colors hover:border-[#a1a1a6] md:grid-cols-[20rem_minmax(0,1fr)] md:gap-9 md:py-10"
      >
        <div className="learning-card-media relative aspect-[16/9] overflow-hidden rounded-[1.35rem] bg-[#e8e8ed]">
          <StoryImage item={item} sizes="(min-width: 1024px) 20rem, 90vw" />
        </div>
        <div className="learning-card-copy self-center">
          <p className="text-[0.86rem] font-semibold uppercase tracking-[-0.01em] text-[#6e6e73]">
            {item.categoryLabel}
          </p>
          <h3 className="mt-3 max-w-[28ch] text-[clamp(1.55rem,2.4vw,2.15rem)] font-semibold leading-[1.04] tracking-[-0.055em] text-[#1d1d1f] transition-colors group-hover:text-[#6f2dff]">
            {item.title}
          </h3>
          <p className="mt-5 text-[1rem] font-medium tracking-[-0.02em] text-[#6e6e73]">
            {item.metaLabel}
          </p>
        </div>
      </a>
    </MotionReveal>
  );
}

export default function StudioTutorials({ variant = "landing" }: StudioTutorialsProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const isArchive = variant === "archive";

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
      }));
  }, []);

  const combinedLearningItems = useMemo<LearningCardItem[]>(() => {
    const tutorialItems = allTutorials.map((tutorial) => {
      const cover = getTutorialCoverImage(tutorial);
      const summary = getTutorialSummary(tutorial);
      const categoryLabel = getCategoryLabel(tutorial.category);
      const difficultyLabel = getDifficultyLabel(tutorial.difficulty);
      const timestamp = getTutorialTimestamp(tutorial);
      const metaLabel = [
        formatLearningDate(tutorial.publishedAt || tutorial.createdAt),
        difficultyLabel,
        formatDuration(tutorial.duration),
      ]
        .filter(Boolean)
        .join(" · ");

      return {
        id: `tutorial-${tutorial.slug}`,
        title: cleanTitle(tutorial.title),
        summary,
        href: `/studio/tutorials/${tutorial.slug}`,
        coverImageUrl: cover.src,
        coverImageAlt: cover.alt,
        categoryLabel,
        difficultyLabel,
        metaLabel,
        timestamp,
        monthKey: getMonthKey(timestamp),
        monthLabel: getMonthLabel(timestamp),
        yearLabel: getYearLabel(timestamp),
      };
    });

    const articleItems = learningArticles.map((article) => {
      const timestamp = getArticleTimestamp(article);
      const categoryLabel =
        LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG[article.slug] ||
        article.categoryName ||
        "Learning";
      const metaLabel = [formatLearningDate(article.publishedAt || article.createdAt), formatReadTime(article.readTime)]
        .filter(Boolean)
        .join(" · ");

      return {
        id: `article-${article.slug}`,
        title: cleanTitle(article.title),
        summary: article.excerpt || `${article.title} article guide for scenic design learning.`,
        href: `/studio/tutorials/${article.slug}`,
        coverImageUrl: article.coverImageUrl,
        coverImageAlt: article.coverImageAlt || `Cover image for ${article.title}`,
        categoryLabel,
        difficultyLabel: null,
        metaLabel,
        timestamp,
        monthKey: getMonthKey(timestamp),
        monthLabel: getMonthLabel(timestamp),
        yearLabel: getYearLabel(timestamp),
      };
    });

    return [...tutorialItems, ...articleItems].sort((a, b) => {
      const timeCompare = b.timestamp - a.timestamp;
      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });
  }, [allTutorials, learningArticles]);

  const categories = useMemo(
    () =>
      Array.from(new Set(combinedLearningItems.map((item) => item.categoryLabel).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [combinedLearningItems]
  );

  const yearOptions = useMemo(
    () => Array.from(new Set(combinedLearningItems.map((item) => item.yearLabel))).filter((year) => year !== "Undated"),
    [combinedLearningItems]
  );

  const monthOptions = useMemo(() => {
    const months = new Map<string, string>();
    combinedLearningItems.forEach((item) => {
      if (item.monthKey !== "undated" && (selectedYear === "all" || item.yearLabel === selectedYear)) {
        months.set(item.monthKey, item.monthLabel);
      }
    });
    return Array.from(months, ([key, label]) => ({ key, label }));
  }, [combinedLearningItems, selectedYear]);

  const filteredItems = useMemo(() => {
    return combinedLearningItems.filter((item) => {
      if (selectedCategory !== "all" && item.categoryLabel !== selectedCategory) return false;
      if (selectedYear !== "all" && item.yearLabel !== selectedYear) return false;
      if (selectedMonth !== "all" && item.monthKey !== selectedMonth) return false;
      return true;
    });
  }, [combinedLearningItems, selectedCategory, selectedMonth, selectedYear]);

  const groupedArchiveItems = useMemo(() => {
    return filteredItems.reduce<Array<{ key: string; label: string; items: LearningCardItem[] }>>((groups, item) => {
      const group = groups.find((entry) => entry.key === item.monthKey);
      if (group) {
        group.items.push(item);
      } else {
        groups.push({ key: item.monthKey, label: item.monthLabel, items: [item] });
      }
      return groups;
    }, []);
  }, [filteredItems]);

  const storyGroups = [
    combinedLearningItems.slice(0, 3),
    combinedLearningItems.slice(3, 6),
  ]
    .filter((group) => group.length > 0)
    .map((group) => ({
      featuredItem: group[0],
      spotlightItems: group.slice(1, 3),
    }));
  const hasFilters = selectedCategory !== "all" || selectedYear !== "all" || selectedMonth !== "all";

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedYear("all");
    setSelectedMonth("all");
  };

  return (
    <div className="min-h-screen bg-[#f1f0ec] text-[#1d1d1f]">
      <SEO
        title={isArchive ? "Studio Tutorial Archive | Brandon PT Davis" : "Studio Tutorials | Brandon PT Davis"}
        description={
          isArchive
            ? "Archive of scenic design tutorials, Vectorworks lessons, and production workflow guides by Brandon PT Davis."
            : "Tutorials, article guides, and studio references for scenic designers learning drafting, modeling, rendering, and production workflow."
        }
        keywords="vectorworks tutorials, scenic design tutorials, drafting tutorials, rendering tutorials, theatrical design workflow"
        url={`https://www.brandonptdavis.com/studio/tutorials${isArchive ? "/archive" : ""}`}
      />
      <Header />
      <PublishingTopBar active="tutorials" tone="white" />

      <main>
        {!isArchive ? (
          <>
            <section className="bg-[#f1f0ec] pb-16 pt-24 md:pb-24 md:pt-32">
              <div className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)] text-center">
                <MotionReveal>
                  <p className="text-[clamp(3.6rem,8vw,7rem)] font-semibold leading-none tracking-[-0.075em] text-black">
                    Studio Tutorials
                  </p>
                </MotionReveal>
                <MotionReveal delay={140}>
                  <h1 className="mx-auto mt-7 max-w-[31rem] text-[clamp(1.65rem,2.5vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.05em] text-[#1d1d1f]">
                    Practical scenic design lessons for drafting, modeling, rendering, and production workflows.
                  </h1>
                </MotionReveal>
              </div>
            </section>

            {storyGroups.map((group, index) => (
              <StoryGroup
                key={group.featuredItem.id}
                featuredItem={group.featuredItem}
                spotlightItems={group.spotlightItems}
                priority={index === 0}
              />
            ))}

            <section className="bg-[#f1f0ec] pb-24 pt-2 md:pb-32">
              <div className="mx-auto flex max-w-[76rem] justify-center px-[clamp(1.5rem,5vw,6rem)]">
                <a
                  href="/studio/tutorials/archive"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e5e3dc] px-7 text-[1.02rem] font-semibold tracking-[-0.025em] text-[#1d1d1f] transition-colors hover:bg-[#dad7ce]"
                >
                  View Archive
                </a>
              </div>
            </section>
          </>
        ) : (
          <>
            <section id="studio-archive" className="bg-[#e9e7df]">
              <div className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)] py-9">
                <div className="grid gap-4 md:grid-cols-[auto_minmax(12rem,1fr)_minmax(10rem,1fr)_minmax(10rem,1fr)_auto] md:items-center">
                  <p className="text-[0.98rem] font-semibold tracking-[-0.02em] text-[#6e6e73]">Filter</p>
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="h-12 rounded-lg border-0 bg-[#fbfaf7] px-4 text-[0.98rem] font-semibold tracking-[-0.02em] text-[#1d1d1f] outline-none ring-1 ring-transparent transition-shadow focus:ring-[#0066cc]/30"
                  >
                    <option value="all">All Tutorials</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(event) => {
                      setSelectedYear(event.target.value);
                      setSelectedMonth("all");
                    }}
                    className="h-12 rounded-lg border-0 bg-[#fbfaf7] px-4 text-[0.98rem] font-semibold tracking-[-0.02em] text-[#1d1d1f] outline-none ring-1 ring-transparent transition-shadow focus:ring-[#0066cc]/30"
                  >
                    <option value="all">All Years</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    className="h-12 rounded-lg border-0 bg-[#fbfaf7] px-4 text-[0.98rem] font-semibold tracking-[-0.02em] text-[#1d1d1f] outline-none ring-1 ring-transparent transition-shadow focus:ring-[#0066cc]/30"
                  >
                    <option value="all">All Months</option>
                    {monthOptions.map((month) => (
                      <option key={month.key} value={month.key}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="h-12 text-left text-[0.98rem] font-semibold tracking-[-0.02em] text-[#0066cc] transition-colors hover:text-[#004a99] disabled:text-[#86868b]"
                    disabled={!hasFilters}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-[#f1f0ec] pb-24 pt-16 md:pb-32 md:pt-24">
              <div className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)]">
                {groupedArchiveItems.length ? (
                  <div className="space-y-14">
                    {groupedArchiveItems.map((group) => (
                      <section key={group.key}>
                        <h3 className="border-b border-[#d2d2d7] pb-5 text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-none tracking-[-0.055em] text-[#1d1d1f]">
                          {group.label}
                        </h3>
                        <div>
                          {group.items.map((item) => (
                            <ArchiveRow key={item.id} item={item} />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="border-t border-[#d2d2d7] py-12">
                    <p className="text-[1.05rem] font-medium tracking-[-0.02em] text-[#6e6e73]">
                      No tutorials match the current filters.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer tone="light" />
    </div>
  );
}
