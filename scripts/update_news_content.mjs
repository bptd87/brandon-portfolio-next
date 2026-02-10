#!/usr/bin/env node
/**
 * Bulk update news articles with full content from Squarespace export
 */
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema.ts';
import fs from 'fs';

const sqlite = new Database(process.env.DATABASE_URL.replace('file:', ''));
const db = drizzle(sqlite, { schema });

// Load extracted content
const content = JSON.parse(fs.readFileSync('/home/ubuntu/news_content_extracted.json', 'utf-8'));

console.log('='.repeat(60));
console.log('BULK UPDATING NEWS ARTICLES WITH FULL CONTENT');
console.log('='.repeat(60));
console.log(`Loaded ${content.length} articles from Squarespace\n`);

let updated = 0;
let skipped = 0;

for (const article of content) {
  try {
    // Find matching article by title
    const matches = await db.select().from(schema.news).where(eq(schema.news.title, article.title));
    
    if (matches.length === 0) {
      console.log(`✗ No match: ${article.title}`);
      skipped++;
      continue;
    }
    
    const dbArticle = matches[0];
    
    // Update with full content
    await db.update(schema.news)
      .set({
        excerpt: article.excerpt,
        blocks: JSON.stringify(article.blocks)
      })
      .where(eq(schema.news.id, dbArticle.id));
    
    console.log(`✓ Updated: ${article.title} (${article.blocks_count} blocks)`);
    updated++;
    
  } catch (error) {
    console.error(`✗ Error updating ${article.title}:`, error.message);
    skipped++;
  }
}

sqlite.close();

console.log('\n' + '='.repeat(60));
console.log(`✓ Updated ${updated} articles`);
console.log(`✗ Skipped ${skipped} articles`);
console.log('='.repeat(60));
