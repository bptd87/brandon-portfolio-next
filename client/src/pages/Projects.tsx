"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  ArrowDownAZ,
  Building2,
  CalendarArrowDown,
  CalendarArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Drama,
  Laugh,
  LayoutGrid,
  List,
  Music,
  Rows3,
  SlidersHorizontal,
  Theater,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { PortfolioGridSkeleton } from "@/components/SkeletonLoaders";
import StructuredData from "@/components/StructuredData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getProjectPath } from "@/lib/projectRoutes";
import {
  getScenicProjectTimestamp,
  scenicPortfolioLandingCopy,
} from "@/lib/scenicShowcase";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "@shared/learningPortal";
import { getLocalArticles } from "@shared/localArticles";
import type { ScenicProjectSummary } from "@shared/scenicProjectSummaries";

type SortKey = "newest" | "oldest" | "title" | "venue";
type ViewMode = "grid" | "list";
type ScenicArticleCard = {
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  category: string;
  timestamp: number;
};

const SORT_OPTIONS: Array<{ key: SortKey; label: string; icon: LucideIcon }> = [
  { key: "newest", label: "Newest first", icon: CalendarArrowDown },
  { key: "oldest", label: "Oldest first", icon: CalendarArrowUp },
  { key: "title", label: "Production title", icon: ArrowDownAZ },
  { key: "venue", label: "Venue", icon: Building2 },
];

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  comedy: Laugh,
  drama: Drama,
  musical: Music,
  "musical theatre": Music,
  "musical-theatre": Music,
  shakespeare: Theater,
  tya: UsersRound,
  "theatre for young audiences": UsersRound,
  "theatre-for-young-audiences": UsersRound,
};

const normalizeText = (value?: string | null) => {
  if (!value) return "";
  return value
    .replace(/[\s\u00A0]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getVenueLabel = (project: any) => {
  return project.client || project.venue || "Unknown Venue";
};

const formatProjectDate = (project: any) => {
  if (!project.year) return null;
  return String(project.year);
};

const isNonEmptyString = (value: string | null | undefined): value is string => Boolean(value);

const getDirectorLabel = (project: ScenicProjectSummary) => {
  return project.directorName ? `Dir. ${project.directorName}` : null;
};

const getCategoryIcon = (label: string) => {
  return CATEGORY_ICON_MAP[normalizeText(label)] || Rows3;
};

const getArticleTimestamp = (...dates: Array<string | Date | null | undefined>) =>
  Math.max(
    ...dates.map(date => {
      const time = new Date(date || 0).getTime();
      return Number.isFinite(time) ? time : 0;
    })
  );

const cleanArticleDescription = (value?: string | null) => {
  const text = String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "Scenic design writing on process, production, and visual storytelling.";
  if (text.length <= 118) return text;
  return `${text.slice(0, 115).trim()}...`;
};

const getScenicDesignArticleCards = (): ScenicArticleCard[] => {
  return getLocalArticles()
    .filter(article => !LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
    .filter(article => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
    .filter(article => {
      const category = normalizeText(article.categoryName);
      const tags = (article.tags || []).map(tag => normalizeText(tag.name || tag.slug));
      return (
        category === "scenic design" ||
        category === "design process" ||
        tags.some(tag => tag.includes("scenic design") || tag.includes("process"))
      );
    })
    .map(article => ({
      title: article.title,
      description: cleanArticleDescription(article.excerpt || article.seoDescription),
      href: `/articles/${article.slug}`,
      image: article.coverImageUrl,
      imageAlt: article.coverImageAlt || `Cover image for ${article.title}`,
      category: article.categoryName || "Scenic Design",
      timestamp: getArticleTimestamp(article.publishedAt, article.updatedAt, article.createdAt),
    }))
    .filter(card => card.image)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 8);
};

function ProjectCard({
  href,
  layoutClass,
  onNavigate,
  project,
  scenicAlt,
  eager,
  sizes,
}: {
  href: string;
  layoutClass?: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  project: any;
  scenicAlt: (title: string) => string;
  eager?: boolean;
  sizes: string;
}) {
  return (
    <a
      href={href}
      onClick={(event) => onNavigate(event, href)}
      className={`group block ${layoutClass || ""}`}
    >
      <article className="bg-[#111111]">
        <div
          className="transition-card site-media-square relative aspect-[3/2] overflow-hidden bg-[#181818]"
          style={{ viewTransitionName: `project-card-${project.slug}` } as CSSProperties}
        >
          {project.coverImageUrl ? (
            <Image
              src={project.coverImageUrl}
              alt={scenicAlt(project.title)}
              fill
              quality={86}
              className="site-media-square object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              style={{
                objectPosition: project.coverImagePosition || "center",
              }}
              priority={Boolean(eager)}
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
              sizes={sizes}
            />
          ) : (
            <div className="aspect-[3/2] w-full bg-muted" />
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/82 via-black/32 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-[clamp(1.15rem,2.2vw,2rem)]">
            <h2 className="font-sans text-[clamp(1.45rem,2.1vw,2.4rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white transition-colors group-hover:text-white/80">
              {project.title}
            </h2>
            {getVenueLabel(project) ? (
              <p className="mt-2 text-[clamp(0.9rem,1.05vw,1.08rem)] leading-tight tracking-[-0.025em] text-white/72">
                {getVenueLabel(project)}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </a>
  );
}

const getProjectPanelClass = (index: number) => {
  return index % 3 === 0 ? "md:col-span-2" : "";
};

const getProjectImageSizes = (index: number) => {
  return index % 3 === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw";
};

export default function Projects({
  initialProjects,
}: {
  initialProjects: ScenicProjectSummary[];
}) {
  const router = useRouter();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedVenue, setSelectedVenue] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const articleCardsRef = useRef<HTMLDivElement | null>(null);

  const mergedProjects = useMemo(() => initialProjects, [initialProjects]);
  const isLoading = false;
  const scenicArticleCards = useMemo(() => getScenicDesignArticleCards(), []);
  const scrollArticleCards = (direction: "previous" | "next") => {
    articleCardsRef.current?.scrollBy({
      left: direction === "next" ? 760 : -760,
      behavior: "smooth",
    });
  };

  const subcategories = useMemo(() => {
    if (!mergedProjects.length) return [] as Array<{ key: string; label: string }>;
    const labels = new Map<string, string>();

    for (const project of mergedProjects) {
      const key = normalizeText(project.subcategory);
      if (!key) continue;
      if (!labels.has(key)) labels.set(key, project.subcategory!.trim());
    }

    return Array.from(labels.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, label]) => ({ key, label }));
  }, [mergedProjects]);

  const venueOptions = useMemo(() => {
    if (!mergedProjects.length) return [] as string[];
    return Array.from(
      new Set(mergedProjects.map((project) => getVenueLabel(project)).filter(isNonEmptyString))
    ).sort((a, b) => a.localeCompare(b));
  }, [mergedProjects]);

  const yearOptions = useMemo(() => {
    if (!mergedProjects.length) return [] as string[];
    return Array.from(
      new Set(
        mergedProjects.map((project) => (project.year ? String(project.year) : null)).filter(isNonEmptyString)
      )
    ).sort((a, b) => Number(b) - Number(a));
  }, [mergedProjects]);

  const filteredProjects = useMemo(() => {
    if (!mergedProjects.length) return [];

    return mergedProjects.filter((project) => {
      if (
        selectedSubcategory !== "all" &&
        normalizeText(project.subcategory) !== selectedSubcategory
      ) {
        return false;
      }

      if (selectedVenue !== "all" && getVenueLabel(project) !== selectedVenue) {
        return false;
      }

      if (selectedYear !== "all" && String(project.year || "") !== selectedYear) {
        return false;
      }

      return true;
    });
  }, [mergedProjects, selectedSubcategory, selectedVenue, selectedYear]);

  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];

    list.sort((a, b) => {
      if (sortKey === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortKey === "venue") {
        const venueCompare = getVenueLabel(a).localeCompare(getVenueLabel(b));
        if (venueCompare !== 0) return venueCompare;
        return getScenicProjectTimestamp(b) - getScenicProjectTimestamp(a);
      }

      const timeCompare = getScenicProjectTimestamp(b) - getScenicProjectTimestamp(a);
      if (timeCompare !== 0) {
        return sortKey === "oldest" ? -timeCompare : timeCompare;
      }

      return a.title.localeCompare(b.title);
    });

    return list;
  }, [filteredProjects, sortKey]);

  const latestProjectUpdate = sortedProjects
    .map((project: any) => project.updatedAt || project.publishedAt || project.createdAt)
    .filter(Boolean)
    .sort((a, b) => new Date(b as any).getTime() - new Date(a as any).getTime())[0];
  const latestProjectUpdateDate = latestProjectUpdate
    ? new Date(latestProjectUpdate as any).toISOString().split("T")[0]
    : undefined;

  const pageTitle = scenicPortfolioLandingCopy.title;
  const pageSubtitle = scenicPortfolioLandingCopy.subtitle;
  const pageDescription =
    "Scenic design productions by Brandon PT Davis, spanning plays, musicals, Shakespeare, new work, and regional theatre environments.";
  const pageIntro = scenicPortfolioLandingCopy.intro;
  const scenicAlt = (title: string) => `${title} scenic design by Brandon PT Davis`;
  const selectedCategoryLabel =
    subcategories.find((item) => item.key === selectedSubcategory)?.label || null;
  const currentHeading =
    selectedVenue !== "all"
      ? selectedVenue
      : selectedCategoryLabel
        ? selectedCategoryLabel
        : selectedYear !== "all"
          ? selectedYear
          : pageTitle;
  const activeFilterCount =
    (selectedVenue !== "all" ? 1 : 0) + (selectedYear !== "all" ? 1 : 0);
  const scenicArchiveTitle =
    selectedVenue !== "all"
      ? `${selectedVenue} Scenic Design | Brandon PT Davis`
      : selectedCategoryLabel
        ? `${selectedCategoryLabel} Scenic Design | Brandon PT Davis`
        : selectedYear !== "all"
          ? `${selectedYear} Scenic Design Portfolio | Brandon PT Davis`
          : "Scenic Design Portfolio | Brandon PT Davis";
  const scenicArchiveDescription =
    selectedVenue !== "all"
      ? `Scenic design work by Brandon PT Davis for productions at ${selectedVenue}.`
      : selectedCategoryLabel
        ? `${selectedCategoryLabel} scenic design projects by Brandon PT Davis, including realized productions, design notes, and portfolio documentation.`
        : selectedYear !== "all"
          ? `Scenic design projects by Brandon PT Davis from ${selectedYear}, spanning realized productions, renderings, and production photography.`
          : `Explore scenic design productions by Brandon PT Davis. ${pageDescription}`;
  const scenicCollectionName =
    selectedVenue !== "all"
      ? `${selectedVenue} Scenic Design`
      : selectedCategoryLabel
        ? `${selectedCategoryLabel} Scenic Design`
        : selectedYear !== "all"
          ? `${selectedYear} Scenic Design Portfolio`
          : "Scenic Design Portfolio";
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

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <SEO
        title={scenicArchiveTitle}
        description={scenicArchiveDescription}
        image={sortedProjects?.[0]?.coverImageUrl || undefined}
        imageAlt={
          sortedProjects?.[0]
            ? `${sortedProjects[0].title} scenic design cover image`
            : "Scenic design portfolio cover image"
        }
        keywords={[
          "scenic design portfolio",
          "theatre set design",
          "Brandon PT Davis",
          selectedCategoryLabel,
          selectedVenue !== "all" ? selectedVenue : null,
          selectedYear !== "all" ? selectedYear : null,
        ]
          .filter(Boolean)
          .join(", ")}
        url="https://www.brandonptdavis.com/projects"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Scenic Design Portfolio", url: "https://www.brandonptdavis.com/projects" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: scenicCollectionName,
          url: "https://www.brandonptdavis.com/projects",
          description: scenicArchiveDescription,
          about: "Scenic design projects in regional theatre, summer stock, and academic production.",
          primaryImageOfPage: sortedProjects?.[0]?.coverImageUrl || undefined,
          mainEntity: {
            name: scenicCollectionName,
            itemListElement: sortedProjects.slice(0, 40).map((project, index) => ({
              position: index + 1,
              name: project.title,
              url: `https://www.brandonptdavis.com${getProjectPath(project)}`,
              datePublished: project.year ? `${project.year}-01-01` : undefined,
              image: project.coverImageUrl || undefined,
            })),
          },
        }}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: scenicCollectionName,
          description:
            scenicArchiveDescription,
          url: "https://www.brandonptdavis.com/projects",
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          genre: "Scenic Design",
          about: "Professional scenic design portfolio",
          mainEntityOfPage: "https://www.brandonptdavis.com/projects",
          dateModified: latestProjectUpdateDate,
          keywords: [
            "scenic design portfolio",
            "theatre set design",
            "USA 829 scenic designer",
            "Brandon PT Davis",
          ],
          image: sortedProjects
            .slice(0, 12)
            .map((project) => project.coverImageUrl)
            .filter((url): url is string => Boolean(url)),
          workExample: sortedProjects
            .slice(0, 20)
            .map((project) => ({
              type: "ImageObject" as const,
              contentUrl: project.coverImageUrl || "",
              name: project.title,
              caption: `${project.title} scenic design by Brandon PT Davis`,
            }))
            .filter((item) => item.contentUrl),
        }}
      />

      <Header />

      <main>
        <section className="border-b border-white/10 bg-black pb-8 pt-24 md:pb-10 md:pt-28">
          <div className="container max-w-[88rem]">
            <div className="max-w-5xl">
              {currentHeading === pageTitle ? (
                <p className="mb-5 section-kicker text-white/42">
                  {pageSubtitle}
                </p>
              ) : null}
              <h1 className="font-sans text-[clamp(3.2rem,7vw,7.1rem)] font-medium leading-[0.86] tracking-[-0.065em] text-white">
                {currentHeading}
              </h1>
              {currentHeading === pageTitle ? (
                <p className="mt-7 max-w-3xl text-[1.02rem] leading-7 text-white/62 md:text-[1.12rem]">
                  {pageIntro}
                </p>
              ) : null}
            </div>

            <div className="mt-10 flex flex-col gap-5 border-t border-border/35 pt-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="md:hidden">
                <div className="-mx-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex min-w-max items-center gap-2 px-1">
                    <button
                      type="button"
                      onClick={() => setSelectedSubcategory("all")}
                      className={`inline-flex h-10 items-center rounded-full border px-4 text-sm tracking-[-0.01em] transition-colors ${
                        selectedSubcategory === "all"
                          ? "border-foreground/20 bg-foreground text-background"
                          : "border-border/50 bg-background/70 text-white/70 hover:border-border hover:text-white"
                      }`}
                    >
                      <Rows3 className="mr-2 h-4 w-4" />
                      All
                    </button>
                    {subcategories.map((category) => {
                      const CategoryIcon = getCategoryIcon(category.label);

                      return (
                        <button
                          key={category.key}
                          type="button"
                          onClick={() => setSelectedSubcategory(category.key)}
                          className={`inline-flex h-10 items-center whitespace-nowrap rounded-full border px-4 text-sm tracking-[-0.01em] transition-colors ${
                            selectedSubcategory === category.key
                              ? "border-foreground/20 bg-foreground text-background"
                              : "border-border/50 bg-background/70 text-white/70 hover:border-border hover:text-white"
                          }`}
                        >
                          <CategoryIcon className="mr-2 h-4 w-4" />
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="hidden overflow-x-auto md:block">
                <div className="flex min-w-max items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory("all")}
                    className={`inline-flex items-center gap-2 text-[1.05rem] transition-colors ${
                      selectedSubcategory === "all"
                        ? "text-white"
                        : "text-white/52 hover:text-white/80"
                    }`}
                  >
                    <Rows3 className="h-4 w-4" />
                    All
                  </button>
                  {subcategories.map((category) => {
                    const CategoryIcon = getCategoryIcon(category.label);

                    return (
                      <button
                        key={category.key}
                        type="button"
                        onClick={() => setSelectedSubcategory(category.key)}
                        className={`inline-flex items-center gap-2 text-[1.05rem] transition-colors ${
                          selectedSubcategory === category.key
                            ? "text-white"
                            : "text-white/52 hover:text-white/80"
                        }`}
                      >
                        <CategoryIcon className="h-4 w-4" />
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
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
                          <p className="text-sm font-medium text-white">Filter productions</p>
                          <p className="text-xs text-white/52">Refine by venue or date.</p>
                        </div>
                        {(selectedVenue !== "all" || selectedYear !== "all") && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVenue("all");
                              setSelectedYear("all");
                            }}
                            className="text-xs text-white/55 transition-colors hover:text-white"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                          Venue
                        </p>
                        <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
                          <button
                            type="button"
                            onClick={() => setSelectedVenue("all")}
                            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                              selectedVenue === "all"
                                ? "border-white/30 bg-white/10 text-white"
                                : "border-border/50 text-white/62 hover:border-border hover:text-white"
                            }`}
                          >
                            All venues
                          </button>
                          {venueOptions.map((venue) => (
                            <button
                              key={venue}
                              type="button"
                              onClick={() => setSelectedVenue(venue)}
                              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                                selectedVenue === venue
                                  ? "border-white/30 bg-white/10 text-white"
                                  : "border-border/50 text-white/62 hover:border-border hover:text-white"
                              }`}
                            >
                              {venue}
                            </button>
                          ))}
                        </div>
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
                    {SORT_OPTIONS.map((option) => {
                      const SortIcon = option.icon;

                      return (
                        <DropdownMenuItem
                          key={option.key}
                          onClick={() => setSortKey(option.key)}
                          className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm"
                        >
                          <span className="inline-flex items-center gap-2">
                            <SortIcon className="h-4 w-4 text-white/54" />
                            {option.label}
                          </span>
                          {sortKey === option.key ? <Check className="h-4 w-4" /> : null}
                        </DropdownMenuItem>
                      );
                    })}
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

            {(selectedVenue !== "all" || selectedYear !== "all" || sortKey !== "newest") && (
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/52">
                <span>{sortedProjects.length} productions</span>
                {selectedVenue !== "all" ? <span>Venue: {selectedVenue}</span> : null}
                {selectedYear !== "all" ? <span>Date: {selectedYear}</span> : null}
                {sortKey !== "newest" ? (
                  <span>Sort: {SORT_OPTIONS.find((option) => option.key === sortKey)?.label}</span>
                ) : null}
              </div>
            )}
          </div>
        </section>

        {isLoading ? (
          <PortfolioGridSkeleton />
        ) : sortedProjects.length > 0 ? (
          <section className="bg-[#111111] px-[clamp(0.9rem,1.8vw,1.35rem)] py-[clamp(0.9rem,1.8vw,1.35rem)] pb-20 md:pb-28">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-[clamp(0.9rem,1.8vw,1.35rem)] md:grid-cols-2">
                {sortedProjects.map((project, index) => {
                  const href = getProjectPath(project);

                  return (
                    <ProjectCard
                      key={`${project.slug}-${index}`}
                      eager={index < 2}
                      href={href}
                      layoutClass={getProjectPanelClass(index)}
                      onNavigate={navigateWithTransition}
                      project={project}
                      scenicAlt={scenicAlt}
                      sizes={getProjectImageSizes(index)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="mx-auto max-w-[88rem] border-t border-white/12">
                {sortedProjects.map((project, index) => {
                  const href = getProjectPath(project);
                  const directorLabel = getDirectorLabel(project);

                  return (
                    <a
                      key={`${project.slug}-${index}`}
                      href={href}
                      onClick={(event) => navigateWithTransition(event, href)}
                      className="group grid gap-4 border-b border-white/12 py-5 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8"
                    >
                      <div className="space-y-2 text-sm text-white/48">
                        <p className="text-white/82">{getVenueLabel(project)}</p>
                        <p>{formatProjectDate(project) || "Date unavailable"}</p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[1.12rem] font-normal tracking-[-0.025em] text-white/88">
                          {project.title}
                        </p>
                        {directorLabel ? (
                          <p className="mt-2 text-sm leading-6 text-white/52">{directorLabel}</p>
                        ) : null}
                        {project.subcategory ? (
                          <p className="mt-1 text-sm leading-6 text-white/38">{project.subcategory}</p>
                        ) : null}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section className="bg-[#111111] pb-24 pt-16">
            <div className="container max-w-[88rem] text-center">
              <p className="text-white/55">
                No scenic design productions match the current filters.
              </p>
            </div>
          </section>
        )}

        <section className="border-t border-white/12 bg-[#111111] py-18 md:py-24">
          <div className="container max-w-[88rem]">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.72fr)] lg:items-start">
              <div className="space-y-5">
                <p className="text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-none tracking-[-0.035em] text-white/46">
                  Portfolio notes
                </p>
                <h2 className="max-w-3xl font-sans text-[clamp(2.4rem,5vw,5.2rem)] font-medium leading-[0.88] tracking-[-0.075em] text-white">
                  Production images first. Process in context.
                </h2>
                <p className="max-w-3xl text-[1.05rem] leading-7 text-white/68 md:text-[1.15rem] md:leading-8">
                  This archive is built around realized scenic design: the stage picture, the
                  architecture of the room, and the way each environment supports the performer.
                  Production photography leads because it shows scale, atmosphere, and how the
                  design actually lives under light, movement, and audience focus.
                </p>
                <p className="max-w-3xl text-[1.05rem] leading-7 text-white/54 md:text-[1.15rem] md:leading-8">
                  The filters are there for a working archive: move by genre, theatre company, or
                  season, then open a project for credits, additional images, and design context.
                  The goal is not just to show attractive photographs, but to make the thinking
                  behind the work easy to enter.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    icon: Drama,
                    title: "Scenic design",
                    copy: "Plays, musicals, Shakespeare, new work, and repertory production gathered as a visual archive.",
                  },
                  {
                    icon: Rows3,
                    title: "Production process",
                    copy: "Research, drafting, rendering, model work, and build coordination are treated as part of the same design story.",
                  },
                  {
                    icon: Building2,
                    title: "Collaborative rooms",
                    copy: "Each project reflects the directors, shops, performers, and production teams that shaped the final stage picture.",
                  },
                ].map(({ icon: Icon, title, copy }) => (
                  <div
                    key={title}
                    className="rounded-[1.5rem] bg-black p-6 text-white shadow-[0_18px_54px_rgba(0,0,0,0.28)] ring-1 ring-white/[0.07]"
                  >
                    <Icon className="mb-8 h-7 w-7 text-white/82" strokeWidth={1.8} aria-hidden="true" />
                    <h3 className="max-w-[14ch] font-sans text-[1.55rem] font-medium leading-[0.96] tracking-[-0.055em] text-white">
                      {title}
                    </h3>
                    <p className="mt-4 max-w-md text-[0.98rem] leading-6 text-white/58">
                      {copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {scenicArticleCards.length > 0 ? (
          <section className="border-t border-white/12 bg-[#111111] py-16 md:py-24">
            <div className="px-[clamp(1.5rem,5vw,6rem)]">
              <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-none tracking-[-0.035em] text-white/46">
                    Scenic design writing
                  </p>
                  <h2 className="mt-3 max-w-[13ch] bg-gradient-to-r from-[#2f6dff] via-[#9d4edd] to-[#d6a8ff] bg-clip-text font-sans text-[clamp(2.4rem,5.2vw,5.4rem)] font-medium leading-[0.9] tracking-[-0.075em] text-transparent">
                    Notes behind the work.
                  </h2>
                </div>
                <a
                  href="/articles?category=Scenic%20Design"
                  className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-[#9d4edd]/72 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-[#e0aaff] transition-colors hover:border-[#c77dff] hover:text-white"
                >
                  View articles
                </a>
              </div>
            </div>

            <div
              ref={articleCardsRef}
              className="overflow-x-auto px-[clamp(1.5rem,5vw,6rem)] pb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex min-w-max gap-5 pr-[clamp(1.5rem,5vw,6rem)]">
                {scenicArticleCards.map(card => (
                  <a
                    key={card.href}
                    href={card.href}
                    className="group relative flex h-[30rem] w-[min(21rem,78vw)] flex-col justify-end overflow-hidden rounded-[2rem] bg-black p-6 text-white shadow-[0_20px_58px_rgba(0,0,0,0.32)] ring-1 ring-white/[0.06] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_26px_68px_rgba(0,0,0,0.4)] md:w-[22rem]"
                    aria-label={`Article: ${card.title}`}
                  >
                    <img
                      src={card.image}
                      alt={card.imageAlt}
                      className="site-media-square absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/18" />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/88 via-black/48 to-transparent" />
                    <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/28 to-transparent" />

                    <div className="relative z-10">
                      <p className="font-sans text-[0.74rem] font-semibold tracking-[-0.015em] text-white/68">
                        {card.category}
                      </p>
                      <h3 className="mt-3 max-w-[13ch] font-sans text-[1.64rem] font-medium leading-[0.98] tracking-[-0.055em] text-white">
                        {card.title}
                      </h3>
                      <p className="mt-4 max-w-[18rem] text-[0.94rem] leading-6 tracking-[-0.012em] text-white/68">
                        {card.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 px-[clamp(1.5rem,5vw,6rem)]">
              <button
                type="button"
                onClick={() => scrollArticleCards("previous")}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-white/62 transition-colors hover:bg-white hover:text-black"
                aria-label="Previous scenic design articles"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollArticleCards("next")}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-white/72 transition-colors hover:bg-white hover:text-black"
                aria-label="Next scenic design articles"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
