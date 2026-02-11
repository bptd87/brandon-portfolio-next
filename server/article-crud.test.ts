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

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
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

describe("Article CRUD Operations", () => {
  const ts = Date.now();

  describe("Article Creation", () => {
    it("creates an article with block-based content", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const blocks = JSON.stringify([
        { type: "paragraph", text: "This is a test paragraph." },
        { type: "heading", level: 2, text: "Test Heading" },
        { type: "image", url: "https://example.com/test.jpg", caption: "Test image", alt: "Test" },
        { type: "list", listType: "bullet", items: ["Item 1", "Item 2"] },
        { type: "quote", text: "A test quote", author: "Test Author" },
        { type: "faq", items: [{ question: "Q1?", answer: "A1." }] },
      ]);

      const result = await caller.articles.create({
        title: `Block Test Article ${ts}`,
        slug: `block-test-article-${ts}`,
        excerpt: "Testing block-based content",
        content: blocks,
        status: "draft",
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("creates an article with SEO fields", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.create({
        title: `SEO Test Article ${ts}`,
        slug: `seo-test-article-${ts}`,
        excerpt: "Testing SEO fields",
        content: "Test content",
        seoTitle: "Custom SEO Title",
        seoDescription: "Custom SEO description for search engines",
        seoKeywords: "test, seo, article",
        status: "draft",
      });

      expect(result).toHaveProperty("id");
    });

    it("rejects article creation from non-admin user", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.articles.create({
          title: "Unauthorized Article",
          slug: "unauthorized-article",
          excerpt: "Should fail",
          content: "Content",
        })
      ).rejects.toThrow();
    });

    it("rejects article creation from unauthenticated user", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.articles.create({
          title: "Public Article",
          slug: "public-article",
          excerpt: "Should fail",
          content: "Content",
        })
      ).rejects.toThrow();
    });
  });

  describe("Article Retrieval", () => {
    it("lists published articles publicly", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.list({ status: "published" });
      expect(Array.isArray(result)).toBe(true);
      // All returned articles should be published
      for (const article of result) {
        expect(article.status).toBe("published");
      }
    });

    it("returns article by ID with all fields", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // First get a list to find an ID
      const list = await caller.articles.list({ status: "published" });
      if (list.length === 0) return; // Skip if no articles

      const article = await caller.articles.getById({ id: list[0].id });
      expect(article).toBeDefined();
      expect(article).toHaveProperty("id");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("slug");
      expect(article).toHaveProperty("content");
      expect(article).toHaveProperty("excerpt");
    });

    it("returns article by slug", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const list = await caller.articles.list({ status: "published" });
      if (list.length === 0) return;

      const article = await caller.articles.getBySlug({ slug: list[0].slug });
      expect(article).toBeDefined();
      expect(article?.slug).toBe(list[0].slug);
    });

    it("returns null for non-existent slug", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const article = await caller.articles.getBySlug({ slug: "non-existent-slug-xyz-12345" });
      expect(article).toBeFalsy();
    });
  });

  describe("Article Update", () => {
    it("updates article title and content", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a test article first
      const created = await caller.articles.create({
        title: `Update Test ${ts}`,
        slug: `update-test-${ts}`,
        excerpt: "Original excerpt",
        content: "Original content",
        status: "draft",
      });

      // Update it
      const result = await caller.articles.update({
        id: created.id,
        title: `Updated Title ${ts}`,
        excerpt: "Updated excerpt",
        content: JSON.stringify([
          { type: "paragraph", text: "Updated paragraph content" },
          { type: "heading", level: 2, text: "Updated Heading" },
        ]),
      });

      expect(result).toEqual({ success: true });

      // Verify the update
      const updated = await caller.articles.getById({ id: created.id });
      expect(updated?.title).toBe(`Updated Title ${ts}`);
      expect(updated?.excerpt).toBe("Updated excerpt");
    });

    it("rejects update from non-admin user", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.articles.update({
          id: 1,
          title: "Unauthorized Update",
        })
      ).rejects.toThrow();
    });
  });

  describe("Article Delete", () => {
    it("deletes an article", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a test article
      const created = await caller.articles.create({
        title: `Delete Test ${ts}`,
        slug: `delete-test-${ts}`,
        excerpt: "To be deleted",
        content: "Content to delete",
        status: "draft",
      });

      // Delete it
      const result = await caller.articles.delete({ id: created.id });
      expect(result).toEqual({ success: true });

      // Verify it's gone
      const deleted = await caller.articles.getById({ id: created.id });
      expect(deleted).toBeFalsy();
    });

    it("rejects delete from non-admin user", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.articles.delete({ id: 999999 })
      ).rejects.toThrow();
    });
  });
});

describe("News CRUD Operations", () => {
  const ts = Date.now();

  describe("News Creation", () => {
    it("creates a news item with all fields", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.news.create({
        title: `Test News ${ts}`,
        slug: `test-news-${ts}`,
        excerpt: "Test news excerpt",
        date: new Date(),
        status: "draft",
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("creates a news item with blocks content", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const blocks = JSON.stringify([
        { type: "paragraph", text: "News paragraph content" },
        { type: "heading", level: 2, text: "News Section" },
      ]);

      const result = await caller.news.create({
        title: `Block News ${ts}`,
        slug: `block-news-${ts}`,
        excerpt: "News with blocks",
        date: new Date(),
        blocks,
        status: "draft",
      });

      expect(result).toHaveProperty("id");
    });
  });

  describe("News Retrieval", () => {
    it("lists published news publicly", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.news.list({ status: "published" });
      expect(Array.isArray(result)).toBe(true);
    });

    it("returns news by ID", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const list = await caller.news.list({ status: "published" });
      if (list.length === 0) return;

      const item = await caller.news.getById({ id: list[0].id });
      expect(item).toBeDefined();
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("slug");
    });

    it("returns news by slug", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const list = await caller.news.list({ status: "published" });
      if (list.length === 0) return;

      const item = await caller.news.getBySlug({ slug: list[0].slug });
      expect(item).toBeDefined();
      expect(item?.slug).toBe(list[0].slug);
    });
  });

  describe("News Update", () => {
    it("updates a news item", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const created = await caller.news.create({
        title: `Update News ${ts}`,
        slug: `update-news-${ts}`,
        excerpt: "Original",
        date: new Date(),
        status: "draft",
      });

      const result = await caller.news.update({
        id: created.id,
        title: `Updated News ${ts}`,
        excerpt: "Updated excerpt",
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("News Delete", () => {
    it("deletes a news item", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const created = await caller.news.create({
        title: `Delete News ${ts}`,
        slug: `delete-news-${ts}`,
        excerpt: "To delete",
        date: new Date(),
        status: "draft",
      });

      const result = await caller.news.delete({ id: created.id });
      expect(result).toEqual({ success: true });
    });
  });
});

describe("Category CRUD Operations", () => {
  const ts = Date.now();

  describe("Category Types", () => {
    it("filters categories by type", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const newsCategories = await caller.categories.list({ type: "news" });
      expect(Array.isArray(newsCategories)).toBe(true);
      for (const cat of newsCategories) {
        expect(cat.type).toBe("news");
      }

      const articleCategories = await caller.categories.list({ type: "article" });
      expect(Array.isArray(articleCategories)).toBe(true);
      for (const cat of articleCategories) {
        expect(cat.type).toBe("article");
      }
    });
  });

  describe("Category CRUD", () => {
    it("creates and deletes a category", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const created = await caller.categories.create({
        name: `Test Cat ${ts}`,
        slug: `test-cat-${ts}`,
        type: "article",
      });

      expect(created).toHaveProperty("id");

      // Clean up
      const result = await caller.categories.delete({ id: created.id });
      expect(result).toEqual({ success: true });
    });

    it("updates a category", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const created = await caller.categories.create({
        name: `Update Cat ${ts}`,
        slug: `update-cat-${ts}`,
        type: "news",
      });

      const result = await caller.categories.update({
        id: created.id,
        name: `Updated Cat ${ts}`,
        slug: `updated-cat-${ts}`,
      });

      expect(result).toEqual({ success: true });

      // Clean up
      await caller.categories.delete({ id: created.id });
    });
  });
});
