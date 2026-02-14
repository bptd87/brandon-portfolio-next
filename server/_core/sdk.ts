import { COOKIE_NAME } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import type { Request } from "express";
import * as db from "../db";
import { supabase } from "../supabase";
import { ENV } from "./env";

// Simplified SDK replacing Manus functionality
export class SDKServer {
  async createSessionToken(
    openId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    // For now, return a dummy token or implement JWT signing if needed locally
    // Since we are migrating to Supabase Auth, this might be temporary
    return Buffer.from(JSON.stringify({ openId, name: options.name })).toString('base64');
  }

  async authenticateRequest(req: Request) {
    // Check for bearer token first (from Supabase Auth)
    let token = req.cookies?.[COOKIE_NAME];
    let isSupabaseToken = false;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      isSupabaseToken = true;
    }

    if (!token) {
      // Allow unauthenticated for public routes, but this method is usually called when auth is expected?
      // Actually trpc context calls this. If it returns null, that's fine for public procedures.
      // But if we throw, it blocks everything.
      // The original code threw ForbiddenError via checks using this user.
      // Let's return undefined if no token, and let the caller handle it?
      // sdk.authenticateRequest signature implies it returns User or throws.
      // The original implementation threw "Not authenticated".
      throw ForbiddenError("Not authenticated");
    }

    try {
      let openId: string;

      if (isSupabaseToken) {
        // Verify Supabase JWT
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) throw new Error("Invalid Supabase token");
        openId = user.id;

        // Sync user to our local DB
        await db.upsertUser({
          openId: user.id,
          email: user.email,
          lastSignedIn: new Date(),
        });

        if (user.id !== ENV.ownerOpenId) {
          console.log(`[Auth] User logged in with ID: ${user.id}. Expected OWNER_OPEN_ID: '${ENV.ownerOpenId}'`);
          console.log(`[Auth] WARNING: OWNER_OPEN_ID mismatch. Please restart the server if you recently updated .env`);
        } else {
          console.log(`[Auth] Admin login successful for user: ${user.id}`);
        }
      } else {
        // Legacy cookie auth (dev-login)
        const payload = JSON.parse(Buffer.from(token, 'base64').toString());
        openId = payload.openId;
      }

      if (!openId) throw new Error("No openId in token");

      const user = await db.getUserByOpenId(openId);
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (e) {
      console.error("[Auth] Authentication failed:", e);
      throw ForbiddenError("Invalid token");
    }
  }

  // Stubs for removed methods to satisfy potential interface usage during migration
  // Stubs for removed methods to satisfy potential interface usage during migration
  async exchangeCodeForToken(code: string, state: string): Promise<any> {
    throw new Error("Auth removed");
  }

  async getUserInfo(accessToken: string): Promise<any> {
    throw new Error("Auth removed");
  }
}

export const sdk = new SDKServer();
