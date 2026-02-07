import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Header() {
  const [location] = useLocation();
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
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
    { name: "Scenic Design", slug: "scenic_design", description: "Spatial Storytelling & Environments" },
    { name: "Experiential Design", slug: "experiential_design", description: "Immersive Brand Activations" },
    { name: "Renderings", slug: "rendering", description: "Visualization & Concept" },
    { name: "Scenic Models", slug: "scenic_models", description: "Scale Model Archive" },
  ];

  const aboutPages = [
    { name: "About", slug: "/about", description: "Biography & Experience" },
    { name: "Teaching Philosophy", slug: "/teaching-philosophy", description: "Educational Approach" },
    { name: "Resume / CV", slug: "/resume", description: "Professional History" },
    { name: "Creative Statement", slug: "/creative-statement", description: "Artistic Vision" },
  ];

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-border">
      <div className="container py-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-primary transition-smooth">
            <span className="font-['Playfair_Display']">B</span> BRANDON PT DAVIS
            <span className="block text-xs font-normal tracking-widest text-muted-foreground mt-1">
              SCENIC DESIGNER
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            {/* Portfolio Dropdown */}
            <div className="relative" ref={portfolioDropdownRef}>
              <button
                onClick={() => setPortfolioOpen(!portfolioOpen)}
                className={`text-sm font-medium transition-smooth flex items-center gap-1 ${
                  isActive("/projects") ? "text-primary" : "hover:text-primary"
                }`}
              >
                PORTFOLIO
                <ChevronDown className={`w-4 h-4 transition-transform ${portfolioOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {portfolioOpen && (
                <div className="absolute top-full left-0 mt-4 w-64 glass-strong rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  {disciplines.map((discipline, index) => (
                    <Link
                      key={discipline.slug}
                      href={`/projects?discipline=${discipline.slug}`}
                      onClick={() => setPortfolioOpen(false)}
                      className={`block px-6 py-4 transition-smooth hover:bg-accent/50 ${
                        index !== disciplines.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{discipline.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{discipline.description}</div>
                        </div>
                        <span className="text-muted-foreground">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/news" 
              className={`text-sm font-medium transition-smooth ${
                isActive("/news") ? "text-primary" : "hover:text-primary"
              }`}
            >
              NEWS
            </Link>

            {/* About Dropdown */}
            <div className="relative" ref={aboutDropdownRef}>
              <button
                onClick={() => setAboutOpen(!aboutOpen)}
                className={`text-sm font-medium transition-smooth flex items-center gap-1 ${
                  isActive("/about") || isActive("/teaching-philosophy") || isActive("/resume") || isActive("/creative-statement") ? "text-primary" : "hover:text-primary"
                }`}
              >
                ABOUT
                <ChevronDown className={`w-4 h-4 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {aboutOpen && (
                <div className="absolute top-full left-0 mt-4 w-64 glass-strong rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  {aboutPages.map((page, index) => (
                    <Link
                      key={page.slug}
                      href={page.slug}
                      onClick={() => setAboutOpen(false)}
                      className={`block px-6 py-4 transition-smooth hover:bg-accent/50 ${
                        index !== aboutPages.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{page.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{page.description}</div>
                        </div>
                        <span className="text-muted-foreground">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link 
              href="/articles" 
              className={`text-sm font-medium transition-smooth ${
                isActive("/articles") ? "text-primary" : "hover:text-primary"
              }`}
            >
              ARTICLES
            </Link>
            <Link 
              href="/studio" 
              className={`text-sm font-medium transition-smooth ${
                isActive("/studio") ? "text-primary" : "hover:text-primary"
              }`}
            >
              STUDIO
            </Link>

            {/* Search Icon */}
            <button
              className="text-sm font-medium hover:text-primary transition-smooth"
              title="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-sm font-medium hover:text-primary transition-smooth"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Contact Button */}
            <Link 
              href="/contact" 
              className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-smooth hover-lift"
            >
              CONTACT
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
