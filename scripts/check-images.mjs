import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';

const db = await getDb();
const list = await db.select().from(articles);
const article = list.find(a => a.slug === 'video-game-environments-lessons-for-scenic-design');

if (article) {
  const content = JSON.parse(article.content);
  const images = content.filter(b => b.type === 'image');
  const galleries = content.filter(b => b.type === 'gallery');
  
  console.log(`Found ${images.length} image blocks and ${galleries.length} gallery blocks`);
  
  if (images.length > 0) {
    console.log('\nFirst image block:');
    console.log(JSON.stringify(images[0], null, 2));
  }
  
  if (galleries.length > 0) {
    console.log('\nFirst gallery block:');
    console.log(JSON.stringify(galleries[0], null, 2).substring(0, 500));
  }
}
