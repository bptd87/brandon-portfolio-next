import {
  buildSiteSearchEntries,
  searchSiteIndex,
  type SiteSearchResult,
} from "@shared/siteSearch";

let cachedEntries: ReturnType<typeof buildSiteSearchEntries> | null = null;

function getEntries() {
  if (!cachedEntries) {
    cachedEntries = buildSiteSearchEntries();
  }

  return cachedEntries;
}

export function runLocalSiteSearch(query: string, limit = 24): SiteSearchResult[] {
  return searchSiteIndex(getEntries(), query).slice(0, limit);
}

export function getSiteSearchEntries() {
  return getEntries();
}
