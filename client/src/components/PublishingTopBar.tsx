"use client";

import { Search } from "lucide-react";

type PublishingTopBarProps = {
  active?: "articles" | "apps" | "directory";
  tone?: "light" | "dark" | "white";
};

export function PublishingTopBar({ active, tone = "light" }: PublishingTopBarProps) {
  const isDark = tone === "dark";
  const linkClass = (key: PublishingTopBarProps["active"]) =>
    `text-[0.95rem] tracking-[-0.025em] transition-colors ${
      active === key
        ? isDark ? "text-white" : "text-[#111111]"
        : isDark ? "text-white/52 hover:text-white" : "text-[#777169] hover:text-[#111111]"
    }`;

  return (
    <div
      className={`sticky top-[64px] z-30 border-b backdrop-blur-xl md:top-[72px] ${
        isDark
          ? "border-white/[0.08] bg-[#070707]/88"
          : "border-black/[0.06] bg-[#f1f0ec]/92"
      }`}
    >
      <div className="grid min-h-12 gap-2 px-[clamp(1rem,5vw,6rem)] py-2.5 md:min-h-16 md:grid-cols-[10.875rem_minmax(0,1fr)_auto] md:items-center md:gap-8 md:px-[clamp(1.5rem,5vw,6rem)] md:py-3">
        <a
          href="/studio"
          className={`hidden text-[1.35rem] font-semibold leading-none tracking-[-0.045em] md:block ${isDark ? "text-white" : "text-[#111111]"}`}
        >
          Studio
        </a>

        <nav className="flex min-w-0 items-center gap-x-5 overflow-x-auto whitespace-nowrap pr-2 md:flex-wrap md:gap-x-6 md:gap-y-2 md:overflow-visible md:pr-0">
          <a href="/articles" className={linkClass("articles")}>
            Articles
          </a>
          <a href="/studio/apps" className={linkClass("apps")}>
            <span className="md:hidden">Apps</span>
            <span className="hidden md:inline">Studio Apps</span>
          </a>
          <a href="/studio/directory" className={linkClass("directory")}>
            <span className="md:hidden">Directory</span>
            <span className="hidden md:inline">Scenic Directory</span>
          </a>
        </nav>

        <form
          action="/search"
          method="get"
          className="relative hidden w-full md:block md:w-[15rem]"
        >
          <Search className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-white/46" : "text-[#5d5851]"}`} />
          <input
            name="q"
            type="search"
            placeholder="Search studio"
            className={`h-9 w-full rounded-full border-0 pl-9 pr-4 text-[0.9rem] font-medium tracking-[-0.02em] outline-none focus:ring-2 focus:ring-[#6f2dff]/30 ${
              isDark
                ? "bg-white/[0.08] text-white placeholder:text-white/46 focus:bg-white/[0.12]"
                : "bg-[#e5e3dc] text-[#111111] placeholder:text-[#5d5851] focus:bg-[#fbfaf7]"
            }`}
          />
        </form>
      </div>
    </div>
  );
}
