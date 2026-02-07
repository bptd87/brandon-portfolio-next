import { readFileSync } from 'fs';
import { getDb } from '../server/db.ts';
import { articles, articleTags } from '../drizzle/schema.ts';
import { JSDOM } from 'jsdom';

const S3_FILE = '/home/ubuntu/wordpress-articles-export/articles-with-s3-urls.json';

console.log('🚀 Rebuilding articles (simplified approach)...\n');

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

function htmlToBlocks(html, s3Images) {
  const blocks = [];
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  
  // Replace each img with a unique placeholder
  const imgTags = Array.from(doc.querySelectorAll('img'));
  imgTags.forEach((img, index) => {
    const placeholder = doc.createElement('div');
    placeholder.setAttribute('data-image-placeholder', index.toString());
    img.replaceWith(placeholder);
  });
  
  // Now process the modified HTML
  const body = doc.body;
  
  body.childNodes.forEach(node => {
    if (node.nodeType === 1) { // Element
      const tag = node.tagName.toLowerCase();
      
      // Check for image placeholder
      if (tag === 'div' && node.hasAttribute('data-image-placeholder')) {
        const index = parseInt(node.getAttribute('data-image-placeholder'));
        if (index < s3Images.length) {
          blocks.push({
            type: 'image',
            url: s3Images[index].url,
            alt: decodeHTMLEntities(s3Images[index].alt || ''),
            caption: ''
          });
        }
        return;
      }
      
      // Headings
      if (tag.match(/^h[1-6]$/)) {
        const text = node.textContent.trim();
        if (text) {
          blocks.push({
            type: 'heading',
            level: parseInt(tag[1]),
            text: decodeHTMLEntities(text)
          });
        }
        return;
      }
      
      // Blockquotes
      if (tag === 'blockquote') {
        const text = node.textContent.trim();
        if (text) {
          blocks.push({
            type: 'quote',
            text: decodeHTMLEntities(text),
            author: ''
          });
        }
        return;
      }
      
      // Lists
      if (tag === 'ul' || tag === 'ol') {
        const items = [];
        node.querySelectorAll('li').forEach(li => {
          const text = li.textContent.trim();
          if (text) items.push(decodeHTMLEntities(text));
        });
        if (items.length > 0) {
          blocks.push({
            type: 'list',
            listType: tag === 'ul' ? 'bullet' : 'numbered',
            items
          });
        }
        return;
      }
      
      // Paragraphs and other text containers
      const text = node.textContent.trim();
      if (text && text.length > 10) {
        blocks.push({
          type: 'text',
          content: decodeHTMLEntities(text)
        });
      }
    }
  });
  
  return blocks;
}

console.log('🗑️  Clearing...');
await db.delete(articleTags);
await db.delete(articles);

let successCount = 0;

for (const article of articlesData) {
  try {
    const contentBlocks = htmlToBlocks(article.content, article.inlineImages || []);
    const imageCount = contentBlocks.filter(b => b.type === 'image').length;
    
    console.log(`📝 ${article.title.substring(0, 50)}... → ${imageCount} imgs`);
    
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
