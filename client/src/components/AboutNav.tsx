import { Link, useLocation } from "wouter";

export default function AboutNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/about", label: "About" },
    { path: "/resume", label: "Resume" },
    { path: "/creative-statement", label: "Creative Statement" },
    { path: "/about/teaching", label: "Teaching Philosophy", aliases: ["/teaching-philosophy", "/about/philosophy"] },
    { path: "/about/collaborators", label: "Collaborators" },
  ];

  return (
    <nav className="sticky top-[72px] z-30 mb-10 border-b border-white/10 bg-background/72 backdrop-blur-xl supports-[backdrop-filter]:bg-background/58">
      <div className="container py-3">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {navItems.map((item) => {
              const isActive = location === item.path || item.aliases?.includes(location);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    group relative inline-flex items-center justify-center py-1 text-[0.82rem] font-medium tracking-[-0.02em] transition-colors whitespace-nowrap
                    ${
                      isActive
                        ? "text-foreground"
                        : "text-foreground/52 hover:text-foreground/82"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
