"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
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
import { PortfolioGridSkeleton } from "@/components/SkeletonLoaders";
import { StickyShowcase } from "@/components/StickyShowcase";
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
  scenicShowcaseProps,
} from "@/lib/scenicShowcase";
import { getLocalScenicProjects } from "@shared/localScenicProjects";

type SortKey = "newest" | "oldest" | "title" | "venue";
type ViewMode = "grid" | "list";

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "title", label: "Production title" },
  { key: "venue", label: "Venue" },
];

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

const getDirectorLabel = (project: any) => {
  let team: any = project.creativeTeam;

  try {
    if (typeof team === "string") {
      team = JSON.parse(team);
    }
  } catch {
    team = null;
  }

  if (Array.isArray(team)) {
    const director = team.find((member) => {
      const role = String(member?.role || "").toLowerCase();
      return role === "director" || role.includes("director");
    });

    return director?.name ? `Dir. ${director.name}` : null;
  }

  if (team && typeof team === "object") {
    const directorName = team.director;
    return typeof directorName === "string" && directorName.trim()
      ? `Dir. ${directorName.trim()}`
      : null;
  }

  return null;
};

function ProjectCard({
  href,
  onNavigate,
  project,
  scenicAlt,
  eager,
}: {
  href: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  project: any;
  scenicAlt: (title: string) => string;
  eager?: boolean;
}) {
  return (
    <a href={href} onClick={(event) => onNavigate(event, href)}>
      <div className="group">
        <div
          className="transition-card relative overflow-hidden rounded-xl bg-background/50"
          style={{ viewTransitionName: `project-card-${project.slug}` } as CSSProperties}
        >
          {project.coverImageUrl ? (
            <Image
              src={project.coverImageUrl}
              alt={scenicAlt(project.title)}
              fill
              quality={82}
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              priority={Boolean(eager)}
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
            />
          ) : (
            <div className="aspect-square w-full bg-muted" />
          )}
        </div>

        <div className="pt-4">
          <p className="text-[1.02rem] font-normal tracking-[-0.02em] text-white/88">
            {project.title}
          </p>
          {(getVenueLabel(project) || formatProjectDate(project)) ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm tracking-[-0.01em]">
              {getVenueLabel(project) ? (
                <span className="text-white/82">{getVenueLabel(project)}</span>
              ) : null}
              {formatProjectDate(project) ? (
                <span className="text-white/42">{formatProjectDate(project)}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </a>
  );
}

export default function Projects() {
  const [, setLocation] = useLocation();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedVenue, setSelectedVenue] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const mergedProjects = useMemo(() => getLocalScenicProjects(), []);
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
    "Use category, venue, and date filters to move through scenic design productions and compare venues, timelines, and production contexts.";
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
  const currentHeadingMeta = [
    selectedVenue !== "all" ? "Venue" : null,
    selectedCategoryLabel ? "Category" : null,
    selectedYear !== "all" ? "Date" : null,
  ].filter(Boolean);

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
  const isDefaultAllView =
    selectedSubcategory === "all" &&
    selectedVenue === "all" &&
    selectedYear === "all" &&
    sortKey === "newest";
  const showShowcase = viewMode === "grid" && isDefaultAllView && sortedProjects.length >= 4;
  const [featuredProject, ...remainingProjects] = sortedProjects;
  const showcaseRailProjects = remainingProjects.slice(0, 3);
  const showcaseGridProjects = remainingProjects.slice(3);

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

  return (
    <div className="min-h-screen">
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
        <section className="border-b border-border/40 pb-8 pt-24 md:pb-10 md:pt-28">
          <div className="container max-w-[88rem]">
            <div className="max-w-3xl">
              {currentHeading === pageTitle ? (
                <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.24em] text-white/42">
                  {pageSubtitle}
                </p>
              ) : null}
              <h1 className="font-sans text-[clamp(2.3rem,4.6vw,3.8rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                {currentHeading}
              </h1>
              {currentHeading === pageTitle ? (
                <p className="mt-6 max-w-3xl text-[1rem] leading-7 text-white/58 md:text-[1.05rem]">
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
                      All
                    </button>
                    {subcategories.map((category) => (
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
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden overflow-x-auto md:block">
                <div className="flex min-w-max items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory("all")}
                    className={`text-[1.05rem] transition-colors ${
                      selectedSubcategory === "all"
                        ? "text-white"
                        : "text-white/52 hover:text-white/80"
                    }`}
                  >
                    All
                  </button>
                  {subcategories.map((category) => (
                    <button
                      key={category.key}
                      type="button"
                      onClick={() => setSelectedSubcategory(category.key)}
                      className={`text-[1.05rem] transition-colors ${
                        selectedSubcategory === category.key
                          ? "text-white"
                          : "text-white/52 hover:text-white/80"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
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
          <>
            {showShowcase && featuredProject ? (
              <>
                <StickyShowcase
                  continuationItems={showcaseGridProjects}
                  featuredItem={featuredProject}
                  itemAlt={scenicAlt}
                  itemHref={getProjectPath}
                  onNavigate={navigateWithTransition}
                  railItems={showcaseRailProjects}
                  title={featuredProject.title}
                  {...scenicShowcaseProps}
                />
              </>
            ) : (
              <section className="pb-20 pt-12 md:pb-28 md:pt-14">
                <div className="container max-w-[88rem]">
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {sortedProjects.map((project, index) => {
                        const href = getProjectPath(project);

                        return (
                          <ProjectCard
                            key={project.slug}
                            eager={index < 2}
                            href={href}
                            onNavigate={navigateWithTransition}
                            project={project}
                            scenicAlt={scenicAlt}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="border-t border-border/35">
                      {sortedProjects.map((project) => {
                        const href = getProjectPath(project);
                        const directorLabel = getDirectorLabel(project);

                        return (
                          <a
                            key={project.slug}
                            href={href}
                            onClick={(event) => navigateWithTransition(event, href)}
                            className="group grid gap-4 border-b border-border/35 py-5 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8"
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
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="pb-24 pt-16">
            <div className="container max-w-[88rem] text-center">
              <p className="text-white/55">
                No scenic design productions match the current filters.
              </p>
            </div>
          </section>
        )}

        <section className="border-t border-border/35 py-16 md:py-20">
          <div className="container max-w-[88rem]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
              About This Portfolio
            </p>
            <div className="mt-4 grid gap-10 lg:grid-cols-2">
              <div className="space-y-5">
                <h2 className="font-sans text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
                  Scenic Design Portfolio in Practice
                </h2>
                <p className="max-w-3xl text-[1rem] leading-7 text-white/62 md:text-[1.05rem]">
                  As a USA 829 scenic designer, this portfolio documents production work across
                  regional theatre, summer stock, and academic performance. The material includes
                  concept development, drafting, white models, rendering studies, and realized
                  stage photography.
                </p>
                <p className="max-w-3xl text-[1rem] leading-7 text-white/55 md:text-[1.05rem]">
                  Each project begins with the script and the collaborative framework around it,
                  then moves through research, spatial study, drafting coordination, and production
                  execution. The aim is consistent: environments that support story, performer
                  movement, and audience focus.
                </p>
              </div>

              <div className="space-y-4 rounded-xl bg-card/20 p-6 md:p-8">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Core Focus Areas
                </h3>
                <ul className="space-y-3 text-sm text-white/62 md:text-base">
                  <li>Scenic design for plays and musicals</li>
                  <li>Drafting and build documentation for production teams</li>
                  <li>Rendering studies for visual communication and alignment</li>
                  <li>Collaboration with lighting, costume, and technical teams</li>
                  <li>Story-driven environments for live performance</li>
                </ul>
                <p className="pt-2 text-xs uppercase tracking-[0.18em] text-white/42">
                  USA 829 • Southern California • Available Nationally
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
