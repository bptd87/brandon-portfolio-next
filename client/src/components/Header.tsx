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
  const { theme, toggleTheme } = useTheme();
  const portfolioDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

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
    { name: "Resume", slug: "/resume" },
    { name: "Philosophy", slug: "/teaching-philosophy" },
    { name: "Statement", slug: "/creative-statement" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="container py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-black tracking-tighter hover:opacity-70 transition-opacity">
              BRANDON PT DAVIS
              <span className="block text-[10px] font-normal tracking-[0.2em] text-muted-foreground mt-0.5">
                SCENIC DESIGNER
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Portfolio Dropdown */}
              <div className="relative" ref={portfolioDropdownRef}>
                <button
                  onClick={() => setPortfolioOpen(!portfolioOpen)}
                  className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-[#FF5722] ${
                    isActive("/projects") ? "text-[#FF5722]" : ""
                  }`}
                >
                  WORK
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${portfolioOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {portfolioOpen && (
                  <div className="absolute top-full right-0 mt-3 w-48 bg-background border border-border/50 rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {disciplines.map((discipline) => (
                      <Link
                        key={discipline.slug}
                        href={`/projects?discipline=${discipline.slug}`}
                        onClick={() => setPortfolioOpen(false)}
                        className="block px-5 py-3 text-sm font-semibold hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-all border-b border-border/30 last:border-0"
                      >
                        {discipline.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/news" 
                className={`text-sm font-bold tracking-wide transition-all hover:text-[#00E5FF] ${
                  isActive("/news") ? "text-[#00E5FF]" : ""
                }`}
              >
                NEWS
              </Link>

              {/* About Dropdown */}
              <div className="relative" ref={aboutDropdownRef}>
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-[#FF1744] ${
                    isActive("/about") || isActive("/teaching-philosophy") || isActive("/resume") || isActive("/creative-statement") ? "text-[#FF1744]" : ""
                  }`}
                >
                  ABOUT
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${aboutOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {aboutOpen && (
                  <div className="absolute top-full right-0 mt-3 w-48 bg-background border border-border/50 rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {aboutPages.map((page) => (
                      <Link
                        key={page.slug}
                        href={page.slug}
                        onClick={() => setAboutOpen(false)}
                        className="block px-5 py-3 text-sm font-semibold hover:bg-[#FF1744]/10 hover:text-[#FF1744] transition-all border-b border-border/30 last:border-0"
                      >
                        {page.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/articles" 
                className={`text-sm font-bold tracking-wide transition-all hover:text-[#FF5722] ${
                  isActive("/articles") ? "text-[#FF5722]" : ""
                }`}
              >
                ARTICLES
              </Link>

              <Link 
                href="/studio" 
                className={`text-sm font-bold tracking-wide transition-all hover:text-[#00E5FF] ${
                  isActive("/studio") ? "text-[#00E5FF]" : ""
                }`}
              >
                STUDIO
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-sm font-medium hover:text-[#FF5722] transition-all p-1"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Contact Button */}
              <Link 
                href="/contact" 
                className="text-sm font-black tracking-wide bg-[#FF5722] text-white px-6 py-2.5 rounded-full hover:bg-[#FF5722]/90 hover:scale-105 transition-all"
              >
                CONTACT
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 lg:hidden">
              {/* Theme Toggle (Mobile) */}
              <button
                onClick={toggleTheme}
                className="text-sm font-medium hover:text-[#FF5722] transition-all p-1"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-foreground/10 transition-colors"
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
