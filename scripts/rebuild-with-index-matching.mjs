import { readFileSync } from 'fs';
import { getDb } from '../server/db.ts';
import { articles, articleTags } from '../drizzle/schema.ts';
import { JSDOM } from 'jsdom';

const S3_FILE = '/home/ubuntu/wordpress-articles-export/articles-with-s3-urls.json';

console.log('🚀 Rebuilding articles with index-based image matching...\n');

const db = await getDb();
const articlesData = JSON.parse(readFileSync(S3_FILE, 'utf8'));

// HTML entity decoder
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

// Convert HTML to blocks with index-based image matching
function htmlToBlocks(html, s3Images) {
  const blocks = [];
  const dom = new JSDOM(html);
  const body = dom.window.document.body;
  
  let imageIndex = 0; // Track which image we're on
  
  function processNode(node) {
    if (node.nodeType === 3 && !node.textContent.trim()) return;
    
    if (node.nodeType === 3) {
      const text = node.textContent.trim();
      if (text) {
        blocks.push({ type: 'text', content: decodeHTMLEntities(text) });
      }
      return;
    }
    
    if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase();
      
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
      
      // Images - match by index order
      if (tag === 'img') {
        if (imageIndex < s3Images.length) {
          const s3Image = s3Images[imageIndex];
          blocks.push({
            type: 'image',
            url: s3Image.url,
            alt: decodeHTMLEntities(s3Image.alt || node.getAttribute('alt') || ''),
            caption: ''
          });
        }
        imageIndex++;
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
      
      // Containers - check for images first, then process text
      if (['p', 'div', 'section', 'article'].includes(tag)) {
        // Check if this container has images
        const hasImages = node.querySelector('img');
        if (hasImages) {
          // Process each child individually to preserve order
          node.childNodes.forEach(child => processNode(child));
        } else {
          // No images, just extract text
          const text = node.textContent.trim();
          if (text && text.length > 20) {
            blocks.push({ type: 'text', content: decodeHTMLEntities(text) });
          }
        }
        return;
      }
      
      // Other elements with substantial text
      const text = node.textContent.trim();
      if (text && text.length > 20) {
        blocks.push({ type: 'text', content: decodeHTMLEntities(text) });
      }
    }
  }
  
  body.childNodes.forEach(node => processNode(node));
  return blocks;
}

// Clear and rebuild
console.log('🗑️  Clearing existing articles...');
await db.delete(articleTags);
await db.delete(articles);
console.log('✅ Cleared\n');

let successCount = 0;

for (const article of articlesData) {
  try {
    console.log(`📝 ${article.title}`);
    
    const contentBlocks = htmlToBlocks(article.content, article.inlineImages || []);
    const imageCount = contentBlocks.filter(b => b.type === 'image').length;
    
    console.log(`   → ${contentBlocks.length} blocks, ${imageCount} images`);
    
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
    console.error(`   ❌ ${error.message}`);
  }
}

console.log(`\n✅ Rebuilt ${successCount} articles!`);
