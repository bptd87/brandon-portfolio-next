import { db } from './server/db.js';
import { articles } from './drizzle/schema.js';

const all = await db.select({ slug: articles.slug, title: articles.title }).from(articles).orderBy(articles.publishedAt);
console.log('Total articles:', all.length);
all.forEach((a, i) => console.log(`${i+1}. ${a.slug}`));
