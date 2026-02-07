import Database from 'better-sqlite3';

const db = new Database(process.env.DATABASE_URL || './dev.db');

const articles = db.prepare(`
  SELECT id, title, slug 
  FROM articles 
  WHERE title LIKE '%Lighting%'
`).all();

console.log('Articles with "Lighting" in title:');
articles.forEach(a => {
  console.log(`ID: ${a.id}, Slug: ${a.slug}`);
  console.log(`Title: ${a.title}\n`);
});

db.close();
