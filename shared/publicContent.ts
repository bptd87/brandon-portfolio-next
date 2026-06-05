import {
  ASSISTANT_SCENIC_DESIGN_PATH,
  assistantScenicDesignEntries,
} from "./localAssistantScenic";

export {
  ASSISTANT_SCENIC_DESIGN_PATH,
  ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION,
  ASSISTANT_SCENIC_DESIGN_SEO_TITLE,
  assistantScenicDesignEntries,
  assistantScenicYearRange,
  type AssistantScenicDesignEntry,
} from "./localAssistantScenic";
export const VOYAGELA_ARTICLE_SLUG = "voyagela-rising-stars-interview";
export const VOYAGELA_EXTERNAL_URL =
  "https://voyagela.com/interview/rising-stars-meet-brandon-pt-davis-of-irvine-ca/";
export const VOYAGELA_NEWS_SLUG = "featured-voyagela-rising-stars-interview";
export const VOYAGELA_PROFILE_TITLE = "VoyageLA: Rising Stars Interview";
export const SKENE_INVISIBLE_DESIGN_EXTERNAL_URL =
  "https://skene.pub/brandon-pt-davis-invisible-design/";
export const SKENE_INVISIBLE_DESIGN_PROFILE_TITLE = "Skene: Invisible Design";

export const PROFILE_ARTICLE_LINKS = [
  {
    href: VOYAGELA_EXTERNAL_URL,
    previewLabel: "VoyageLA",
    title: VOYAGELA_PROFILE_TITLE,
    description:
      "A public profile on Brandon's scenic design practice, career development, and creative process.",
  },
  {
    href: SKENE_INVISIBLE_DESIGN_EXTERNAL_URL,
    previewLabel: "Skene",
    title: SKENE_INVISIBLE_DESIGN_PROFILE_TITLE,
    description:
      "A Skene feature connected to Brandon's scenic design practice and the often unseen work behind theatrical environments.",
  },
] as const;

export interface LegacyCanonicalDestination {
  canonicalPath: string;
  displayPath: string;
  destinationLabel: string;
  destinationTitle: string;
}

const legacyCanonicalDestinations = new Map<string, LegacyCanonicalDestination>();

for (const entry of assistantScenicDesignEntries) {
  for (const slug of entry.legacyNewsSlugs) {
    legacyCanonicalDestinations.set(slug, {
      canonicalPath: ASSISTANT_SCENIC_DESIGN_PATH,
      displayPath: `${ASSISTANT_SCENIC_DESIGN_PATH}#${entry.anchorId}`,
      destinationLabel: "Assistant Scenic Design",
      destinationTitle: entry.title,
    });
  }
}

legacyCanonicalDestinations.set(VOYAGELA_NEWS_SLUG, {
  canonicalPath: VOYAGELA_EXTERNAL_URL,
  displayPath: VOYAGELA_EXTERNAL_URL,
  destinationLabel: "VoyageLA",
  destinationTitle: VOYAGELA_PROFILE_TITLE,
});

export function getLegacyCanonicalDestination(slug?: string | null): LegacyCanonicalDestination | null {
  if (!slug) return null;
  return legacyCanonicalDestinations.get(slug) || null;
}
