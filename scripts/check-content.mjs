import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';

const db = await getDb();
const result = await db.select().from(articles).limit(1);

console.log('=== Article Content Check ===\n');
console.log('Title:', result[0]?.title);
console.log('Content type:', typeof result[0]?.content);
console.log('Content length:', result[0]?.content?.length);
console.log('\nContent preview (first 500 chars):');
console.log(result[0]?.content?.substring(0, 500));
console.log('\n\nParsed as JSON:');
try {
  const parsed = JSON.parse(result[0]?.content);
  console.log('Parsed successfully!');
  console.log('Type:', Array.isArray(parsed) ? 'Array' : typeof parsed);
  console.log('Length:', parsed.length);
  console.log('First item:', JSON.stringify(parsed[0], null, 2));
} catch (e) {
  console.log('Failed to parse as JSON:', e.message);
}
