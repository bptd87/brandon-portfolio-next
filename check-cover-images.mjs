import Database from 'better-sqlite3';

const db = new Database('./dev.db');
const articles = db.prepare('SELECT id, title, slug, coverImageUrl FROM articles ORDER BY createdAt DESC').all();

console.log('\n=== Article Cover Images ===\n');
articles.forEach((article, index) => {
  console.log(`${index + 1}. ${article.title}`);
  console.log(`   Slug: ${article.slug}`);
  console.log(`   Cover: ${article.coverImageUrl || 'NULL'}`);
  console.log('');
});

// Check for duplicates
const urlCounts = {};
articles.forEach(article => {
  if (article.coverImageUrl) {
    urlCounts[article.coverImageUrl] = (urlCounts[article.coverImageUrl] || 0) + 1;
  }
});

console.log('\n=== Duplicate Cover Images ===\n');
Object.entries(urlCounts).forEach(([url, count]) => {
  if (count > 1) {
    console.log(`${count} articles using: ${url}`);
    const dupes = articles.filter(a => a.coverImageUrl === url);
    dupes.forEach(d => console.log(`  - ${d.title}`));
    console.log('');
  }
});

db.close();
