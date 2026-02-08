import sharp from 'sharp';
import { readFileSync } from 'fs';
import { storagePut } from '/home/ubuntu/brandon-portfolio-v2/server/storage.js';

const images = [
  {
    path: '/home/ubuntu/upload/Bell,Book,andCandle-OkobojiSummerTheatre-ScenicDesignbyBrandonPTDavis-1.JPG',
    altText: 'Bell, Book and Candle scenic design showing mid-century apartment interior with Christmas tree, red sofa, built-in bookshelves, and warm theatrical lighting',
    sortOrder: 1
  },
  {
    path: '/home/ubuntu/upload/Bell,Book,andCandle-OkobojiSummerTheatre-ScenicDesignbyBrandonPTDavis-32.JPG',
    altText: 'Three actors performing in Bell, Book and Candle apartment set with green walls and built-in bookshelves',
    sortOrder: 2
  },
  {
    path: '/home/ubuntu/upload/Bell,Book,andCandle-OkobojiSummerTheatre-ScenicDesignbyBrandonPTDavis-33.JPG',
    altText: 'Two actors in Bell, Book and Candle with green-walled apartment featuring vintage telephone and built-in shelving',
    sortOrder: 3
  },
  {
    path: '/home/ubuntu/upload/Bell,Book,andCandle-OkobojiSummerTheatre-ScenicDesignbyBrandonPTDavis-37.JPG',
    altText: 'Romantic scene from Bell, Book and Candle showing couple in mid-century apartment with Christmas tree, red sofa, and warm wood tones',
    sortOrder: 4
  },
  {
    path: '/home/ubuntu/upload/Bell,Book,andCandle-OkobojiSummerTheatre-ScenicDesignbyBrandonPTDavis-42.JPG',
    altText: 'Three actresses performing magical scene with flame effect in Bell, Book and Candle apartment set',
    sortOrder: 5
  },
];

const results = [];

for (const img of images) {
  try {
    // Read original image
    const buffer = readFileSync(img.path);
    
    // Optimize with Sharp
    const optimized = await sharp(buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    
    const metadata = await sharp(optimized).metadata();
    
    // Upload to S3
    const timestamp = Date.now();
    const key = `projects/bell-book-candle-${timestamp}-${img.sortOrder}.webp`;
    const result = await storagePut(key, optimized, 'image/webp');
    
    results.push({
      url: result.url,
      key: result.key,
      altText: img.altText,
      sortOrder: img.sortOrder,
      originalSize: buffer.length,
      optimizedSize: optimized.length,
      savings: Math.round((1 - optimized.length / buffer.length) * 100),
      width: metadata.width,
      height: metadata.height
    });
    
    console.log(`✓ Uploaded image ${img.sortOrder}: ${result.url}`);
    console.log(`  Size: ${(buffer.length / 1024 / 1024).toFixed(2)}MB → ${(optimized.length / 1024 / 1024).toFixed(2)}MB (${Math.round((1 - optimized.length / buffer.length) * 100)}% savings)`);
  } catch (error) {
    console.error(`✗ Failed to process ${img.path}:`, error.message);
  }
}

console.log('\n=== UPLOAD RESULTS ===');
console.log(JSON.stringify(results, null, 2));
