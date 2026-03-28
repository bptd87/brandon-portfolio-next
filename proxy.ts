import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LOW_VALUE_QUERY_PARAMS = new Set([
  "tag",
  "category",
  "discipline",
  "album_id",
  "year",
  "sort",
  "view",
  "series",
]);

function hasLowValueArchiveQuery(searchParams: URLSearchParams) {
  for (const key of LOW_VALUE_QUERY_PARAMS) {
    if (searchParams.has(key)) return true;
  }
  return false;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const response = NextResponse.next();

  if (pathname === "/search") {
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }

  if (hasLowValueArchiveQuery(searchParams)) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return response;
}

export const config = {
  matcher: ["/articles", "/projects/:path*", "/studio/tutorials", "/search"],
};
