import { getDb } from './server/db';
import { news } from './drizzle/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();
if (!db) {
  console.error('Failed to connect');
  process.exit(1);
}

const result = await db.select().from(news).where(eq(news.slug, 'making-my-scr-debut-million-dollar-quartet-2025')).limit(1);
const article = result[0];

if (article) {
  console.log('Title:', article.title);
  console.log('Slug:', article.slug);
  console.log('Blocks:', JSON.stringify(article.blocks, null, 2));
} else {
  console.log('Article not found!');
}

process.exit(0);
