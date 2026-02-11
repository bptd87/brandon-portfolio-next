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
  it("every project should have at least one tag", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const projects = await caller.projects.list({});
    for (const project of projects) {
      const detail = await caller.projects.getBySlug({ slug: project.slug });
      expect(detail, `Project "${project.title}" not found`).not.toBeNull();
      if (detail && detail.tags) {
        expect(
          detail.tags.length,
          `Project "${project.title}" has no tags`
        ).toBeGreaterThan(0);
      }
    }
  });
});
