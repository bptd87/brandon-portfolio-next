"use client";

import { usePathname } from "next/navigation";
import { Link } from "wouter";

import { HOME_DISPLAY_FONT, useHomeTheme } from "@/lib/homeTheme";

type AboutNavProps = {
  tone?: "light" | "dark";
};

export default function AboutNav({ tone = "light" }: AboutNavProps) {
  const pathname = usePathname() || "/";
  const isDark = tone === "dark";
  const { homeTheme } = useHomeTheme();

  const navItems = [
    { path: "/about", label: "Profile" },
    { path: "/resume", label: "Resume" },
    { path: "/creative-statement", label: "Creative" },
    { path: "/about/teaching", label: "Teaching", aliases: ["/teaching-philosophy", "/about/philosophy"] },
  ];

  const linkClass =
    "inline-flex h-10 shrink-0 items-center justify-center rounded-full border px-4 text-[0.75rem] font-black uppercase leading-none tracking-[0.04em] transition-[background-color,color,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30";

  return (
    <nav
      aria-label="About section navigation"
      className="absolute left-[clamp(1.25rem,2.4vw,2.25rem)] top-[clamp(1.25rem,2.4vw,2.25rem)] z-[60] max-w-[calc(100vw-7rem)] overflow-visible"
      style={{ fontFamily: HOME_DISPLAY_FONT }}
    >
      <div className="flex max-w-full flex-wrap items-center gap-2 overflow-visible">
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            item.aliases?.includes(pathname);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={linkClass}
              style={{
                backgroundColor: isActive
                  ? homeTheme.controlBg
                  : isDark
                    ? "rgba(255,255,255,0.14)"
                    : homeTheme.accentSoft,
                color: isActive
                  ? homeTheme.controlInk
                  : isDark
                    ? "rgba(255,255,255,0.74)"
                    : homeTheme.ink,
                borderColor: isActive ? "transparent" : homeTheme.ghost,
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
