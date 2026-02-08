import { getDb } from './server/db';
import { news } from './drizzle/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();

if (!db) {
  console.error('❌ Failed to connect to database');
  process.exit(1);
}

const slugs = [
  'making-my-scr-debut-million-dollar-quartet-2025',
  'assisting-tom-buderwitz-the-play-that-goes-wrong',
  '40-productions-at-okoboji-summer-theatre',
  'fifth-season-assisting-jo-winiarski-utah-shakespeare'
];

for (const slug of slugs) {
  const result = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
  const article = result[0];
  
  if (article) {
    console.log(`\n📰 ${article.title}`);
    console.log(`Slug: ${article.slug}`);
    console.log(`Blocks type: ${typeof article.blocks}`);
    console.log(`Blocks value: ${JSON.stringify(article.blocks, null, 2).substring(0, 200)}...`);
  } else {
    console.log(`\n❌ Article not found: ${slug}`);
  }
}

process.exit(0);
