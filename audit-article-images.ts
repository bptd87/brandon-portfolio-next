import { getAllArticles } from './server/db.js';

const articles = await getAllArticles();

console.log('\n=== Article Image Audit ===\n');
console.log(`Total articles: ${articles.length}\n`);

const imageStats = {
  manuscdn: 0,
  cloudinary: 0,
  wordpress: 0,
  other: 0
};

const coverImages: { title: string; url: string; source: string }[] = [];

articles.forEach(article => {
  let source = 'other';
  
  if (article.coverImageUrl.includes('manuscdn.com')) {
    source = 'manuscdn';
    imageStats.manuscdn++;
  } else if (article.coverImageUrl.includes('cloudinary.com')) {
    source = 'cloudinary';
    imageStats.cloudinary++;
  } else if (article.coverImageUrl.includes('wordpress') || article.coverImageUrl.includes('wp-content')) {
    source = 'wordpress';
    imageStats.wordpress++;
  } else {
    imageStats.other++;
  }
  
  coverImages.push({
    title: article.title,
    url: article.coverImageUrl,
    source
  });
});

console.log('Cover Image Sources:');
console.log(`- Manus CDN: ${imageStats.manuscdn}`);
console.log(`- Cloudinary: ${imageStats.cloudinary}`);
console.log(`- WordPress: ${imageStats.wordpress}`);
console.log(`- Other: ${imageStats.other}`);
console.log('\n');

console.log('Cloudinary Images (need migration):');
coverImages
  .filter(img => img.source === 'cloudinary')
  .forEach(img => {
    console.log(`- ${img.title}`);
    console.log(`  ${img.url}\n`);
  });

process.exit(0);
