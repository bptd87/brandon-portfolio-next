"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

import HomePaletteControl from "@/components/HomePaletteControl";
import { useHomeDocumentTheme, useHomeTheme } from "@/lib/homeTheme";

const NAV_BUTTON_TOP = "top-[clamp(1.25rem,2.4vw,2.25rem)]";
const NAV_BUTTON_RIGHT =
  "calc(clamp(1.25rem, 2.4vw, 2.25rem) - (100vw - 100%))";
const AVATAR_CALM_SRC = "/images/site-assets/brand/brandon-avatar-calm.png";
const AVATAR_SCREAM_SRC = "/images/site-assets/brand/brandon-avatar-scream.png";

export default function Header() {
  const pathname = usePathname() || "/";
  const { homeTheme, homeThemeIndex, setHomeThemeIndex } = useHomeTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isPortfolioQuickView, setIsPortfolioQuickView] = useState<
    boolean | null
  >(null);
  const isNavigationRoute = pathname === "/navigation";
  const targetHref = isNavigationRoute ? "/" : "/navigation";
  const label = isNavigationRoute ? "Return home" : "Open navigation";

  useHomeDocumentTheme(homeTheme);

  useEffect(() => {
    setIsPortfolioQuickView(
      new URLSearchParams(window.location.search).get("quickView") === "1"
    );
  }, []);

  if (isPortfolioQuickView !== false) return null;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0">
        <Link
          href={targetHref}
          aria-label={label}
          className={`home-avatar-control pointer-events-auto fixed ${NAV_BUTTON_TOP} flex h-12 w-12 items-center justify-center overflow-hidden rounded-full shadow-[0_0.8rem_2rem_rgba(0,0,0,0.2)] transition-transform motion-safe:animate-[home-palette-idle_2.4s_cubic-bezier(0.45,0,0.2,1)_infinite] hover:scale-105 hover:[animation-play-state:paused] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/45`}
          style={{
            right: NAV_BUTTON_RIGHT,
            backgroundColor: homeTheme.controlBg,
            color: homeTheme.controlInk,
            border: homeTheme.controlBorder,
            boxShadow: "0 0.8rem 2rem rgba(0,0,0,0.2)",
          }}
        >
          <span aria-hidden="true" className="site-avatar">
            <span
              className="site-avatar-image site-avatar-image--calm"
              style={
                { "--avatar-src": `url(${AVATAR_CALM_SRC})` } as CSSProperties
              }
            />
            <span
              className="site-avatar-image site-avatar-image--scream"
              style={
                { "--avatar-src": `url(${AVATAR_SCREAM_SRC})` } as CSSProperties
              }
            />
          </span>
        </Link>
      </header>

      <HomePaletteControl
        activeTheme={homeTheme}
        activeThemeIndex={homeThemeIndex}
        isOpen={paletteOpen}
        onOpenChange={setPaletteOpen}
        onThemeChange={index => {
          setHomeThemeIndex(index);
          setPaletteOpen(false);
        }}
      />
    </>
  );
}
