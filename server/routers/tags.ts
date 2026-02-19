import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { adminProcedure } from "./adminProcedure";
import * as db from "../db";

export const tagsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllTags();
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(100) }))
    .query(async ({ input }) => {
      const tag = await db.getTagBySlug(input.slug);
      if (!tag) return null;

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
      return { id, name: input.name, slug: input.slug, createdAt: new Date() };
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
});
