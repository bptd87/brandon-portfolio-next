import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu } from "lucide-react";
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

// Models - 3D layers/construction
const ModelsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <path d="M12 3L4 7l8 4 8-4-8-4z" />
    <path d="M4 12l8 4 8-4" strokeOpacity="0.7" />
    <path d="M4 17l8 4 8-4" strokeOpacity="0.4" />
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

// Articles - Pencil/writing
const ArticleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <path d="M17 3l4 4L7 21H3v-4L17 3z" />
    <path d="M14 6l4 4" strokeOpacity="0.5" />
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

// Vault - Archive/safe
const VaultIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block mr-2">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9v6M9 12h6" strokeWidth="1" />
    <path d="M19 12h2M3 12h2" strokeOpacity="0.5" />
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
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const [studioOpen, setStudioOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Refs for dropdown containers
  const portfolioDropdownRef = useRef<HTMLDivElement>(null);
  const newsDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);

  const studioDropdownRef = useRef<HTMLDivElement>(null);
  
  // Timeout refs for delayed closing
  const portfolioTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const newsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const studioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  // Auto-hide navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show nav when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        // Close dropdowns when hiding
        setPortfolioOpen(false);
        setNewsOpen(false);
        setAboutOpen(false);

        setStudioOpen(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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

  const handleNewsMouseLeave = () => {
    newsTimeoutRef.current = setTimeout(() => {
      setNewsOpen(false);
    }, 300);
  };

  const handleNewsMouseEnter = () => {
    if (newsTimeoutRef.current) {
      clearTimeout(newsTimeoutRef.current);
    }
    setNewsOpen(true);
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
    { name: "Scenic Design", slug: "scenic-design", path: "/projects/scenic-design", icon: <ScenicDesignIcon /> },
    { name: "Experiential", slug: "experiential", path: "/projects/experiential", icon: <ExperientialIcon /> },
    { name: "Renderings", slug: "rendering", path: "/projects/rendering", icon: <RenderingIcon /> },
    { name: "Models", slug: "scenic-models", path: "/projects/scenic-models", icon: <ModelsIcon /> },
  ];

  const newsCategories = [
    { name: "All News", slug: "", icon: <AllCategoriesIcon /> },
    { name: "Production Debuts", slug: "production-debuts", icon: <ProductionIcon /> },
    { name: "Collaborations", slug: "collaborations", icon: <CollaborationIcon /> },
    { name: "Milestones", slug: "milestones", icon: <MilestoneIcon /> },
    { name: "Opening Nights", slug: "opening-nights", icon: <OpeningIcon /> },
    { name: "Reviews & Press", slug: "reviews-press", icon: <ReviewIcon /> },
    { name: "Season Announcements", slug: "season-announcements", icon: <SeasonIcon /> },
  ];

  const articleCategories = [
    { name: "All Articles", slug: "", icon: <AllCategoriesIcon /> },
    { name: "Design Philosophy", slug: "design-philosophy", icon: <ArticleIcon /> },
    { name: "Musical Theatre & Cinema", slug: "musical-theatre-cinema", icon: <ArticleIcon /> },
    { name: "Scenic Design Process", slug: "scenic-design-process", icon: <ArticleIcon /> },
    { name: "Technology & Tutorials", slug: "technology-tutorials", icon: <ArticleIcon /> },
    { name: "Themed Entertainment", slug: "themed-entertainment", icon: <ArticleIcon /> },
  ];

  const aboutPages = [
    { name: "About", slug: "/about" },
    { name: "Resume / CV", slug: "/resume" },
    { name: "Creative Statement", slug: "/creative-statement" },
    { name: "Teaching Philosophy", slug: "/about/teaching" },
    { name: "Collaborators", slug: "/about/collaborators" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-black tracking-tighter transition-all group relative">
              <span className="relative group-hover:drop-shadow-[0_0_12px_rgba(33,150,243,0.6)] transition-all duration-300">
                BRANDON PT DAVIS
              </span>
              <span className="block text-[10px] font-normal tracking-[0.2em] text-muted-foreground mt-0.5">
                SCENIC DESIGNER
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Work Dropdown - Hover Based with Delay */}
              <div 
                className="relative" 
                ref={portfolioDropdownRef}
                onMouseEnter={handlePortfolioMouseEnter}
                onMouseLeave={handlePortfolioMouseLeave}
              >
                <Link
                  href="/projects"
                  className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-[#2196F3] relative group ${
                    isActive("/projects") ? "text-[#2196F3]" : ""
                  }`}
                >
                  PORTFOLIO
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${portfolioOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#2196F3] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* Dropdown Menu */}
                {portfolioOpen && (
                  <div 
                    className="absolute top-full left-0 mt-3 w-56 bg-popover backdrop-blur-xl border border-border rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={handlePortfolioMouseEnter}
                    onMouseLeave={handlePortfolioMouseLeave}
                  >
                    {disciplines.map((discipline) => (
                      <Link
                        key={discipline.slug}
                        href={discipline.path}
                        className="block px-5 py-3 text-sm font-semibold hover:bg-[#2196F3]/10 hover:text-[#2196F3] transition-all border-b border-border last:border-0 relative group"
                      >
                        <span className="relative z-10 flex items-center">
                          {discipline.icon}
                          {discipline.name}
                        </span>
                        <span className="absolute left-0 top-0 w-1 h-0 bg-[#2196F3] group-hover:h-full transition-all duration-300"></span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* News - Direct Link (No Dropdown) */}
              <Link
                href="/news"
                className={`text-sm font-bold tracking-wide transition-all hover:text-[#FF5722] relative group ${
                  isActive("/news") ? "text-[#FF5722]" : ""
                }`}
              >
                NEWS
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF5722] group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* About Dropdown - Hover Based with Delay */}
              <div 
                className="relative" 
                ref={aboutDropdownRef}
                onMouseEnter={handleAboutMouseEnter}
                onMouseLeave={handleAboutMouseLeave}
              >
                <Link
                  href="/about"
                  className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-[#4CAF50] relative group ${
                    isActive("/about") || isActive("/teaching-philosophy") || isActive("/resume") || isActive("/creative-statement") ? "text-[#4CAF50]" : ""
                  }`}
                >
                  ABOUT
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${aboutOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4CAF50] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* Dropdown Menu */}
                {aboutOpen && (
                  <div 
                    className="absolute top-full left-0 mt-3 w-56 bg-popover backdrop-blur-xl border border-border rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={handleAboutMouseEnter}
                    onMouseLeave={handleAboutMouseLeave}
                  >
                    {aboutPages.map((page) => (
                      <Link
                        key={page.slug}
                        href={page.slug}
                        className="block px-5 py-3 text-sm font-semibold hover:bg-foreground/10 hover:text-foreground transition-all border-b border-border last:border-0 relative group"
                      >
                        <span className="relative z-10">{page.name}</span>
                        <span className="absolute left-0 top-0 w-1 h-0 bg-foreground group-hover:h-full transition-all duration-300"></span>
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
                <Link
                  href="/studio"
                  className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-[#9C27B0] relative group ${
                    isActive("/studio") || isActive("/articles") || isActive("/vault") ? "text-[#9C27B0]" : ""
                  }`}
                >
                  STUDIO
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${studioOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#9C27B0] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* Dropdown Menu */}
                {studioOpen && (
                  <div 
                    className="absolute top-full left-0 mt-3 w-56 bg-popover backdrop-blur-xl border border-border rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={handleStudioMouseEnter}
                    onMouseLeave={handleStudioMouseLeave}
                  >
                    <Link
                      href="/articles"
                      className="block px-5 py-3 text-sm font-semibold hover:bg-foreground/10 hover:text-foreground transition-all border-b border-border relative group"
                    >
                      <span className="relative z-10 flex items-center">
                        <ArticleIcon />
                        Articles
                      </span>
                      <span className="absolute left-0 top-0 w-1 h-0 bg-foreground group-hover:h-full transition-all duration-300"></span>
                    </Link>
                    <Link
                      href="/studio/tutorials"
                      className="block px-5 py-3 text-sm font-semibold hover:bg-foreground/10 hover:text-foreground transition-all border-b border-border relative group"
                    >
                      <span className="relative z-10 flex items-center">
                        <TutorialsIcon />
                        Tutorials
                      </span>
                      <span className="absolute left-0 top-0 w-1 h-0 bg-foreground group-hover:h-full transition-all duration-300"></span>
                    </Link>
                    <Link
                      href="/studio"
                      className="block px-5 py-3 text-sm font-semibold hover:bg-foreground/10 hover:text-foreground transition-all border-b border-border relative group"
                    >
                      <span className="relative z-10 flex items-center">
                        <AppStudioIcon />
                        App Studio
                      </span>
                      <span className="absolute left-0 top-0 w-1 h-0 bg-foreground group-hover:h-full transition-all duration-300"></span>
                    </Link>
                    <Link
                      href="/studio/directory"
                      className="block px-5 py-3 text-sm font-semibold hover:bg-foreground/10 hover:text-foreground transition-all border-b border-border relative group"
                    >
                      <span className="relative z-10 flex items-center">
                        <DirectoryIcon />
                        Scenic Directory
                      </span>
                      <span className="absolute left-0 top-0 w-1 h-0 bg-foreground group-hover:h-full transition-all duration-300"></span>
                    </Link>
                    <Link
                      href="/vault"
                      className="block px-5 py-3 text-sm font-semibold hover:bg-foreground/10 hover:text-foreground transition-all border-b border-border last:border-0 relative group"
                    >
                      <span className="relative z-10 flex items-center">
                        <VaultIcon />
                        Vault
                      </span>
                      <span className="absolute left-0 top-0 w-1 h-0 bg-foreground group-hover:h-full transition-all duration-300"></span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Contact Button - Minimal White Frame */}
              <Link 
                href="/contact" 
                className="text-sm font-bold tracking-wide text-white border-2 border-white px-5 py-2 rounded-md hover:bg-white/10 hover:border-white/80 transition-all duration-300"
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
