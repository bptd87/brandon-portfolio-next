import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient, type User as SupabaseUser } from "@supabase/supabase-js";
import { parse } from "cookie";

import { supabase as serviceSupabase } from "../../server/supabase";
import { COOKIE_NAME } from "../../shared/const";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

type AdminUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: "admin";
};

function getConfiguredAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  return new Set(
    raw
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  );
}

function getSupabaseUserRole(user: SupabaseUser) {
  const appRole = user.app_metadata?.role;
  if (typeof appRole === "string" && appRole.trim()) {
    return appRole.trim().toLowerCase();
  }

  const metadataRole = user.user_metadata?.role;
  if (typeof metadataRole === "string" && metadataRole.trim()) {
    return metadataRole.trim().toLowerCase();
  }

  return null;
}

function toAdminUser(user: SupabaseUser): AdminUser | null {
  const normalizedEmail = user.email?.trim().toLowerCase() ?? null;
  const configuredAdminEmails = getConfiguredAdminEmails();
  const role = getSupabaseUserRole(user);

  if (role !== "admin" && (!normalizedEmail || !configuredAdminEmails.has(normalizedEmail))) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
    name:
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
      (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
      user.email ||
      null,
    role: "admin",
  };
}

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

  return toAdminUser(user);
}

export async function getCurrentAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value ?? null;
  const user = await getUserFromAccessToken(token);

  if (!user) {
    return null;
  }

  return user;
}

export async function getAdminUserFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = parse(cookieHeader)[COOKIE_NAME] ?? null;
  const user = await getUserFromAccessToken(token);

  if (!user) {
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
