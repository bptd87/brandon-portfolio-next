import Database from 'better-sqlite3';

const db = new Database('./dev.db');

const article = db.prepare(`
  SELECT id, title, slug 
  FROM articles 
  WHERE title LIKE '%Lighting Styles%'
`).get();

if (article) {
  console.log('Found article:');
  console.log(`ID: ${article.id}`);
  console.log(`Title: ${article.title}`);
  console.log(`Slug: ${article.slug}`);
} else {
  console.log('Article not found in database');
}

db.close();
