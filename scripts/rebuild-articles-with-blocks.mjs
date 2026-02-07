import { readFileSync } from 'fs';
import { getDb } from '../server/db.ts';
import { articles, tags, categories, articleTags } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const INPUT_FILE = '/home/ubuntu/wordpress-articles-export/articles-with-s3-urls.json';

console.log('🚀 Starting article rebuild with proper blocks...\n');

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

// Convert HTML to blocks
function htmlToBlocks(html, inlineImages, featuredImage) {
  const blocks = [];
  
  // Add featured image as first block if exists
  if (featuredImage) {
    blocks.push({
      type: 'image',
      url: featuredImage.url,
      alt: featuredImage.alt || '',
      caption: featuredImage.caption || ''
    });
  }
  
  // Create image URL map
  const imageMap = new Map();
  inlineImages.forEach((img, index) => {
    imageMap.set(img.url, { ...img, index });
  });
  
  // Split HTML into sections
  const sections = html.split(/<\/?(?:p|h[1-6]|blockquote|ul|ol|li)[^>]*>/);
  
  // Extract images from HTML
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^">]*)"[^>]*>/g;
  let match;
  const foundImages = [];
  while ((match = imgRegex.exec(html)) !== null) {
    foundImages.push({
      url: match[1],
      alt: match[2] || ''
    });
  }
  
  // Add images as blocks
  foundImages.forEach(img => {
    const s3Image = inlineImages.find(i => i.url === img.url || img.url.includes(i.url.split('/').pop()));
    if (s3Image) {
      blocks.push({
        type: 'image',
        url: s3Image.url,
        alt: decodeHTMLEntities(img.alt),
        caption: ''
      });
    }
  });
  
  // Strip all HTML tags and create text block
  const cleanText = html
    .replace(/<img[^>]*>/g, '') // Remove images
    .replace(/<\/?[^>]+(>|$)/g, '') // Remove all HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  if (cleanText) {
    blocks.push({
      type: 'text',
      content: decodeHTMLEntities(cleanText)
    });
  }
  
  return blocks;
}

// Get or create category
async function getOrCreateCategory(name) {
  const existing = await db.query.categories.findFirst({
    where: eq(categories.name, name)
  });
  
  if (existing) return existing.id;
  
  const result = await db.insert(categories).values({ name });
  return result.insertId;
}

// Get or create tag
async function getOrCreateTag(name) {
  const existing = await db.query.tags.findFirst({
    where: eq(tags.name, name)
  });
  
  if (existing) return existing.id;
  
  const result = await db.insert(tags).values({ name });
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
    
    // Convert to blocks
    const blocks = htmlToBlocks(article.content, article.inlineImages, article.featuredImage);
    
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
      console.log(`  ✅ Added ${article.tags.length} tags`);
    }
    
    console.log(`  ✅ Blocks: ${blocks.length} | Cover: ${article.featuredImage ? 'Yes' : 'No'} | Inline: ${article.inlineImages.length}\n`);
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
