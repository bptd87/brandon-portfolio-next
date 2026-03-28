import {
  generatedLocalCollaborators,
  generatedLocalStudioDirectory,
  generatedLocalTutorials,
} from "./localStudio.generated";
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

export function getLocalTutorials() {
  return applyBlobMediaManifest(generatedLocalTutorials as LocalTutorial[]).map((tutorial) => ({
    ...tutorial,
    cover_image: normalizeYouTubeThumbnail(tutorial.cover_image),
  }));
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
