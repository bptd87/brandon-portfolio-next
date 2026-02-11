import { createConnection } from 'mysql2/promise';
import sharp from 'sharp';
import fetch from 'node-fetch';
import { storagePut } from './server/storage.ts';

const DATABASE_URL = process.env.DATABASE_URL;

async function compressAndUploadImage(imageUrl, articleTitle) {
  try {
    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    const originalSize = buffer.length;
    
    // Compress the image
    const compressed = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();
    
    const compressedSize = compressed.length;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    // Generate new filename
    const urlParts = new URL(imageUrl);
    const pathParts = urlParts.pathname.split('/');
    const originalFilename = pathParts[pathParts.length - 1];
    const filenameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '').replace(/\?.*$/, '');
    const newFilename = `${filenameWithoutExt}-compressed.webp`;
    
    // Upload to S3
    const s3Key = `article-images/${newFilename}`;
    const { url: newUrl } = await storagePut(s3Key, compressed, 'image/webp');
    
    return {
      originalUrl: imageUrl,
      newUrl,
      originalSize,
      compressedSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`   ❌ Error (${articleTitle}): ${error.message}`);
    return null;
  }
}

async function main() {
  const connection = await createConnection(DATABASE_URL);
  
  console.log('🔍 Fetching all articles...\n');
  const [articles] = await connection.execute(
    'SELECT id, title, content FROM articles WHERE content IS NOT NULL ORDER BY id'
  );
  
  console.log(`Found ${articles.length} articles\n`);
  console.log('=' .repeat(80));
  
  const imageUrlMap = new Map(); // Track unique images
  const articleImageMap = new Map(); // Track which articles use which images
  
  // Extract all image URLs from article content
  for (const article of articles) {
    try {
      const content = JSON.parse(article.content);
      const images = [];
      
      for (const block of content) {
        if (block.type === 'image' && block.url) {
          images.push(block.url);
          imageUrlMap.set(block.url, null); // Will store compressed URL later
        }
      }
      
      if (images.length > 0) {
        articleImageMap.set(article.id, {
          title: article.title,
          images,
          content
        });
      }
    } catch (error) {
      console.error(`Failed to parse content for article ${article.id}: ${error.message}`);
    }
  }
  
  console.log(`\nFound ${imageUrlMap.size} unique images across ${articleImageMap.size} articles\n`);
  console.log('=' .repeat(80));
  
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let processedCount = 0;
  
  // Compress each unique image
  for (const [imageUrl] of imageUrlMap) {
    processedCount++;
    console.log(`\n[${processedCount}/${imageUrlMap.size}] Processing image...`);
    console.log(`   URL: ${imageUrl.substring(0, 80)}...`);
    
    const result = await compressAndUploadImage(imageUrl, 'article');
    
    if (result) {
      imageUrlMap.set(imageUrl, result.newUrl);
      totalOriginalSize += result.originalSize;
      totalCompressedSize += result.compressedSize;
      console.log(`   Original: ${(result.originalSize / 1024).toFixed(2)} KB → Compressed: ${(result.compressedSize / 1024).toFixed(2)} KB (${result.savings}% savings)`);
      console.log(`   ✅ New URL: ${result.newUrl.substring(0, 80)}...`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📝 Updating article content with compressed URLs...\n');
  
  // Update article content with new URLs
  let updatedArticles = 0;
  for (const [articleId, articleData] of articleImageMap) {
    let hasChanges = false;
    
    for (const block of articleData.content) {
      if (block.type === 'image' && block.url) {
        const newUrl = imageUrlMap.get(block.url);
        if (newUrl) {
          block.url = newUrl;
          hasChanges = true;
        }
      }
    }
    
    if (hasChanges) {
      await connection.execute(
        'UPDATE articles SET content = ? WHERE id = ?',
        [JSON.stringify(articleData.content), articleId]
      );
      updatedArticles++;
      console.log(`✅ Updated: ${articleData.title}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY');
  console.log('=' .repeat(80));
  console.log(`Total unique images processed: ${processedCount}`);
  console.log(`Total articles updated: ${updatedArticles}`);
  console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total compressed size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1)}%`);
  console.log(`Bandwidth saved: ${((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)} MB`);
  
  await connection.end();
  
  console.log('\n✅ All article images compressed and database updated!');
}

main().catch(console.error);
