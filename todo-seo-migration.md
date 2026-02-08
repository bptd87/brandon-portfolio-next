# SEO Migration from Original Portfolio - Accurate Tasks

## Critical SEO Infrastructure (High Priority)

- [ ] Create sitemap generation route (`/sitemap.xml`)
- [ ] Create image sitemap route (`/image-sitemap.xml`)
- [ ] Create video sitemap route (`/video-sitemap.xml`)
- [ ] Add robots.txt with sitemap references
- [ ] Extract alt text from original Supabase data
- [ ] Populate projectImages altText field with original data
- [ ] Update ProjectDetail component to render altText
- [ ] Add Open Graph tags to homepage
- [ ] Add Open Graph tags to project pages (dynamic)
- [ ] Add Open Graph tags to article pages (dynamic)
- [ ] Add Open Graph tags to news pages (dynamic)
- [ ] Add Twitter Card tags to all pages

## Page-Specific Metadata (Medium Priority)

- [ ] Create server/seo/metadata.ts with page configurations
- [ ] Add metadata for portfolio listing page
- [ ] Add dynamic metadata for individual project pages
- [ ] Add metadata for articles listing page
- [ ] Add dynamic metadata for individual article pages
- [ ] Add metadata for news listing page
- [ ] Add dynamic metadata for individual news pages
- [ ] Add metadata for About page
- [ ] Add metadata for Contact page
- [ ] Add metadata for Studio tools pages
- [ ] Add canonical URLs to all pages

## Structured Data & Enhancement (Low Priority)

- [ ] Add Person schema (JSON-LD) for Brandon PT Davis
- [ ] Add Organization schema (JSON-LD)
- [ ] Add Article schema for blog posts
- [ ] Add BreadcrumbList schema for navigation
- [ ] Add Google Site Verification meta tag
- [ ] Add noindex meta tag to admin pages

## Reference Files

Original portfolio SEO implementation:
- `/home/ubuntu/original-portfolio/src/utils/seo/metadata.ts` (813 lines)
- `/home/ubuntu/original-portfolio/app/sitemap.xml/route.ts`
- `/home/ubuntu/original-portfolio/app/image-sitemap.xml/route.ts`
- `/home/ubuntu/original-portfolio/app/video-sitemap.xml/route.ts`

Analysis documents:
- `/home/ubuntu/seo-migration-analysis.md`
- `/home/ubuntu/seo-migration-tasks.md`
