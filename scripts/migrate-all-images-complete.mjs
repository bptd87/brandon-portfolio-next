import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import sharp from 'sharp';
import https from 'https';
import http from 'http';

const SUPABASE_URL = 'https://xibkuwouvisabnfowthn.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYmt1d291dmlzYWJuZm93dGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg5MTQ1NywiZXhwIjoyMDg2NDY3NDU3fQ.wjhbQBIwzpG7ushihh420cNbtNvHEzWlyc1XeZqJZH4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const mysqlConn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🚀 Starting COMPLETE image migration to Supabase Storage...\n');

// Helper function to download image
async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed: ${response.statusCode}`));
        return;
      }
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// Step 1: Collect ALL image URLs from database
console.log('📊 Scanning database for ALL images...\n');

const allImages = [];
let imageId = 0;

// 1. Project cover images
const [projects] = await mysqlConn.query('SELECT id, coverImageUrl FROM projects WHERE coverImageUrl IS NOT NULL');
for (const p of projects) {
  allImages.push({
    id: imageId++,
    type: 'project_cover',
    recordId: p.id,
    url: p.coverImageUrl,
    storagePath: `projects/covers/project-${p.id}.webp`,
    updateQuery: 'UPDATE projects SET coverImageUrl = ? WHERE id = ?'
  });
}
console.log(`✅ Found ${projects.length} project cover images`);

// 2. Project gallery images
const [projectImages] = await mysqlConn.query('SELECT id, projectId, imageUrl, imageKey FROM projectImages WHERE imageUrl IS NOT NULL');
for (const img of projectImages) {
  allImages.push({
    id: imageId++,
    type: 'project_image',
    recordId: img.id,
    projectId: img.projectId,
    url: img.imageUrl,
    storagePath: `projects/${img.projectId}/image-${img.id}.webp`,
    updateQuery: 'UPDATE projectImages SET imageUrl = ? WHERE id = ?'
  });
}
console.log(`✅ Found ${projectImages.length} project gallery images`);

// 3. News cover images
const [news] = await mysqlConn.query('SELECT id, coverImageUrl FROM news WHERE coverImageUrl IS NOT NULL');
for (const n of news) {
  allImages.push({
    id: imageId++,
    type: 'news_cover',
    recordId: n.id,
    url: n.coverImageUrl,
    storagePath: `news/covers/news-${n.id}.webp`,
    updateQuery: 'UPDATE news SET coverImageUrl = ? WHERE id = ?'
  });
}
console.log(`✅ Found ${news.length} news cover images`);

// 4. News block images
const [newsWithBlocks] = await mysqlConn.query('SELECT id, blocks FROM news WHERE blocks IS NOT NULL');
const newsBlockImages = [];
for (const n of newsWithBlocks) {
  if (n.blocks) {
    const blocks = typeof n.blocks === 'string' ? JSON.parse(n.blocks) : n.blocks;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === 'image' && blocks[i].url) {
        newsBlockImages.push({
          id: imageId++,
          type: 'news_block',
          recordId: n.id,
          blockIndex: i,
          url: blocks[i].url,
          storagePath: `news/${n.id}/block-${i}.webp`,
          blocks: blocks // Store for later update
        });
      }
    }
  }
}
allImages.push(...newsBlockImages);
console.log(`✅ Found ${newsBlockImages.length} news block images`);

// 5. Article cover images
const [articles] = await mysqlConn.query('SELECT id, coverImageUrl FROM articles WHERE coverImageUrl IS NOT NULL');
for (const a of articles) {
  allImages.push({
    id: imageId++,
    type: 'article_cover',
    recordId: a.id,
    url: a.coverImageUrl,
    storagePath: `articles/covers/article-${a.id}.webp`,
    updateQuery: 'UPDATE articles SET coverImageUrl = ? WHERE id = ?'
  });
}
console.log(`✅ Found ${articles.length} article cover images`);

// 6. Article embedded images
const [articlesWithContent] = await mysqlConn.query('SELECT id, content FROM articles WHERE content LIKE "%http%"');
const articleEmbeddedImages = [];
for (const a of articlesWithContent) {
  if (a.content) {
    const urlMatches = a.content.match(/https?:\/\/[^\s\)\"<>]+\.(jpg|jpeg|png|webp|gif)/gi);
    if (urlMatches) {
      const uniqueUrls = [...new Set(urlMatches)];
      for (let i = 0; i < uniqueUrls.length; i++) {
        articleEmbeddedImages.push({
          id: imageId++,
          type: 'article_embedded',
          recordId: a.id,
          imageIndex: i,
          url: uniqueUrls[i],
          storagePath: `articles/${a.id}/embedded-${i}.webp`,
          content: a.content // Store for later replacement
        });
      }
    }
  }
}
allImages.push(...articleEmbeddedImages);
console.log(`✅ Found ${articleEmbeddedImages.length} article embedded images`);

console.log(`\n📊 TOTAL: ${allImages.length} images to migrate\n`);

// Step 2: Download, convert, upload
let successCount = 0;
let errorCount = 0;
const urlMappings = new Map();

for (let i = 0; i < allImages.length; i++) {
  const img = allImages[i];
  const progress = `[${i + 1}/${allImages.length}]`;
  
  try {
    // Skip if already in Supabase
    if (img.url.includes('supabase.co')) {
      successCount++;
      continue;
    }
    
    // Download
    console.log(`${progress} ⬇️  ${img.type} ${img.recordId}`);
    const imageBuffer = await downloadImage(img.url);
    
    // Convert to WebP
    const webpBuffer = await sharp(imageBuffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    
    // Upload
    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(img.storagePath, webpBuffer, {
        contentType: 'image/webp',
        upsert: true
      });
    
    if (uploadError) {
      console.error(`${progress} ❌`, uploadError.message);
      errorCount++;
      continue;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(img.storagePath);
    
    // Store mapping
    urlMappings.set(img.url, publicUrl);
    img.newUrl = publicUrl;
    
    const savings = ((1 - webpBuffer.length / imageBuffer.length) * 100).toFixed(0);
    console.log(`${progress} ✅ ${savings}% savings`);
    successCount++;
    
    // Rate limit protection
    if (i % 10 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
  } catch (error) {
    console.error(`${progress} ❌`, error.message);
    errorCount++;
  }
}

console.log(`\n📊 Migration: ✅ ${successCount} | ❌ ${errorCount}\n`);

// Step 3: Update database
console.log('🔄 Updating database URLs...\n');

for (const img of allImages) {
  if (!img.newUrl) continue;
  
  try {
    if (img.updateQuery) {
      // Simple field update
      await mysqlConn.query(img.updateQuery, [img.newUrl, img.recordId]);
    } else if (img.type === 'news_block') {
      // Update blocks JSON
      img.blocks[img.blockIndex].url = img.newUrl;
      await mysqlConn.query('UPDATE news SET blocks = ? WHERE id = ?', [JSON.stringify(img.blocks), img.recordId]);
    } else if (img.type === 'article_embedded') {
      // Replace URL in content
      const updatedContent = img.content.replace(img.url, img.newUrl);
      await mysqlConn.query('UPDATE articles SET content = ? WHERE id = ?', [updatedContent, img.recordId]);
    }
  } catch (error) {
    console.error(`Error updating ${img.type} ${img.recordId}:`, error.message);
  }
}

console.log('✅ Database URLs updated\n');

// Step 4: Re-run Supabase migration to sync updated URLs
console.log('🔄 Syncing updated URLs to Supabase...\n');
const { data: supaProjects } = await supabase.from('projects').select('id');
for (const p of supaProjects) {
  const [mysqlProject] = await mysqlConn.query('SELECT coverImageUrl FROM projects WHERE id = ?', [p.id]);
  if (mysqlProject[0]) {
    await supabase.from('projects').update({ cover_image: mysqlProject[0].coverImageUrl }).eq('id', p.id);
  }
}

const { data: supaImages } = await supabase.from('project_images').select('id');
for (const img of supaImages) {
  const [mysqlImg] = await mysqlConn.query('SELECT imageUrl FROM projectImages WHERE id = ?', [img.id]);
  if (mysqlImg[0]) {
    await supabase.from('project_images').update({ image_url: mysqlImg[0].imageUrl }).eq('id', img.id);
  }
}

console.log('✅ Supabase synced\n');

await mysqlConn.end();
console.log('✅ COMPLETE image migration finished!');
