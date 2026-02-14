import { z } from 'zod';
import { router, publicProcedure, adminProcedure } from '../_core/trpc';
import * as db from '../db';
import { TRPCError } from '@trpc/server';

export const modelGalleryRouter = router({
    list: publicProcedure
        .query(async () => {
            return await db.getModelGallery();
        }),

    add: adminProcedure
        .input(z.object({
            projectId: z.number(),
            altText: z.string().optional(),
            displayTitle: z.string().optional()
        }))
        .mutation(async ({ input }) => {
            await db.addProjectToModelGallery(input.projectId, input.altText, input.displayTitle);
            return { success: true };
        }),

    remove: adminProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ input }) => {
            await db.removeProjectFromModelGallery(input.id);
            return { success: true };
        }),

    updateOrder: adminProcedure
        .input(z.array(z.object({
            id: z.number(),
            sortOrder: z.number()
        })))
        .mutation(async ({ input }) => {
            await db.updateModelGalleryOrder(input);
            return { success: true };
        }),

    updateMetadata: adminProcedure
        .input(z.object({
            id: z.number(),
            active: z.boolean().default(true),
            altText: z.string().optional(),
            displayTitle: z.string().optional()
        }))
        .mutation(async ({ input }) => {
            await db.updateModelGalleryMetadata(
                input.id,
                input.active,
                input.altText,
                input.displayTitle
            );
            return { success: true };
        })
});
