import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import MobileMenu from "./MobileMenu";

// Custom Neon SVG Icons for Dropdown Items
const ScenicDesignIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-2">
    <path d="M2 8h20M2 8v12a2 2 0 002 2h16a2 2 0 002-2V8M6 4h12M8 4v4M16 4v4" />
    <rect x="4" y="8" width="16" height="3" />
  </svg>
);

const ExperientialIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20M2 12h20" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const RenderingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const ModelsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-2">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const CategoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-2">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function Header() {
  const [location] = useLocation();
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [articlesOpen, setArticlesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const portfolioDropdownRef = useRef<HTMLDivElement>(null);
  const newsDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const articlesDropdownRef = useRef<HTMLDivElement>(null);

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
        setArticlesOpen(false);
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
      if (newsDropdownRef.current && !newsDropdownRef.current.contains(event.target as Node)) {
        setNewsOpen(false);
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutOpen(false);
      }
      if (articlesDropdownRef.current && !articlesDropdownRef.current.contains(event.target as Node)) {
        setArticlesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const disciplines = [
    { name: "Scenic Design", slug: "scenic_design", icon: <ScenicDesignIcon /> },
    { name: "Experiential", slug: "experiential_design", icon: <ExperientialIcon /> },
    { name: "Renderings", slug: "rendering", icon: <RenderingIcon /> },
    { name: "Models", slug: "scenic_models", icon: <ModelsIcon /> },
  ];

  const newsCategories = [
    { name: "All News", slug: "", icon: <CategoryIcon /> },
    { name: "Collaborations", slug: "collaborations", icon: <CategoryIcon /> },
    { name: "Milestones", slug: "milestones", icon: <CategoryIcon /> },
    { name: "Opening Nights", slug: "opening-nights", icon: <CategoryIcon /> },
    { name: "Production Debuts", slug: "production-debuts", icon: <CategoryIcon /> },
    { name: "Reviews & Press", slug: "reviews-press", icon: <CategoryIcon /> },
    { name: "Season Announcements", slug: "season-announcements", icon: <CategoryIcon /> },
  ];

  const articleCategories = [
    { name: "All Articles", slug: "", icon: <CategoryIcon /> },
    { name: "Career Guides", slug: "career", icon: <CategoryIcon /> },
    { name: "Design Process", slug: "process", icon: <CategoryIcon /> },
    { name: "Technical Tutorials", slug: "technical", icon: <CategoryIcon /> },
    { name: "Industry Insights", slug: "industry", icon: <CategoryIcon /> },
  ];

  const aboutPages = [
    { name: "About", slug: "/about" },
    { name: "Teaching Philosophy", slug: "/about/teaching" },
    { name: "Resume / CV", slug: "/about/resume" },
    { name: "Creative Statement", slug: "/about/philosophy" },
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
            <Link href="/" className="text-xl font-black tracking-tighter hover:text-primary transition-all group">
              <span className="relative">
                BRANDON PT DAVIS
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#FF5722] to-[#2196F3] group-hover:w-full transition-all duration-300"></span>
              </span>
              <span className="block text-[10px] font-normal tracking-[0.2em] text-muted-foreground mt-0.5">
                SCENIC DESIGNER
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Work Dropdown - Hover Based */}
              <div 
                className="relative" 
                ref={portfolioDropdownRef}
                onMouseEnter={() => setPortfolioOpen(true)}
                onMouseLeave={() => setPortfolioOpen(false)}
              >
                <Link
                  href="/projects"
                  className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-[#2196F3] relative group ${
                    isActive("/projects") ? "text-[#2196F3]" : ""
                  }`}
                >
                  WORK
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${portfolioOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#2196F3] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* Dropdown Menu */}
                {portfolioOpen && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-popover backdrop-blur-xl border border-border rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {disciplines.map((discipline) => (
                      <Link
                        key={discipline.slug}
                        href={`/projects?discipline=${discipline.slug}`}
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

              {/* News Dropdown - Hover Based */}
              <div 
                className="relative" 
                ref={newsDropdownRef}
                onMouseEnter={() => setNewsOpen(true)}
                onMouseLeave={() => setNewsOpen(false)}
              >
                <Link
                  href="/news"
                  className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-[#FF5722] relative group ${
                    isActive("/news") ? "text-[#FF5722]" : ""
                  }`}
                >
                  NEWS
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${newsOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF5722] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* Dropdown Menu */}
                {newsOpen && (
                  <div className="absolute top-full left-0 mt-3 w-64 bg-popover backdrop-blur-xl border border-border rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {newsCategories.map((category) => (
                      <Link
                        key={category.slug || "all"}
                        href={category.slug ? `/news?category=${category.slug}` : "/news"}
                        className="block px-5 py-3 text-sm font-semibold hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-all border-b border-border last:border-0 relative group"
                      >
                        <span className="relative z-10 flex items-center">
                          {category.icon}
                          {category.name}
                        </span>
                        <span className="absolute left-0 top-0 w-1 h-0 bg-[#FF5722] group-hover:h-full transition-all duration-300"></span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* About Dropdown - Hover Based */}
              <div 
                className="relative" 
                ref={aboutDropdownRef}
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <Link
                  href="/about"
                  className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-foreground relative group ${
                    isActive("/about") || isActive("/teaching-philosophy") || isActive("/resume") || isActive("/creative-statement") ? "text-foreground" : ""
                  }`}
                >
                  ABOUT
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${aboutOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-foreground group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* Dropdown Menu */}
                {aboutOpen && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-popover backdrop-blur-xl border border-border rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
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

              {/* Articles Dropdown - Hover Based */}
              <div 
                className="relative" 
                ref={articlesDropdownRef}
                onMouseEnter={() => setArticlesOpen(true)}
                onMouseLeave={() => setArticlesOpen(false)}
              >
                <Link
                  href="/articles"
                  className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-[#9C27B0] relative group ${
                    isActive("/articles") ? "text-[#9C27B0]" : ""
                  }`}
                >
                  ARTICLES
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${articlesOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#9C27B0] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* Dropdown Menu */}
                {articlesOpen && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-popover backdrop-blur-xl border border-border rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {articleCategories.map((category) => (
                      <Link
                        key={category.slug || "all"}
                        href={category.slug ? `/articles?category=${category.slug}` : "/articles"}
                        className="block px-5 py-3 text-sm font-semibold hover:bg-[#9C27B0]/10 hover:text-[#9C27B0] transition-all border-b border-border last:border-0 relative group"
                      >
                        <span className="relative z-10 flex items-center">
                          {category.icon}
                          {category.name}
                        </span>
                        <span className="absolute left-0 top-0 w-1 h-0 bg-[#9C27B0] group-hover:h-full transition-all duration-300"></span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/studio" 
                className={`text-sm font-bold tracking-wide transition-all hover:text-foreground relative group ${
                  isActive("/studio") ? "text-foreground" : ""
                }`}
              >
                STUDIO
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-foreground group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-sm font-medium hover:text-foreground transition-all p-1 relative group"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="absolute inset-0 rounded-full border border-border group-hover:border-foreground/50 transition-all duration-300"></span>
              </button>

              {/* Contact Button */}
              <Link 
                href="/contact" 
                className="text-sm font-black tracking-wide bg-gradient-to-r from-[#FF5722] to-[#FF1744] text-white px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(255,87,34,0.5)] hover:scale-105 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">CONTACT</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#FF1744] to-[#FF5722] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 lg:hidden">
              {/* Theme Toggle (Mobile) */}
              <button
                onClick={toggleTheme}
                className="text-sm font-medium hover:text-foreground transition-all p-1"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

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
