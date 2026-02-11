import { getDb } from './server/db.ts';
import { projects, projectImages, news, articles } from './drizzle/schema.ts';

const db = await getDb();

console.log('=== ANALYZING ALL IMAGE LOCATIONS ===\n');

// 1. Project cover images
const projectCovers = await db.select().from(projects);
console.log(`1. PROJECT COVER IMAGES: ${projectCovers.length} projects`);
const projectCoversWithImages = projectCovers.filter(p => p.coverImageUrl);
console.log(`   - With cover images: ${projectCoversWithImages.length}`);
console.log(`   - Sample: ${projectCoversWithImages[0]?.coverImageUrl}\n`);

// 2. Project gallery images
const galleryImages = await db.select().from(projectImages);
console.log(`2. PROJECT GALLERY IMAGES: ${galleryImages.length} total gallery images`);
const galleryWithImages = galleryImages.filter(img => img.imageUrl);
const galleryWithVideos = galleryImages.filter(img => img.videoUrl);
console.log(`   - Image URLs: ${galleryWithImages.length}`);
console.log(`   - Video URLs: ${galleryWithVideos.length}`);
if (galleryWithImages.length > 0) {
  console.log(`   - Sample image: ${galleryWithImages[0].imageUrl}`);
}
console.log('');

// 3. News cover images
const allNews = await db.select().from(news);
console.log(`3. NEWS COVER IMAGES: ${allNews.length} news items`);
const newsWithCovers = allNews.filter(n => n.coverImageUrl);
console.log(`   - With cover images: ${newsWithCovers.length}`);
console.log(`   - Sample: ${newsWithCovers[0]?.coverImageUrl}\n`);

// 4. News blocks (gallery images)
let newsBlockImages = 0;
for (const item of allNews) {
  if (item.blocks && Array.isArray(item.blocks)) {
    for (const block of item.blocks) {
      if (block.type === 'gallery' && block.images) {
        newsBlockImages += block.images.length;
      }
    }
  }
}
console.log(`4. NEWS BLOCK IMAGES (in gallery blocks): ${newsBlockImages} images\n`);

// 5. Article cover images
const allArticles = await db.select().from(articles);
console.log(`5. ARTICLE COVER IMAGES: ${allArticles.length} articles`);
const articlesWithCovers = allArticles.filter(a => a.coverImageUrl);
console.log(`   - With cover images: ${articlesWithCovers.length}`);
console.log(`   - Sample: ${articlesWithCovers[0]?.coverImageUrl}\n`);

// 6. Article content images (in HTML/markdown)
let articleContentImages = 0;
const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
const mdImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

for (const article of allArticles) {
  if (article.content) {
    const htmlMatches = [...article.content.matchAll(imgRegex)];
    const mdMatches = [...article.content.matchAll(mdImgRegex)];
    articleContentImages += htmlMatches.length + mdMatches.length;
  }
}
console.log(`6. ARTICLE CONTENT IMAGES (embedded in HTML/markdown): ${articleContentImages} images\n`);

// Summary
console.log('=== TOTAL IMAGE COUNT ===');
const total = projectCoversWithImages.length + galleryWithImages.length + newsWithCovers.length + newsBlockImages + articlesWithCovers.length + articleContentImages;
console.log(`Total images to migrate: ${total}`);
console.log(`  - Project covers: ${projectCoversWithImages.length}`);
console.log(`  - Project gallery: ${galleryWithImages.length}`);
console.log(`  - News covers: ${newsWithCovers.length}`);
console.log(`  - News blocks: ${newsBlockImages}`);
console.log(`  - Article covers: ${articlesWithCovers.length}`);
console.log(`  - Article content: ${articleContentImages}`);
console.log(`  - Videos: ${galleryWithVideos.length} (separate handling needed)`);
