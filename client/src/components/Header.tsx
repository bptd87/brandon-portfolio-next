"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "wouter";

import HomePaletteControl from "@/components/HomePaletteControl";
import { useHomeDocumentTheme, useHomeTheme } from "@/lib/homeTheme";

const UNICORN_ICON_SRC = "/images/site-assets/brand/unicorn.svg";
const NAV_BUTTON_TOP = "top-[clamp(1.25rem,2.4vw,2.25rem)]";
const NAV_BUTTON_RIGHT = "calc(clamp(1.25rem, 2.4vw, 2.25rem) - (100vw - 100%))";

export default function Header() {
  const pathname = usePathname() || "/";
  const { homeTheme, homeThemeIndex, setHomeThemeIndex } = useHomeTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isPortfolioQuickView, setIsPortfolioQuickView] = useState(false);
  const isNavigationRoute = pathname === "/navigation";
  const targetHref = isNavigationRoute ? "/" : "/navigation";
  const label = isNavigationRoute ? "Return home" : "Open navigation";

  useHomeDocumentTheme(homeTheme);

  useEffect(() => {
    setIsPortfolioQuickView(
      new URLSearchParams(window.location.search).get("quickView") === "1"
    );
  }, []);

  if (isPortfolioQuickView) return null;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0">
        <Link
          href={targetHref}
          aria-label={label}
          className={`pointer-events-auto fixed ${NAV_BUTTON_TOP} flex h-12 w-12 items-center justify-center rounded-full border border-black/10 shadow-[0_1.1rem_2.8rem_rgba(0,0,0,0.22)] transition-[background-color,box-shadow,transform] duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4`}
          style={{
            right: NAV_BUTTON_RIGHT,
            backgroundColor: homeTheme.controlBg,
            color: homeTheme.controlInk,
          }}
        >
          <span
            aria-hidden="true"
            className="block h-[72%] w-[72%]"
            style={{
              backgroundColor: homeTheme.controlInk,
              WebkitMaskImage: `url(${UNICORN_ICON_SRC})`,
              maskImage: `url(${UNICORN_ICON_SRC})`,
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
        </Link>
      </header>

      <HomePaletteControl
        activeTheme={homeTheme}
        activeThemeIndex={homeThemeIndex}
        isOpen={paletteOpen}
        onOpenChange={setPaletteOpen}
        onThemeChange={(index) => {
          setHomeThemeIndex(index);
          setPaletteOpen(false);
        }}
      />
    </>
  );
}
