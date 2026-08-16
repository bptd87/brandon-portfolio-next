"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  ArrowUpDown,
  ArrowDownAZ,
  Building2,
  CalendarArrowDown,
  CalendarArrowUp,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  Rows3,
  SlidersHorizontal,
  X,
  type LucideIcon,
} from "lucide-react";

import Header from "@/components/Header";
import MotionReveal from "@/components/MotionReveal";
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
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  type HomeColorTheme,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";
import {
  getScenicProjectTimestamp,
  scenicPortfolioLandingCopy,
} from "@/lib/scenicShowcase";
import { useIsDesktopViewport } from "@/hooks/useIsDesktopViewport";
import type { ScenicProjectSummary } from "@shared/scenicProjectSummaries";

type SortKey = "newest" | "oldest" | "title" | "venue";
type ViewMode = "grid" | "list";
const SCENIC_PORTFOLIO_PATH = "/projects";
const SORT_OPTIONS: Array<{ key: SortKey; label: string; icon: LucideIcon }> = [
  { key: "newest", label: "Newest first", icon: CalendarArrowDown },
  { key: "oldest", label: "Oldest first", icon: CalendarArrowUp },
  { key: "title", label: "Production title", icon: ArrowDownAZ },
  { key: "venue", label: "Venue", icon: Building2 },
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

const getDirectorLabel = (project: ScenicProjectSummary) => {
  return project.directorName ? `Dir. ${project.directorName}` : null;
};

function ProjectCard({
  href,
  layoutClass,
  onNavigate,
  project,
  scenicAlt,
  eager,
  sizes,
  aspectClassName,
  homeTheme,
  revealDelay = 0,
}: {
  href: string;
  layoutClass?: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, project: ScenicProjectSummary) => void;
  project: any;
  scenicAlt: (title: string) => string;
  eager?: boolean;
  sizes: string;
  aspectClassName: string;
  homeTheme: HomeColorTheme;
  revealDelay?: number;
}) {
  return (
    <div className={`${layoutClass || ""} h-full`}>
      <a
        href={href}
        onClick={(event) => onNavigate(event, project)}
        data-project-landing-card
        data-inview="false"
        className="project-landing-card portfolio-focus-card group block h-full"
        style={
          {
            color: homeTheme.ink,
            "--project-landing-delay": `${revealDelay}ms`,
          } as CSSProperties
        }
      >
        <article className="h-full">
          <div className={`relative ${aspectClassName}`}>
            <div className="project-landing-shadow" aria-hidden="true" />
            <div
              className="project-landing-media-shell portfolio-focus-media relative h-full overflow-hidden rounded-[1.65rem] bg-[#f1f0ec] shadow-[0_1rem_2.4rem_rgba(0,0,0,0.12)] ring-1 ring-black/5"
              style={{ viewTransitionName: `project-card-${project.slug}` } as CSSProperties}
            >
              {project.coverImageUrl ? (
                <Image
                  src={project.coverImageUrl}
                  alt={scenicAlt(project.title)}
                  fill
                  draggable={false}
                  quality={eager ? 84 : 78}
                  className="project-landing-image select-none object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.018]"
                  style={{
                    objectPosition: project.coverImagePosition || "center",
                  }}
                  priority={Boolean(eager)}
                  loading={eager ? "eager" : "lazy"}
                  fetchPriority={eager ? "high" : "auto"}
                  sizes={sizes}
                />
              ) : (
                <div className="h-full w-full rounded-[inherit] bg-muted" />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/58 via-black/24 to-transparent px-5 pb-5 pt-14 text-white md:px-6 md:pb-6">
                <h2
                  className="max-w-[18ch] text-[clamp(1.05rem,1.35vw,1.45rem)] font-black uppercase leading-[0.9] tracking-[0] drop-shadow-[0_0.16rem_0.5rem_rgba(0,0,0,0.36)]"
                  style={{
                    fontFamily: HOME_DISPLAY_FONT,
                    fontStretch: "condensed",
                  }}
                >
                  {project.title}
                </h2>
                {getVenueLabel(project) ? (
                  <p
                    className="mt-1 max-w-[22ch] text-[0.78rem] font-medium leading-tight text-white/78 drop-shadow-[0_0.12rem_0.35rem_rgba(0,0,0,0.34)] md:text-[0.85rem]"
                    style={{ fontFamily: HOME_BODY_FONT }}
                  >
                    {getVenueLabel(project)}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </article>
      </a>
    </div>
  );
}

const getProjectPanelClass = (index: number) => {
  const patternIndex = index % 5;
  return patternIndex < 2 ? "md:col-span-3" : "md:col-span-2";
};

const getProjectAspectClass = (index: number) => {
  return index % 5 < 2 ? "aspect-[3/2]" : "aspect-square";
};

const getProjectImageSizes = (index: number) => {
  return index % 5 < 2 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw";
};

export default function Projects({
  initialProjects,
}: {
  initialProjects: ScenicProjectSummary[];
}) {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const isDesktopViewport = useIsDesktopViewport();
  const projectGridRef = useRef<HTMLDivElement | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activePortfolioProject, setActivePortfolioProject] = useState<ScenicProjectSummary | null>(null);
  const [isPortfolioLightboxOpen, setIsPortfolioLightboxOpen] = useState(false);

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

  const filteredProjects = useMemo(() => {
    if (!mergedProjects.length) return [];

    return mergedProjects.filter((project) => {
      if (
        selectedSubcategory !== "all" &&
        normalizeText(project.subcategory) !== selectedSubcategory
      ) {
        return false;
      }

      return true;
    });
  }, [mergedProjects, selectedSubcategory]);

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
  const visibleViewMode = isDesktopViewport ? viewMode : "grid";
  const eagerProjectCount = isDesktopViewport ? 2 : 1;

  useEffect(() => {
    if (visibleViewMode !== "grid") return;

    const grid = projectGridRef.current;
    if (!grid) return;

    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-project-landing-card]")
    );

    if (!cards.length) return;

    cards.forEach((card) => {
      card.dataset.inview = "false";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.inview = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [sortedProjects, visibleViewMode]);

  const latestProjectUpdate = sortedProjects
    .map((project: any) => project.updatedAt || project.publishedAt || project.createdAt)
    .filter(Boolean)
    .sort((a, b) => new Date(b as any).getTime() - new Date(a as any).getTime())[0];
  const latestProjectUpdateDate = latestProjectUpdate
    ? new Date(latestProjectUpdate as any).toISOString().split("T")[0]
    : undefined;

  const pageTitle = scenicPortfolioLandingCopy.title;
  const pageDescription =
    "Scenic design productions by Brandon PT Davis, spanning plays, musicals, Shakespeare, new work, and regional theatre environments.";
  const scenicAlt = (title: string) => `${title} scenic design by Brandon PT Davis`;
  const selectedCategoryLabel =
    subcategories.find((item) => item.key === selectedSubcategory)?.label || null;
  const currentHeading =
    selectedCategoryLabel ? selectedCategoryLabel : pageTitle;
  const heroDisplayTitle = currentHeading;
  const activeFilterCount = selectedSubcategory !== "all" ? 1 : 0;
  const scenicArchiveTitle =
    selectedCategoryLabel
      ? `${selectedCategoryLabel} Scenic Design | Brandon PT Davis`
      : "Scenic Design Portfolio | Brandon PT Davis";
  const scenicArchiveDescription =
    selectedCategoryLabel
      ? `${selectedCategoryLabel} scenic design projects by Brandon PT Davis, including realized productions, design notes, and portfolio documentation.`
      : `Explore scenic design productions by Brandon PT Davis. ${pageDescription}`;
  const scenicCollectionName =
    selectedCategoryLabel ? `${selectedCategoryLabel} Scenic Design` : "Scenic Design Portfolio";
  const getProjectFromCurrentUrl = () => {
    if (typeof window === "undefined") return null;
    const currentPath = window.location.pathname.replace(/\/$/, "");
    return (
      mergedProjects.find((project) => getProjectPath(project) === currentPath) ||
      null
    );
  };

  const closeProjectQuickView = (updateUrl = true) => {
    setActivePortfolioProject(null);

    if (!updateUrl || typeof window === "undefined") return;

    const historyState = window.history.state as { scenicPortfolioModal?: string } | null;
    if (historyState?.scenicPortfolioModal) {
      window.history.back();
      return;
    }

    if (window.location.pathname.replace(/\/$/, "") !== SCENIC_PORTFOLIO_PATH) {
      window.history.replaceState(null, "", SCENIC_PORTFOLIO_PATH);
    }
  };

  const openProjectQuickView = (
    event: MouseEvent<HTMLAnchorElement>,
    project: ScenicProjectSummary
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
    setActivePortfolioProject(project);

    if (typeof window !== "undefined") {
      const projectHref = getProjectPath(project);
      if (window.location.pathname.replace(/\/$/, "") !== projectHref) {
        window.history.pushState(
          { scenicPortfolioModal: project.slug },
          "",
          projectHref
        );
      }
    }
  };

  const themedButtonStyle = (active: boolean): CSSProperties => ({
    backgroundColor: active ? homeTheme.controlBg : homeTheme.accentSoft,
    color: active ? homeTheme.controlInk : homeTheme.ink,
    borderColor: active ? homeTheme.controlBg : homeTheme.accentSoft,
    fontFamily: HOME_DISPLAY_FONT,
  });

  useEffect(() => {
    if (!activePortfolioProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProjectQuickView();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePortfolioProject]);

  useEffect(() => {
    const syncModalFromUrl = () => {
      setActivePortfolioProject(getProjectFromCurrentUrl());
    };

    syncModalFromUrl();
    window.addEventListener("popstate", syncModalFromUrl);

    return () => {
      window.removeEventListener("popstate", syncModalFromUrl);
    };
  }, [mergedProjects]);

  useEffect(() => {
    if (!activePortfolioProject) {
      setIsPortfolioLightboxOpen(false);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "portfolioQuickViewLightbox") return;
      setIsPortfolioLightboxOpen(Boolean(event.data.open));
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      setIsPortfolioLightboxOpen(false);
    };
  }, [activePortfolioProject]);

  return (
    <div
      className="flex min-h-screen flex-col [--border:rgba(17,17,17,0.14)]"
      style={{
        "--background": homeTheme.bg,
        "--foreground": homeTheme.ink,
        backgroundColor: homeTheme.bg,
        color: homeTheme.ink,
        fontFamily: HOME_BODY_FONT,
      } as CSSProperties}
    >
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

      <main className="relative z-10 flex-1" style={{ backgroundColor: homeTheme.bg }}>
        <style jsx global>{`
          .project-landing-card {
            opacity: 0;
            transform: translate3d(0, 2.4rem, 0) scale(0.84);
            transition:
              opacity 520ms ease,
              transform 980ms cubic-bezier(0.18, 1.42, 0.24, 1);
            transition-delay: var(--project-landing-delay, 0ms);
            will-change: opacity, transform;
          }

          .project-landing-card[data-inview="true"] {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }

          .project-landing-media-shell {
            transform: scale(0.72);
            transition:
              box-shadow 520ms ease,
              transform 980ms cubic-bezier(0.18, 1.42, 0.24, 1);
            transition-delay: var(--project-landing-delay, 0ms);
            will-change: transform;
          }

          .project-landing-card[data-inview="true"] .project-landing-media-shell {
            transform: scale(1);
          }

          .project-landing-shadow {
            background: rgba(0, 0, 0, 0.16);
            border-radius: 1.65rem;
            box-shadow:
              0 1.2rem 2.8rem rgba(0, 0, 0, 0.08),
              0 4.5rem 5.5rem rgba(0, 0, 0, 0.07),
              0 8rem 7rem rgba(0, 0, 0, 0.035);
            filter: blur(18px);
            inset: 5% 4% -3%;
            opacity: 0;
            position: absolute;
            transform: translate3d(0, 1.25rem, 0) scale(0.76);
            transition:
              opacity 620ms ease,
              transform 980ms cubic-bezier(0.18, 1.42, 0.24, 1);
            transition-delay: var(--project-landing-delay, 0ms);
          }

          .project-landing-card[data-inview="true"] .project-landing-shadow {
            opacity: 0.72;
            transform: translate3d(0, 0.75rem, 0) scale(1);
          }

          .project-landing-media-shell,
          .project-landing-media-shell:has(> img),
          .project-landing-media-shell img,
          img.project-landing-image {
            border-radius: 1.65rem !important;
          }

          @media (prefers-reduced-motion: reduce) {
            .project-landing-card,
            .project-landing-media-shell,
            .project-landing-shadow {
              opacity: 1;
              transform: none;
              transition: none;
            }
          }
        `}</style>
        <section className="pt-[clamp(8rem,12vw,11rem)]">
          <div className="w-full">
            <div className="mx-auto max-w-[54rem] px-[clamp(2rem,8vw,9rem)] text-center">
              <MotionReveal delay={120}>
                <h1
                  className="mx-auto max-w-[10.5ch] text-balance text-[clamp(3.2rem,7vw,7rem)] font-black uppercase leading-[0.84] tracking-[0]"
                  style={{
                    color: homeTheme.ink,
                    fontFamily: HOME_DISPLAY_FONT,
                    fontStretch: "condensed",
                  }}
                >
                  {heroDisplayTitle.toUpperCase()}
                </h1>
                <p
                  className="mx-auto mt-5 max-w-[30rem] text-[clamp(0.98rem,1.2vw,1.12rem)] font-medium leading-7 tracking-[-0.02em]"
                  style={{ color: homeTheme.muted }}
                >
                  {scenicPortfolioLandingCopy.intro}
                </p>
              </MotionReveal>
            </div>

            <MotionReveal
              className="mx-auto mt-[clamp(2rem,4vw,3.25rem)] flex max-w-[74rem] flex-wrap items-center justify-center gap-3 px-[clamp(2rem,8vw,9rem)] py-4"
              delay={210}
            >
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-black uppercase leading-none tracking-[0.04em] transition-transform hover:-translate-y-0.5"
                      style={themedButtonStyle(activeFilterCount > 0)}
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filter
                      {activeFilterCount > 0 ? (
                        <span className="rounded-full bg-white/24 px-2 py-0.5 text-[11px] font-medium leading-none">
                          {activeFilterCount}
                        </span>
                      ) : null}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="center"
                    className="w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border p-5 shadow-2xl"
                    style={{
                      backgroundColor: homeTheme.bg,
                      borderColor: homeTheme.accentSoft,
                      color: homeTheme.ink,
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p
                            className="text-sm font-black uppercase tracking-[0.04em]"
                            style={{
                              color: homeTheme.ink,
                              fontFamily: HOME_DISPLAY_FONT,
                            }}
                          >
                            Categories
                          </p>
                          <p className="mt-1 text-xs" style={{ color: homeTheme.muted }}>
                            Choose the scenic work type.
                          </p>
                        </div>
                        {selectedSubcategory !== "all" ? (
                          <button
                            type="button"
                            onClick={() => setSelectedSubcategory("all")}
                            className="text-xs transition-opacity hover:opacity-70"
                            style={{ color: homeTheme.muted }}
                          >
                            Clear
                          </button>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSubcategory("all")}
                          className="inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[0.78rem] font-black uppercase leading-none tracking-[0.04em] transition-transform hover:-translate-y-0.5"
                          style={themedButtonStyle(selectedSubcategory === "all")}
                        >
                          <Rows3 className="h-4 w-4" />
                          All
                        </button>
                        {subcategories.map((category) => (
                          <button
                            key={category.key}
                            type="button"
                            onClick={() => setSelectedSubcategory(category.key)}
                            className="inline-flex h-9 items-center rounded-full border px-3 text-[0.78rem] font-black uppercase leading-none tracking-[0.04em] transition-transform hover:-translate-y-0.5"
                            style={themedButtonStyle(selectedSubcategory === category.key)}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-black uppercase leading-none tracking-[0.04em] transition-transform hover:-translate-y-0.5"
                      style={themedButtonStyle(sortKey !== "newest")}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      Sort
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 overflow-hidden rounded-2xl border p-2 shadow-2xl"
                    style={{
                      backgroundColor: homeTheme.bg,
                      borderColor: homeTheme.accentSoft,
                      color: homeTheme.ink,
                    }}
                  >
                    {SORT_OPTIONS.map((option) => {
                      const SortIcon = option.icon;

                      return (
                        <DropdownMenuItem
                          key={option.key}
                          onClick={() => setSortKey(option.key)}
                          className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-[#111111]"
                        >
                          <span className="inline-flex items-center gap-2">
                            <SortIcon className="h-4 w-4 text-black/54" />
                            {option.label}
                          </span>
                          {sortKey === option.key ? <Check className="h-4 w-4" /> : null}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div
                  className="hidden h-10 items-center rounded-full p-1 md:inline-flex"
                  style={{ backgroundColor: homeTheme.accentSoft }}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                    style={{
                      backgroundColor: viewMode === "grid" ? homeTheme.controlBg : "transparent",
                      color: viewMode === "grid" ? homeTheme.controlInk : homeTheme.muted,
                    }}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                    style={{
                      backgroundColor: viewMode === "list" ? homeTheme.controlBg : "transparent",
                      color: viewMode === "list" ? homeTheme.controlInk : homeTheme.muted,
                    }}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
            </MotionReveal>

            {(selectedSubcategory !== "all" || sortKey !== "newest") && (
              <div
                className="mx-auto flex max-w-[74rem] flex-wrap items-center gap-3 px-[clamp(2rem,8vw,9rem)] py-3 text-sm"
                style={{ color: homeTheme.muted }}
              >
                <span>{sortedProjects.length} productions</span>
                {selectedCategoryLabel ? <span>Category: {selectedCategoryLabel}</span> : null}
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
          <section className="px-[clamp(2rem,8vw,9rem)] py-[clamp(2.5rem,5vw,4.5rem)]">
            {visibleViewMode === "grid" ? (
              <div
                ref={projectGridRef}
                className="portfolio-focus-grid mx-auto grid max-w-[74rem] grid-cols-1 gap-[clamp(1.25rem,2.5vw,2rem)] sm:grid-cols-2 md:grid-cols-6"
              >
                {sortedProjects.map((project, index) => {
                  const href = getProjectPath(project);

                  return (
                    <ProjectCard
                      key={`${project.slug}-${index}`}
                      eager={index < eagerProjectCount}
                      href={href}
                      homeTheme={homeTheme}
                      aspectClassName={getProjectAspectClass(index)}
                      layoutClass={getProjectPanelClass(index)}
                      onNavigate={openProjectQuickView}
                      project={project}
                      revealDelay={(index % 10) * 70}
                      scenicAlt={scenicAlt}
                      sizes={getProjectImageSizes(index)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="mx-auto max-w-[74rem]">
                {sortedProjects.map((project, index) => {
                  const href = getProjectPath(project);
                  const directorLabel = getDirectorLabel(project);

                  return (
                    <a
                      key={`${project.slug}-${index}`}
                      href={href}
                      onClick={(event) => openProjectQuickView(event, project)}
                      className="group grid gap-4 rounded-[1.15rem] px-4 py-5 transition-colors md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8"
                      style={{ backgroundColor: index % 2 === 0 ? homeTheme.accentSoft : "transparent" }}
                    >
                      <div className="space-y-2 text-sm" style={{ color: homeTheme.muted }}>
                        <p style={{ color: homeTheme.ink }}>{getVenueLabel(project)}</p>
                        <p>{formatProjectDate(project) || "Date unavailable"}</p>
                      </div>

                      <div className="min-w-0">
                        <p
                          className="text-[1.12rem] font-black uppercase tracking-[0]"
                          style={{
                            color: homeTheme.ink,
                            fontFamily: HOME_DISPLAY_FONT,
                            fontStretch: "condensed",
                          }}
                        >
                          {project.title}
                        </p>
                        {directorLabel ? (
                          <p className="mt-2 text-sm leading-6" style={{ color: homeTheme.muted }}>{directorLabel}</p>
                        ) : null}
                        {project.subcategory ? (
                          <p className="mt-1 text-sm leading-6" style={{ color: homeTheme.muted }}>{project.subcategory}</p>
                        ) : null}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section className="pb-24 pt-16">
            <div className="container max-w-[88rem] text-center">
              <p style={{ color: homeTheme.muted }}>
                No scenic design productions match the current filters.
              </p>
            </div>
          </section>
        )}

      </main>

      {activePortfolioProject && typeof document !== "undefined" ? createPortal(
        <div
          className="fixed inset-0 z-[2147483646] overflow-hidden bg-black/42 p-[clamp(0.55rem,1.5vw,1.25rem)] backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`scenic-portfolio-modal-${activePortfolioProject.slug}`}
          onClick={() => closeProjectQuickView()}
        >
          <div
            className="relative h-[calc(100dvh-clamp(1.1rem,3vw,2.5rem))] w-full overflow-hidden rounded-none shadow-[0_2rem_5rem_rgba(0,0,0,0.28)]"
            style={{ backgroundColor: homeTheme.bg }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id={`scenic-portfolio-modal-${activePortfolioProject.slug}`}
              className="sr-only"
            >
              {activePortfolioProject.title}
            </h2>

            <iframe
              key={activePortfolioProject.slug}
              src={`${getProjectPath(activePortfolioProject)}?quickView=1`}
              title={`${activePortfolioProject.title} scenic design portfolio project`}
              className="absolute inset-0 h-full w-full border-0"
              style={{ backgroundColor: homeTheme.bg }}
            />

            <button
              type="button"
              aria-label="Close scenic portfolio project"
              className={`absolute right-[clamp(0.75rem,1.6vw,1.15rem)] top-[clamp(0.75rem,1.6vw,1.15rem)] z-[5] grid h-12 w-12 place-items-center rounded-full shadow-[0_1rem_2.5rem_rgba(0,0,0,0.22)] transition-[opacity,transform] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 ${
                isPortfolioLightboxOpen ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
              style={{
                backgroundColor: homeTheme.controlBg,
                color: homeTheme.controlInk,
              }}
              onClick={() => closeProjectQuickView()}
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}
