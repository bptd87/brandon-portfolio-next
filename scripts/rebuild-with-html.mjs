import { readFileSync } from 'fs';
import { getDb } from '../server/db.ts';
import { articles, articleTags } from '../drizzle/schema.ts';
import { JSDOM } from 'jsdom';

const S3_FILE = '/home/ubuntu/wordpress-articles-export/articles-with-s3-urls.json';

console.log('🚀 Rebuilding articles with HTML content...\n');

const db = await getDb();
const articlesData = JSON.parse(readFileSync(S3_FILE, 'utf8'));

function decodeHTMLEntities(text) {
  const entities = {
    '&#8217;': "'", '&#8216;': "'", '&#8220;': '"', '&#8221;': '"',
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'"
  };
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replaceAll(entity, char);
  }
  return decoded;
}

function htmlToBlocks(html) {
  const blocks = [];
  
  // Just create a single text block with the HTML content
  // The frontend will render it with dangerouslySetInnerHTML
  blocks.push({
    type: 'text',
    content: decodeHTMLEntities(html)
  });
  
  return blocks;
}

console.log('🗑️  Clearing...');
await db.delete(articleTags);
await db.delete(articles);

let successCount = 0;

for (const article of articlesData) {
  try {
    const contentBlocks = htmlToBlocks(article.content);
    
    console.log(`📝 ${article.title.substring(0, 60)}`);
    
    await db.insert(articles).values({
      title: article.title,
      slug: article.slug,
      content: JSON.stringify(contentBlocks),
      excerpt: article.excerpt || '',
      coverImage: article.coverImage || null,
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
      status: 'published',
      categoryId: null,
      seoTitle: article.seo?.title || article.title,
      seoDescription: article.seo?.description || article.excerpt || '',
      seoKeywords: article.seo?.keywords || ''
    });
    
    successCount++;
  } catch (error) {
    console.error(`❌ ${error.message}`);
  }
}

console.log(`\n✅ Done! ${successCount} articles`);
