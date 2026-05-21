"use client";

import { Search } from "lucide-react";

type PublishingTopBarProps = {
  active: "articles" | "tutorials";
};

export function PublishingTopBar({ active }: PublishingTopBarProps) {
  const linkClass = (key: PublishingTopBarProps["active"]) =>
    `text-[0.95rem] tracking-[-0.025em] transition-colors ${
      active === key ? "text-[#111111]" : "text-[#777169] hover:text-[#111111]"
    }`;

  return (
    <div className="border-b border-black/[0.06] bg-[#f7f6f2]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-[76rem] flex-col gap-3 px-[clamp(1.5rem,5vw,6rem)] py-3 md:flex-row md:items-center md:justify-between md:gap-8">
        <a
          href="/studio"
          className="text-[1.35rem] font-semibold leading-none tracking-[-0.045em] text-[#111111]"
        >
          Publish
        </a>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
          <nav className="flex items-center gap-6">
            <a href="/articles" className={linkClass("articles")}>
              Articles
            </a>
            <a href="/studio/tutorials" className={linkClass("tutorials")}>
              Tutorials
            </a>
          </nav>

          <form
            action="/search"
            method="get"
            className="relative w-full md:w-[15rem]"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5d5851]" />
            <input
              name="q"
              type="search"
              placeholder="Search publish"
              className="h-9 w-full rounded-full border-0 bg-black/[0.055] pl-9 pr-4 text-[0.9rem] font-medium tracking-[-0.02em] text-[#111111] outline-none placeholder:text-[#5d5851] focus:bg-white focus:ring-2 focus:ring-[#7b2cff]/30"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
