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

export function getLocalTutorials() {
  return applyBlobMediaManifest(generatedLocalTutorials as LocalTutorial[]);
}

export function getLocalTutorialBySlug(slug?: string | null) {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  if (!normalizedSlug) return null;
  return getLocalTutorials().find((tutorial) => tutorial.slug === normalizedSlug) || null;
}

export function getLocalCollaborators() {
  return applyBlobMediaManifest(generatedLocalCollaborators as LocalCollaborator[]);
}

export function getLocalStudioDirectory() {
  return applyBlobMediaManifest(generatedLocalStudioDirectory as LocalStudioDirectoryEntry[]);
}
