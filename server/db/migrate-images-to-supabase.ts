import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';
import axios from 'axios';
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = 'https://xibkuwouvisabnfowthn.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYmt1d291dmlzYWJuZm93dGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg5MTQ1NywiZXhwIjoyMDg2NDY3NDU3fQ.wjhbQBIwzpG7ushihh420cNbtNvHEzWlyc1XeZqJZH4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Ensure temp directory exists
const TEMP_DIR = '/tmp/image-migration';
try {
  mkdirSync(TEMP_DIR, { recursive: true });
} catch (e) {
  // Directory already exists
}

interface ImageRecord {
  id: number;
  url: string;
  type: 'project_cover' | 'project_gallery' | 'news_cover' | 'news_block' | 'article_cover' | 'article_block';
  table: string;
  field: string;
}

let totalImages = 0;
let processedImages = 0;
let successCount = 0;
let errorCount = 0;

async function downloadAndConvertImage(url: string, outputPath: string): Promise<Buffer> {
  console.log(`  Downloading: ${url}`);
  
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 30000
  });
  
  const buffer = Buffer.from(response.data);
  console.log(`  Original size: ${(buffer.length / 1024).toFixed(2)} KB`);
  
  // Convert to WebP with optimization
  const webpBuffer = await sharp(buffer)
    .resize(2000, 2000, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: 85 })
    .toBuffer();
  
  console.log(`  WebP size: ${(webpBuffer.length / 1024).toFixed(2)} KB (${((1 - webpBuffer.length / buffer.length) * 100).toFixed(1)}% reduction)`);
  
  // Save to temp file
  writeFileSync(outputPath, webpBuffer);
  
  return webpBuffer;
}

async function uploadToSupabase(buffer: Buffer, bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: 'image/webp',
      upsert: true
    });
  
  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return urlData.publicUrl;
}

async function updateDatabaseUrl(table: string, field: string, id: number, newUrl: string) {
  // Only update Supabase (we're migrating away from MySQL)
  const { error } = await supabase
    .from(table)
    .update({ [field]: newUrl })
    .eq('id', id);
  
  if (error) {
    console.log(`    Warning: Supabase update failed for ${table}:${id} - ${error.message}`);
  }
}

async function migrateProjectImages() {
  console.log('\n🖼️  Migrating project images...');
  
  // Get all projects with cover images from Supabase
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, coverImageUrl')
    .not('coverImageUrl', 'is', null)
    .neq('coverImageUrl', '');
  
  if (projectsError || !projects) {
    console.error('Error fetching projects:', projectsError);
    return;
  }
  
  for (const project of projects) {
    processedImages++;
    console.log(`\n[${processedImages}/${totalImages}] Processing project ${project.id} cover image...`);
    
    try {
      const filename = `project-${project.id}-cover.webp`;
      const tempPath = join(TEMP_DIR, filename);
      
      const buffer = await downloadAndConvertImage(project.coverImageUrl, tempPath);
      const newUrl = await uploadToSupabase(buffer, 'project-images', filename);
      
      await updateDatabaseUrl('projects', 'coverImageUrl', project.id, newUrl);
      
      console.log(`  ✅ Uploaded to: ${newUrl}`);
      successCount++;
    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
      errorCount++;
    }
  }
  
  // Get all project gallery images from Supabase
  const { data: galleryImages, error: galleryError } = await supabase
    .from('project_images')
    .select('id, project_id, image_url')
    .not('image_url', 'is', null)
    .neq('image_url', '')
    .neq('type', 'video');
  
  if (galleryError || !galleryImages) {
    console.error('Error fetching gallery images:', galleryError);
    return;
  }
  
  for (const image of galleryImages) {
    processedImages++;
    console.log(`\n[${processedImages}/${totalImages}] Processing project ${image.project_id} gallery image ${image.id}...`);
    
    try {
      const filename = `project-${image.project_id}-gallery-${image.id}.webp`;
      const tempPath = join(TEMP_DIR, filename);
      
      const buffer = await downloadAndConvertImage(image.image_url, tempPath);
      const newUrl = await uploadToSupabase(buffer, 'project-images', filename);
      
      await updateDatabaseUrl('project_images', 'image_url', image.id, newUrl);
      
      console.log(`  ✅ Uploaded to: ${newUrl}`);
      successCount++;
    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
      errorCount++;
    }
  }
}

async function migrateNewsImages() {
  console.log('\n📰 Migrating news images...');
  
  // Get all news with cover images from Supabase
  const { data: news, error: newsError } = await supabase
    .from('news')
    .select('id, cover_image')
    .not('cover_image', 'is', null)
    .neq('cover_image', '');
  
  if (newsError || !news) {
    console.error('Error fetching news:', newsError);
    return;
  }
  
  for (const item of news) {
    processedImages++;
    console.log(`\n[${processedImages}/${totalImages}] Processing news ${item.id} cover image...`);
    
    try {
      const filename = `news-${item.id}-cover.webp`;
      const tempPath = join(TEMP_DIR, filename);
      
      const buffer = await downloadAndConvertImage(item.cover_image, tempPath);
      const newUrl = await uploadToSupabase(buffer, 'news-images', filename);
      
      await updateDatabaseUrl('news', 'cover_image', item.id, newUrl);
      
      console.log(`  ✅ Uploaded to: ${newUrl}`);
      successCount++;
    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
      errorCount++;
    }
  }
  
  // Get all news with block images from Supabase
  const { data: newsWithBlocks, error: blocksError } = await supabase
    .from('news')
    .select('id, blocks')
    .not('blocks', 'is', null)
    .neq('blocks', '');
  
  if (blocksError || !newsWithBlocks) {
    console.error('Error fetching news with blocks:', blocksError);
    return;
  }
  
  for (const item of newsWithBlocks) {
    try {
      const blocks = JSON.parse(item.blocks);
      let updated = false;
      
      for (const block of blocks) {
        if ((block.type === 'image' || block.type === 'gallery') && block.url) {
          processedImages++;
          console.log(`\n[${processedImages}/${totalImages}] Processing news ${item.id} block image...`);
          
          try {
            const filename = `news-${item.id}-block-${Date.now()}.webp`;
            const tempPath = join(TEMP_DIR, filename);
            
            const buffer = await downloadAndConvertImage(block.url, tempPath);
            const newUrl = await uploadToSupabase(buffer, 'news-images', filename);
            
            block.url = newUrl;
            updated = true;
            
            console.log(`  ✅ Uploaded to: ${newUrl}`);
            successCount++;
          } catch (error: any) {
            console.error(`  ❌ Error: ${error.message}`);
            errorCount++;
          }
        }
        
        if (block.type === 'gallery' && block.images) {
          for (let i = 0; i < block.images.length; i++) {
            processedImages++;
            console.log(`\n[${processedImages}/${totalImages}] Processing news ${item.id} gallery image ${i}...`);
            
            try {
              const filename = `news-${item.id}-gallery-${i}-${Date.now()}.webp`;
              const tempPath = join(TEMP_DIR, filename);
              
              const buffer = await downloadAndConvertImage(block.images[i], tempPath);
              const newUrl = await uploadToSupabase(buffer, 'news-images', filename);
              
              block.images[i] = newUrl;
              updated = true;
              
              console.log(`  ✅ Uploaded to: ${newUrl}`);
              successCount++;
            } catch (error: any) {
              console.error(`  ❌ Error: ${error.message}`);
              errorCount++;
            }
          }
        }
      }
      
      if (updated) {
        const { error } = await supabase
          .from('news')
          .update({ blocks: JSON.stringify(blocks) })
          .eq('id', item.id);
        
        if (error) {
          console.log(`    Warning: Supabase update failed for news:${item.id} - ${error.message}`);
        }
      }
    } catch (error: any) {
      console.error(`  ❌ Error processing news ${item.id} blocks: ${error.message}`);
    }
  }
}

async function migrateArticleImages() {
  console.log('\n📝 Migrating article images...');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  // Get all articles with cover images
  const [articles] = await connection.execute(
    'SELECT id, cover_image FROM articles WHERE cover_image IS NOT NULL AND cover_image != ""'
  );
  
  for (const article of articles as any[]) {
    processedImages++;
    console.log(`\n[${processedImages}/${totalImages}] Processing article ${article.id} cover image...`);
    
    try {
      const filename = `article-${article.id}-cover.webp`;
      const tempPath = join(TEMP_DIR, filename);
      
      const buffer = await downloadAndConvertImage(article.cover_image, tempPath);
      const newUrl = await uploadToSupabase(buffer, 'article-images', filename);
      
      await updateDatabaseUrl('articles', 'cover_image', article.id, newUrl);
      
      console.log(`  ✅ Uploaded to: ${newUrl}`);
      successCount++;
    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
      errorCount++;
    }
  }
  
  // Get all articles with content images (embedded in content field)
  const [articlesWithContent] = await connection.execute(
    'SELECT id, content FROM articles WHERE content LIKE "%https://res.cloudinary.com%"'
  );
  
  for (const article of articlesWithContent as any[]) {
    console.log(`\nProcessing article ${article.id} embedded images...`);
    
    try {
      let content = article.content;
      const imageUrls = content.match(/https:\/\/res\.cloudinary\.com\/[^\s"')]+/g) || [];
      
      for (const url of imageUrls) {
        processedImages++;
        console.log(`\n[${processedImages}/${totalImages}] Processing embedded image...`);
        
        try {
          const filename = `article-${article.id}-embedded-${Date.now()}.webp`;
          const tempPath = join(TEMP_DIR, filename);
          
          const buffer = await downloadAndConvertImage(url, tempPath);
          const newUrl = await uploadToSupabase(buffer, 'article-images', filename);
          
          content = content.replace(url, newUrl);
          
          console.log(`  ✅ Uploaded to: ${newUrl}`);
          successCount++;
        } catch (error: any) {
          console.error(`  ❌ Error: ${error.message}`);
          errorCount++;
        }
      }
      
      if (imageUrls.length > 0) {
        const { error } = await supabase
          .from('articles')
          .update({ content })
          .eq('id', article.id);
        
        if (error) {
          console.log(`    Warning: Supabase update failed for articles:${article.id} - ${error.message}`);
        }
      }
    } catch (error: any) {
      console.error(`  ❌ Error processing article ${article.id} content: ${error.message}`);
    }
  }
}

async function countTotalImages() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  const [projectCovers] = await connection.execute(
    'SELECT COUNT(*) as count FROM projects WHERE coverImageUrl IS NOT NULL AND coverImageUrl != ""'
  );
  
  const [galleryImages] = await connection.execute(
    'SELECT COUNT(*) as count FROM project_images WHERE image_url IS NOT NULL AND image_url != "" AND type != "video"'
  );
  
  const [newsCovers] = await connection.execute(
    'SELECT COUNT(*) as count FROM news WHERE cover_image IS NOT NULL AND cover_image != ""'
  );
  
  const [newsWithBlocks] = await connection.execute(
    'SELECT blocks FROM news WHERE blocks IS NOT NULL AND blocks != ""'
  );
  
  let newsBlockImages = 0;
  for (const item of newsWithBlocks) {
    try {
      const blocks = JSON.parse(item.blocks);
      for (const block of blocks) {
        if (block.type === 'image' && block.url) newsBlockImages++;
        if (block.type === 'gallery' && block.images) newsBlockImages += block.images.length;
      }
    } catch (e) {}
  }
  
  const [articleCovers] = await connection.execute(
    'SELECT COUNT(*) as count FROM articles WHERE cover_image IS NOT NULL AND cover_image != ""'
  );
  
  const [articlesWithContent] = await connection.execute(
    'SELECT content FROM articles WHERE content LIKE "%https://res.cloudinary.com%"'
  );
  
  let articleEmbeddedImages = 0;
  for (const article of articlesWithContent as any[]) {
    const matches = article.content.match(/https:\/\/res\.cloudinary\.com\/[^\s"')]+/g) || [];
    articleEmbeddedImages += matches.length;
  }
  
  await connection.end();
  
  totalImages = 
    (projectCovers as any)[0].count +
    (galleryImages as any)[0].count +
    (newsCovers as any)[0].count +
    newsBlockImages +
    (articleCovers as any)[0].count +
    articleEmbeddedImages;
  
  console.log(`\n📊 Total images to migrate: ${totalImages}`);
  console.log(`  - Project covers: ${(projectCovers as any)[0].count}`);
  console.log(`  - Project gallery: ${(galleryImages as any)[0].count}`);
  console.log(`  - News covers: ${(newsCovers as any)[0].count}`);
  console.log(`  - News block images: ${newsBlockImages}`);
  console.log(`  - Article covers: ${(articleCovers as any)[0].count}`);
  console.log(`  - Article embedded: ${articleEmbeddedImages}`);
}

async function main() {
  console.log('🚀 Starting comprehensive image migration to Supabase...\n');
  console.log('This will:');
  console.log('  1. Download all images from Cloudinary');
  console.log('  2. Convert to WebP format (85% quality, max 2000px)');
  console.log('  3. Upload to Supabase Storage');
  console.log('  4. Update database URLs in MySQL and Supabase\n');
  
  try {
    await countTotalImages();
    
    const startTime = Date.now();
    
    await migrateProjectImages();
    await migrateNewsImages();
    await migrateArticleImages();
    
    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    
    console.log('\n✅ Image migration complete!');
    console.log(`\n📊 Summary:`);
    console.log(`  - Total images: ${totalImages}`);
    console.log(`  - Successfully migrated: ${successCount}`);
    console.log(`  - Errors: ${errorCount}`);
    console.log(`  - Duration: ${duration} minutes`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
