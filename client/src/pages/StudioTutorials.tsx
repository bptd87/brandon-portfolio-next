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
  PlayCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  createdAt?: string | null;
  updatedAt?: string | null;
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
  { key: "alphabetical", label: "Tutorial title" },
  { key: "duration", label: "Longest first" },
];

const normalizeToken = (value: string | null | undefined) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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
  new Date(tutorial.updatedAt || tutorial.createdAt || 0).getTime();

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

const getTutorialCoverImage = (tutorial: TutorialCardItem) => {
  const category = normalizeToken(tutorial.category);

  if (category === "2d-drafting") {
    return {
      src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/cards/2d-drafting-abstract-v1.png",
      alt: "Abstract tutorial cover for 2D drafting",
    };
  }

  if (category === "3d-modeling") {
    return {
      src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/cards/3d-modeling-abstract-v1.png",
      alt: "Abstract tutorial cover for 3D modeling",
    };
  }

  if (category === "rendering") {
    return {
      src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/cards/rendering-abstract-v1.png",
      alt: "Abstract tutorial cover for rendering",
    };
  }

  return {
    src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/cards/getting-started-abstract-v1.png",
    alt: "Abstract tutorial cover for getting started",
  };
};

function TutorialGridCard({
  tutorial,
  href,
}: {
  tutorial: TutorialCardItem;
  href: string;
}) {
  const cover = getTutorialCoverImage(tutorial);
  const metadata = [
    getCategoryLabel(tutorial.category),
    getDifficultyLabel(tutorial.difficulty),
    formatDuration(tutorial.duration),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <a href={href} className="group block">
      <div className="group">
        <div className="relative aspect-[1/1] overflow-hidden rounded-xl bg-background/50">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            quality={90}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            sizes="(min-width: 1280px) 29vw, (min-width: 768px) 30vw, 94vw"
          />
        </div>

        <div className="pt-4">
          <p className="text-[1.02rem] font-normal tracking-[-0.02em] text-white/88">
            {tutorial.title}
          </p>
          <p className="mt-2 text-sm text-white/45">{metadata}</p>
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
        createdAt: tutorial.created_at,
        updatedAt: tutorial.updated_at,
      })),
    []
  );

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        allTutorials
          .map((tutorial) => getCategoryLabel(tutorial.category))
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [allTutorials]);

  const difficulties = useMemo(() => {
    return Array.from(
      new Set(
        allTutorials
          .map((tutorial) => getDifficultyLabel(tutorial.difficulty))
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [allTutorials]);

  const filteredTutorials = useMemo(() => {
    return allTutorials.filter((tutorial) => {
      if (selectedCategory !== "all" && getCategoryLabel(tutorial.category) !== selectedCategory) {
        return false;
      }

      if (selectedDifficulty !== "all" && getDifficultyLabel(tutorial.difficulty) !== selectedDifficulty) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const haystack = [tutorial.title, tutorial.description, tutorial.category, tutorial.difficulty]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [allTutorials, searchQuery, selectedCategory, selectedDifficulty]);

  const sortedTutorials = useMemo(() => {
    const list = [...filteredTutorials];

    list.sort((a, b) => {
      if (sortKey === "alphabetical") {
        return a.title.localeCompare(b.title);
      }

      if (sortKey === "duration") {
        return Number(b.duration || 0) - Number(a.duration || 0);
      }

      const timeCompare = getTutorialTimestamp(b) - getTutorialTimestamp(a);
      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [filteredTutorials, sortKey]);

  const activeFilterCount =
    (selectedDifficulty !== "all" ? 1 : 0) + (searchQuery.trim() ? 1 : 0);
  const currentHeading = selectedCategory !== "all" ? selectedCategory : "Tutorials";

  const tutorialArchiveTitle =
    selectedCategory !== "all"
      ? `${selectedCategory} Tutorials | Brandon PT Davis`
      : "Tutorials | Brandon PT Davis";
  const tutorialArchiveDescription =
    selectedCategory !== "all"
      ? `Browse ${selectedCategory.toLowerCase()} tutorials by Brandon PT Davis, shaped for scenic drafting, modeling, rendering, and production workflow.`
      : "Tutorial archive by Brandon PT Davis covering drafting, modeling, rendering, and Vectorworks workflow for scenic design.";
  const tutorialCollectionName =
    selectedCategory !== "all" ? `${selectedCategory} Tutorials` : "Tutorials";

  const itemHref = (tutorial: TutorialCardItem) => `/studio/tutorials/${tutorial.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={tutorialArchiveTitle}
        description={tutorialArchiveDescription}
        keywords="vectorworks tutorials, scenic design tutorials, drafting tutorials, rendering tutorials, theatrical design workflow"
        url="https://www.brandonptdavis.com/studio/tutorials"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
          { name: "Tutorials", url: "https://www.brandonptdavis.com/studio/tutorials" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: tutorialCollectionName,
          url: "https://www.brandonptdavis.com/studio/tutorials",
          description:
            selectedCategory !== "all"
              ? `${selectedCategory} tutorials by Brandon PT Davis.`
              : "Tutorial archive covering scenic drafting, modeling, rendering, and workflow.",
          about: "Tutorial videos and walkthroughs by Brandon PT Davis.",
          mainEntity: {
            name: tutorialCollectionName,
            itemListElement: sortedTutorials.slice(0, 24).map((tutorial, index) => ({
              position: index + 1,
              name: tutorial.title,
              url: `https://www.brandonptdavis.com/studio/tutorials/${tutorial.slug}`,
              datePublished: tutorial.createdAt || tutorial.updatedAt || undefined,
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
              <p className="mt-5 max-w-3xl text-[1rem] leading-7 text-white/58 md:text-[1.05rem]">
                A tutorial archive moving toward a blog-style index: practical walkthroughs for scenic
                drafting, modeling, rendering, and production workflow in Vectorworks.
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
                    placeholder="Search tutorials"
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
                          <p className="text-sm font-medium text-white">Filter tutorials</p>
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

        {sortedTutorials.length > 0 ? (
          <>
            <section className="pb-20 pt-12 md:pb-28 md:pt-14">
              <div className="container max-w-[88rem]">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedTutorials.map((tutorial) => {
                      const href = itemHref(tutorial);

                      return (
                        <div key={`${tutorial.id}-${selectedCategory}-${selectedDifficulty}-${sortKey}-${viewMode}`}>
                          <TutorialGridCard tutorial={tutorial} href={href} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border-t border-border/35">
                    {sortedTutorials.map((tutorial) => {
                      const href = itemHref(tutorial);

                      return (
                        <a
                          key={`${tutorial.id}-${selectedCategory}-${selectedDifficulty}-${sortKey}-${viewMode}`}
                          href={href}
                          onClick={(event) => {
                            event.preventDefault();
                            setLocation(href);
                          }}
                          className="group grid gap-4 border-b border-border/35 py-5 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8"
                        >
                          <div className="space-y-2 text-sm text-white/48">
                            <p className="text-white/82">{getCategoryLabel(tutorial.category)}</p>
                            <p>
                              {[getDifficultyLabel(tutorial.difficulty), formatDuration(tutorial.duration)]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-[1.12rem] font-normal tracking-[-0.025em] text-white/88">
                              {tutorial.title}
                            </p>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/52">
                              {getTutorialSummary(tutorial)}
                            </p>
                            <div className="mt-3 inline-flex items-center gap-2 text-sm text-white/52">
                              <PlayCircle className="h-4 w-4" />
                              Watch tutorial
                            </div>
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
              <p className="text-white/55">No tutorials match the current filters.</p>
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
