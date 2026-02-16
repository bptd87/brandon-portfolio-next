import { z } from 'zod';
import { router, publicProcedure, adminProcedure } from '../_core/trpc';
import * as db from '../db';

const categorySchema = z.enum([
  'workflow-toolkit',
  'workflow-drawing', 
  'workflow-modeling',
  'workflow-buildability',
  'rendering',
  'technical-drawing',
  'live-events'
]);

export const processGalleryRouter = router({
    // Get all items (for admin)
    list: publicProcedure
        .query(async () => {
            return await db.getAllProcessGallery();
        }),

    // Get items by category (for frontend)
    byCategory: publicProcedure
        .input(z.object({
            category: categorySchema.optional()
        }))
        .query(async ({ input }) => {
            return await db.getProcessGalleryByCategory(input.category);
        }),

    // Add new item
    add: adminProcedure
        .input(z.object({
            category: categorySchema,
            imageUrl: z.string(),
            imageKey: z.string().optional(),
            videoUrl: z.string().optional(),
            altText: z.string().optional(),
            displayTitle: z.string().optional(),
            description: z.string().optional(),
            projectId: z.number().optional()
        }))
        .mutation(async ({ input }) => {
            return await db.addProcessGalleryItem(
                input.category,
                input.imageUrl,
                input.imageKey,
                input.videoUrl,
                input.altText,
                input.displayTitle,
                input.description,
                input.projectId
            );
        }),

    // Update item
    update: adminProcedure
        .input(z.object({
            id: z.number(),
            altText: z.string().optional(),
            displayTitle: z.string().optional(),
            description: z.string().optional(),
            videoUrl: z.string().optional(),
            year: z.number().optional(),
            active: z.boolean().optional()
        }))
        .mutation(async ({ input }) => {
            const { id, ...updates } = input;
            await db.updateProcessGalleryItem(id, updates);
            return { success: true };
        }),

    // Delete item
    delete: adminProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ input }) => {
            await db.deleteProcessGalleryItem(input.id);
            return { success: true };
        }),

    // Update sort order
    updateOrder: adminProcedure
        .input(z.array(z.object({
            id: z.number(),
            sortOrder: z.number()
        })))
        .mutation(async ({ input }) => {
            await db.updateProcessGalleryOrder(input);
            return { success: true };
        }),

    // ============ BRANDS ============
    
    // Get all brands (public - for frontend)
    brands: publicProcedure
        .query(async () => {
            return await db.getExperientialBrands();
        }),

    // Get all brands including inactive (admin)
    allBrands: adminProcedure
        .query(async () => {
            return await db.getAllExperientialBrands();
        }),

    // Add brand
    addBrand: adminProcedure
        .input(z.object({
            name: z.string(),
            logoUrl: z.string().optional(),
            logoKey: z.string().optional(),
            websiteUrl: z.string().optional()
        }))
        .mutation(async ({ input }) => {
            return await db.addExperientialBrand(
                input.name,
                input.logoUrl,
                input.logoKey,
                input.websiteUrl
            );
        }),

    // Update brand
    updateBrand: adminProcedure
        .input(z.object({
            id: z.number(),
            name: z.string().optional(),
            logoUrl: z.string().optional(),
            logoKey: z.string().optional(),
            websiteUrl: z.string().optional(),
            active: z.boolean().optional()
        }))
        .mutation(async ({ input }) => {
            const { id, ...updates } = input;
            await db.updateExperientialBrand(id, updates);
            return { success: true };
        }),

    // Delete brand
    deleteBrand: adminProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ input }) => {
            await db.deleteExperientialBrand(input.id);
            return { success: true };
        }),

    // Update brands order
    updateBrandsOrder: adminProcedure
        .input(z.array(z.object({
            id: z.number(),
            sortOrder: z.number()
        })))
        .mutation(async ({ input }) => {
            await db.updateExperientialBrandsOrder(input);
            return { success: true };
        }),

    // ============ PROJECT CREATION ============
    
    // Create a simple project for gallery items
    createGalleryProject: adminProcedure
        .input(z.object({
            title: z.string(),
            coverImageUrl: z.string().optional(),
            year: z.number().optional(),
            category: categorySchema
        }))
        .mutation(async ({ input }) => {
            // Generate a slug from title
            const slug = input.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            
            const projectId = await db.createProject({
                title: input.title,
                slug: `experiential-${slug}-${Date.now()}`,
                discipline: 'experiential',
                subcategory: input.category,
                year: input.year || new Date().getFullYear(),
                coverImageUrl: input.coverImageUrl || null,
                status: 'published',
                featured: false
            });
            
            return { projectId };
        }),

    // Get all images for a project
    projectImages: publicProcedure
        .input(z.object({
            projectId: z.number()
        }))
        .query(async ({ input }) => {
            return await db.getProjectImages(input.projectId);
        }),

    // ============ SITE SETTINGS ============
    
    // Get workflow graphic URL
    workflowGraphic: publicProcedure
        .query(async () => {
            return await db.getSiteSetting('experiential_workflow_graphic');
        }),

    // Set workflow graphic URL
    setWorkflowGraphic: adminProcedure
        .input(z.object({
            url: z.string().nullable()
        }))
        .mutation(async ({ input }) => {
            await db.setSiteSetting('experiential_workflow_graphic', input.url);
            return { success: true };
        })
});
