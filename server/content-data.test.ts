import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {} as any,
    res: {
      clearCookie: () => {},
    } as any,
  };
  return { ctx };
}

describe("tutorials router", () => {
  it("should return a list of tutorials", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.tutorials.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    // Each tutorial should have required fields
    const tutorial = result[0];
    expect(tutorial).toHaveProperty("id");
    expect(tutorial).toHaveProperty("title");
    expect(tutorial).toHaveProperty("category");
  });

  it("should return tutorials with expected fields", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const list = await caller.tutorials.list();
    expect(list.length).toBeGreaterThanOrEqual(19);
    // Verify all tutorials have required fields
    for (const t of list) {
      expect(t.title).toBeTruthy();
      expect(t.category).toBeTruthy();
    }
  });
});

describe("scenicDirectory router", () => {
  it("should return a list of directory resources", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.scenicDirectory.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    // Each resource should have required fields
    const resource = result[0];
    expect(resource).toHaveProperty("id");
    expect(resource).toHaveProperty("title");
    expect(resource).toHaveProperty("categorySlug");
    expect(resource).toHaveProperty("url");
  });
});

describe("tag coverage", () => {
  it("every published project should have at least one tag", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const projects = await caller.projects.list({ status: 'published' });
    for (const project of projects) {
      expect(
        project.tags.length,
        `Project "${project.title}" has no tags`
      ).toBeGreaterThan(0);
    }
  });

  it("every published news item should have at least one tag", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const newsList = await caller.news.list({ status: 'published' });
    for (const item of newsList) {
      expect(
        item.tags.length,
        `News "${item.title}" has no tags`
      ).toBeGreaterThan(0);
    }
  });

  it("every published article should have at least one tag", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const articles = await caller.articles.list({ status: 'published' });
    for (const article of articles) {
      expect(
        article.tags.length,
        `Article "${article.title}" has no tags`
      ).toBeGreaterThan(0);
    }
  });

  it("news list should return junction table tags (not legacy JSON column)", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const newsList = await caller.news.list({ status: 'published' });
    const itemWithTags = newsList.find((n: any) => n.tags && n.tags.length > 0);
    expect(itemWithTags).toBeDefined();
    if (itemWithTags) {
      // Tags should be objects with id, name, slug (from junction table)
      // not strings (from legacy JSON column)
      expect(itemWithTags.tags[0]).toHaveProperty('id');
      expect(itemWithTags.tags[0]).toHaveProperty('name');
      expect(itemWithTags.tags[0]).toHaveProperty('slug');
    }
  });
});
