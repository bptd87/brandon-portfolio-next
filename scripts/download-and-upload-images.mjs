import fetch from 'node-fetch';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const INPUT_FILE = '/home/ubuntu/wordpress-articles-export/articles-full-export.json';
const IMAGES_DIR = '/home/ubuntu/wordpress-articles-export/images';
const OUTPUT_FILE = '/home/ubuntu/wordpress-articles-export/articles-with-s3-urls.json';

// Create images directory
if (!existsSync(IMAGES_DIR)) {
  mkdirSync(IMAGES_DIR, { recursive: true });
}

console.log('🚀 Starting image download and S3 upload...\n');

// Load extracted articles
const articles = JSON.parse(readFileSync(INPUT_FILE, 'utf8'));

// Track all unique images
const imageMap = new Map(); // originalUrl -> s3Url

let downloadCount = 0;
let uploadCount = 0;
let errorCount = 0;

// Download image
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const buffer = await response.arrayBuffer();
    const localPath = join(IMAGES_DIR, filename);
    writeFileSync(localPath, Buffer.from(buffer));
    
    downloadCount++;
    return localPath;
  } catch (error) {
    console.error(`  ⚠️  Failed to download ${url}:`, error.message);
    errorCount++;
    return null;
  }
}

// Upload to S3 using manus-upload-file
async function uploadToS3(localPath) {
  try {
    const { stdout } = await execAsync(`manus-upload-file "${localPath}"`);
    
    // Parse the CDN URL from output
    const match = stdout.match(/CDN URL: (https:\/\/[^\s]+)/);
    if (match && match[1]) {
      uploadCount++;
      return match[1];
    }
    
    throw new Error('Could not parse CDN URL from output');
  } catch (error) {
    console.error(`  ⚠️  Failed to upload ${localPath}:`, error.message);
    errorCount++;
    return null;
  }
}

// Process all articles
for (const article of articles) {
  console.log(`📝 Processing images for: ${article.title}`);
  
  // Process featured image
  if (article.featuredImage) {
    const url = article.featuredImage.url;
    
    if (!imageMap.has(url)) {
      const filename = `featured-${article.slug}-${basename(url)}`;
      console.log(`  📥 Downloading featured image...`);
      
      const localPath = await downloadImage(url, filename);
      if (localPath) {
        console.log(`  ☁️  Uploading to S3...`);
        const s3Url = await uploadToS3(localPath);
        if (s3Url) {
          imageMap.set(url, s3Url);
          console.log(`  ✅ ${s3Url}`);
        }
      }
    } else {
      console.log(`  ♻️  Featured image already processed`);
    }
  }
  
  // Process inline images
  for (let i = 0; i < article.inlineImages.length; i++) {
    const img = article.inlineImages[i];
    const url = img.url;
    
    if (!imageMap.has(url)) {
      const filename = `inline-${article.slug}-${i}-${basename(url).substring(0, 50)}`;
      console.log(`  📥 Downloading inline image ${i + 1}/${article.inlineImages.length}...`);
      
      const localPath = await downloadImage(url, filename);
      if (localPath) {
        console.log(`  ☁️  Uploading to S3...`);
        const s3Url = await uploadToS3(localPath);
        if (s3Url) {
          imageMap.set(url, s3Url);
          console.log(`  ✅ ${s3Url}`);
        }
      }
    } else {
      console.log(`  ♻️  Inline image ${i + 1} already processed`);
    }
  }
  
  console.log('');
}

// Update articles with S3 URLs
const updatedArticles = articles.map(article => {
  const updated = { ...article };
  
  // Update featured image
  if (updated.featuredImage && imageMap.has(updated.featuredImage.url)) {
    updated.featuredImage.url = imageMap.get(updated.featuredImage.url);
  }
  
  // Update inline images
  updated.inlineImages = updated.inlineImages.map(img => ({
    ...img,
    url: imageMap.has(img.url) ? imageMap.get(img.url) : img.url
  }));
  
  return updated;
});

// Save updated articles
writeFileSync(OUTPUT_FILE, JSON.stringify(updatedArticles, null, 2));

console.log('\n✅ Image processing complete!');
console.log(`📥 Downloaded: ${downloadCount} images`);
console.log(`☁️  Uploaded to S3: ${uploadCount} images`);
console.log(`⚠️  Errors: ${errorCount}`);
console.log(`📁 Saved to: ${OUTPUT_FILE}`);

process.exit(0);
