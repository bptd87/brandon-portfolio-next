"use client";

import { usePathname, useRouter } from "next/navigation";
import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import {
  recentArticlePreview,
  recentExperientialPreview,
  recentRenderingPreview,
  recentScenicProjects,
  recentTutorialPreview,
  studioAppPreview,
} from "./navigationData";

type MenuItem = {
  name: string;
  path: string;
  description: string;
  external?: boolean;
  feature?: MenuFeature;
};

type MenuGroup = {
  heading: string;
  items: MenuItem[];
};

type MenuFeature = {
  label: string;
  title: string;
  description: string;
  path: string;
  image: string;
  imageFit?: "cover" | "contain";
  external?: boolean;
};

type DesktopCategory = {
  label: "Portfolio" | "About" | "Studio" | "Instagram";
  path: string;
  external?: boolean;
  groups: MenuGroup[];
  feature: MenuFeature;
};

const INSTAGRAM_PORTFOLIO_URL =
  "https://www.instagram.com/brandonptdavisdesign/";
const INSTAGRAM_FEATURED_POST_URL = "https://www.instagram.com/p/DY_lcJ5le5B/";
const INSTAGRAM_FEATURED_POST_IMAGE =
  "/images/site-assets/social/instagram-featured-romeo-and-juliet.jpeg";

const NAV_FEATURE_IMAGES = {
  portfolio:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90051-gallery-150232-69e3ddad.webp",
  rendering:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90053-gallery-150015-31e01022.webp",
  experiential:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90053-gallery-150197-48389e80.webp",
  assistant:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/news/news-2-cover-906f6fb9.webp",
  photography:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-uci-144f3c95.webp",
  about:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/brandon-pt-davis-about-home.jpg",
  resume: "/images/about/icons/resume-icon.png",
  creative: "/images/about/icons/creative-statement-icon.png",
  teaching: "/images/about/icons/teaching-icon.png",
  studio:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-1.png",
  studioArticles:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-articles-cover.png",
  studioTutorials:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-tutorials-cover.png",
  studioDirectory:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-directory-cover.png",
  studioApps: "/assets/studio-apps/icons/scale-calculator.jpg",
};

function getHeaderPillClass({
  lightChrome,
  active = false,
  iconOnly = false,
}: {
  lightChrome: boolean;
  active?: boolean;
  iconOnly?: boolean;
}) {
  const sizing = iconOnly ? "h-9 w-9 px-0" : "h-9 px-4";
  const base = `inline-flex ${sizing} items-center justify-center gap-2 rounded-full border text-[0.76rem] font-medium uppercase leading-none tracking-normal transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`;

  if (lightChrome) {
    return `${base} ${
      active
        ? "border-black/20 bg-black/[0.085] text-black focus-visible:ring-black/22 focus-visible:ring-offset-[#f1f0ec]"
        : "border-black/12 bg-black/[0.025] text-black/62 hover:border-black/20 hover:bg-black/[0.065] hover:text-black focus-visible:ring-black/22 focus-visible:ring-offset-[#f1f0ec]"
    }`;
  }

  return `${base} ${
    active
      ? "border-white/24 bg-white/[0.12] text-white focus-visible:ring-white/34 focus-visible:ring-offset-black"
      : "border-white/13 bg-white/[0.035] text-white/66 hover:border-white/24 hover:bg-white/[0.09] hover:text-white focus-visible:ring-white/34 focus-visible:ring-offset-black"
  }`;
}

function DesktopMenuPanel({
  category,
  onClose,
  currentPath,
  tone = "dark",
}: {
  category: DesktopCategory;
  onClose: () => void;
  currentPath: string;
  tone?: "dark" | "light";
}) {
  const items = category.groups.flatMap(group => group.items);
  const isLight = tone === "light";
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const hoveredItem = items.find(item => item.path === hoveredPath);
  const activeItem = [...items]
    .sort((a, b) => b.path.length - a.path.length)
    .find(
      item =>
        (!item.external && currentPath === item.path) ||
        (!item.external &&
          item.path !== "/projects" &&
          currentPath.startsWith(`${item.path}/`))
    );
  const previewItem = hoveredItem || activeItem;
  const previewFeature = previewItem
    ? previewItem.feature || {
        label: category.label,
        title: previewItem.name,
        description: previewItem.description,
        path: previewItem.path,
        image: category.feature.image,
        imageFit: category.feature.imageFit,
      }
    : category.feature;
  const previewUsesContain = previewFeature.imageFit === "contain";

  useEffect(() => {
    setHoveredPath(null);
  }, [category.label]);

  return (
    <div
      className={`absolute left-1/2 top-[calc(100%+0.68rem)] h-[19.5rem] w-[26.5rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-[1.7rem] border shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 ${
        isLight
          ? "border-black/10 bg-[#f1f0ec]/98 shadow-[0_28px_80px_rgba(17,17,17,0.14)]"
          : "border-white/10 bg-[#050505]/98"
      }`}
    >
      <div className="grid h-full grid-cols-[9rem_14.25rem] gap-3 px-3.5 py-3.5">
        <div className="flex flex-col justify-center">
          <div
            className={`mb-5 flex items-center gap-2 text-[0.74rem] font-medium tracking-[-0.01em] ${
              isLight ? "text-black/54" : "text-white/58"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${isLight ? "bg-black/58" : "bg-white/58"}`}
              aria-hidden="true"
            />
            {category.label}
          </div>
          <div className="grid gap-2.5">
            {items.map(item => {
              const isActive =
                !item.external &&
                (currentPath === item.path ||
                  (item.path !== "/projects" &&
                    currentPath.startsWith(`${item.path}/`)));
              const itemClassName = `block whitespace-nowrap rounded-full px-3 py-2 font-sans text-[0.96rem] font-medium leading-none tracking-normal transition-colors ${
                isLight
                  ? isActive
                    ? "bg-black text-white"
                    : "text-black/60 hover:bg-black/[0.065] hover:text-black"
                  : isActive
                    ? "bg-white text-black"
                    : "text-white/60 hover:bg-white/[0.08] hover:text-white"
              }`;

              if (item.external) {
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    onMouseEnter={() => setHoveredPath(item.path)}
                    onMouseMove={() => setHoveredPath(item.path)}
                    onPointerEnter={() => setHoveredPath(item.path)}
                    onPointerMove={() => setHoveredPath(item.path)}
                    onFocus={() => setHoveredPath(item.path)}
                    aria-label={`${item.name}: ${item.description}`}
                    className={itemClassName}
                  >
                    {item.name}
                  </a>
                );
              }

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredPath(item.path)}
                  onMouseMove={() => setHoveredPath(item.path)}
                  onPointerEnter={() => setHoveredPath(item.path)}
                  onPointerMove={() => setHoveredPath(item.path)}
                  onFocus={() => setHoveredPath(item.path)}
                  aria-label={`${item.name}: ${item.description}`}
                  className={itemClassName}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {previewFeature.external ? (
          <a
            href={previewFeature.path}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className={`group block h-full rounded-[1.35rem] border p-3 transition-colors ${
              isLight
                ? "border-black/10 bg-white/58 shadow-[0_18px_50px_rgba(17,17,17,0.1)] hover:border-black/18 hover:bg-white/78"
                : "border-white/10 bg-white/[0.06] shadow-[0_18px_60px_rgba(0,0,0,0.32)] hover:border-white/20 hover:bg-white/[0.085]"
            }`}
          >
            <div
              key={previewFeature.path}
              className="flex h-full flex-col animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-300 ease-out"
            >
              <div
                className={`h-[7.75rem] rounded-[0.9rem] bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-[1.012] ${
                  previewUsesContain
                    ? isLight
                      ? "bg-contain bg-[#f7f6f2]"
                      : "bg-contain bg-white/[0.045]"
                    : "bg-cover"
                }`}
                style={{ backgroundImage: `url(${previewFeature.image})` }}
                aria-hidden="true"
              />
              <div
                className={`mt-2.5 inline-flex w-fit rounded-full px-2.5 py-1.5 text-[0.74rem] font-medium leading-none tracking-normal transition-colors ${
                  isLight
                    ? "bg-black/[0.07] text-black/64 group-hover:text-black"
                    : "bg-white/[0.09] text-white/68 group-hover:text-white"
                }`}
              >
                {previewFeature.label}
              </div>
              <div
                className={`mt-3 min-h-[2.3rem] overflow-hidden text-[1.02rem] font-medium leading-[1.12] tracking-[-0.045em] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] ${
                  isLight ? "text-black" : "text-white"
                }`}
              >
                {previewFeature.title}
              </div>
              <p
                className={`mt-1.5 max-w-[20rem] overflow-hidden text-[0.78rem] leading-[1.35] tracking-[-0.018em] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] ${
                  isLight ? "text-black/52" : "text-white/50"
                }`}
              >
                {previewFeature.description}
              </p>
            </div>
          </a>
        ) : (
          <Link
            href={previewFeature.path}
            onClick={onClose}
            className={`group block h-full rounded-[1.35rem] border p-3 transition-colors ${
              isLight
                ? "border-black/10 bg-white/58 shadow-[0_18px_50px_rgba(17,17,17,0.1)] hover:border-black/18 hover:bg-white/78"
                : "border-white/10 bg-white/[0.06] shadow-[0_18px_60px_rgba(0,0,0,0.32)] hover:border-white/20 hover:bg-white/[0.085]"
            }`}
          >
            <div
              key={previewFeature.path}
              className="flex h-full flex-col animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-300 ease-out"
            >
              <div
                className={`h-[7.75rem] rounded-[0.9rem] bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-[1.012] ${
                  previewUsesContain
                    ? isLight
                      ? "bg-contain bg-[#f7f6f2]"
                      : "bg-contain bg-white/[0.045]"
                    : "bg-cover"
                }`}
                style={{ backgroundImage: `url(${previewFeature.image})` }}
                aria-hidden="true"
              />
              <div
                className={`mt-2.5 inline-flex w-fit rounded-full px-2.5 py-1.5 text-[0.74rem] font-medium leading-none tracking-normal transition-colors ${
                  isLight
                    ? "bg-black/[0.07] text-black/64 group-hover:text-black"
                    : "bg-white/[0.09] text-white/68 group-hover:text-white"
                }`}
              >
                {previewFeature.label}
              </div>
              <div
                className={`mt-3 min-h-[2.3rem] overflow-hidden text-[1.02rem] font-medium leading-[1.12] tracking-[-0.045em] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] ${
                  isLight ? "text-black" : "text-white"
                }`}
              >
                {previewFeature.title}
              </div>
              <p
                className={`mt-1.5 max-w-[20rem] overflow-hidden text-[0.78rem] leading-[1.35] tracking-[-0.018em] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] ${
                  isLight ? "text-black/52" : "text-white/50"
                }`}
              >
                {previewFeature.description}
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

function BrandLink({
  centered = false,
  descriptor = "SCENIC DESIGN",
  tone = "dark",
}: {
  centered?: boolean;
  descriptor?: string;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";
  const logoSrc = isLight
    ? "/images/site-assets/brand/brandon-pt-davis-black.png"
    : "/images/site-assets/brand/brandon-pt-davis-white.png";

  return (
    <Link
      href="/"
      aria-label={`Brandon PT Davis ${descriptor}`}
      className={`group inline-flex w-fit min-w-0 justify-self-start flex-col items-center leading-none transition-opacity hover:opacity-78 ${
        centered ? "lg:justify-self-center" : ""
      }`}
    >
      <img
        src={logoSrc}
        alt=""
        aria-hidden="true"
        className="h-auto w-[10.8rem] select-none object-contain md:w-[11.8rem]"
        draggable={false}
      />
      <span
        className={`mt-0.5 font-sans text-[0.48rem] font-semibold uppercase leading-none tracking-[0.32em] md:text-[0.5rem] ${
          isLight ? "text-black" : "text-white"
        }`}
      >
        {descriptor}
      </span>
    </Link>
  );
}

function getBrandDescriptor(path: string) {
  if (
    /^\/projects\/experiential(?:\/|$)/.test(path) ||
    /^\/experiential-design(?:\/|$)/.test(path)
  ) {
    return "EXPERIENTIAL DESIGN";
  }

  if (
    /^\/projects\/rendering(?:\/|$)/.test(path) ||
    path === "/theatre-renderings"
  ) {
    return "RENDERING";
  }

  if (/^\/projects\/photography(?:\/|$)/.test(path)) {
    return "PHOTOGRAPHY";
  }

  if (
    path === "/assistant-scenic-design" ||
    /^\/design-process\/assistant-scenic-design(?:\/|$)/.test(path)
  ) {
    return "ASSISTANT SCENIC";
  }

  if (
    /^\/project(?:\/|$)/.test(path) ||
    path === "/projects" ||
    path === "/projects/scenic-design"
  ) {
    return "SCENIC DESIGN";
  }

  return "SCENIC DESIGN";
}

export default function Header() {
  const location = usePathname() || "/";
  const router = useRouter();
  const [activeDesktopCategory, setActiveDesktopCategory] =
    useState<DesktopCategory | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const desktopMenuCloseTimerRef = useRef<number | null>(null);
  const desktopMenuOpen = Boolean(activeDesktopCategory);
  const isStudioAppsRoute = /^\/studio\/apps(?:\/|$)/.test(location);
  const isEditorialRoute =
    location === "/studio" ||
    /^\/articles(?:\/|$)/.test(location) ||
    /^\/studio\/tutorials(?:\/|$)/.test(location) ||
    /^\/studio\/directory(?:\/|$)/.test(location);
  const isArticleDetailRoute = /^\/articles\/[^/]+/.test(location);
  const isContactRoute = location === "/contact";
  const isInfoRoute =
    location === "/privacy" ||
    location === "/terms" ||
    location === "/faq" ||
    location === "/accessibility" ||
    location === "/sitemap" ||
    location === "/404";
  const isProfileLightRoute =
    location === "/about" ||
    location === "/resume" ||
    isContactRoute ||
    isInfoRoute ||
    location === "/search" ||
    location === "/about/teaching" ||
    /^\/syllabus(?:\/|$)/.test(location);
  const isHomeRoute = location === "/";
  const isScenicPortfolioRoute =
    location === "/projects" ||
    location === "/projects/scenic-design" ||
    /^\/projects\/experiential(?:\/|$)/.test(location) ||
    /^\/projects\/rendering(?:\/|$)/.test(location) ||
    /^\/projects\/photography(?:\/|$)/.test(location);
  const useLightChrome =
    !isStudioAppsRoute &&
    (isHomeRoute ||
      isScenicPortfolioRoute ||
      (isEditorialRoute && !isArticleDetailRoute) ||
      isProfileLightRoute);
  const useWhiteLightChrome =
    isContactRoute || isInfoRoute || location === "/studio";
  const useImmersiveChrome =
    isHomeRoute && !desktopMenuOpen && !mobileMenuOpen && !searchOpen;
  const brandDescriptor = getBrandDescriptor(location);

  const headerRef = useRef<HTMLElement>(null);

  const clearDesktopMenuCloseTimer = () => {
    if (desktopMenuCloseTimerRef.current) {
      window.clearTimeout(desktopMenuCloseTimerRef.current);
      desktopMenuCloseTimerRef.current = null;
    }
  };

  const openDesktopMenu = (category: DesktopCategory) => {
    if (category.groups.length === 0) {
      setActiveDesktopCategory(null);
      return;
    }

    clearDesktopMenuCloseTimer();
    setActiveDesktopCategory(category);
  };

  const closeDesktopMenu = () => {
    clearDesktopMenuCloseTimer();
    setActiveDesktopCategory(null);
  };

  const scheduleDesktopMenuClose = () => {
    clearDesktopMenuCloseTimer();
    desktopMenuCloseTimerRef.current = window.setTimeout(() => {
      setActiveDesktopCategory(null);
      desktopMenuCloseTimerRef.current = null;
    }, 140);
  };

  useEffect(() => {
    closeDesktopMenu();
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (!searchOpen) return;

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 24);

      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollYRef.current - 2) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollYRef.current + 4) {
        setIsVisible(false);
        closeDesktopMenu();
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopMenuOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        closeDesktopMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [desktopMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        closeDesktopMenu();
        setSearchOpen(true);
      }

      if (
        event.key === "/" &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        closeDesktopMenu();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        closeDesktopMenu();
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSearchBar = () => {
    closeDesktopMenu();
    setSearchOpen(value => !value);
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      searchInputRef.current?.focus();
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const portfolioGroups: MenuGroup[] = [
    {
      heading: "Portfolio",
      items: [
        {
          name: "Scenic Design",
          path: "/projects",
          description:
            "Full production archive across plays, musicals, and regional theatre work.",
          feature: {
            label: "Recent portfolio",
            title: recentScenicProjects[0].title,
            description: recentScenicProjects[0].meta,
            path: recentScenicProjects[0].href,
            image: recentScenicProjects[0].imageUrl,
          },
        },
        {
          name: "Experiential",
          path: "/projects/experiential",
          description:
            "Immersive environments, drafting, and built event design work.",
          feature: {
            label: "Recent experiential",
            title: recentExperientialPreview.title,
            description: recentExperientialPreview.meta,
            path: recentExperientialPreview.href,
            image: recentExperientialPreview.imageUrl,
          },
        },
        {
          name: "Renderings",
          path: "/projects/rendering",
          description:
            "Concept images, presentation sets, and scenic visualization studies.",
          feature: {
            label: "Recent rendering",
            title: recentRenderingPreview.title,
            description: recentRenderingPreview.meta,
            path: recentRenderingPreview.href,
            image: recentRenderingPreview.imageUrl,
          },
        },
        {
          name: "Photography",
          path: "/projects/photography",
          description:
            "A chronological photo portfolio and visual reference archive.",
          feature: {
            label: "Portfolio",
            title: "Photography",
            description:
              "A chronological photo portfolio and visual reference archive.",
            path: "/projects/photography",
            image: NAV_FEATURE_IMAGES.photography,
          },
        },
      ],
    },
  ];

  const studioGroups: MenuGroup[] = [
    {
      heading: "Studio",
      items: [
        {
          name: "Articles",
          path: "/articles",
          description:
            "Scenic design writing, process essays, tutorials, and cultural analysis.",
          feature: {
            label: "Latest article",
            title: recentArticlePreview.title,
            description: recentArticlePreview.meta,
            path: recentArticlePreview.href,
            image: recentArticlePreview.imageUrl,
          },
        },
        {
          name: "Tutorials",
          path: "/studio/tutorials",
          description:
            "Vectorworks instruction and workflow demonstrations used in teaching.",
          feature: {
            label: "Recent tutorial",
            title: recentTutorialPreview.title,
            description: recentTutorialPreview.meta,
            path: recentTutorialPreview.href,
            image: recentTutorialPreview.imageUrl,
          },
        },
        {
          name: "Directory",
          path: "/studio/directory",
          description:
            "A curated directory of scenic resources, suppliers, archives, and software.",
          feature: {
            label: "Studio",
            title: "Directory",
            description:
              "A curated directory of scenic resources, suppliers, archives, and software.",
            path: "/studio/directory",
            image: NAV_FEATURE_IMAGES.studioDirectory,
          },
        },
        {
          name: "Apps",
          path: "/studio/apps",
          description: "Practical scenic design tools and workflow utilities.",
          feature: {
            label: "App",
            title: studioAppPreview.title,
            description: studioAppPreview.meta,
            path: studioAppPreview.href,
            image: studioAppPreview.imageUrl,
          },
        },
      ],
    },
  ];

  const instagramGroups: MenuGroup[] = [
    {
      heading: "Instagram",
      items: [
        {
          name: "Profile",
          path: INSTAGRAM_PORTFOLIO_URL,
          external: true,
          description:
            "Current portfolio updates and studio process on Instagram.",
          feature: {
            label: "Instagram",
            title: "@brandonptdavisdesign",
            description:
              "Current portfolio updates and studio process on Instagram.",
            path: INSTAGRAM_PORTFOLIO_URL,
            image: INSTAGRAM_FEATURED_POST_IMAGE,
            external: true,
          },
        },
        {
          name: "Featured Post",
          path: INSTAGRAM_FEATURED_POST_URL,
          external: true,
          description:
            "Romeo and Juliet scenic design for New Swan Theatre Festival.",
          feature: {
            label: "Featured post",
            title: "@brandonptdavisdesign",
            description:
              "Romeo and Juliet scenic design for New Swan Theatre Festival.",
            path: INSTAGRAM_FEATURED_POST_URL,
            image: INSTAGRAM_FEATURED_POST_IMAGE,
            external: true,
          },
        },
      ],
    },
  ];

  const desktopCategories: DesktopCategory[] = [
    {
      label: "Portfolio",
      path: "/projects",
      groups: portfolioGroups,
      feature: {
        label: "Recent portfolio",
        title: recentScenicProjects[0].title,
        description: recentScenicProjects[0].meta,
        path: recentScenicProjects[0].href,
        image: recentScenicProjects[0].imageUrl,
      },
    },
    {
      label: "About",
      path: "/about",
      groups: [],
      feature: {
        label: "Profile",
        title: "About Brandon",
        description:
          "Biography, teaching, and the wider practice behind the work.",
        path: "/about",
        image: NAV_FEATURE_IMAGES.about,
      },
    },
    {
      label: "Studio",
      path: "/studio",
      groups: studioGroups,
      feature: {
        label: "Latest article",
        title: recentArticlePreview.title,
        description: recentArticlePreview.meta,
        path: recentArticlePreview.href,
        image: recentArticlePreview.imageUrl,
      },
    },
    {
      label: "Instagram",
      path: INSTAGRAM_PORTFOLIO_URL,
      external: true,
      groups: instagramGroups,
      feature: {
        label: "Featured post",
        title: "@brandonptdavisdesign",
        description:
          "Romeo and Juliet scenic design for New Swan Theatre Festival.",
        path: INSTAGRAM_FEATURED_POST_URL,
        image: INSTAGRAM_FEATURED_POST_IMAGE,
        external: true,
      },
    },
  ];

  const isCategoryRouteActive = (category: DesktopCategory) =>
    !category.external &&
    (location === category.path ||
      location.startsWith(`${category.path}/`) ||
      category.groups.some(group =>
        group.items.some(
          item =>
            !item.external &&
            (location === item.path || location.startsWith(`${item.path}/`))
        )
      ));

  return (
    <>
      <div
        className={isHomeRoute ? "h-0" : "h-[64px] md:h-[74px]"}
        aria-hidden="true"
      />
      {desktopMenuOpen ? (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-[74px] z-40 cursor-default bg-transparent"
          onClick={closeDesktopMenu}
          aria-label="Close navigation menu"
        />
      ) : null}
      <header
        ref={headerRef}
        onMouseEnter={clearDesktopMenuCloseTimer}
        onMouseLeave={scheduleDesktopMenuClose}
        className={`fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
          useLightChrome
            ? useWhiteLightChrome
              ? "border-black/10 bg-white/82 supports-[backdrop-filter]:bg-white/72"
              : "border-black/10 bg-[#f1f0ec]/78 supports-[backdrop-filter]:bg-[#f1f0ec]/66"
            : useImmersiveChrome
              ? "border-transparent bg-transparent shadow-none !backdrop-blur-0 [backdrop-filter:none]"
              : isArticleDetailRoute
                ? "border-white/10 bg-black shadow-[0_12px_40px_rgba(0,0,0,0.34)] supports-[backdrop-filter]:bg-black"
                : "border-white/10 bg-black/55 supports-[backdrop-filter]:bg-black/42"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="px-[clamp(1rem,5vw,6rem)] py-3 md:px-[clamp(1.5rem,5vw,6rem)] md:py-4">
          <nav className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8">
            <BrandLink
              descriptor={brandDescriptor}
              tone={useLightChrome ? "light" : "dark"}
            />

            <div className="hidden items-center justify-center gap-2 lg:flex">
              {desktopCategories.map(category => {
                const hasDropdown = category.groups.length > 0;
                const isActive =
                  activeDesktopCategory?.label === category.label ||
                  isCategoryRouteActive(category);

                return (
                  <a
                    key={category.label}
                    href={category.path}
                    onMouseEnter={() => openDesktopMenu(category)}
                    onFocus={() => openDesktopMenu(category)}
                    onClick={event => {
                      closeDesktopMenu();
                      if (category.external) return;

                      event.preventDefault();
                      router.push(category.path);
                    }}
                    aria-haspopup={hasDropdown ? "true" : undefined}
                    aria-expanded={
                      hasDropdown
                        ? activeDesktopCategory?.label === category.label
                        : undefined
                    }
                    className={getHeaderPillClass({
                      lightChrome: useLightChrome,
                      active: isActive,
                    })}
                  >
                    {category.label}
                  </a>
                );
              })}
            </div>

            <div className="hidden justify-end lg:flex">
              <div className="flex items-center justify-end gap-2">
                <form
                  onSubmit={submitSearch}
                  className={`grid overflow-hidden transition-[grid-template-columns,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    searchOpen
                      ? "grid-cols-[minmax(15rem,20rem)] translate-x-0 opacity-100"
                      : "pointer-events-none grid-cols-[0rem] translate-x-5 opacity-0"
                  }`}
                  aria-hidden={!searchOpen}
                >
                  <div
                    className={`relative min-w-0 overflow-hidden rounded-full border shadow-[0_18px_54px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-colors ${
                      useLightChrome
                        ? "border-black/14 bg-[rgba(241,240,236,0.96)] [color:#111111] shadow-[0_18px_54px_rgba(17,17,17,0.09)] focus-within:border-black/30 focus-within:bg-[rgba(255,255,255,0.98)]"
                        : "border-white/14 bg-[rgba(0,0,0,0.28)] [color:#ffffff] shadow-[0_18px_54px_rgba(0,0,0,0.22)] focus-within:border-white/32 focus-within:bg-[rgba(0,0,0,0.54)]"
                    }`}
                  >
                    <Search
                      className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                        useLightChrome ? "text-black/38" : "text-white/42"
                      }`}
                      aria-hidden="true"
                    />
                    <input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={event => setSearchQuery(event.target.value)}
                      type="search"
                      placeholder="Search the site"
                      className={`site-header-search-input h-10 w-full appearance-none bg-[transparent] pl-11 pr-5 text-[0.92rem] font-medium tracking-[-0.025em] outline-none [background-color:transparent] ${
                        useLightChrome
                          ? "text-[#111111] placeholder:text-[#111111]/34"
                          : "text-white placeholder:text-white/34"
                      }`}
                      tabIndex={searchOpen ? 0 : -1}
                    />
                  </div>
                </form>
                <button
                  type="button"
                  onClick={toggleSearchBar}
                  aria-expanded={searchOpen}
                  aria-label={
                    searchOpen ? "Close search bar" : "Open search bar"
                  }
                  className={getHeaderPillClass({
                    lightChrome: useLightChrome,
                    active: searchOpen,
                    iconOnly: true,
                  })}
                >
                  {searchOpen ? (
                    <X className="h-[1.05rem] w-[1.05rem]" />
                  ) : (
                    <Search className="h-[1.05rem] w-[1.05rem]" />
                  )}
                </button>
                <Link
                  href="/contact"
                  className={getHeaderPillClass({
                    lightChrome: useLightChrome,
                    active: isContactRoute,
                  })}
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="flex min-w-[3rem] items-center justify-end gap-4 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-expanded={mobileMenuOpen}
                className={`inline-flex h-10 min-w-10 items-center justify-center gap-3 rounded-full px-1.5 text-[0.78rem] font-medium uppercase tracking-[0.08em] transition-colors md:h-11 ${
                  useLightChrome
                    ? "text-black/72 hover:text-black"
                    : "text-white/76 hover:text-white"
                }`}
                aria-label="Open menu"
              >
                <span className="relative h-3.5 w-6" aria-hidden="true">
                  <span className="absolute left-0 top-0 h-px w-6 bg-current" />
                  <span className="absolute bottom-0 left-0 h-px w-6 bg-current" />
                </span>
                <span className="hidden min-[420px]:inline">Menu</span>
              </button>
            </div>
          </nav>
        </div>

        {activeDesktopCategory ? (
          <DesktopMenuPanel
            category={activeDesktopCategory}
            onClose={closeDesktopMenu}
            currentPath={location}
            tone={useLightChrome ? "light" : "dark"}
          />
        ) : null}
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
