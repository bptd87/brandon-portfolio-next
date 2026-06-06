"use client";

import { usePathname, useRouter } from "next/navigation";
import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
} from "lucide-react";
import MobileMenu from "./MobileMenu";

type MenuItem = {
  name: string;
  path: string;
  description: string;
};

type MenuGroup = {
  heading: string;
  items: MenuItem[];
};

type DesktopCategory = {
  label: "Portfolio" | "About" | "Studio";
  groups: MenuGroup[];
};

function DesktopMenuPanel({
  groups,
  onClose,
  tone = "dark",
}: {
  groups: MenuGroup[];
  onClose: () => void;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";

  return (
    <div
      className={`absolute inset-x-0 top-full overflow-hidden border-b shadow-[0_34px_110px_rgba(0,0,0,0.24)] animate-in fade-in slide-in-from-top-2 duration-200 ${
        isLight ? "border-black/10 bg-[#f1f0ec]/96" : "border-white/10 bg-[#080808]/96"
      }`}
    >
      <div className="grid w-full gap-6 px-[clamp(1.5rem,5vw,6rem)] py-6 lg:grid-cols-[10rem_minmax(0,76rem)]">
        <div className="hidden lg:block" aria-hidden="true" />
        <div className="max-w-[66rem]">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.flatMap((group) =>
              group.items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  aria-label={`${item.name}: ${item.description}`}
                  className="group block transition-colors"
                >
                  <span
                    className={`block font-sans text-[1.02rem] font-medium leading-[1.08] tracking-[-0.035em] transition-colors ${
                      isLight ? "text-black/82 group-hover:text-black" : "text-white/84 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span
                    className={`mt-1.5 block max-w-[17rem] text-[0.76rem] leading-5 tracking-[-0.01em] transition-colors ${
                      isLight ? "text-black/45 group-hover:text-black/58" : "text-white/42 group-hover:text-white/58"
                    }`}
                  >
                    {item.description}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
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

  return (
    <Link href="/" className={`group inline-flex min-w-0 flex-col leading-none transition-all ${centered ? "justify-self-start lg:justify-self-center lg:items-center" : ""}`}>
      <span
        className={`font-sans text-[1.08rem] font-black leading-[0.9] tracking-[-0.06em] transition-colors min-[380px]:text-[1.2rem] md:text-[1.22rem] md:leading-[0.88] md:tracking-[-0.065em] ${
          isLight ? "text-black group-hover:text-black/72" : "text-white group-hover:text-white/78"
        }`}
      >
        BRANDON PT DAVIS
      </span>
      <span
        className={`mt-1.5 font-sans text-[8px] font-semibold uppercase leading-none tracking-[0.24em] min-[380px]:tracking-[0.3em] md:text-[7.5px] md:tracking-[0.3em] ${
          isLight ? "text-black/48" : "text-white/46"
        }`}
      >
        {descriptor}
      </span>
    </Link>
  );
}

export default function Header() {
  const location = usePathname() || "/";
  const router = useRouter();
  const [activeDesktopCategory, setActiveDesktopCategory] = useState<DesktopCategory | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
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
    location === "/about/collaborators" ||
    /^\/syllabus(?:\/|$)/.test(location) ||
    /^\/upcoming-productions(?:\/|$)/.test(location);
  const isHomeRoute = location === "/";
  const useLightChrome =
    !isStudioAppsRoute && ((isEditorialRoute && !isArticleDetailRoute) || isProfileLightRoute);
  const useWhiteLightChrome = isContactRoute || isInfoRoute || location === "/studio";
  const useImmersiveChrome = isHomeRoute && !desktopMenuOpen && !mobileMenuOpen && !searchOpen;
  const brandDescriptor = /^\/projects\/experiential(?:\/|$)/.test(location)
    ? "EXPERIENTIAL DESIGN"
    : /^\/projects\/rendering(?:\/|$)/.test(location)
      ? "RENDERING"
      : "SCENIC DESIGN";

  const headerRef = useRef<HTMLElement>(null);

  const openDesktopMenu = (category: DesktopCategory) => {
    setActiveDesktopCategory(category);
  };

  const closeDesktopMenu = () => {
    setActiveDesktopCategory(null);
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
      if (desktopMenuOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
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

      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
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
    setSearchOpen((value) => !value);
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
          description: "Full production archive across plays, musicals, and regional theatre work.",
        },
        {
          name: "Renderings",
          path: "/projects/rendering",
          description: "Concept images, presentation sets, and scenic visualization studies.",
        },
        {
          name: "Experiential",
          path: "/projects/experiential",
          description: "Immersive environments, drafting, and built event design work.",
        },
        {
          name: "Assistant Scenic",
          path: "/assistant-scenic-design",
          description: "Production support, drafting systems, and collaboration as assistant scenic.",
        },
        {
          name: "Photography",
          path: "/projects/photography",
          description: "A chronological photo portfolio and visual reference archive.",
        },
      ],
    },
  ];

  const aboutGroups: MenuGroup[] = [
    {
      heading: "About",
      items: [
        {
          name: "Profile",
          path: "/about",
          description: "Biography, current work, and the broader design perspective behind the site.",
        },
        {
          name: "Upcoming",
          path: "/upcoming-productions",
          description: "Public production windows and scenic design commitments currently on the calendar.",
        },
        {
          name: "Resume / CV",
          path: "/resume",
          description: "Production credits, teaching, training, and linked portfolio references.",
        },
        {
          name: "Creative",
          path: "/creative-statement",
          description: "The artistic values shaping scenic work, collaboration, and storytelling.",
        },
        {
          name: "Teaching",
          path: "/about/teaching",
          description: "How design instruction, studio process, and student learning connect.",
        },
        {
          name: "Collaborators",
          path: "/about/collaborators",
          description: "Directors, designers, companies, and long-running creative collaborators.",
        },
      ],
    },
  ];

  const studioGroups: MenuGroup[] = [
    {
      heading: "Studio",
      items: [
        {
          name: "Publish",
          path: "/articles",
          description: "Scenic design writing, process essays, tutorials, and cultural analysis.",
        },
        {
          name: "Tutorials",
          path: "/studio/tutorials",
          description: "Vectorworks instruction and workflow demonstrations used in teaching.",
        },
        {
          name: "Directory",
          path: "/studio/directory",
          description: "A curated directory of scenic resources, suppliers, archives, and software.",
        },
        {
          name: "Apps",
          path: "/studio/apps",
          description: "Practical scenic design tools and workflow utilities.",
        },
      ],
    },
  ];

  const desktopCategories: DesktopCategory[] = [
    {
      label: "Portfolio",
      groups: portfolioGroups,
    },
    {
      label: "About",
      groups: aboutGroups,
    },
    {
      label: "Studio",
      groups: studioGroups,
    },
  ];

  const isCategoryRouteActive = (category: DesktopCategory) =>
    category.groups.some((group) =>
      group.items.some((item) => location === item.path || location.startsWith(`${item.path}/`))
    );

  return (
    <>
      <div className="h-[64px] md:h-[74px]" aria-hidden="true" />
      {desktopMenuOpen ? (
        <button
          type="button"
          className={`fixed inset-x-0 bottom-0 top-[74px] z-40 cursor-default animate-in fade-in duration-200 ${
            useLightChrome
              ? `${useWhiteLightChrome ? "bg-white/38" : "bg-[#f1f0ec]/38"} backdrop-blur-sm`
              : "bg-black/24 backdrop-blur-sm"
          }`}
          onClick={closeDesktopMenu}
          aria-label="Close navigation menu"
        />
      ) : null}
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
          useLightChrome
            ? useWhiteLightChrome
              ? "border-black/10 bg-white/82 supports-[backdrop-filter]:bg-white/72"
              : "border-black/10 bg-[#f1f0ec]/78 supports-[backdrop-filter]:bg-[#f1f0ec]/66"
            : useImmersiveChrome && !isScrolled
              ? "border-transparent bg-transparent shadow-none backdrop-blur-0"
              : "border-white/10 bg-background/40 supports-[backdrop-filter]:bg-background/25"
        } ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-[clamp(1rem,5vw,6rem)] py-3 md:px-[clamp(1.5rem,5vw,6rem)] md:py-4">
          <nav className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8">
            <BrandLink descriptor={brandDescriptor} tone={useLightChrome ? "light" : "dark"} />

            <div
              className="hidden items-center gap-1 lg:flex"
            >
              {desktopCategories.map((category) => {
                const isActive =
                  activeDesktopCategory?.label === category.label || isCategoryRouteActive(category);

                return (
                  <button
                    key={category.label}
                    type="button"
                    onMouseEnter={() => openDesktopMenu(category)}
                    onFocus={() => openDesktopMenu(category)}
                    onClick={() => openDesktopMenu(category)}
                    aria-expanded={activeDesktopCategory?.label === category.label}
                    className={`relative inline-flex h-10 items-center px-3 text-[0.86rem] font-medium tracking-[-0.018em] transition-colors focus-visible:outline-none ${
                      useLightChrome
                        ? isActive
                          ? "text-black"
                          : "text-black/58 hover:text-black"
                        : isActive
                          ? "text-white"
                          : "text-white/62 hover:text-white"
                    }`}
                  >
                    {category.label}
                    <span
                      className={`absolute inset-x-3 bottom-1 h-px origin-left transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      } ${useLightChrome ? "bg-black" : "bg-white"}`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            <div className="hidden justify-end lg:flex">
              <div className="flex items-center justify-end gap-3">
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
                      onChange={(event) => setSearchQuery(event.target.value)}
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
                  aria-label={searchOpen ? "Close search bar" : "Open search bar"}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    useLightChrome
                      ? searchOpen
                        ? "bg-black/[0.055] text-black"
                        : "text-black/56 hover:text-black"
                      : searchOpen
                        ? "bg-white/[0.08] text-white"
                        : "text-white/58 hover:text-white"
                  }`}
                >
                  {searchOpen ? (
                    <X className="h-[1.05rem] w-[1.05rem]" />
                  ) : (
                    <Search className="h-[1.05rem] w-[1.05rem]" />
                  )}
                </button>
                <Link
                  href="/contact"
                  className={`inline-flex h-10 items-center justify-center rounded-full border px-5 text-[0.9rem] font-medium tracking-[-0.02em] transition-colors ${
                    useLightChrome
                      ? "border-black/22 text-black hover:border-black/38 hover:bg-black/[0.045]"
                      : "border-white/22 text-white hover:border-white/36 hover:bg-white/[0.05]"
                  }`}
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
            groups={activeDesktopCategory.groups}
            onClose={closeDesktopMenu}
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
