import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-static";

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/articles/rss.xml", request.url), 308);
}
