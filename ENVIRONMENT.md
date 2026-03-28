# Environment Variables

This project now runs as a mostly static Next.js site with Blob-backed media, Resend email, external analytics, and optional AI search.

## Recommended Active Variables

### Canonical Site URL

```bash
SITE_URL="https://www.brandonptdavis.com"
NEXT_PUBLIC_SITE_URL="https://www.brandonptdavis.com"
```

`SITE_URL` is the server-side source of truth. `NEXT_PUBLIC_SITE_URL` is optional but useful for consistent client-side URLs and previews.
When deployed on Vercel, the app also falls back to `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` and `VERCEL_PROJECT_PRODUCTION_URL` before using a preview deployment URL.

### Search Console Verification

```bash
GOOGLE_SITE_VERIFICATION="google-site-verification-token"
```

Optional. When present, this is emitted through Next.js metadata so Google Search Console verification can be managed from Vercel environment variables instead of hardcoding a meta tag.

### Vercel Blob

```bash
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token"
```

Used for:
- Blob media migrations
- any future upload tooling you keep around locally

### Contact Form

```bash
RESEND_API_KEY="re_..."
CONTACT_FROM_EMAIL="hello@your-domain.com"
CONTACT_TO_EMAIL="info@your-domain.com"
```

Notes:
- `CONTACT_FROM_EMAIL` should be a verified sender in Resend
- visitor email is handled as `replyTo`, not as the sender

### Analytics

```bash
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
NEXT_PUBLIC_POSTHOG_DASHBOARD_URL="https://us.posthog.com/project/..."
```

Current setup:
- Vercel Analytics handles site traffic/performance
- PostHog handles external event/location analytics

### AI Search

```bash
OPENAI_API_KEY="sk-..."
OPENAI_SEARCH_MODEL="gpt-4.1-mini"
```

`OPENAI_SEARCH_MODEL` is optional. If omitted, the app uses its default configured search model.

## Local Development

Create `.env.local` in the project root and add the values you need.

```bash
pnpm dev
```

## Vercel Notes

- Set production values in Project Settings → Environment Variables
- redeploy after changing env vars used by server routes
- if `SITE_URL` is missing, the app falls back to Vercel URL hints, but explicit production values are preferred

## Security Notes

- never commit real secrets
- only expose `NEXT_PUBLIC_*` variables intentionally
- keep Resend/OpenAI/Blob keys server-side unless a variable is explicitly meant for the browser

## Legacy Note

No Supabase environment variables are required for the live site or its remaining maintenance tooling.
