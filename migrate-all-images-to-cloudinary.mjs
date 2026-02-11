import { v2 as cloudinary } from 'cloudinary';
import { getDb } from './server/db.ts';
import { projects, projectImages, news, articles } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const db = await getDb();

let totalMigrated = 0;
let totalFailed = 0;
let totalSkipped = 0;

console.log('=== COMPREHENSIVE CLOUDINARY MIGRATION ===\n');
console.log('This will migrate ALL images including:');
console.log('- Project gallery images (248)');
console.log('- News block images (6)');
console.log('- Re-attempt failed cover images (5)\n');

// Helper function to upload to Cloudinary
async function uploadToCloudinary(imageUrl, folder, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
    });
    return { success: true, url: result.secure_url, key: result.public_id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 1. Migrate project gallery images
console.log('=== MIGRATING PROJECT GALLERY IMAGES ===');
const allGalleryImages = await db.select().from(projectImages);
const imagesToMigrate = allGalleryImages.filter(img => img.imageUrl && !img.videoUrl);

console.log(`Found ${imagesToMigrate.length} gallery images to migrate\n`);

for (const img of imagesToMigrate) {
  // Skip if already migrated to Cloudinary
  if (img.imageUrl && img.imageUrl.includes('cloudinary.com')) {
    console.log(`⊙ Image ${img.id}: Already on Cloudinary`);
    totalSkipped++;
    continue;
  }

  try {
    // Get project info for better naming
    const project = await db.select().from(projects).where(eq(projects.id, img.projectId)).limit(1);
    const projectSlug = project[0]?.slug || `project-${img.projectId}`;
    
    console.log(`Uploading gallery image ${img.id} for project: ${projectSlug}...`);
    
    const publicId = `${projectSlug}-${img.id}`;
    const result = await uploadToCloudinary(
      img.imageUrl,
      'brandon-portfolio/gallery',
      publicId
    );

    if (result.success) {
      // Update database
      await db.update(projectImages)
        .set({ 
          imageUrl: result.url,
          imageKey: result.key,
        })
        .where(eq(projectImages.id, img.id));

      console.log(`✓ Image ${img.id}: ${result.url}`);
      totalMigrated++;
    } else {
      console.error(`✗ Image ${img.id}: ${result.error}`);
      totalFailed++;
    }
  } catch (error) {
    console.error(`✗ Image ${img.id}: ${error.message}`);
    totalFailed++;
  }
}

// 2. Migrate news block images
console.log('\n=== MIGRATING NEWS BLOCK IMAGES ===');
const allNews = await db.select().from(news);

for (const item of allNews) {
  if (!item.blocks || !Array.isArray(item.blocks)) continue;

  let updated = false;
  const updatedBlocks = [];

  for (const block of item.blocks) {
    if (block.type === 'gallery' && block.images && Array.isArray(block.images)) {
      const updatedImages = [];

      for (const image of block.images) {
        // Skip if already on Cloudinary
        if (image.url && image.url.includes('cloudinary.com')) {
          console.log(`⊙ News ${item.id} block image: Already on Cloudinary`);
          updatedImages.push(image);
          totalSkipped++;
          continue;
        }

        console.log(`Uploading news block image for: ${item.title}...`);
        
        const publicId = `${item.slug}-block-${updatedImages.length}`;
        const result = await uploadToCloudinary(
          image.url,
          'brandon-portfolio/news-blocks',
          publicId
        );

        if (result.success) {
          updatedImages.push({
            ...image,
            url: result.url,
          });
          console.log(`✓ News block image: ${result.url}`);
          totalMigrated++;
          updated = true;
        } else {
          console.error(`✗ News block image: ${result.error}`);
          updatedImages.push(image); // Keep original on failure
          totalFailed++;
        }
      }

      updatedBlocks.push({
        ...block,
        images: updatedImages,
      });
    } else {
      updatedBlocks.push(block);
    }
  }

  // Update news item if any block images were migrated
  if (updated) {
    await db.update(news)
      .set({ blocks: updatedBlocks })
      .where(eq(news.id, item.id));
  }
}

// 3. Re-attempt failed cover images (the 4 projects with 403 errors)
console.log('\n=== RE-ATTEMPTING FAILED COVER IMAGES ===');
const failedProjects = [
  'new-swan-venue-file',
  'southside-bethel-baptist-church',
  'lysistrata',
  'park-shop'
];

for (const slug of failedProjects) {
  const project = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  
  if (project.length === 0 || !project[0].coverImageUrl) {
    console.log(`⊘ ${slug}: Not found or no cover image`);
    continue;
  }

  const proj = project[0];
  
  // Skip if already migrated successfully
  if (proj.coverImageUrl.includes('cloudinary.com')) {
    console.log(`⊙ ${proj.title}: Already on Cloudinary`);
    totalSkipped++;
    continue;
  }

  console.log(`Re-attempting: ${proj.title}...`);
  
  const result = await uploadToCloudinary(
    proj.coverImageUrl,
    'brandon-portfolio/projects',
    proj.slug
  );

  if (result.success) {
    await db.update(projects)
      .set({ 
        coverImageUrl: result.url,
        coverImageKey: result.key,
      })
      .where(eq(projects.id, proj.id));

    console.log(`✓ ${proj.title}: ${result.url}`);
    totalMigrated++;
  } else {
    console.error(`✗ ${proj.title}: ${result.error}`);
    totalFailed++;
  }
}

console.log(`\n=== MIGRATION COMPLETE ===`);
console.log(`✓ Successfully migrated: ${totalMigrated}`);
console.log(`✗ Failed: ${totalFailed}`);
console.log(`⊙ Skipped (already migrated): ${totalSkipped}`);
console.log(`\nTotal processed: ${totalMigrated + totalFailed + totalSkipped}`);
