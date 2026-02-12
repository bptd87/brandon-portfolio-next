import { createClient } from '@supabase/supabase-js';
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

let totalImages = 0;
let processedImages = 0;
let successCount = 0;
let errorCount = 0;

async function downloadAndConvertImage(url: string, outputPath: string): Promise<Buffer> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 30000
  });
  
  const buffer = Buffer.from(response.data);
  const originalSize = (buffer.length / 1024).toFixed(2);
  
  // Convert to WebP with optimization
  const webpBuffer = await sharp(buffer)
    .resize(2000, 2000, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: 85 })
    .toBuffer();
  
  const webpSize = (webpBuffer.length / 1024).toFixed(2);
  const savings = ((1 - webpBuffer.length / buffer.length) * 100).toFixed(0);
  console.log(`  ${originalSize}KB → ${webpSize}KB (${savings}% savings)`);
  
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
  const { error } = await supabase
    .from(table)
    .update({ [field]: newUrl })
    .eq('id', id);
  
  if (error) {
    throw new Error(`Database update error: ${error.message}`);
  }
}

async function migrateProjectImages() {
  console.log('\n🖼️  Migrating project images...');
  
  // Get all projects with cover images
  const { data: projects } = await supabase
    .from('projects')
    .select('id, cover_image')
    .not('cover_image', 'is', null);
  
  if (projects) {
    for (const project of projects) {
      processedImages++;
      console.log(`\n[${processedImages}/${totalImages}] project_cover ${project.id}`);
      
      try {
        const filename = `project-${project.id}-cover.webp`;
        const tempPath = join(TEMP_DIR, filename);
        
        const buffer = await downloadAndConvertImage(project.cover_image, tempPath);
        const newUrl = await uploadToSupabase(buffer, 'project-images', filename);
        await updateDatabaseUrl('projects', 'cover_image', project.id, newUrl);
        
        console.log(`  ✅ ${newUrl}`);
        successCount++;
      } catch (error: any) {
        console.error(`  ❌ ${error.message}`);
        errorCount++;
      }
    }
  }
  
  // Get all project gallery images
  const { data: galleryImages } = await supabase
    .from('project_images')
    .select('id, project_id, image_url')
    .not('image_url', 'is', null);
  
  if (galleryImages) {
    for (const image of galleryImages) {
      processedImages++;
      console.log(`\n[${processedImages}/${totalImages}] project_gallery ${image.project_id}/${image.id}`);
      
      try {
        const filename = `project-${image.project_id}-gallery-${image.id}.webp`;
        const tempPath = join(TEMP_DIR, filename);
        
        const buffer = await downloadAndConvertImage(image.image_url, tempPath);
        const newUrl = await uploadToSupabase(buffer, 'project-images', filename);
        await updateDatabaseUrl('project_images', 'image_url', image.id, newUrl);
        
        console.log(`  ✅ ${newUrl}`);
        successCount++;
      } catch (error: any) {
        console.error(`  ❌ ${error.message}`);
        errorCount++;
      }
    }
  }
}

async function migrateNewsImages() {
  console.log('\n📰 Migrating news images...');
  
  // Get all news with cover images
  const { data: news } = await supabase
    .from('news')
    .select('id, cover_image')
    .not('cover_image', 'is', null);
  
  if (news) {
    for (const item of news) {
      processedImages++;
      console.log(`\n[${processedImages}/${totalImages}] news_cover ${item.id}`);
      
      try {
        const filename = `news-${item.id}-cover.webp`;
        const tempPath = join(TEMP_DIR, filename);
        
        const buffer = await downloadAndConvertImage(item.cover_image, tempPath);
        const newUrl = await uploadToSupabase(buffer, 'news-images', filename);
        await updateDatabaseUrl('news', 'cover_image', item.id, newUrl);
        
        console.log(`  ✅ ${newUrl}`);
        successCount++;
      } catch (error: any) {
        console.error(`  ❌ ${error.message}`);
        errorCount++;
      }
    }
  }
  
  // Get all news with block images
  const { data: newsWithBlocks } = await supabase
    .from('news')
    .select('id, blocks')
    .not('blocks', 'is', null);
  
  if (newsWithBlocks) {
    for (const item of newsWithBlocks) {
      try {
        const blocks = JSON.parse(item.blocks);
        let updated = false;
        
        for (const block of blocks) {
          if ((block.type === 'image' || block.type === 'gallery') && block.url) {
            processedImages++;
            console.log(`\n[${processedImages}/${totalImages}] news_block ${item.id}`);
            
            try {
              const filename = `news-${item.id}-block-${Date.now()}.webp`;
              const tempPath = join(TEMP_DIR, filename);
              
              const buffer = await downloadAndConvertImage(block.url, tempPath);
              const newUrl = await uploadToSupabase(buffer, 'news-images', filename);
              
              block.url = newUrl;
              updated = true;
              
              console.log(`  ✅ ${newUrl}`);
              successCount++;
            } catch (error: any) {
              console.error(`  ❌ ${error.message}`);
              errorCount++;
            }
          }
          
          if (block.type === 'gallery' && block.images) {
            for (let i = 0; i < block.images.length; i++) {
              processedImages++;
              console.log(`\n[${processedImages}/${totalImages}] news_gallery ${item.id}/${i}`);
              
              try {
                const filename = `news-${item.id}-gallery-${i}-${Date.now()}.webp`;
                const tempPath = join(TEMP_DIR, filename);
                
                const buffer = await downloadAndConvertImage(block.images[i], tempPath);
                const newUrl = await uploadToSupabase(buffer, 'news-images', filename);
                
                block.images[i] = newUrl;
                updated = true;
                
                console.log(`  ✅ ${newUrl}`);
                successCount++;
              } catch (error: any) {
                console.error(`  ❌ ${error.message}`);
                errorCount++;
              }
            }
          }
        }
        
        if (updated) {
          await supabase
            .from('news')
            .update({ blocks: JSON.stringify(blocks) })
            .eq('id', item.id);
        }
      } catch (error: any) {
        console.error(`  ❌ Error processing news ${item.id} blocks: ${error.message}`);
      }
    }
  }
}

async function migrateArticleImages() {
  console.log('\n📝 Migrating article images...');
  
  // Get all articles with cover images
  const { data: articles } = await supabase
    .from('articles')
    .select('id, cover_image')
    .not('cover_image', 'is', null);
  
  if (articles) {
    for (const article of articles) {
      processedImages++;
      console.log(`\n[${processedImages}/${totalImages}] article_cover ${article.id}`);
      
      try {
        const filename = `article-${article.id}-cover.webp`;
        const tempPath = join(TEMP_DIR, filename);
        
        const buffer = await downloadAndConvertImage(article.cover_image, tempPath);
        const newUrl = await uploadToSupabase(buffer, 'article-images', filename);
        await updateDatabaseUrl('articles', 'cover_image', article.id, newUrl);
        
        console.log(`  ✅ ${newUrl}`);
        successCount++;
      } catch (error: any) {
        console.error(`  ❌ ${error.message}`);
        errorCount++;
      }
    }
  }
  
  // Get all articles with embedded images
  const { data: articlesWithContent } = await supabase
    .from('articles')
    .select('id, content')
    .like('content', '%https://res.cloudinary.com%');
  
  if (articlesWithContent) {
    for (const article of articlesWithContent) {
      try {
        let content = article.content;
        const imageUrls = content.match(/https:\/\/res\.cloudinary\.com\/[^\s"')]+/g) || [];
        
        for (const url of imageUrls) {
          processedImages++;
          console.log(`\n[${processedImages}/${totalImages}] article_embedded ${article.id}`);
          
          try {
            const filename = `article-${article.id}-embedded-${Date.now()}.webp`;
            const tempPath = join(TEMP_DIR, filename);
            
            const buffer = await downloadAndConvertImage(url, tempPath);
            const newUrl = await uploadToSupabase(buffer, 'article-images', filename);
            
            content = content.replace(url, newUrl);
            
            console.log(`  ✅ ${newUrl}`);
            successCount++;
          } catch (error: any) {
            console.error(`  ❌ ${error.message}`);
            errorCount++;
          }
        }
        
        if (imageUrls.length > 0) {
          await supabase
            .from('articles')
            .update({ content })
            .eq('id', article.id);
        }
      } catch (error: any) {
        console.error(`  ❌ Error processing article ${article.id}: ${error.message}`);
      }
    }
  }
}

async function countTotalImages() {
  console.log('\n📊 Counting images to migrate...');
  
  const { count: projectCovers } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .not('cover_image', 'is', null);
  
  const { count: galleryImages } = await supabase
    .from('project_images')
    .select('*', { count: 'exact', head: true })
    .not('image_url', 'is', null);
  
  const { count: newsCovers } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true })
    .not('cover_image', 'is', null);
  
  const { data: newsWithBlocks } = await supabase
    .from('news')
    .select('blocks')
    .not('blocks', 'is', null);
  
  let newsBlockImages = 0;
  if (newsWithBlocks) {
    for (const item of newsWithBlocks) {
      try {
        const blocks = JSON.parse(item.blocks);
        for (const block of blocks) {
          if (block.type === 'image' && block.url) newsBlockImages++;
          if (block.type === 'gallery' && block.images) newsBlockImages += block.images.length;
        }
      } catch (e) {}
    }
  }
  
  const { count: articleCovers } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .not('cover_image', 'is', null);
  
  const { data: articlesWithContent } = await supabase
    .from('articles')
    .select('content')
    .like('content', '%https://res.cloudinary.com%');
  
  let articleEmbeddedImages = 0;
  if (articlesWithContent) {
    for (const article of articlesWithContent) {
      const matches = article.content.match(/https:\/\/res\.cloudinary\.com\/[^\s"')]+/g) || [];
      articleEmbeddedImages += matches.length;
    }
  }
  
  totalImages = 
    (projectCovers || 0) +
    (galleryImages || 0) +
    (newsCovers || 0) +
    newsBlockImages +
    (articleCovers || 0) +
    articleEmbeddedImages;
  
  console.log(`\n📊 Total images to migrate: ${totalImages}`);
  console.log(`  - Project covers: ${projectCovers || 0}`);
  console.log(`  - Project gallery: ${galleryImages || 0}`);
  console.log(`  - News covers: ${newsCovers || 0}`);
  console.log(`  - News blocks: ${newsBlockImages}`);
  console.log(`  - Article covers: ${articleCovers || 0}`);
  console.log(`  - Article embedded: ${articleEmbeddedImages}`);
}

async function main() {
  console.log('🚀 Starting image migration to Supabase Storage...\n');
  console.log('Converting all images to WebP format (85% quality, max 2000px)\n');
  
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
