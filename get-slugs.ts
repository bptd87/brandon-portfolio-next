import { getDb } from './server/db';
import { news } from './drizzle/schema';
import { or, like } from 'drizzle-orm';

const db = await getDb();
if (!db) {
  console.error('Failed to connect');
  process.exit(1);
}

const results = await db.select({
  id: news.id,
  title: news.title,
  slug: news.slug,
  hasBlocks: news.blocks
}).from(news).where(
  or(
    like(news.title, '%SCR%'),
    like(news.title, '%Buderwitz%'),
    like(news.title, '%40 Productions%'),
    like(news.title, '%Utah Shakespeare%')
  )
);

console.log(JSON.stringify(results, null, 2));
process.exit(0);
