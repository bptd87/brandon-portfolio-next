import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';

const newsData = JSON.parse(readFileSync('./server/newsData.json', 'utf8'));
const imageMap = JSON.parse(readFileSync('./server/newsImageMap.json', 'utf8'));

// Get DB URL from environment
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

const url = new URL(dbUrl);
const connection = await mysql.createConnection({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false }
});

function blocksToJson(content) {
  if (!content) return [];
  if (typeof content === 'string') return [{ type: 'text', content }];
  
  const blocks = [];
  for (const block of content) {
    if (block.type === 'paragraph' && block.content) {
      const cleaned = block.content.replace(/\u00a0/g, ' ');
      blocks.push({ type: 'text', content: cleaned });
    }
  }
  return blocks;
}

let inserted = 0;
let failed = 0;

for (let idx = 0; idx < newsData.length; idx++) {
  const article = newsData[idx];
  
  try {
    const blocks = blocksToJson(article.content);
    const coverUrl = imageMap[article.slug] || null;
    const dateStr = article.date ? new Date(article.date) : new Date();
    const tags = article.tags ? article.tags.slice(0, 5).join(', ') : null;
    
    await connection.execute(
      `INSERT INTO news (slug, title, excerpt, blocks, coverImageUrl, categoryId, date, externalLink, location, tags, featured, status, createdAt, updatedAt, publishedAt)
       VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, 'published', NOW(), NOW(), ?)`,
      [
        article.slug,
        article.title,
        article.excerpt,
        JSON.stringify(blocks),
        coverUrl,
        dateStr,
        article.link || null,
        article.location || null,
        tags,
        idx === 0 ? 1 : 0,
        dateStr
      ]
    );
    
    inserted++;
    console.log(`✓ ${inserted}/${newsData.length}: ${article.title}`);
  } catch (e) {
    failed++;
    console.error(`✗ Failed: ${article.title} - ${e.message}`);
  }
}

await connection.end();
console.log(`\n✅ Import complete: ${inserted} inserted, ${failed} failed`);
