# Component Map

This document was created in recovery mode. It is based on active route imports and representative active pages only; it is not a full repository audit.

## Active Shared UI Components Observed

| Component | Current role | Active route usage pattern |
| --- | --- | --- |
| `client/src/components/Header.tsx` | Primary site navigation. | Used across active client-backed routes, including `/`, `/projects`, `/articles`, `/studio`, profile pages, app pages, and `/news`. |
| `client/src/components/AboutNav.tsx` | Profile/about section navigation. | Used on `/about`, `/resume`, `/creative-statement`, `/about/teaching`, `/about/collaborators`, `/upcoming-productions`, production detail pages, and syllabus pages. |
| `client/src/components/Footer.tsx` | Global footer with `dark` and `light` tones. | Used across portfolio, article, studio, info, and profile pages. |
| `client/src/components/ProfileSectionHero.tsx` | Light profile-section hero with share controls and an icon/image. | Used by profile-adjacent active pages such as upcoming productions, resume, teaching, collaborators, and creative statement. |
| `client/src/components/SectionIntro.tsx` | Tone-aware section intro/header primitive. | First used on `/resume` for the “Selected Scenic Design” and “Earlier” section intros. |
| `client/src/components/InfoPageShell.tsx` | Shell for site information pages. | Used by privacy, terms, FAQ, accessibility, and sitemap pages. |
| `client/src/components/PublishingTopBar.tsx` | Publishing section subnavigation with search. | Used by article/tutorial archive pages. |
| `client/src/components/AnimatedSection.tsx` | Small animation wrapper around `FadeIn`. | Used across article, studio, portfolio detail, profile, and app pages. |
| `client/src/components/ProgressiveImage.tsx` | Image loading/positioning utility. | Used heavily in project detail and media-rich pages. |
| `client/src/components/Lightbox.tsx` | Media detail overlay. | Used by project detail pages. |
| `client/src/components/SEO.tsx` and `StructuredData.tsx` | Metadata and structured data helpers. | Used broadly across active pages. |
| `client/src/components/ui/*` | Lower-level controls from the local UI set. | Used by app/tool pages, filters, dialogs, accordions, tabs, and form controls. |

## Repeated Page-Level Patterns

### Navigation

- Primary global navigation is now `client/src/components/Header.tsx`.
- Secondary navigation exists in specialized bars: `AboutNav` for profile pages and `PublishingTopBar` for publishing pages.
- This matches the site’s layered behavior: global nav plus section-specific nav.

### Headers and Hero Areas

- `ProfileSectionHero` already standardizes one light profile-section hero pattern.
- Dark portfolio pages use large black header sections with filter controls, as seen in `client/src/pages/Projects.tsx`.
- Publishing pages use a lighter editorial hero system with custom imagery and `PublishingTopBar`, as seen in `client/src/pages/Articles.tsx`.
- The homepage uses custom full-bleed hero and feature sections. It should remain more bespoke.

### Cards

- Several card families repeat, but they are not interchangeable:
- Light production cards in `UpcomingProductions.tsx`.
- White editorial article cards in `Articles.tsx`.
- Dark image-led project cards in `Projects.tsx`.
- Light profile navigation cards in `About.tsx`.
- Dark app/tool cards in `StudioApps.tsx`.
- Media gallery figures in project detail pages.

### Section Layouts

- Many pages repeat an eyebrow/kicker, large heading, optional description, optional actions, and a max-width container.
- Container widths repeat around `max-w-[88rem]`, `max-w-[76rem]`, and `max-w-6xl`.
- Section spacing repeats with `py-16 md:py-24`, `pb-20`, `pt-24`, and similar responsive spacing.

### Image/Text Blocks

- Project detail pages have highly specialized media logic and should stay specialized.
- Homepage full-bleed image/text sections are strong identity moments and should remain page-specific for now.
- Studio app and profile pages have repeatable image/text feature blocks that could eventually use a shared layout primitive.

### Footers

- `Footer` already has a useful tone split: `dark` and `light`.
- It should be treated as a stable shared component rather than part of the immediate cleanup work.

## Layered Component Strategy

### Layer 1: Foundations

These should define stable values and small primitives without forcing every page into one look:

- Page gutters: the repeated `px-[clamp(1.5rem,5vw,6rem)]` pattern.
- Section widths: `88rem`, `76rem`, `6xl`, and narrow text widths.
- Heading rhythm: kicker, title, description, actions.
- Tone values: dark portfolio, light profile/publishing, hybrid homepage.
- Shared motion wrapper: `AnimatedSection`.
- Media wrapper utilities: square media, contained media, full-bleed media.

### Layer 2: Specialized Families

These should be reusable within a family, not across the whole site:

- Portfolio media cards.
- Publishing/article cards.
- Profile/about cards.
- Studio app/tool cards.
- Production cards.
- Info-page shells.
- Section nav bars.

### Layer 3: Page-Specific Identity Components

These should remain bespoke unless duplication becomes painful:

- Homepage full-bleed category panels.
- Project detail galleries and media figures.
- Article detail editorial layouts.
- Tool-specific app interfaces.

## First Reusable Component Recommendation

The first reusable component should be a `SectionIntro` or `SectionHeader` primitive, not a card.

Why:

- It appears across active pages in multiple visual systems.
- It can preserve tone differences through props like `tone`, `align`, `kicker`, `title`, `description`, and `actions`.
- It lowers future edit cost without flattening card families or page identities.
- It is lower-risk than unifying cards, because card behavior, imagery, hover states, and content models vary heavily.

## Pattern That Should Remain Page-Specific

The homepage full-bleed portfolio/category panels should remain page-specific.

They carry a major part of the site’s identity, use custom image overlays and asymmetrical alignment, and are not just generic cards. Trying to componentize them first would risk sanding down the hybrid homepage.
