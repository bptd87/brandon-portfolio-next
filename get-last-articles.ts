import { getAllArticles } from './server/db.js';

const articles = await getAllArticles();
const lastThree = articles.slice(-3);

console.log('\n=== Last 3 Articles (Bottom of Page) ===\n');
lastThree.forEach((article, index) => {
  console.log(`${index + 1}. ${article.title}`);
  console.log(`   Slug: ${article.slug}`);
  console.log(`   Cover URL: ${article.coverImageUrl}`);
  console.log('');
});

process.exit(0);
