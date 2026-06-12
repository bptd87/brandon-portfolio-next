# Article Publication Workflow

Use this when you want to write articles ahead of time and publish them later.

## Create A Future Article

Run:

```bash
pnpm article:new "Article Title Here" --date 2026-07-15
```

That creates:

- `content/articles/article-title-here/meta.yaml`
- `content/articles/article-title-here/blocks.json`

The default status is `scheduled` when a date is provided. Scheduled articles stay hidden until their `publishedAt` date has passed and the site rebuilds.

## Status Options

- `draft`: never public.
- `scheduled`: public only after `publishedAt`.
- `published`: public when `publishedAt` is not in the future.

Examples:

```bash
pnpm article:new "A Draft Idea" --status draft
pnpm article:new "A Scheduled Essay" --date 2026-08-01
pnpm article:new "Ready Now" --status published --date 2026-06-12
```

## Before Publishing

Edit `meta.yaml`:

- Replace the `excerpt`.
- Add `seoDescription`.
- Add keywords if useful.
- Add a real cover image and alt text.
- Confirm `publishedAt`.

Edit `blocks.json`:

- Replace the placeholder paragraph with the article body.

Then run:

```bash
pnpm generate:file-first-article-overrides
pnpm check
```

## Important

The site is statically generated. A scheduled article becomes public only when Vercel rebuilds after the scheduled date.

This repo has a daily Vercel Cron route configured for that:

- Cron path: `/api/cron/scheduled-article-rebuild`
- Schedule: `20 16 * * *`
- Time: 16:20 UTC daily, which is mid-morning Pacific during daylight time

The cron route triggers a Vercel Deploy Hook stored in the production environment variable:

```bash
SCHEDULED_ARTICLE_REBUILD_HOOK_URL
```

Keep that URL out of Git. Vercel treats deploy hook URLs like tokens because anyone with the URL can trigger a deployment.
