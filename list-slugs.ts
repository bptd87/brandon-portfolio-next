import { getDb } from './server/db';
import { news } from './drizzle/schema';
import { like } from 'drizzle-orm';

const db = await getDb();

if (!db) {
  console.error('❌ Failed to connect to database');
  process.exit(1);
}

// Find slugs containing key terms
const keywords = ['scr', 'buderwitz', 'okoboji', 'utah'];

for (const keyword of keywords) {
  const results = await db.select().from(news).where(like(news.slug, `%${keyword}%`));
  console.log(`\n🔍 Slugs containing "${keyword}":`);
  results.forEach(r => console.log(`  - ${r.slug}`));
}

process.exit(0);
