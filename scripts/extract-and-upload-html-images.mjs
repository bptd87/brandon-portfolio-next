import { readFileSync, writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ORIGINAL_FILE = '/home/ubuntu/wordpress-articles-export/articles-full-export.json';
const OUTPUT_FILE = '/home/ubuntu/wordpress-articles-export/articles-with-html-images.json';

console.log('🚀 Extracting images from HTML and uploading to S3...\n');

const articles = JSON.parse(readFileSync(ORIGINAL_FILE, 'utf8'));

// Download and upload image to S3
async function downloadAndUploadImage(url) {
  try {
    // Download image
    const tempFile = `/tmp/img-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
    await execAsync(`curl -sL "${url}" -o "${tempFile}"`);
    
    // Upload to S3
    const { stdout } = await execAsync(`manus-upload-file "${tempFile}"`);
    const s3Url = stdout.trim();
    
    // Clean up
    await execAsync(`rm "${tempFile}"`);
    
    return s3Url;
  } catch (error) {
    console.error(`   ❌ Failed to upload ${url}: ${error.message}`);
    return null;
  }
}

// Process articles
const processedArticles = [];

for (const article of articles) {
  console.log(`📝 Processing: ${article.title}`);
  
  // Parse HTML to find all images
  const dom = new JSDOM(article.content);
  const images = Array.from(dom.window.document.querySelectorAll('img'));
  
  console.log(`   Found ${images.length} images in HTML`);
  
  const imageMap = new Map();
  
  // Upload each image
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = img.getAttribute('src');
    
    if (!src || imageMap.has(src)) continue;
    
    console.log(`   Uploading image ${i + 1}/${images.length}...`);
    const s3Url = await downloadAndUploadImage(src);
    
    if (s3Url) {
      imageMap.set(src, {
        originalUrl: src,
        s3Url: s3Url,
        alt: img.getAttribute('alt') || ''
      });
    }
  }
  
  processedArticles.push({
    ...article,
    htmlImages: Array.from(imageMap.values())
  });
  
  console.log(`   ✅ Uploaded ${imageMap.size} unique images\n`);
}

writeFileSync(OUTPUT_FILE, JSON.stringify(processedArticles, null, 2));
console.log(`\n✅ Complete! Saved to ${OUTPUT_FILE}`);
