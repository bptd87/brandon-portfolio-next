import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { adminProcedure } from "./adminProcedure";
import * as db from "../db";

export const categoriesRouter = router({
  list: publicProcedure
    .input(z.object({ type: z.enum(["project", "news", "article"]).optional() }).optional())
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
      type: z.enum(["project", "news", "article"]),
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
});
