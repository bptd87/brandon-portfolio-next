# Supabase to Manus Database Migration Guide

This document provides a comprehensive checklist and tools for migrating your portfolio data from Supabase to the new Manus-hosted database.

## Prerequisites

- Supabase project URL and API key (anon/service key)
- Access to Supabase dashboard
- Node.js installed locally (for running migration scripts)

## Migration Checklist

### Phase 1: Data Export from Supabase

- [ ] **Access Supabase Dashboard**
  - Log in to your Supabase project
  - Navigate to Table Editor to review schema

- [ ] **Export Projects Data**
  - Table: `projects`
  - Fields to export: id, title, slug, description, design_notes, category, subcategory, discipline, client, location, year, cover_image_url, status, featured, metadata, created_at, updated_at
  - Export format: JSON or CSV

- [ ] **Export Project Images**
  - Table: `project_images` or images stored in Supabase Storage
  - Download all image files
  - Note: Image URLs will need to be updated to S3 URLs after upload

- [ ] **Export Team/Credits Data**
  - Check if team data is stored in:
    - Separate `team_members` table
    - JSON field in `projects` table
    - Related tables with foreign keys

- [ ] **Export News Items**
  - Table: `news` or similar
  - Include all fields and relationships

- [ ] **Export Articles**
  - Table: `articles` or `blog_posts`
  - Include content, metadata, and cover images

- [ ] **Export Categories and Tags**
  - Tables: `categories`, `tags`, junction tables
  - Note relationships between content and tags

### Phase 2: Schema Mapping

- [ ] **Map Supabase Schema to New Schema**
  - Document field name differences
  - Identify data type conversions needed
  - Note any new fields that need default values

#### Common Field Mappings

| Supabase Field | New Schema Field | Notes |
|----------------|------------------|-------|
| `design_notes` | `designNotes` | camelCase conversion |
| `cover_image_url` | `coverImageUrl` | camelCase conversion |
| `created_at` | `createdAt` | camelCase conversion |
| `updated_at` | `updatedAt` | camelCase conversion |
| Category field | `discipline` | Map to: scenic_design, experiential_design, rendering, scenic_models |
| Subcategory | `subcategory` | Direct mapping |

- [ ] **Handle New Fields**
  - `discipline`: Assign based on project type
  - `subcategory`: Map from existing categories or set defaults
  - Team structure: Convert to new flexible team management system

### Phase 3: Image Migration

- [ ] **Download Images from Supabase Storage**
  - Use Supabase Storage API or dashboard
  - Organize by project/content type
  - Maintain original filenames for reference

- [ ] **Upload Images to S3**
  - Use the `uploadImage` tRPC mutation in admin panel
  - Or use the S3 upload script (see below)
  - Record new S3 URLs for each image

- [ ] **Update Image References**
  - Replace Supabase Storage URLs with S3 URLs
  - Update `coverImageUrl` fields
  - Update project image galleries

### Phase 4: Data Import

- [ ] **Import Categories and Tags First**
  - Create categories via admin panel or API
  - Create tags via admin panel or API
  - Note new IDs for relationship mapping

- [ ] **Import Projects**
  - Use import script (see below)
  - Verify discipline and subcategory assignments
  - Check that all required fields are populated

- [ ] **Import Project Images**
  - Link images to projects using new IDs
  - Set correct sort order
  - Add captions and alt text

- [ ] **Import Team Members**
  - Create team member records
  - Link to projects via junction table
  - Assign roles (Director, Scenic Designer, etc.)

- [ ] **Import News Items**
  - Convert content blocks if needed
  - Link to categories and tags
  - Set publication dates

- [ ] **Import Articles**
  - Convert content format if needed
  - Link to categories and tags
  - Set author and publication dates

### Phase 5: Verification

- [ ] **Verify Data Integrity**
  - Check project counts match
  - Verify all images are accessible
  - Test project detail pages
  - Check filtering by discipline and subcategory

- [ ] **Test Functionality**
  - Browse all portfolio disciplines
  - Filter by subcategories
  - View project detail pages
  - Check team credits display
  - Test news and article pages

- [ ] **SEO Verification**
  - Verify slugs are preserved
  - Check meta descriptions
  - Test URLs match original structure

### Phase 6: Cleanup

- [ ] **Update Any Hardcoded URLs**
  - Search codebase for old Supabase URLs
  - Update environment variables
  - Clear any cached data

- [ ] **Archive Supabase Data**
  - Export final backup from Supabase
  - Store securely for reference
  - Document what was migrated

## Migration Scripts

### Export Script (Run Locally)

Create a file `scripts/export-from-supabase.mjs`:

\`\`\`javascript
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportData() {
  console.log('Exporting data from Supabase...');

  // Export projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*');
  
  if (projectsError) {
    console.error('Error exporting projects:', projectsError);
  } else {
    await fs.writeFile('data/projects.json', JSON.stringify(projects, null, 2));
    console.log(`Exported ${projects.length} projects`);
  }

  // Export project images
  const { data: images, error: imagesError } = await supabase
    .from('project_images')
    .select('*');
  
  if (imagesError) {
    console.error('Error exporting images:', imagesError);
  } else {
    await fs.writeFile('data/project_images.json', JSON.stringify(images, null, 2));
    console.log(`Exported ${images.length} images`);
  }

  // Export news
  const { data: news, error: newsError } = await supabase
    .from('news')
    .select('*');
  
  if (newsError) {
    console.error('Error exporting news:', newsError);
  } else {
    await fs.writeFile('data/news.json', JSON.stringify(news, null, 2));
    console.log(`Exported ${news.length} news items`);
  }

  // Export articles
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('*');
  
  if (articlesError) {
    console.error('Error exporting articles:', articlesError);
  } else {
    await fs.writeFile('data/articles.json', JSON.stringify(articles, null, 2));
    console.log(`Exported ${articles.length} articles`);
  }

  console.log('Export complete! Check the data/ directory.');
}

exportData().catch(console.error);
\`\`\`

### Import Script

Create a file `scripts/import-to-manus.mjs`:

\`\`\`javascript
import fs from 'fs/promises';

async function importData() {
  console.log('Importing data to Manus database...');

  // Read exported data
  const projects = JSON.parse(await fs.readFile('data/projects.json', 'utf-8'));
  const images = JSON.parse(await fs.readFile('data/project_images.json', 'utf-8'));
  const news = JSON.parse(await fs.readFile('data/news.json', 'utf-8'));
  const articles = JSON.parse(await fs.readFile('data/articles.json', 'utf-8'));

  // Map and transform data
  const mappedProjects = projects.map(p => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    description: p.description,
    designNotes: p.design_notes,
    discipline: mapDiscipline(p.category), // Custom mapping function
    subcategory: p.subcategory,
    client: p.client,
    location: p.location,
    year: p.year,
    coverImageUrl: p.cover_image_url, // Will need to update with S3 URLs
    status: p.status || 'published',
    featured: p.featured || false,
    metadata: p.metadata,
  }));

  // TODO: Use tRPC API or direct database insert to import data
  console.log(`Prepared ${mappedProjects.length} projects for import`);
  console.log('Next: Use admin panel or API to import data');
}

function mapDiscipline(category) {
  const mapping = {
    'scenic': 'scenic_design',
    'experiential': 'experiential_design',
    'rendering': 'rendering',
    'model': 'scenic_models',
  };
  return mapping[category?.toLowerCase()] || 'scenic_design';
}

importData().catch(console.error);
\`\`\`

### Image Upload Script

Create a file `scripts/upload-images-to-s3.mjs`:

\`\`\`javascript
import fs from 'fs/promises';
import path from 'path';

async function uploadImages() {
  const imageDir = './images-to-upload';
  const files = await fs.readdir(imageDir);

  console.log(`Found ${files.length} images to upload`);

  for (const file of files) {
    const filePath = path.join(imageDir, file);
    const fileBuffer = await fs.readFile(filePath);
    
    // Use the admin panel's upload functionality or tRPC API
    // This is a placeholder - actual implementation depends on your setup
    console.log(`Would upload: ${file}`);
  }

  console.log('Upload complete!');
}

uploadImages().catch(console.error);
\`\`\`

## Running the Migration

1. **Install dependencies**:
   \`\`\`bash
   npm install @supabase/supabase-js
   \`\`\`

2. **Set environment variables**:
   \`\`\`bash
   export SUPABASE_URL="your-project-url"
   export SUPABASE_SERVICE_KEY="your-service-key"
   \`\`\`

3. **Create data directory**:
   \`\`\`bash
   mkdir -p data
   \`\`\`

4. **Run export script**:
   \`\`\`bash
   node scripts/export-from-supabase.mjs
   \`\`\`

5. **Review exported data** in `data/` directory

6. **Download images** from Supabase Storage

7. **Upload images** to S3 via admin panel

8. **Update image URLs** in exported JSON files

9. **Run import script** or manually import via admin panel

10. **Verify** all data is correctly migrated

## Troubleshooting

### Common Issues

**Issue**: Field name mismatches
- **Solution**: Update mapping in import script to match new schema

**Issue**: Image URLs not working
- **Solution**: Ensure images are uploaded to S3 and URLs are updated

**Issue**: Team/credits data structure different
- **Solution**: Convert to new flexible team management system

**Issue**: Categories don't match disciplines
- **Solution**: Create mapping function to convert old categories to new disciplines

## Support

If you encounter issues during migration:
1. Check the exported JSON files for data integrity
2. Verify schema mappings are correct
3. Test with a small subset of data first
4. Use the admin panel to manually verify imported data

## Post-Migration

After successful migration:
- [ ] Test all pages and functionality
- [ ] Update any documentation
- [ ] Archive Supabase project or downgrade plan
- [ ] Update DNS/domain settings if needed
- [ ] Monitor for any missing data or broken links
