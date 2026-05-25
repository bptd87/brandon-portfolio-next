# Card System

This document maps repeated card patterns observed in active pages. It is a planning document only; no refactor should happen until a specific component is approved.

## Important Constraint

Do not standardize all cards into one component. The site intentionally uses multiple card languages:

- Dark portfolio/image cards.
- Light profile/about cards.
- White publishing/editorial cards.
- Dark studio app cards.
- Large production feature cards.
- Media gallery figures.

A useful card system here should be a family of related card types, not a single universal card.

## Card Families Observed

### Production Feature Cards

Evidence:

- `client/src/pages/UpcomingProductions.tsx`
- Homepage upcoming production rail in `client/src/pages/Home.tsx`

Traits:

- Large rounded corners, around `rounded-[1.7rem]`.
- Strong image + text pairing.
- Light page version uses white card surfaces.
- Homepage rail version uses image-as-background with dark overlay.
- Arrow affordance appears as a small directional cue.

Strategy:

- Keep this as a specialized `ProductionCard` family.
- Do not merge with generic article or project cards.

### Publishing Article Cards

Evidence:

- `client/src/pages/Articles.tsx`
- Homepage publish rail in `client/src/pages/Home.tsx`

Traits:

- Editorial white card surfaces on light background for archive pages.
- Image-led dark overlay cards in homepage rail.
- Category chips carry strong color semantics.
- Cards include navigation transition behavior.

Strategy:

- Create a publishing-specific family only when article and tutorial archive cards are ready to share behavior.
- Preserve category chip styling and editorial tone.

### Portfolio Project Cards

Evidence:

- `client/src/pages/Projects.tsx`
- Project detail pages use related but distinct media display logic.

Traits:

- Dark surfaces.
- Large image-first treatment.
- Overlay gradient and title over image.
- View transition names and custom navigation animation.
- Variable grid spans.

Strategy:

- Keep as a portfolio-specific card family.
- Do not merge with publishing cards, because portfolio cards are about visual work first, not text metadata first.

### Profile Navigation Cards

Evidence:

- `client/src/pages/About.tsx`

Traits:

- Light surface on warm profile background.
- Horizontal rail.
- Icon/image at bottom.
- Soft shadow and rounded corners.
- Used to move within the profile/about ecosystem.

Strategy:

- Candidate for a future `ProfileNavCard`.
- Lower priority than section header primitives because it appears in fewer places.

### Studio App Cards

Evidence:

- `client/src/pages/StudioApps.tsx`

Traits:

- Dense, utilitarian card layout.
- Border-top structure rather than floating card surface.
- Square app image.
- Category eyebrow, title, description, and CTA.

Strategy:

- Keep specialized for app/tool surfaces.
- Do not make it look like portfolio or article cards.

### Media Gallery Figures

Evidence:

- `client/src/pages/ScenicProjectDetail.tsx`

Traits:

- Uses `ProgressiveImage`.
- Handles landscape, portrait, square, contain/cover, lead/single/pair/grid/rail variants.
- Captions and lightbox behavior matter.

Strategy:

- This is already a specialized domain component candidate, but it is riskier than simple layout primitives.
- Leave page-specific until gallery behavior is intentionally extracted.

## Shared Card Foundations

A future card system should share small foundations:

- `CardSurface`: surface, border, shadow, radius, and tone.
- `CardMedia`: aspect ratio, object fit, loading priority, hover scale.
- `CardMeta`: kicker/category/date styling.
- `CardTitle`: heading scale and tracking by card family.
- `CardAction`: arrow/link affordance.

These foundations should be optional building blocks, not a forced wrapper around every card.

## First Card Refactor Candidate

If the first reusable component must be card-related, choose a `RailCardControls` or `HorizontalCardRail` utility before choosing a visual card.

Why:

- Horizontal rails repeat on homepage, about, upcoming, and gallery sections.
- The repeated behavior is scrolling and arrow controls, not the card visuals.
- It would reduce duplication while preserving each card family’s look.

## Card Pattern to Keep Page-Specific

Keep portfolio project cards page-specific for now.

They combine routing, filtering, view transitions, image loading, and visual hierarchy. Extracting them too early could make future design work slower rather than faster.
