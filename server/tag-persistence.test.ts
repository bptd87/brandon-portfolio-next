import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Tag Persistence Safety", () => {
  it("should not wipe project tags when updating without tagIds", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    
    // Get a project that has tags
    const projects = await caller.projects.list({ discipline: 'scenic_design' });
    const projectWithTags = projects.find((p: any) => p.tags && p.tags.length > 0);
    
    if (!projectWithTags) {
      console.log("No project with tags found - skipping");
      return;
    }
    
    const originalTagCount = projectWithTags.tags.length;
    expect(originalTagCount).toBeGreaterThan(0);
    
    // Update the project WITHOUT tagIds - should NOT wipe tags
    await caller.projects.update({
      id: projectWithTags.id,
      title: projectWithTags.title,
    });
    
    // Verify tags are still there
    const updated = await caller.projects.getBySlug({ slug: projectWithTags.slug });
    expect(updated.tags.length).toBe(originalTagCount);
  });

  it("should not wipe project tags when updating with empty tagIds array", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    
    const projects = await caller.projects.list({ discipline: 'scenic_design' });
    const projectWithTags = projects.find((p: any) => p.tags && p.tags.length > 0);
    
    if (!projectWithTags) {
      console.log("No project with tags found - skipping");
      return;
    }
    
    const originalTagCount = projectWithTags.tags.length;
    expect(originalTagCount).toBeGreaterThan(0);
    
    // Update with empty tagIds - should NOT wipe tags
    await caller.projects.update({
      id: projectWithTags.id,
      title: projectWithTags.title,
      tagIds: [],
    });
    
    // Verify tags are still there
    const updated = await caller.projects.getBySlug({ slug: projectWithTags.slug });
    expect(updated.tags.length).toBe(originalTagCount);
  });

  it("should preserve news tags when updating without tagIds", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    
    const newsList = await caller.news.list({});
    const newsWithTags = newsList.find((n: any) => n.tags && n.tags.length > 0);
    
    if (!newsWithTags) {
      console.log("No news with tags found - skipping");
      return;
    }
    
    const originalTagCount = newsWithTags.tags.length;
    expect(originalTagCount).toBeGreaterThan(0);
    
    await caller.news.update({
      id: newsWithTags.id,
      title: newsWithTags.title,
    });
    
    const updated = await caller.news.getBySlug({ slug: newsWithTags.slug });
    expect(updated.tags.length).toBe(originalTagCount);
  });

  it("should preserve article tags when updating without tagIds", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    
    const articles = await caller.articles.list({});
    const articleWithTags = articles.find((a: any) => a.tags && a.tags.length > 0);
    
    if (!articleWithTags) {
      console.log("No article with tags found - skipping");
      return;
    }
    
    const originalTagCount = articleWithTags.tags.length;
    expect(originalTagCount).toBeGreaterThan(0);
    
    await caller.articles.update({
      id: articleWithTags.id,
      title: articleWithTags.title,
    });
    
    const updated = await caller.articles.getBySlug({ slug: articleWithTags.slug });
    expect(updated.tags.length).toBe(originalTagCount);
  });
});
