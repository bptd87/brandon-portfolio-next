import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

describe("Tutorial Progress Tracking", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let testUserId: number;

  beforeAll(async () => {
    // Create a test user
    const testUser = {
      openId: `test-${Date.now()}`,
      name: "Test User",
      email: "test@example.com",
      loginMethod: "test",
    };
    
    await db.upsertUser(testUser);
    const user = await db.getUserByOpenId(testUser.openId);
    if (!user) throw new Error("Failed to create test user");
    testUserId = user.id;

    // Create authenticated caller
    const authUser: AuthenticatedUser = {
      id: testUserId,
      openId: testUser.openId,
      name: testUser.name!,
      email: testUser.email!,
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const ctx: TrpcContext = {
      user: authUser,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    caller = appRouter.createCaller(ctx);
  });

  it("should toggle tutorial watched status", async () => {
    const tutorialSlug = "navigating-user-interface";

    // Mark as watched
    const result1 = await caller.tutorialProgress.toggleWatched({
      tutorialSlug,
    });
    expect(result1.watched).toBe(true);

    // Verify it's marked as watched
    const progress1 = await caller.tutorialProgress.getProgress();
    const watched1 = progress1.find(p => p.tutorialSlug === tutorialSlug);
    expect(watched1).toBeDefined();
    expect(watched1?.watched).toBe(true);

    // Toggle back to unwatched
    const result2 = await caller.tutorialProgress.toggleWatched({
      tutorialSlug,
    });
    expect(result2.watched).toBe(false);

    // Verify it's marked as unwatched
    const progress2 = await caller.tutorialProgress.getProgress();
    const watched2 = progress2.find(p => p.tutorialSlug === tutorialSlug);
    expect(watched2?.watched).toBe(false);
  });

  it("should return empty progress for new users", async () => {
    const newTestUser = {
      openId: `test-new-${Date.now()}`,
      name: "New Test User",
      email: "newtest@example.com",
      loginMethod: "test",
    };
    
    await db.upsertUser(newTestUser);
    const user = await db.getUserByOpenId(newTestUser.openId);
    if (!user) throw new Error("Failed to create new test user");

    const newUser: AuthenticatedUser = {
      id: user.id,
      openId: newTestUser.openId,
      name: newTestUser.name!,
      email: newTestUser.email!,
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const newCtx: TrpcContext = {
      user: newUser,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const newCaller = appRouter.createCaller(newCtx);

    const progress = await newCaller.tutorialProgress.getProgress();
    expect(progress).toEqual([]);
  });

  it("should track multiple tutorials independently", async () => {
    const tutorial1 = "navigating-user-interface";
    const tutorial2 = "understanding-classes";

    // Mark tutorial1 as watched
    await caller.tutorialProgress.toggleWatched({ tutorialSlug: tutorial1 });

    // Mark tutorial2 as watched
    await caller.tutorialProgress.toggleWatched({ tutorialSlug: tutorial2 });

    // Get progress
    const progress = await caller.tutorialProgress.getProgress();
    const watched1 = progress.find(p => p.tutorialSlug === tutorial1);
    const watched2 = progress.find(p => p.tutorialSlug === tutorial2);

    expect(watched1?.watched).toBe(true);
    expect(watched2?.watched).toBe(true);

    // Unmark tutorial1
    await caller.tutorialProgress.toggleWatched({ tutorialSlug: tutorial1 });

    // Verify tutorial1 is unwatched but tutorial2 is still watched
    const progress2 = await caller.tutorialProgress.getProgress();
    const watched1After = progress2.find(p => p.tutorialSlug === tutorial1);
    const watched2After = progress2.find(p => p.tutorialSlug === tutorial2);

    expect(watched1After?.watched).toBe(false);
    expect(watched2After?.watched).toBe(true);
  });
});
