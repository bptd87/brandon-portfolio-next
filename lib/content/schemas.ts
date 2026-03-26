import { z } from "zod";

export const assetReferenceSchema = z.object({
  asset: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1),
  siteUrl: z.string().url(),
  title: z.string().min(1),
  description: z.string().min(1),
  email: z.string().email(),
  social: z.object({
    instagram: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    youtube: z.string().url().optional(),
    pinterest: z.string().url().optional(),
  }),
});

export const projectMetaSchema = z.object({
  type: z.literal("project"),
  discipline: z.enum(["scenic", "rendering", "experiential"]),
  slug: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  excerpt: z.string().default(""),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([]),
  client: z.string().optional(),
  clientUrl: z.string().url().optional(),
  location: z.string().optional(),
  year: z.number().optional(),
  month: z.number().optional(),
  subcategory: z.string().optional(),
  cover: assetReferenceSchema.extend({
    position: z.string().optional(),
  }),
  team: z
    .array(
      z.object({
        role: z.string().min(1),
        name: z.string().min(1),
      })
    )
    .default([]),
  tags: z.array(z.string()).default([]),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url(),
      })
    )
    .default([]),
  related: z
    .object({
      articles: z.array(z.string()).default([]),
      renderingProjects: z.array(z.string()).default([]),
    })
    .default({ articles: [], renderingProjects: [] }),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const projectMediaSchema = z.object({
  gallery: z
    .array(
      z.object({
        kind: z.enum(["production", "rendering", "technical-drawing", "live-events"]),
        asset: z.string().min(1),
        alt: z.string().min(1),
        caption: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      })
    )
    .default([]),
  videos: z
    .array(
      z.object({
        provider: z.enum(["youtube", "vimeo", "file"]).default("youtube"),
        url: z.string().url(),
        title: z.string().min(1),
        posterAsset: z.string().optional(),
      })
    )
    .default([]),
});

export const articleMetaSchema = z.object({
  type: z.literal("article"),
  slug: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  excerpt: z.string().default(""),
  category: z.string().default("Article"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([]),
  cover: assetReferenceSchema,
  tags: z.array(z.string()).default([]),
  readTime: z.number().optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  audio: z
    .object({
      asset: z.string().min(1),
      label: z.string().min(1),
    })
    .optional(),
});

export const tutorialMetaSchema = z.object({
  type: z.literal("tutorial"),
  slug: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  excerpt: z.string().default(""),
  category: z.string().default("Tutorial"),
  difficulty: z.string().optional(),
  durationMinutes: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([]),
  cover: assetReferenceSchema.optional(),
  video: z
    .object({
      url: z.string().url(),
    })
    .optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type ProjectMeta = z.infer<typeof projectMetaSchema>;
export type ProjectMedia = z.infer<typeof projectMediaSchema>;
export type ArticleMeta = z.infer<typeof articleMetaSchema>;
export type TutorialMeta = z.infer<typeof tutorialMetaSchema>;
