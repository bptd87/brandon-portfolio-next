import { NextResponse } from "next/server";

import { getAdminUserFromRequest } from "../../../../lib/auth/admin-session";
import { fetchAnalyticsOverviewData } from "../../../../server/admin/fetchAnalyticsOverview";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getAdminUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const overview = await fetchAnalyticsOverviewData();
    return NextResponse.json(overview);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load analytics overview.",
      },
      { status: 500 }
    );
  }
}
