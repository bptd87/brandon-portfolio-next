# Navigation Map

This map was created in recovery mode with a narrow filename and import check only. It does not claim to be a full repository audit.

## Current Navigation Files Found

| File | Role | Evidence |
| --- | --- | --- |
| `client/src/components/Header.tsx` | Primary global site header for most client-backed active routes. | Imported by many `client/src/pages/*` components that are mounted from `app/**/page.tsx`. |
| `client/src/components/AboutNav.tsx` | Secondary profile/about section navigation. | Imported by profile, upcoming productions, and syllabus client page components. |
| `components/site/Header.tsx` | Separate Next-native header implementation. | Imported directly only by `app/news/page.tsx` in the narrow check. |

## Active Pages and Layouts Importing Each Navigation

### `client/src/components/Header.tsx`

Directly imported by these client page/shell files, which are mounted by active App Router pages:

| Navigation consumer | Active route importer |
| --- | --- |
| `client/src/pages/Home.tsx` | `app/page.tsx` |
| `client/src/pages/About.tsx` | `app/about/page.tsx` |
| `client/src/pages/Resume.tsx` | `app/resume/page.tsx` |
| `client/src/pages/CreativeStatement.tsx` | `app/creative-statement/page.tsx` |
| `client/src/pages/TeachingPhilosophy.tsx` | `app/about/teaching/page.tsx` |
| `client/src/pages/Collaborators.tsx` | `app/about/collaborators/page.tsx` |
| `client/src/pages/UpcomingProductions.tsx` | `app/upcoming-productions/page.tsx` |
| `client/src/pages/UpcomingProductionDetail.tsx` | `app/upcoming-productions/[slug]/page.tsx` |
| `client/src/pages/AssistantScenicDesign.tsx` | `app/assistant-scenic-design/page.tsx` |
| `client/src/pages/Search.tsx` | `app/search/page.tsx` |
| `client/src/pages/Articles.tsx` | `app/articles/page.tsx` |
| `client/src/pages/ArticleDetail.tsx` | `app/articles/[slug]/page.tsx`, `app/studio/tutorials/[slug]/page.tsx` fallback path |
| `client/src/pages/TagDetail.tsx` | `app/tags/[slug]/page.tsx` |
| `client/src/pages/Projects.tsx` | `app/projects/page.tsx` |
| `client/src/pages/ScenicProjectDetail.tsx` | `app/project/[slug]/page.tsx` |
| `client/src/pages/ExperientialPortfolio.tsx` | `app/projects/experiential/page.tsx` |
| `client/src/pages/ExperientialProjectDetail.tsx` | `app/projects/experiential/[slug]/page.tsx` |
| `client/src/pages/RenderingPortfolio.tsx` | `app/projects/rendering/page.tsx` |
| `client/src/pages/RenderingProjectDetail.tsx` | `app/projects/rendering/[slug]/page.tsx` |
| `client/src/pages/Studio.tsx` | `app/studio/page.tsx` |
| `client/src/pages/StudioApps.tsx` | `app/studio/apps/page.tsx` |
| `client/src/pages/ScaleCalculator.tsx` | `app/studio/apps/scale-calculator/page.tsx` |
| `client/src/pages/DimensionReference.tsx` | `app/studio/apps/dimension-reference/page.tsx` |
| `client/src/pages/RoscoPaintCalculator.tsx` | `app/studio/apps/rosco-paint-calculator/page.tsx` |
| `client/src/pages/Scenic3DConverter.tsx` | `app/studio/apps/scenic-3d-converter/page.tsx` |
| `client/src/pages/DesignHistoryTimeline.tsx` | `app/studio/apps/design-history-timeline/page.tsx` |
| `client/src/pages/StudioDirectory.tsx` | `app/studio/directory/page.tsx` |
| `client/src/pages/StudioTutorials.tsx` | `app/studio/tutorials/page.tsx` |
| `client/src/pages/TutorialDetail.tsx` | `app/studio/tutorials/[slug]/page.tsx` |
| `client/src/pages/Syllabus3DModeling.tsx` | `app/syllabus/3d-modeling/page.tsx` |
| `client/src/pages/SyllabusExperiential.tsx` | `app/syllabus/experiential-design/page.tsx` |
| `client/src/pages/NotFound.tsx` | `app/not-found.tsx` |
| `client/src/components/InfoPageShell.tsx` | Used by `Privacy`, `Terms`, `FAQ`, `Accessibility`, and `Sitemap` client pages; those are mounted by `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/faq/page.tsx`, `app/accessibility/page.tsx`, and `app/sitemap/page.tsx`. |

Narrow check also found `client/src/pages/ExperientialSampleDetail.tsx` importing this header, but no active `app/**/page.tsx` importer was found for it during this pass.

### `client/src/components/AboutNav.tsx`

Directly imported by these client page files, all mounted by active App Router pages:

| Navigation consumer | Active route importer |
| --- | --- |
| `client/src/pages/About.tsx` | `app/about/page.tsx` |
| `client/src/pages/Resume.tsx` | `app/resume/page.tsx` |
| `client/src/pages/CreativeStatement.tsx` | `app/creative-statement/page.tsx` |
| `client/src/pages/TeachingPhilosophy.tsx` | `app/about/teaching/page.tsx` |
| `client/src/pages/Collaborators.tsx` | `app/about/collaborators/page.tsx` |
| `client/src/pages/UpcomingProductions.tsx` | `app/upcoming-productions/page.tsx` |
| `client/src/pages/UpcomingProductionDetail.tsx` | `app/upcoming-productions/[slug]/page.tsx` |
| `client/src/pages/Syllabus3DModeling.tsx` | `app/syllabus/3d-modeling/page.tsx` |
| `client/src/pages/SyllabusExperiential.tsx` | `app/syllabus/experiential-design/page.tsx` |

### `components/site/Header.tsx`

Directly imported by:

| Navigation consumer | Active route importer |
| --- | --- |
| `app/news/page.tsx` | Direct import in the route file. |

`app/layout.tsx` does not import a navigation component. It wraps children with `LegacyProviders`, analytics, SEO JSON-LD, and cleanup utilities.

## Which Navigation Appears Current

- `client/src/components/Header.tsx` appears to be the current primary site navigation because it is used by the broad set of active routes through client page components.
- `client/src/components/AboutNav.tsx` appears current as a section-level profile/about navigation.

## Which Navigation Appears Legacy or Duplicated

- `components/site/Header.tsx` appears duplicated relative to `client/src/components/Header.tsx`.
- Its only active route usage found here is `app/news/page.tsx`, whose metadata marks the page `noindex: true` and describes it as a legacy news archive.
- `client/src/pages/ExperientialSampleDetail.tsx` may be stale or currently unused because this narrow check did not find an active App Router importer.

## Recommendation

Keep files in place for now. Treat `client/src/components/Header.tsx` as the working primary header and `client/src/components/AboutNav.tsx` as the working profile subnav. Before any future cleanup, verify whether `app/news/page.tsx` should keep its separate `components/site/Header.tsx` implementation or be aligned with the primary client header. Do not move or delete navigation files until that route-level decision is made.
