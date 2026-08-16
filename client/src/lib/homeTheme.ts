"use client";

import { useEffect, useLayoutEffect, useState } from "react";

export const HOME_WHITE = "#F7F5EF";
export const HOME_BLACK = "#0D0E0D";
export const HOME_OG_GREEN = "#174D46";
export const HOME_ORANGE = "#D85A28";
export const HOME_DARK_ORANGE = "#A64524";
export const HOME_MIDNIGHT_BLUE = "#22324A";
export const HOME_DISPLAY_FONT =
  '"League Gothic", "Bebas Neue", Anton, "Futura Now Headline", "Futura Condensed Extra Bold", "Futura Condensed", Impact, "Arial Narrow", "Arial Black", ui-sans-serif, system-ui, sans-serif';
export const HOME_BODY_FONT =
  '"Space Grotesk", Inter, "Inter Tight", "Avenir Next", Avenir, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export type HomeColorTheme = {
  name: string;
  colorScheme: "light" | "dark";
  bg: string;
  ink: string;
  muted: string;
  ghost: string;
  accent: string;
  accentSoft: string;
  controlBg: string;
  controlInk: string;
  controlBorder: string;
  footerBg: string;
  footerDisplay: string;
  footerInk: string;
};

export const HOME_COLOR_THEMES: HomeColorTheme[] = [
  {
    name: "White",
    colorScheme: "light",
    bg: HOME_WHITE,
    ink: "#171A18",
    muted: "rgba(23,26,24,0.68)",
    ghost: "#747974",
    accent: HOME_OG_GREEN,
    accentSoft: "rgba(23,77,70,0.11)",
    controlBg: "#E7E2D8",
    controlInk: HOME_OG_GREEN,
    controlBorder: "1px solid transparent",
    footerBg: "#E7E2D8",
    footerDisplay: HOME_OG_GREEN,
    footerInk: "#171A18",
  },
  {
    name: "Black",
    colorScheme: "dark",
    bg: HOME_BLACK,
    ink: "#F0EEE8",
    muted: "rgba(240,238,232,0.66)",
    ghost: "#858781",
    accent: "#D7C7A1",
    accentSoft: "rgba(215,199,161,0.12)",
    controlBg: "#F0EEE8",
    controlInk: HOME_BLACK,
    controlBorder: "1px solid transparent",
    footerBg: "#171918",
    footerDisplay: "#D7C7A1",
    footerInk: "#F0EEE8",
  },
  {
    name: "OG Green",
    colorScheme: "dark",
    bg: HOME_OG_GREEN,
    ink: "#F3EEDF",
    muted: "rgba(243,238,223,0.68)",
    ghost: "#A9BFB9",
    accent: HOME_ORANGE,
    accentSoft: "rgba(216,90,40,0.18)",
    controlBg: "#F3EEDF",
    controlInk: HOME_OG_GREEN,
    controlBorder: "1px solid transparent",
    footerBg: "#103A35",
    footerDisplay: "#F1A070",
    footerInk: "#F3EEDF",
  },
  {
    name: "Orange",
    colorScheme: "light",
    bg: HOME_ORANGE,
    ink: "#1A1411",
    muted: "rgba(26,20,17,0.7)",
    ghost: "#673421",
    accent: "#F8E9D2",
    accentSoft: "rgba(248,233,210,0.2)",
    controlBg: HOME_DARK_ORANGE,
    controlInk: "#0D0E0D",
    controlBorder: "1px solid transparent",
    footerBg: "#241B17",
    footerDisplay: "#F1A070",
    footerInk: "#F8E9D2",
  },
  {
    name: "Midnight Blue",
    colorScheme: "dark",
    bg: HOME_MIDNIGHT_BLUE,
    ink: "#F2EEE6",
    muted: "rgba(242,238,230,0.68)",
    ghost: "#A8B4C4",
    accent: "#D3A978",
    accentSoft: "rgba(211,169,120,0.14)",
    controlBg: "#F2EEE6",
    controlInk: HOME_MIDNIGHT_BLUE,
    controlBorder: "1px solid transparent",
    footerBg: "#182435",
    footerDisplay: "#D3A978",
    footerInk: "#F2EEE6",
  },
];

const HOME_CSS_THEME: HomeColorTheme = {
  name: "Stored",
  colorScheme: "dark",
  bg: "var(--home-theme-bg, #0D0E0D)",
  ink: "var(--home-theme-ink, #F0EEE8)",
  muted: "var(--home-theme-muted, rgba(240,238,232,0.66))",
  ghost: "var(--home-theme-ghost, #858781)",
  accent: "var(--home-theme-accent, #D7C7A1)",
  accentSoft: "var(--home-theme-accent-soft, rgba(215,199,161,0.12))",
  controlBg: "var(--home-theme-control-bg, #F0EEE8)",
  controlInk: "var(--home-theme-control-ink, #0D0E0D)",
  controlBorder: "1px solid transparent",
  footerBg: "var(--home-theme-footer-bg, #171918)",
  footerDisplay: "var(--home-theme-footer-display, #D7C7A1)",
  footerInk: "var(--home-theme-footer-ink, #F0EEE8)",
};

const HOME_THEME_STORAGE_KEY = "brandon-home-theme-index";
const HOME_THEME_VERSION_KEY = "brandon-home-theme-version";
const HOME_THEME_VERSION = "6";
const HOME_THEME_CHANGE_EVENT = "brandon-home-theme-change";

type HomeThemeChangeEvent = CustomEvent<{ themeIndex: number }>;

function getStoredHomeThemeIndex() {
  if (typeof window === "undefined") return 1;

  const storedValue = window.localStorage.getItem(HOME_THEME_STORAGE_KEY);
  let parsedValue = storedValue ? Number.parseInt(storedValue, 10) : 1;

  if (Number.isNaN(parsedValue)) return 1;

  if (
    window.localStorage.getItem(HOME_THEME_VERSION_KEY) !== HOME_THEME_VERSION
  ) {
    parsedValue = 1;
    window.localStorage.setItem(HOME_THEME_STORAGE_KEY, String(parsedValue));
    window.localStorage.setItem(HOME_THEME_VERSION_KEY, HOME_THEME_VERSION);
  }

  return Math.min(Math.max(parsedValue, 0), HOME_COLOR_THEMES.length - 1);
}

export function useHomeTheme() {
  const [homeThemeIndex, setHomeThemeIndex] = useState(1);
  const [hasLoadedStoredTheme, setHasLoadedStoredTheme] = useState(false);

  useEffect(() => {
    setHomeThemeIndex(getStoredHomeThemeIndex());
    setHasLoadedStoredTheme(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredTheme || typeof window === "undefined") return;
    window.localStorage.setItem(HOME_THEME_STORAGE_KEY, String(homeThemeIndex));
    window.localStorage.setItem(HOME_THEME_VERSION_KEY, HOME_THEME_VERSION);
    window.dispatchEvent(
      new CustomEvent(HOME_THEME_CHANGE_EVENT, {
        detail: { themeIndex: homeThemeIndex },
      })
    );
  }, [hasLoadedStoredTheme, homeThemeIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleThemeChange = (event: Event) => {
      const themeIndex = (event as HomeThemeChangeEvent).detail?.themeIndex;
      if (typeof themeIndex !== "number") return;
      setHomeThemeIndex(
        Math.min(Math.max(themeIndex, 0), HOME_COLOR_THEMES.length - 1)
      );
    };

    window.addEventListener(HOME_THEME_CHANGE_EVENT, handleThemeChange);

    return () => {
      window.removeEventListener(HOME_THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, []);

  return {
    homeTheme: hasLoadedStoredTheme
      ? HOME_COLOR_THEMES[homeThemeIndex] || HOME_COLOR_THEMES[0]
      : HOME_CSS_THEME,
    homeThemeIndex,
    setHomeThemeIndex,
  };
}

export function useHomeDocumentTheme(homeTheme: HomeColorTheme) {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const setThemeVariable = (name: string, value: string) => {
      if (value.trim().startsWith("var(")) return;
      html.style.setProperty(name, value);
    };

    html.style.backgroundColor = homeTheme.bg;
    body.style.backgroundColor = homeTheme.bg;
    setThemeVariable("--home-theme-bg", homeTheme.bg);
    setThemeVariable("--home-theme-ink", homeTheme.ink);
    setThemeVariable("--home-theme-muted", homeTheme.muted);
    setThemeVariable("--home-theme-ghost", homeTheme.ghost);
    setThemeVariable("--home-theme-accent", homeTheme.accent);
    setThemeVariable("--home-theme-accent-soft", homeTheme.accentSoft);
    setThemeVariable("--home-theme-control-bg", homeTheme.controlBg);
    setThemeVariable("--home-theme-control-ink", homeTheme.controlInk);
    setThemeVariable("--home-theme-footer-bg", homeTheme.footerBg);
    setThemeVariable("--home-theme-footer-display", homeTheme.footerDisplay);
    setThemeVariable("--home-theme-footer-ink", homeTheme.footerInk);
    html.style.colorScheme = homeTheme.colorScheme;
  }, [homeTheme]);
}
