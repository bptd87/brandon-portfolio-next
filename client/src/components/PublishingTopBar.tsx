"use client";

import { HOME_DISPLAY_FONT, useHomeTheme } from "@/lib/homeTheme";
import { ChevronDown } from "lucide-react";

type PublishingTopBarProps = {
  active?: "articles" | "apps" | "directory";
  tone?: "light" | "dark" | "white";
};

export function PublishingTopBar({ active, tone = "light" }: PublishingTopBarProps) {
  const { homeTheme } = useHomeTheme();

  const navItems = [
    { key: undefined, href: "/studio", label: "Studio" },
    { key: "articles" as const, href: "/articles", label: "Articles" },
    { key: "apps" as const, href: "/studio/apps", label: "Apps" },
    { key: "directory" as const, href: "/studio/directory", label: "Directory" },
  ];
  const activeItem = navItems.find((item) => (item.key ? active === item.key : !active)) || navItems[0];

  return (
    <nav
      aria-label="Studio section navigation"
      className="absolute left-[clamp(1.25rem,2.4vw,2.25rem)] top-[clamp(1.25rem,2.4vw,2.25rem)] z-[60] max-w-[calc(100vw-7rem)] overflow-visible"
      style={{ fontFamily: HOME_DISPLAY_FONT }}
    >
      <div className="hidden max-w-full flex-wrap items-center gap-2 overflow-visible sm:flex">
        {navItems.map((item) => {
          const isActive = item.key ? active === item.key : !active;

          return (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-[0.75rem] font-black uppercase leading-none tracking-[0.04em] transition-[background-color,color,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              style={{
                backgroundColor: isActive ? homeTheme.controlBg : homeTheme.accentSoft,
                color: isActive ? homeTheme.controlInk : homeTheme.muted,
              }}
            >
              {item.label}
            </a>
          );
        })}
      </div>

      <details className="group relative block w-36 max-w-[calc(100vw-8rem)] sm:hidden">
        <summary
          className="flex h-9 cursor-pointer list-none items-center justify-between rounded-full px-3.5 text-[0.72rem] font-black uppercase leading-none tracking-[0.02em] shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-transform active:scale-[0.98] [&::-webkit-details-marker]:hidden"
          style={{
            backgroundColor: homeTheme.controlBg,
            color: homeTheme.controlInk,
          }}
        >
          <span>{activeItem.label}</span>
          <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" strokeWidth={3} aria-hidden="true" />
        </summary>
        <div
          className="absolute left-0 top-[calc(100%+0.45rem)] w-full overflow-hidden rounded-[1.15rem] p-1 shadow-[0_14px_32px_rgba(0,0,0,0.16)]"
          style={{
            backgroundColor: homeTheme.controlBg,
            color: homeTheme.controlInk,
          }}
        >
          {navItems.map((item) => {
            const isActive = item.key ? active === item.key : !active;

            return (
              <a
                key={item.href}
                href={item.href}
                className="block rounded-full px-3 py-2 text-[0.7rem] font-black uppercase leading-none tracking-[0.02em] no-underline transition-opacity hover:opacity-70"
                style={{
                  color: homeTheme.controlInk,
                  opacity: isActive ? 1 : 0.62,
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </details>
    </nav>
  );
}
