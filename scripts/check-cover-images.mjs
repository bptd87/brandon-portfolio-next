import { getDb } from '../server/db.ts';

const db = await getDb();

const articles = await db.query.articles.findMany({
  limit: 10,
  columns: {
    id: true,
    title: true,
    coverImageUrl: true
  }
});

console.log('Articles with cover images:');
articles.forEach(article => {
  console.log(`\n${article.id}: ${article.title}`);
  console.log(`  Cover: ${article.coverImageUrl || 'NULL'}`);
});

console.log(`\n\nTotal: ${articles.length} articles`);
console.log(`With covers: ${articles.filter(a => a.coverImageUrl).length}`);
console.log(`Without covers: ${articles.filter(a => !a.coverImageUrl).length}`);
