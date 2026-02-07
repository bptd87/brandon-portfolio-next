import Database from 'better-sqlite3';

const db = new Database('./dev.db');
const categories = db.prepare('SELECT DISTINCT name FROM categories ORDER BY name').all();

console.log('All Categories:');
categories.forEach((cat: any) => {
  console.log(`- ${cat.name}`);
});

db.close();
