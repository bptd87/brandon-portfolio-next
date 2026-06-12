export const dynamic = "force-dynamic";

const CRON_USER_AGENT = "vercel-cron/1.0";

function isAuthorizedCronRequest(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    return request.headers.get("authorization") === `Bearer ${cronSecret}`;
  }

  return request.headers.get("user-agent") === CRON_USER_AGENT;
}

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const deployHookUrl = process.env.SCHEDULED_ARTICLE_REBUILD_HOOK_URL;

  if (!deployHookUrl) {
    return Response.json(
      {
        ok: false,
        error: "Missing SCHEDULED_ARTICLE_REBUILD_HOOK_URL",
      },
      { status: 500 }
    );
  }

  const response = await fetch(deployHookUrl, {
    method: "POST",
    cache: "no-store",
  });

  if (!response.ok) {
    return Response.json(
      {
        ok: false,
        error: "Deploy hook request failed",
        status: response.status,
      },
      { status: 502 }
    );
  }

  return Response.json({
    ok: true,
    triggered: true,
    checkedAt: new Date().toISOString(),
  });
}
