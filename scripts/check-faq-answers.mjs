import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';
import { like } from 'drizzle-orm';

const db = await getDb();
const list = await db.select().from(articles);
const article = list.find(a => a.title.includes('Modern Theatrical Design Portfolio'));

if (article) {
  const content = JSON.parse(article.content);
  const faqBlock = content.find(b => b.type === 'faq');
  
  if (faqBlock) {
    console.log('FAQ block found with', faqBlock.items?.length, 'items');
    console.log(JSON.stringify(faqBlock, null, 2));
  } else {
    console.log('No FAQ block. Checking raw structure...');
    const faqHeading = content.findIndex(b => 
      b.type === 'heading' && 
      (b.text || '').toLowerCase().includes('frequently asked')
    );
    console.log(`FAQ heading at index ${faqHeading}`);
    if (faqHeading >= 0) {
      content.slice(faqHeading, Math.min(faqHeading + 15, content.length)).forEach((b, i) => {
        console.log(`Block ${faqHeading + i}: type=${b.type}, text/content=${(b.text || b.content || '').substring(0, 80)}`);
      });
    }
  }
}
