import { NextResponse } from "next/server";

import { runLocalSiteSearch } from "../../../../lib/search/site-search-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  return NextResponse.json({
    results: runLocalSiteSearch(query, 24),
  });
}
