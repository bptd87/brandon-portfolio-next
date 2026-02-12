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
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1).max(100) }))
      .query(async ({ input }) => {
        const tag = await db.getTagBySlug(input.slug);
        if (!tag) return null;
        
        // Get all content associated with this tag
        const projects = await db.getProjectsByTag(tag.id);
        const articles = await db.getArticlesByTag(tag.id);
        const news = await db.getNewsByTag(tag.id);
        
        return { tag, projects, articles, news };
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
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateTag(id, data);
        return { success: true };
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
        month: z.number().min(1).max(12).optional(),
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
          imageType: z.enum(['production', 'rendering', 'technical_drawing', 'video']),
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
        month: z.number().min(1).max(12).optional(),
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
          imageType: z.enum(['production', 'rendering', 'technical_drawing', 'video']),
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
        const { optimizeImage } = await import('./imageOptimizer.js');
        
        const buffer = Buffer.from(input.data, 'base64');
        
        // Optimize image (convert to WebP, resize, compress)
        const optimized = await optimizeImage(buffer, {
          maxWidth: 2000,
          maxHeight: 2000,
          quality: 85,
          format: 'webp',
        });
        
        // Generate filename with .webp extension
        const baseFilename = input.filename.replace(/\.[^.]+$/, '');
        const key = `projects/${Date.now()}-${baseFilename}.webp`;
        
        const result = await storagePut(key, optimized.buffer, 'image/webp');
        return { 
          url: result.url, 
          key: result.key,
          optimized: {
            originalSize: buffer.length,
            optimizedSize: optimized.size,
            savings: Math.round((1 - optimized.size / buffer.length) * 100),
            width: optimized.width,
            height: optimized.height,
          }
        };
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
      .input(z.object({ slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }))
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
        
        if (tagIds !== undefined && tagIds.length > 0) {
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
    
    uploadImage: adminProcedure
      .input(z.object({
        fileName: z.string(),
        fileType: z.string(),
        base64Data: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64Data, 'base64');
        const ext = input.fileName.split('.').pop() || 'jpg';
        const key = `news/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        
        const result = await storagePut(key, buffer, input.fileType);
        return { url: result.url, key: result.key };
      }),
    
    bulkImport: publicProcedure
      .mutation(async () => {
        const newsData = await import('./newsData.json');
        const imageMap = await import('./newsImageMap.json');
        
        const categoryMap: Record<string, number | null> = {
          'Project Launch': null,
          'Publication': null,
          'Career Milestone': null,
          'Collaboration': null,
          'Project Update': null,
          'Assistant Scenic Design': null,
          'Life Updates': null,
          'Publication/Feature': null,
        };
        
        function blocksToJson(content: any): any[] {
          if (!content) return [];
          if (typeof content === 'string') return [{ type: 'text', content }];
          
          const blocks = [];
          for (const block of content) {
            if (block.type === 'paragraph' && block.content) {
              const cleaned = block.content.replace(/\u00a0/g, ' ');
              blocks.push({ type: 'text', content: cleaned });
            }
          }
          return blocks;
        }
        
        let inserted = 0;
        const articles = newsData.default || newsData;
        const images: Record<string, string> = imageMap.default || imageMap;
        
        for (let idx = 0; idx < articles.length; idx++) {
          const article = articles[idx];
          
          try {
            const id = await db.createNews({
              slug: article.slug,
              title: article.title,
              excerpt: article.excerpt,
              blocks: blocksToJson(article.content),
              coverImageUrl: images[article.slug] || undefined,
              categoryId: categoryMap[article.category] || undefined,
              date: article.date ? new Date(article.date) : new Date(),
              externalLink: article.link || undefined,
              location: article.location || undefined,
              tags: article.tags ? article.tags.slice(0, 5).join(', ') : undefined,
              featured: idx === 0,
              status: 'published',
              publishedAt: article.date ? new Date(article.date) : new Date(),
            });
            inserted++;
          } catch (e: any) {
            console.error(`Failed to insert ${article.title}:`, e.message);
          }
        }
        
        return { inserted, total: articles.length };
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
      .input(z.object({ slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }))
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
        
        if (tagIds !== undefined && tagIds.length > 0) {
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
  comments: router({    list: publicProcedure
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
        return { id: result.insertId };
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
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllTutorials(input);
      }),
  }),

  // ============ SCENIC DIRECTORY ============
  scenicDirectory: router({
    list: publicProcedure
      .input(z.object({
        categorySlug: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllScenicDirectory(input);
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
          // Toggle watched status
          const newWatchedStatus = !existing.watched;
          await db.updateTutorialProgress(existing.id, {
            watched: newWatchedStatus,
            watchedAt: newWatchedStatus ? new Date() : null,
          });
          return { watched: newWatchedStatus };
        } else {
          // Create new progress entry
          const id = await db.createTutorialProgress({
            userId: ctx.user.id,
            tutorialSlug: input.tutorialSlug,
            watched: true,
            watchedAt: new Date(),
          });
          return { watched: true, id };
        }
      }),
  }),

  // ============ COLLABORATORS ============
  collaborators: router({
    list: publicProcedure
      .input(z.object({ 
        role: z.enum(['director', 'scenic_designer', 'costume_designer', 'lighting_designer', 'sound_designer', 'projection_designer', 'theatre_company', 'partner_company']).optional(),
        featured: z.boolean().optional()
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllCollaborators(input);
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
  }),

  // ============ CONTACT FORM ============
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        email: z.string().email(),
        subject: z.string().min(1).max(255),
        message: z.string().min(1).max(5000),
      }))
      .mutation(async ({ input }) => {
        // Send notification to owner
        const { notifyOwner } = await import('./_core/notification');
        
        const title = `New Contact Form Submission: ${input.subject}`;
        const content = `
From: ${input.name} (${input.email})
Subject: ${input.subject}

Message:
${input.message}
`;
        
        await notifyOwner({ title, content });
        
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
});

export type AppRouter = typeof appRouter;
