# Brandon PT Davis Portfolio

Next.js portfolio site for scenic, rendering, experiential, and writing work by Brandon PT Davis.

## Current Stack

- App: Next.js 16 + React 19 + Tailwind CSS 4
- Public content: local files in `content/*` and `shared/*`
- Media: Vercel Blob + local public assets
- Email: Resend
- Analytics: Vercel Analytics + client-side PostHog
- Deployment: Vercel

## Current Status

- The public site is largely static or SSG.
- Admin/auth has been removed from the live app.
- Most public media has been migrated away from Supabase.
- Some legacy migration/generator scripts still reference Supabase for historical maintenance tasks.

## Getting Started

### Prerequisites

- Node.js 24.x preferred
- pnpm
- Access to project environment variables

### Install

```bash
pnpm install
```

### Environment

See [ENVIRONMENT.md](/Users/brandonptdavis/Documents/Code/brandon-portfolio-v2/ENVIRONMENT.md).

Typical active variables:

- `SITE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `GOOGLE_SITE_VERIFICATION`
- `BLOB_READ_WRITE_TOKEN`
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_POSTHOG_DASHBOARD_URL`
- `OPENAI_API_KEY`
- `OPENAI_SEARCH_MODEL`

### Run

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

## Project Shape

```text
app/                 Next App Router routes
client/src/          page components and UI
content/             article and tutorial source files
shared/              local public data snapshots and helpers
scripts/             migration / generation / maintenance scripts
client/public/       static public assets
```

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm test
pnpm run migrate:manus-assets:blob -- --write
```

## Notes

- The public site no longer depends on Supabase at runtime.
- Tutorial pages intentionally use YouTube embeds and thumbnails.
