import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';

const SUPABASE_URL = 'https://xibkuwouvisabnfowthn.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYmt1d291dmlzYWJuZm93dGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg5MTQ1NywiZXhwIjoyMDg2NDY3NDU3fQ.wjhbQBIwzpG7ushihh420cNbtNvHEzWlyc1XeZqJZH4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function syncProjectCoverImages() {
  console.log('\n📸 Syncing project cover images...');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  const [projects] = await connection.execute(
    'SELECT id, coverImageUrl FROM projects WHERE coverImageUrl IS NOT NULL AND coverImageUrl != ""'
  );
  
  let count = 0;
  for (const project of projects as any[]) {
    const { error } = await supabase
      .from('projects')
      .update({ cover_image: project.coverImageUrl })
      .eq('id', project.id);
    
    if (error) {
      console.error(`  ❌ Error updating project ${project.id}:`, error.message);
    } else {
      count++;
      console.log(`  ✅ Updated project ${project.id}`);
    }
  }
  
  console.log(`✅ Synced ${count} project cover images`);
  await connection.end();
}

async function syncProjectGalleryImages() {
  console.log('\n🖼️  Syncing project gallery images...');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  const [images] = await connection.execute(
    'SELECT id, imageUrl, videoUrl, caption, altText, imageType, sortOrder FROM projectImages WHERE imageUrl IS NOT NULL OR videoUrl IS NOT NULL'
  );
  
  let count = 0;
  for (const image of images as any[]) {
    const { error } = await supabase
      .from('project_images')
      .update({ 
        image_url: image.imageUrl,
        video_url: image.videoUrl,
        caption: image.caption,
        alt_text: image.altText
      })
      .eq('id', image.id);
    
    if (error) {
      console.error(`  ❌ Error updating image ${image.id}:`, error.message);
    } else {
      count++;
      if (count % 50 === 0) {
        console.log(`  ✅ Updated ${count} images...`);
      }
    }
  }
  
  console.log(`✅ Synced ${count} gallery images`);
  await connection.end();
}

async function syncNewsImages() {
  console.log('\n📰 Syncing news images...');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  const [news] = await connection.execute(
    'SELECT id, coverImageUrl, blocks FROM news WHERE coverImageUrl IS NOT NULL OR blocks IS NOT NULL'
  );
  
  let count = 0;
  for (const item of news as any[]) {
    const { error } = await supabase
      .from('news')
      .update({ 
        cover_image: item.coverImageUrl,
        blocks: item.blocks
      })
      .eq('id', item.id);
    
    if (error) {
      console.error(`  ❌ Error updating news ${item.id}:`, error.message);
    } else {
      count++;
      console.log(`  ✅ Updated news ${item.id}`);
    }
  }
  
  console.log(`✅ Synced ${count} news items`);
  await connection.end();
}

async function syncArticleImages() {
  console.log('\n📝 Syncing article images...');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  const [articles] = await connection.execute(
    'SELECT id, coverImageUrl, content FROM articles WHERE coverImageUrl IS NOT NULL OR content IS NOT NULL'
  );
  
  let count = 0;
  for (const article of articles as any[]) {
    const { error } = await supabase
      .from('articles')
      .update({ 
        cover_image: article.coverImageUrl,
        content: article.content
      })
      .eq('id', article.id);
    
    if (error) {
      console.error(`  ❌ Error updating article ${article.id}:`, error.message);
    } else {
      count++;
      console.log(`  ✅ Updated article ${article.id}`);
    }
  }
  
  console.log(`✅ Synced ${count} articles`);
  await connection.end();
}

async function main() {
  console.log('🚀 Syncing image URLs from MySQL to Supabase...\n');
  
  try {
    await syncProjectCoverImages();
    await syncProjectGalleryImages();
    await syncNewsImages();
    await syncArticleImages();
    
    console.log('\n✅ All image URLs synced successfully!');
    console.log('\nNext step: Run image migration to convert to WebP and upload to Supabase Storage');
    
  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  }
}

main();
