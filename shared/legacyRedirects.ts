import {
  getLocalExperientialProjectBySlug,
  getLocalExperientialSampleBySlug,
  getLocalExperientialSampleHref,
  getLocalRenderingProjectBySlug,
} from "./localPortfolios";
import { getLocalScenicProjectBySlug } from "./localScenicProjects";
import { getLocalTutorialBySlug } from "./localStudio";

const LEGACY_PROJECT_ALIASES: Record<string, string> = {
  all: "/projects/scenic-design",
  "scenic-design-archive": "/projects/scenic-design",
  rab: "/projects/experiential/rendering/rab-activation",
  "red-line-caf": "/projects/experiential/rendering/red-line-cafe",
  lysistrata: "/projects/experiential/technical-drawing/lysistrata-covid-documentation",
  "lysistrata-covid-documentation": "/projects/experiential/technical-drawing/lysistrata-covid-documentation",
  "new-swan-venue-file": "/projects/experiential/technical-drawing/new-swan-venue-documentation",
  "new-swan-venue-docuementation": "/projects/experiential/technical-drawing/new-swan-venue-documentation",
  "first-bank-lollipop-pop-up": "/projects/experiential/first-bank-lollipops",
  "red-bull-jukebox": "/projects/experiential",
  "southside-bethel-baptist-church": "/projects",
  "experiential-96246012-2a71-42d9-85e2-77e5d3bafaae-1-105-c-1771226601949e":
    "/projects/experiential",
  vyobzb: "/projects",
  mzn61y: "/projects",
};

const LEGACY_TUTORIAL_ALIASES: Record<string, string> = {
  "vectorworks-tutorial-understanding-classes": "understanding-classes",
  "basic-tool-palette": "basics-tool-palette",
  "basics-of-textures": "basics-of-textures",
  "resource-manager-basics": "resource-manager-basics",
  "camera-tool-rendering": "creating-camera-rendering",
  "scenic-design-studio": "",
};

const LEGACY_TAG_ALIASES: Record<string, string> = {
  "univeristy-of-missouri": "university-of-missouri",
  "new-swan-shakespeare-festival": "new-swan-theatre-festival",
  "south-coast-rep": "south-coast-repertory-theatre",
};

function normalizeLegacySlug(value?: string | null) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/%20/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function resolveLegacyTagPath(rawSlug?: string | null) {
  const normalized = normalizeLegacySlug(rawSlug);
  if (!normalized) return "/articles";

  const slug = LEGACY_TAG_ALIASES[normalized] || normalized;
  return `/tags/${slug}`;
}

export function resolveLegacyTutorialPath(rawSlug?: string | null) {
  const normalized = normalizeLegacySlug(rawSlug);
  if (!normalized) return "/studio/tutorials";

  const alias = LEGACY_TUTORIAL_ALIASES[normalized];
  if (alias === "") return "/studio/tutorials";
  if (alias) return `/studio/tutorials/${alias}`;

  const withoutPrefix = normalized.replace(/^vectorworks-tutorial-/, "");
  if (getLocalTutorialBySlug(withoutPrefix)) {
    return `/studio/tutorials/${withoutPrefix}`;
  }

  if (getLocalTutorialBySlug(normalized)) {
    return `/studio/tutorials/${normalized}`;
  }

  return "/studio/tutorials";
}

export function resolveLegacyProjectPath(rawSlug?: string | null) {
  const normalized = normalizeLegacySlug(rawSlug);
  if (!normalized) return "/projects";

  const alias = LEGACY_PROJECT_ALIASES[normalized];
  if (alias) return alias;

  if (getLocalScenicProjectBySlug(normalized)) {
    return `/project/${normalized}`;
  }

  if (getLocalRenderingProjectBySlug(normalized)) {
    return `/projects/rendering/${normalized}`;
  }

  if (getLocalExperientialProjectBySlug(normalized)) {
    return `/projects/experiential/${normalized}`;
  }

  for (const category of ["rendering", "technical-drawing", "live-events"] as const) {
    const sample = getLocalExperientialSampleBySlug(category, normalized);
    if (sample) {
      return getLocalExperientialSampleHref(sample);
    }
  }

  return "/projects";
}
