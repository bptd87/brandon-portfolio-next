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
    <nav className="sticky top-[72px] z-30 border-b border-white/10 bg-background/40 backdrop-blur-xl supports-[backdrop-filter]:bg-background/25 mb-10">
      <div className="container py-3">
        <div className="mx-auto max-w-5xl rounded-2xl border border-border/40 bg-card/10 p-2">
          <div className="flex flex-wrap justify-center gap-2">
            {navItems.map((item, index) => {
              const isActive = location === item.path || item.aliases?.includes(location);
              const accent = ["#FF5722", "#00BCD4", "#E91E63", "#FFC107", "#7CFF6B"][index % 5];
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    inline-flex items-center justify-center h-9 px-4 rounded-md border text-[11px] font-semibold tracking-[0.12em] uppercase transition-all whitespace-nowrap
                    ${
                      isActive
                        ? "text-white border-transparent"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                    }
                  `}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${accent}33`,
                          boxShadow: `inset 0 0 0 1px ${accent}80`,
                        }
                      : undefined
                  }
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
