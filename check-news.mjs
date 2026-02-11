import { db } from './server/db.ts';
import { news } from './drizzle/schema.ts';

const newsItems = await db.select().from(news);
console.log(`Total news items: ${newsItems.length}`);
console.log('Sample:', newsItems.slice(0, 3).map(n => ({ title: n.title, slug: n.slug })));
