/**
 * Migrate article images from Manus S3 to Supabase Storage
 * 
 * This script:
 * 1. Fetches all articles from the database
 * 2. Extracts image URLs from article content and cover images
 * 3. Downloads images from Manus S3/CloudFront
 * 4. Uploads them to Supabase Storage
 * 5. Updates article records with new Supabase URLs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const BUCKET_NAME = 'article-images';
const MANUS_DOMAINS = [
  'manus-user-assets.s3.us-west-1.amazonaws.com',
  'manus-user-assets.s3.amazonaws.com',
  'files.manuscdn.com',
  'd3njjcbhbojbot.cloudfront.net'
];

interface Article {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  content: any;
}

interface ImageMapping {
  originalUrl: string;
  newUrl: string;
  filename: string;
}

/**
 * Check if URL is from Manus S3/CloudFront
 */
function isManusImage(url: string): boolean {
  if (!url) return false;
  return MANUS_DOMAINS.some(domain => url.includes(domain));
}

/**
 * Extract all image URLs from article content
 */
function extractImageUrls(content: any): string[] {
  const urls: string[] = [];
  
  if (!content || !Array.isArray(content)) return urls;
  
  for (const section of content) {
    // Direct image sections
    if (section.type === 'image' && section.url) {
      urls.push(section.url);
    }
    
    // Gallery sections
    if (section.type === 'gallery' && Array.isArray(section.images)) {
      for (const img of section.images) {
        if (img.url) urls.push(img.url);
      }
    }
    
    // HTML content with embedded images
    if ((section.type === 'html' || section.type === 'text') && section.content) {
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      let match;
      while ((match = imgRegex.exec(section.content)) !== null) {
        urls.push(match[1]);
      }
    }
  }
  
  return urls;
}

/**
 * Generate a safe filename from URL
 */
function generateFilename(url: string, articleSlug: string): string {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const ext = path.extname(pathname) || '.jpg';
  const basename = path.basename(pathname, ext);
  
  // Create a safe filename: article-slug/original-filename.ext
  return `${articleSlug}/${basename}${ext}`;
}

/**
 * Download image from URL
 */
async function downloadImage(url: string): Promise<Buffer> {
  console.log(`  Downloading: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'image/*',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }
  
  return Buffer.from(await response.arrayBuffer());
}

/**
 * Upload image to Supabase Storage
 */
async function uploadToSupabase(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, buffer, {
      contentType,
      upsert: true,
    });
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename);
  
  return urlData.publicUrl;
}

/**
 * Migrate a single image
 */
async function migrateImage(
  url: string,
  articleSlug: string
): Promise<ImageMapping | null> {
  try {
    const filename = generateFilename(url, articleSlug);
    const buffer = await downloadImage(url);
    
    // Determine content type from extension
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.webp' ? 'image/webp' :
                       ext === '.png' ? 'image/png' :
                       ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                       'image/jpeg';
    
    const newUrl = await uploadToSupabase(buffer, filename, contentType);
    
    console.log(`  ✓ Migrated: ${path.basename(filename)}`);
    
    return {
      originalUrl: url,
      newUrl,
      filename,
    };
  } catch (error) {
    console.error(`  ✗ Failed to migrate ${url}:`, error);
    return null;
  }
}

/**
 * Update article content with new image URLs
 */
function updateContent(content: any, mappings: ImageMapping[]): any {
  if (!content || !Array.isArray(content)) return content;
  
  const urlMap = new Map(mappings.map(m => [m.originalUrl, m.newUrl]));
  
  return content.map(section => {
    // Update direct image sections
    if (section.type === 'image' && section.url && urlMap.has(section.url)) {
      return { ...section, url: urlMap.get(section.url) };
    }
    
    // Update gallery sections
    if (section.type === 'gallery' && Array.isArray(section.images)) {
      return {
        ...section,
        images: section.images.map((img: any) => ({
          ...img,
          url: urlMap.has(img.url) ? urlMap.get(img.url) : img.url,
        })),
      };
    }
    
    // Update HTML content
    if ((section.type === 'html' || section.type === 'text') && section.content) {
      let updatedContent = section.content;
      for (const [oldUrl, newUrl] of urlMap.entries()) {
        updatedContent = updatedContent.replace(
          new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          newUrl
        );
      }
      return { ...section, content: updatedContent };
    }
    
    return section;
  });
}

/**
 * Migrate all images for a single article
 */
async function migrateArticle(article: Article, dryRun: boolean = false): Promise<void> {
  console.log(`\n📄 Processing: ${article.title}`);
  
  const imagesToMigrate: string[] = [];
  
  // Check cover image
  if (article.cover_image && isManusImage(article.cover_image)) {
    imagesToMigrate.push(article.cover_image);
  }
  
  // Extract content images
  const contentImages = extractImageUrls(article.content);
  for (const url of contentImages) {
    if (isManusImage(url)) {
      imagesToMigrate.push(url);
    }
  }
  
  // Remove duplicates
  const uniqueImages = [...new Set(imagesToMigrate)];
  
  if (uniqueImages.length === 0) {
    console.log('  No Manus images to migrate');
    return;
  }
  
  console.log(`  Found ${uniqueImages.length} image(s) to migrate`);
  
  if (dryRun) {
    console.log('  [DRY RUN] Would migrate:', uniqueImages);
    return;
  }
  
  // Migrate all images
  const mappings: ImageMapping[] = [];
  for (const url of uniqueImages) {
    const mapping = await migrateImage(url, article.slug);
    if (mapping) {
      mappings.push(mapping);
    }
  }
  
  if (mappings.length === 0) {
    console.log('  ✗ No images successfully migrated');
    return;
  }
  
  // Update article in database
  const updates: any = {};
  
  // Update cover image if migrated
  const coverMapping = mappings.find(m => m.originalUrl === article.cover_image);
  if (coverMapping) {
    updates.cover_image = coverMapping.newUrl;
  }
  
  // Update content
  if (contentImages.some(url => isManusImage(url))) {
    updates.content = updateContent(article.content, mappings);
  }
  
  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', article.id);
    
    if (error) {
      console.error('  ✗ Failed to update article:', error);
    } else {
      console.log(`  ✓ Updated article with ${mappings.length} new URL(s)`);
    }
  }
}

/**
 * Main migration function
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const singleSlug = args.find(arg => !arg.startsWith('--'));
  
  console.log('🚀 Article Image Migration to Supabase Storage\n');
  
  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n');
  }
  
  // Ensure bucket exists
  if (!dryRun) {
    console.log('Checking storage bucket...');
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${BUCKET_NAME}`);
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
      });
      if (error) {
        console.error('Failed to create bucket:', error);
        process.exit(1);
      }
    }
    console.log('✓ Bucket ready\n');
  }
  
  // Fetch articles
  let query = supabase
    .from('articles')
    .select('id, title, slug, cover_image, content')
    .eq('status', 'published');
  
  if (singleSlug) {
    query = query.eq('slug', singleSlug);
  }
  
  const { data: articles, error } = await query;
  
  if (error) {
    console.error('Failed to fetch articles:', error);
    process.exit(1);
  }
  
  if (!articles || articles.length === 0) {
    console.log('No articles found');
    process.exit(0);
  }
  
  console.log(`Found ${articles.length} article(s) to process\n`);
  
  // Process each article
  for (const article of articles) {
    await migrateArticle(article, dryRun);
  }
  
  console.log('\n✅ Migration complete!');
}

main().catch(console.error);
