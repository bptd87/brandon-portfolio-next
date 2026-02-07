import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';

const db = await getDb();
const list = await db.select().from(articles);

console.log(`Checking ${list.length} articles for FAQ content...`);

const withFAQ = list.filter(a => {
  try {
    const content = JSON.parse(a.content);
    const hasFAQ = content.some(b => 
      b.type === 'faq' || 
      b.type === 'accordion' ||
      (b.text && b.text.toLowerCase().includes('faq')) ||
      (b.content && typeof b.content === 'string' && b.content.toLowerCase().includes('frequently asked'))
    );
    return hasFAQ;
  } catch (e) {
    return false;
  }
});

console.log(`\nFound ${withFAQ.length} articles with FAQ content:`);
withFAQ.forEach(a => console.log(`- ${a.title}`));

if (withFAQ.length > 0) {
  console.log('\nFirst FAQ article content sample:');
  const firstFAQ = JSON.parse(withFAQ[0].content);
  const faqBlocks = firstFAQ.filter(b => 
    b.type === 'faq' || 
    b.type === 'accordion' ||
    (b.text && b.text.toLowerCase().includes('faq'))
  );
  console.log(JSON.stringify(faqBlocks, null, 2));
}
