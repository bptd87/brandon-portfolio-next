"use client";

import { usePathname } from "next/navigation";
import { Link } from "wouter";

type PortfolioNavItem = {
  path: string;
  label: string;
  exact?: boolean;
};

const portfolioNavItems: PortfolioNavItem[] = [
  { path: "/projects", label: "Scenic Design", exact: true },
  { path: "/projects/rendering", label: "Rendering" },
  { path: "/projects/experiential", label: "Experiential" },
  { path: "/assistant-scenic-design", label: "Assistant Scenic" },
] as const;

export default function PortfolioTopBar() {
  const pathname = usePathname() || "/";

  const isActive = (item: PortfolioNavItem) => {
    if (item.exact) return pathname === item.path;
    return pathname === item.path || pathname.startsWith(`${item.path}/`);
  };

  return (
    <nav
      aria-label="Portfolio section navigation"
      className="sticky top-[72px] z-30 border-b border-white/[0.08] bg-[#111111]/90 backdrop-blur-xl"
    >
      <div className="flex min-h-16 flex-col gap-3 px-[clamp(1.5rem,5vw,6rem)] py-3 md:flex-row md:items-center md:justify-between md:gap-8">
        <Link
          href="/projects"
          className="text-[1.35rem] font-semibold leading-none tracking-[-0.045em] text-white"
        >
          Portfolio
        </Link>

        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-6 md:gap-8">
            {portfolioNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-[0.95rem] tracking-[-0.025em] transition-colors ${
                  isActive(item) ? "text-white" : "text-white/52 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
