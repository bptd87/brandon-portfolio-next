import { z } from "zod";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { analyticsRouter } from "./routers/analytics";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import * as db from "./db";
import { supabase } from "./db";
import { Resend } from "resend";
import { ENV } from "./_core/env";
import { renderingGalleryRouter } from "./routers/renderingGallery";
import { experientialGalleryRouter } from "./routers/experientialGallery";
import { processGalleryRouter } from "./routers/processGallery";
import { adminProcedure } from "./routers/adminProcedure";
import { authRouter } from "./routers/auth";
import { categoriesRouter } from "./routers/categories";
import { tagsRouter } from "./routers/tags";

const projectMediaInput = z.object({
  imageUrl: z.string().optional(),
  imageKey: z.string().optional(),
  videoUrl: z.string().optional(),
  imageType: z.preprocess((val) => (typeof val === 'string' ? val.toLowerCase() : val), z.enum(['production', 'rendering', 'technical_drawing', 'video'])),
  title: z.string().optional(),
  caption: z.string().optional(),
  altText: z.string().optional(),
  sortOrder: z.number(),
}).refine((value) => Boolean(value.imageUrl || value.videoUrl), {
  message: "Each media item must include an image URL or a video URL.",
});

type ListCacheEntry<T> = {
  expiresAt: number;
  data: T;
};

const PUBLIC_LIST_CACHE_TTL_MS = 60 * 1000;
type ProjectsListResult = Awaited<ReturnType<typeof db.getAllProjects>>;
type NewsListResult = Awaited<ReturnType<typeof db.getAllNews>>;
type ArticlesListResult = Awaited<ReturnType<typeof db.getAllArticles>>;

const projectsListCache = new Map<string, ListCacheEntry<ProjectsListResult>>();
const newsListCache = new Map<string, ListCacheEntry<NewsListResult>>();
const articlesListCache = new Map<string, ListCacheEntry<ArticlesListResult>>();

function invalidatePublicLists(keys: Array<'projects' | 'news' | 'articles'>) {
  if (keys.includes('projects')) projectsListCache.clear();
  if (keys.includes('news')) newsListCache.clear();
  if (keys.includes('articles')) articlesListCache.clear();
}

function getCachedList<T>(cache: Map<string, ListCacheEntry<T>>, key: string): T | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return hit.data;
}

function setCachedList<T>(cache: Map<string, ListCacheEntry<T>>, key: string, data: T): T {
  cache.set(key, { data, expiresAt: Date.now() + PUBLIC_LIST_CACHE_TTL_MS });
  return data;
}

export const appRouter = router({
  system: systemRouter,

  auth: authRouter,

  // ============ ANALYTICS ============
  analytics: analyticsRouter,

  // ============ RENDERING GALLERY ============
  renderingGallery: renderingGalleryRouter,
  experientialGallery: experientialGalleryRouter,
  processGallery: processGalleryRouter,

  // ============ CATEGORY MANAGEMENT ============
  categories: categoriesRouter,

  // ============ TAG MANAGEMENT ============
  tags: tagsRouter,

  // ============ PROJECT MANAGEMENT ============
  projects: router({
    list: publicProcedure
      .input(z.object({
        status: z.preprocess((val) => (typeof val === 'string' ? val.toLowerCase() : val), z.enum(['draft', 'published', 'archived', 'gallery_only'])).optional(),
        featured: z.boolean().optional(),
        categoryId: z.number().optional(),
        discipline: z.preprocess((val) => (typeof val === 'string' ? val.toLowerCase() : val), z.enum(['scenic_design', 'experiential_design', 'rendering'])).optional(),
      }).optional())
      .query(async ({ input, ctx }) => {
        const cacheable = !ctx.user && input?.status === "published";
        if (!cacheable) {
          return await db.getAllProjects(input);
        }
        const key = JSON.stringify(input || {});
        const cached = getCachedList(projectsListCache, key);
        if (cached) return cached;
        const fresh = await db.getAllProjects(input);
        return setCachedList(projectsListCache, key, fresh);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const project = await db.getProjectById(input.id);
        if (!project) return null;

        const [images, tags] = await Promise.all([
          db.getProjectImages(input.id),
          db.getProjectTags(input.id),
        ]);

        return { ...project, images, tags };
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }))
      .query(async ({ input }) => {
        const project = await db.getProjectBySlug(input.slug);
        if (!project) return null;

        const [images, tags] = await Promise.all([
          db.getProjectImages(project.id),
          db.getProjectTags(project.id),
        ]);

        return { ...project, images, tags };
      }),

    getImages: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProjectImages(input.projectId);
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        excerpt: z.string().optional(),
        description: z.string().optional(),
        designNotes: z.string().optional(),
        discipline: z.preprocess((val) => (typeof val === 'string' ? val.toLowerCase() : val), z.enum(['scenic_design', 'experiential_design', 'rendering'])).default('scenic_design'),
        subcategory: z.string().max(100).optional().nullable(),
        categoryId: z.number().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        location: z.string().max(255).optional(),
        client: z.string().max(255).optional(),
        year: z.number().optional(),
        month: z.number().min(1).max(12).optional().nullable(),
        status: z.preprocess((val) => (typeof val === 'string' ? val.toLowerCase() : val), z.enum(['draft', 'published', 'archived', 'gallery_only'])).default('draft'),
        featured: z.boolean().default(false),
        creativeTeam: z.any().optional(),
        metadata: z.any().optional(),
        externalArticles: z.any().optional(),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
        images: z.array(projectMediaInput).optional(),
      }))
      .mutation(async ({ input }) => {
        const { tagIds, images, ...projectData } = input;

        const dataToInsert = {
          ...projectData,
          publishedAt: projectData.status === 'published' ? new Date() : undefined,
        };

        const id = await db.createProject(dataToInsert);

        if (tagIds && tagIds.length > 0) {
          await db.setProjectTags(id, tagIds);
        }

        if (images && images.length > 0) {
          for (const image of images) {
            await db.addProjectImage({ projectId: id, ...image });
          }
        }

        invalidatePublicLists(['projects']);

        return { id };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        excerpt: z.string().optional(),
        description: z.string().optional(),
        designNotes: z.string().optional(),
        discipline: z.preprocess((val) => (typeof val === 'string' ? val.toLowerCase() : val), z.enum(['scenic_design', 'experiential_design', 'rendering'])).optional(),
        subcategory: z.string().max(100).optional().nullable(),
        categoryId: z.number().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        location: z.string().max(255).optional(),
        client: z.string().max(255).optional(),
        year: z.number().optional(),
        month: z.number().min(1).max(12).optional().nullable(),
        status: z.preprocess((val) => (typeof val === 'string' ? val.toLowerCase() : val), z.enum(['draft', 'published', 'archived', 'gallery_only'])).optional(),
        featured: z.boolean().optional(),
        creativeTeam: z.any().optional(),
        metadata: z.any().optional(),
        externalArticles: z.any().optional(),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
        images: z.array(projectMediaInput).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, tagIds, images, ...projectData } = input;

        const currentProject = await db.getProjectById(id);
        const dataToUpdate = {
          ...projectData,
          publishedAt: (projectData.status === 'published' && currentProject?.status !== 'published')
            ? new Date()
            : undefined,
        };

        await db.updateProject(id, dataToUpdate);

        if (tagIds !== undefined && tagIds.length > 0) {
          await db.setProjectTags(id, tagIds);
        }

        if (images !== undefined) {
          // Delete existing images and add new ones
          await db.deleteProjectImages(id);
          for (const image of images) {
            await db.addProjectImage({ projectId: id, ...image });
          }
        }

        invalidatePublicLists(['projects']);

        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProject(input.id);
        invalidatePublicLists(['projects']);
        return { success: true };
      }),

    createSignedUploadUrl: adminProcedure
      .input(z.object({
        bucket: z.string(),
        path: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { data, error } = await supabase.storage
          .from(input.bucket)
          .createSignedUploadUrl(input.path);

        if (error) {
          console.error('Failed to create signed upload URL:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }

        return { signedUrl: data.signedUrl, token: data.token, path: data.path }; // path might be needed
      }),

    addImage: adminProcedure
      .input(z.object({
        projectId: z.number(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(), // Optional - legacy Cloudinary key no longer used
        videoUrl: z.string().optional(),
        title: z.string().optional(),
        caption: z.string().optional(),
        altText: z.string().optional(),
        imageType: z.preprocess((val) => (typeof val === 'string' ? val.toLowerCase() : val), z.enum(['production', 'rendering', 'technical_drawing', 'video'])).optional(),
        sortOrder: z.number().default(0),
      }).refine((value) => Boolean(value.imageUrl || value.videoUrl), {
        message: "Project media must include an image URL or a video URL.",
      }))
      .mutation(async ({ input }) => {
        const id = await db.addProjectImage(input);
        return { id };
      }),

    deleteImage: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProjectImage(input.id);
        return { success: true };
      }),

    updateImage: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        caption: z.string().optional(),
        altText: z.string().optional(),
        sortOrder: z.number().optional(),
        imageType: z.enum(['production', 'rendering', 'technical_drawing', 'video']).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateProjectImage(id, updates);
        return { success: true };
      }),

    reorderImages: adminProcedure
      .input(z.array(z.object({
        id: z.number(),
        sortOrder: z.number(),
      })))
      .mutation(async ({ input }) => {
        await db.reorderProjectImages(input);
        return { success: true };
      }),
  }),

  // ============ RENDERING PROJECTS MANAGEMENT ============
  renderingProjects: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['draft', 'published', 'archived']).optional(),
        galleryOnly: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getRenderingProjects(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const project = await db.getRenderingProjectById(input.id);
        if (!project) return null;

        const images = await db.getRenderingProjectImages(input.id);
        return { ...project, images };
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getRenderingProjectBySlug(input.slug);
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        excerpt: z.string().optional(),
        designNotes: z.string().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        location: z.string().max(255).optional(),
        client: z.string().max(255).optional(),
        year: z.number().optional(),
        month: z.number().min(1).max(12).optional(),
        status: z.enum(['draft', 'published', 'archived']).default('draft'),
        featured: z.boolean().default(false),
        galleryOnly: z.boolean().default(false),
        metadata: z.any().optional(),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        images: z.array(z.object({
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          videoUrl: z.string().optional(),
          imageType: z.enum(['production', 'rendering', 'technical_drawing', 'video']).optional(),
          title: z.string().optional(),
          caption: z.string().optional(),
          altText: z.string().optional(),
          sortOrder: z.number(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { images, ...projectData } = input;
        const id = await db.createRenderingProject(projectData);

        if (images && images.length > 0) {
          for (const image of images) {
            await db.addRenderingProjectImage({ renderingProjectId: id, ...image });
          }
        }

        return { id };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        excerpt: z.string().optional(),
        designNotes: z.string().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        location: z.string().max(255).optional(),
        client: z.string().max(255).optional(),
        year: z.number().optional(),
        month: z.number().min(1).max(12).optional(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        galleryOnly: z.boolean().optional(),
        metadata: z.any().optional(),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        images: z.array(z.object({
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          videoUrl: z.string().optional(),
          imageType: z.enum(['production', 'rendering', 'technical_drawing', 'video']).optional(),
          title: z.string().optional(),
          caption: z.string().optional(),
          altText: z.string().optional(),
          sortOrder: z.number(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, images, ...projectData } = input;
        await db.updateRenderingProject(id, projectData);

        if (images !== undefined) {
          await db.deleteRenderingProjectImages(id);
          for (const image of images) {
            await db.addRenderingProjectImage({ renderingProjectId: id, ...image });
          }
        }

        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteRenderingProject(input.id);
        return { success: true };
      }),
  }),

  // ============ EXPERIENTIAL PROJECTS MANAGEMENT ============
  experientialProjects: router({
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        excerpt: z.string().optional(),
        designNotes: z.string().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        location: z.string().max(255).optional(),
        client: z.string().max(255).optional(),
        year: z.number().optional(),
        month: z.number().min(1).max(12).optional(),
        galleryType: z.enum(['rendering', 'technical-drawing', 'live-events']).default('rendering'),
        status: z.enum(['draft', 'published', 'archived']).default('draft'),
        featured: z.boolean().default(false),
        metadata: z.any().optional(),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        images: z.array(z.object({
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          videoUrl: z.string().optional(),
          imageType: z.enum(['production', 'rendering', 'technical_drawing', 'video']).optional(),
          title: z.string().optional(),
          caption: z.string().optional(),
          altText: z.string().optional(),
          sortOrder: z.number(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { images, ...projectData } = input;
        const id = await db.createExperientialProject(projectData);

        if (images && images.length > 0) {
          for (const image of images) {
            await db.addExperientialProjectImage({ experientialProjectId: id, ...image });
          }
        }

        return { id };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        excerpt: z.string().optional(),
        designNotes: z.string().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        location: z.string().max(255).optional(),
        client: z.string().max(255).optional(),
        year: z.number().optional(),
        month: z.number().min(1).max(12).optional(),
        galleryType: z.enum(['rendering', 'technical-drawing', 'live-events']).optional(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        metadata: z.any().optional(),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        images: z.array(z.object({
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          videoUrl: z.string().optional(),
          imageType: z.enum(['production', 'rendering', 'technical_drawing', 'video']).optional(),
          title: z.string().optional(),
          caption: z.string().optional(),
          altText: z.string().optional(),
          sortOrder: z.number(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, images, ...projectData } = input;
        await db.updateExperientialProject(id, projectData);

        if (images !== undefined) {
          await db.deleteExperientialProjectImages(id);
          for (const image of images) {
            await db.addExperientialProjectImage({ experientialProjectId: id, ...image });
          }
        }

        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteExperientialProject(input.id);
        return { success: true };
      }),
  }),

  // ============ NEWS MANAGEMENT ============
  news: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['draft', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        categoryId: z.number().optional(),
      }).optional())
      .query(async ({ input, ctx }) => {
        const filters = input;
        const cacheable = !ctx.user && filters?.status === "published";
        if (!cacheable) {
          return await db.getAllNews(filters);
        }
        const key = JSON.stringify(filters || {});
        const cached = getCachedList(newsListCache, key);
        if (cached) return cached;
        const fresh = await db.getAllNews(filters);
        return setCachedList(newsListCache, key, fresh);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const newsItem = await db.getNewsById(input.id);
        if (!newsItem) return null;

        const [tags, relatedLinks] = await Promise.all([
          db.getNewsTags(input.id),
          db.getNewsRelatedLinks(input.id),
        ]);
        return { ...newsItem, tags, relatedLinks };
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }))
      .query(async ({ input, ctx }) => {
        const newsItem = await db.getNewsBySlug(input.slug);
        if (!newsItem) return null;
        if ((!ctx.user || ctx.user.role !== 'admin') && newsItem.status !== 'published') {
          return null;
        }

        const [tags, relatedLinks] = await Promise.all([
          db.getNewsTags(newsItem.id),
          db.getNewsRelatedLinks(newsItem.id),
        ]);
        return { ...newsItem, tags, relatedLinks };
      }),

    getImages: publicProcedure
      .input(z.object({ newsId: z.number() }))
      .query(async ({ input }) => {
        // News items don't have galleries, just return empty array
        return [];
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        subtitle: z.string().max(255).optional(),
        excerpt: z.string().min(1),
        categoryId: z.number().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        coverImageAltText: z.string().max(255).optional(),
        coverImageFocalPoint: z.object({ x: z.number(), y: z.number() }).optional(),
        layoutVariant: z.enum(['feature', 'journal', 'bulletin']).optional(),
        location: z.string().max(255).optional(),
        externalLink: z.string().url().optional(),
        relatedLinks: z.array(z.object({
          label: z.string().min(1).max(120),
          url: z.string().url(),
          linkType: z.enum(['source', 'review', 'tickets', 'press', 'related']).optional(),
          sortOrder: z.number().optional(),
        })).optional(),
        date: z.date(),
        blocks: z.any().optional(),
        status: z.enum(['draft', 'published', 'archived']).default('draft'),
        featured: z.boolean().default(false),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { tagIds, relatedLinks, ...newsData } = input;

        const dataToInsert = {
          ...newsData,
          publishedAt: newsData.status === 'published' ? new Date() : undefined,
        };

        const id = await db.createNews(dataToInsert);

        if (tagIds && tagIds.length > 0) {
          await db.setNewsTags(id, tagIds);
        }
        if (relatedLinks !== undefined) {
          await db.setNewsRelatedLinks(id, relatedLinks);
        }

        invalidatePublicLists(['news']);

        return { id };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        subtitle: z.string().max(255).optional(),
        excerpt: z.string().min(1).optional(),
        categoryId: z.number().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        coverImageAltText: z.string().max(255).optional(),
        coverImageFocalPoint: z.object({ x: z.number(), y: z.number() }).optional(),
        layoutVariant: z.enum(['feature', 'journal', 'bulletin']).optional(),
        location: z.string().max(255).optional(),
        externalLink: z.string().url().optional(),
        relatedLinks: z.array(z.object({
          label: z.string().min(1).max(120),
          url: z.string().url(),
          linkType: z.enum(['source', 'review', 'tickets', 'press', 'related']).optional(),
          sortOrder: z.number().optional(),
        })).optional(),
        date: z.date().optional(),
        blocks: z.any().optional(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, tagIds, relatedLinks, ...newsData } = input;

        const currentNews = await db.getNewsById(id);
        const dataToUpdate = {
          ...newsData,
          publishedAt: (newsData.status === 'published' && currentNews?.status !== 'published')
            ? new Date()
            : undefined,
        };

        await db.updateNews(id, dataToUpdate);

        if (tagIds !== undefined && tagIds.length > 0) {
          await db.setNewsTags(id, tagIds);
        }
        if (relatedLinks !== undefined) {
          await db.setNewsRelatedLinks(id, relatedLinks);
        }

        invalidatePublicLists(['news']);

        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteNews(input.id);
        invalidatePublicLists(['news']);
        return { success: true };
      }),

  }),

  // ============ ARTICLE MANAGEMENT ============
  articles: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['draft', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        categoryId: z.number().optional(),
        authorId: z.number().optional(),
      }).optional())
      .query(async ({ input, ctx }) => {
        const filters = input;
        const cacheable = !ctx.user && filters?.status === "published";
        if (!cacheable) {
          return await db.getAllArticles(filters);
        }
        const key = JSON.stringify(filters || {});
        const cached = getCachedList(articlesListCache, key);
        if (cached) return cached;
        const fresh = await db.getAllArticles(filters);
        return setCachedList(articlesListCache, key, fresh);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const article = await db.getArticleById(input.id);
        if (!article) return null;

        const tags = await db.getArticleTags(input.id);
        return { ...article, tags };
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }))
      .query(async ({ input }) => {
        const article = await db.getArticleBySlug(input.slug);
        if (!article) return null;

        const tags = await db.getArticleTags(article.id);
        return { ...article, tags };
      }),

    getImages: publicProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => {
        // Articles don't have galleries, just return empty array
        return [];
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        excerpt: z.string().min(1),
        content: z.string().min(1),
        categoryId: z.number().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        readTime: z.number().optional(),
        publishedAt: z.date().optional(),
        status: z.enum(['draft', 'published', 'archived']).default('draft'),
        featured: z.boolean().default(false),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { tagIds, ...articleData } = input;

        const dataToInsert = {
          ...articleData,
          authorId: ctx.user.id,
          publishedAt: articleData.publishedAt || (articleData.status === 'published' ? new Date() : undefined),
        };

        const id = await db.createArticle(dataToInsert);

        if (tagIds && tagIds.length > 0) {
          await db.setArticleTags(id, tagIds);
        }

        invalidatePublicLists(['articles']);

        return { id };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        excerpt: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        categoryId: z.number().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        readTime: z.number().optional(),
        publishedAt: z.date().optional(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, tagIds, ...articleData } = input;

        const currentArticle = await db.getArticleById(id);
        const dataToUpdate = {
          ...articleData,
          publishedAt: articleData.publishedAt || ((articleData.status === 'published' && currentArticle?.status !== 'published')
            ? new Date()
            : undefined),
        };

        await db.updateArticle(id, dataToUpdate);

        if (tagIds !== undefined && tagIds.length > 0) {
          await db.setArticleTags(id, tagIds);
        }

        invalidatePublicLists(['articles']);

        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteArticle(input.id);
        invalidatePublicLists(['articles']);
        return { success: true };
      }),

    incrementViews: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.incrementArticleViews(input.id);
        const article = await db.getArticleById(input.id);
        return { views: article?.views || 0 };
      }),

    toggleLike: publicProcedure
      .input(z.object({ id: z.number(), liked: z.boolean() }))
      .mutation(async ({ input }) => {
        await db.toggleArticleLike(input.id, input.liked);
        const article = await db.getArticleById(input.id);
        return { likes: article?.likes || 0 };
      }),

    convertFaqToAccordion: adminProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        const article = await db.getArticleBySlug(input.slug);
        if (!article) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Article not found' });
        }

        const content = JSON.parse(article.content as string);

        // Find the section with FAQ content - look for any section containing FAQ heading or Q: pattern
        let faqSectionIndex = -1;
        for (let i = 0; i < content.length; i++) {
          const section = content[i];
          if (section.type === 'html' && section.content) {
            // Check if this section contains FAQ heading or Q&A pattern
            if (section.content.includes('FAQ') || section.content.match(/<p>Q:\s/)) {
              faqSectionIndex = i;
              break;
            }
          }
        }

        if (faqSectionIndex === -1) {
          throw new TRPCError({ code: 'NOT_FOUND', message: `FAQ section not found. Content sections: ${content.length}` });
        }

        const faqSection = content[faqSectionIndex];
        const htmlContent = faqSection.content;

        // Find where the FAQ heading starts
        const faqHeadingMatch = htmlContent.match(/<h2[^>]*>FAQs About Lighting in AI Art Generation<\/h2>/);
        if (!faqHeadingMatch) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'FAQ heading not found' });
        }

        const faqHeadingIndex = htmlContent.indexOf(faqHeadingMatch[0]);
        const beforeFaqHtml = htmlContent.substring(0, faqHeadingIndex).trim();

        // Create FAQ items
        const faqItems = [
          {
            question: "How do lighting prompts differ between Sora and Midjourney?",
            answer: "Sora tends to respond well to cinematic language and detailed descriptions of light quality, while Midjourney often works best with concise technical terms and artistic references. Sora can process longer, more narrative prompts about lighting effects, whereas Midjourney generally prefers specific style tags."
          },
          {
            question: "Can AI-generated lighting replace traditional lighting design?",
            answer: "No, AI-generated lighting is a visualization tool rather than a replacement for professional lighting design. It helps in conceptualizing and communicating ideas but doesn't account for the technical limitations and opportunities of real-world lighting equipment."
          },
          {
            question: "How important is lighting terminology in AI prompts?",
            answer: "Very important. Using specific lighting terminology (like \"high-key,\" \"volumetric,\" or \"diffused\") yields much more consistent results than vague descriptions. Learning the vocabulary of lighting design significantly improves AI outputs."
          },
          {
            question: "Can I combine multiple lighting styles in one AI prompt?",
            answer: "Yes, but with limitations. Combining complementary styles (like \"golden hour with volumetric light\") often works well, but contradictory lighting (like \"bright high-key\" and \"dark low-key\") can confuse the AI and produce inconsistent results."
          },
          {
            question: "How has the language of lighting evolved in AI art generation?",
            answer: "The terminology has become more sophisticated as AI models have advanced. Early models responded primarily to basic terms like \"dark\" or \"bright,\" while newer models like Sora understand nuanced concepts like \"practicals,\" \"motivated lighting,\" and \"rim light\" that come from cinematography and stage lighting."
          },
          {
            question: "What's the best way to structure a lighting prompt for consistent results?",
            answer: "Place the lighting description at the end of your prompt, after establishing the scene details. This helps the AI prioritize the lighting style over other elements in the scene, creating more consistent and intentional results."
          },
          {
            question: "Can LLMs like ChatGPT help improve my lighting prompts?",
            answer: "Absolutely. LLMs can help translate your creative vision into technical prompt language, suggesting specific lighting terms that might enhance your concept. They can also help troubleshoot why certain prompts aren't yielding the results you want."
          }
        ];

        // Create new content array
        const newContent = [
          ...content.slice(0, faqSectionIndex),
        ];

        // Add content before FAQ if it exists
        if (beforeFaqHtml) {
          newContent.push({ type: 'html', content: beforeFaqHtml });
        }

        // Add FAQ section
        newContent.push({
          type: 'faq',
          items: faqItems
        });

        // Update the article
        await db.updateArticle(article.id, { content: JSON.stringify(newContent) });

        return { success: true, faqItemsCount: faqItems.length };
      }),
  }),

  // ============ COMMENTS ============
  comments: router({
    list: publicProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => {
        return await db.getArticleComments(input.articleId);
      }),

    create: protectedProcedure
      .input(z.object({
        articleId: z.number(),
        content: z.string().min(1).max(5000),
        parentId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createComment({
          ...input,
          userId: ctx.user.id,
        });
        return { id };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const comment = await db.getCommentById(input.id);
        if (!comment) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' });
        }

        // Only allow deletion by comment author or admin
        if (comment.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to delete this comment' });
        }

        await db.deleteComment(input.id);
        return { success: true };
      }),
  }),

  // ============ SEARCH ============
  search: router({
    query: publicProcedure
      .input(z.object({ q: z.string().min(1) }))
      .query(async ({ input }) => {
        return await db.searchContent(input.q);
      }),
  }),

  // ============ IMAGE UPLOAD ============
  upload: router({
    image: adminProcedure
      .input(z.object({
        base64: z.string(),
        filename: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64, 'base64');
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const fileKey = `portfolio/${timestamp}-${randomSuffix}-${input.filename}`;

        const { url } = await storagePut(fileKey, buffer, input.contentType);

        return { url, key: fileKey };
      }),
  }),

  // ============ AI-POWERED CONTENT GENERATION ============
  ai: router({
    generateDescription: adminProcedure
      .input(z.object({
        title: z.string(),
        context: z.string().optional(),
        type: z.enum(['project', 'article', 'news']),
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = input.type === 'project'
          ? "You are a professional architecture and design writer. Generate compelling, detailed project descriptions that highlight design innovation, spatial concepts, and creative vision."
          : input.type === 'article'
            ? "You are a skilled content writer specializing in architecture and design. Create engaging, informative article content that educates and inspires readers."
            : "You are a professional writer creating news updates for an architecture portfolio. Write concise, newsworthy content that highlights achievements and milestones.";

        const userPrompt = `Generate a detailed description for: "${input.title}"${input.context ? `\n\nContext: ${input.context}` : ''}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });

        return { description: response.choices[0]?.message?.content || "" };
      }),

    generateSEO: adminProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an SEO expert. Generate optimized SEO metadata including title, description, and keywords.",
            },
            {
              role: "user",
              content: `Generate SEO metadata for:\nTitle: ${input.title}\nContent: ${input.content.substring(0, 500)}...`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "seo_metadata",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  seoTitle: { type: "string", description: "SEO-optimized title (50-60 chars)" },
                  seoDescription: { type: "string", description: "SEO meta description (150-160 chars)" },
                  seoKeywords: { type: "string", description: "Comma-separated keywords" },
                },
                required: ["seoTitle", "seoDescription", "seoKeywords"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== 'string') {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to generate SEO metadata' });
        }

        return JSON.parse(content);
      }),

    generateImage: adminProcedure
      .input(z.object({
        prompt: z.string(),
      }))
      .mutation(async ({ input }) => {
        const result = await generateImage({ prompt: input.prompt });

        if (!result.url) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to generate image' });
        }

        // Upload generated image to S3
        const response = await fetch(result.url);
        const buffer = Buffer.from(await response.arrayBuffer());
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const fileKey = `portfolio/ai-generated/${timestamp}-${randomSuffix}.png`;

        const { url } = await storagePut(fileKey, buffer, 'image/png');

        return { url, key: fileKey };
      }),
  }),

  // ============ PAINT RECIPES ============
  paintRecipes: router({
    saveRecipe: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        notes: z.string().optional(),
        targetColor: z.string().regex(/^#[0-9A-F]{6}$/i),
        mixingRecipe: z.array(z.object({
          paintId: z.string(),
          paintName: z.string(),
          color: z.string(),
          parts: z.number(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.createPaintRecipe({
          userId: ctx.user.id,
          ...input,
        });
        return { id: result };
      }),

    getRecipes: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserPaintRecipes(ctx.user.id);
    }),

    getRecipeById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getPaintRecipeById(input.id, ctx.user.id);
      }),

    updateRecipe: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updatePaintRecipe(id, ctx.user.id, data);
        return { success: true };
      }),

    deleteRecipe: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deletePaintRecipe(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ============ TUTORIALS ============
  tutorials: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        difficultyLevel: z.string().optional(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllTutorials(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getTutorialById(input.id);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getTutorialBySlug(input.slug);
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        description: z.string().optional(),
        overview: z.string().optional(),
        content: z.string().optional(),
        blocks: z.array(z.any()).optional(),
        category: z.string().optional(),
        difficulty: z.string().optional(),
        duration: z.number().optional(),
        videoUrl: z.string().optional(),
        coverImageUrl: z.string().optional(),
        status: z.enum(['draft', 'published', 'archived']).default('draft'),
        featured: z.boolean().default(false),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        learningObjectives: z.array(z.string()).optional(),
        keyConcepts: z.array(z.any()).optional(),
        proTips: z.array(z.string()).optional(),
        shortcuts: z.array(z.any()).optional(),
        commonPitfalls: z.array(z.string()).optional(),
        transcript: z.array(z.any()).optional(),
        relatedResources: z.array(z.any()).optional(),
        relatedTutorials: z.array(z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createTutorial(input);
        return { id };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        overview: z.string().optional(),
        content: z.string().optional(),
        blocks: z.array(z.any()).optional(),
        category: z.string().optional(),
        difficulty: z.string().optional(),
        duration: z.number().optional(),
        videoUrl: z.string().optional(),
        coverImageUrl: z.string().optional(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        learningObjectives: z.array(z.string()).optional(),
        keyConcepts: z.array(z.any()).optional(),
        proTips: z.array(z.string()).optional(),
        shortcuts: z.array(z.any()).optional(),
        commonPitfalls: z.array(z.string()).optional(),
        transcript: z.array(z.any()).optional(),
        relatedResources: z.array(z.any()).optional(),
        relatedTutorials: z.array(z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateTutorial(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTutorial(input.id);
        return { success: true };
      }),
  }),



  // ============ SCENIC DIRECTORY ============
  scenicDirectory: router({
    list: publicProcedure.query(async () => {
      const { data } = await supabase
        .from('scenic_directory')
        .select('*')
        .order('name');
      return (data || []).map(entry => ({
        ...entry,
        categoryName: entry.category_name,
        categorySlug: entry.category_slug,
        coverImage: entry.cover_image,
        createdAt: new Date(entry.created_at),
        like_count: entry.like_count || 0,
        click_count: entry.click_count || 0,
      }));
    }),

    toggleLike: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { data, error } = await supabase.rpc('toggle_scenic_directory_like', {
          directory_id: input.id
        });

        if (error) {
          console.error('Error toggling like:', error);
          // Fallback to simple increment (Read then Write)
          const { data: current } = await supabase
            .from('scenic_directory')
            .select('like_count')
            .eq('id', input.id)
            .single();

          const newCount = (current?.like_count || 0) + 1;

          await supabase.from('scenic_directory')
            .update({ like_count: newCount })
            .eq('id', input.id);

          return { success: true };
        }

        return { success: true, newCount: data };
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getScenicEntryById(input.id);
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        categoryName: z.string().optional(),
        categorySlug: z.string().optional(),
        url: z.string().url().optional(),
        location: z.string().optional(),
        coverImage: z.string().optional(),
        status: z.enum(['published', 'draft', 'archived']).default('published'),
        featured: z.boolean().default(false),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        gallery: z.array(z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createScenicEntry(input);
        return { id };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        categoryName: z.string().optional(),
        categorySlug: z.string().optional(),
        url: z.string().url().optional(),
        location: z.string().optional(),
        coverImage: z.string().optional(),
        status: z.enum(['published', 'draft', 'archived']).optional(),
        featured: z.boolean().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        gallery: z.array(z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateScenicEntry(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteScenicEntry(input.id);
        return { success: true };
      }),
  }),

  // ============ TUTORIAL PROGRESS TRACKING ============
  tutorialProgress: router({
    // Get user's progress for all tutorials
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      return await db.getTutorialProgressByUser(ctx.user.id);
    }),

    // Toggle watched status for a tutorial
    toggleWatched: protectedProcedure
      .input(z.object({
        tutorialSlug: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getTutorialProgress(ctx.user.id, input.tutorialSlug);

        if (existing) {
          // Toggle completion status
          const newCompletedStatus = !existing.completed;
          await db.updateTutorialProgress(existing.id, {
            completed: newCompletedStatus,
          });
          return { completed: newCompletedStatus };
        } else {
          // Create new progress entry
          const id = await db.createTutorialProgress({
            userId: ctx.user.id,
            tutorialSlug: input.tutorialSlug,
            completed: true,
          });
          return { completed: true, id };
        }
      }),
  }),

  // ============ COLLABORATORS ============
  collaborators: router({
    list: publicProcedure
      .input(z.object({
        role: z.enum(['director', 'scenic_designer', 'costume_designer', 'lighting_designer', 'sound_designer', 'projection_designer', 'theatre_company', 'partner_company']).optional()
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllCollaborators(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCollaboratorById(input.id);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const collaborator = await db.getCollaboratorBySlug(input.slug);
        if (!collaborator) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Collaborator not found' });
        }
        return collaborator;
      }),

    getProjects: publicProcedure
      .input(z.object({ collaboratorId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCollaboratorProjects(input.collaboratorId);
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        slug: z.string().optional(),
        role: z.string().optional(),
        bio: z.string().optional(),
        portfolioUrl: z.string().url().optional(),
        website: z.string().url().optional(),
        websiteUrl: z.string().url().optional(),
        instagramUrl: z.string().url().optional(),
        instagramHandle: z.string().optional(),
        coverImage: z.string().optional(),
        status: z.enum(['published', 'draft', 'archived']).optional(),
        featured: z.boolean().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        gallery: z.array(z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createCollaborator({
          ...input,
          website: input.website ?? input.websiteUrl,
          websiteUrl: input.websiteUrl ?? input.website,
        });
        return { id };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        slug: z.string().optional(),
        role: z.string().optional(),
        bio: z.string().optional(),
        portfolioUrl: z.string().url().optional(),
        website: z.string().url().optional(),
        websiteUrl: z.string().url().optional(),
        instagramUrl: z.string().url().optional(),
        instagramHandle: z.string().optional(),
        coverImage: z.string().optional(),
        status: z.enum(['published', 'draft', 'archived']).optional(),
        featured: z.boolean().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        gallery: z.array(z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCollaborator(id, {
          ...data,
          website: data.website ?? data.websiteUrl,
          websiteUrl: data.websiteUrl ?? data.website,
        });
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCollaborator(input.id);
        return { success: true };
      }),
  }),

  // ============ CONTACT FORM ============
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        email: z.string().email(),
        subject: z.string().min(1).max(255),
        message: z.string().min(1).max(5000),
        userAgent: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ip = ctx.req.ip || ctx.req.headers["x-forwarded-for"] || ctx.req.headers["x-real-ip"] || "unknown";
        const ipString = Array.isArray(ip) ? ip[0] : ip;
        const userAgent = input.userAgent || ctx.req.headers["user-agent"] || "";

        const { error: insertError } = await supabase
          .from("contact_submissions")
          .insert({
            name: input.name,
            email: input.email,
            subject: input.subject,
            message: input.message,
            ip_address: ipString,
            user_agent: userAgent,
            source: "contact-form",
            status: "new",
          });

        if (insertError) {
          console.error("Failed to store contact submission", insertError);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to store contact submission.",
          });
        }

        if (!ENV.resendApiKey || !ENV.contactFromEmail || !ENV.contactToEmail) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Contact email service is not configured.",
          });
        }

        const resend = new Resend(ENV.resendApiKey);

        const title = `New Contact Form Submission: ${input.subject}`;
        const content = `From: ${input.name} (${input.email})\nSubject: ${input.subject}\n\nMessage:\n${input.message}`;

        await resend.emails.send({
          from: ENV.contactFromEmail,
          to: ENV.contactToEmail,
          replyTo: input.email,
          subject: title,
          text: content,
        });

        return { success: true };
      }),
  }),

  // ============ IMAGE UPLOAD WITH COMPRESSION ============
  images: router({
    uploadOptimized: protectedProcedure
      .input(z.object({
        base64: z.string(),
        filename: z.string(),
        maxWidth: z.number().optional().default(2048),
        quality: z.number().min(1).max(100).optional().default(85),
      }))
      .mutation(async ({ input }) => {
        const { compressImage } = await import('./imageCompression');

        // Decode base64 to buffer
        const base64Data = input.base64.replace(/^data:image\/\w+;base64,/, '');
        const inputBuffer = Buffer.from(base64Data, 'base64');

        // Compress image
        const compressed = await compressImage(inputBuffer, {
          maxWidth: input.maxWidth,
          quality: input.quality,
          format: 'webp'
        });

        // Generate filename with .webp extension
        const baseFilename = input.filename.replace(/\.[^/.]+$/, '');
        const filename = `${baseFilename}-optimized.webp`;

        // Upload to S3
        const result = await storagePut(
          `optimized-images/${filename}`,
          compressed.buffer,
          'image/webp'
        );

        return {
          url: result.url,
          originalSize: inputBuffer.length,
          compressedSize: compressed.size,
          compressionRatio: ((1 - compressed.size / inputBuffer.length) * 100).toFixed(1) + '%',
          width: compressed.width,
          height: compressed.height,
          format: compressed.format
        };
      }),
  }),
  // ============ TODO MANAGEMENT ============
  todos: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getAllTodos(ctx.user.openId);
    }),

    create: protectedProcedure
      .input(z.object({ text: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        // Pass null for the first argument to match db.createTodo signature
        const id = await db.createTodo(null, { text: input.text, userId: ctx.user.openId });
        return { id };
      }),

    toggle: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const completed = await db.toggleTodo(input.id, ctx.user.openId);
        return { completed };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteTodo(input.id, ctx.user.openId);
        return { success: true };
      }),
  }),

});

export type AppRouter = typeof appRouter;
