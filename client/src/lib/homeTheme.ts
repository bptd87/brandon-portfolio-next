"use client";

import { useEffect, useLayoutEffect, useState } from "react";

export const HOME_SCENIC_DESIGN_BLUE = "#496784";
export const HOME_REFERENCE_WHITE = "#ffffff";
export const HOME_REFERENCE_BLACK = "#2c2c2c";
export const HOME_REFERENCE_GREY = "#cbcbcb";
export const HOME_DISPLAY_FONT =
  '"League Gothic", "Bebas Neue", Anton, "Futura Now Headline", "Futura Condensed Extra Bold", "Futura Condensed", Impact, "Arial Narrow", "Arial Black", ui-sans-serif, system-ui, sans-serif';
export const HOME_BODY_FONT =
  '"Space Grotesk", Inter, "Inter Tight", "Avenir Next", Avenir, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export type HomeColorTheme = {
  name: string;
  bg: string;
  ink: string;
  muted: string;
  ghost: string;
  accent: string;
  accentSoft: string;
  controlBg: string;
  controlInk: string;
  footerBg: string;
  footerDisplay: string;
  footerInk: string;
};

export const HOME_COLOR_THEMES: HomeColorTheme[] = [
  {
    name: "White",
    bg: HOME_REFERENCE_WHITE,
    ink: HOME_REFERENCE_BLACK,
    muted: "rgba(44,44,44,0.48)",
    ghost: HOME_REFERENCE_GREY,
    accent: HOME_REFERENCE_BLACK,
    accentSoft: "rgba(44,44,44,0.08)",
    controlBg: HOME_REFERENCE_BLACK,
    controlInk: HOME_REFERENCE_WHITE,
    footerBg: HOME_REFERENCE_GREY,
    footerDisplay: "rgba(44,44,44,0.7)",
    footerInk: HOME_REFERENCE_BLACK,
  },
  {
    name: "Cream",
    bg: "#e9e1cf",
    ink: HOME_REFERENCE_BLACK,
    muted: "rgba(255,111,0,0.78)",
    ghost: "#ff6f00",
    accent: "#ff6f00",
    accentSoft: "rgba(255,111,0,0.12)",
    controlBg: "#ff6f00",
    controlInk: "#20180f",
    footerBg: "#ded4bf",
    footerDisplay: "#ff6f00",
    footerInk: HOME_REFERENCE_BLACK,
  },
  {
    name: "Blue",
    bg: "#1385f6",
    ink: "#a8f4ff",
    muted: "rgba(3,41,118,0.72)",
    ghost: "#052f8b",
    accent: "#a8f4ff",
    accentSoft: "rgba(168,244,255,0.14)",
    controlBg: "#052f8b",
    controlInk: "#a8f4ff",
    footerBg: "#0d6ed5",
    footerDisplay: "#052f8b",
    footerInk: "#a8f4ff",
  },
  {
    name: "Green",
    bg: "#35ad62",
    ink: "#baff00",
    muted: "rgba(0,87,37,0.72)",
    ghost: "#005725",
    accent: "#baff00",
    accentSoft: "rgba(186,255,0,0.14)",
    controlBg: "#003f1c",
    controlInk: "#baff00",
    footerBg: "#2d9655",
    footerDisplay: "#baff00",
    footerInk: "#003f1c",
  },
  {
    name: "Purple",
    bg: "#3f0050",
    ink: "#ffe3ff",
    muted: "rgba(222,48,255,0.78)",
    ghost: "#dc30ff",
    accent: "#dc30ff",
    accentSoft: "rgba(220,48,255,0.16)",
    controlBg: "#dc30ff",
    controlInk: "#ffe3ff",
    footerBg: "#2f003e",
    footerDisplay: "#dc30ff",
    footerInk: "#ffe3ff",
  },
];

const HOME_CSS_THEME: HomeColorTheme = {
  name: "Stored",
  bg: "var(--home-theme-bg, #ffffff)",
  ink: "var(--home-theme-ink, #2c2c2c)",
  muted: "var(--home-theme-muted, rgba(44,44,44,0.62))",
  ghost: "var(--home-theme-ghost, #cbcbcb)",
  accent: "var(--home-theme-accent, #2c2c2c)",
  accentSoft: "var(--home-theme-accent-soft, rgba(44,44,44,0.08))",
  controlBg: "var(--home-theme-control-bg, #2c2c2c)",
  controlInk: "var(--home-theme-control-ink, #ffffff)",
  footerBg: "var(--home-theme-footer-bg, #cbcbcb)",
  footerDisplay: "var(--home-theme-footer-display, rgba(44,44,44,0.7))",
  footerInk: "var(--home-theme-footer-ink, #2c2c2c)",
};

const HOME_THEME_STORAGE_KEY = "brandon-home-theme-index";
const HOME_THEME_VERSION_KEY = "brandon-home-theme-version";
const HOME_THEME_VERSION = "2";
const HOME_THEME_CHANGE_EVENT = "brandon-home-theme-change";

type HomeThemeChangeEvent = CustomEvent<{ themeIndex: number }>;

function getStoredHomeThemeIndex() {
  if (typeof window === "undefined") return 0;

  const storedValue = window.localStorage.getItem(HOME_THEME_STORAGE_KEY);
  let parsedValue = storedValue ? Number.parseInt(storedValue, 10) : 0;

  if (Number.isNaN(parsedValue)) return 0;

  if (window.localStorage.getItem(HOME_THEME_VERSION_KEY) !== HOME_THEME_VERSION) {
    const legacyThemeMap = [0, 2, 1, 3, 4];
    parsedValue = legacyThemeMap[parsedValue] ?? 0;
    window.localStorage.setItem(HOME_THEME_STORAGE_KEY, String(parsedValue));
    window.localStorage.setItem(HOME_THEME_VERSION_KEY, HOME_THEME_VERSION);
  }

  return Math.min(Math.max(parsedValue, 0), HOME_COLOR_THEMES.length - 1);
}

export function useHomeTheme() {
  const [homeThemeIndex, setHomeThemeIndex] = useState(0);
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
      setHomeThemeIndex(Math.min(Math.max(themeIndex, 0), HOME_COLOR_THEMES.length - 1));
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
    html.style.colorScheme = "light";
  }, [homeTheme]);
}
