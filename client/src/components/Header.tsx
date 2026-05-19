"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  X,
} from "lucide-react";
import MobileMenu from "./MobileMenu";
import { recentScenicProjects } from "./navigationData";

const SearchOverlay = dynamic(() => import("./SearchOverlay"), {
  ssr: false,
});

type MenuItem = {
  name: string;
  path: string;
  description: string;
};

type MenuGroup = {
  heading: string;
  items: MenuItem[];
};

function DesktopMenuPanel({
  groups,
  onClose,
  onMouseEnter,
  onMouseLeave,
  tone = "dark",
}: {
  groups: MenuGroup[];
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";

  return (
    <div
      className={`absolute inset-x-0 top-full min-h-[calc(100dvh-74px)] max-h-[calc(100dvh-74px)] overflow-y-auto border-b shadow-[0_30px_90px_rgba(0,0,0,0.22)] animate-in fade-in slide-in-from-top-2 duration-200 ${
        isLight ? "border-black/10 bg-[#f1f0ec]" : "border-white/10 bg-background"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-[clamp(1.5rem,5vw,6rem)] py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.heading} className={`border-t pt-3 ${isLight ? "border-black/14" : "border-white/14"}`}>
              <p className={`mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.24em] ${isLight ? "text-black/42" : "text-white/42"}`}>
                {group.heading}
              </p>
              <div className="space-y-2.5">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
                    aria-label={`${item.name}: ${item.description}`}
                    className="group block"
                  >
                    <span
                      className={`block font-sans text-[1.04rem] font-medium leading-7 tracking-[-0.025em] transition-colors ${
                        isLight ? "text-black/78 group-hover:text-black" : "text-white/82 group-hover:text-white"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-12 border-t pt-5 ${isLight ? "border-black/14" : "border-white/14"}`}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className={`font-sans text-[11px] font-semibold uppercase tracking-[0.24em] ${isLight ? "text-black/42" : "text-white/42"}`}>
              Recent Scenic Design Projects
            </p>
            <Link
              href="/projects"
              onClick={onClose}
              className={`text-[0.9rem] font-medium tracking-[-0.02em] transition-colors ${
                isLight ? "text-black/58 hover:text-black" : "text-white/58 hover:text-white"
              }`}
            >
              View portfolio
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {recentScenicProjects.map((project) => (
              <Link key={project.href} href={project.href} onClick={onClose} className="group block">
                <div className={`relative aspect-[16/9] overflow-hidden rounded-[0.85rem] border ${isLight ? "border-black/10 bg-black/[0.035]" : "border-white/10 bg-white/[0.035]"}`}>
                  <Image
                    src={project.imageUrl}
                    alt={project.imageAlt}
                    fill
                    quality={78}
                    sizes="(max-width: 1024px) 30vw, 28vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-3">
                  <p className={`font-sans text-[1rem] font-medium leading-[1.05] tracking-[-0.035em] ${isLight ? "text-black" : "text-white"}`}>
                    {project.title}
                  </p>
                  <p className={`mt-1 text-[0.8rem] leading-5 ${isLight ? "text-black/42" : "text-white/42"}`}>{project.meta}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandLink({ centered = false, tone = "dark" }: { centered?: boolean; tone?: "dark" | "light" }) {
  const isLight = tone === "light";

  return (
    <Link href="/" className={`group inline-flex min-w-0 flex-col leading-none transition-all ${centered ? "justify-self-start lg:justify-self-center lg:items-center" : ""}`}>
      <span
        className={`font-sans text-[1.34rem] font-black leading-[0.88] tracking-[-0.075em] transition-colors md:text-[1.56rem] ${
          isLight ? "text-black group-hover:text-black/72" : "text-white group-hover:text-white/78"
        }`}
      >
        BRANDON PT DAVIS
      </span>
      <span
        className={`mt-1.5 font-sans text-[9px] font-semibold uppercase leading-none tracking-[0.34em] md:text-[9.5px] ${
          isLight ? "text-black/48" : "text-white/46"
        }`}
      >
        SCENIC DESIGN
      </span>
    </Link>
  );
}

export default function Header() {
  const [location] = useLocation();
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const desktopMenuCloseTimeoutRef = useRef<number | null>(null);
  const isEditorialRoute =
    /^\/articles(?:\/|$)/.test(location) ||
    /^\/studio\/tutorials(?:\/|$)/.test(location) ||
    /^\/studio\/directory(?:\/|$)/.test(location);
  const useLightChrome = isEditorialRoute;

  const headerRef = useRef<HTMLElement>(null);

  const clearDesktopMenuCloseTimeout = () => {
    if (desktopMenuCloseTimeoutRef.current) {
      window.clearTimeout(desktopMenuCloseTimeoutRef.current);
      desktopMenuCloseTimeoutRef.current = null;
    }
  };

  const openDesktopMenu = () => {
    clearDesktopMenuCloseTimeout();
    setDesktopMenuOpen(true);
  };

  const closeDesktopMenu = () => {
    clearDesktopMenuCloseTimeout();
    setDesktopMenuOpen(false);
  };

  const scheduleDesktopMenuClose = () => {
    clearDesktopMenuCloseTimeout();
    desktopMenuCloseTimeoutRef.current = window.setTimeout(() => {
      setDesktopMenuOpen(false);
      desktopMenuCloseTimeoutRef.current = null;
    }, 180);
  };

  useEffect(() => {
    closeDesktopMenu();
  }, [location]);

  useEffect(() => () => clearDesktopMenuCloseTimeout(), []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

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
        setSearchOpen(true);
      }

      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
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
          name: "Rendering",
          path: "/projects/rendering",
          description: "Concept images, presentation sets, and scenic visualization studies.",
        },
        {
          name: "Experiential Design",
          path: "/projects/experiential",
          description: "Immersive environments, drafting, and built event design work.",
        },
        {
          name: "Assistant Scenic Design",
          path: "/assistant-scenic-design",
          description: "Production support, drafting systems, and collaboration as assistant scenic.",
        },
      ],
    },
  ];

  const aboutGroups: MenuGroup[] = [
    {
      heading: "Profile",
      items: [
        {
          name: "Profile",
          path: "/about",
          description: "Biography, current work, and the broader design perspective behind the site.",
        },
        {
          name: "Upcoming Productions",
          path: "/upcoming-productions",
          description: "Public production windows and scenic design commitments currently on the calendar.",
        },
        {
          name: "Resume / CV",
          path: "/resume",
          description: "Production credits, teaching, training, and linked portfolio references.",
        },
        {
          name: "Creative Statement",
          path: "/creative-statement",
          description: "The artistic values shaping scenic work, collaboration, and storytelling.",
        },
        {
          name: "Teaching Philosophy",
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

  const publishGroups: MenuGroup[] = [
    {
      heading: "Publish",
      items: [
        {
          name: "Articles",
          path: "/articles",
          description: "Scenic design writing, process essays, tutorials, and cultural analysis.",
        },
        {
          name: "Tutorials",
          path: "/studio/tutorials",
          description: "Vectorworks instruction and workflow demonstrations used in teaching.",
        },
        {
          name: "Scenic Directory",
          path: "/studio/directory",
          description: "A curated directory of scenic resources, suppliers, archives, and software.",
        },
      ],
    },
  ];

  return (
    <>
      <div className="h-[74px]" aria-hidden="true" />
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
          useLightChrome
            ? "border-black/10 bg-[#f1f0ec]/78 supports-[backdrop-filter]:bg-[#f1f0ec]/66"
            : "border-white/10 bg-background/40 supports-[backdrop-filter]:bg-background/25"
        } ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-[clamp(1.5rem,5vw,6rem)] py-4">
          <nav className="grid grid-cols-[1fr_auto] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
            <div className="hidden lg:flex">
              <button
                type="button"
                onMouseEnter={openDesktopMenu}
                onMouseLeave={scheduleDesktopMenuClose}
                onFocus={openDesktopMenu}
                onClick={() => (desktopMenuOpen ? closeDesktopMenu() : openDesktopMenu())}
                aria-expanded={desktopMenuOpen}
                className={`inline-flex h-10 items-center gap-4 text-[0.9rem] font-medium uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-1 ${
                  useLightChrome
                    ? "text-black/72 hover:text-black focus-visible:ring-black/35"
                    : "text-white/76 hover:text-white focus-visible:ring-white/35"
                }`}
              >
                <span className="relative h-3.5 w-6" aria-hidden="true">
                  <span
                    className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-200 ${
                      desktopMenuOpen ? "translate-y-[6px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-200 ${
                      desktopMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                    }`}
                  />
                </span>
                <span>{desktopMenuOpen ? "Close" : "Menu"}</span>
              </button>
            </div>

            <BrandLink centered tone={useLightChrome ? "light" : "dark"} />

            <div className="hidden justify-end lg:flex">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSearchOpen((value) => !value)}
                  aria-label="Search site"
                  className={`inline-flex h-10 w-10 items-center justify-center transition-colors ${
                    useLightChrome ? "text-black/56 hover:text-black" : "text-white/58 hover:text-white"
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

            <div className="flex items-center justify-end gap-4 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:border ${
                  useLightChrome
                    ? "text-black hover:border-black/18 hover:bg-black/[0.045]"
                    : "hover:border-border hover:bg-foreground/10"
                }`}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </nav>
        </div>

        {desktopMenuOpen ? (
          <DesktopMenuPanel
            groups={[...portfolioGroups, ...aboutGroups, ...publishGroups]}
            onClose={closeDesktopMenu}
            onMouseEnter={openDesktopMenu}
            onMouseLeave={scheduleDesktopMenuClose}
            tone={useLightChrome ? "light" : "dark"}
          />
        ) : null}
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSearch={() => setSearchOpen(true)}
      />
      {searchOpen ? <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} /> : null}
    </>
  );
}
