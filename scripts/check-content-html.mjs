import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = await getDb();
const article = await db.select().from(articles).where(eq(articles.slug, 'framing-the-martyr-scenic-design-as-memory-work-in-romero')).limit(1);

if (article[0]) {
  const content = JSON.parse(article[0].content);
  console.log('Content blocks:', content.length);
  console.log('First block type:', content[0].type);
  console.log('First 1000 chars of content:', content[0].content.substring(0, 1000));
}
