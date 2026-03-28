export const DEFAULT_SITE_URL = "https://www.brandonptdavis.com";

function normalizeSiteUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const withProtocol =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

  return withProtocol.replace(/\/+$/, "");
}

export function getConfiguredSiteUrl() {
  const candidates = [
    process.env.SITE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL,
    process.env.VERCEL_URL,
    DEFAULT_SITE_URL,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string" || !candidate.trim()) continue;

    const normalized = normalizeSiteUrl(candidate);
    if (normalized) return normalized;
  }

  return DEFAULT_SITE_URL;
}

export function getSiteUrlFromHost(host?: string | null) {
  if (typeof host === "string" && host.trim()) {
    return normalizeSiteUrl(host);
  }

  return getConfiguredSiteUrl();
}
