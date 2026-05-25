# Typography Audit

This audit was created in recovery mode. It checked active styling entry files, active layout files, and representative active shell/page components only. It does not authorize typography changes.

## Scope Checked

- `app/globals.css`
- `client/src/index.css`
- `app/layout.tsx`
- `app/studio/layout.tsx`
- `client/index.html`
- Active shared layout/navigation components: `Header`, `MobileMenu`, `Footer`, `AboutNav`, `ProfileSectionHero`, `PublishingTopBar`, `InfoPageShell`, and `SectionIntro`
- Representative active pages across systems: `Home`, `Projects`, `Articles`, `About`, `Resume`, `StudioApps`, `ScenicProjectDetail`, and `ArticleDetail`

Generated folders were not scanned.

## Current Fonts Found

### System UI Sans

Where found:

- `client/src/index.css` defines Tailwind `--font-sans` as `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- `client/src/index.css` sets `body`, global `h1`, `h2`, `h3`, `h4`, `.section-kicker`, and legacy `.font-pixel` to `var(--font-sans)`.

Notes:

- System UI is now the active intended primary site font.
- This restores the newer-looking stack that portfolio headings were already using through `font-sans`.
- Open Sans was tested and removed because it changed the scenic design portfolio too aggressively.

### DM Sans

Where found:

- `client/index.html` loads Google Fonts for `DM Sans` weights `400`, `500`, `600`, and `700`.

Notes:

- `DM Sans` appears to be the historical brand font.
- It is referenced in `client/index.html`, but active Next routes are driven by `app/layout.tsx` and `app/globals.css`.
- Treat this as legacy until the older client entry path is confirmed.

### Tailwind/System Sans

Where found:

- Heavy use of `font-sans` across active components and pages.
- Examples include `Header`, `MobileMenu`, `ProfileSectionHero`, `InfoPageShell`, `SectionIntro`, `Home`, `Projects`, `Articles`, `About`, `Resume`, `StudioApps`, `ScenicProjectDetail`, and `ArticleDetail`.

Computed check:

- Before the Open Sans source-of-truth change, `body` computed to `"DM Sans", -apple-system, "system-ui", "Segoe UI", sans-serif`.
- Before the change, the first `.font-sans` element computed to the Tailwind/system stack.
- The intended post-change state is that `body`, global headings, and `.font-sans` all resolve through `var(--font-sans)` to the same system UI stack.

Notes:

- This was the main inconsistency before the Open Sans source-of-truth change.
- Future checks should verify that `font-sans` no longer overrides headings into a different stack.

### Monospace

Where found:

- `font-mono` appears in production/tool contexts such as `ScaleCalculator`, `RoscoPaintCalculator`, `ArticleDetail` code/content areas, tutorial metadata, and a few modal/detail fields.

Notes:

- This appears intentional for values, code, measurements, formulas, and technical readouts.
- It should remain limited to utility/tool/code contexts.

### Serif

Where found:

- No active serif usage found in the narrow audit.

## Duplicate Font Packages or Imports

- No font package dependency was found in `package.json`.
- No `next/font` usage was found in active layout files.
- `client/index.html` references the same Google Fonts URL three times: preload, async stylesheet, and noscript fallback. That is a common loading pattern, but it may be legacy if `client/index.html` is no longer part of active Next rendering.

## Which Font Appears Primary

Current active primary:

- System UI sans, based on `client/src/index.css` `--font-sans`.

Historical/legacy primary:

- DM Sans remains referenced in `client/index.html`.

## Accidental or Legacy-Looking Usage

### Previous `font-sans` vs `DM Sans`

Likely accidental before the Open Sans source-of-truth change:

- Global CSS says headings use `DM Sans`.
- Many active page headings add `font-sans`, which computes to system UI instead.
- This creates mixed typography without a clear design rule.

### `.font-pixel`

Likely legacy:

- `client/src/index.css` keeps `.font-pixel` as a “legacy label helper” but maps it to the primary sans stack.
- The class name no longer describes the visual output.

### Google Font Loading Location

Possibly legacy:

- `DM Sans` is loaded from `client/index.html`, but active Next routes use `app/layout.tsx`.
- If `client/index.html` is from an older Vite/client entry path, this should not be the long-term font loading authority.

### Tracking Values

Potentially over-varied:

- Active pages use many tight tracking values: `-0.09em`, `-0.08em`, `-0.078em`, `-0.075em`, `-0.07em`, `-0.065em`, `-0.055em`, `-0.05em`, `-0.04em`, `-0.035em`, `-0.025em`, `-0.02em`, `-0.01em`, plus uppercase positive tracking such as `0.18em`, `0.22em`, `0.24em`, and `0.34em`.
- Some of this is intentional brand/editorial styling, but the spread makes future edits harder.

## Proposed Apple-Like Type System

### Primary Sans

Use one primary sans stack:

```css
ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Why:

- It follows the newer-looking system font direction without the Open Sans disruption.
- It keeps a clean Apple-like stack.
- It resolves previous `font-sans` versus global heading inconsistencies.
- It keeps the site feeling crisp across portfolio, profile, publishing, and app/tool contexts.

Alternative:

- Use system UI directly if the external font dependency becomes undesirable.

### Heading Scale

Define a small set of reusable heading roles instead of many one-off clamps:

- Display: homepage and major portfolio/profile heroes.
- Page title: route-level `h1`.
- Section title: major `h2` intros.
- Card title: cards and compact panels.
- Label/kicker: short metadata and section labels.

Suggested character:

- Display/page titles: medium or semibold, tight but not extreme tracking.
- Section titles: medium, slightly tight.
- Body: normal weight, relaxed line height.
- Labels/kickers: medium/semibold with controlled positive tracking only when uppercase.

### Body Scale

Use fewer body text levels:

- Body default: `1rem`, line height around `1.6`.
- Body large: `1.08rem` to `1.18rem`, line height `1.55` to `1.7`.
- Editorial body: allow taller line height around `1.8` to `1.9` for long-form article content.
- Caption/meta: `0.82rem` to `0.95rem`.

### Accent Usage

Limit accent typography:

- Keep `font-mono` only for measurements, code, formulas, IDs, and technical app values.
- Avoid adding a second display font.
- If `DM Sans` is retained, use it either as the single primary font or as a very limited brand accent. Do not let it compete with system UI across headings and body.

## Recommended First Typography Change

User preference after this audit: use the newer-looking font across the site. Open Sans was tested and rejected because it disrupted the scenic design portfolio.

First approved change should be one of these:

1. System-first path: make Tailwind `font-sans`, body, headings, `.section-kicker`, and legacy `.font-pixel` all resolve to the same system UI stack.
2. DM Sans path: make Tailwind `font-sans`, body, headings, and `.section-kicker` all resolve to the same `DM Sans` stack, and ensure the font is loaded from the active Next layout path.

Recommendation:

- Choose the system-first path based on the scenic design portfolio’s existing newer-looking typography.
- Apply it first to the typography source of truth only, then visually verify `/resume`, `/`, `/projects`, and `/articles` before touching page-specific heading scales.

## What Not To Change Yet

- Do not redesign individual pages.
- Do not standardize all heading sizes in one pass.
- Do not remove page-specific hero typography yet.
- Do not remove `font-mono` from tools/code contexts.
- Do not remove `DM Sans` loading until the active font-loading path is confirmed.
