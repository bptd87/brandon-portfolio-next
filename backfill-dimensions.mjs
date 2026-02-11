import { createConnection } from 'mysql2/promise';
import fetch from 'node-fetch';
import sharp from 'sharp';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await createConnection(DATABASE_URL);
  
  console.log('Fetching all images from database...');
  
  // Get all projects with cover images
  const [projects] = await connection.query(
    'SELECT id, coverImageUrl FROM projects WHERE coverImageUrl IS NOT NULL'
  );
  
  // Get all news with cover images
  const [news] = await connection.query(
    'SELECT id, coverImageUrl FROM news WHERE coverImageUrl IS NOT NULL'
  );
  
  // Get all articles with cover images
  const [articles] = await connection.query(
    'SELECT id, coverImageUrl FROM articles WHERE coverImageUrl IS NOT NULL'
  );
  
  const allImages = [
    ...projects.map(p => ({ table: 'projects', id: p.id, url: p.coverImageUrl })),
    ...news.map(n => ({ table: 'news', id: n.id, url: n.coverImageUrl })),
    ...articles.map(a => ({ table: 'articles', id: a.id, url: a.coverImageUrl }))
  ];
  
  console.log(`Found ${allImages.length} images to process`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const img of allImages) {
    try {
      console.log(`Processing ${img.table}#${img.id}: ${img.url.substring(0, 60)}...`);
      
      // Fetch image
      const response = await fetch(img.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      
      // Get dimensions using sharp
      const metadata = await sharp(buffer).metadata();
      const width = metadata.width;
      const height = metadata.height;
      
      // Update database
      await connection.query(
        `UPDATE ${img.table} SET coverImageWidth = ?, coverImageHeight = ? WHERE id = ?`,
        [width, height, img.id]
      );
      
      console.log(`  ✓ ${width}x${height}`);
      successCount++;
      
    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}`);
      failCount++;
    }
  }
  
  await connection.end();
  
  console.log(`\nBackfill complete:`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Failed: ${failCount}`);
}

main().catch(console.error);
