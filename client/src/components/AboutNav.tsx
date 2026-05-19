"use client";

import { Link, useLocation } from "wouter";

export default function AboutNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/about", label: "Profile" },
    { path: "/upcoming-productions", label: "Upcoming", matchPrefix: true },
    { path: "/resume", label: "Resume" },
    { path: "/creative-statement", label: "Creative" },
    { path: "/about/teaching", label: "Teaching", aliases: ["/teaching-philosophy", "/about/philosophy"] },
    { path: "/about/collaborators", label: "Collaborators" },
  ];

  return (
    <nav
      aria-label="Profile section navigation"
      className="sticky top-[72px] z-30 border-b border-white/10 bg-background/82 backdrop-blur-xl supports-[backdrop-filter]:bg-background/64"
    >
      <div className="container py-3">
        <div className="mx-auto max-w-5xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center justify-start gap-6 px-1 md:min-w-0 md:justify-center md:gap-8">
            {navItems.map((item) => {
              const isActive =
                location === item.path ||
                item.aliases?.includes(location) ||
                (item.matchPrefix && location.startsWith(`${item.path}/`));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    group relative inline-flex items-center justify-center whitespace-nowrap py-1 text-[0.8rem] font-medium tracking-[-0.01em] transition-colors
                    before:absolute before:inset-x-0 before:-bottom-[0.82rem] before:h-px before:origin-center before:scale-x-0 before:bg-foreground/72 before:transition-transform
                    ${
                      isActive
                        ? "text-foreground before:scale-x-100"
                        : "text-foreground/50 hover:text-foreground/82"
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
