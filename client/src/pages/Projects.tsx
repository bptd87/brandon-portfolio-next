"use client";

import { useMemo, useState } from "react";
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
import PortfolioTopBar from "@/components/PortfolioTopBar";
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
import type { ScenicProjectSummary } from "@shared/scenicProjectSummaries";

type SortKey = "newest" | "oldest" | "title" | "venue";
type ViewMode = "grid" | "list";
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
      className={`group block border-b border-r border-white/12 ${layoutClass || ""}`}
    >
      <article className="bg-[#111111]">
        <div
          className="site-media-square relative aspect-[4/3] overflow-hidden bg-[#181818]"
          style={{ viewTransitionName: `project-card-${project.slug}` } as CSSProperties}
        >
          {project.coverImageUrl ? (
            <Image
              src={project.coverImageUrl}
              alt={scenicAlt(project.title)}
              fill
              quality={86}
              className="site-media-square object-cover object-center"
              style={{
                objectPosition: project.coverImagePosition || "center",
              }}
              priority={Boolean(eager)}
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
              sizes={sizes}
            />
          ) : (
            <div className="aspect-[4/3] w-full bg-muted" />
          )}
        </div>
        <div className="min-h-[8.5rem] border-t border-white/12 p-[clamp(0.9rem,1.5vw,1.2rem)] text-white">
          <div>
            <h2 className="max-w-[18ch] font-sans text-[clamp(1.2rem,1.7vw,1.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white transition-colors group-hover:text-white/72">
              {project.title}
            </h2>
            {getVenueLabel(project) ? (
              <p className="mt-2 max-w-[18ch] font-sans text-[0.94rem] leading-tight tracking-[-0.025em] text-white/52">
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
  return index % 6 < 2 ? "md:col-span-2" : "";
};

const getProjectImageSizes = (index: number) => {
  return index % 6 < 2 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw";
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

  const mergedProjects = useMemo(() => initialProjects, [initialProjects]);
  const isLoading = false;

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
  const heroDisplayTitle = currentHeading;
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
    void performNavigation();
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
      <PortfolioTopBar />

      <main>
        <section className="bg-[#111111] pt-12 md:pt-16">
          <div className="w-full">
            <div className="px-[clamp(1.5rem,5vw,6rem)]">
              <div className="mb-5 pb-4">
                <div>
                  <p className="max-w-2xl text-[0.95rem] leading-6 tracking-[-0.015em] text-white/54">
                    {currentHeading === pageTitle ? pageSubtitle : pageTitle}
                  </p>
                  {currentHeading === pageTitle ? (
                    <p className="mt-3 max-w-2xl text-[1rem] leading-6 text-white/58 md:text-[1.08rem]">
                      {pageIntro}
                    </p>
                  ) : null}
                </div>
              </div>
              <h1 className="font-sans text-[clamp(4.2rem,12vw,12.8rem)] font-medium leading-[0.82] tracking-[-0.07em] text-white">
                {heroDisplayTitle}
              </h1>
            </div>

            <div className="mt-6 flex flex-col gap-5 px-[clamp(1.5rem,5vw,6rem)] py-4 lg:flex-row lg:items-center lg:justify-between">
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
              <div className="flex flex-wrap items-center gap-3 px-[clamp(1.5rem,5vw,6rem)] py-3 text-sm text-white/52">
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
          <section className="border-t border-white/12 bg-[#111111]">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 border-l border-white/12 md:grid-cols-4">
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

      </main>

      <Footer />
    </div>
  );
}
