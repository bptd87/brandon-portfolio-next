"use client";

import { useEffect, useState } from "react";

export const HOME_SCENIC_DESIGN_BLUE = "#496784";
export const HOME_REFERENCE_WHITE = "#ffffff";
export const HOME_REFERENCE_BLACK = "#2c2c2c";
export const HOME_REFERENCE_GREY = "#cbcbcb";
export const HOME_DISPLAY_FONT =
  '"Futura Now Headline", "Futura Condensed Extra Bold", "Futura Condensed", Futura, Impact, "Arial Narrow", "Arial Black", ui-sans-serif, system-ui, sans-serif';
export const HOME_BODY_FONT =
  'Inter, "Inter Tight", "Avenir Next", Avenir, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

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
    muted: "rgba(44,44,44,0.62)",
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
    name: "Blue",
    bg: HOME_SCENIC_DESIGN_BLUE,
    ink: "#f7f7f2",
    muted: "rgba(247,247,242,0.58)",
    ghost: "rgba(247,247,242,0.22)",
    accent: "#f7f7f2",
    accentSoft: "rgba(247,247,242,0.16)",
    controlBg: "#063f95",
    controlInk: "#88e7ff",
    footerBg: "#334f68",
    footerDisplay: "rgba(247,247,242,0.68)",
    footerInk: "#f7f7f2",
  },
  {
    name: "Yellow",
    bg: "#d39a24",
    ink: "#17120a",
    muted: "rgba(23,18,10,0.58)",
    ghost: "rgba(23,18,10,0.18)",
    accent: "#17120a",
    accentSoft: "rgba(23,18,10,0.12)",
    controlBg: "#17120a",
    controlInk: "#f2b427",
    footerBg: "#b47b14",
    footerDisplay: "rgba(255,244,216,0.66)",
    footerInk: "#17120a",
  },
  {
    name: "Green",
    bg: "#6f7d59",
    ink: "#f4f0e5",
    muted: "rgba(244,240,229,0.62)",
    ghost: "rgba(244,240,229,0.24)",
    accent: "#f4f0e5",
    accentSoft: "rgba(244,240,229,0.16)",
    controlBg: "#0c5f2e",
    controlInk: "#d9ff00",
    footerBg: "#566541",
    footerDisplay: "rgba(244,240,229,0.66)",
    footerInk: "#f4f0e5",
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
const HOME_THEME_CHANGE_EVENT = "brandon-home-theme-change";

type HomeThemeChangeEvent = CustomEvent<{ themeIndex: number }>;

function getStoredHomeThemeIndex() {
  if (typeof window === "undefined") return 0;

  const storedValue = window.localStorage.getItem(HOME_THEME_STORAGE_KEY);
  const parsedValue = storedValue ? Number.parseInt(storedValue, 10) : 0;

  if (Number.isNaN(parsedValue)) return 0;

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
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlBackground = html.style.backgroundColor;
    const previousBodyBackground = body.style.backgroundColor;
    const previousColorScheme = html.style.colorScheme;

    html.style.backgroundColor = homeTheme.bg;
    body.style.backgroundColor = homeTheme.bg;
    html.style.setProperty("--home-theme-bg", homeTheme.bg);
    html.style.setProperty("--home-theme-ink", homeTheme.ink);
    html.style.setProperty("--home-theme-muted", homeTheme.muted);
    html.style.setProperty("--home-theme-ghost", homeTheme.ghost);
    html.style.setProperty("--home-theme-accent", homeTheme.accent);
    html.style.setProperty("--home-theme-accent-soft", homeTheme.accentSoft);
    html.style.setProperty("--home-theme-control-bg", homeTheme.controlBg);
    html.style.setProperty("--home-theme-control-ink", homeTheme.controlInk);
    html.style.setProperty("--home-theme-footer-bg", homeTheme.footerBg);
    html.style.setProperty("--home-theme-footer-display", homeTheme.footerDisplay);
    html.style.setProperty("--home-theme-footer-ink", homeTheme.footerInk);
    html.style.colorScheme = "light";

    return () => {
      html.style.backgroundColor = previousHtmlBackground;
      body.style.backgroundColor = previousBodyBackground;
      html.style.colorScheme = previousColorScheme;
    };
  }, [homeTheme]);
}
