# Brandon Portfolio V2 - TODO List

## Database Schema & Setup
- [x] Design and implement projects table with categories, tags, and metadata
- [x] Design and implement news table with flexible block content support
- [x] Design and implement articles table with rich text content
- [x] Design and implement categories and tags tables
- [x] Create and execute database migration SQL
- [x] Set up S3 storage integration for media files

## Backend API (tRPC)
- [x] Create tRPC endpoints for projects CRUD operations
- [x] Create tRPC endpoints for news CRUD operations
- [x] Create tRPC endpoints for articles CRUD operations
- [x] Create tRPC endpoints for categories and tags management
- [x] Create tRPC endpoints for image upload to S3
- [x] Create tRPC endpoints for search functionality
- [x] Create tRPC endpoints for AI content generation

## Admin Panel
- [x] Build admin dashboard layout with navigation
- [x] Create project management interface (list, create, edit, delete)
- [x] Create news management interface (list, create, edit, delete)
- [x] Create article management interface with rich text editor
- [x] Create category and tag management interface
- [x] Implement image upload UI with S3 integration
- [x] Add AI writing assistant for content generation

## Public-Facing Pages
- [x] Build homepage with featured projects and recent news
- [ ] Create portfolio projects listing page with filtering
- [ ] Create individual project detail pages with SEO metadata
- [ ] Create news listing page
- [ ] Create individual news detail pages with SEO metadata
- [ ] Create articles/blog listing page
- [ ] Create individual article detail pages with SEO metadata
- [ ] Implement responsive navigation and footer

## Studio Tools
- [ ] Build architecture scale converter tool
- [ ] Build paint finder tool
- [ ] Build dimension reference tool

## Search & SEO
- [ ] Implement site-wide search across projects, news, and articles
- [ ] Add dynamic SEO metadata generation for all pages
- [ ] Implement server-side rendering for SEO optimization

## AI Features
- [x] Integrate AI writing assistant for article drafts
- [x] Add AI-powered project description generator
- [x] Add AI-powered SEO content summary generator
- [x] Integrate AI image generation for portfolio mockups

## Testing & Deployment
- [x] Write vitest tests for critical tRPC procedures
- [x] Test all CRUD operations in admin panel
- [x] Test public pages and SEO metadata
- [x] Test AI features and studio tools
- [x] Create deployment checkpoint

## Portfolio Migration
- [x] Analyze original portfolio design and color scheme
- [x] Extract all project data from original repository
- [x] Extract news data from original repository
- [x] Import projects into database
- [x] Import news items into database
- [x] Recreate original homepage design and layout
- [ ] Build projects listing page matching original design
- [ ] Build individual project detail pages
- [x] Build news listing page
- [ ] Build individual news detail pages
- [x] Port original styling and CSS
- [ ] Add original images to S3 storage
- [x] Test all pages and functionality

## Project Import and Pages
- [x] Extract project data from original Supabase database
- [x] Create sample projects or import from data files
- [x] Build projects listing page with filtering
- [x] Build individual project detail pages with galleries
- [x] Add project categories and tags
- [x] Test project pages functionality

## Replicate Original Site Layout
- [x] Analyze original homepage structure and sections
- [x] Recreate exact hero section with original copy
- [x] Build original navigation and header design
- [x] Replicate footer layout and content
- [x] Match original typography and spacing
- [x] Add original images and assets from repo
- [x] Recreate original news/articles layout
- [x] Match original project cards and grid layout

## Bug Fixes
- [x] Fix API query error on /projects page (string pattern mismatch)
- [x] Fix nested anchor tag errors in project cards
- [x] Test all pages after fixes

## Additional Bug Fixes
- [x] Fix nested anchor tag error in ProjectDetail page

## New Features
- [x] Create shared Header component
- [x] Replace header in all pages with shared component
- [x] Build About page with bio and CV
- [x] Build Contact page with contact form
- [x] Build Studio page with interactive tools (scale converter, paint finder, dimension reference)
- [x] Add routes for new pages in App.tsx

## Recreate Original Pages Accurately
- [x] Analyze original News detail page design and content structure
- [x] Recreate News detail pages with exact layout and block rendering
- [x] Analyze original Article detail page design
- [x] Recreate Article detail pages with exact layout
- [ ] Analyze original About page content and design
- [ ] Recreate About page with actual bio, photos, and content
- [ ] Analyze original Studio tools functionality
- [ ] Recreate Studio tools with exact calculations and UI

## Bug Fixes - Article Detail
- [x] Fix JSON parse error in ArticleDetail (content is plain text, not JSON)
- [x] Fix nested anchor tags in ArticleDetail related articles section

## Supabase Data Import
- [ ] Access Supabase configuration from original portfolio
- [ ] Extract real project data from Supabase
- [ ] Import projects with actual photos and descriptions
- [x] Create admin panel user guide
- [x] Document how to add/edit projects, news, and articles

## Admin Authentication Fix
- [x] Diagnose why user cannot access admin panel
- [x] Check authentication flow and admin role assignment
- [x] Test login and admin access
- [x] Verify owner is automatically set as admin

## Authentication Loop Bug Fix
- [x] Check browser console for authentication errors
- [x] Verify session cookie is being set correctly
- [x] Check if owner OpenID is matching ENV variable
- [x] Verify admin role is being assigned in database
- [x] Test authentication flow end-to-end

## Rebuild with Full Original Complexity
- [x] Analyze original project pages structure (galleries, design notes, metadata)
- [x] Redesign projects table to support multiple images per project
- [x] Add design notes field with rich text/markdown support
- [x] Add production details, venue info, team credits fields
- [x] Rebuild ProjectForm to handle image galleries (multiple uploads)
- [x] Add design notes editor to ProjectForm
- [x] Add all metadata fields to ProjectForm
- [ ] Rebuild ProjectDetail page with image gallery component
- [ ] Add design notes section to ProjectDetail page
- [ ] Add production details and credits sections to ProjectDetail page
- [ ] Test full project creation and display workflow

## Complete Project Form and Detail Pages
- [x] Add uploadImage tRPC mutation to projects router
- [x] Fix Uint8Array iteration TypeScript errors in ProjectForm
- [x] Update projects.create endpoint to accept designNotes, creativeTeam, images
- [x] Update projects.update endpoint to accept designNotes, creativeTeam, images
- [x] Update db.ts helper functions for new fields
- [x] Rebuild ProjectDetail page with image gallery component
- [x] Add design notes section with "Read More" to ProjectDetail
- [x] Add creative team credits section to ProjectDetail
- [x] Add video embed support to ProjectDetail gallery
- [x] Test creating a project with multiple images through admin
- [x] Test project display on public detail page

## Modern Premium Redesign
- [x] Implement glassmorphism effects (frosted glass cards, backdrop blur)
- [x] Add smooth animations and transitions throughout site
- [x] Redesign color palette for premium, sophisticated feel
- [ ] Add micro-interactions and hover effects
- [ ] Implement smooth scroll animations
- [x] Add gradient overlays and modern typography

## Navigation & Footer Redesign
- [x] Rebuild Header component with Portfolio dropdown menu
- [x] Add 4 discipline options to Portfolio dropdown (Scenic Design, Experiential Design, Renderings, Scenic Models)
- [x] Create Footer component matching original design
- [x] Add "Other Portfolios" section above footer with 4 discipline cards
- [x] Add social links and footer columns
- [x] Replace footer in all pages with new component

## Flexible Team Management
- [x] Create team_members table with dynamic roles
- [x] Add project_team_members junction table
- [ ] Build dynamic team member add/remove UI in admin
- [ ] Update ProjectDetail to display dynamic team list
- [ ] Add custom role input for each team member

## Multiple Design Disciplines
- [x] Add discipline field to projects table (scenic_design, experiential_design, rendering, scenic_models)
- [x] Add subcategory field to projects for filtering within disciplines
- [x] Update Projects page to filter by discipline from URL params
- [x] Add subcategory filter tabs on Projects page
- [x] Add discipline badges to project cards
- [x] Update ProjectForm to include discipline and subcategory selects

## Supabase Migration
- [x] Create comprehensive migration checklist document
- [x] Build data export script from Supabase
- [x] Create data import script for new database
- [x] Map Supabase schema to current schema
- [ ] Test migration with sample data
- [x] Document image/asset migration process

## Supabase Data Migration - Correct Mapping
- [x] Analyze Supabase data structure
- [x] Document gallery mapping differences by discipline
- [x] Update migration script with discipline-specific gallery mapping
- [x] Map card_image to coverImageUrl
- [x] Map credits array to creativeTeam JSON
- [x] Map design_notes array to designNotes string
- [x] Handle youtube_videos as video type images
- [x] Test migration with 2 projects (1 Scenic Design, 1 Experiential)
- [x] Verify galleries display correctly for each discipline
- [ ] Run full migration of all 37 projects

## Fix ProjectDetail Page Display
- [ ] Parse and display creativeTeam JSON properly
- [ ] Show venue, location, year prominently in header
- [ ] Clean up layout and spacing
- [ ] Fix Production Photos / Renderings section titles
- [ ] Improve overall page design

## Dynamic Team Management in Admin
- [ ] Add dynamic team member add/remove UI to ProjectForm
- [ ] Allow custom role input for each team member
- [ ] Pre-populate with default roles (Playwright, Director, Scenic Design, etc.)
- [ ] Save team as JSON array to creativeTeam field
- [ ] Test adding/removing team members

## Redesign Project Detail Page - Minimalist Aesthetic
- [x] Study original site's project detail page design
- [x] Remove glass/card effects from project detail
- [x] Match original minimalist layout and spacing
- [x] Remove "About This Project" section (description is SEO only)
- [x] Add collapsible gallery and renderings sections
- [x] Ensure design notes and creative team display correctly
- [x] Match original typography and hierarchy
- [x] Add hero section with blurred background image

## Full Supabase Migration
- [x] Update migration script to process all 37 projects
- [x] Run full migration with progress monitoring
- [x] Verify all projects imported correctly (33 unique projects)
- [x] Verify all images uploaded to S3
- [ ] Test portfolio pages with full content
- [ ] Check all 4 disciplines have projects

## Fix Incomplete Starter Projects
- [x] Delete 4 incomplete projects (Million Dollar Quartet, Much Ado, All's Well, Romero)
- [x] Re-run migration to import them with full Supabase data
- [x] Verify they have images, team credits, and design notes
- [x] Fix portfolio grid cover image display issue (status field)
- [x] Test all projects display correctly on /projects page

## Fix Portfolio Page Issues
- [x] Identify projects incorrectly categorized as scenic_design
- [x] Update discipline for archive/collection projects
- [x] Change project card layout to landscape format
- [x] Test scenic design portfolio page
- [x] Verify all 4 discipline pages show correct projects
- [x] Fix discipline parameter reading with useSearch hook
- [x] Test Scenic Design portfolio (25 projects)
- [x] Test Experiential Design portfolio (7 projects)
- [x] Test Rendering portfolio (2 projects)
- [x] Test Scenic Models portfolio (2 projects)

## Rebuild Portfolio with Masonry Grid
- [x] Change from landscape cards to masonry grid (3 columns)
- [x] Remove glass effects and borders from cards
- [x] Add image overlay with gradient for text readability
- [x] Display project title, client, and year on image overlay
- [x] Match original design spacing and typography
- [x] Test masonry layout responsiveness
