import { createConnection } from 'mysql2/promise';
import sharp from 'sharp';
import fetch from 'node-fetch';
import { storagePut } from './server/storage.ts';

const DATABASE_URL = process.env.DATABASE_URL;

async function compressAndUploadImage(imageUrl, projectTitle) {
  try {
    console.log(`\n📥 Downloading: ${projectTitle}`);
    console.log(`   URL: ${imageUrl}`);
    
    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    const originalSize = buffer.length;
    console.log(`   Original size: ${(originalSize / 1024).toFixed(2)} KB`);
    
    // Compress the image
    const compressed = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();
    
    const compressedSize = compressed.length;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    console.log(`   Compressed size: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`   Savings: ${savings}%`);
    
    // Generate new filename
    const urlParts = new URL(imageUrl);
    const pathParts = urlParts.pathname.split('/');
    const originalFilename = pathParts[pathParts.length - 1];
    const filenameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
    const newFilename = `${filenameWithoutExt}-compressed.webp`;
    
    // Upload to S3
    const s3Key = `project-covers/${newFilename}`;
    const { url: newUrl } = await storagePut(s3Key, compressed, 'image/webp');
    
    console.log(`   ✅ Uploaded: ${newUrl}`);
    
    return {
      originalUrl: imageUrl,
      newUrl,
      originalSize,
      compressedSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  const connection = await createConnection(DATABASE_URL);
  
  console.log('🔍 Fetching all project cover images...\n');
  const [projects] = await connection.execute(
    'SELECT id, title, coverImageUrl FROM projects WHERE coverImageUrl IS NOT NULL ORDER BY id'
  );
  
  console.log(`Found ${projects.length} projects with cover images\n`);
  console.log('=' .repeat(80));
  
  const results = [];
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  
  for (const project of projects) {
    const result = await compressAndUploadImage(project.coverImageUrl, project.title);
    
    if (result) {
      // Update database with new URL
      await connection.execute(
        'UPDATE projects SET coverImageUrl = ? WHERE id = ?',
        [result.newUrl, project.id]
      );
      
      results.push({
        id: project.id,
        title: project.title,
        ...result
      });
      
      totalOriginalSize += result.originalSize;
      totalCompressedSize += result.compressedSize;
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY');
  console.log('=' .repeat(80));
  console.log(`Total projects processed: ${results.length}`);
  console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total compressed size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1)}%`);
  console.log(`Bandwidth saved: ${((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)} MB`);
  
  await connection.end();
  
  console.log('\n✅ All images compressed and database updated!');
}

main().catch(console.error);
