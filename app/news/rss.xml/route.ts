import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/articles/rss.xml", request.url), 308);
}
