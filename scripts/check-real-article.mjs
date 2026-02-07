import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';
import { like } from 'drizzle-orm';

const db = await getDb();
const list = await db.select().from(articles).where(like(articles.title, '%Wasting%')).limit(1);
const article = list[0];

console.log('Title:', article.title);
const blocks = JSON.parse(article.content);

const headings = blocks.filter(b => b.type === 'heading');
console.log(`\nFound ${headings.length} heading blocks:`);
headings.forEach((h, i) => {
  console.log(`${i}. Level ${h.level}:`);
  console.log(`   text field: "${h.text || 'UNDEFINED'}"`);
  console.log(`   content field: "${h.content || 'UNDEFINED'}"`);
  console.log(`   All fields:`, Object.keys(h));
});
