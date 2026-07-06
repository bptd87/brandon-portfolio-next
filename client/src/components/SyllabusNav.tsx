"use client";

import { usePathname } from "next/navigation";
import { Link } from "wouter";
import { HOME_DISPLAY_FONT, useHomeTheme } from "@/lib/homeTheme";

const navItems = [
  { path: "/syllabus/experiential-design", label: "Experiential Design" },
  { path: "/syllabus/3d-modeling", label: "3D Modeling" },
];

export default function SyllabusNav() {
  const pathname = usePathname() || "/";
  const { homeTheme } = useHomeTheme();

  return (
    <nav
      aria-label="Syllabus navigation"
      className="relative z-30 px-5 pt-7 sm:px-8 md:px-[clamp(3rem,7vw,7rem)]"
    >
      <div className="mx-auto flex max-w-[88rem] flex-wrap items-center gap-3">
        <Link
          href="/about/teaching"
          className="inline-flex h-10 items-center rounded-full px-4 text-[0.75rem] font-black uppercase leading-none tracking-[0.04em] transition-transform hover:-translate-y-0.5"
          style={{
            backgroundColor: homeTheme.accentSoft,
            color: homeTheme.ink,
            fontFamily: HOME_DISPLAY_FONT,
            fontStretch: "condensed",
          }}
        >
          Teaching
        </Link>

        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="inline-flex h-10 items-center rounded-full px-4 text-[0.75rem] font-black uppercase leading-none tracking-[0.04em] transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: isActive ? homeTheme.controlBg : homeTheme.accentSoft,
                    color: isActive ? homeTheme.controlInk : homeTheme.ink,
                    fontFamily: HOME_DISPLAY_FONT,
                    fontStretch: "condensed",
                  }}
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
