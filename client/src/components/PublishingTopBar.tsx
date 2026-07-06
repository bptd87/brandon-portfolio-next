"use client";

import { HOME_DISPLAY_FONT, useHomeTheme } from "@/lib/homeTheme";

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

  return (
    <nav
      aria-label="Studio section navigation"
      className="absolute left-[clamp(1.25rem,2.4vw,2.25rem)] top-[clamp(1.25rem,2.4vw,2.25rem)] z-[60] max-w-[calc(100vw-7rem)] overflow-visible"
      style={{ fontFamily: HOME_DISPLAY_FONT }}
    >
      <div className="flex max-w-full flex-wrap items-center gap-2 overflow-visible">
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
    </nav>
  );
}
