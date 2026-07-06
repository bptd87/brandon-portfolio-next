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
import MotionReveal from "@/components/MotionReveal";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { SEO } from "@/components/SEO";
import { formatUtcDate } from "@/lib/date-format";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";
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
    ? "publish-motion-card group grid overflow-hidden rounded-[1.75rem] shadow-[0_22px_55px_rgba(17,17,17,0.12)] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(17,17,17,0.16)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
    : "publish-motion-card group block h-full overflow-hidden rounded-[1.35rem] shadow-[0_14px_34px_rgba(17,17,17,0.09)] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(17,17,17,0.13)]";
  const mediaClassName = featured
    ? "publish-card-media article-card-media transition-card relative aspect-square overflow-hidden lg:h-full lg:min-h-[26rem]"
    : "publish-card-media article-card-media transition-card relative aspect-square overflow-hidden";
  const copyClassName = featured
    ? "publish-card-copy flex min-h-[18rem] flex-col px-6 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:min-h-0"
    : "publish-card-copy flex min-h-[12.75rem] flex-1 flex-col px-5 pb-6 pt-5 sm:px-6 sm:pb-7";
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
              <div
                className="h-full w-full"
                style={{ backgroundColor: categoryStyle.swatchColor }}
              />
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
            <span className={titleClassName} style={{ fontFamily: HOME_DISPLAY_FONT }}>
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
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const pageStyle = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;
  const displayStyle = {
    color: homeTheme.ink,
    fontFamily: HOME_DISPLAY_FONT,
  } as CSSProperties;
  const mutedStyle = {
    color: homeTheme.muted,
  } as CSSProperties;
  const panelStyle = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
  } as CSSProperties;
  const primaryControlStyle = {
    backgroundColor: homeTheme.controlBg,
    color: homeTheme.controlInk,
  } as CSSProperties;
  const secondaryControlStyle = {
    backgroundColor: homeTheme.accentSoft,
    color: homeTheme.muted,
  } as CSSProperties;
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
    router.push(href);
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
    <div className="articles-page relative min-h-screen transition-colors duration-500" style={pageStyle}>
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

      <main className="relative z-10 transition-colors duration-500" style={{ backgroundColor: homeTheme.bg }}>
        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogContent
            showCloseButton={false}
            overlayClassName="bg-black/18 backdrop-blur-xl"
            className="max-h-[min(88vh,44rem)] max-w-[min(46rem,calc(100vw-2rem))] overflow-y-auto rounded-[2rem] border-0 p-8 shadow-[0_35px_110px_rgba(17,17,17,0.24)] sm:p-10"
            style={panelStyle}
          >
            <DialogClose
              className="absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              style={secondaryControlStyle}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close filters</span>
            </DialogClose>
            <div className="pl-14 sm:pl-16">
              <DialogTitle
                className="text-[clamp(2rem,4vw,3rem)] font-black uppercase leading-[0.92]"
                style={displayStyle}
              >
                Filter by
              </DialogTitle>
            </div>

            <div className="mt-10 space-y-9">
              <div>
                <p className="mb-4 text-[0.92rem] font-black uppercase" style={mutedStyle}>
                  Category
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setDraftCategory("all")}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[1rem] font-semibold tracking-[-0.025em] transition-colors ${
                      draftCategory === "all"
                        ? ""
                        : ""
                    }`}
                    style={
                      draftCategory === "all"
                        ? primaryControlStyle
                        : secondaryControlStyle
                    }
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
                            : ""
                        }`}
                        style={
                          draftCategory === category
                            ? undefined
                            : secondaryControlStyle
                        }
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
                  className="rounded-full px-7 py-3 text-[1rem] font-black uppercase transition-colors"
                  style={primaryControlStyle}
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftCategory("all");
                  }}
                  className="rounded-full px-5 py-3 text-[1rem] font-black uppercase transition-colors"
                  style={secondaryControlStyle}
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
              className="scroll-mt-32 pb-12 pt-28 md:pb-16 md:pt-36"
            >
              <div className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)]">
                <div className="mb-10 flex flex-col items-center gap-7 text-center">
                  <h1
                    className="text-[clamp(4.6rem,12vw,10.5rem)] font-black uppercase leading-[0.82]"
                    style={displayStyle}
                  >
                    ARTICLES
                  </h1>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href="/articles/archive"
                      className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.95rem] font-black transition-colors"
                      style={primaryControlStyle}
                    >
                      <BookOpen className="h-4 w-4" strokeWidth={2.6} />
                      View archive
                    </a>
                    <button
                      type="button"
                      onClick={openFilter}
                      className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.95rem] font-black transition-colors"
                      style={secondaryControlStyle}
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filter
                      {activeFilterCount > 0 ? (
                        <span
                          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.72rem] leading-none"
                          style={primaryControlStyle}
                        >
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
                            ? ""
                            : ""
                        }`}
                        style={
                          currentPage === page
                            ? primaryControlStyle
                            : secondaryControlStyle
                        }
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
              <p style={mutedStyle}>
                No articles match the current filters.
              </p>
            </div>
          </section>
        )}

        <section className="pb-20 pt-2 md:pb-24">
          <div className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)]">
            <div className="pt-10 md:pt-12">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <p
                  className="text-[clamp(2.8rem,7vw,6rem)] font-black uppercase leading-[0.85]"
                  style={displayStyle}
                >
                  READING PATHS
                </p>
                <p className="max-w-[26rem] text-[0.95rem] leading-6 md:text-right" style={mutedStyle}>
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
                      className="group min-h-[11rem] rounded-[1.5rem] p-6 text-left shadow-[0_16px_42px_rgba(17,17,17,0.11)] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_22px_58px_rgba(17,17,17,0.15)]"
                      style={
                        {
                          backgroundColor: pathStyle.swatchColor,
                          color: pathStyle.swatchTextColor,
                        } as CSSProperties
                      }
                    >
                      <span className="flex items-start justify-between gap-5">
                        <span
                          className="text-[1.75rem] font-black uppercase leading-[0.95]"
                          style={{ fontFamily: HOME_DISPLAY_FONT }}
                        >
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

      <Footer
        tone="light"
        backgroundColor={homeTheme.footerBg}
        displayTextColor={homeTheme.footerDisplay}
        textColor={homeTheme.footerInk}
      />
    </div>
  );
}
