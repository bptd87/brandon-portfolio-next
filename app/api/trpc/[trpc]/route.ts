import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { parse } from "cookie";

import { appRouter } from "../../../../server/routers";
import { sdk } from "../../../../server/_core/sdk";

export const dynamic = "force-dynamic";

function buildRequestLike(request: Request) {
  const url = new URL(request.url);
  const headers = Object.fromEntries(request.headers.entries());
  const cookies = parse(request.headers.get("cookie") ?? "");
  const forwardedFor = request.headers.get("x-forwarded-for");

  return {
    headers,
    cookies,
    protocol: url.protocol.replace(":", ""),
    hostname: url.hostname,
    ip: forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined,
  };
}

function buildResponseLike(resHeaders: Headers) {
  return {
    clearCookie(name: string, options: Record<string, unknown> = {}) {
      const path = typeof options.path === "string" ? options.path : "/";
      const httpOnly = typeof options.httpOnly === "boolean" ? options.httpOnly : true;
      const sameSite =
        options.sameSite === "strict" || options.sameSite === "none" || options.sameSite === "lax"
          ? options.sameSite
          : "lax";
      const secure = Boolean(options.secure);
      const domain = typeof options.domain === "string" ? options.domain : undefined;
      const cookieParts = [
        `${name}=`,
        `Path=${path}`,
        "Max-Age=0",
        "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        `SameSite=${sameSite[0].toUpperCase()}${sameSite.slice(1)}`,
      ];

      if (domain) cookieParts.push(`Domain=${domain}`);
      if (httpOnly) cookieParts.push("HttpOnly");
      if (secure) cookieParts.push("Secure");

      resHeaders.append(
        "set-cookie",
        cookieParts.join("; ")
      );
    },
  };
}

async function createTrpcContext(request: Request, resHeaders: Headers) {
  const req = buildRequestLike(request);
  const res = buildResponseLike(resHeaders);

  let user = null;

  try {
    user = await sdk.authenticateRequest(req as never);
  } catch {
    user = null;
  }

  return {
    req: req as never,
    res: res as never,
    user,
  };
}

async function handler(request: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext({ resHeaders }) {
      return createTrpcContext(request, resHeaders);
    },
    onError({ error, path }) {
      if (process.env.NODE_ENV !== "production") {
        console.error(`[tRPC] ${path ?? "unknown"} failed:`, error);
      }
    },
  });
}

export { handler as GET, handler as POST };
