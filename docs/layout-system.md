# Layout System

This document proposes a layered layout strategy for active pages. It does not authorize a refactor.

## Current Visual Systems

### Dark Portfolio / Article / App Pages

Examples:

- `client/src/pages/Projects.tsx`
- `client/src/pages/StudioApps.tsx`
- Project detail pages such as `client/src/pages/ScenicProjectDetail.tsx`

Traits:

- Dark backgrounds, often `bg-[#111111]`, `bg-black`, or token-based `bg-background`.
- White foreground text.
- Media-led hierarchy.
- Dense filters, grids, app panels, and technical controls.

### Light About / Tutorial / Publishing Pages

Examples:

- `client/src/pages/About.tsx`
- `client/src/pages/UpcomingProductions.tsx`
- `client/src/pages/Articles.tsx`

Traits:

- Warm light background, often `#f1f0ec`.
- Black foreground text.
- Large soft editorial headings.
- White/light card surfaces and softer shadows.
- Section-specific navigation such as `AboutNav` and `PublishingTopBar`.

### Hybrid Homepage

Example:

- `client/src/pages/Home.tsx`

Traits:

- Full-bleed dark hero.
- Light editorial sections.
- Custom full-bleed category panels.
- Horizontal rails.
- Strong brand storytelling moments.

Do not flatten the homepage into the same shell as the rest of the site.

## Existing Layout Components

| Component | What it already solves |
| --- | --- |
| `InfoPageShell` | Repeats header, SEO, info-page title block, local info-page nav, content container, and footer. |
| `ProfileSectionHero` | Repeats light profile page hero, metadata/share controls, hero title, description, and image. |
| `PublishingTopBar` | Repeats publishing subnav and search field. |
| `Header` | Global navigation. |
| `Footer` | Shared footer with dark/light tones. |
| `AnimatedSection` | Shared entrance motion wrapper. |

## Recommended Foundation Primitives

These primitives should be small and tone-aware.

### `PageShell`

Purpose:

- Own background tone, text tone, header, optional section nav, main wrapper, and footer tone.

Possible tones:

- `dark`
- `light`
- `publish`
- `profile`
- `hybrid`

Use carefully:

- This should not erase unique page structure.
- It should mainly remove repeated `Header`, `Footer`, and top-level background wiring.

### `SectionIntro`

Purpose:

- Standardize eyebrow/kicker, heading, description, and optional action area.

Why it should be first:

- Repeats across `Home`, `UpcomingProductions`, `Projects`, `Articles`, `StudioApps`, `InfoPageShell`, and profile pages.
- Low visual risk when tone and alignment remain configurable.
- Gives future design edits one place to adjust heading rhythm without forcing cards to match.

Suggested props:

- `eyebrow`
- `title`
- `description`
- `actions`
- `tone`
- `align`
- `maxWidth`
- `titleGradient`

### `SectionFrame`

Purpose:

- Standardize spacing, gutters, max width, border placement, and background.

Possible props:

- `tone`
- `width`
- `spacing`
- `border`
- `bleed`

Use carefully:

- Full-bleed homepage and project-detail media sections should opt out.

### `HorizontalRail`

Purpose:

- Standardize horizontal scrolling, scrollbar hiding, padding, snap behavior, and arrow controls.

Why useful:

- Horizontal rails repeat in homepage publish/upcoming sections, about exploration/gallery sections, and media galleries.
- It reduces duplicated interaction without flattening card visuals.

## Specialized Layout Types

### Portfolio Collection Layout

Used by:

- `Projects`
- Portfolio archive variants

Owns:

- Dark hero.
- Filters and sorting controls.
- Project grid/list regions.
- View-transition behavior.

Keep specialized.

### Publishing Archive Layout

Used by:

- `Articles`
- Tutorial archive pages

Owns:

- Publishing subnav.
- Light editorial hero.
- Category filtering.
- Article/tutorial card grid.

Candidate for future consolidation after `SectionIntro`.

### Profile Section Layout

Used by:

- `About`
- `Resume`
- `CreativeStatement`
- `TeachingPhilosophy`
- `Collaborators`
- `UpcomingProductions`

Owns:

- Light tone.
- `AboutNav`.
- Often `ProfileSectionHero`.
- Profile-specific cards and rails.

Already partly standardized.

### Studio Tool Layout

Used by:

- Studio app index.
- Individual tools such as scale calculator, dimension reference, paint calculator, and converter.

Owns:

- Denser work-focused layout.
- Controls, panels, form inputs, and utility-specific state.

Keep specialized and avoid decorative generalization.

### Homepage Layout

Used by:

- `Home`

Owns:

- Hybrid brand story.
- Full-bleed hero and category panels.
- Rail sections.
- Profile bridge.

Keep page-specific for now.

## First Reusable Component Recommendation

Build `SectionIntro` first.

It should be a foundation component, not a page-specific visual system. It can make future design edits faster by centralizing the repeated structure:

- Eyebrow/kicker.
- Large heading.
- Optional description.
- Optional action buttons.
- Tone and alignment.

It should not choose the whole page background, card style, or media treatment.

## Pattern That Should Remain Page-Specific

Keep project detail media layouts page-specific for now.

They contain orientation detection, lightbox behavior, embedded media handling, captions, and display variants. This is meaningful domain logic, not simple duplicated layout.

## Suggested Order of Operations

1. Create `SectionIntro` with tone-safe options.
2. Use it on one low-risk page section only.
3. Visually verify that page.
4. Expand to one related section family after approval.
5. Only then consider `HorizontalRail` or card-family extraction.
