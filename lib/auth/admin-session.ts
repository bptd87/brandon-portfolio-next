import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parse } from "cookie";

import * as db from "../../server/db";
import { supabase as serviceSupabase } from "../../server/supabase";
import { COOKIE_NAME } from "../../shared/const";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

function getSupabaseAuthClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase URL or anon key.");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSafeReturnPath(returnPath?: string | null) {
  if (!returnPath || !returnPath.startsWith("/") || returnPath.startsWith("//")) {
    return "/admin";
  }

  return returnPath;
}

export async function getUserFromAccessToken(token?: string | null) {
  if (!token) return null;

  const {
    data: { user },
    error,
  } = await serviceSupabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  await db.upsertUser({
    openId: user.id,
    email: user.email ?? null,
    name:
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
      (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
      user.email ||
      null,
    lastSignedIn: new Date(),
  });

  return (await db.getUserByOpenId(user.id)) ?? null;
}

export async function getCurrentAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value ?? null;
  const user = await getUserFromAccessToken(token);

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

export async function getAdminUserFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = parse(cookieHeader)[COOKIE_NAME] ?? null;
  const user = await getUserFromAccessToken(token);

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

export async function signInAdminUser(email: string, password: string) {
  const supabase = getSupabaseAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const accessToken = data.session?.access_token;

  if (!accessToken) {
    throw new Error("Supabase did not return a session.");
  }

  const user = await getUserFromAccessToken(accessToken);

  if (!user) {
    throw new Error("Unable to verify the signed-in account.");
  }

  if (user.role !== "admin") {
    throw new Error("Admin access required.");
  }

  return {
    accessToken,
    expiresIn: data.session?.expires_in ?? 60 * 60,
    user,
  };
}

export function applySessionCookie(response: NextResponse, accessToken: string, expiresIn = 60 * 60) {
  response.cookies.set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: expiresIn,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}
