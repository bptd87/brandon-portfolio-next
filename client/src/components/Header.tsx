"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Link } from "wouter";

import MobileMenu from "./MobileMenu";

const INSTAGRAM_PORTFOLIO_URL =
  "https://www.instagram.com/brandonptdavisdesign/";

const LEFT_NAV_LINKS = [
  { label: "Portfolio", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Studio", href: "/studio" },
  { label: "Instagram", href: INSTAGRAM_PORTFOLIO_URL, external: true },
] as const;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass({
  lightChrome,
  active = false,
  iconOnly = false,
}: {
  lightChrome: boolean;
  active?: boolean;
  iconOnly?: boolean;
}) {
  const size = iconOnly ? "h-10 w-10 px-0" : "h-10 px-1.5";
  const base = `group relative inline-flex ${size} items-center justify-center text-[0.9rem] font-semibold leading-none tracking-[-0.012em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`;

  if (lightChrome) {
    return `${base} ${
      active
        ? "text-black after:absolute after:bottom-1 after:left-1.5 after:right-1.5 after:h-px after:bg-black focus-visible:ring-black/24 focus-visible:ring-offset-[#f1f0ec]"
        : "text-black/58 hover:text-black after:absolute after:bottom-1 after:left-1.5 after:right-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-black/42 after:transition-transform hover:after:scale-x-100 focus-visible:ring-black/24 focus-visible:ring-offset-[#f1f0ec]"
    }`;
  }

  return `${base} ${
    active
      ? "text-white after:absolute after:bottom-1 after:left-1.5 after:right-1.5 after:h-px after:bg-white focus-visible:ring-white/34 focus-visible:ring-offset-black"
      : "text-white/58 hover:text-white after:absolute after:bottom-1 after:left-1.5 after:right-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-white/50 after:transition-transform hover:after:scale-x-100 focus-visible:ring-white/34 focus-visible:ring-offset-black"
  }`;
}

function BrandLink({ tone }: { tone: "dark" | "light" }) {
  const logoSrc =
    tone === "light"
      ? "/images/site-assets/brand/brandon-pt-davis-black.png"
      : "/images/site-assets/brand/brandon-pt-davis-white.png";

  return (
    <Link
      href="/"
      aria-label="Brandon PT Davis"
      className="inline-flex w-fit flex-col items-center justify-center transition-opacity hover:opacity-78"
    >
      <img
        src={logoSrc}
        alt="Brandon PT Davis"
        className="h-auto w-[10.8rem] select-none object-contain md:w-[12rem]"
        draggable={false}
      />
      <span
        className={`mt-1 font-sans text-[0.56rem] font-semibold uppercase leading-none tracking-[0.46em] ${
          tone === "light" ? "text-black/78" : "text-white/78"
        }`}
      >
        SCENIC DESIGN
      </span>
    </Link>
  );
}

function getHomeScrollRoot() {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>("[data-home-scroll-root]");
}

export default function Header() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const isStudioAppsRoute = /^\/studio\/apps(?:\/|$)/.test(pathname);
  const isArticleDetailRoute = /^\/articles\/[^/]+/.test(pathname);
  const isContactRoute = pathname === "/contact";
  const isInfoRoute =
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/faq" ||
    pathname === "/accessibility" ||
    pathname === "/sitemap" ||
    pathname === "/404";
  const isProfileLightRoute =
    pathname === "/about" ||
    pathname === "/resume" ||
    pathname === "/assistant-scenic-design" ||
    isContactRoute ||
    isInfoRoute ||
    pathname === "/search" ||
    pathname === "/about/teaching" ||
    /^\/syllabus(?:\/|$)/.test(pathname);
  const isHomeRoute = pathname === "/";
  const isScenicPortfolioRoute =
    pathname === "/projects" ||
    pathname === "/projects/scenic-design" ||
    /^\/projects\/experiential(?:\/|$)/.test(pathname) ||
    /^\/projects\/rendering(?:\/|$)/.test(pathname) ||
    /^\/projects\/photography(?:\/|$)/.test(pathname);
  const isEditorialRoute =
    pathname === "/studio" ||
    /^\/articles(?:\/|$)/.test(pathname) ||
    /^\/studio\/tutorials(?:\/|$)/.test(pathname) ||
    /^\/studio\/directory(?:\/|$)/.test(pathname);
  const useLightChrome =
    !isStudioAppsRoute &&
    (isHomeRoute ||
      isScenicPortfolioRoute ||
      (isEditorialRoute && !isArticleDetailRoute) ||
      isProfileLightRoute);
  const useWhiteLightChrome =
    isContactRoute ||
    isInfoRoute ||
    pathname === "/studio" ||
    pathname === "/assistant-scenic-design";
  const headerTone = useLightChrome ? "light" : "dark";

  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setHeaderHidden(false);
    const homeScrollRoot = pathname === "/" ? getHomeScrollRoot() : null;
    lastScrollYRef.current = homeScrollRoot ? homeScrollRoot.scrollTop : window.scrollY;
  }, [pathname]);

  useEffect(() => {
    if (searchOpen || mobileMenuOpen) {
      setHeaderHidden(false);
      return undefined;
    }

    let ticking = false;

    const homeScrollRoot = pathname === "/" ? getHomeScrollRoot() : null;
    const scrollTarget: HTMLElement | Window = homeScrollRoot || window;
    const getCurrentScrollY = () => (homeScrollRoot ? homeScrollRoot.scrollTop : window.scrollY);

    const updateHeaderVisibility = () => {
      const currentScrollY = getCurrentScrollY();
      const previousScrollY = lastScrollYRef.current;
      const delta = currentScrollY - previousScrollY;

      if (currentScrollY < 80) {
        setHeaderHidden(false);
      } else if (delta > 8) {
        setHeaderHidden(true);
      } else if (delta < -8) {
        setHeaderHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeaderVisibility);
    };

    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollTarget.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen, pathname, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (
        event.key === "/" &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      searchInputRef.current?.focus();
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <>
      <div className={isHomeRoute ? "h-0" : "h-[66px] md:h-[76px]"} aria-hidden="true" />
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          headerHidden ? "-translate-y-full" : "translate-y-0"
        } ${
          useLightChrome
            ? useWhiteLightChrome
              ? "border-black/10 bg-white/86 supports-[backdrop-filter]:bg-white/74"
              : "border-black/10 bg-[#f1f0ec]/82 supports-[backdrop-filter]:bg-[#f1f0ec]/70"
            : isArticleDetailRoute
              ? "border-white/10 bg-black shadow-[0_12px_40px_rgba(0,0,0,0.34)] supports-[backdrop-filter]:bg-black"
              : "border-white/10 bg-black/62 supports-[backdrop-filter]:bg-black/48"
        }`}
      >
        <div className="px-[clamp(1rem,5vw,6rem)] py-3 md:px-[clamp(1.5rem,5vw,6rem)] md:py-4">
          <nav className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="hidden items-center gap-6 lg:flex">
              {LEFT_NAV_LINKS.map(item => {
                const active =
                  !("external" in item) && isActivePath(pathname, item.href);
                const className = navLinkClass({
                  lightChrome: useLightChrome,
                  active,
                });

                if ("external" in item) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link key={item.href} href={item.href} className={className}>
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`${navLinkClass({
                lightChrome: useLightChrome,
              })} col-start-3 row-start-1 w-fit justify-self-end lg:hidden`}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              Menu
            </button>

            <div className="col-start-2 row-start-1 justify-self-center">
              <BrandLink tone={headerTone} />
            </div>

            <div className="col-start-3 row-start-1 hidden items-center justify-end gap-5 lg:flex">
              <form
                onSubmit={submitSearch}
                className={`hidden overflow-hidden transition-[grid-template-columns,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid ${
                  searchOpen
                    ? "grid-cols-[minmax(14rem,19rem)] translate-x-0 opacity-100"
                    : "pointer-events-none grid-cols-[0rem] translate-x-4 opacity-0"
                }`}
                aria-hidden={!searchOpen}
              >
                <div
                  className={`relative min-w-0 overflow-hidden border-b transition-colors ${
                    useLightChrome
                      ? "border-black/18 bg-transparent text-[#111111] focus-within:border-black/42"
                      : "border-white/20 bg-transparent text-white focus-within:border-white/48"
                  }`}
                >
                  <Search
                    className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                      useLightChrome ? "text-black/38" : "text-white/42"
                    }`}
                    aria-hidden="true"
                  />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    type="search"
                    placeholder="Search"
                    className={`h-10 w-full appearance-none bg-transparent pl-9 pr-4 text-[0.92rem] font-medium tracking-[-0.018em] outline-none ${
                      useLightChrome
                        ? "text-[#111111] placeholder:text-[#111111]/36"
                        : "text-white placeholder:text-white/36"
                    }`}
                    tabIndex={searchOpen ? 0 : -1}
                  />
                </div>
              </form>

              <button
                type="button"
                onClick={() => setSearchOpen(value => !value)}
                aria-expanded={searchOpen}
                aria-label={searchOpen ? "Close search" : "Open search"}
                className={navLinkClass({
                  lightChrome: useLightChrome,
                  active: searchOpen,
                  iconOnly: true,
                })}
              >
                {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </button>

              <Link
                href="/contact"
                className={`${navLinkClass({
                  lightChrome: useLightChrome,
                  active: isContactRoute,
                })} hidden sm:inline-flex`}
              >
                Contact
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
