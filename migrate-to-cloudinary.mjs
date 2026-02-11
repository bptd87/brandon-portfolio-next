import { v2 as cloudinary } from 'cloudinary';
import { getDb } from './server/db.ts';
import { projects, news, articles } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const db = await getDb();

async function migrateImages() {
  console.log('Starting Cloudinary migration...\n');
  
  let totalMigrated = 0;
  let totalFailed = 0;

  // Migrate project images
  console.log('=== Migrating Project Images ===');
  const allProjects = await db.select().from(projects);
  
  for (const project of allProjects) {
    if (!project.coverImageUrl) {
      console.log(`⊘ ${project.title}: No cover image`);
      continue;
    }

    try {
      console.log(`Uploading: ${project.title}...`);
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(project.coverImageUrl, {
        folder: 'brandon-portfolio/projects',
        public_id: project.slug,
        overwrite: true,
        resource_type: 'image',
      });

      // Update database with new URL
      await db.update(projects)
        .set({ 
          coverImageUrl: result.secure_url,
          coverImageKey: result.public_id,
        })
        .where(eq(projects.id, project.id));

      console.log(`✓ ${project.title}: ${result.secure_url}`);
      totalMigrated++;
    } catch (error) {
      console.error(`✗ ${project.title}: ${error.message}`);
      totalFailed++;
    }
  }

  // Migrate news images
  console.log('\n=== Migrating News Images ===');
  const allNews = await db.select().from(news);
  
  for (const item of allNews) {
    if (!item.coverImageUrl) {
      console.log(`⊘ ${item.title}: No cover image`);
      continue;
    }

    try {
      console.log(`Uploading: ${item.title}...`);
      
      const result = await cloudinary.uploader.upload(item.coverImageUrl, {
        folder: 'brandon-portfolio/news',
        public_id: item.slug,
        overwrite: true,
        resource_type: 'image',
      });

      await db.update(news)
        .set({ 
          coverImageUrl: result.secure_url,
          coverImageKey: result.public_id,
        })
        .where(eq(news.id, item.id));

      console.log(`✓ ${item.title}: ${result.secure_url}`);
      totalMigrated++;
    } catch (error) {
      console.error(`✗ ${item.title}: ${error.message}`);
      totalFailed++;
    }
  }

  // Migrate article images
  console.log('\n=== Migrating Article Images ===');
  const allArticles = await db.select().from(articles);
  
  for (const article of allArticles) {
    if (!article.coverImageUrl) {
      console.log(`⊘ ${article.title}: No cover image`);
      continue;
    }

    try {
      console.log(`Uploading: ${article.title}...`);
      
      const result = await cloudinary.uploader.upload(article.coverImageUrl, {
        folder: 'brandon-portfolio/articles',
        public_id: article.slug,
        overwrite: true,
        resource_type: 'image',
      });

      await db.update(articles)
        .set({ 
          coverImageUrl: result.secure_url,
          coverImageKey: result.public_id,
        })
        .where(eq(articles.id, article.id));

      console.log(`✓ ${article.title}: ${result.secure_url}`);
      totalMigrated++;
    } catch (error) {
      console.error(`✗ ${article.title}: ${error.message}`);
      totalFailed++;
    }
  }

  console.log(`\n=== Migration Complete ===`);
  console.log(`✓ Successfully migrated: ${totalMigrated}`);
  console.log(`✗ Failed: ${totalFailed}`);
}

migrateImages().catch(console.error);
