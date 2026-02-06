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
