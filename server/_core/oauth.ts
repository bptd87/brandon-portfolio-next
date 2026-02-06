import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      console.log('[OAuth] User info received:', { openId: userInfo.openId, name: userInfo.name, email: userInfo.email });
      
      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });
      
      console.log('[OAuth] User upserted successfully');

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      console.log('[OAuth] Setting cookie with options:', cookieOptions);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      console.log('[OAuth] Cookie set successfully');

      // Parse state to get the original redirect URI or return path
      let redirectPath = "/";
      try {
        const decodedState = atob(state);
        // Check if state contains a return path (e.g., "/admin")
        const url = new URL(decodedState);
        const returnPath = url.searchParams.get("returnPath");
        if (returnPath) {
          redirectPath = returnPath;
        }
      } catch (e) {
        // If state parsing fails, default to homepage
      }

      // For browsers that block third-party cookies, pass token in URL
      // The client will store it in localStorage as a fallback
      const redirectUrl = new URL(redirectPath, `${req.protocol}://${req.get('host')}`);
      redirectUrl.searchParams.set('session_token', sessionToken);
      
      res.redirect(302, redirectUrl.pathname + redirectUrl.search);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
