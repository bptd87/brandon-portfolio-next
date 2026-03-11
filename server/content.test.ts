import { describe, expect, it } from "vitest";
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

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Content Management API", () => {
  describe("Categories", () => {
    it("allows public access to list categories", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.categories.list({});
      expect(Array.isArray(result)).toBe(true);
    });

    it("requires admin role to create categories", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.categories.create({
          name: "Test Category",
          slug: "test-category",
          type: "project",
        })
      ).rejects.toThrow();
    });

    it("allows admin to create categories", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const ts = Date.now();

      const result = await caller.categories.create({
        name: `Test Project Category ${ts}`,
        slug: `test-project-category-${ts}`,
        type: "project",
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });
  });

  describe("Tags", () => {
    it("allows public access to list tags", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tags.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("requires admin role to create tags", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.tags.create({
          name: "Test Tag",
          slug: "test-tag",
        })
      ).rejects.toThrow();
    });
  });

  describe("Projects", () => {
    it("allows public access to list published projects", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.projects.list({ status: "published" });
      expect(Array.isArray(result)).toBe(true);
    });

    it("requires admin role to create projects", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.projects.create({
          title: "Test Project",
          slug: "test-project",
        })
      ).rejects.toThrow();
    });

    it("allows admin to create projects", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const ts = Date.now();

      const result = await caller.projects.create({
        title: `Test Project ${ts}`,
        slug: `test-project-${ts}`,
        excerpt: "A test project",
        status: "draft",
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("normalizes mixed-case project slugs on getBySlug", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const ts = Date.now();
      const slug = `test-project-${ts}`;

      await caller.projects.create({
        title: `Test Project ${ts}`,
        slug,
        excerpt: "A test project",
        status: "draft",
      });

      const result = await caller.projects.getBySlug({
        slug: slug.replace("test", "Test"),
      });

      expect(result).toBeTruthy();
      expect(result?.slug).toBe(slug);
    });
  });

  describe("News", () => {
    it("allows public access to list published news", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.news.list({ status: "published" });
      expect(Array.isArray(result)).toBe(true);
    });

    it("requires admin role to create news", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.news.create({
          title: "Test News",
          slug: "test-news",
          excerpt: "Test excerpt",
          date: new Date(),
        })
      ).rejects.toThrow();
    });
  });

  describe("Articles", () => {
    it("allows public access to list published articles", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.list({ status: "published" });
      expect(Array.isArray(result)).toBe(true);
    });

    it("requires admin role to create articles", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.articles.create({
          title: "Test Article",
          slug: "test-article",
          excerpt: "Test excerpt",
          content: "Test content",
        })
      ).rejects.toThrow();
    });

    it("allows admin to create articles with author", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const ts = Date.now();

      const result = await caller.articles.create({
        title: `Test Article ${ts}`,
        slug: `test-article-${ts}`,
        excerpt: "A test article",
        content: "This is test content",
        status: "draft",
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });
  });

  describe("Search", () => {
    it("allows public access to search content", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.search.query({ q: "test" });
      expect(result).toHaveProperty("projects");
      expect(result).toHaveProperty("news");
      expect(result).toHaveProperty("articles");
      expect(Array.isArray(result.projects)).toBe(true);
      expect(Array.isArray(result.news)).toBe(true);
      expect(Array.isArray(result.articles)).toBe(true);
    });
  });
});
