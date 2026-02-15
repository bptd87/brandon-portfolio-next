import { z } from 'zod';
import { router, publicProcedure, adminProcedure } from '../_core/trpc';
import * as db from '../db';
import { TRPCError } from '@trpc/server';

export const renderingGalleryRouter = router({
    list: publicProcedure
        .query(async () => {
            return await db.getRenderingGallery();
        }),

    add: adminProcedure
        .input(z.object({
            projectId: z.number(),
            altText: z.string().optional(),
            displayTitle: z.string().optional()
        }))
        .mutation(async ({ input }) => {
            await db.addProjectToRenderingGallery(input.projectId, input.altText, input.displayTitle);
            return { success: true };
        }),

    remove: adminProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ input }) => {
            await db.removeProjectFromRenderingGallery(input.id);
            return { success: true };
        }),

    updateOrder: adminProcedure
        .input(z.array(z.object({
            id: z.number(),
            sortOrder: z.number()
        })))
        .mutation(async ({ input }) => {
            await db.updateRenderingGalleryOrder(input);
            return { success: true };
        }),

    updateMetadata: adminProcedure
        .input(z.object({
            id: z.number(),
            active: z.boolean().default(true), // Kept for future use, though currently not in DB
            altText: z.string().optional(),
            displayTitle: z.string().optional(),
            description: z.string().optional()
        }))
        .mutation(async ({ input }) => {
            await db.updateRenderingGalleryMetadata(
                input.id,
                input.active,
                input.altText,
                input.displayTitle,
                input.description
            );
            return { success: true };
        })
});
