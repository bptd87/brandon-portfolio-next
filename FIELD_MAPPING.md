# Supabase to New Database Field Mapping

## Gallery Mapping by Discipline

### Scenic Design (Theatre)
- `galleries.hero` → `imageType: 'rendering'` (sketches, renderings, design drawings)
- `galleries.process` → `imageType: 'production'` (production photos from performances)
- `card_image` → `coverImageUrl` (card thumbnail)

### Experiential Design
- `galleries.hero` → `imageType: 'production'` (event/activation photos)
- `galleries.process` → `imageType: 'rendering'` (technical drawings, CNC files, process docs)
- `card_image` → `coverImageUrl` (card thumbnail)

### Rendering
- `galleries.hero` → `imageType: 'rendering'` (main renderings)
- `galleries.process` → `imageType: 'production'` (reference photos, process)
- `card_image` → `coverImageUrl` (card thumbnail)

### Scenic Models
- `galleries.hero` → `imageType: 'production'` (model photos)
- `galleries.process` → `imageType: 'rendering'` (sketches, process, build photos)
- `card_image` → `coverImageUrl` (card thumbnail)

## Field Mapping

| Supabase Field | New Database Field | Notes |
|---|---|---|
| `title` | `title` | Direct |
| `slug` | `slug` | Direct |
| `category` | `discipline` | Map to enum: scenic_design, experiential_design, rendering, scenic_models |
| `subcategory` | `subcategory` | Direct |
| `venue` | `venue` | Direct |
| `location` | `location` | Direct |
| `year` | `year` | Direct |
| `month` | - | Not used |
| `description` | `excerpt` | Short description |
| `project_overview` | `description` | Full description |
| `design_notes` | `designNotes` | Array → join with \n\n |
| `client_name` | `client` | Direct |
| `card_image` | `coverImageUrl` | Direct |
| `credits` | `creativeTeam` | JSON array |
| `youtube_videos` | - | Store as imageType: 'video' with videoUrl |
| `galleries.hero` | `projectImages` | See discipline mapping above |
| `galleries.process` | `projectImages` | See discipline mapping above |
| `galleries.heroCaptions` | `projectImages.caption` | Match by index |
| `galleries.processCaptions` | `projectImages.caption` | Match by index |

## Category Mapping

| Supabase Category | New Discipline |
|---|---|
| "Scenic Design" | scenic_design |
| "Experiential Design" | experiential_design |
| "Rendering" | rendering |
| "Scenic Models" | scenic_models |
