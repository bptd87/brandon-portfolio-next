export type AdminAccentKey = "dashboard" | "projects" | "news" | "articles" | "analytics" | "neutral";

const ACCENT_BY_KEY: Record<AdminAccentKey, string> = {
  dashboard: "var(--accent-brand)",
  projects: "var(--accent-scenic)",
  news: "var(--accent-news)",
  articles: "var(--accent-articles)",
  analytics: "var(--accent-brand)",
  neutral: "var(--primary)"
};

export const ADMIN_PANEL_CLASS = "border border-border/70 bg-muted/25 shadow-sm";

export function getAdminAccentColor(key: AdminAccentKey) {
  return ACCENT_BY_KEY[key];
}

export function getAdminAccentForPath(path: string): AdminAccentKey {
  if (path === "/admin") return "dashboard";
  if (path.startsWith("/admin/projects")) return "projects";
  if (path.startsWith("/admin/news")) return "news";
  if (path.startsWith("/admin/articles")) return "articles";
  if (path.startsWith("/admin/analytics")) return "analytics";
  return "neutral";
}

export function getAdminItemAccent(href: string): AdminAccentKey {
  if (href === "/admin") return "dashboard";
  if (href.startsWith("/admin/projects")) return "projects";
  if (href.startsWith("/admin/rendering-gallery")) return "projects";
  if (href.startsWith("/admin/experiential-gallery")) return "projects";
  if (href.startsWith("/admin/news")) return "news";
  if (href.startsWith("/admin/articles")) return "articles";
  if (href.startsWith("/admin/analytics")) return "analytics";
  return "neutral";
}

export function getAdminAccentStyles(key: AdminAccentKey) {
  const accent = getAdminAccentColor(key);
  const activeText = key === "news" ? "black" : "white";
  return {
    accent,
    active: {
      backgroundColor: accent,
      borderColor: accent,
      color: activeText
    },
    soft: {
      backgroundColor: `color-mix(in oklch, ${accent} 16%, transparent)`,
      borderColor: `color-mix(in oklch, ${accent} 40%, transparent)`,
      color: accent
    }
  };
}
