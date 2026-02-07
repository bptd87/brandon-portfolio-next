import { getAllArticles } from './server/db.js';

const articles = await getAllArticles();
const targetSlugs = [
  'becoming-a-scenic-designer-a-comprehensive-guide',
  'video-game-environments-lessons-for-scenic-design',
  'online-portfolio-theatrical-design-2026'
];

console.log('\n=== Verifying Cover Image URLs ===\n');
articles
  .filter(a => targetSlugs.includes(a.slug))
  .forEach(article => {
    console.log(`Title: ${article.title}`);
    console.log(`Slug: ${article.slug}`);
    console.log(`Cover URL: ${article.coverImageUrl}`);
    console.log('');
  });

process.exit(0);
