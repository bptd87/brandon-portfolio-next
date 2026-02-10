#!/usr/bin/env node
/**
 * Update all news articles with full content from Squarespace export
 */
import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database(process.env.DATABASE_URL.replace('file:', ''));

// Load the extracted content
const content = JSON.parse(fs.readFileSync('/home/ubuntu/news_content_extracted.json', 'utf-8'));

console.log('='.repeat(60));
console.log('UPDATING NEWS ARTICLES WITH FULL CONTENT');
console.log('='.repeat(60));
console.log(`Loaded ${content.length} articles from Squarespace export\n`);

let updated = 0;
let skipped = 0;

for (const article of content) {
  try {
    // Find matching article in database by title
    const dbArticle = db.prepare('SELECT id, title FROM news WHERE title = ?').get(article.title);
    
    if (!dbArticle) {
      console.log(`✗ No match: ${article.title}`);
      skipped++;
      continue;
    }
    
    // Update with full content
    const stmt = db.prepare(`
      UPDATE news 
      SET excerpt = ?,
          blocks = ?
      WHERE id = ?
    `);
    
    stmt.run(
      article.excerpt,
      JSON.stringify(article.blocks),
      dbArticle.id
    );
    
    console.log(`✓ Updated: ${article.title} (${article.blocks_count} blocks)`);
    updated++;
    
  } catch (error) {
    console.error(`✗ Error updating ${article.title}:`, error.message);
    skipped++;
  }
}

db.close();

console.log('\n' + '='.repeat(60));
console.log(`✓ Updated ${updated} articles`);
console.log(`✗ Skipped ${skipped} articles`);
console.log('='.repeat(60));
