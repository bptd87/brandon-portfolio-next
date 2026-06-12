import {
  generatedLocalCollaborators,
  generatedLocalStudioDirectory,
  generatedLocalTutorials,
} from "./localStudio.generated";
import {
  LEARNING_TUTORIAL_METADATA_BY_SLUG,
  type LearningPortalTag,
} from "./learningPortal";
import { applyBlobMediaManifest } from "./mediaBlob";

export type LocalTutorialResource = {
  title: string;
  url: string;
  type?: string;
};

export type LocalRelatedTutorial = {
  slug: string;
  title: string;
};

export type LocalTutorial = {
  id: number;
  title: string;
  slug: string;
  content?: string | null;
  category?: string | null;
  difficulty?: string | null;
  duration?: number | string | null;
  created_at?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  status?: string | null;
  featured?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  learning_objectives: string[];
  key_concepts: Array<{ title: string; content: string }>;
  pro_tips: string[];
  shortcuts: Array<{ keys: string; action: string }>;
  common_pitfalls: string[];
  transcript: Array<{ time?: string; text: string }>;
  related_resources: LocalTutorialResource[];
  related_tutorials: LocalRelatedTutorial[];
  description?: string | null;
  overview?: string | null;
  video_url?: string | null;
  cover_image?: string | null;
  tags?: LearningPortalTag[];
};

export type LocalCollaborator = {
  id: number;
  name: string;
  slug: string;
  role: string;
  bio?: string | null;
  website?: string | null;
  portfolioUrl?: string | null;
  instagramUrl?: string | null;
  instagramHandle?: string | null;
  coverImage?: string | null;
  gallery?: unknown[];
  status?: string | null;
  featured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type LocalStudioDirectoryEntry = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  url: string;
  location?: string | null;
  cover_image?: string | null;
  status?: string | null;
  featured?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  gallery?: unknown[];
  created_at?: string | null;
  updated_at?: string | null;
  like_count?: number | null;
  click_count?: number | null;
};

const manualCollaborators: LocalCollaborator[] = [
  {
    id: 100001,
    name: "Cody Soper",
    slug: "cody-soper",
    role: "lighting_designer",
    bio: "Lighting designer.",
    website: "http://www.codysoperlighting.com",
    portfolioUrl: "http://www.codysoperlighting.com",
    instagramUrl: null,
    instagramHandle: null,
    coverImage: null,
    gallery: [],
    status: "published",
    featured: false,
    seoTitle: null,
    seoDescription: null,
    seoKeywords: null,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: 178,
    name: "Michael Burke",
    slug: "michael-burke",
    role: "sound_designer",
    bio: "Michael Burke is a producer, audio engineer, songwriter, composer, sound designer, and multi-instrumentalist with over a decade and a half of experience in the music industry. His credits include work with HBO, Lego, and ESPN. He holds an MM in Songwriting from NYU and an MS in Software Development from BU.",
    website: null,
    portfolioUrl: null,
    instagramUrl: "https://www.instagram.com/michael_d_burke/",
    instagramHandle: "michael_d_burke",
    coverImage: null,
    gallery: [],
    status: "published",
    featured: false,
    seoTitle: null,
    seoDescription: null,
    seoKeywords: null,
    createdAt: null,
    updatedAt: null,
  },
];

const normalizeYouTubeThumbnail = (value?: string | null) =>
  typeof value === "string" ? value.replace("/maxresdefault.jpg", "/hqdefault.jpg") : value;

const tutorialMetadataOverrides: Record<string, Partial<LocalTutorial>> = {
  "creating-2d-drafting-from-3d": {
    seo_title: "Vectorworks 2D Drafting from 3D",
  },
  "creating-camera-rendering": {
    seo_title: "Vectorworks Camera Rendering Tutorial",
  },
  "modeling-a-table": {
    seo_title: "Vectorworks Table Modeling Tutorial",
  },
  "creating-24x36-pdfs": {
    seo_title: "Vectorworks 24x36 PDF Export Tutorial",
  },
  "3d-modeling-tools": {
    seo_title: "Vectorworks 3D Modeling Tools",
  },
  "basics-of-textures": {
    seo_title: "Vectorworks Texture Basics",
  },
  "hybrid-symbols": {
    seo_title: "Vectorworks Hybrid Symbols Tutorial",
  },
  "3d-modeling-basics": {
    seo_title: "Vectorworks 3D Modeling Basics",
  },
  "2d-annotations-dimensioning": {
    seo_title: "Vectorworks 2D Annotation Tutorial",
  },
  "resource-manager-basics": {
    seo_title: "Vectorworks Resource Manager Basics",
  },
  "2d-edit-modify-tricks": {
    seo_title: "Vectorworks 2D Edit and Modify Tools",
    key_concepts: [
      {
        title: "MIRROR TOOL",
        content:
          "Creates mirrored geometry across a user-defined axis. Standard mode moves the selected object to the mirrored position, while Duplicate mode creates a reflected copy and leaves the original in place.",
      },
      {
        title: "RESHAPE TOOL",
        content:
          "Edits polygon geometry directly through Move Polygon Handles, Move Edges Parallel, Add Vertex, and Delete Vertex modes. It is the main tool for adjusting existing 2D shapes without redrawing them.",
      },
      {
        title: "OFFSET TOOL",
        content:
          "Creates parallel geometry from a selected object. Offset Distance uses a numerical value, while Offset by Points places the offset visually. The Tool bar controls whether the original is moved or duplicated.",
      },
      {
        title: "SPLIT TOOL",
        content:
          "Divides selected 2D or 3D objects with Line Split, Point Split, or Trim mode. The mode determines whether the tool cuts along a drawn line, a point, or removes geometry in a chosen direction.",
      },
      {
        title: "CONNECT/COMBINE TOOL",
        content:
          "Extends, connects, or combines linework depending on the selected Tool bar mode. The important decision is whether the result should remain separate line segments or become a single joined object.",
      },
      {
        title: "ADD, CLIP, AND INTERSECT SURFACE",
        content:
          "Modify menu commands that use overlapping 2D polygons to create a new 2D shape. Add Surface merges selected shapes, Clip Surface removes one shape from another, and Intersect Surface keeps the overlapping region.",
      },
      {
        title: "DUPLICATE ALONG PATH",
        content:
          "Edit menu command that distributes copies of an object along a straight or curved path with controls for number, fixed distance, offset, centering, and tangency.",
      },
    ],
  },
  "understanding-symbols": {
    seo_title: "Vectorworks Symbols Tutorial",
    description:
      "Learn how 2D symbols behave in Vectorworks, including Resource Manager color coding, placed instances, grouped symbols, page-based symbols, scaling, and symbol definition edits.",
    learning_objectives: [
      "Identify standard, grouped, and page-based 2D symbols in the Resource Manager",
      "Create a symbol from 2D geometry using Modify > Create Symbol or the keyboard shortcut",
      "Understand how a placed symbol instance differs from the stored symbol definition",
      "Scale one symbol instance from the Object Info palette without changing the definition",
      "Edit a symbol definition to update linked instances",
      "Recognize when a grouped symbol converts to an independent group after placement",
    ],
    key_concepts: [
      {
        title: "2D SYMBOL",
        content:
          "A reusable symbol made from 2D geometry. The Resource Manager marks these symbols with a small 2, and the tutorial uses simple square symbols to demonstrate placement, scaling, and editing behavior.",
      },
      {
        title: "SYMBOL INSTANCE",
        content:
          "A placed occurrence of a symbol in the drawing. Scaling an instance from the Object Info palette changes that placement, but it does not rewrite the symbol definition.",
      },
      {
        title: "SYMBOL DEFINITION",
        content:
          "The stored source geometry behind linked symbol instances. Editing the definition changes linked instances together, which is why definition edits should be intentional.",
      },
      {
        title: "GROUPED SYMBOL",
        content:
          "A symbol shown in blue in the Resource Manager. When placed, it converts into a group, so editing one placed group does not update another placed group.",
      },
      {
        title: "PAGE-BASED SYMBOL",
        content:
          "A symbol shown in green in the Resource Manager. It responds to page scale and is useful for documentation graphics that need to stay readable on sheets.",
      },
    ],
  },
  "creating-trim-profiles-polyline": {
    seo_title: "Vectorworks Trim Profiles with Polyline",
  },
  "sheet-layers": {
    seo_title: "Vectorworks Sheet Layers Tutorial",
  },
  "basics-tool-palette": {
    seo_title: "Vectorworks Tool Palette Basics",
  },
  "installing-workspace-template": {
    seo_title: "Vectorworks Workspace Template Setup",
  },
  "understanding-design-layers": {
    seo_title: "Vectorworks Design Layers Tutorial",
  },
  "understanding-classes": {
    seo_title: "Vectorworks Classes Tutorial",
    related_tutorials: [
      {
        slug: "navigating-user-interface",
        title: "Vectorworks Tutorial: Navigating the User Interface",
      },
      {
        slug: "understanding-design-layers",
        title: "Vectorworks Tutorial: Understanding Design Layers",
      },
      {
        slug: "basics-tool-palette",
        title: "Vectorworks Tutorial: Basics Tool Palette",
      },
    ],
  },
  "navigating-user-interface": {
    seo_title: "Vectorworks Interface Tutorial",
    related_tutorials: [
      {
        slug: "understanding-classes",
        title: "Vectorworks Tutorial: Understanding Classes",
      },
      {
        slug: "basics-tool-palette",
        title: "Vectorworks Tutorial: Basics Tool Palette",
      },
      {
        slug: "understanding-design-layers",
        title: "Vectorworks Tutorial: Understanding Design Layers",
      },
    ],
  },
};

const applyTutorialMetadataOverride = (tutorial: LocalTutorial): LocalTutorial => {
  const articleMetadata = LEARNING_TUTORIAL_METADATA_BY_SLUG[tutorial.slug];
  const override = tutorialMetadataOverrides[tutorial.slug];
  if (!articleMetadata && !override) return tutorial;

  return {
    ...tutorial,
    ...articleMetadata,
    ...override,
    cover_image: override?.cover_image ?? tutorial.cover_image,
    tags: override?.tags ?? articleMetadata?.tags ?? tutorial.tags,
  };
};

export function getLocalTutorials() {
  return applyBlobMediaManifest(generatedLocalTutorials as LocalTutorial[]).map((tutorial) =>
    applyTutorialMetadataOverride({
      ...tutorial,
      cover_image: normalizeYouTubeThumbnail(tutorial.cover_image),
    })
  );
}

export function getLocalTutorialBySlug(slug?: string | null) {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  if (!normalizedSlug) return null;
  return getLocalTutorials().find((tutorial) => tutorial.slug === normalizedSlug) || null;
}

export function getLocalCollaborators() {
  const generated = applyBlobMediaManifest(generatedLocalCollaborators as LocalCollaborator[]);
  const merged = [...generated];

  for (const collaborator of manualCollaborators) {
    const existingIndex = merged.findIndex((item) => item.slug === collaborator.slug);
    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...collaborator,
      };
    } else {
      merged.push(collaborator);
    }
  }

  return merged;
}

const normalizeCollaboratorName = (value?: string | null) =>
  String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s\u00A0]+/g, " ")
    .trim()
    .toLowerCase();

export function getLocalCollaboratorByName(name?: string | null) {
  const normalizedName = normalizeCollaboratorName(name);
  if (!normalizedName) return null;

  return (
    getLocalCollaborators().find(
      (collaborator) => normalizeCollaboratorName(collaborator.name) === normalizedName
    ) || null
  );
}

export function getLocalCollaboratorPortfolioUrlByName(name?: string | null) {
  const collaborator = getLocalCollaboratorByName(name);
  if (!collaborator) return null;
  return collaborator.portfolioUrl || collaborator.website || null;
}

export function getLocalStudioDirectory() {
  return applyBlobMediaManifest(generatedLocalStudioDirectory as LocalStudioDirectoryEntry[]);
}
