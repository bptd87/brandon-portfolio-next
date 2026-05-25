# Agent Operating Rules

This repository has triggered resource exhaustion during broad automated analysis. Keep all agent work narrow, explicit, and recovery-friendly.

## Required Workflow

- Make targeted edits only.
- Read the smallest relevant files or file ranges before changing code.
- Prefer known entry points from the user's request over repository-wide discovery.
- Check config files first when diagnosing setup issues: `package.json`, `next.config.*`, `tsconfig.json`, `.gitignore`, and this file.
- Do not run a full build until the repo is stable or the user explicitly asks for it.
- Do not refactor without a short plan and confirmation of scope.
- Do not quarantine, delete, or reorganize files while the repo is in recovery mode.

## Forbidden Broad Audits

- Do not scan the whole repo.
- Do not recursively inspect generated, dependency, cache, output, archive, or media folders.
- Do not run commands that traverse every file unless the user explicitly approves the scope.
- Do not run formatters across the whole repo.

## Always Avoid These Paths

- `node_modules/`
- `.next/`
- `dist/`
- `build/`
- `cache/`
- `.cache/`
- `output/`
- `public/media/`
- `client/public/images/archive/`
- `client/public/images/archives/`
- `legacy/`
- `archive/`
- `archives/`

## Verification

- Prefer narrow checks for touched files.
- When checking localhost pages, request status only. Do not print full HTML, RSC payloads, or large response bodies into Codex.
- Keep browser verification to one route at a time, and avoid repeated screenshots on image-heavy pages unless the user explicitly asks.
- Read only the newest relevant log lines, and stop if logs contain repeated large hydration or stack traces.
- Stop local dev servers after crash triage unless the user is actively visually reviewing the page.
- Use full builds only after targeted checks pass and the user is ready.
- If a command starts consuming excessive memory or time, stop and report the smallest useful next step.
