#!/usr/bin/env node
/**
 * Import content from the original portfolio into the new database
 * Run with: node scripts/import-data.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the extracted content
const contentPath = path.join(__dirname, '../portfolio-content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

console.log(`Found ${content.news.length} news items and ${content.articles.length} articles`);

// Generate SQL INSERT statements
const generateNewsInserts = () => {
  const inserts = [];
  
  for (const item of content.news) {
    const title = item.title.replace(/'/g, "''");
    const slug = item.slug || item.id;
    const excerpt = (item.excerpt || '').replace(/'/g, "''");
    const date = item.date;
    const category = (item.category || 'Other').replace(/'/g, "''");
    const location = (item.location || '').replace(/'/g, "''");
    const tags = JSON.stringify(item.tags || []).replace(/'/g, "''");
    
    inserts.push(`
INSERT INTO news (title, slug, excerpt, date, category, location, status, featured, published_at, created_at, updated_at)
VALUES ('${title}', '${slug}', '${excerpt}', '${date}', 'Other', ${location ? `'${location}'` : 'NULL'}, 'published', FALSE, '${date}', NOW(), NOW());
    `.trim());
  }
  
  return inserts.join('\n\n');
};

const generateArticleInserts = () => {
  const inserts = [];
  
  for (const item of content.articles) {
    const title = item.title.replace(/'/g, "''");
    const slug = item.slug || item.id;
    const excerpt = (item.excerpt || '').replace(/'/g, "''");
    const date = item.date;
    const category = (item.category || 'Other').replace(/'/g, "''");
    const readTime = parseInt((item.readTime || '5 min').match(/\d+/)?.[0] || '5');
    const featured = item.featured || false;
    
    inserts.push(`
INSERT INTO articles (title, slug, excerpt, content, read_time, status, featured, author_id, published_at, created_at, updated_at)
VALUES ('${title}', '${slug}', '${excerpt}', '${excerpt}', ${readTime}, 'published', ${featured}, 1, '${date}', NOW(), NOW());
    `.trim());
  }
  
  return inserts.join('\n\n');
};

// Generate SQL file
const sqlContent = `
-- Import content from original portfolio
-- Generated on ${new Date().toISOString()}

-- News Items
${generateNewsInserts()}

-- Articles
${generateArticleInserts()}
`;

const outputPath = path.join(__dirname, '../import-content.sql');
fs.writeFileSync(outputPath, sqlContent);

console.log(`\nGenerated SQL file: ${outputPath}`);
console.log('\nTo import, run:');
console.log('  Execute this SQL via webdev_execute_sql tool');
