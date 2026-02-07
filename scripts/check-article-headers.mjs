import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';

const db = await getDb();
const articleList = await db.select().from(articles).limit(1);
const article = articleList[0];

console.log('Title:', article.title);
const blocks = JSON.parse(article.content);
console.log('\nFirst 10 blocks:');
blocks.slice(0, 10).forEach((block, i) => {
  console.log(`${i}. Type: ${block.type}, Text: ${block.text?.substring(0, 80) || 'N/A'}, Content: ${block.content?.substring(0, 80) || 'N/A'}`);
});

// Find heading blocks
const headings = blocks.filter(b => b.type === 'heading');
console.log(`\nFound ${headings.length} heading blocks:`);
headings.forEach((h, i) => {
  console.log(`${i}. Level ${h.level}: ${h.text || h.content || 'UNDEFINED'}`);
});
