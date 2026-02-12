import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import sharp from 'sharp';
import https from 'https';
import http from 'http';

const SUPABASE_URL = 'https://xibkuwouvisabnfowthn.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYmt1d291dmlzYWJuZm93dGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg5MTQ1NywiZXhwIjoyMDg2NDY3NDU3fQ.wjhbQBIwzpG7ushihh420cNbtNvHEzWlyc1XeZqJZH4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🚀 Starting WebP image migration to Supabase Storage...\n');

// Helper function to download image
async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// Step 1: Clear existing uploads and start fresh
console.log('🗑️  Clearing previous uploads...');
const { data: files } = await supabase.storage.from('portfolio-images').list();
if (files && files.length > 0) {
  const filePaths = files.map(f => f.name);
  await supabase.storage.from('portfolio-images').remove(filePaths);
  console.log(`✅ Cleared ${filePaths.length} old files\n`);
}

// Step 2: Get all images from database
console.log('📊 Fetching images from database...');
const { data: projects } = await supabase.from('projects').select('id, cover_image');
const { data: projectImages } = await supabase.from('project_images').select('id, project_id, image_url');
const { data: news } = await supabase.from('news').select('id, cover_image');
const { data: articles } = await supabase.from('articles').select('id, cover_image');

const allImages = [
  ...projects.filter(p => p.cover_image).map(p => ({ type: 'project_cover', id: p.id, url: p.cover_image })),
  ...projectImages.map(i => ({ type: 'project_image', id: i.id, projectId: i.project_id, url: i.image_url })),
  ...news.filter(n => n.cover_image).map(n => ({ type: 'news_cover', id: n.id, url: n.cover_image })),
  ...articles.filter(a => a.cover_image).map(a => ({ type: 'article_cover', id: a.id, url: a.cover_image }))
];

console.log(`Found ${allImages.length} images to migrate\n`);

// Step 3: Download, convert to WebP, and upload
let successCount = 0;
let errorCount = 0;
const urlMappings = [];

for (let i = 0; i < allImages.length; i++) {
  const img = allImages[i];
  const progress = `[${i + 1}/${allImages.length}]`;
  
  try {
    // Skip if already in Supabase
    if (img.url.includes('supabase.co')) {
      console.log(`${progress} ⏭️  Already in Supabase: ${img.type} ${img.id}`);
      successCount++;
      continue;
    }
    
    // Determine file path in storage (always .webp)
    let storagePath;
    if (img.type === 'project_cover') {
      storagePath = `projects/covers/project-${img.id}.webp`;
    } else if (img.type === 'project_image') {
      storagePath = `projects/${img.projectId}/image-${img.id}.webp`;
    } else if (img.type === 'news_cover') {
      storagePath = `news/covers/news-${img.id}.webp`;
    } else if (img.type === 'article_cover') {
      storagePath = `articles/covers/article-${img.id}.webp`;
    }
    
    // Download image
    console.log(`${progress} ⬇️  ${img.url.substring(0, 50)}...`);
    const imageBuffer = await downloadImage(img.url);
    
    // Convert to WebP with optimization
    console.log(`${progress} 🔄 Converting to WebP...`);
    const webpBuffer = await sharp(imageBuffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    
    const originalSize = (imageBuffer.length / 1024).toFixed(1);
    const newSize = (webpBuffer.length / 1024).toFixed(1);
    const savings = ((1 - webpBuffer.length / imageBuffer.length) * 100).toFixed(0);
    
    // Upload to Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(storagePath, webpBuffer, {
        contentType: 'image/webp',
        upsert: true
      });
    
    if (uploadError) {
      console.error(`${progress} ❌ Upload error:`, uploadError.message);
      errorCount++;
      continue;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(storagePath);
    
    // Store mapping for database update
    urlMappings.push({
      type: img.type,
      id: img.id,
      oldUrl: img.url,
      newUrl: publicUrl
    });
    
    console.log(`${progress} ✅ ${originalSize}KB → ${newSize}KB (${savings}% savings)`);
    successCount++;
    
    // Small delay to avoid rate limits
    if (i % 10 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
  } catch (error) {
    console.error(`${progress} ❌ Error:`, error.message);
    errorCount++;
  }
}

console.log(`\n📊 Migration summary:`);
console.log(`  ✅ Success: ${successCount}`);
console.log(`  ❌ Errors: ${errorCount}`);

// Step 4: Update database URLs
console.log(`\n🔄 Updating database URLs...`);

for (const mapping of urlMappings) {
  if (mapping.type === 'project_cover') {
    await supabase.from('projects').update({ cover_image: mapping.newUrl }).eq('id', mapping.id);
  } else if (mapping.type === 'project_image') {
    await supabase.from('project_images').update({ image_url: mapping.newUrl }).eq('id', mapping.id);
  } else if (mapping.type === 'news_cover') {
    await supabase.from('news').update({ cover_image: mapping.newUrl }).eq('id', mapping.id);
  } else if (mapping.type === 'article_cover') {
    await supabase.from('articles').update({ cover_image: mapping.newUrl }).eq('id', mapping.id);
  }
}

console.log(`✅ Updated ${urlMappings.length} database records`);

// Save mapping for reference
await fs.writeFile(
  '/home/ubuntu/image-url-mappings.json',
  JSON.stringify(urlMappings, null, 2)
);

console.log(`\n✅ WebP image migration complete!`);
console.log(`📝 URL mappings saved to /home/ubuntu/image-url-mappings.json`);
