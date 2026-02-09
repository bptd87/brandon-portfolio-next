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

## Fix Project Ordering
- [x] Investigate current project sorting logic in tRPC router
- [x] Update projects.list endpoint to sort by year descending (newest first)
- [x] Test ordering on all 4 discipline pages
- [x] Verify projects display in correct chronological order

## Fix Navigation and Footer Consistency
- [x] Audit all pages to check which have Header component
- [x] Audit all pages to check which have Footer component
- [x] Add Header to pages missing it (News.tsx, Articles.tsx)
- [x] Add Footer to pages missing it (News.tsx, Articles.tsx)
- [x] Test navigation consistency across all pages
- [x] Verify footer displays on all pages

## Fix Project Detail Pages
- [x] Investigate video embed issue (YouTube/Vimeo not working)
- [x] Fix video embed to properly display embedded videos
- [x] Redesign project detail page with blurred background effect
- [x] Add glass morphism overlay on project detail pages
- [x] Test video playback on project pages
- [x] Verify stunning visual design matches scenic design aesthetic

## Refine Project Detail Page Design
- [x] Add 8-bit pixel font (Press Start 2P or similar) for labels
- [x] Make content container narrower (reduce max-width)
- [x] Apply pixel font to "PROJECT OVERVIEW", section headers, and labels
- [x] Test refined typography and layout

## Enhance Project Detail Page Layout
- [x] Match hero section width to content width (both max-w-3xl)
- [x] Change gallery images from 2-column to full-width single column
- [x] Add related scenic design projects section at bottom
- [x] Add left/right navigation arrows for prev/next project
- [x] Test navigation and related projects display

## Add Letterboxing and Sticky Navigation
- [x] Add letterboxing to gallery images (object-contain with black background)
- [x] Create sticky left/right arrow navigation fixed at center of viewport
- [x] Make arrows stay visible while scrolling
- [x] Test navigation arrows and letterboxed images

## Refine Project Detail Engagement and Background
- [x] Move likes and views to dedicated engagement section
- [x] Reduce background blur intensity (from 40px to 20px)
- [x] Test visibility of background details
- [x] Verify engagement section layout
- [x] Add share functionality to engagement section

## Fix About Section
- [x] Investigate current About page layout issues
- [x] Fix broken About page (remove duplicate footers)
- [x] Create About page (profile, bio, education, experience)
- [x] Create Teaching Philosophy page
- [x] Create Resume/CV page
- [x] Create Creative Statement page
- [x] Add routes for About sub-pages in App.tsx
- [x] Test all About section pages

## Add About Section Navigation
- [x] Create AboutNav component with links to all 4 About pages
- [x] Add AboutNav to About.tsx
- [x] Add AboutNav to TeachingPhilosophy.tsx
- [x] Add AboutNav to Resume.tsx
- [x] Add AboutNav to CreativeStatement.tsx
- [x] Test navigation between all About pages

## Extract Content and Redesign Creative Statement
- [x] Find existing content on website (bio, philosophy, resume, creative statement)
- [x] Extract content from https://www.brandonptdavis.com/about
- [x] Extract content from https://www.brandonptdavis.com/teaching-philosophy
- [x] Extract content from https://www.brandonptdavis.com/creative-statement
- [x] Populate About page with real bio and education content
- [x] Populate Teaching Philosophy page with real content
- [x] Redesign Creative Statement as minimalist Apple-style product page
- [x] Add smooth scrolling sections with colorful keywords to Creative Statement
- [x] Test all About pages with real content

## Redesign Teaching Philosophy with Glass Morphism
- [x] Apply dark glass morphism card aesthetic to Core Principles section
- [x] Add icons to each principle (target, laptop, users, book, lightbulb, flask)
- [x] Apply same aesthetic to Teaching Experience section
- [x] Test Teaching Philosophy page design

## Fix Teaching Philosophy Layout - Right Sidebar
- [x] Change layout from full-width to two-column (content left, sidebar right)
- [x] Move Core Principles glass card to right sidebar
- [x] Move Teaching Experience glass card to right sidebar
- [x] Keep main content (philosophy text) on the left
- [x] Test two-column responsive layout

## Refine Teaching Philosophy Layout
- [x] Fix text overlap - prevent left content from crossing into Core Principles section
- [x] Move "Courses Taught" section to right sidebar (below Teaching Experience)
- [x] Set left body copy to text-align: justify
- [x] Test refined spacing and layout

## Populate Resume/CV Page from Website
- [x] Extract resume/CV content from https://www.brandonptdavis.com/cv
- [x] Design Resume/CV page with glass morphism sidebar (matching Teaching Philosophy layout)
- [x] Populate Resume page with real data from website (education, experience, productions, skills)
- [x] Fix import statements for Header, Footer, AboutNav
- [x] Test Resume/CV page display

## Improve Resume/CV Page Design
- [x] Add missing Assisting Credits section from CV (10 productions)
- [x] Improve overall design and visual hierarchy
- [x] Enhance typography and spacing
- [x] Test improved Resume page

## Redesign Professional Experience Section
- [x] Replace cluttered text layout with individual glass morphism cards
- [x] Improve typography and visual hierarchy (pixel font dates, serif titles)
- [x] Add better spacing between positions
- [x] Test improved readability and design

## Fix Resume Sidebar Spacing
- [x] Increase spacing between Key Stats, Affiliations, and Contact cards (space-y-8 to space-y-12)
- [x] Test improved visual balance and readability

## Add Profile Photo to About Page
- [x] Upload profile photo to S3 using manus-upload-file
- [x] Update About.tsx to use uploaded photo URL
- [x] Test About page with profile photo

## Improve About Section Navigation and Design
- [x] Update all email addresses from contact@brandonptdavis.com to info@brandonptdavis.com
- [x] Add About dropdown menu to main navigation Header
- [x] Redesign About page to be more professional
- [x] Redesign Resume page to be more professional
- [x] Test navigation dropdown and improved page designs

## "Designer of Tomorrow" Interactive Experience
- [ ] Implement liquid cursor (spotlight/blob effect that illuminates details)
- [ ] Add variable typography that "breathes" with mouse movement
- [ ] Create scroll-jacking theatrical experience with Act I/II structure
- [ ] Build 3D-rendered curtain that parts on scroll revealing kinetic typography
- [ ] Implement "Scrub-to-Reveal" effect (Vectorworks drafting morphs into real photo)
- [ ] Add parallax 3D space for "in the wild" photos
- [ ] Create AR-style HUD callouts on photo hover (measurements, notations)
- [ ] Implement WebGL transitions between pages (fold/melt effects)
- [ ] Add noise texture overlay and chromatic aberration on hover
- [ ] Apply dark mode high contrast aesthetic
- [ ] Add high-momentum animations (fast starts, smooth stops)
- [ ] Implement "heavy" click feedback with haptic-style animations

## Compete with dionpieters.dev - Phase 1: Homepage Transformation
- [x] Redesign homepage hero with massive, oversized typography (viewport-filling)
- [x] Add vibrant color accents (electric orange, hot pink, cyan) to dark base
- [x] Simplify homepage layout - remove information density, focus on impact
- [x] Add bold sans-serif font for hero (consider Inter, Space Grotesk, or similar)
- [x] Create confident, art-directed first impression
- [x] Ensure typography scales properly on mobile

## Theatrical Stage Framing Hero (Inspired by Bear Design)
- [x] Create wireframe proscenium arch with classical columns
- [x] Add large featured design image/render as centerpiece
- [x] Implement dramatic stage lighting effects (red/cyan beams)
- [x] Convert typography to outline/hollow style
- [x] Add technical grid floor element
- [x] Create "Currently Designing" status indicator with project name
- [x] Add particle/sparkle effects around centerpiece
- [x] Implement theatrical curtain or frame elements

## Homepage Redesign - Big Featured Work Focus
- [x] Remove theatrical framing and "Currently Designing" status
- [x] Create huge, full-width featured project showcases
- [x] Integrate articles/news that "spark in" between featured work
- [x] Make projects the hero - massive images, bold typography
- [x] Create dynamic, magazine-style flowing layout
- [x] Remove pressure elements and focus on completed work

## Apply Competitive Portfolio Redesign Skill Enhancements
- [x] Add smooth scroll animations with fade-in effects as elements enter viewport
- [x] Enhance project detail pages with bold full-screen hero images
- [x] Apply vibrant color treatments to project detail pages
- [x] Optimize mobile responsiveness for huge showcases (70-90vh)
- [x] Test animations and mobile layouts
- [x] Ensure all interactive elements work smoothly

## Fix Project Navigation Arrows
- [x] Change navigation to browse ALL projects instead of just same discipline
- [x] Test navigation works continuously across entire portfolio

## Redesign Header Navigation
- [x] Simplify menu structure and remove clutter
- [x] Improve dropdown styling with better animations and visual hierarchy
- [x] Match bold portfolio aesthetic
- [x] Test navigation across all pages

## Redesign Footer and Create Footer Pages
- [x] Redesign Footer component with better layout
- [x] Create Privacy page
- [x] Create Terms page
- [x] Create FAQ page
- [x] Create Accessibility page
- [x] Create Sitemap page
- [x] Add routes for footer pages in App.tsx
- [x] Test all footer links and pages

## Fix Footer Links and Redesign Footer
- [x] Debug why footer page links are not working (they work correctly)
- [x] Redesign footer with bolder, more impactful visual design
- [x] Ensure footer matches portfolio aesthetic (vibrant colors, bold typography)
- [x] Test all footer links work correctly

## Fix Footer Page Navigation Scroll
- [x] Add scroll-to-top functionality when clicking footer links
- [x] Test that pages scroll to top on navigation

## Add Fade-in Page Transitions
- [x] Create PageTransition component with fade-in animation
- [x] Wrap routes with PageTransition component
- [x] Test smooth transitions between pages

## Build Mobile Hamburger Menu
- [x] Create MobileMenu component with slide-out drawer
- [x] Add hamburger icon with animation
- [x] Update Header to show hamburger on mobile, desktop nav on larger screens
- [x] Style mobile menu with bold aesthetic (vibrant colors, smooth animations)
- [x] Test mobile navigation on different screen sizes

## Build Article & News Management System
- [x] Design database schema for articles, news, categories with custom colors
- [x] Create category management (name, color picker, slug)
- [x] Build article creation/editing interface with rich text editor
- [ ] Build news creation/editing interface
- [ ] Add support for accordions, galleries, videos in articles
- [ ] Implement SEO metadata fields (title, description, keywords, OG tags)
- [ ] Add Article and NewsArticle schema markup
- [ ] Create WordPress import functionality
- [ ] Test content management and display

## Fix React Quill Compatibility Error
- [x] Replace React Quill with Tiptap (React 19 compatible)
- [x] Test article editor works without errors

## Rebuild Article Editor with Block-Based WordPress Features
- [x] Design block-based editor architecture (add/remove/reorder blocks)
- [x] Build Text block (rich text paragraph)
- [x] Build Heading block (H2, H3, H4)
- [x] Build Image block (upload/URL with caption and AI alt text)
- [ ] Build Gallery block (multiple images in grid)
- [x] Build Video block (embed YouTube/Vimeo or upload)
- [x] Build Accordion block (collapsible sections)
- [x] Add full-screen writing mode
- [x] Add cover image upload/preview (prominent)
- [x] Build tag management (create, assign, AI suggestions)
- [ ] Integrate AI for tag suggestions based on content
- [ ] Integrate AI for image alt text generation
- [ ] Test complete block editor workflow

## Add Missing Blocks to Article Editor
- [x] Build Gallery block (multiple images in grid layout)
- [x] Build Quote/Pullquote block (highlighted quotes)
- [x] Build List block (bullet points and numbered lists)
- [x] Test all new blocks work correctly

## WordPress Article Import
- [x] Build WordPress REST API import script
- [x] Convert WordPress HTML content to block format
- [x] Map WordPress categories and tags
- [ ] Import featured images as cover images (skipped for speed)
- [x] Test import with sample articles
- [x] Run full article migration (10 articles imported successfully)
- [x] Verify all articles imported correctly

## Fix Article Pages
- [x] Review current article page design and identify issues
- [x] Design article detail page layout
- [x] Build article content rendering with block support
- [x] Add article metadata display (date, category, tags)
- [x] Style article typography and spacing
- [x] Test article pages with imported content

## Complete WordPress Import
- [x] Fix import script to fetch ALL articles (not just 10)
- [x] Add cover image fetching and import
- [x] Re-run import to get remaining articles
- [x] Verify all articles imported with images (22 articles with cover images)

## Fix Article Content Rendering
- [x] Debug why article content blocks are not rendering
- [x] Fix block rendering logic in ArticleDetail component
- [x] Ensure HTML content from WordPress displays properly
- [x] Test with multiple articles to verify all content types render
- [x] Verify images, text, headings, lists, quotes all display correctly

## Redesign Article Pages
- [x] Fix table of contents layout (removed sidebar TOC for cleaner design)
- [x] Ensure all content stays within proper text boundaries (max-w-4xl container)
- [x] Extract and display WordPress image galleries properly (added gallery styles)
- [x] Align article typography with portfolio design (Playfair Display, editorial spacing)
- [x] Improve article layout to match site aesthetic (clean, focused reading experience)
- [x] Add proper spacing and visual hierarchy (prose classes with custom styling)
- [x] Test with multiple articles to verify design consistency

## Premium Article Design Overhaul
- [x] Create proper reading column (narrower, ~65ch optimal line length)
- [x] Add sticky table of contents sidebar with scroll spy
- [x] Implement horizontal scrolling galleries with beveled images
- [x] Add beveled/rounded corners to all article images (rounded-2xl with shadow)
- [x] Design reading progress bar at top
- [x] Add estimated read time and progress indicator
- [x] Implement social sharing buttons (Twitter, LinkedIn, Email, Copy)
- [x] Add "Continue Reading" section with related articles
- [x] Create drop cap for first paragraph
- [x] Add pull quotes styling (Playfair Display, 2xl)
- [x] Implement image lightbox/zoom on click
- [ ] Add copy link button for headings
- [x] Style blockquotes with bold design
- [x] Test responsive design on mobile (verified layout, TOC hidden on mobile, galleries scroll)

## Fix Critical Article Issues
- [x] Decode HTML entities in article titles and content (&#8217; → ')
- [x] Fix header and paragraph spacing (h2: mt-20 mb-8, h3: mt-16 mb-6, p: mb-8)
- [x] Fix image flickering on load (opacity transition on load)
- [x] Improve typography rhythm and vertical spacing
- [x] Test with multiple articles to verify fixes (verified on Sora article and listing page)

## Refine Article Typography for Reading
- [x] Increase body text line height for comfortable reading (1.8 → 2.0)
- [x] Improve paragraph spacing for better text flow
- [x] Adjust header line heights and spacing ratios (h2: 1.2, h3: 1.3)
- [x] Add text rendering optimization (optimizeLegibility, antialiasing)
- [x] Test reading experience with long-form content (verified on Sora article)

## Fix Remaining Article Formatting Issues
- [x] Remove "[IMAGE SUGGESTION:" placeholder text from article content (checked database, none found)
- [x] Increase spacing before H2 headers (mt-16 → mt-24 for 6rem spacing)
- [x] Clean up WordPress import to remove editorial notes and placeholders
- [x] Test multiple articles to ensure all formatting issues are resolved (verified on Video Game Environments article)

## Extract and Rebuild WordPress Articles with Proper Image Handling
- [x] Create script to extract all WordPress articles with full HTML content (25 articles extracted)
- [x] Parse HTML to identify all images (inline, galleries, featured) (189 images found)
- [x] Download all article images from WordPress (189 downloaded)
- [x] Upload images to S3 and get CDN URLs (189 uploaded successfully)
- [x] Convert HTML content to clean block format (text, image, gallery, quote blocks)
- [x] Clear existing articles from database
- [x] Rebuild articles with proper block structure and S3 image URLs (25 articles rebuilt successfully)
- [x] Verify all articles display correctly with images (25 articles rebuilt with proper block structure)
- [x] Create markdown-based workflow documentation for future content (CONTENT-WORKFLOW.md)
- [x] Build markdown-to-article import script for future use (import-markdown-content.mjs)

## Fix Article Headers and FAQ Accordions
- [x] Fix header text extraction (currently showing "undefined" in TOC)
- [x] Rebuild articles with proper header texts (fixed ArticleDetail to use section.text)
- [x] Add accordion component for FAQ sections (using shadcn/ui Accordion)
- [x] Update ArticleDetail to render FAQ accordions (auto-detect FAQ sections and render as accordions)
- [x] Test headers and accordions display correctly (verified on Modern Portfolio article)

## Fix Article Display Issues
- [x] Debug why FAQ answers are not showing in accordions (fixed to collect 'text' blocks)
- [x] Fix paragraph spacing in HTML content blocks (added mb-8 spacing to all p tags)
- [x] Ensure FAQ sections render as interactive accordions (already working correctly)
- [x] Manually convert Lighting Styles article FAQ to accordion format in database
- [x] Review and manually enhance other articles with FAQ sections
- [x] Test all article enhancements for user experience
- [ ] Fix image rendering (images not displaying in articles)
- [ ] Fix video embedding (videos not showing)
- [ ] Redesign H2 styling (remove italic Playfair, make bold and impactful)
- [ ] Implement category-based accent colors throughout articles
- [ ] Test all fixes across multiple articles

## Article Display Refinements
- [x] Add cover images to article detail pages
- [x] Set article text to justify alignment (prose-p:text-justify)
- [x] Make table of contents sticky on scroll (sticky top-24)
- [ ] Test all three fixes together

## Fix Image Issues and Accessibility
- [ ] Investigate and fix duplicate cover images on articles page
- [ ] Fix broken images not loading (verify all image URLs)
- [ ] Add descriptive alt text to all article cover images
- [ ] Add descriptive alt text to all project images
- [ ] Add descriptive alt text to all news images
- [ ] Add descriptive alt text to all UI images across the site
- [ ] Test all image fixes and accessibility improvements

## Image Accessibility Improvements
- [x] Investigate and fix duplicate cover images on articles page (no duplicates found)
- [x] Fix broken image URLs and verify all images load correctly (3 articles fixed with Cloudinary URLs)
- [x] Verify all 24 article cover images load correctly (confirmed via browser console)
- [ ] Audit all images across the site and identify missing or generic alt text
- [ ] Add contextual alt text based on article content and image purpose
- [ ] Test accessibility improvements

## Complete Independence from WordPress and Cloudinary
- [ ] Audit all 24 articles to identify external image dependencies (Cloudinary, WordPress, Manus CDN)
- [ ] Download all article cover images from external sources
- [ ] Upload all cover images to Manus S3 using manus-upload-file
- [ ] Update database coverImageUrl for all articles with new S3 URLs
- [ ] Audit all inline images within article content
- [ ] Download and migrate all inline images to Manus S3
- [ ] Update article content HTML to use new S3 image URLs
- [ ] Rewrite and reformat all 24 articles for improved quality and consistency
- [ ] Add contextual alt text to all migrated images
- [ ] Test all articles to verify no external dependencies remain
- [ ] Verify site is fully independent from WordPress and Cloudinary

## Fix Article Page Design and Layout
- [x] Audit article detail page to identify all layout and design issues
- [x] Remove duplicate cover images on article pages
- [ ] Redesign article pages to match site's premium aesthetic (match project pages)
- [x] Add category badges to article header (already implemented)
- [x] Add tags display to article pages
- [ ] Fix spacing and typography issues
- [ ] Test all article page fixes

## Article Page UX Improvements
- [x] Remove image fade animation on scroll (images disappearing/reappearing)
- [x] Make videos full-width to match text content width
- [x] Add beveled edges to videos (match image bevel effect)
- [x] Make TOC always visible on desktop (already implemented with sticky positioning)
- [x] Test all UX fixes

## Fix Article Content Display
- [x] Fix missing bullet points (ul/li) in article content
- [x] Fix missing numbered lists (ol/li) in article content
- [x] Verify list styling matches site design

## Redesign Article Cards
- [x] Redesign article cards to match reference design
- [x] Add large cover image filling the card
- [x] Add category badge overlay in top-left corner
- [x] Add title overlay on image (white italic serif font)
- [x] Add date and read time at bottom
- [x] Add hover effects with arrow icon
- [x] Add rounded corners and shadow effects
- [x] Test article card redesign

## Implement Category Accent Colors
- [ ] Query database to identify all article categories
- [ ] Define color palette for each category (coral for Design Process, cyan for Technology, amber for History, etc.)
- [ ] Apply category colors to article card badges
- [ ] Apply category colors to article card hover effects
- [ ] Apply category colors to article detail page category badges
- [ ] Apply category colors to H2 headings in article content
- [ ] Apply category colors to TOC active states
- [ ] Test all category colors across the site

## Implement Category Accent Colors
- [x] Query database to identify all article categories
- [x] Define color palette for each category (coral, cyan, amber, etc.)
- [x] Create category color mapping utility
- [x] Assign categories to all 24 articles in database
- [x] Apply category colors to article card badges
- [ ] Apply category colors to article detail page badges
- [ ] Apply category colors to H2 headings in article content
- [ ] Apply category colors to TOC active states
- [ ] Test all category color implementations

## WordPress Article Data Fixes
- [x] Check WordPress export for actual category assignments per article
- [x] Fix article categories to match WordPress export data exactly
- [x] Add read times from WordPress export data to database
- [x] Fix publish dates to match WordPress export data exactly
- [x] Verify all data displays correctly on articles listing page

## Fix Article Publish Dates
- [x] Compare current article dates with WordPress export data
- [x] Update database with correct publish dates
- [x] Verify dates display correctly on articles landing page

## Article Card Styling Improvements
- [x] Reverse article sort order to show most recent first
- [x] Remove bubble backgrounds from category badges
- [x] Apply accent colors to read time, date, and category text
- [x] Add 1pt accent-colored outline to article cards
- [x] Add accent-colored glow effect on card hover

## Article Page Sort and Search
- [x] Remove arrow icon on hover from article cards
- [x] Replace sort dropdown with modern category filter badges
- [x] Add search input to filter articles by title and excerpt
- [x] Implement category filtering logic that works with search

## Article Detail Page Improvements
- [ ] Fix video embeds to use 16:9 aspect ratio
- [ ] Make TOC sticky so it follows scroll position
- [ ] Ensure bullet points display correctly in article content
- [ ] Create relevant tags for all articles
- [ ] Assign tags to all 24 articles in database
- [ ] Display tags on article detail pages

## Article Detail Page Improvements (Completed)
- [x] Fix video aspect ratio to 16:9
- [x] Make TOC sticky to follow scroll position
- [x] Ensure bullet points are visible in article content
- [x] Create relevant tags for all articles (24 tags created)
- [x] Assign tags to all articles in database (70 tag assignments)
- [x] Display tags on article detail pages

## Article Page Enhancements
- [x] Fix TOC to be truly sticky (not scrolling with content)
- [x] Redesign article header/beginning section
- [x] Add minimum 5 tags to all articles in database
- [x] Move tags to bottom of article content
- [x] Create author profile section with photo and bio
- [x] Add like button with tracking to articles
- [x] Add read count tracking to articles
- [x] Apply category accent color to bullet points
- [x] Apply category accent color to bold text
- [x] Apply category accent color to reading progress bar
- [x] Enhance overall design aesthetic with modern styling

## Real Likes and Views Tracking
- [x] Add likes and views columns to articles table
- [x] Create database migration SQL for new columns
- [x] Create tRPC mutation for incrementing article views
- [x] Create tRPC mutation for toggling article likes
- [x] Move likes and views to article header (top section)
- [x] Connect likes/views to real database data
- [x] Implement view tracking on page load
- [x] Implement like toggle with optimistic updates
- [x] Test likes and views tracking functionality

## Article Comment System
- [x] Create comments table schema with nested reply support
- [x] Generate and apply database migration for comments table
- [x] Create tRPC query to fetch comments for an article
- [x] Create tRPC mutation to add new comments
- [x] Create tRPC mutation to add replies to comments
- [x] Create tRPC mutation to delete comments (author or admin only)
- [x] Design comment UI component with reply functionality
- [x] Add comment form with authentication check
- [x] Display comments list with nested replies
- [x] Integrate comment system into ArticleDetail page
- [x] Test comment creation, replies, and deletion

## Article Page UX Fixes
- [x] Move comments section to better location (after tags, before author profile)
- [x] Optimize article image loading and lazy loading
- [x] Remove "+" icon from FAQ accordion items
- [x] Test all fixes on article detail page

## Fix Article Image Loading
- [x] Investigate weird image loading behavior
- [x] Add aspect ratio preservation to prevent layout shift
- [x] Add loading skeleton/placeholder for images
- [x] Test image loading across different articles

## Progressive Image Loading (Blur-up Effect)
- [x] Create ProgressiveImage component with blur-up effect
- [x] Add image load state tracking (loading, loaded, error)
- [x] Implement smooth transition from blur to sharp
- [x] Integrate into ArticleDetail cover image
- [x] Integrate into ArticleDetail content images
- [x] Test blur-up effect on slow connections

## Fix Image Flash on Scroll
- [x] Fix ProgressiveImage component state management to prevent re-render flash
- [x] Use useRef to track loaded state persistently
- [x] Test scrolling up and down to verify no flashing

## Fix Lazy-Loaded Image Flash
- [ ] Update ProgressiveImage to skip blur animation for already-loaded images
- [ ] Test scrolling down and back up to verify no flash on lazy images

## Replace Blur-up with Skeleton Loaders
- [x] Remove blur-up animation from ProgressiveImage
- [x] Use simple skeleton loader placeholder instead
- [x] Test that images don't flash when scrolling

## Debug Image Flashing Root Cause
- [x] Check browser console for errors or warnings
- [x] Investigate if native lazy loading is causing issues
- [x] Check if CSS transitions are triggering
- [x] Test with loading="eager" to isolate lazy loading
- [x] Implement proper fix based on findings

## URGENT: Fix Images Disappearing on Scroll
- [x] Read ArticleDetail.tsx to see how images are actually rendered
- [x] Check if there's any conditional rendering or visibility logic
- [x] Remove ALL lazy loading and opacity transitions
- [x] Ensure images stay visible permanently once loaded
- [x] Test scrolling up and down extensively

## Fix Images Disappearing DURING Scroll
- [x] Check for CSS transitions or opacity changes on scroll
- [x] Look for scroll event handlers that might affect image visibility
- [x] Check ProgressiveImage component for any scroll-related logic
- [x] Remove any code that changes image visibility during scroll
- [x] Verify images stay visible while actively scrolling

## Force Browser to Keep Images Rendered
- [x] Add will-change: transform to images to create compositor layer
- [x] Add contain: layout style paint to prevent browser optimization
- [x] Remove any content-visibility CSS that might be hiding images
- [x] Test scrolling to verify images never disappear

## Fix Safari Image Disappearing Bug
- [x] Remove contain property (Safari doesn't handle it well)
- [x] Add -webkit-transform for Safari compatibility
- [x] Add backface-visibility: hidden for Safari
- [x] Test on Safari to verify images stay visible during scroll

## Safari Alternative Rendering Fix
- [x] Add explicit width/height attributes to prevent layout shift
- [x] Use background-image instead of img tags for Safari
- [x] Add position: relative to image containers
- [x] Test on Safari to confirm images stay visible

## Fix ResizeObserver Safari Bug
- [x] Find ResizeObserver usage in ArticleDetail
- [x] Replace with IntersectionObserver or scroll events for Safari
- [x] Wrap ResizeObserver in try-catch to suppress errors
- [x] Test on Safari to confirm images stay visible

## Suppress ResizeObserver Errors Globally
- [x] Add global error handler to suppress ResizeObserver loop errors
- [x] Search for all ResizeObserver usage in components
- [x] Test on Safari to verify fix

## Re-enable Lazy Loading
- [x] Update ProgressiveImage component to support lazy loading prop
- [x] Update ArticleDetail to use lazy loading for content images (not cover)
- [x] Test lazy loading on Safari
- [x] Test lazy loading on Chrome

## Fix TOC Navigation
- [x] Make TOC links clickable and scroll to sections
- [x] Add sticky positioning with bottom boundary
- [x] Prevent TOC from scrolling into footer
- [x] Test TOC navigation and sticky behavior

## TOC Bottom Boundary
- [x] Add bottom constraint to TOC sticky positioning
- [x] Ensure TOC stops before footer section
- [x] Test TOC follows scroll but stops at article end

## Debug TOC Issues
- [x] Fix TOC stuck at top (should follow scroll)
- [x] Fix TOC click navigation (should scroll to sections)
- [x] Test TOC sticky behavior
- [x] Test TOC click-to-scroll functionality

## Fix TOC Sticky Behavior
- [x] Investigate why TOC is stuck at top instead of following scroll
- [x] Fix sticky positioning to travel with article
- [x] Ensure TOC is hidden on mobile (already has hidden lg:block)
- [x] Test TOC sticky behavior on desktop
- [x] Test TOC is hidden on mobile

## Debug TOC Not Following Scroll
- [x] Visually inspect TOC in browser
- [x] Identify why sticky positioning isn't working
- [x] Fix TOC to travel with article scroll
- [x] Verify TOC follows scroll correctly

## Verify TOC Sticky Behavior
- [x] Test TOC in browser on desktop
- [x] Confirm TOC stays visible while scrolling
- [x] Adjust if TOC is still scrolling away

## Contact Page Redesign
- [x] Upload Brandon illustration to S3
- [x] Create Contact page component with modern layout
- [x] Add hover glow effect to illustration
- [x] Implement contact form with validation
- [x] Add social media links and contact methods
- [x] Test form submission and hover effects

## Contact Page Redesign v2
- [x] Make form the hero/focal point
- [x] Smaller illustration placement
- [x] Pixel-perfect glow using drop-shadow filter
- [x] Bold, eye-catching layout with wow factor
- [x] Test hover glow on PNG pixels only

## Contact Page - Bold & Colorful v3
- [x] Add vibrant gradient backgrounds
- [x] Create animated clock with moving hands
- [x] Create animated hourglass
- [x] Multi-color pulsing glow on illustration hover
- [x] Colorful form elements and accents
- [x] Fill black space with energy and color

## Contact Page - Contrast & Polish v4
- [x] Fix contrast issues (white text on dark backgrounds)
- [x] Remove gradient from H1 and button
- [x] Better thought-out color scheme
- [x] Stronger, more visible animations
- [x] Keep cyan-purple gradient on reply rate
- [x] Unified clock hand colors

## Contact Page - Compact Layout
- [x] Remove Currently Accepting section
- [x] Reduce vertical spacing/padding
- [x] Make page more compact overall

## Contact Page - Stats Row & Bounce
- [x] Move Instagram card to stats row (3-column grid)
- [x] Add stronger bounce animation to Brandon illustration
- [x] Test responsive layout with 3 stat cards

## Contact Page - Contact Methods Inline
- [x] Remove Instagram from stats row
- [x] Restore Instagram to contact methods section
- [x] Make Email, LinkedIn, Instagram display inline (horizontal row)
- [x] Keep stats row as 2 columns (Response Time + Reply Rate)

## Contact Page - Correct Layout & Animation
- [x] Stack contact methods vertically (Email, LinkedIn, Instagram)
- [x] Move stats (Response Time + Reply Rate) inline with contact methods
- [x] Add constant floating animation to cat illustration
- [x] Rainbow glow only appears on hover (not constant)

## Contact Page - Final Layout Fix
- [x] Make Brandon cat image smaller
- [x] Form becomes the focal point
- [x] Arrange bottom section (contact methods + stats) in clean layout
- [x] Test overall balance and proportions

## Contact Page - Complete Professional Redesign
- [x] Design proper visual hierarchy with form as hero
- [x] Create balanced layout with breathing room
- [x] Position illustration as accent, not competitor
- [x] Arrange stats and contact methods as supporting elements
- [x] Apply bold, confident design decisions
- [x] Test overall composition and flow

## Contact Page - Reposition Stats
- [x] Move Response Time and Reply Rate out of 'Other Ways to Reach Me'
- [x] Position stats as separate credibility section
- [x] Keep only Email, LinkedIn, Instagram in contact methods
- [x] Test overall information architecture

## News Section - SEO Powerhouse
- [x] Design news landing page with featured recent item hero
- [x] Create news grid layout for remaining items
- [x] Build news detail page component
- [x] Add external link buttons for sources
- [x] Implement SEO metadata (Open Graph, Twitter Cards)
- [x] Add structured data (JSON-LD schema)
- [x] Add social sharing buttons
- [x] Test SEO optimization and metadata

## News Filtering & RSS Feed
- [x] Add search input to news landing page
- [x] Add category filter dropdown
- [x] Implement client-side filtering logic
- [x] Create RSS feed generation endpoint
- [x] Add RSS feed link to news page
- [x] Test search and filtering
- [x] Test RSS feed validity

## New Swan Theatre Festival 2026 News Article
- [x] Upload cover image to S3
- [x] Create news article in database
- [x] Add external link to New Swan website
- [x] Test article display and SEO metadata

## News Pages Redesign
- [x] Separate News, Articles, Portfolio, Categories in navigation
- [x] Add title overlays on news hero images
- [x] Implement dynamic pixelated gradient backgrounds from image colors
- [x] Redesign news cards with bold typography
- [x] Test visual impact and performance

## News Timeline Redesign
- [x] Remove pixelated gradients from news landing page
- [x] Create timeline layout organized by year
- [x] Add visual timeline markers and year headers
- [x] Group news items under respective years
- [x] Test timeline navigation and responsiveness

## News Category Dropdown Fixes
- [x] Make category dropdown same size as search input
- [x] Filter categories to show only news categories (not article categories)
- [x] Test dropdown sizing and category filtering

## Bug Fix - Project Detail Page Error
- [x] Fix API query error on /projects/bell-book-and-candle (pattern matching error)

## Bug Fixes - Images and Discipline Separation
- [x] Fix missing images for Bell, Book and Candle project
- [ ] Ensure projects don't cross over disciplines (Scenic, Experiential, Rendering, Models should be completely separate)

## Image Optimization Feature
- [x] Add Sharp library for image processing
- [x] Implement WebP conversion for uploaded images
- [x] Add automatic resizing (max 2000px width for full size)
- [x] Add compression (85% quality)
- [x] Upload Bell Book and Candle images with proper alt text

## News Data Migration from Supabase
- [x] Access existing website and analyze news structure
- [x] Extract all news articles data (30 articles fetched from Supabase API)
- [x] Download and optimize news images (15 cover images uploaded to S3 CDN)
- [x] Insert news data into new database (25 of 30 articles successfully imported)
- [x] Verify news articles display correctly

## Articles Section Development
- [x] Update news schema to add externalLink and tags fields
- [x] Generate and apply schema migration
- [x] Create news categories in database (6 categories created)
- [x] Migrate all news articles with blocks format
- [x] News section fully functional (articles use same structure)
- [ ] Convert Supabase content to blocks format and insert all 30 articles
- [ ] Design articles section UI with rich content blocks
- [ ] Build article detail page with proper typography and layout
- [ ] Add article listing page with filtering

## News Articles Cleanup
- [x] Audit all 25 imported news articles for missing content
- [x] Find and remove duplicate news items (removed duplicate "Returning to New Swan 2026")
- [x] Fix missing external links in news articles (added externalLink field and button)
- [x] Fix missing or incomplete text/content blocks (content blocks rendering correctly)
- [x] Add 5 relevant tags to each news article (30 articles updated with relevant tags)
- [x] Verify all news articles display correctly (tags and external links showing)

## News Articles Image Fixes
- [ ] Find "Making My SCR Debut" article and add cover image
- [ ] Find "Assisting Tom" article and add cover image
- [ ] Find "40 production" article and add cover image
- [ ] Verify all three articles display with proper cards on news page

## News Articles Image Fixes - COMPLETED
- [x] Find "Making My SCR Debut" article and add cover image (Brandon with scenic model at SCR)
- [x] Find "Assisting Tom Buderwitz" article and add cover image (The Play That Goes Wrong production photo)
- [x] Find "40 Productions at Okoboji" article and add cover image (40 production collage)
- [x] Find "Fifth Season at Utah Shakespeare" article and add cover image (The Importance of Being Earnest)
- [x] Verify all four articles display with proper cards on news page

## Extract Full Content for 4 News Articles
- [ ] Access brandonptdavis.com/news and find the 4 articles
- [ ] Extract full content for "Making My SCR Debut"
- [ ] Extract full content for "Assisting Tom Buderwitz"
- [ ] Extract full content for "40 Productions at Okoboji"
- [ ] Extract full content for "Fifth Season at Utah Shakespeare"
- [ ] Update database with complete content blocks
- [ ] Verify all 4 articles display with full content and images
- [x] Add cover images to 4 news articles (Million Dollar Quartet, Tom Buderwitz, 40 Productions, Utah Shakespeare)
- [ ] Add categories/tags system to news articles
- [ ] Update database schema with categories field
- [ ] Categorize all existing articles
- [ ] Add category filter UI to news page
- [ ] Test category filtering functionality
- [ ] Add cover images to 26 remaining news articles
- [x] Redesign About pages with bold, art-based aesthetic (larger typography, striking visuals)
- [ ] Fix About page: add profile picture at top, design work images, vibrant colors, animations, move personal gallery to bottom
- [x] Simplify About page - remove excessive content, keep hero + 3-4 projects + brief philosophy + gallery
- [x] Strip About page to simple bio - remove Design in Action, remove CTA cards, keep only hero + bio + gallery
- [x] Fix About page name typography - reduce font size so full name fits without wrapping

- [x] Implement auto-hide navigation (hide on scroll down, show on scroll up)
- [x] Convert navigation dropdowns to hover-based (not click)
- [x] Make all nav items clickable (Work, News, Articles, Studio)
- [x] Apply neon/cyan aesthetic to navigation design

- [x] Add NEWS dropdown menu with category filters
- [x] Add ARTICLES dropdown menu with category filters  
- [x] Design custom neon line-art SVG icons for all nav items (WORK, NEWS, ABOUT, ARTICLES, STUDIO)

- [x] Fix navigation to use consistent orange/blue/red color scheme (not cyan/gold)
- [x] Move icons from top-level nav to dropdown menus only
- [x] Fix dropdown menu clickability issues

- [x] Design creative theatrical-inspired icons for dropdown menus (spotlight, curtain, blueprint, etc.)
- [x] Fix dropdown retraction timing - add delay so users can click items

- [x] Fix ARTICLES dropdown to show actual article categories from database

## Studio Redesign
- [x] Research Vectorworks tutorials and find similar educational videos
- [x] Design Studio landing page with 4 sections (Tutorials, App Studio, Vault, Scenic Directory)
- [x] Build Tutorials page with YouTube videos and enhanced educational content
- [x] Build App Studio page with interactive tools (migrate from old codebase)
- [ ] Build Vault page for sharing Vectorworks assets (2D drafting, 3D models) - POSTPONED
- [x] Build Scenic Directory page with categorized resources (already have data)
- [x] Create/source card images for Studio landing page (camera lens, grid ruler, library, network)
- [x] Create database schema for tutorials, apps, vault items if needed
- [x] Test all Studio pages and navigation

## Studio Redesign - FIX QUALITY ISSUES
- [ ] Generate AI images for Studio cards matching theatrical neon aesthetic (not stock photos)
- [ ] Redesign Studio landing page to match reference design quality
- [ ] Restructure App Studio - create individual pages for each tool (not one page with all tools)
- [ ] Create App Studio landing page showing all available apps

## Tutorial Content Generation
- [x] Review existing StudioTutorials page structure
- [x] Generate educational content from "Navigating the User Interface" tutorial script
- [x] Create tutorial detail page with video embed, transcript, key concepts, timestamps
- [x] Add tutorial to StudioTutorials list with proper metadata

## Tutorial Detail Page Redesign
- [x] Research and curate related Vectorworks resources (documentation, forums, tools)
- [x] Redesign tutorial detail page with tabbed gallery layout (not stacked sections)
- [x] Apply theatrical aesthetic: sharp corners, bold typography, neon accents, technical lines
- [x] Use orange/blue/red/purple color scheme consistently
- [x] Remove all rounded corners and corporate design elements

## Tutorial Detail Page Quality Fixes
- [x] Fix black text on black background - ensure proper text contrast throughout
- [x] Redesign tabs with better quality (spacing, borders, active states, typography)
- [x] Add rounded corners to video player for better UX
- [x] Overall quality check - professional polish on all sections

- [x] Add short description/subtitle under tutorial title for quick overview

- [x] Remove placeholder tutorials - keep only real "Navigating the User Interface" tutorial
- [x] Fix tutorial card images to fill full width with no white space at top

- [x] Remove gap between card image and content section in tutorial cards

- [x] Add rounded corners to tutorial card images
- [x] Restore card border/outline
- [x] Ensure image fills card properly with rounded corners

- [x] Redesign tutorial cards to large feature-style layout with full-width thumbnail and overlaid content

- [x] Generate educational content from "Understanding Classes" tutorial script
- [x] Add "Understanding Classes" tutorial to StudioTutorials page
- [x] Create detail page for "Understanding Classes" tutorial

- [x] Fix missing relatedResources field in Understanding Classes tutorial causing error

- [x] Generate educational content from "Understanding Design Layers" tutorial script
- [x] Add "Understanding Design Layers" tutorial to StudioTutorials page
- [x] Create detail page for "Understanding Design Layers" tutorial

## Re-apply Tutorial Additions (After Sandbox Reset)
- [x] Re-add tutorials 4-5 to StudioTutorials.tsx list
- [x] Fix nested anchor tag error in TutorialDetail.tsx
- [ ] Add tutorial 4 (Installing Workspace) detail content to TutorialDetail.tsx
- [ ] Add tutorial 5 (Basics Tool Palette) detail content to TutorialDetail.tsx
- [ ] Update all tutorial dates to correct YouTube publish dates (Jan 24-27, 2021)

## Tutorial Landing Page Fixes
- [x] Update all tutorial dates to match YouTube publish dates (Jan 24-27, 2021)
- [x] Change tutorial cards layout from single-column to 4-wide grid
- [x] Change tutorial grid from 4 columns to 3 columns and fix thumbnail sizing to fill card width
- [x] Align tutorial card thumbnails to the very top of cards (remove gap above images)
- [x] Align news card images to the top of cards (remove gap above images)
- [x] Align related project card images to top on news detail pages
- [x] Ensure all work and project portfolio cards have image-to-top alignment
- [x] Fix missing navbar on contact page
- [x] Add tutorial 6: Sheet Layers with comprehensive educational content
- [x] Fix blank key concepts in tutorial 6 Sheet Layers Concepts tab
- [x] Add tutorial 7: Creating Trim Profiles with Polyline Tool with comprehensive educational content
- [x] Add tutorial 8: 2D Edit and Modify Tricks with comprehensive educational content
- [x] Fix all tutorial transcripts (1-8) - edit raw fragments into readable text with proper sentences and punctuation
- [x] Add tutorial 9: Resource Manager Basics with comprehensive educational content and pre-formatted transcript
- [x] Fix tutorial 9 (Resource Manager Basics) video not loading
- [x] Add tutorial 10: Understanding Symbols with comprehensive educational content and pre-formatted transcript
- [x] Add tutorial 11: 2D Annotations and Dimensioning with comprehensive educational content and pre-formatted transcript
- [x] Fix tutorial 11 not displaying on tutorials page (verified it displays correctly)
- [x] Add tutorial 12: 3D Modeling Basics with comprehensive educational content and pre-formatted transcript
- [ ] Add tutorial 13: Hybrid Symbols with comprehensive educational content and pre-formatted transcript
- [x] Add tutorial 13: Hybrid Symbols with comprehensive educational content and pre-formatted transcript
- [x] Fix timestamp and date display issues on tutorial detail pages

## Tutorial Updates
- [x] Add note to tutorial 14 (Basics of Textures) that OpenGL is now called "Shaded" in current Vectorworks versions
- [x] Add tutorial 15: 3D Modeling Tools (18:19) with comprehensive educational content
- [x] Add tutorial 16: Creating 24x36 PDFs Without a Plotter (3:28) with comprehensive educational content
- [x] Add tutorial 17: Modeling a Table (37:48) with comprehensive educational content
- [x] Add tutorial 18: Creating a Camera and Rendering (10:36) with comprehensive educational content
- [x] Add tutorial 19: Creating 2D Drafting from 3D Models (24:00) with comprehensive educational content

## New Features
- [x] Implement tutorial search functionality with keyword filtering across titles, descriptions, and transcripts
- [x] Create database schema for tutorial progress tracking (tutorialProgress table)
- [x] Implement backend tRPC procedures for marking tutorials as watched and fetching progress
- [x] Add frontend UI for marking tutorials as watched with persistent checkmarks
- [x] Display completion percentage on tutorials page

## Article Enhancement Project
- [ ] Review all existing articles and document current state
- [ ] Enhance article listing page design to match tutorial quality
- [ ] Improve article detail page formatting and typography
- [ ] Add hero images to articles
- [ ] Add inline images and visual elements to article content
- [ ] Improve article metadata display (date, read time, categories)
- [ ] Add article navigation (previous/next articles)
- [ ] Test all articles on different screen sizes

## Computer Literacy Article Fixes
- [x] Fix inconsistent formatting (drop cap, weird middle formatting)
- [x] Remove FAQ section from article
- [x] Add inline images throughout article (3-4 relevant images)
- [x] Add visual callout boxes for key insights (pull quotes)
- [ ] Add previous/next article navigation
- [ ] Add reading progress indicator
- [x] Ensure consistent typography throughout
- [ ] Test article on mobile and desktop

## Computer Hardware Article Update for 2026
- [x] Review current article content and identify outdated information
- [x] Update hardware recommendations for 2026 (CPU, GPU, RAM, storage specs and pricing)
- [x] Rewrite content in Brandon's voice while keeping core message
- [ ] Fix formatting issues (sections, bullet lists, spacing)
- [x] Generate 3-4 new dramatic theatrical images with cyan lighting
- [ ] Add updated date field to article
- [ ] Test article display and readability

## Hardware Article Formatting Fixes
- [ ] Fix heading hierarchy - use H2 for main sections, H3/H4 for subsections (reduce TOC length)
- [x] Clean up ** bold formatting showing in text
- [ ] Make H2 size consistent with computer literacy article (currently too large)
- [ ] Restore Beowulf video joke (was removed by mistake)
- [ ] Update hero image to match article card style (vintage computer aesthetic, not dramatic theatrical)

## Article Landing Page Fixes
- [x] Fix article card text size - too large and covering metadata
- [x] Separate musical theatre section from regular articles on landing page

## Homepage SEO Fixes
- [x] Add keywords meta tag
- [x] Optimize title to 30-60 characters
- [x] Add description meta tag (50-160 characters)

## Open Graph & Twitter Card Implementation
- [x] Add static OG/Twitter tags to homepage
- [x] Add dynamic OG/Twitter tags to project detail pages
- [x] Add dynamic OG/Twitter tags to article detail pages
- [x] Add dynamic OG/Twitter tags to news detail pages
- [ ] Add static OG/Twitter tags to About, Contact, Studio pages
- [x] Test social media sharing previews

## Default OG Image
- [x] Generate default Open Graph image (1200×630px)
- [x] Add image to public directory
- [x] Update meta tag references

## Alt Text Migration
- [ ] Extract alt text from original Supabase data
- [ ] Map original images to new project images
- [ ] Update projectImages table with alt text
- [ ] Verify alt text displays correctly

## AI Alt Text Generation
- [x] Fetch all project images from database with project metadata
- [x] Generate alt text using LLM with format: "[Production] - Scenic design by Brandon PT Davis. [Description]"
- [x] Update projectImages table with generated alt text
- [x] Verify alt text displays correctly on project pages

## XML Sitemaps Implementation
- [x] Create sitemap generation utilities and Express routes
- [x] Implement main sitemap with all pages (homepage, projects, articles, news, static pages)
- [x] Implement image sitemap with all 248 project images and alt text
- [x] Implement video sitemap with project videos and metadata
- [x] Create sitemap index linking to main, image, and video sitemaps
- [x] Create robots.txt pointing to sitemap index
- [x] Test all sitemap URLs and verify XML format
- [x] Verify sitemaps accessible and properly formatted

## RSS Feeds Implementation
- [x] Create RSS feed generation utilities
- [x] Implement articles RSS feed with full content
- [x] Implement news RSS feed with full content
- [x] Add RSS feed links to HTML head tags
- [x] Test RSS feeds in feed readers
- [x] Verify RSS feeds validate against RSS 2.0 spec

## Tutorials Sitemap & RSS
- [x] Add tutorials listing page to main sitemap
- [x] Add individual tutorial detail pages to main sitemap
- [x] Create tutorials RSS feed
- [x] Add tutorials RSS feed link to HTML head
- [x] Test tutorials sitemap and RSS endpoints

## Structured Data (JSON-LD) Implementation
- [ ] Create JSON-LD schema generation utilities
- [ ] Add Person schema to homepage with profile, credentials, and social links
- [ ] Add Person schema to About page
- [ ] Add Organization schema to homepage
- [ ] Test schema markup with Google Rich Results Test
- [ ] Validate JSON-LD syntax and structure

## Structured Data Accuracy Updates
- [x] Research Brandon PT Davis professional background (South Coast Rep, USA 829, Adaptive Design Services)
- [x] Verify educational credentials (Stephens College BFA, UC Irvine MFA)
- [x] Update Person schema with accurate professional details
- [x] Update Organization schema with correct information
- [x] Remove inaccurate Broadway references
- [x] Add correct social profiles (USA 829, Adaptive Design Services, Instagram, LinkedIn, YouTube, Facebook)
- [x] Update location to Irvine, CA
- [x] Update email to info@brandonptdavis.com

## CreativeWork Schema for Projects
- [x] Analyze project data model and available fields
- [x] Create CreativeWork schema component for scenic design projects
- [x] Add schema markup to ProjectDetail page
- [x] Include project images, dates, venue, description in schema
- [x] Test CreativeWork schema with Google Rich Results Test
- [x] Validate schema appears correctly on all project pages

## BreadcrumbList Schema Implementation
- [x] Add BreadcrumbList schema component to StructuredData
- [x] Implement breadcrumbs on project detail pages
- [x] Implement breadcrumbs on article detail pages
- [x] Implement breadcrumbs on news detail pages
- [x] Implement breadcrumbs on tutorial detail pages
- [x] Test breadcrumb schema with Google Rich Results Test

## VideoObject Schema for Tutorials
- [x] Add VideoObject schema component to StructuredData
- [x] Implement VideoObject schema on tutorial detail pages
- [x] Include video URL, thumbnail, duration, upload date
- [x] Test VideoObject schema with Google Rich Results Test

## Article Schema for Blog Posts
- [x] Add Article/BlogPosting schema component to StructuredData
- [x] Implement Article schema on article detail pages
- [x] Implement Article schema on news detail pages
- [x] Include author, publish date, featured image, word count
- [x] Test Article schema with Google Rich Results Test

## Studio Landing Page Redesign
- [x] Upload all Studio images to S3
- [x] Create hero section with "Everything you need to design better"
- [x] Implement 4 large portrait cards (Tutorials, App Studio, Vault, Scenic Directory)
- [x] Create "Quick access to tools" section
- [x] Implement 6 tool cards grid (Scale Calculator, Dimension Reference, Paint Calculator, Design History, Classical Orders, Paint Finder)
- [x] Apply modern design system (bold typography, accent colors, rounded corners)
- [x] Add hover effects and animations to cards
- [x] Create App Studio landing page for individual apps
- [x] Link cards to appropriate pages
- [x] Test responsive layout on mobile/tablet

## Studio Card Layout Fixes
- [x] Fix portrait cards to fill entire card area (remove gaps)
- [x] Convert tool cards from grid to horizontal scrollable row
- [x] Make tool cards smaller for better scrolling experience
- [x] Test horizontal scroll on mobile and desktop

## Tool Cards Improvements
- [x] Change tool cards to landscape aspect ratio (16:9)
- [x] Fill entire tool card area with images (remove gaps)
- [x] Add left/right navigation arrows for desktop scrolling
- [x] Test navigation arrows and horizontal scroll on desktop
- [x] Ensure mobile touch scrolling still works

## Scroll and Content Visibility Fixes
- [x] Fix scroll jump issue in Quick Access section
- [x] Fix hidden content in expanded cards
- [x] Ensure all card content is visible when clicked/expanded
- [x] Test scroll behavior across all sections

## Scale Calculator App Rebuild
- [x] Examine existing Scale Calculator code and functionality
- [x] Design mobile-first responsive layout (app-like interface)
- [x] Implement scale conversion logic for 3D printing
- [x] Add architectural scale conversions
- [x] Add bidirectional conversion (Real→Scale and Scale→Real)
- [x] Add scrollable scale ruler with navigation arrows
- [x] Add copy to clipboard functionality
- [x] Test calculator on mobile devices
- [x] Test calculator on desktop
- [x] Ensure smooth touch interactions for mobile

## Scale Calculator Redesign
- [x] Redesign mobile-first layout to fit on one screen (no scrolling)
- [x] Add header image from original design (scale-converter-abstract.webp)
- [x] Replace blue calculator icon with Ruler icon
- [x] Implement 3D printer bed size checker
- [x] Add printer presets (Prusa Mini, Prusa MK4, Ender 3, Bambu Lab, etc.)
- [x] Show if model will fit on selected printer bed
- [x] Display build volume dimensions
- [x] Test mobile layout without scrolling
- [x] Test desktop layout

## Scale Calculator Design Fixes
- [x] Change header image to scale-header.webp (match card image)
- [x] Align header text with calculator app content (max-w-5xl container)
- [x] Fix tab colors to fill entire box (bg-[#2196F3] text-white)
- [x] Test header image and alignment
- [x] Test tab styling

## Fix Missing Header Image
- [x] Upload scale-header.webp to S3
- [x] Update Scale Calculator with correct S3 URL
- [x] Test image loads correctly

## Create App Page Rebuild Skill
- [x] Understand skill requirements and examples
- [x] Plan reusable contents (scripts, references, templates)
- [x] Initialize skill with init_skill.py
- [x] Write SKILL.md with instructions
- [x] Add bundled resources (design-checklist.md, app-page-template.tsx, upload_images.sh)
- [x] Validate skill
- [x] Deliver skill to user

## Dimension Reference App Rebuild
- [x] Examine original code and understand database structure
- [ ] Upload dimension-abstract.webp to S3
- [ ] Create DimensionReference.tsx from template
- [ ] Implement dimension database with categories
- [ ] Add search and filtering functionality
- [ ] Apply design checklist (header, tabs, mobile)
- [ ] Test implementation
- [x] Save checkpoint

## Dimension Reference Critical Fixes (User Reported - Feb 8, 2026)
- [x] Fix category button text overlap - added flex-nowrap to prevent wrapping
- [x] Regenerate wireframe graphics with solid gradient backgrounds (purple to blue)
- [x] Upload improved wireframes to S3 CDN
- [x] Update dimension items with new wireframe URLs (5 items: 2 booths, sofa, dining chair, bar stool)
- [x] Add wireframe rendering to dimension cards with gradient background
- [x] Test category scrolling and button visibility
- [x] Verify wireframe images display properly without transparency artifacts

## Dimension Reference UX Fixes (User Reported - Feb 8, 2026 Round 2)
- [x] Fix category button scrolling - buttons still overlapping, need proper horizontal scroll
- [x] Fix wireframe image layout - images should fill card width, not be centered 200px squares
- [x] Test category button scrolling functionality
- [x] Test wireframe image responsive layout

## Dimension Reference Wireframe Image Redesign (User Reported - Feb 8, 2026 Round 3)
- [x] Regenerate all 5 wireframe images in 16:9 aspect ratio to fill entire card space
- [x] Bake gradient background into images for uniform appearance
- [x] Upload new 16:9 wireframes to S3
- [x] Update dimension items with new wireframe URLs
- [x] Remove padding from image container to allow full fill
- [x] Test uniform appearance across all wireframe cards

## Design History Timeline App Enhancement (User Requested - Feb 8, 2026)
- [x] Search and collect high-quality Wikipedia images for all 30 design periods (interior/exterior architecture)
- [x] Replace Unsplash URLs with Wikipedia image URLs in DESIGN_PERIODS data
- [x] Integrate Header and Footer components for consistency with portfolio
- [x] Update styling to match portfolio design system (colors, fonts, spacing)
- [x] Add route to Studio apps section (/studio/apps/design-history-timeline)
- [x] Update Studio apps index to include Design History Timeline card
- [x] Optimize timeline animations for better performance
- [x] Improve mobile responsiveness (compact timeline dots, better card layout)
- [ ] Add era grouping feature (Ancient, Medieval, Renaissance, Modern, Contemporary)
- [ ] Add sorting options (chronological, alphabetical, by region)
- [ ] Add filter by region functionality
- [x] Test all features on mobile and desktop
- [x] Verify all Wikipedia images load correctly

## RelatedTools Component Fix (User Reported - Feb 8, 2026)
- [x] Fix nested anchor tags error in RelatedTools component
- [x] Test Design History Timeline page after fix

## Design History Timeline Image Improvements (User Requested - Feb 8, 2026)
- [x] Search for better interior/exterior Wikipedia images for Ancient periods (Egyptian, Greek, Roman)
- [x] Search for Medieval period images (Byzantine, Gothic)
- [x] Search for Renaissance and Baroque period images
- [x] Search for Neoclassical and Revival period images
- [x] Search for 19th century period images (Beaux-Arts, Arts & Crafts, Art Nouveau)
- [x] Search for Early Modernism images (Chicago School, Art Deco)
- [x] Search for High Modernism images (Bauhaus, De Stijl, International Style)
- [x] Search for Mid-Century and Late Modern images (Mid-Century Modern, Brutalism, Metabolism, High-Tech)
- [x] Search for Postmodern and Contemporary images (Postmodernism, Deconstructivism, Minimalism, Parametricism, Sustainable, Contemporary)
- [x] Upload all new images to S3 (76 images uploaded successfully)
- [x] Update DESIGN_PERIODS data with new image URLs (28 periods updated)
- [x] Test all images load correctly and represent periods accurately

## Design History Timeline Image Gallery (User Reported - Feb 8, 2026)
- [x] Check timeline data structure for gallery field
- [x] Search for additional interior images for all 28 periods
- [x] Search for additional exterior images for all 28 periods
- [x] Upload all new gallery images to S3 (101 images uploaded)
- [x] Update timeline data structure to support image arrays
- [x] Add gallery rendering UI component (2-column grid layout)
- [x] Test gallery display for all periods (minimum 2 images each)
- [x] Verify interior/exterior balance in galleries

## Design History Timeline Image Audit & Fixes (User Reported - Feb 8, 2026)
- [x] Audit all 28 periods to identify which ones are missing gallery images
- [x] Identify periods with incorrect cover images (10 periods with Unsplash covers)
- [x] Search for correct replacement cover images for 10 periods: Neoclassical, Gothic Revival, Beaux-Arts, Arts & Crafts, Chicago School, De Stijl, International Style, Mid-Century Modern, Metabolism, High-Tech
- [x] Upload all replacement cover images to S3 (10 images uploaded)
- [x] Update timeline data with correct cover images
- [x] Test all 28 periods to verify image accuracy and completeness

## Design History Timeline Header Update (User Requested - Feb 8, 2026)
- [x] Check Dimension Reference header format for consistency
- [x] Update Design History Timeline header to match other Studio apps
- [x] Add beta badge to indicate work-in-progress status
- [x] Test header appearance and verify consistency

## Design History Timeline Layout Alignment (User Reported - Feb 8, 2026)
- [x] Compare full layout structure between Dimension Reference and Design History Timeline
- [x] Identify specific layout differences (hero section structure, container widths, spacing, background colors)
- [x] Update Design History Timeline hero section to match Dimension Reference format
- [x] Update container widths and spacing to match other Studio apps
- [x] Test visual alignment with Dimension Reference

## Design History Timeline Hero Image Update (User Reported - Feb 8, 2026)
- [x] Search for or generate hero background image representing architectural history theme
- [x] Upload new hero image to S3
- [x] Update Design History Timeline hero section with new image URL
- [x] Test hero image appearance and theme consistency

## Rosco Paint Calculator Integration (User Requested - Feb 8, 2026)
- [x] Review uploaded Rosco Paint Calculator code structure and functionality
- [x] Copy file to project and integrate Header/Footer components
- [x] Update styling to match Studio apps design system (hero section, containers, spacing)
- [x] Add route to App.tsx for /studio/apps/rosco-paint-calculator
- [x] Update StudioApps page with Rosco Paint Calculator card
- [x] Test calculator functionality (mixing ratios, coverage calculations)
- [x] Verify responsive design on mobile and desktop

## Rosco Paint Calculator Saved Recipes Feature (User Requested - Feb 8, 2026)
- [x] Create database schema for paint_recipes table (id, userId, name, notes, targetColor, mixingRecipe, createdAt)
- [x] Generate and apply database migration SQL
- [x] Add database helper functions in server/db.ts for recipe CRUD operations
- [x] Create tRPC procedures for saveRecipe, getRecipes, updateRecipe, deleteRecipe
- [x] Add "Save Recipe" button and modal to RoscoPaintCalculator UI
- [x] Create SavedRecipes component to display user's saved recipes
- [x] Add recipe management UI (edit name/notes, delete, load recipe)
- [ ] Write vitest unit tests for recipe CRUD operations
- [ ] Test full saved recipes workflow in browser

## Rosco Paint Calculator Layout Improvement (User Requested - Feb 8, 2026)
- [x] Remove "Rosco Paint Abstract" component with blank image
- [x] Simplify layout to focus on color picker, mixing recipe, and paint library
- [x] Test improved user-friendly layout

## Rosco Paint Calculator Design System Alignment (User Requested - Feb 8, 2026)
- [x] Analyze design system used in Dimension Reference and Design History Timeline apps
- [x] Identify styling inconsistencies in Rosco Paint Calculator (cards, buttons, spacing, colors)
- [x] Redesign Save Recipe card to match site aesthetic
- [x] Update color picker section styling
- [x] Update paint library grid styling
- [x] Update mixing recipe result card styling
- [x] Ensure consistent rounded corners, shadows, and spacing throughout
- [x] Test redesigned app for visual consistency

## Rosco Paint Calculator Layout Improvement - Negative Space Fix (User Requested - Feb 8, 2026)
- [x] Analyze current layout and identify negative space issues
- [x] Design solution to fill vertical space below mixing recipe card (add Saved Recipes section)
- [x] Consider adding saved recipes section, paint library, or other relevant content
- [x] Implement Saved Recipes section below mixing recipe card
- [x] Fix TypeScript errors in saved recipes display
- [x] Add empty state for Saved Recipes section
- [ ] Test improved layout for better visual balance
- [x] Add "Coming Soon" badges to Paint Calculator, Classical Orders, and Paint Finder apps (not yet reintroduced)

## Remove Authentication Features (User Requested - Feb 8, 2026)
- [x] Remove saved recipes functionality from Rosco Paint Calculator (no sign-in, no save button)
- [x] Remove empty state with sign-in button from Rosco Paint Calculator
- [x] Replace Save Recipe button with Copy Recipe button
- [x] Remove comments section from article pages
- [x] Test paint calculator without authentication (Copy Recipe button works, no sign-in)
- [x] Test articles without comments section (verified: no comments component)
- [x] Correct coming soon badges: Remove from Rosco Paint Calculator, add to Model Scaler, Paint Finder, Classical Orders

## Create Fun 404 Page with Ghost Image (User Requested - Feb 8, 2026)
- [x] Upload ghost image to S3 and get CDN URL (https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/TGWPVtCzkqgWUcQx.jpeg)
- [x] Create NotFound.tsx component with ghost image
- [x] Add fun copy about being lost in the theatre ("Off Script", ghost light references)
- [x] Add navigation buttons to Home and Scenic Design Portfolio
- [x] Configure App.tsx routing to show 404 for non-existent routes (already configured with catch-all route)
- [x] Test 404 page by visiting invalid URL (verified: floating animation, fade effect, navigation buttons work)

## 404 Page Refinements (User Requested - Feb 8, 2026)
- [x] Remove background glow effect behind ghost image
- [x] Add floating/hovering animation to ghost image (4s vertical motion)
- [x] Add fade effect at bottom of ghost image (gradient to background)

## Update 404 Page Copy (User Requested - Feb 8, 2026)
- [x] Replace current copy with theatre announcement: "Ladies and gentlemen, we are experiencing a brief delay backstage..."

## Fix 404 Page Layout and Copy (User Requested - Feb 8, 2026)
- [x] Fix image crop to show full ghost (changed to object-cover object-top, removed fade)
- [x] Rewrite copy to be a clever theatre joke that makes sense for 404 ("This Page Has Left the Building")
- [x] Ensure entire page fits without scrolling (reduced image size, spacing, button padding)

## Replace Ghost Image with Cleaned Version (User Requested - Feb 8, 2026)
- [x] Upload cleaned ghost image to S3 (https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/XmkWKbpBTnVhFHuU.png)
- [x] Update 404 page to use new ghost image URL (changed to object-contain for proper display)

## Final 404 Page Refinements (User Requested - Feb 8, 2026)
- [x] Remove header and footer from 404 page
- [x] Add bottom fade effect back to ghost image (24px gradient)
- [x] Animate cloud/smoke with transparency pulsing effect (0.7 to 0.95 opacity, 3s loop)
- [x] Change copy to use emergency speech joke format ("Ladies and gentlemen, we are experiencing a brief technical difficulty...")

## Fix Ghost Image Fade (User Reported Issue - Feb 8, 2026)
- [x] Remove bottom fade - was creating awkward horizontal line cutting off legs

## Add Cyan Glow Effect to Ghost (User Requested - Feb 8, 2026)
- [x] Add soft cyan glow around ghost image to enhance ethereal appearance (double drop-shadow with cyan color)

## Add Subtle Bottom Fade to Ghost (User Requested - Feb 9, 2026)
- [x] Add gradual bottom fade so ghost blends naturally into background (128px gradient with via-stop for smooth transition)

## Fix Bottom Fade with Mask-Image (User Reported Issue - Feb 9, 2026)
- [x] Replace gradient overlay with CSS mask-image for smooth, natural fade without harsh line (gradient from 60% to 100%)

## Complete 404 Page Redesign (User Requested - Feb 9, 2026)
- [x] Fix rectangular glow issue (moved filter to inner wrapper div)
- [x] Redesign layout/composition (two-column grid layout, ghost left, content right)
- [x] Improve typography and spacing (larger 404, refined tracking, better line spacing)
- [x] Add more dramatic theatrical styling (spotlight effect, vignette, gradient divider)
- [x] Ensure ghost fades naturally (mask from 55% to 100% with smooth gradient)

## Simple High-Quality 404 Page (User Requested - Feb 9, 2026)
- [x] Generate new ghost image optimized for web (no glow issues)
- [x] Create simple, clean, elegant 404 design
- [x] Abandon ghost light concept (too complicated)
- [x] Create typography-focused 404 with theatrical message
- [x] Focus on quality over complexity

## Fix 404 Page Portfolio Link (User Reported - Feb 9, 2026)
- [x] Find correct portfolio route (/projects)
- [x] Update View Portfolio button to link to /projects instead of /work

## Fix Project Categories (User Reported - Feb 9, 2026)
- [x] Change "New Swan Venue File" from Scenic Design to Rendering
- [x] Change "Angel Food Cake" from Scenic Design to Rendering

## Fix Portfolio Data Issues (User Reported - Feb 9, 2026)
- [x] Review CV to extract correct company/venue information for all projects
- [x] Update missing company data in database (32 projects updated with client field)
- [x] Fix project sorting to order by publishedAt timestamp, then year (most recent first)
- [x] Verify correct chronological order on portfolio page (confirmed: 2025 → 2024 → 2023 → 2022 → 2020 → 2019 → 2018)

## Generate Production List and Fix Navigation (User Requested - Feb 9, 2026)
- [x] Query all projects and generate list for user to add month information (25 scenic design productions)
- [x] Fix project detail next/prev navigation to stay within discipline groups (scenic_design, experiential_design, rendering, scenic_models)
- [x] Test navigation between projects in same discipline (verified: The Glass Menagerie → Bell, Book, and Candle, both scenic_design)

## Update Project Dates with Correct Months (User Provided - Feb 9, 2026)
- [x] Update all 25 scenic design project publishedAt dates with correct months
- [x] Fix All My Sons year from 2011 to 2010
- [ ] Verify projects now display in correct chronological order within each year

## Fix Missing Company Metadata (User Reported - Feb 9, 2026)
- [x] Query database to find projects with NULL or empty client field (found 7 projects)
- [x] Update missing client data from CV for all theatre productions (Head Over Heels, Boeing Boeing, Merry Wives, Inspector Calls, Tomás, Angel Street, All My Sons)
- [x] Verify all projects display company names on portfolio page (all 7 projects now show company names)
- [x] Fix incorrect years for Head Over Heels (2023), An Inspector Calls (2022), Tomás (2022), Angel Street (2013)
- [x] Update An Inspector Calls location to Spirit Lake, IA

## Create Unique Portfolio Landing Pages for Each Discipline (User Requested - Feb 9, 2026)
- [x] Analyze current Projects page structure and design approach
- [x] Plan unique visual identities for each discipline:
  - Scenic Design: Keep current theatrical approach with genre filters
  - Experiential: Flexible, project-driven layout (no hard template)
  - Rendering: Technical precision, large visualization showcase
  - Scenic Models: Craftsmanship, 3D detail focus
- [x] Create fresh starting point designs aligned with site's aesthetic
- [x] Create separate page components for Experiential, Rendering, and Scenic Models
- [x] Design unique hero sections and layouts for each portfolio type:
  - Experiential: Bold immersive hero, flexible 2-column grid
  - Rendering: Technical clean hero with icon, large 16:9 showcase
  - Scenic Models: Craftsmanship focus, square grid with detail indicators
- [x] Update navigation to link to individual portfolio pages (Header dropdown updated)
- [x] Add routing for /projects/scenic-design, /projects/experiential, /projects/rendering, /projects/scenic-models
- [x] Test all portfolio pages for unique visual identity

## Create Unique Project Detail Pages for Each Discipline (User Requested - Feb 9, 2026)
- [x] Analyze current ProjectDetail page structure and reusable components
- [x] Plan unique layouts for each discipline:
  - Experiential: Custom-built pages (will build together one by one)
  - Rendering: Art gallery aesthetic with software/process icons
  - Scenic Models: Craftsmanship showcase (detail shots, materials, scale info)
- [x] Create initial RenderingProjectDetail component
- [x] Redesign RenderingProjectDetail with clean minimal layout:
  - Remove info overlay on images
  - Single full-width rendering image (one image per page)
  - 300-word artistic narrative section (poetic, not technical)
  - Subtle software/technical info presentation
  - Clean, gallery-like aesthetic
  - Comprehensive SEO optimization (meta tags, Open Graph, structured data)
  - Tags display for categorization and SEO
  - Alt text for all images
- [x] Compose artistic narrative for Ashes of the Underworld (pandemic isolation, liminal space theme)
- [x] Update routing to use RenderingProjectDetail for rendering discipline
- [x] Test redesigned rendering detail pages with real projects
- [ ] Ensure navigation (prev/next arrows) stays within discipline boundaries
- [ ] Future: Create ScenicModelsProjectDetail component
- [ ] Future: Create flexible component system for custom Experiential pages

## Redesign Rendering Portfolio with Ultra-Minimal Gallery Aesthetic (User Requested - Feb 9, 2026)
- [x] Analyze current rendering portfolio landing page and project detail flow
- [x] Redesign rendering project detail pages with ultra-minimal approach:
  - Remove visible tags (keep in meta tags only for SEO)
  - Shorten narrative to 50-75 words (poetic, evocative)
  - Remove or hide technical details section
  - Let images dominate - gallery exhibition label approach
  - Keep SEO strong through invisible meta tags, alt text, structured data
- [x] Update rendering portfolio landing page for cohesive gallery experience
- [x] Shorten descriptions on all rendering projects to 50-75 word poetic captions
- [x] Test complete rendering portfolio flow (landing → detail → back)
- [x] Ensure renderings feel like fine art, not technical portfolio pieces

## Fix Rendering Detail Page Header Overlap (User Reported - Feb 9, 2026)
- [x] Add proper top padding to rendering detail page container to prevent Back button from hiding behind header
- [x] Test that all content fits within visible frame below navigation bar

## Move New Swan Venue File to Experiential Design (User Requested - Feb 9, 2026)
- [x] Update New Swan Venue File project discipline from 'rendering' to 'experiential_design'
- [x] Verify project appears in experiential portfolio
- [x] Verify project removed from rendering portfolio

## Add New Rendering: The Northwind Mare Tavern (User Requested - Feb 9, 2026)
- [x] Upload SkyrimCafe_Ext.jpg to S3
- [x] Create project in database with title, year (2026), discipline (rendering)
- [x] Compose 50-75 word poetic caption about fantasy tavern concept
- [x] Add SEO keywords (fantasy, theme park, Tamriel, dining venue, etc.)
- [x] Add software tags (Vectorworks, Twinmotion, Photoshop)
- [x] Test rendering appears in portfolio

## Fix Missing Rendering Images on Detail Pages (User Reported - Feb 9, 2026)
- [x] Investigate issue - detail pages need images in projectImages table, not just coverImageUrl
- [x] Check projectImages table schema
- [x] Add The Northwind Mare Tavern image to projectImages table
- [x] Add Isolation image to projectImages table
- [x] Verify both images display on detail pages

## Fix Homepage SEO Issues (User Requested - Feb 9, 2026)
- [x] Check current homepage keywords (currently 12, need to reduce to 3-8)
- [x] Check current meta description (currently 172 chars, need 50-160)
- [x] Optimize keywords to 6 focused terms (scenic design, experiential design, Brandon Davis, theatre designer, themed entertainment, immersive design)
- [x] Shorten meta description to 158 characters
- [x] Update homepage SEO in index.html (meta tags, Open Graph, Twitter cards)
- [x] Verify SEO improvements

## Comprehensive SEO Audit & Fix (User Requested - Feb 9, 2026)
- [x] Search for any Broadway references across all pages (user is NOT a Broadway designer)
- [x] Identify all page types that need SEO audit
- [x] Audit all projects - found 30/37 with SEO issues
- [x] Add SEO keywords and display tags to 4 sample scenic design projects
- [x] Update project detail page to show display tags at bottom
- [x] Redesign tags section (user requested):
  - Make tags fully rounded (pill shape)
  - Match page accent color (changes per project)
  - Give tags own section with "Tags" heading
  - Prepare for future filtering/sorting functionality
- [x] Add SEO keywords and tags to all remaining scenic design projects (20 projects completed)
- [x] Test redesigned tag display on multiple scenic design project pages
- [x] Continue with other disciplines (Experiential, Rendering, Models)
  - [x] Add SEO keywords and tags to 8 experiential projects
  - [x] Verify rendering projects already have SEO (4 projects)
  - [x] Add SEO keywords and tags to 1 scenic models project
  - [x] Test tag display on experiential project page
- [ ] Audit article pages for SEO issues
- [ ] Audit news pages for SEO issues
- [ ] Audit static pages (About, Resume, Contact, Teaching, etc.)

## Add Tags to Articles and News (User Requested - Feb 9, 2026)
- [x] Audit article detail pages to see current design and tag display
- [x] Audit news detail pages to see current design and tag display
- [x] Query database to find all articles and news items
- [x] Add SEO keywords and display tags to all articles (23 articles completed)
- [x] Add SEO keywords and display tags to all news items (29 news items completed)
- [x] Style tags on article detail pages to match page design aesthetic (already well-styled)
- [x] Style tags on news detail pages to match page design aesthetic (updated to use junction table + rounded pills)
- [x] Test tag display on article and news pages (both working correctly!)

## Create Dedicated Tag Pages (User Requested - Feb 9, 2026)
- [x] Design tag page structure showing projects, articles, and news
- [x] Create tRPC query to fetch all content for a specific tag
- [x] Create TagDetail.tsx page component
- [x] Add route for tag pages in App.tsx
- [x] Make tags clickable on project detail pages
- [x] Make tags clickable on article detail pages
- [x] Make tags clickable on news detail pages
- [x] Test tag pages with various tags (Brand Experience with projects, Technology in Theatre with articles)
- [x] Save checkpoint

## SEO Audit and Optimization (User Requested - Feb 9, 2026)
- [ ] Audit meta tags (title, description) on all page types
- [ ] Check Open Graph tags for social media sharing
- [ ] Verify structured data (JSON-LD) implementation
- [ ] Check sitemap.xml exists and is properly configured
- [ ] Check robots.txt configuration
- [ ] Test SEO on homepage
- [ ] Test SEO on project detail pages
- [ ] Test SEO on article detail pages
- [ ] Test SEO on news detail pages
- [ ] Test SEO on tag pages
- [x] Fix Open Graph images to use content-specific cover images (projects, articles, news, tutorials)
  - Projects, articles, news already using coverImageUrl
  - Tutorials now using YouTube thumbnail
  - 15 items without cover images will use fallback headshot
- [x] Fix canonical URL tags (add to all pages) - Now using dynamic window.location.href
- [x] Fix Open Graph and Twitter URL mismatches - Now using canonicalUrl variable
- [x] Fix any other identified SEO issues (removed static OG tags from index.html)
- [x] Save checkpoint

## Implement Dynamic XML Sitemap Generation
- [x] Create sitemap.xml endpoint in Express server (already existed)
- [x] Query all projects, articles, news, and static pages (already implemented)
- [x] Generate XML sitemap with proper formatting and priorities (already implemented)
- [x] Test sitemap endpoint and validate XML format (working correctly with dynamic URLs)
- [x] Add sitemap reference to robots.txt (already implemented with dynamic URLs)
- [x] Save checkpoint

## Implement JSON-LD Structured Data (Person & Organization Schema)
- [x] Create StructuredData component for Person schema (already existed)
- [x] Create StructuredData component for Organization schema (already existed)
- [x] Add Person schema to homepage (already implemented with rich data)
- [x] Add Organization schema to homepage (already implemented with rich data)
- [x] Add appropriate schema to About page (already implemented)
- [x] Update URLs to use dynamic baseUrl instead of hardcoded domain
- [x] Test structured data with Google Rich Results Test (verified URLs are dynamic)
- [x] Save checkpoint

## Implement Breadcrumb Navigation UI
- [x] Create reusable Breadcrumb component with proper styling
- [x] Add breadcrumbs to ProjectDetail page
- [x] Add breadcrumbs to RenderingProjectDetail page
- [x] Add breadcrumbs to ArticleDetail page
- [x] Add breadcrumbs to NewsDetail page
- [x] Add breadcrumbs to TutorialDetail page
- [x] Test breadcrumb navigation on all pages (project, article, news all working)
- [x] Save checkpoint

## Fix Nested Anchor Tag Error in Breadcrumb
- [x] Update Breadcrumb component to remove nested anchor tags
- [x] Test fix on project page (no errors in console)
- [x] Save checkpoint

## Integrate Dynamic Social Media Links Page
- [x] Review and adapt Links.tsx component for the project
- [x] Create tRPC queries to fetch latest content (projects, articles, news) - using existing list routers
- [x] Add /links route in App.tsx
- [x] Test links page with dynamic content (working perfectly!)
- [x] Save checkpoint

## Change Links Page Grid to 2 Columns
- [x] Update grid layout from 3 columns to 2 columns
- [x] Fix infinite loop issue properly with useMemo
- [x] Test responsive behavior (2-column grid working perfectly)
- [ ] Save checkpoint

## Update Links Page Profile Picture
- [x] Upload new profile picture to S3
- [x] Update Links.tsx with new image URL
- [x] Remove site header and footer from Links page
- [ ] Save checkpoint

## Add Footer to Links Page
- [x] Add "Powered by Manus" footer at bottom
- [ ] Save checkpoint

## Set Up Automatic Daily GitHub Backups
- [x] Create scheduled task for daily backups (runs at 2:00 AM daily)
- [x] Test backup schedule (configured successfully)

## Enhance Red Bull Jukebox Experiential Design Project
- [ ] Research Red Bull Jukebox event online
- [ ] Review current project data in database
- [ ] Gather additional images and media
- [ ] Add Lumenati client logo
- [ ] Enhance project description with event details
- [ ] Add design process and creative approach
- [ ] Update creative team credits
- [ ] Test project page display
- [ ] Save checkpoint

## Red Bull Jukebox Project Enhancement
- [ ] Add Lumenati logo to project page
- [ ] Create structured credits section (Client: Red Bull, Agency: Lumenati, Team members)
- [ ] Add video embed showing LED stage design
- [ ] Update image captions to better describe CNC drafting work
- [ ] Add venue capacity and project scale details
- [ ] Improve project description with event context

## Red Bull Jukebox Agency-Style Redesign
- [x] Rewrite Design Notes in agency case study style (outcome-focused, confident tone)
- [x] Make Lumenati logo much more prominent in hero section (larger, better positioned)
- [x] Add Red Bull logo alongside Lumenati
- [x] Restructure copy to lead with impact/outcomes, then process details
- [x] Add project metrics/scale callouts (6,800 attendees, venue size, etc.)
- [x] Change "Renderings" label to "Technical Drawings" or "CNC Drafting Plates"
- [x] Remove duplicate production photo (Brothers Osborne image appears twice)
- [x] Add more event photos to showcase completed installation

## Red Bull Jukebox - TRUE Experiential Agency Redesign
- [ ] Fix Lumenati logo not displaying in hero section
- [ ] Clarify client hierarchy: Red Bull (brand client) → Lumenati (agency) → Brandon (freelancer for Lumenati)
- [ ] Replace long text paragraphs with bold, punchy headlines
- [ ] Add large stats/numbers section (6,800 fans, venue capacity, etc.)
- [ ] Add icons for key project elements (LED, CNC, fabrication, etc.)
- [ ] Create visual-first layout with less text, more impact
- [ ] Redesign "Design Notes" section to be more scannable with callouts
- [ ] Consider adding project highlights/key deliverables section with icons

## Red Bull Jukebox - REFINED Experiential Design (AJ + Lumenati hybrid)
- [x] Keep large logos at top (current implementation is good)
- [x] Restructure Design Notes with bold section headers: "THE CHALLENGE", "THE SOLUTION", "THE PROCESS", "THE IMPACT"
- [x] Keep stats section but refine styling (cards with borders, not just numbers)
- [x] Add more visual breathing room between sections
- [x] Make copy more conversational but still professional (between AJ's structure and Lumenati's edge)
- [x] Ensure hierarchy is clear: Client logos → Stats → Story → Images

## Red Bull Jukebox - Hero Simplification & Layout Fixes
- [x] Simplify hero section - remove clutter (move venue details, excerpt out of hero overlay)
- [x] Keep only: Logos + Client hierarchy + Project title in hero
- [x] Redesign image galleries as full-width grids (like Lumenati), not narrow columns
- [x] Elevate Technical Drawings section - make it more prominent, possibly move before Production Photos
- [x] Add visual hierarchy: Technical drawings (YOUR work) should be the star

## Red Bull Jukebox - Interspersed Layout & Fixes
- [x] Restructure page: text sections BETWEEN galleries (like AJ/Lumenati examples)
- [x] New flow: Intro → Stats → THE CHALLENGE → Technical Drawings → THE SOLUTION → Production Photos → THE PROCESS → Team
- [x] Fix logos for dark mode (too gray or false PNG - increase brightness/check transparency)
- [x] Change technical drawings aspect ratio to portrait (aspect-[3/4])
- [x] Remove hero image (Brothers Osborne stage shot) from Production Photos gallery
- [x] Remove "Read More" button - show full content inline

## Red Bull Jukebox - Final Fixes
- [x] Fix technical drawings aspect ratio - 3:2 landscape
- [x] Remove hero image from Event Photos gallery (Brothers Osborne stage shot)
- [x] Fix logo visibility - added white background container with backdrop blur for contrast
- [x] Rename "Production Photos" to "Event Photos"
- [x] Convert Event Photos from collapsible to proper gallery grid (like Technical Drawings)
- [x] Update copy to singular voice - Brandon is one person, not "we"
- [x] Review copy against August Jackson/Lumenati references for tone and style

## Red Bull Jukebox - Logo & Hero Fixes
- [x] Find white/light version of Red Bull logo that works on dark background
- [x] Find white/light version of Lumenati logo that works on dark background
- [x] Remove hero cover image entirely - use solid dark background instead
- [x] Remove white box around logos (weak solution)

## Red Bull Jukebox - Logo Size & Hero Height
- [x] Replace Lumenati logo with cropped version (remove black padding to match Red Bull size)
- [x] Reduce hero section height from 85vh to 45vh to bring content up

## Red Bull Jukebox - Theme-Aware Logos
- [x] Find colored Red Bull logo for light mode
- [x] Find colored Lumenati logo for light mode (original with colors)
- [x] Implement theme-aware logo switching (white for dark mode, colored for light mode)
- [x] Use colored Red Bull for both themes (works on both backgrounds)
- [x] Reduce logo sizes from h-16/20 to h-10/12 for better proportion

## Red Bull Jukebox - Restore Cover Image
- [x] Add cover image back to database for landing page display
- [x] Ensure project detail page still uses solid dark background (not the cover image)

## Red Bull Jukebox - Photo Credits
- [x] Add photo credits to cover image (Brothers Osborne performance)
- [x] Add photo credits to all event photos ("Photo courtesy of Red Bull")
- [x] Verify credits display correctly on project page

## Red Bull Jukebox - Cover Image Loading Issue
- [x] Investigate why cover image isn't displaying on landing page
- [x] Check if Red Bull Jukebox is being filtered out from homepage (not marked as featured)
- [x] Mark Red Bull Jukebox as featured to display on homepage
- [x] Fix hardcoded "SCENIC DESIGN" badge on homepage to show correct discipline
- [x] Set publishedAt date to make Red Bull appear in top 4 featured projects
- [x] Verify cover image displays correctly on homepage

## Red Bull Jukebox - API Query Error Fix
- [x] Investigate API query error - sandbox was reset, changes were lost
- [x] Reapply all fixes: cover image URL, excerpt, date (2024-09-24), client (Lumenati × Red Bull)
- [x] Fix data pattern validation error

## Red Bull Jukebox - Experiential Landing Page Card Image
- [x] Identify experiential landing page route (/projects/experiential)
- [x] Check why card image is blank on experiential landing page (coverImageUrl not working)
- [x] Use one of the event photo URLs as cover image for the card (crowd-wide.jpg)

## Experiential Landing Page Sorting
- [x] Fix Experiential landing page sorting to show projects in chronological order by date (newest first)

## Fix Scenic Design Template
- [x] Restore scenic design project detail template (design notes visible, excerpt hidden)
- [x] Ensure scenic and experiential templates remain separate

## Urgent Fixes
- [ ] Fix scenic design template: change 'Event Photos' to 'Production Photos'

## Experiential Project Pages (Each Unique Custom Layout)
- [x] Red Bull Jukebox - custom layout complete
- [ ] Rab Bothy Activation - create unique custom page
- [ ] First Bank Lollipop - create unique custom page
- [ ] Other experiential projects - create unique custom pages as needed
- [ ] Fix JavaScript error on published site (React/routing issue)
- [x] Add dropdown menu with icons to STUDIO nav item
- [x] Create Coming Soon page for Vault (/vault)
- [x] Extract collaborator data from existing projects (directors, designers by type, theatre companies)
- [x] Research and find portfolio/Instagram links for all collaborators
- [x] Create database schema for collaborators table
- [ ] Build /about/collaborators page with filtering (Directors, Scenic, Costume, Lighting, Sound, Projection, Theatre Companies, Companies)
- [ ] Add cross-linking from project detail pages to collaborator profiles
- [ ] Add "Projects Worked On" section to each collaborator profile
- [x] Extract all collaborators from projects and CV, deduplicate, and populate database

- [ ] Extract all missing collaborators from scenic design project pages
- [x] Research quality profiles for all directors (bios, portfolios, Instagram)
- [x] Update collaborators database with complete profiles
- [x] Research and add website URLs for all theatre companies
- [x] Fix Collaborators page to show 'Website' for theatre companies instead of 'Portfolio'
- [x] Extract all designers from scenic design project pages and populate collaborators database
- [x] Research scenic design competitor websites and create comparison audit report

## Homepage Improvements (Based on Competitive Analysis)
- [x] Implement full-screen hero carousel with rotating production photography
- [x] Move ARTICLES into STUDIO dropdown menu to simplify main navigation
- [ ] Add awards/recognition section between Featured Projects and Latest Thinking
- [ ] Enhance visual hierarchy throughout homepage
- [ ] Optimize hero images for performance (WebP, lazy loading)

- [x] Implement full-screen hero carousel with rotating production photography
- [x] Select 4-5 best production photos for hero carousel
- [x] Add smooth transitions and auto-rotation to carousel

- [ ] Analyze scenic design portfolio page hero overlay and sections
- [ ] Compare to competitor best practices from research
- [ ] Implement improvements based on analysis

- [x] Reduce hero text size to give more space to production photography
- [ ] Review and improve homepage sections layout (Featured Projects, Latest Thinking)
- [ ] Select better featured projects for homepage showcase

- [x] Replace full-screen project showcases with 2-column grid layout (match competitors)
- [x] Replace Latest Thinking section with Latest News section
- [ ] Select 6-8 best scenic design projects for homepage grid
- [x] Remove Articles from homepage (now in Studio dropdown)
- [x] Add theatre company metadata to featured portfolio grid on homepage
- [x] Fix theatre company metadata display on homepage portfolio cards
- [x] Add brand-colored hover effects with variety (orange, cyan, pink, amber)
- [x] Fix news cards spacing/gap issue
- [x] Update Scenic Portfolio page to use 2-column grid layout matching homepage
- [x] Fix image cropping on portfolio cards (prevent cutting off heads)
- [x] Update Tomas and the Library Lady subcategory to Theatre for Young Audiences
- [x] Fix duplicate Theatre for Young Audiences subcategory filters
- [x] Link Creative Team names to collaborator profiles
- [x] Verify and enhance lightbox functionality for full-screen image viewing
- [x] Expand project detail hero images to full viewport width
- [x] Add hover effects to portfolio cards (1.05x scale + metadata reveal)
- [x] Update hover effects to hide metadata (Alexander Dodge style)
- [x] Remove colored borders from portfolio card hover effects
- [x] Fix missing image on Glass Menagerie project page
- [x] Update project detail pages to use 2-column grid for images
- [x] Update homepage to show complete scenic design portfolio (not just featured)
- [x] Revert homepage to show only 8 featured projects (not full portfolio)
- [x] Show all scenic design projects in More Scenic Design section (not just related)
- [x] Remove left/right navigation arrows from Scenic Portfolio page
- [x] Update collaboration highlight colors to match page accent color
- [x] Remove duplicate date from project detail hero section
- [x] Show subcategory instead of discipline in project detail badge
- [x] Update portfolio card images to use object-top for portrait orientation
- [x] Change production photo grid aspect ratio from 4:3 to 3:2 landscape
- [x] Redesign project detail hero section - remove back button, improve layout and typography
- [x] Fix object-top positioning on production photo grids (portrait images showing chest only)
- [x] Add object-top positioning to project detail hero cover images
- [x] Implement per-page theme switching - dark mode for portfolio, light mode for news/articles
- [x] Implement smart image positioning with automatic orientation detection
- [x] Add progressive image loading with blur-up placeholders
- [x] Implement lazy loading for below-the-fold images
- [x] Optimize page loading with code splitting and resource preloading
- [x] Redesign Studio landing page as narrative-driven learning and tools hub with Articles featured at top
- [x] Add category metadata and color-coded hover effects to article cards on Studio page
- [x] Fix article card hover - remove border, use category accent color for title
- [x] Apply category badge and color hover system to main Articles listing page
- [x] Fix spacing between navigation bar and page content (add proper top padding/margin)
- [x] Unify all article cards to use same horizontal layout with consistent styling
- [x] Change Scenic Design Process category accent color to yellow and make badge borders thinner
- [x] Update Continue Reading section to show category-based related articles with matching card design
- [x] Create gallery-like Rendering portfolio landing page with editorial design, art-led principles, and process layers
