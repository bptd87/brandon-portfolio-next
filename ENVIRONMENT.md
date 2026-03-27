# Environment Variables

This project now runs as a Next.js app with a static public site, an optional protected asset workbench, Blob-backed media migration in progress, and external analytics.

## Recommended Vercel Variables

### Canonical Site URL

```bash
SITE_URL="https://www.brandonptdavis.com"
NEXT_PUBLIC_SITE_URL="https://www.brandonptdavis.com"
```

`SITE_URL` is the server-side source of truth. `NEXT_PUBLIC_SITE_URL` is optional, but helps keep client-side links and previews aligned.

### Admin Authentication

```bash
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_KEY="your-service-role-key"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token"
ADMIN_EMAILS="you@example.com,second-admin@example.com"
```

These power:
- admin sign-in
- protected asset API routes
- media upload/browse/delete in `/admin`

`ADMIN_EMAILS` is optional if your Supabase users already carry `role=admin` in `app_metadata` or `user_metadata`. It is a clean fallback if you want to keep admin access out of the old local database layer.

### Contact Form

```bash
RESEND_API_KEY="your-resend-key"
CONTACT_FROM_EMAIL="hello@your-domain.com"
CONTACT_TO_EMAIL="you@your-domain.com"
```

### Analytics

```bash
NEXT_PUBLIC_ANALYTICS_DASHBOARD_URL="https://..."
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
NEXT_PUBLIC_POSTHOG_DASHBOARD_URL="https://us.posthog.com/project/..."
```

Current state:
- Vercel Analytics handles high-level site traffic and performance
- PostHog runs client-side for city/location analytics and custom events
- analytics are reviewed in external dashboards, not inside the site

## Local Development

Create `.env.local` or `.env` in the project root and add the values above.

```bash
pnpm dev
```

## Vercel Notes

- Set production values in Vercel Project Settings → Environment Variables.
- Use the same `SITE_URL` / `NEXT_PUBLIC_SITE_URL` in Production and Preview if you want stable canonical behavior.
- If `SITE_URL` is omitted, the app will fall back to Vercel URL hints, but the preferred production setup is to set it explicitly.

## Security Notes

- Never commit real secrets.
- Keep `SUPABASE_SERVICE_KEY` server-only.
- Only expose `NEXT_PUBLIC_*` variables intentionally.
# OpenAI
- `OPENAI_API_KEY`
- `OPENAI_SEARCH_MODEL`
  - Optional override for AI site search.
  - Default: `gpt-4.1-mini`
