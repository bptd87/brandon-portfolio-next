import { readFileSync, writeFileSync } from 'fs';
import { getDb } from '../server/db.ts';
import { articles, tags, categories, articleTags } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import { JSDOM } from 'jsdom';

const ORIGINAL_FILE = '/home/ubuntu/wordpress-articles-export/articles-full-export.json';
const S3_FILE = '/home/ubuntu/wordpress-articles-export/articles-with-s3-urls.json';

console.log('🚀 Rebuilding articles with proper image mapping...\n');

const db = await getDb();
if (!db) {
  console.error('❌ Database not available');
  process.exit(1);
}

// Load both files
const originalArticles = JSON.parse(readFileSync(ORIGINAL_FILE, 'utf8'));
const s3Articles = JSON.parse(readFileSync(S3_FILE, 'utf8'));

// Create merged articles with originalUrl mapping
const mergedArticles = s3Articles.map(s3Article => {
  const original = originalArticles.find(o => o.slug === s3Article.slug);
  
  if (!original) return s3Article;
  
  // Merge inline images with originalUrl
  const mergedInlineImages = s3Article.inlineImages.map((s3Img, index) => {
    const originalImg = original.inlineImages[index];
    return {
      ...s3Img,
      originalUrl: originalImg?.url || null
    };
  });
  
  return {
    ...s3Article,
    inlineImages: mergedInlineImages
  };
});

console.log(`✅ Merged ${mergedArticles.length} articles with original URLs\n`);

// HTML entity decoder
function decodeHTMLEntities(text) {
  const entities = {
    '&#8217;': "'",
    '&#8216;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replaceAll(entity, char);
  }
  return decoded;
}

// Convert HTML to properly structured blocks with images
function htmlToBlocks(html, inlineImages) {
  const blocks = [];
  
  // Create comprehensive image URL map
  const imageMap = new Map();
  inlineImages.forEach((img, index) => {
    if (img.url) {
      // Map by S3 URL
      imageMap.set(img.url, { url: img.url, alt: img.alt || '' });
      
      // Map by original URL
      if (img.originalUrl) {
        imageMap.set(img.originalUrl, { url: img.url, alt: img.alt || '' });
        
        // Also map by filename from original URL
        const filename = img.originalUrl.split('/').pop().split('?')[0];
        imageMap.set(filename, { url: img.url, alt: img.alt || '' });
      }
      
      // Map by index for sequential fallback
      imageMap.set(`index-${index}`, { url: img.url, alt: img.alt || '' });
    }
  });
  
  // Parse HTML with JSDOM
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const body = document.body;
  
  let imageIndex = 0; // Track image order for fallback matching
  
  // Process each child node in order
  function processNode(node) {
    // Skip empty text nodes
    if (node.nodeType === 3 && !node.textContent.trim()) {
      return;
    }
    
    // Text node
    if (node.nodeType === 3) {
      const text = node.textContent.trim();
      if (text) {
        blocks.push({
          type: 'text',
          content: decodeHTMLEntities(text)
        });
      }
      return;
    }
    
    // Element node
    if (node.nodeType === 1) {
      const tagName = node.tagName.toLowerCase();
      
      // Headings
      if (tagName.match(/^h[1-6]$/)) {
        const level = parseInt(tagName[1]);
        const text = node.textContent.trim();
        if (text) {
          blocks.push({
            type: 'heading',
            level: level,
            text: decodeHTMLEntities(text)
          });
        }
        return;
      }
      
      // Images
      if (tagName === 'img') {
        const src = node.getAttribute('src');
        const alt = node.getAttribute('alt') || '';
        
        let imageData = null;
        
        // Try matching by original URL
        if (src && imageMap.has(src)) {
          imageData = imageMap.get(src);
        }
        
        // Try matching by filename
        if (!imageData && src) {
          const filename = src.split('/').pop().split('?')[0];
          if (imageMap.has(filename)) {
            imageData = imageMap.get(filename);
          }
        }
        
        // Fallback to sequential index
        if (!imageData && imageMap.has(`index-${imageIndex}`)) {
          imageData = imageMap.get(`index-${imageIndex}`);
        }
        
        imageIndex++;
        
        // Only add image block if we found a valid S3 URL
        if (imageData && imageData.url) {
          blocks.push({
            type: 'image',
            url: imageData.url,
            alt: decodeHTMLEntities(imageData.alt || alt),
            caption: ''
          });
        }
        return;
      }
      
      // Blockquotes
      if (tagName === 'blockquote') {
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
      if (tagName === 'ul' || tagName === 'ol') {
        const items = [];
        const listItems = node.querySelectorAll('li');
        listItems.forEach(li => {
          const text = li.textContent.trim();
          if (text) {
            items.push(decodeHTMLEntities(text));
          }
        });
        
        if (items.length > 0) {
          blocks.push({
            type: 'list',
            listType: tagName === 'ul' ? 'bullet' : 'numbered',
            items: items
          });
        }
        return;
      }
      
      // Paragraphs and other containers - process children
      if (tagName === 'p' || tagName === 'div' || tagName === 'section' || tagName === 'article') {
        // Process children nodes
        node.childNodes.forEach(child => processNode(child));
        return;
      }
      
      // For other elements, try to extract text
      const text = node.textContent.trim();
      if (text && text.length > 20) { // Only add substantial text
        blocks.push({
          type: 'text',
          content: decodeHTMLEntities(text)
        });
      }
    }
  }
  
  // Process all body children
  body.childNodes.forEach(node => processNode(node));
  
  return blocks;
}

// Clear existing articles
console.log('🗑️  Clearing existing articles...');
await db.delete(articleTags);
await db.delete(articles);
console.log('✅ Cleared\n');

// Rebuild articles
let successCount = 0;
let errorCount = 0;

for (const article of mergedArticles) {
  try {
    console.log(`📝 Processing: ${article.title}`);
    
    // Convert HTML to blocks
    const contentBlocks = htmlToBlocks(article.content, article.inlineImages);
    
    const imageCount = contentBlocks.filter(b => b.type === 'image').length;
    console.log(`   → ${contentBlocks.length} blocks (${imageCount} images)`);
    
    // Insert article
    const result = await db.insert(articles).values({
      title: article.title,
      slug: article.slug,
      content: JSON.stringify(contentBlocks),
      excerpt: article.excerpt || '',
      coverImage: article.coverImage || null,
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
      status: 'published',
      categoryId: null, // Will set after categories are created
      seoTitle: article.seo?.title || article.title,
      seoDescription: article.seo?.description || article.excerpt || '',
      seoKeywords: article.seo?.keywords || ''
    });
    
    successCount++;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    errorCount++;
  }
}

console.log(`\n✅ Rebuild complete!`);
console.log(`   Success: ${successCount}`);
console.log(`   Errors: ${errorCount}`);
