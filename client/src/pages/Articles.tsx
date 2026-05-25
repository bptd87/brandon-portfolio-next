"use client";

import React, { useEffect, useMemo, useState, type CSSProperties, type MouseEvent } from "react";
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
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { SEO } from "@/components/SEO";
import { formatUtcDate } from "@/lib/date-format";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_REDIRECTS,
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

const ITEMS_PER_PAGE = 8;

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
};

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Design Process": {
    icon: PenLine,
    color: "text-[#5f16ff]",
    bg: "bg-[#5f16ff]/12",
    chip: "bg-[#5f16ff] text-white",
  },
  "Scenic Design": {
    icon: Drama,
    color: "text-[#111111]",
    bg: "bg-black/[0.09]",
    chip: "bg-[#111111] text-white",
  },
  "Tools & Technology": {
    icon: Wrench,
    color: "text-[#0057ff]",
    bg: "bg-[#0057ff]/12",
    chip: "bg-[#0057ff] text-white",
  },
  "Performance History & Culture": {
    icon: BookOpen,
    color: "text-[#c36a00]",
    bg: "bg-[#ffb000]/20",
    chip: "bg-[#ffb000] text-white",
  },
  "Profiles & Interviews": {
    icon: UserRound,
    color: "text-[#e0007a]",
    bg: "bg-[#e0007a]/12",
    chip: "bg-[#e0007a] text-white",
  },
  Rendering: {
    icon: Layers3,
    color: "text-[#008c84]",
    bg: "bg-[#008c84]/12",
    chip: "bg-[#008c84] text-white",
  },
  "Art Direction": {
    icon: Palette,
    color: "text-[#e25f00]",
    bg: "bg-[#ff7a00]/[0.14]",
    chip: "bg-[#ff7a00] text-white",
  },
  "Themed Entertainment": {
    icon: Shapes,
    color: "text-[#ce2fff]",
    bg: "bg-[#ce2fff]/[0.14]",
    chip: "bg-[#ce2fff] text-white",
  },
  "Personal Essay": {
    icon: Brush,
    color: "text-[#ff3b30]",
    bg: "bg-[#ff3b30]/12",
    chip: "bg-[#ff3b30] text-white",
  },
};

const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  icon: Sparkles,
  color: "text-[#006cff]",
  bg: "bg-[#006cff]/12",
  chip: "bg-[#006cff] text-white",
};

const getCategoryStyle = (category: string | null | undefined) =>
  CATEGORY_STYLES[category || ""] || DEFAULT_CATEGORY_STYLE;

function ArticleGridCard({
  article,
  eager,
  href,
  onNavigate,
  onCategoryNavigate,
}: {
  article: ArticleCardItem;
  eager?: boolean;
  href: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  onCategoryNavigate: (category: string | null | undefined) => void;
}) {
  const categoryStyle = getCategoryStyle(article.categoryName);
  const CategoryIcon = categoryStyle.icon;
  const dateLabel = formatArticleDate(article);

  return (
    <a
      href={href}
      onClick={(event) => onNavigate(event, href)}
      className="group block h-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_14px_34px_rgba(17,17,17,0.07)] ring-1 ring-black/[0.04] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(17,17,17,0.11)]"
    >
      <div className="flex h-full flex-col">
        <div
          className="publish-card-media transition-card relative aspect-[16/9] overflow-hidden bg-black/[0.04]"
          style={{ viewTransitionName: `article-card-${article.slug}` } as CSSProperties}
        >
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.coverImageAlt || `Cover image for article: ${decodeHTMLEntities(article.title)}`}
              fill
              quality={82}
              className="publish-card-image object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
              loading={eager ? "eager" : "lazy"}
              sizes="(min-width: 1280px) 29vw, (min-width: 768px) 30vw, 94vw"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
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
                onCategoryNavigate(article.categoryName);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onCategoryNavigate(article.categoryName);
                }
              }}
              className={`publish-category-chip inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold leading-none tracking-[-0.015em] shadow-[0_5px_16px_rgba(17,17,17,0.12)] transition-transform hover:scale-[1.025] ${categoryStyle.chip}`}
            >
              <CategoryIcon className="h-4 w-4" strokeWidth={2.8} />
              {article.categoryName || "Article"}
            </span>
          </div>
          <p className="max-w-[27rem] text-[1.55rem] font-semibold leading-[1.02] tracking-[-0.058em] text-[#111111] transition-colors duration-500 group-hover:text-[#7b2cff]">
            {decodeHTMLEntities(article.title)}
          </p>
          {dateLabel ? (
            <span className="mt-auto pt-8 text-[1rem] font-semibold tracking-[-0.025em] text-[#6f6b64]">
              {dateLabel}
            </span>
          ) : null}
        </div>
      </div>
    </a>
  );
}

export default function Articles() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window === "undefined") return "all";
    return normalizeCategoryParam(new URLSearchParams(window.location.search).get("category"));
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState(selectedCategory);
  const [currentPage, setCurrentPage] = useState(1);

  const allArticles = useMemo<ArticleCardItem[]>(
    () =>
      getLocalArticles()
        .filter((article) => !LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
        .filter((article) => {
          const retiredRedirect = RETIRED_LEARNING_ARTICLE_REDIRECTS[article.slug];
          return !retiredRedirect || retiredRedirect === `/articles/${article.slug}`;
        })
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

  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      if (selectedCategory !== "all" && article.categoryName !== selectedCategory) {
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

  const totalPages = Math.max(1, Math.ceil(sortedArticles.length / ITEMS_PER_PAGE));
  const pagedArticles = sortedArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
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
    const navigate = () => router.push(href);
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
        imageAlt={allArticles[0]?.coverImageAlt || allArticles[0]?.title || "Article archive cover image"}
        keywords={articleArchiveKeywords}
        url="https://www.brandonptdavis.com/articles"
      />
      <Header />
      <PublishingTopBar active="articles" />

      <main>
        <section className="pb-8 pt-0 md:pb-12">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <AnimatedSection>
              <div className="mx-auto flex max-w-[62rem] flex-col items-center gap-8 py-12 md:gap-12 md:py-16">
                <Image
                  src="https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/publish/article-top.png"
                  alt=""
                  width={1960}
                  height={484}
                  priority
                  className="site-media-square pointer-events-none h-auto w-full object-contain"
                />
                <h1 className="text-center font-sans text-[clamp(4rem,8.4vw,7.8rem)] font-semibold leading-[0.86] tracking-[-0.08em] text-[#111111]">
                  Articles
                </h1>
                <Image
                  src="https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/publish/article-bottom-v2.png"
                  alt=""
                  width={1960}
                  height={484}
                  priority
                  className="site-media-square pointer-events-none h-auto w-full object-contain"
                />
              </div>
            </AnimatedSection>
          </div>
        </section>

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
                    <Sparkles className="h-4 w-4" strokeWidth={2.8} />
                    All
                  </button>
                  {categories.map((category) => {
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

        {sortedArticles.length > 0 ? (
          <>
            <section className="pb-20 pt-6 md:pb-28 md:pt-8">
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
                      />
                    );
                  })}
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
              <p className="text-[#5d5851]">No articles match the current filters.</p>
            </div>
          </section>
        )}

        <section className="border-t border-black/10 py-16 md:py-20">
          <div className="container max-w-[88rem]">
            <p className="text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-none tracking-[-0.035em] text-[#6f6b64]">
              Reading Paths
            </p>
            <div className="mt-6 grid border-t border-black/10 md:grid-cols-3">
              {[
                ["Process", "How scenic ideas move from research, drafting, models, and rehearsal into a built production."],
                ["Context", "Notes around theatre, performance culture, and the artistic questions behind the portfolio."],
                ["Profiles", "Interviews, press, and editorial pieces that place the work inside a wider creative practice."],
              ].map(([title, description]) => (
                <div key={title} className="border-b border-black/10 py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                  <h2 className="text-[1.35rem] font-semibold leading-none tracking-[-0.045em] text-[#111111]">
                    {title}
                  </h2>
                  <p className="mt-4 max-w-[24rem] text-[0.98rem] leading-7 text-[#5d5851]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
