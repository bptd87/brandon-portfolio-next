"use client";

import dynamic from "next/dynamic";
import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import {
  Blocks,
  BookOpen,
  CalendarDays,
  ChevronDown,
  FileImage,
  FileText,
  GraduationCap,
  LayoutGrid,
  Menu,
  PenTool,
  PlayCircle,
  Search,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import BrandMark from "./BrandMark";

const SearchOverlay = dynamic(() => import("./SearchOverlay"), {
  ssr: false,
});

type MenuItem = {
  name: string;
  path: string;
  description: string;
  icon: ReactNode;
};

type MenuGroup = {
  heading: string;
  items: MenuItem[];
};

function DesktopMenuPanel({
  groups,
  align = "left",
  onMouseEnter,
  onMouseLeave,
}: {
  groups: MenuGroup[];
  align?: "left" | "center" | "right";
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const alignmentClass =
    align === "right"
      ? "right-0"
      : align === "center"
        ? "left-1/2 -translate-x-1/2"
        : "left-0";

  return (
    <div
      className={`absolute top-full mt-4 w-[min(50rem,calc(100vw-3rem))] overflow-hidden rounded-[1.55rem] border border-white/10 bg-background/92 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 ${alignmentClass}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`grid gap-5 ${groups.length === 1 ? "grid-cols-1" : groups.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {groups.map((group) => (
          <div key={group.heading}>
            <p className="px-3 pb-3 text-[0.82rem] font-medium tracking-[-0.02em] text-white/46">
              {group.heading}
            </p>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="group flex items-start gap-3 rounded-[1.15rem] px-3 py-3 transition-colors hover:bg-white/[0.05]"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.85rem] border border-white/8 bg-white/[0.04] text-white/78 transition-colors group-hover:border-white/12 group-hover:bg-white/[0.07] group-hover:text-white">
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[1rem] font-medium tracking-[-0.03em] text-white">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-[0.9rem] leading-6 text-white/44">
                      {item.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NavTrigger({
  href,
  label,
  open,
  active,
}: {
  href: string;
  label: string;
  open: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[0.95rem] font-medium tracking-[-0.02em] transition-colors ${
        open || active
          ? "bg-white/[0.08] text-white"
          : "text-white/66 hover:text-white"
      }`}
    >
      <span>{label}</span>
      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      {active ? (
        <motion.span
          layoutId="header-active-pill"
          className="absolute inset-0 -z-10 rounded-full border border-white/8"
          transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.45 }}
        />
      ) : null}
    </Link>
  );
}

export default function Header() {
  const [location] = useLocation();
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const portfolioDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const studioDropdownRef = useRef<HTMLDivElement>(null);

  const portfolioTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const studioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollYRef.current - 2) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollYRef.current + 4) {
        setIsVisible(false);
        setPortfolioOpen(false);
        setAboutOpen(false);
        setStudioOpen(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (portfolioDropdownRef.current && !portfolioDropdownRef.current.contains(event.target as Node)) {
        setPortfolioOpen(false);
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutOpen(false);
      }
      if (studioDropdownRef.current && !studioDropdownRef.current.contains(event.target as Node)) {
        setStudioOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePortfolioMouseLeave = () => {
    portfolioTimeoutRef.current = setTimeout(() => setPortfolioOpen(false), 220);
  };

  const handlePortfolioMouseEnter = () => {
    if (portfolioTimeoutRef.current) clearTimeout(portfolioTimeoutRef.current);
    setPortfolioOpen(true);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => setAboutOpen(false), 220);
  };

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setAboutOpen(true);
  };

  const handleStudioMouseLeave = () => {
    studioTimeoutRef.current = setTimeout(() => setStudioOpen(false), 220);
  };

  const handleStudioMouseEnter = () => {
    if (studioTimeoutRef.current) clearTimeout(studioTimeoutRef.current);
    setStudioOpen(true);
  };

  const portfolioGroups: MenuGroup[] = [
    {
      heading: "Portfolio",
      items: [
        {
          name: "Scenic Design",
          path: "/projects",
          description: "Full production archive across plays, musicals, and regional theatre work.",
          icon: <LayoutGrid className="h-4 w-4" />,
        },
        {
          name: "Rendering",
          path: "/projects/rendering",
          description: "Concept images, presentation sets, and scenic visualization studies.",
          icon: <FileImage className="h-4 w-4" />,
        },
        {
          name: "Experiential Design",
          path: "/projects/experiential",
          description: "Immersive environments, drafting, and built event design work.",
          icon: <Sparkles className="h-4 w-4" />,
        },
      ],
    },
    {
      heading: "Related Practice",
      items: [
        {
          name: "Assistant Scenic Design",
          path: "/assistant-scenic-design",
          description: "Production support, drafting systems, and collaboration as assistant scenic.",
          icon: <Blocks className="h-4 w-4" />,
        },
      ],
    },
  ];

  const aboutGroups: MenuGroup[] = [
    {
      heading: "Profile",
      items: [
        {
          name: "About",
          path: "/about",
          description: "Background, current work, and the broader design perspective behind the site.",
          icon: <UserRound className="h-4 w-4" />,
        },
        {
          name: "Upcoming Productions",
          path: "/upcoming-productions",
          description: "Public production windows and scenic design commitments currently on the calendar.",
          icon: <CalendarDays className="h-4 w-4" />,
        },
        {
          name: "Resume / CV",
          path: "/resume",
          description: "Production credits, teaching, training, and linked portfolio references.",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          name: "Creative Statement",
          path: "/creative-statement",
          description: "The artistic values shaping scenic work, collaboration, and storytelling.",
          icon: <PenTool className="h-4 w-4" />,
        },
      ],
    },
    {
      heading: "Teaching and Network",
      items: [
        {
          name: "Teaching Philosophy",
          path: "/about/teaching",
          description: "How design instruction, studio process, and student learning connect.",
          icon: <GraduationCap className="h-4 w-4" />,
        },
        {
          name: "Collaborators",
          path: "/about/collaborators",
          description: "Directors, designers, companies, and long-running creative collaborators.",
          icon: <Users className="h-4 w-4" />,
        },
      ],
    },
  ];

  const studioGroups: MenuGroup[] = [
    {
      heading: "Publishing",
      items: [
        {
          name: "Articles",
          path: "/articles",
          description: "Scenic design writing, process essays, tutorials, and cultural analysis.",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          name: "Tutorials",
          path: "/studio/tutorials",
          description: "Vectorworks instruction and workflow demonstrations used in teaching.",
          icon: <PlayCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      heading: "Tools",
      items: [
        {
          name: "App Studio",
          path: "/studio/apps",
          description: "Interactive design tools, utilities, and small studio applications.",
          icon: <Blocks className="h-4 w-4" />,
        },
        {
          name: "Scenic Directory",
          path: "/studio/directory",
          description: "A curated directory of scenic resources, suppliers, archives, and software.",
          icon: <BookOpen className="h-4 w-4" />,
        },
      ],
    },
  ];

  const isPortfolioActive =
    isActive("/projects") ||
    isActive("/projects/scenic-design") ||
    isActive("/projects/rendering") ||
    isActive("/projects/experiential") ||
    isActive("/assistant-scenic-design");
  const isAboutActive =
    isActive("/about") ||
    isActive("/upcoming-productions") ||
    isActive("/resume") ||
    isActive("/creative-statement");
  const isStudioActive = isActive("/studio") || isActive("/articles");

  return (
    <>
      <div className="h-[74px]" aria-hidden="true" />
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-background/40 backdrop-blur-xl supports-[backdrop-filter]:bg-background/25 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container max-w-[88rem] py-4">
          <nav className="flex items-center justify-between gap-6">
            <Link href="/" className="group inline-flex items-center gap-0 leading-none transition-all">
              <span className="relative flex h-[3.2rem] w-[3.2rem] shrink-0 items-center justify-center">
                <BrandMark className="h-full w-full transition-transform duration-200 group-hover:scale-[1.02]" />
              </span>
              <span className="-ml-[4px] flex min-w-0 flex-col items-start justify-center pt-[1px]">
                <span className="text-[1.12rem] font-black tracking-[-0.055em] md:text-[1.16rem]">
                  BRANDON PT DAVIS
                </span>
                <span className="mt-1 pl-[0.06rem] text-[8.5px] font-medium uppercase tracking-[0.28em] text-white/46 md:text-[9px]">
                  SCENIC DESIGN
                </span>
              </span>
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-between lg:flex">
              <div className="ml-6 flex items-center gap-1">
                <div
                  className="relative"
                  ref={portfolioDropdownRef}
                  onMouseEnter={handlePortfolioMouseEnter}
                  onMouseLeave={handlePortfolioMouseLeave}
                >
                  <NavTrigger href="/projects" label="Portfolio" open={portfolioOpen} active={isPortfolioActive} />
                  {portfolioOpen ? (
                    <DesktopMenuPanel
                      groups={portfolioGroups}
                      align="left"
                      onMouseEnter={handlePortfolioMouseEnter}
                      onMouseLeave={handlePortfolioMouseLeave}
                    />
                  ) : null}
                </div>

                <div
                  className="relative"
                  ref={aboutDropdownRef}
                  onMouseEnter={handleAboutMouseEnter}
                  onMouseLeave={handleAboutMouseLeave}
                >
                  <NavTrigger href="/about" label="About" open={aboutOpen} active={isAboutActive} />
                  {aboutOpen ? (
                    <DesktopMenuPanel
                      groups={aboutGroups}
                      align="center"
                      onMouseEnter={handleAboutMouseEnter}
                      onMouseLeave={handleAboutMouseLeave}
                    />
                  ) : null}
                </div>

                <div
                  className="relative"
                  ref={studioDropdownRef}
                  onMouseEnter={handleStudioMouseEnter}
                  onMouseLeave={handleStudioMouseLeave}
                >
                  <NavTrigger href="/studio" label="Studio" open={studioOpen} active={isStudioActive} />
                  {studioOpen ? (
                    <DesktopMenuPanel
                      groups={studioGroups}
                      align="left"
                      onMouseEnter={handleStudioMouseEnter}
                      onMouseLeave={handleStudioMouseLeave}
                    />
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => setSearchOpen((value) => !value)}
                  aria-label="Search site"
                  className="ml-1 inline-flex h-10 w-10 items-center justify-center text-white/58 transition-colors hover:text-white"
                >
                  {searchOpen ? (
                    <X className="h-[1.05rem] w-[1.05rem]" />
                  ) : (
                    <Search className="h-[1.05rem] w-[1.05rem]" />
                  )}
                </button>
              </div>

              <div className="ml-10 shrink-0">
                <div className="flex items-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-white/22 px-5 text-[0.9rem] font-medium tracking-[-0.02em] text-white transition-colors hover:border-white/36 hover:bg-white/[0.05]"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:border hover:border-border hover:bg-foreground/10"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </nav>
        </div>
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
