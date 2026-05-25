# Repo Map

This map is intentionally shallow. It is based on top-level folders only and should stay lightweight while the repo is in recovery mode.

## Top-Level Folders

- `api/` - API-related entry point folder. Currently empty from the shallow check.
- `app/` - Next.js app routes and app-level pages.
- `client/` - Client-side source and public assets. Contains `client/public/images/`, which should be treated carefully because image folders can grow.
- `components/` - Shared React components.
- `content/` - Content files used by the site.
- `docs/` - Lightweight project documentation and recovery notes.
- `lib/` - Shared application utilities.
- `node_modules/` - Installed dependencies. Do not scan or edit.
- `output/` - Generated or temporary output. Do not scan or edit unless explicitly requested.
- `patches/` - Package or dependency patch files.
- `public/` - Public static assets. Currently shallow check showed no `public/media/` folder.
- `scripts/` - Project scripts and one-off maintenance utilities.
- `server/` - Server-side helpers and admin-related code.
- `shared/` - Shared code used across app/client/server boundaries.

## Confirmed Large or Generated Paths

- `.next/` - Next.js build output, approximately 1.5 GB during recovery check. Ignore for agent work.
- `node_modules/` - Installed dependencies, approximately 293 MB during recovery check. Ignore for agent work.
- `client/public/images/` - Asset folder, approximately 15 MB during recovery check. Inspect only targeted files.
- `output/` - Ignored generated output folder.

## Recovery Notes

- Avoid broad repository audits until stability is restored.
- Start with config files and the exact files named in the user request.
- Keep future repo maps shallow unless the user asks for a deeper inventory.
