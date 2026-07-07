"use client";

import { type CSSProperties } from "react";
import { HOME_BODY_FONT } from "@/lib/homeTheme";

type StudioToolThemeOptions = {
  accent?: string;
  accentInk?: string;
};

export const STUDIO_TOOL_BASE = {
  bg: "#f7f3eb",
  ink: "#17130d",
  muted: "rgba(23, 19, 13, 0.58)",
  border: "rgba(23, 19, 13, 0.14)",
  panel: "#fffaf2",
  panelStrong: "#ebe3d5",
  controlBg: "#17130d",
  controlInk: "#fffaf2",
};

export function useStudioToolTheme(options: StudioToolThemeOptions = {}) {
  const accent = options.accent || STUDIO_TOOL_BASE.controlBg;
  const accentInk = options.accentInk || STUDIO_TOOL_BASE.controlInk;

  const studioToolStyle = {
    "--studio-tool-bg": STUDIO_TOOL_BASE.bg,
    "--studio-tool-ink": STUDIO_TOOL_BASE.ink,
    "--studio-tool-muted": STUDIO_TOOL_BASE.muted,
    "--studio-tool-border": STUDIO_TOOL_BASE.border,
    "--studio-tool-panel": STUDIO_TOOL_BASE.panel,
    "--studio-tool-panel-strong": STUDIO_TOOL_BASE.panelStrong,
    "--studio-tool-control-bg": accent,
    "--studio-tool-control-ink": accentInk,
    "--studio-tool-accent": accent,
    "--studio-tool-accent-ink": accentInk,
    backgroundColor: STUDIO_TOOL_BASE.bg,
    color: STUDIO_TOOL_BASE.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;

  return { studioToolStyle };
}
