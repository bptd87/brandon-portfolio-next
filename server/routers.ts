import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import * as db from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ CATEGORY MANAGEMENT ============
  categories: router({
    list: publicProcedure
      .input(z.object({ type: z.enum(['project', 'news', 'article']).optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllCategories(input?.type);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCategoryById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
        type: z.enum(['project', 'news', 'article']),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createCategory(input);
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(100).optional(),
        slug: z.string().min(1).max(100).optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCategory(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCategory(input.id);
        return { success: true };
      }),
  }),

  // ============ TAG MANAGEMENT ============
  tags: router({
    list: publicProcedure.query(async () => {
      return await db.getAllTags();
    }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createTag(input);
        return { id };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTag(input.id);
        return { success: true };
      }),
  }),

  // ============ PROJECT MANAGEMENT ============
  projects: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['draft', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        categoryId: z.number().optional(),
        discipline: z.enum(['scenic_design', 'experiential_design', 'rendering', 'scenic_models']).optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllProjects(input);
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
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const project = await db.getProjectBySlug(input.slug);
        if (!project) return null;
        
        const [images, tags] = await Promise.all([
          db.getProjectImages(project.id),
          db.getProjectTags(project.id),
        ]);
        
        return { ...project, images, tags };
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        excerpt: z.string().optional(),
        description: z.string().optional(),
        designNotes: z.string().optional(),
        discipline: z.enum(['scenic_design', 'experiential_design', 'rendering', 'scenic_models']).default('scenic_design'),
        subcategory: z.string().max(100).optional(),
        categoryId: z.number().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        location: z.string().max(255).optional(),
        client: z.string().max(255).optional(),
        year: z.number().optional(),
        status: z.enum(['draft', 'published', 'archived']).default('draft'),
        featured: z.boolean().default(false),
        creativeTeam: z.any().optional(),
        metadata: z.any().optional(),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
        images: z.array(z.object({
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          videoUrl: z.string().optional(),
          imageType: z.enum(['production', 'rendering', 'video']),
          caption: z.string().optional(),
          altText: z.string().optional(),
          sortOrder: z.number(),
        })).optional(),
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
        discipline: z.enum(['scenic_design', 'experiential_design', 'rendering', 'scenic_models']).optional(),
        subcategory: z.string().max(100).optional(),
        categoryId: z.number().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        location: z.string().max(255).optional(),
        client: z.string().max(255).optional(),
        year: z.number().optional(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        creativeTeam: z.any().optional(),
        metadata: z.any().optional(),
        seoTitle: z.string().max(255).optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
        images: z.array(z.object({
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          videoUrl: z.string().optional(),
          imageType: z.enum(['production', 'rendering', 'video']),
          caption: z.string().optional(),
          altText: z.string().optional(),
          sortOrder: z.number(),
        })).optional(),
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
        
        if (tagIds !== undefined) {
          await db.setProjectTags(id, tagIds);
        }
        
        if (images !== undefined) {
          // Delete existing images and add new ones
          await db.deleteProjectImages(id);
          for (const image of images) {
            await db.addProjectImage({ projectId: id, ...image });
          }
        }
        
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProject(input.id);
        return { success: true };
      }),
    
    addImage: adminProcedure
      .input(z.object({
        projectId: z.number(),
        imageUrl: z.string(),
        imageKey: z.string(),
        caption: z.string().optional(),
        altText: z.string().optional(),
        sortOrder: z.number().default(0),
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
    
    uploadImage: adminProcedure
      .input(z.object({
        filename: z.string(),
        contentType: z.string(),
        data: z.string(), // base64 encoded
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.data, 'base64');
        const key = `projects/${Date.now()}-${input.filename}`;
        const result = await storagePut(key, buffer, input.contentType);
        return { url: result.url, key: result.key };
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
      .query(async ({ input }) => {
        return await db.getAllNews(input);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const newsItem = await db.getNewsById(input.id);
        if (!newsItem) return null;
        
        const tags = await db.getNewsTags(input.id);
        return { ...newsItem, tags };
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const newsItem = await db.getNewsBySlug(input.slug);
        if (!newsItem) return null;
        
        const tags = await db.getNewsTags(newsItem.id);
        return { ...newsItem, tags };
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        excerpt: z.string().min(1),
        categoryId: z.number().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        location: z.string().max(255).optional(),
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
        const { tagIds, ...newsData } = input;
        
        const dataToInsert = {
          ...newsData,
          publishedAt: newsData.status === 'published' ? new Date() : undefined,
        };
        
        const id = await db.createNews(dataToInsert);
        
        if (tagIds && tagIds.length > 0) {
          await db.setNewsTags(id, tagIds);
        }
        
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        excerpt: z.string().min(1).optional(),
        categoryId: z.number().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        location: z.string().max(255).optional(),
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
        const { id, tagIds, ...newsData } = input;
        
        const currentNews = await db.getNewsById(id);
        const dataToUpdate = {
          ...newsData,
          publishedAt: (newsData.status === 'published' && currentNews?.status !== 'published') 
            ? new Date() 
            : undefined,
        };
        
        await db.updateNews(id, dataToUpdate);
        
        if (tagIds !== undefined) {
          await db.setNewsTags(id, tagIds);
        }
        
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteNews(input.id);
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
      .query(async ({ input }) => {
        return await db.getAllArticles(input);
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
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const article = await db.getArticleBySlug(input.slug);
        if (!article) return null;
        
        const tags = await db.getArticleTags(article.id);
        return { ...article, tags };
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
          publishedAt: articleData.status === 'published' ? new Date() : undefined,
        };
        
        const id = await db.createArticle(dataToInsert);
        
        if (tagIds && tagIds.length > 0) {
          await db.setArticleTags(id, tagIds);
        }
        
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
          publishedAt: (articleData.status === 'published' && currentArticle?.status !== 'published') 
            ? new Date() 
            : undefined,
        };
        
        await db.updateArticle(id, dataToUpdate);
        
        if (tagIds !== undefined) {
          await db.setArticleTags(id, tagIds);
        }
        
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteArticle(input.id);
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
});

export type AppRouter = typeof appRouter;
