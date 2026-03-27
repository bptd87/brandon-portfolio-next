import { NextResponse } from "next/server";

import { runAISiteSearch } from "../../../../lib/search/ai-site-search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (query.trim().length < 3) {
    return NextResponse.json(
      { error: "Query must be at least 3 characters." },
      { status: 400 }
    );
  }

  try {
    const result = await runAISiteSearch(query);

    if (!result) {
      return NextResponse.json({ result: null });
    }

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ result: null }, { status: 200 });
  }
}
