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
