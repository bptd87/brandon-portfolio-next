import {
  getLocalExperientialProjectBySlug,
  getLocalExperientialSampleBySlug,
  getLocalExperientialSampleHref,
  getLocalRenderingProjectBySlug,
} from "./localPortfolios";
import { getLocalArticleBySlug, getLocalArticles } from "./localArticles";
import { getLocalScenicProjectBySlug, getLocalScenicProjects } from "./localScenicProjects";
import { getLocalCollaborators, getLocalTutorialBySlug } from "./localStudio";

const LEGACY_PROJECT_ALIASES: Record<string, string> = {
  all: "/projects",
  "scenic-design-archive": "/projects",
  "much-ado": "/project/much-ado-about-nothing",
  "park-shop": "/projects/experiential/park-and-shop",
  "park-shop-techncial-drawing": "/projects/experiential/technical-drawing/park-and-shop-technical-drawing",
  "new-swan-venue-model": "/projects/experiential/new-swan-venue-documentation",
  "urinetown-24": "/project/urinetown",
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
  "camera-tool-and-renderingl": "creating-camera-rendering",
  "workspace-in-vectorworks": "installing-workspace-template",
  "vectorworks-user-interface": "navigating-user-interface",
  "2d-edit": "2d-edit-modify-tricks",
  "trim-profiles": "creating-trim-profiles-polyline",
  "2d-drafting-from-a-3d-model": "creating-2d-drafting-from-3d",
  "design-layers": "understanding-design-layers",
  "2d-annotations": "2d-annotations-dimensioning",
  "basics-of-3d-modeling": "3d-modeling-basics",
  "custom-page-layouts": "",
  "scenic-design-studio": "",
};

const LEGACY_TAG_ALIASES: Record<string, string> = {
  "univeristy-of-missouri": "university-of-missouri",
  "new-swan-shakespeare-festival": "new-swan-theatre-festival",
  "south-coast-rep": "south-coast-repertory-theatre",
  career: "career-development",
  scr: "south-coast-repertory-theatre",
};

const LEGACY_COLLABORATOR_ALIASES: Record<string, string> = {
  "andy-hudson": "hudson-waldrop",
  utep: "university-of-texas-el-paso",
};

const LEGACY_ARTICLE_ALIASES: Record<string, string> = {
  "minimalist-theatre-2025": "minimalist-scenic-design-dominating-regional-theatres-in-2025",
  "minimalist-scenic-design-trends": "minimalist-scenic-design-dominating-regional-theatres-in-2025",
  "building-the-language-of-cinema": "the-evolutionof-narrativein-cinema",
  "computer-hardware-guide": "computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care",
  "understanding-computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care":
    "computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care",
  "lighting-styles-in-ai-models-how-lighting-changes-everything": "lighting-styles-in-ai-models",
  "computer-literacy": "empowering-theatre-students-with-computer-literacy",
  "presenting-like-apple": "the-art-of-presenting-theatre-design-a-guide-for-designers",
  "artistic-vision-finding-creative-voice": "artistic-vision-in-scenic-design-finding-my-creative-voice",
  "opera-foundations": "operas-foundations-the-evolution-of-scenic-design-in-opera",
  "video-game-environments": "video-game-environments-lessons-for-scenic-design",
  "vectorworks-rendering-workflow": "what-makes-a-good-scenic-design-rendering",
  "scenic-rendering-principles": "what-makes-a-good-scenic-design-rendering",
  "becoming-a-scenic-designer": "becoming-a-scenic-designer-a-comprehensive-guide",
  "scenic-design-lesson-youre-wasting-my-time": "youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision",
  "romero-set-design": "framing-the-martyr-scenic-design-as-memory-work-in-romero",
  "art-direction-in-film": "building-the-visual-world-art-direction-in-film-television",
  "evolution-of-themed-entertainment":
    "the-evolution-of-themed-entertainment-from-ancient-gardens-to-modern-immersive-experienceses-everything",
  "themed-entertainment-design-studio-ghibli-inspired-immersive-dining-experience-by-theatre-students":
    "studio-ghibli-inspired-immersive-dining-experience",
};

const KNOWN_TAG_SLUGS = new Set(
  [
    ...getLocalArticles().flatMap((article) => (article.tags || []).map((tag) => tag.slug)),
    ...getLocalScenicProjects().flatMap((project) => (project.tags || []).map((tag) => tag.slug)),
  ].filter(Boolean)
);

const KNOWN_COLLABORATOR_SLUGS = new Set(
  getLocalCollaborators().map((collaborator) => collaborator.slug).filter(Boolean)
);

function normalizeLegacySlug(value?: string | null) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/%20/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function resolveLegacyTagPath(rawSlug?: string | null) {
  const normalized = normalizeLegacySlug(rawSlug);
  if (!normalized) return null;

  const slug = LEGACY_TAG_ALIASES[normalized] || normalized;
  return KNOWN_TAG_SLUGS.has(slug) ? `/tags/${slug}` : null;
}

export function resolveLegacyCollaboratorPath(rawSlug?: string | null) {
  const normalized = normalizeLegacySlug(rawSlug);
  if (!normalized) return null;

  const slug = LEGACY_COLLABORATOR_ALIASES[normalized] || normalized;
  return KNOWN_COLLABORATOR_SLUGS.has(slug) ? `/about/collaborators#${slug}` : null;
}

export function resolveLegacyTutorialPath(rawSlug?: string | null) {
  const normalized = normalizeLegacySlug(rawSlug);
  if (!normalized) return null;

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

  return null;
}

export function resolveLegacyArticlePath(rawSlug?: string | null) {
  const normalized = normalizeLegacySlug(rawSlug);
  if (!normalized) return null;

  const slug = LEGACY_ARTICLE_ALIASES[normalized] || normalized;
  return getLocalArticleBySlug(slug) ? `/articles/${slug}` : null;
}

export function resolveLegacyProjectPath(rawSlug?: string | null) {
  const normalized = normalizeLegacySlug(rawSlug);
  if (!normalized) return null;

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

  return null;
}
