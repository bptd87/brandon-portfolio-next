import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [location] = useLocation();
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const portfolioDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);

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
        setAboutOpen(false);
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const disciplines = [
    { name: "Scenic Design", slug: "scenic_design" },
    { name: "Experiential", slug: "experiential_design" },
    { name: "Renderings", slug: "rendering" },
    { name: "Models", slug: "scenic_models" },
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
        className={`fixed top-0 left-0 right-0 z-50 border-b border-[#00E5FF]/20 bg-background/95 backdrop-blur-xl transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          boxShadow: isVisible ? "0 0 20px rgba(0, 229, 255, 0.1)" : "none"
        }}
      >
        <div className="container py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-black tracking-tighter hover:text-[#00E5FF] transition-all group">
              <span className="relative">
                BRANDON PT DAVIS
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#00E5FF] to-[#FFD700] group-hover:w-full transition-all duration-300"></span>
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
                  className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-[#00E5FF] relative group ${
                    isActive("/projects") ? "text-[#00E5FF]" : ""
                  }`}
                >
                  WORK
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${portfolioOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00E5FF] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* Dropdown Menu */}
                {portfolioOpen && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-background/95 backdrop-blur-xl border border-[#00E5FF]/30 rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                      boxShadow: "0 0 30px rgba(0, 229, 255, 0.2)"
                    }}
                  >
                    {disciplines.map((discipline, index) => (
                      <Link
                        key={discipline.slug}
                        href={`/projects?discipline=${discipline.slug}`}
                        className="block px-5 py-3 text-sm font-semibold hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] transition-all border-b border-[#00E5FF]/10 last:border-0 relative group"
                      >
                        <span className="relative z-10">{discipline.name}</span>
                        <span className="absolute left-0 top-0 w-1 h-0 bg-[#00E5FF] group-hover:h-full transition-all duration-300"></span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/news" 
                className={`text-sm font-bold tracking-wide transition-all hover:text-[#00E5FF] relative group ${
                  isActive("/news") ? "text-[#00E5FF]" : ""
                }`}
              >
                NEWS
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00E5FF] group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* About Dropdown - Hover Based */}
              <div 
                className="relative" 
                ref={aboutDropdownRef}
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <Link
                  href="/about"
                  className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-[#FFD700] relative group ${
                    isActive("/about") || isActive("/teaching-philosophy") || isActive("/resume") || isActive("/creative-statement") ? "text-[#FFD700]" : ""
                  }`}
                >
                  ABOUT
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${aboutOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFD700] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* Dropdown Menu */}
                {aboutOpen && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-background/95 backdrop-blur-xl border border-[#FFD700]/30 rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                      boxShadow: "0 0 30px rgba(255, 215, 0, 0.2)"
                    }}
                  >
                    {aboutPages.map((page) => (
                      <Link
                        key={page.slug}
                        href={page.slug}
                        className="block px-5 py-3 text-sm font-semibold hover:bg-[#FFD700]/10 hover:text-[#FFD700] transition-all border-b border-[#FFD700]/10 last:border-0 relative group"
                      >
                        <span className="relative z-10">{page.name}</span>
                        <span className="absolute left-0 top-0 w-1 h-0 bg-[#FFD700] group-hover:h-full transition-all duration-300"></span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/articles" 
                className={`text-sm font-bold tracking-wide transition-all hover:text-[#00E5FF] relative group ${
                  isActive("/articles") ? "text-[#00E5FF]" : ""
                }`}
              >
                ARTICLES
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00E5FF] group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link 
                href="/studio" 
                className={`text-sm font-bold tracking-wide transition-all hover:text-[#00E5FF] relative group ${
                  isActive("/studio") ? "text-[#00E5FF]" : ""
                }`}
              >
                STUDIO
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00E5FF] group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-sm font-medium hover:text-[#00E5FF] transition-all p-1 relative group"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="absolute inset-0 rounded-full border border-[#00E5FF]/0 group-hover:border-[#00E5FF]/50 transition-all duration-300"></span>
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
                className="text-sm font-medium hover:text-[#00E5FF] transition-all p-1"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#00E5FF]/10 hover:border hover:border-[#00E5FF]/30 transition-all"
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
