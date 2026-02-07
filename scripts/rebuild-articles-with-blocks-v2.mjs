import { readFileSync } from 'fs';
import { getDb } from '../server/db.ts';
import { articles, tags, categories, articleTags } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import { JSDOM } from 'jsdom';

const INPUT_FILE = '/home/ubuntu/wordpress-articles-export/articles-with-s3-urls.json';

console.log('🚀 Starting article rebuild with proper HTML parsing...\n');

const db = await getDb();
if (!db) {
  console.error('❌ Database not available');
  process.exit(1);
}

const articlesData = JSON.parse(readFileSync(INPUT_FILE, 'utf8'));

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

// Convert HTML to properly structured blocks
function htmlToBlocks(html, inlineImages) {
  const blocks = [];
  
  // Create image URL map for quick lookup
  const imageMap = new Map();
  inlineImages.forEach((img, index) => {
    // Map by index for sequential matching
    imageMap.set(`img-${index}`, img.url);
    // Map by S3 URL
    if (img.url) {
      imageMap.set(img.url, img.url);
    }
    // Map by original URL if it exists
    if (img.originalUrl) {
      const wpFilename = img.originalUrl.split('/').pop().split('?')[0];
      imageMap.set(wpFilename, img.url);
      imageMap.set(img.originalUrl, img.url);
    }
  });
  
  // Parse HTML with JSDOM
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const body = document.body;
  
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
        
        // Find S3 URL for this image
        let s3Url = src || '';
        if (src) {
          const filename = src.split('/').pop().split('?')[0];
          if (imageMap.has(filename)) {
            s3Url = imageMap.get(filename);
          } else if (imageMap.has(src)) {
            s3Url = imageMap.get(src);
          }
        }
        
        // Skip if no valid URL
        if (!s3Url) return;
        
        blocks.push({
          type: 'image',
          url: s3Url,
          alt: decodeHTMLEntities(alt),
          caption: ''
        });
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
      
      // Paragraphs
      if (tagName === 'p') {
        // Check if paragraph contains an image
        const img = node.querySelector('img');
        if (img) {
          // Process image first
          processNode(img);
          // Then process any remaining text
          const textContent = node.textContent.trim();
          if (textContent) {
            blocks.push({
              type: 'text',
              content: decodeHTMLEntities(textContent)
            });
          }
        } else {
          const text = node.textContent.trim();
          if (text) {
            blocks.push({
              type: 'text',
              content: decodeHTMLEntities(text)
            });
          }
        }
        return;
      }
      
      // Divs and other containers - process children
      if (tagName === 'div' || tagName === 'section' || tagName === 'article') {
        node.childNodes.forEach(child => processNode(child));
        return;
      }
      
      // For other elements, just extract text
      const text = node.textContent.trim();
      if (text) {
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

// Get or create category
async function getOrCreateCategory(name) {
  const existing = await db.query.categories.findFirst({
    where: eq(categories.name, name)
  });
  
  if (existing) return existing.id;
  
  const result = await db.insert(categories).values({ 
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    type: 'article'
  });
  return result.insertId;
}

// Get or create tag
async function getOrCreateTag(name) {
  const existing = await db.query.tags.findFirst({
    where: eq(tags.name, name)
  });
  
  if (existing) return existing.id;
  
  const result = await db.insert(tags).values({ 
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  });
  return result.insertId;
}

// Clear existing articles
console.log('🗑️  Clearing existing articles...');
await db.delete(articleTags);
await db.delete(articles);
console.log('✅ Cleared\n');

// Rebuild articles
let successCount = 0;
let errorCount = 0;

for (const article of articlesData) {
  try {
    console.log(`📝 Rebuilding: ${article.title}`);
    
    // Convert to blocks with proper HTML parsing
    const blocks = htmlToBlocks(article.content, article.inlineImages);
    
    // Get first category ID if exists
    let categoryId = null;
    if (article.categories && article.categories.length > 0) {
      categoryId = await getOrCreateCategory(article.categories[0]);
    }
    
    // Insert article
    const result = await db.insert(articles).values({
      title: decodeHTMLEntities(article.title),
      slug: article.slug,
      excerpt: decodeHTMLEntities(article.excerpt),
      content: JSON.stringify(blocks),
      categoryId: categoryId,
      coverImageUrl: article.featuredImage?.url || null,
      publishedAt: new Date(article.publishedAt),
      seoTitle: decodeHTMLEntities(article.seo.title),
      seoDescription: decodeHTMLEntities(article.seo.description),
      status: 'published'
    });
    
    const articleId = result.insertId;
    
    // Category already set above
    if (categoryId) {
      console.log(`  ✅ Category: ${article.categories[0]}`);
    }
    
    // Add tags
    if (article.tags && article.tags.length > 0) {
      for (const tagName of article.tags) {
        const tagId = await getOrCreateTag(tagName);
        await db.insert(articleTags).values({
          articleId,
          tagId
        });
      }
      console.log(`  ✅ Tags: ${article.tags.length}`);
    }
    
    console.log(`  ✅ Blocks: ${blocks.length} | Cover: ${article.featuredImage ? 'Yes' : 'No'}\n`);
    successCount++;
    
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}\n`);
    errorCount++;
  }
}

console.log('\n✅ Rebuild complete!');
console.log(`📊 Success: ${successCount} articles`);
console.log(`⚠️  Errors: ${errorCount} articles`);

process.exit(0);
