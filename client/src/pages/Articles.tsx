"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Brush,
  Drama,
  Layers3,
  Palette,
  PenLine,
  Shapes,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AnimatedSection } from "@/components/AnimatedSection";
import MotionReveal from "@/components/MotionReveal";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { SEO } from "@/components/SEO";
import { formatUtcDate } from "@/lib/date-format";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { RETIRED_LEARNING_ARTICLE_REDIRECTS } from "@shared/learningPortal";
import { getTutorialArticles } from "@shared/articleTutorials";
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

const ITEMS_PER_PAGE = 9;

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

type CategoryStyle = {
  icon: LucideIcon;
  color: string;
  bg: string;
  chip: string;
  swatchColor: string;
  swatchTextColor: string;
  swatchMutedColor: string;
  swatchChipBg: string;
};

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Design Process": {
    icon: PenLine,
    color: "text-[#a65f3a]",
    bg: "bg-[#a65f3a]/14",
    chip: "bg-[#a65f3a] text-white",
    swatchColor: "#a65f3a",
    swatchTextColor: "#ffffff",
    swatchMutedColor: "rgba(255,255,255,0.72)",
    swatchChipBg: "rgba(255,255,255,0.16)",
  },
  "Scenic Design": {
    icon: Drama,
    color: "text-[#496784]",
    bg: "bg-[#496784]/14",
    chip: "bg-[#496784] text-white",
    swatchColor: "#496784",
    swatchTextColor: "#ffffff",
    swatchMutedColor: "rgba(255,255,255,0.74)",
    swatchChipBg: "rgba(255,255,255,0.16)",
  },
  "Tools & Technology": {
    icon: Wrench,
    color: "text-[#c4932f]",
    bg: "bg-[#c4932f]/18",
    chip: "bg-[#c4932f] text-[#15110b]",
    swatchColor: "#c4932f",
    swatchTextColor: "#15110b",
    swatchMutedColor: "rgba(21,17,11,0.7)",
    swatchChipBg: "rgba(21,17,11,0.1)",
  },
  "Performance History & Culture": {
    icon: BookOpen,
    color: "text-[#7f906f]",
    bg: "bg-[#7f906f]/16",
    chip: "bg-[#7f906f] text-white",
    swatchColor: "#7f906f",
    swatchTextColor: "#ffffff",
    swatchMutedColor: "rgba(255,255,255,0.74)",
    swatchChipBg: "rgba(255,255,255,0.14)",
  },
  "Profiles & Interviews": {
    icon: UserRound,
    color: "text-[#bd8b8d]",
    bg: "bg-[#bd8b8d]/18",
    chip: "bg-[#bd8b8d] text-[#1f1515]",
    swatchColor: "#bd8b8d",
    swatchTextColor: "#1f1515",
    swatchMutedColor: "rgba(31,21,21,0.68)",
    swatchChipBg: "rgba(31,21,21,0.1)",
  },
  Rendering: {
    icon: Layers3,
    color: "text-[#3f6686]",
    bg: "bg-[#3f6686]/14",
    chip: "bg-[#3f6686] text-white",
    swatchColor: "#3f6686",
    swatchTextColor: "#ffffff",
    swatchMutedColor: "rgba(255,255,255,0.72)",
    swatchChipBg: "rgba(255,255,255,0.16)",
  },
  "Art Direction": {
    icon: Palette,
    color: "text-[#c57050]",
    bg: "bg-[#c57050]/16",
    chip: "bg-[#c57050] text-white",
    swatchColor: "#c57050",
    swatchTextColor: "#ffffff",
    swatchMutedColor: "rgba(255,255,255,0.74)",
    swatchChipBg: "rgba(255,255,255,0.15)",
  },
  "Themed Entertainment": {
    icon: Shapes,
    color: "text-[#5e704d]",
    bg: "bg-[#5e704d]/16",
    chip: "bg-[#5e704d] text-white",
    swatchColor: "#5e704d",
    swatchTextColor: "#ffffff",
    swatchMutedColor: "rgba(255,255,255,0.72)",
    swatchChipBg: "rgba(255,255,255,0.16)",
  },
  "Personal Essay": {
    icon: Brush,
    color: "text-[#7a3f1b]",
    bg: "bg-[#7a3f1b]/16",
    chip: "bg-[#7a3f1b] text-white",
    swatchColor: "#7a3f1b",
    swatchTextColor: "#ffffff",
    swatchMutedColor: "rgba(255,255,255,0.72)",
    swatchChipBg: "rgba(255,255,255,0.14)",
  },
};

const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  icon: Sparkles,
  color: "text-[#a33f24]",
  bg: "bg-[#a33f24]/14",
  chip: "bg-[#a33f24] text-white",
  swatchColor: "#a33f24",
  swatchTextColor: "#ffffff",
  swatchMutedColor: "rgba(255,255,255,0.72)",
  swatchChipBg: "rgba(255,255,255,0.16)",
};

const getCategoryStyle = (category: string | null | undefined) =>
  CATEGORY_STYLES[category || ""] || DEFAULT_CATEGORY_STYLE;

const COVER_OBJECT_POSITION_BY_SLUG: Record<string, string> = {
  "becoming-a-scenic-designer-a-comprehensive-guide": "50% 18%",
};

const READING_PATHS = [
  {
    title: "Scenic Design",
    category: "Scenic Design",
    description:
      "Project writing, design thinking, and production context from the scenic archive.",
  },
  {
    title: "Tools & Technology",
    category: "Tools & Technology",
    description:
      "Studio tools, tutorials, and technical notes for drafting, paint, scale, and workflows.",
  },
  {
    title: "Themed Entertainment",
    category: "Themed Entertainment",
    description:
      "Experiential design, location-based storytelling, and themed environment references.",
  },
];

function ArticleGridCard({
  article,
  eager,
  featured = false,
  href,
  onNavigate,
  onCategoryNavigate,
  revealDelay = 0,
}: {
  article: ArticleCardItem;
  eager?: boolean;
  featured?: boolean;
  href: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  onCategoryNavigate: (category: string | null | undefined) => void;
  revealDelay?: number;
}) {
  const categoryStyle = getCategoryStyle(article.categoryName);
  const CategoryIcon = categoryStyle.icon;
  const dateLabel = formatArticleDate(article);
  const swatchStyle = {
    backgroundColor: categoryStyle.swatchColor,
    color: categoryStyle.swatchTextColor,
  } as CSSProperties;
  const swatchChipStyle = {
    backgroundColor: categoryStyle.swatchChipBg,
    color: categoryStyle.swatchTextColor,
  } as CSSProperties;
  const cardClassName = featured
    ? "publish-motion-card group grid overflow-hidden rounded-none bg-white shadow-[0_18px_38px_rgba(17,17,17,0.07)] ring-1 ring-black/[0.05] transition-transform duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(17,17,17,0.11)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
    : "publish-motion-card group block h-full overflow-hidden rounded-none bg-white shadow-[0_10px_22px_rgba(17,17,17,0.052)] ring-1 ring-black/[0.05] transition-transform duration-500 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(17,17,17,0.085)]";
  const mediaClassName = featured
    ? "publish-card-media article-card-media transition-card relative aspect-square overflow-hidden bg-black/[0.04] lg:h-full lg:min-h-[26rem]"
    : "publish-card-media article-card-media transition-card relative aspect-square overflow-hidden bg-black/[0.04]";
  const copyClassName = featured
    ? "publish-card-copy flex min-h-[18rem] flex-col px-6 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:min-h-0"
    : "publish-card-copy flex min-h-[12.75rem] flex-col px-5 pb-6 pt-5 sm:px-6 sm:pb-7";
  const titleClassName = featured
    ? "block max-w-[34rem] text-[clamp(1.9rem,3.7vw,4.35rem)] font-semibold leading-[0.96] tracking-[-0.038em] transition-opacity duration-500 group-hover:opacity-85"
    : "block max-w-[21rem] text-[clamp(1.02rem,1.12vw,1.22rem)] font-semibold leading-[1.13] tracking-[-0.022em] transition-opacity duration-500 group-hover:opacity-85";

  return (
    <MotionReveal delay={revealDelay} className={featured ? "" : "h-full"}>
      <a
        href={href}
        onClick={event => onNavigate(event, href)}
        className={cardClassName}
      >
        <div className={featured ? "contents" : "flex h-full flex-col"}>
          <div
            className={mediaClassName}
            style={
              {
                viewTransitionName: `article-card-${article.slug}`,
              } as CSSProperties
            }
          >
            {article.coverImageUrl ? (
              <Image
                src={article.coverImageUrl}
                alt={
                  article.coverImageAlt ||
                  `Cover image for article: ${decodeHTMLEntities(article.title)}`
                }
                fill
                quality={82}
                className="publish-card-image object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
                style={{
                  objectPosition:
                    COVER_OBJECT_POSITION_BY_SLUG[article.slug] || "center",
                }}
                loading={eager ? "eager" : "lazy"}
                sizes={
                  featured
                    ? "(min-width: 1280px) 35vw, (min-width: 1024px) 42vw, 94vw"
                    : "(min-width: 1280px) 29vw, (min-width: 768px) 30vw, 94vw"
                }
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </div>

          <div className={copyClassName} style={swatchStyle}>
            <div className="mb-4 flex items-center gap-2">
              <span
                role="link"
                tabIndex={0}
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();
                  onCategoryNavigate(article.categoryName);
                }}
                onKeyDown={event => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    onCategoryNavigate(article.categoryName);
                  }
                }}
                className="publish-category-chip inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.76rem] font-semibold leading-none tracking-[-0.01em] shadow-[0_5px_16px_rgba(17,17,17,0.12)] transition-transform hover:scale-[1.025]"
                style={swatchChipStyle}
              >
                <CategoryIcon className="h-3.5 w-3.5" strokeWidth={2.8} />
                {article.categoryName || "Article"}
              </span>
            </div>
            <span className={titleClassName}>
              {decodeHTMLEntities(article.title)}
            </span>
            {dateLabel ? (
              <span
                className="mt-auto pt-6 text-[0.9rem] font-semibold tracking-[-0.02em]"
                style={{ color: categoryStyle.swatchMutedColor }}
              >
                {dateLabel}
              </span>
            ) : null}
          </div>
        </div>
      </a>
    </MotionReveal>
  );
}

export default function Articles() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window === "undefined") return "all";
    return normalizeCategoryParam(
      new URLSearchParams(window.location.search).get("category")
    );
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState(selectedCategory);
  const [currentPage, setCurrentPage] = useState(1);

  const allArticles = useMemo<ArticleCardItem[]>(
    () =>
      [...getLocalArticles(), ...getTutorialArticles()]
        .filter(article => {
          const retiredRedirect =
            RETIRED_LEARNING_ARTICLE_REDIRECTS[article.slug];
          return (
            !retiredRedirect || retiredRedirect === `/articles/${article.slug}`
          );
        })
        .map(article => ({
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
      new Set(
        allArticles
          .map(article => article.categoryName)
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [allArticles]);

  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      if (
        selectedCategory !== "all" &&
        article.categoryName !== selectedCategory
      ) {
        return false;
      }

      return true;
    });
  }, [allArticles, selectedCategory]);

  const sortedArticles = useMemo(() => {
    const list = [...filteredArticles];

    list.sort((a, b) => {
      const timeCompare = getArticleTimestamp(b) - getArticleTimestamp(a);
      if (timeCompare !== 0) return timeCompare;

      return a.title.localeCompare(b.title);
    });

    return list;
  }, [filteredArticles]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const featuredArticle = sortedArticles[0] || null;
  const archiveArticles = sortedArticles.slice(1);
  const totalPages = Math.max(
    1,
    Math.ceil(archiveArticles.length / ITEMS_PER_PAGE)
  );
  const pagedArticles = archiveArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  useEffect(() => {
    setCurrentPage(page => Math.min(page, totalPages));
  }, [totalPages]);
  const activeFilterCount = selectedCategory !== "all" ? 1 : 0;
  const articleArchiveTitle =
    selectedCategory !== "all"
      ? `${selectedCategory} Articles | Brandon PT Davis`
      : "Scenic Design Articles | Brandon PT Davis";
  const articleArchiveDescription =
    selectedCategory !== "all"
      ? `Read ${selectedCategory.toLowerCase()} articles by Brandon PT Davis, connecting scenic design, production thinking, and visual storytelling.`
      : "Articles by Brandon PT Davis on scenic design, design process, rendering communication, themed entertainment, and performance culture.";
  const articleArchiveKeywords = [
    "scenic design articles",
    "theatre design writing",
    "Brandon PT Davis articles",
    selectedCategory !== "all" ? selectedCategory : null,
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
      {
        duration: 150,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      }
    );
    try {
      await animation.finished;
    } catch {
      // Ignore interrupted animation.
    }
  };

  const navigateWithTransition = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
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
    const navigate = () => router.push(href);
    const performNavigation = async () => {
      await animateCardDeparture(anchor);
      navigate();
    };
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        void performNavigation();
      });
    } else {
      void performNavigation();
    }
  };

  const itemHref = (article: ArticleCardItem) => `/articles/${article.slug}`;

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
      const query =
        nextCategory === "all"
          ? ""
          : `?category=${encodeURIComponent(nextCategory)}`;
      window.history.pushState(null, "", `/articles${query}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="publish-editorial min-h-screen bg-[#f1f0ec] text-[#111111]">
      <SEO
        title={articleArchiveTitle}
        description={articleArchiveDescription}
        image={allArticles[0]?.coverImageUrl || undefined}
        imageAlt={
          allArticles[0]?.coverImageAlt ||
          allArticles[0]?.title ||
          "Article archive cover image"
        }
        keywords={articleArchiveKeywords}
        url="https://www.brandonptdavis.com/articles"
      />
      <Header />
      <PublishingTopBar active="articles" />

      <main>
        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogContent
            showCloseButton={false}
            overlayClassName="bg-[#f1f0ec]/55 backdrop-blur-2xl"
            className="max-h-[min(88vh,44rem)] max-w-[min(46rem,calc(100vw-2rem))] overflow-y-auto rounded-[1.7rem] border-0 bg-[#fbfaf7] p-8 text-[#111111] shadow-[0_35px_110px_rgba(17,17,17,0.24)] sm:p-10"
          >
            <DialogClose className="absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.06] text-[#6f6b64] transition-colors hover:bg-black/[0.1] hover:text-[#111111]">
              <X className="h-5 w-5" />
              <span className="sr-only">Close filters</span>
            </DialogClose>
            <div className="pl-14 sm:pl-16">
              <DialogTitle className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
                Filter by
              </DialogTitle>
            </div>

            <div className="mt-10 space-y-9">
              <div>
                <p className="mb-4 text-[0.92rem] font-semibold tracking-[-0.02em] text-[#6f6b64]">
                  Category
                </p>
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
                    <Sparkles className="h-4 w-4" strokeWidth={2.8} />
                    All
                  </button>
                  {categories.map(category => {
                    const categoryStyle = getCategoryStyle(category);
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
                  className="rounded-full bg-[#6f2dff] px-7 py-3 text-[1rem] font-semibold tracking-[-0.025em] text-white transition-colors hover:bg-[#6822e6]"
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

        {sortedArticles.length > 0 ? (
          <>
            <section
              id="article-archive"
              className="scroll-mt-32 pb-12 pt-10 md:pb-16 md:pt-14"
            >
              <div className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)]">
                <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <h1 className="font-sans text-[clamp(3.2rem,6.6vw,6.3rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-[#111111]">
                    Articles
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="/articles/archive"
                      className="inline-flex h-11 items-center gap-2 border border-black/[0.12] bg-[#111111] px-5 text-[0.95rem] font-semibold tracking-[-0.02em] text-[#f1f0ec] shadow-[0_8px_26px_rgba(17,17,17,0.1)] transition-colors hover:bg-[#2a2724]"
                    >
                      <BookOpen className="h-4 w-4" strokeWidth={2.6} />
                      View archive
                    </a>
                    <button
                      type="button"
                      onClick={openFilter}
                      className="inline-flex h-11 items-center gap-2 border border-black/[0.12] bg-[#fbfaf7] px-5 text-[0.95rem] font-semibold tracking-[-0.02em] text-[#111111] shadow-[0_8px_26px_rgba(17,17,17,0.08)] transition-colors hover:bg-white"
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
                </div>

                {currentPage === 1 && featuredArticle ? (
                  <div className="mb-9 md:mb-10">
                    <ArticleGridCard
                      key={`featured-${featuredArticle.id}-${selectedCategory}`}
                      article={featuredArticle}
                      eager
                      featured
                      href={itemHref(featuredArticle)}
                      onNavigate={navigateWithTransition}
                      onCategoryNavigate={navigateToCategory}
                    />
                  </div>
                ) : null}

                <div className="grid auto-rows-fr grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
                  {pagedArticles.map((article, index) => {
                    const href = itemHref(article);

                    return (
                      <ArticleGridCard
                        key={`${article.id}-${selectedCategory}-${currentPage}`}
                        article={article}
                        eager={index < 2}
                        href={href}
                        onNavigate={navigateWithTransition}
                        onCategoryNavigate={navigateToCategory}
                        revealDelay={(index % 8) * 80}
                      />
                    );
                  })}
                </div>

                {totalPages > 1 ? (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map(page => (
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
              <p className="text-[#5d5851]">
                No articles match the current filters.
              </p>
            </div>
          </section>
        )}

        <section className="pb-20 pt-2 md:pb-24">
          <div className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)]">
            <div className="border-t border-black/[0.08] pt-10 md:pt-12">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <p className="text-[clamp(1.05rem,1.35vw,1.28rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-[#111111]">
                  Reading Paths
                </p>
                <p className="max-w-[26rem] text-[0.95rem] leading-6 tracking-[-0.015em] text-[#6f6b64] md:text-right">
                  Move through the archive by practice area, from project work
                  to tools and experiential design.
                </p>
              </div>
              <div className="mt-7 grid gap-3 md:grid-cols-3">
                {READING_PATHS.map(path => {
                  const pathStyle = getCategoryStyle(path.category);
                  const PathIcon = pathStyle.icon;

                  return (
                    <button
                      key={path.title}
                      type="button"
                      onClick={() => navigateToCategory(path.category)}
                      className="group min-h-[11rem] rounded-none p-6 text-left shadow-[0_10px_30px_rgba(17,17,17,0.075)] ring-1 ring-black/[0.06] transition-transform duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(17,17,17,0.12)]"
                      style={
                        {
                          backgroundColor: pathStyle.swatchColor,
                          color: pathStyle.swatchTextColor,
                        } as CSSProperties
                      }
                    >
                      <span className="flex items-start justify-between gap-5">
                        <span className="text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.022em]">
                          {path.title}
                        </span>
                        <span
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: pathStyle.swatchChipBg }}
                        >
                          <PathIcon className="h-4 w-4" strokeWidth={2.5} />
                        </span>
                      </span>
                      <span
                        className="mt-4 block max-w-[22rem] text-[0.98rem] leading-7 tracking-[-0.015em]"
                        style={{ color: pathStyle.swatchMutedColor }}
                      >
                        {path.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
