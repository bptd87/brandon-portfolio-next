import Database from 'better-sqlite3';

const db = new Database(process.env.DATABASE_URL?.replace('file:', '') || './local.db');

const article = db.prepare('SELECT id, title, content FROM articles WHERE slug = ?').get('online-portfolio-theatrical-design-2026');

console.log('Article ID:', article.id);
console.log('Title:', article.title);
console.log('\nContent (first 2000 chars):');
console.log(article.content.substring(0, 2000));
console.log('\n... (truncated)');

// Look for FAQ section
const faqIndex = article.content.indexOf('FAQ');
if (faqIndex !== -1) {
  console.log('\nFAQ Section (500 chars around FAQ):');
  console.log(article.content.substring(Math.max(0, faqIndex - 100), faqIndex + 400));
}

db.close();
