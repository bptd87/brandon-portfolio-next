import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">
            <span className="font-['Playfair_Display']">B</span> BRANDON PT DAVIS
            <span className="block text-xs font-normal tracking-widest text-muted-foreground mt-1">
              SCENIC DESIGNER
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/projects" 
              className={`text-sm font-medium transition-colors ${
                isActive("/projects") ? "text-primary" : "hover:text-primary"
              }`}
            >
              PORTFOLIO
            </Link>
            <Link 
              href="/news" 
              className={`text-sm font-medium transition-colors ${
                isActive("/news") ? "text-primary" : "hover:text-primary"
              }`}
            >
              NEWS
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-colors ${
                isActive("/about") ? "text-primary" : "hover:text-primary"
              }`}
            >
              ABOUT
            </Link>
            <Link 
              href="/articles" 
              className={`text-sm font-medium transition-colors ${
                isActive("/articles") ? "text-primary" : "hover:text-primary"
              }`}
            >
              ARTICLES
            </Link>
            <Link 
              href="/studio" 
              className={`text-sm font-medium transition-colors ${
                isActive("/studio") ? "text-primary" : "hover:text-primary"
              }`}
            >
              STUDIO
            </Link>
            <Link 
              href="/admin" 
              className={`text-sm font-medium transition-colors ${
                isActive("/admin") ? "text-primary" : "hover:text-primary"
              }`}
            >
              ADMIN
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-sm hover:bg-primary/90 transition-colors"
            >
              CONTACT
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
