import { storagePut } from './server/storage.ts';
import { getDb } from './server/db.ts';
import { projects, articles } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const LIVE_SITE = 'https://www.brandonptdavis.com';

async function fetchImageFromLive(cloudFrontUrl) {
  // Try to fetch from live site's image proxy first
  const proxyUrl = `${LIVE_SITE}/api/img?url=${encodeURIComponent(cloudFrontUrl)}&w=2000`;
  
  try {
    const response = await fetch(proxyUrl);
    if (response.ok) {
      return await response.arrayBuffer();
    }
  } catch (e) {
    console.log(`  Proxy failed, trying direct: ${e.message}`);
  }
  
  // Fallback: try direct CloudFront URL
  const response = await fetch(cloudFrontUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }
  return await response.arrayBuffer();
}

async function migrateImages() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  console.log('Starting image migration...\n');
  
  // Migrate project cover images
  const projectsList = await db.select().from(projects);
  console.log(`Found ${projectsList.length} projects`);
  
  let migrated = 0;
  let failed = 0;
  
  for (const project of projectsList) {
    if (!project.coverImageUrl) continue;
    
    try {
      console.log(`[${migrated + failed + 1}/${projectsList.length}] ${project.title}`);
      console.log(`  Old URL: ${project.coverImageUrl.substring(0, 60)}...`);
      
      const imageData = await fetchImageFromLive(project.coverImageUrl);
      const buffer = Buffer.from(imageData);
      
      // Determine content type from URL
      const isWebP = project.coverImageUrl.includes('.webp');
      const contentType = isWebP ? 'image/webp' : 'image/jpeg';
      
      // Upload to S3
      const fileName = project.coverImageUrl.split('/').pop() || `project-${project.id}.webp`;
      const s3Key = `projects/${project.id}/${fileName}`;
      const { url: newUrl } = await storagePut(s3Key, buffer, contentType);
      
      console.log(`  New URL: ${newUrl.substring(0, 60)}...`);
      
      // Update database
      await db.update(projects)
        .set({ coverImageUrl: newUrl, coverImageKey: s3Key })
        .where(eq(projects.id, project.id));
      
      migrated++;
      console.log(`  ✓ Success\n`);
      
    } catch (error) {
      failed++;
      console.log(`  ✗ Failed: ${error.message}\n`);
    }
  }
  
  // Migrate article cover images
  const articlesList = await db.select().from(articles);
  const articlesWithImages = articlesList.filter(a => a.coverImageUrl);
  console.log(`\nFound ${articlesWithImages.length} articles with images`);
  
  for (const article of articlesWithImages) {
    try {
      console.log(`[${migrated + failed + 1}] ${article.title}`);
      console.log(`  Old URL: ${article.coverImageUrl.substring(0, 60)}...`);
      
      const imageData = await fetchImageFromLive(article.coverImageUrl);
      const buffer = Buffer.from(imageData);
      
      const isWebP = article.coverImageUrl.includes('.webp');
      const contentType = isWebP ? 'image/webp' : 'image/jpeg';
      
      const fileName = article.coverImageUrl.split('/').pop() || `article-${article.id}.webp`;
      const s3Key = `articles/${article.id}/${fileName}`;
      const { url: newUrl } = await storagePut(s3Key, buffer, contentType);
      
      console.log(`  New URL: ${newUrl.substring(0, 60)}...`);
      
      await db.update(articles)
        .set({ coverImageUrl: newUrl, coverImageKey: s3Key })
        .where(eq(articles.id, article.id));
      
      migrated++;
      console.log(`  ✓ Success\n`);
      
    } catch (error) {
      failed++;
      console.log(`  ✗ Failed: ${error.message}\n`);
    }
  }
  
  console.log(`\n=== Migration Complete ===`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${migrated + failed}`);
}

migrateImages().catch(console.error);
