import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, UserRound, FileText, PenTool, GraduationCap, Users } from "lucide-react";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";

// Creative Theatrical Icons for Dropdown Items

// Scenic Design - Proscenium arch with curtain
const ScenicDesignIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <path d="M2 20h20M4 20V8l4-4h8l4 4v12" />
    <path d="M8 8v12M16 8v12" />
    <path d="M8 4h8" strokeDasharray="2 2" />
  </svg>
);

// Experiential - Spotlight beam
const ExperientialIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <path d="M12 2L8 8h8l-4-6z" />
    <path d="M8 8L4 20M16 8l4 12M12 8v12" strokeOpacity="0.5" />
    <circle cx="12" cy="3" r="1" fill="currentColor" />
  </svg>
);

// Rendering - Blueprint compass/drafting tool
const RenderingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    <path d="M6.34 6.34l2.83 2.83M14.83 14.83l2.83 2.83M6.34 17.66l2.83-2.83M14.83 9.17l2.83-2.83" strokeOpacity="0.5" />
  </svg>
);

// News Categories - Different theatrical elements

// Production Debuts - Rising curtain
const ProductionIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <path d="M3 20h18M3 20V12M21 20V12" />
    <path d="M3 12c0-2 2-4 4-4h10c2 0 4 2 4 4" strokeDasharray="3 2" />
    <path d="M7 8V4M17 8V4" strokeOpacity="0.5" />
  </svg>
);

// Collaborations - Connected nodes
const CollaborationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="12" cy="18" r="2" />
    <path d="M8 7l8 0M7 8l4 8M17 8l-4 8" strokeOpacity="0.5" />
  </svg>
);

// Milestones - Star/achievement
const MilestoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <path d="M12 2l2.5 7.5H22l-6 5 2.5 7.5L12 17l-6.5 5L8 14.5l-6-5h7.5L12 2z" />
  </svg>
);

// Opening Nights - Theater masks
const OpeningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <path d="M8 4C5 4 3 6 3 9v3c0 2 1 3 2 3h6c1 0 2-1 2-3V9c0-3-2-5-5-5z" />
    <path d="M6 10h1M10 10h1" />
    <path d="M8 13c1 0 2-1 2-2" strokeOpacity="0.7" />
  </svg>
);

// Reviews & Press - Newspaper/article
const ReviewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <path d="M8 8h8M8 12h8M8 16h5" strokeOpacity="0.7" />
  </svg>
);

// Season Announcements - Calendar/schedule
const SeasonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <rect x="4" y="5" width="16" height="16" rx="1" />
    <path d="M4 9h16M9 5V3M15 5V3" />
    <circle cx="9" cy="13" r="1" fill="currentColor" />
    <circle cx="15" cy="13" r="1" fill="currentColor" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

// All Categories - Grid view
const AllCategoriesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

// Studio Icons

// Tutorials - Play button/video
const TutorialsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M10 8l6 4-6 4V8z" fill="currentColor" strokeWidth="0" />
  </svg>
);

// App Studio - Grid of tools
const AppStudioIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);


// Scenic Directory - List/directory
const DirectoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <path d="M3 6h18M3 12h18M3 18h18" />
    <circle cx="7" cy="6" r="1" fill="currentColor" />
    <circle cx="7" cy="12" r="1" fill="currentColor" />
    <circle cx="7" cy="18" r="1" fill="currentColor" />
  </svg>
);

export default function Header() {
  const [location] = useLocation();
  const isHomePage = location === "/";
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const [studioOpen, setStudioOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  
  // Refs for dropdown containers
  const portfolioDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);

  const studioDropdownRef = useRef<HTMLDivElement>(null);
  
  // Timeout refs for delayed closing
  const portfolioTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const studioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  const ActiveUnderline = ({ active, color }: { active: boolean; color: string }) =>
    active ? (
      <motion.span
        layoutId="header-active-underline"
        className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full"
        style={{ backgroundColor: color }}
        transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.45 }}
      />
    ) : null;

  // Auto-hide navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show nav when scrolling up, hide when scrolling down
      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollYRef.current - 2) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollYRef.current + 4) {
        setIsVisible(false);
        // Close dropdowns when hiding
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

  // Close dropdown when clicking outside
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

  // Delayed close handlers
  const handlePortfolioMouseLeave = () => {
    portfolioTimeoutRef.current = setTimeout(() => {
      setPortfolioOpen(false);
    }, 300); // 300ms delay
  };

  const handlePortfolioMouseEnter = () => {
    if (portfolioTimeoutRef.current) {
      clearTimeout(portfolioTimeoutRef.current);
    }
    setPortfolioOpen(true);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setAboutOpen(false);
    }, 300);
  };

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) {
      clearTimeout(aboutTimeoutRef.current);
    }
    setAboutOpen(true);
  };



  const handleStudioMouseLeave = () => {
    studioTimeoutRef.current = setTimeout(() => {
      setStudioOpen(false);
    }, 300);
  };

  const handleStudioMouseEnter = () => {
    if (studioTimeoutRef.current) {
      clearTimeout(studioTimeoutRef.current);
    }
    setStudioOpen(true);
  };

  const disciplines = [
    { name: "Scenic Design", slug: "scenic-design", path: "/projects", icon: <ScenicDesignIcon /> },
    { name: "Rendering", slug: "rendering", path: "/projects/rendering", icon: <RenderingIcon /> },
    { name: "Experiential Design", slug: "experiential", path: "/projects/experiential", icon: <ExperientialIcon /> },
    { name: "Assistant Scenic Design", slug: "assistant-scenic-design", path: "/assistant-scenic-design", icon: <ScenicDesignIcon /> },
  ];

  const aboutPages = [
    { name: "About", slug: "/about", icon: <UserRound className="w-[18px] h-[18px] mr-2" /> },
    { name: "Resume / CV", slug: "/resume", icon: <FileText className="w-[18px] h-[18px] mr-2" /> },
    { name: "Creative Statement", slug: "/creative-statement", icon: <PenTool className="w-[18px] h-[18px] mr-2" /> },
    { name: "Teaching Philosophy", slug: "/about/teaching", icon: <GraduationCap className="w-[18px] h-[18px] mr-2" /> },
    { name: "Collaborators", slug: "/about/collaborators", icon: <Users className="w-[18px] h-[18px] mr-2" /> },
  ];

  return (
    <>
      {/* Flow spacer so page headers don't collide with fixed nav */}
      <div className="h-[74px]" aria-hidden="true" />
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } border-b border-white/10 bg-background/40 backdrop-blur-xl supports-[backdrop-filter]:bg-background/25`}
      >
        <div className="container py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group relative inline-flex flex-col items-start leading-none transition-all">
              <span className="relative text-[1.18rem] font-black tracking-[-0.055em] transition-all duration-300 md:text-[1.22rem]">
                BRANDON PT DAVIS
              </span>
              <span className="mt-1 pl-[0.08rem] text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground md:text-[9.5px]">
                SCENIC DESIGNER
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Work Dropdown - Hover Based with Delay */}
              <div 
                className="relative" 
                ref={portfolioDropdownRef}
                onMouseEnter={handlePortfolioMouseEnter}
                onMouseLeave={handlePortfolioMouseLeave}
              >
                {(() => {
                  const isPortfolioActive =
                    isActive("/projects") ||
                    isActive("/projects/scenic-design") ||
                    isActive("/assistant-scenic-design");
                  return (
                <Link
                  href="/projects"
                  className={`relative flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-foreground ${
                    isPortfolioActive ? "text-foreground" : "text-foreground/66"
                  }`}
                >
                  PORTFOLIO
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${portfolioOpen ? "rotate-180" : ""}`} />
                  <ActiveUnderline active={isPortfolioActive} color="rgba(255,255,255,0.92)" />
                </Link>
                  );
                })()}

                {/* Dropdown Menu */}
                {portfolioOpen && (
                  <div 
                    className="absolute top-full left-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-background/85 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={handlePortfolioMouseEnter}
                    onMouseLeave={handlePortfolioMouseLeave}
                  >
                    {disciplines.map((discipline) => (
                      <Link
                        key={discipline.slug}
                        href={discipline.path}
                        className="block border-b border-white/6 px-5 py-3 text-sm font-medium text-foreground/72 transition-colors hover:bg-white/5 hover:text-foreground last:border-0"
                      >
                        <span className="relative z-10 flex items-center">
                          {discipline.icon}
                          {discipline.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* About Dropdown - Hover Based with Delay */}
              <div 
                className="relative" 
                ref={aboutDropdownRef}
                onMouseEnter={handleAboutMouseEnter}
                onMouseLeave={handleAboutMouseLeave}
              >
                {(() => {
                  const isAboutActive =
                    isActive("/about") || isActive("/teaching-philosophy") || isActive("/about/teaching") || isActive("/resume") || isActive("/creative-statement");
                  return (
                <Link
                  href="/about"
                  className={`relative flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-foreground ${
                    isAboutActive ? "text-foreground" : "text-foreground/66"
                  }`}
                >
                  ABOUT
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${aboutOpen ? "rotate-180" : ""}`} />
                  <ActiveUnderline active={isAboutActive} color="rgba(255,255,255,0.92)" />
                </Link>
                  );
                })()}

                {/* Dropdown Menu */}
                {aboutOpen && (
                  <div 
                    className="absolute top-full left-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-background/85 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={handleAboutMouseEnter}
                    onMouseLeave={handleAboutMouseLeave}
                  >
                    {aboutPages.map((page) => (
                      <Link
                        key={page.slug}
                        href={page.slug}
                        className="block border-b border-white/6 px-5 py-3 text-sm font-medium text-foreground/72 transition-colors hover:bg-white/5 hover:text-foreground last:border-0"
                      >
                        <span className="relative z-10 flex items-center">
                          {page.icon}
                          {page.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>



              {/* Studio Dropdown - Hover Based with Delay */}
              <div 
                className="relative" 
                ref={studioDropdownRef}
                onMouseEnter={handleStudioMouseEnter}
                onMouseLeave={handleStudioMouseLeave}
              >
                {(() => {
                  const isStudioActive = isActive("/studio") || isActive("/articles");
                  return (
                <Link
                  href="/studio"
                  className={`relative flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-foreground ${
                    isStudioActive ? "text-foreground" : "text-foreground/66"
                  }`}
                >
                  STUDIO
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${studioOpen ? "rotate-180" : ""}`} />
                  <ActiveUnderline active={isStudioActive} color="rgba(255,255,255,0.92)" />
                </Link>
                  );
                })()}

                {/* Dropdown Menu */}
                {studioOpen && (
                  <div 
                    className="absolute top-full left-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-background/85 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={handleStudioMouseEnter}
                    onMouseLeave={handleStudioMouseLeave}
                  >
                    <Link
                      href="/articles"
                      className="block border-b border-white/6 px-5 py-3 text-sm font-medium text-foreground/72 transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                      <span className="relative z-10 flex items-center">
                        <FileText className="w-[18px] h-[18px] mr-2" />
                        Articles
                      </span>
                    </Link>
                    <Link
                      href="/studio/tutorials"
                      className="block border-b border-white/6 px-5 py-3 text-sm font-medium text-foreground/72 transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                      <span className="relative z-10 flex items-center">
                        <TutorialsIcon />
                        Tutorials
                      </span>
                    </Link>
                    <Link
                      href="/studio/apps"
                      className="block border-b border-white/6 px-5 py-3 text-sm font-medium text-foreground/72 transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                      <span className="relative z-10 flex items-center">
                        <AppStudioIcon />
                        App Studio
                      </span>
                    </Link>
                    <Link
                      href="/studio/directory"
                      className="block border-b border-white/6 px-5 py-3 text-sm font-medium text-foreground/72 transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                      <span className="relative z-10 flex items-center">
                        <DirectoryIcon />
                        Scenic Directory
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Contact Button - Minimal White Frame */}
              <Link 
                href="/contact" 
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/24 px-5 text-[11px] font-medium uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/5"
              >
                CONTACT
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 lg:hidden">
              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-foreground/10 hover:border hover:border-border transition-all"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
