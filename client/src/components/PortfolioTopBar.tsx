"use client";

import { usePathname } from "next/navigation";
import { Link } from "wouter";

import { HOME_DISPLAY_FONT, useHomeTheme } from "@/lib/homeTheme";

type PortfolioNavItem = {
  path: string;
  label: string;
  exact?: boolean;
};

const portfolioNavItems: PortfolioNavItem[] = [
  { path: "/projects", label: "Scenic Design", exact: true },
  { path: "/projects/experiential", label: "Experiential" },
  { path: "/projects/rendering", label: "Rendering" },
  { path: "/projects/photography", label: "Photography" },
] as const;

export default function PortfolioTopBar() {
  const pathname = usePathname() || "/";
  const { homeTheme } = useHomeTheme();

  const isActive = (item: PortfolioNavItem) => {
    if (item.exact) return pathname === item.path;
    return pathname === item.path || pathname.startsWith(`${item.path}/`);
  };

  return (
    <nav
      aria-label="Portfolio section navigation"
      className="absolute left-[clamp(1.25rem,2.4vw,2.25rem)] top-[clamp(1.25rem,2.4vw,2.25rem)] z-[60] max-w-[calc(100vw-7rem)] overflow-visible"
      style={{ fontFamily: HOME_DISPLAY_FONT }}
    >
      <div className="flex max-w-full flex-wrap items-center gap-2 overflow-visible">
        {portfolioNavItems.map((item) => {
          const active = isActive(item);

          return (
            <Link
              key={item.path}
              href={item.path}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-[0.75rem] font-black uppercase leading-none tracking-[0.04em] transition-[background-color,color,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              style={{
                backgroundColor: active ? homeTheme.controlBg : homeTheme.accentSoft,
                color: active ? homeTheme.controlInk : homeTheme.muted,
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
