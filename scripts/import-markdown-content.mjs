#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getDb } from '../server/db.ts';
import { articles, tags, categories, articleTags, articleCategories } from '../drizzle/schema.ts';
import { eq, and } from 'drizzle-orm';

const execAsync = promisify(exec);

const CONTENT_DIR = '/home/ubuntu/brandon-portfolio-v2/content';
const UPDATE_MODE = process.argv.includes('--update');

console.log('🚀 Starting markdown content import...\n');
if (UPDATE_MODE) console.log('📝 Update mode enabled\n');

const db = getDb();

// Parse frontmatter and content
function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Invalid frontmatter format');
  
  const frontmatter = {};
  const yamlLines = match[1].split('\n');
  let currentKey = null;
  let currentArray = null;
  
  for (const line of yamlLines) {
    if (line.match(/^(\w+):\s*$/)) {
      // Array start
      currentKey = line.match(/^(\w+):/)[1];
      currentArray = [];
      frontmatter[currentKey] = currentArray;
    } else if (line.match(/^\s+-\s+(.+)$/)) {
      // Array item
      if (currentArray) {
        currentArray.push(line.match(/^\s+-\s+(.+)$/)[1].trim());
      }
    } else if (line.match(/^(\w+):\s*(.+)$/)) {
      // Key-value pair
      const [, key, value] = line.match(/^(\w+):\s*(.+)$/);
      frontmatter[key] = value.replace(/^["']|["']$/g, '');
      currentArray = null;
    } else if (line.match(/^\s+(\w+):\s*(.+)$/)) {
      // Nested key-value (for SEO)
      const [, key, value] = line.match(/^\s+(\w+):\s*(.+)$/);
      if (!frontmatter.seo) frontmatter.seo = {};
      frontmatter.seo[key] = value.replace(/^["']|["']$/g, '');
    }
  }
  
  return {
    frontmatter,
    content: match[2].trim()
  };
}

// Upload image to S3
async function uploadImage(imagePath) {
  try {
    const { stdout } = await execAsync(`manus-upload-file "${imagePath}"`);
    const match = stdout.match(/CDN URL: (https:\/\/[^\s]+)/);
    if (match && match[1]) {
      return match[1];
    }
    throw new Error('Could not parse CDN URL');
  } catch (error) {
    console.error(`  ⚠️  Failed to upload ${imagePath}:`, error.message);
    return null;
  }
}

// Convert markdown to blocks
async function markdownToBlocks(content, articleDir) {
  const blocks = [];
  const lines = content.split('\n');
  let currentBlock = null;
  let inGallery = false;
  let galleryImages = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Gallery markers
    if (line.trim() === '<!-- gallery -->') {
      inGallery = true;
      continue;
    }
    if (line.trim() === '<!-- /gallery -->') {
      if (galleryImages.length > 0) {
        blocks.push({
          type: 'gallery',
          images: galleryImages
        });
        galleryImages = [];
      }
      inGallery = false;
      continue;
    }
    
    // Images
    const imgMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      const [, alt, src] = imgMatch;
      const imagePath = src.startsWith('./') 
        ? join(articleDir, src)
        : src;
      
      let imageUrl = src;
      if (existsSync(imagePath)) {
        console.log(`  📤 Uploading image: ${basename(imagePath)}`);
        const s3Url = await uploadImage(imagePath);
        if (s3Url) imageUrl = s3Url;
      }
      
      // Check next line for caption
      let caption = '';
      if (i + 1 < lines.length && lines[i + 1].match(/^\*(.+)\*$/)) {
        caption = lines[i + 1].match(/^\*(.+)\*$/)[1].trim();
        i++; // Skip caption line
      }
      
      if (inGallery) {
        galleryImages.push({ url: imageUrl, alt, caption });
      } else {
        blocks.push({
          type: 'image',
          url: imageUrl,
          alt,
          caption
        });
      }
      continue;
    }
    
    // Headings
    const headingMatch = line.match(/^(#{2,6})\s+(.+)$/);
    if (headingMatch) {
      const [, hashes, text] = headingMatch;
      blocks.push({
        type: 'heading',
        level: hashes.length,
        text: text.trim()
      });
      continue;
    }
    
    // Blockquotes
    if (line.startsWith('> ')) {
      const quoteText = line.substring(2);
      if (currentBlock && currentBlock.type === 'quote') {
        currentBlock.text += '\n' + quoteText;
      } else {
        currentBlock = {
          type: 'quote',
          text: quoteText
        };
        blocks.push(currentBlock);
      }
      continue;
    }
    
    // Lists
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (bulletMatch || numberedMatch) {
      const item = (bulletMatch || numberedMatch)[1];
      const listType = bulletMatch ? 'bullet' : 'numbered';
      
      if (currentBlock && currentBlock.type === 'list' && currentBlock.listType === listType) {
        currentBlock.items.push(item);
      } else {
        currentBlock = {
          type: 'list',
          listType,
          items: [item]
        };
        blocks.push(currentBlock);
      }
      continue;
    }
    
    // Regular text
    if (line.trim()) {
      if (currentBlock && currentBlock.type === 'text') {
        currentBlock.content += '\n' + line;
      } else {
        currentBlock = {
          type: 'text',
          content: line
        };
        blocks.push(currentBlock);
      }
    } else {
      currentBlock = null;
    }
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

// Process article directory
async function processArticle(articlePath, type = 'article') {
  const indexPath = join(articlePath, 'index.md');
  if (!existsSync(indexPath)) {
    console.log(`  ⚠️  No index.md found, skipping`);
    return;
  }
  
  const fileContent = readFileSync(indexPath, 'utf8');
  const { frontmatter, content } = parseFrontmatter(fileContent);
  
  console.log(`📝 Processing: ${frontmatter.title}`);
  
  // Upload cover image if exists
  let coverImageUrl = null;
  if (frontmatter.coverImage) {
    const coverPath = join(articlePath, frontmatter.coverImage);
    if (existsSync(coverPath)) {
      console.log(`  📤 Uploading cover image...`);
      coverImageUrl = await uploadImage(coverPath);
    }
  }
  
  // Convert content to blocks
  console.log(`  🔄 Converting markdown to blocks...`);
  const blocks = await markdownToBlocks(content, articlePath);
  
  // Check if article exists
  const existing = await db.query.articles.findFirst({
    where: eq(articles.slug, frontmatter.slug)
  });
  
  if (existing && !UPDATE_MODE) {
    console.log(`  ⏭️  Article already exists, skipping (use --update to update)`);
    return;
  }
  
  // Prepare article data
  const articleData = {
    title: frontmatter.title,
    slug: frontmatter.slug,
    excerpt: frontmatter.excerpt || '',
    content: JSON.stringify(blocks),
    coverImage: coverImageUrl,
    publishedAt: frontmatter.publishedAt ? new Date(frontmatter.publishedAt) : new Date(),
    seoTitle: frontmatter.seo?.title || frontmatter.title,
    seoDescription: frontmatter.seo?.description || frontmatter.excerpt || '',
    status: 'published'
  };
  
  let articleId;
  
  if (existing) {
    // Update existing
    await db.update(articles)
      .set(articleData)
      .where(eq(articles.id, existing.id));
    articleId = existing.id;
    console.log(`  ✅ Updated article`);
  } else {
    // Insert new
    const result = await db.insert(articles).values(articleData);
    articleId = result.insertId;
    console.log(`  ✅ Created article`);
  }
  
  // Handle categories
  if (frontmatter.categories && frontmatter.categories.length > 0) {
    // Remove existing category relationships
    await db.delete(articleCategories).where(eq(articleCategories.articleId, articleId));
    
    for (const catName of frontmatter.categories) {
      const catId = await getOrCreateCategory(catName);
      await db.insert(articleCategories).values({
        articleId,
        categoryId: catId
      });
    }
    console.log(`  ✅ Added ${frontmatter.categories.length} categories`);
  }
  
  // Handle tags
  if (frontmatter.tags && frontmatter.tags.length > 0) {
    // Remove existing tag relationships
    await db.delete(articleTags).where(eq(articleTags.articleId, articleId));
    
    for (const tagName of frontmatter.tags) {
      const tagId = await getOrCreateTag(tagName);
      await db.insert(articleTags).values({
        articleId,
        tagId
      });
    }
    console.log(`  ✅ Added ${frontmatter.tags.length} tags`);
  }
  
  console.log('');
}

// Scan content directories
const articlesDir = join(CONTENT_DIR, 'articles');
const newsDir = join(CONTENT_DIR, 'news');

if (existsSync(articlesDir)) {
  const articleDirs = readdirSync(articlesDir)
    .map(name => join(articlesDir, name))
    .filter(path => statSync(path).isDirectory());
  
  console.log(`Found ${articleDirs.length} article(s) to process\n`);
  
  for (const articlePath of articleDirs) {
    try {
      await processArticle(articlePath, 'article');
    } catch (error) {
      console.error(`❌ Error processing ${basename(articlePath)}:`, error.message);
    }
  }
}

if (existsSync(newsDir)) {
  const newsDirs = readdirSync(newsDir)
    .map(name => join(newsDir, name))
    .filter(path => statSync(path).isDirectory());
  
  console.log(`Found ${newsDirs.length} news item(s) to process\n`);
  
  for (const newsPath of newsDirs) {
    try {
      await processArticle(newsPath, 'news');
    } catch (error) {
      console.error(`❌ Error processing ${basename(newsPath)}:`, error.message);
    }
  }
}

console.log('✅ Import complete!');
process.exit(0);
