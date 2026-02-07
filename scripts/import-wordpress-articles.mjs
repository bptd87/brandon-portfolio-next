import fetch from 'node-fetch';
import { getDb } from '../server/db.ts';
import { articles, categories, tags, articleTags } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

let db;

const WP_API_BASE = 'https://cms.brandonptdavis.com/wp-json/wp/v2';

// Helper to convert WordPress HTML content to block format
function convertHtmlToBlocks(htmlContent) {
  const blocks = [];
  
  if (!htmlContent) return blocks;
  
  // Simple parser - split by paragraphs and headings
  const tempDiv = htmlContent;
  
  // For now, create a single text block with the HTML content
  // This can be enhanced to parse HTML and create appropriate blocks
  blocks.push({
    id: Date.now().toString(),
    type: 'text',
    content: { text: htmlContent }
  });
  
  return blocks;
}

// Fetch all articles from WordPress
async function fetchWordPressArticles() {
  console.log('Fetching articles from WordPress...');
  
  try {
    const response = await fetch(`${WP_API_BASE}/articles?per_page=100`);
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }
    
    const articles = await response.json();
    console.log(`Found ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    throw error;
  }
}

// Fetch categories from WordPress
async function fetchWordPressCategories() {
  console.log('Fetching categories from WordPress...');
  
  try {
    const response = await fetch(`${WP_API_BASE}/article_catagory?per_page=100`);
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }
    
    const wpCategories = await response.json();
    console.log(`Found ${wpCategories.length} categories`);
    return wpCategories;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return [];
  }
}

// Fetch tags from WordPress
async function fetchWordPressTags() {
  console.log('Fetching tags from WordPress...');
  
  try {
    const response = await fetch(`${WP_API_BASE}/article_tags?per_page=100`);
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }
    
    const wpTags = await response.json();
    console.log(`Found ${wpTags.length} tags`);
    return wpTags;
  } catch (error) {
    console.error('Error fetching tags:', error.message);
    return [];
  }
}

// Import categories
async function importCategories(wpCategories) {
  console.log('\nImporting categories...');
  const categoryMap = new Map();
  
  for (const wpCat of wpCategories) {
    try {
      const [existing] = await db.select().from(categories).where(eq(categories.name, wpCat.name)).limit(1);
      
      if (existing) {
        categoryMap.set(wpCat.id, existing.id);
        console.log(`Category "${wpCat.name}" already exists`);
      } else {
        const result = await db.insert(categories).values({
          name: wpCat.name,
          slug: wpCat.slug,
          color: '#FF5722' // Default orange color
        });
        
        categoryMap.set(wpCat.id, Number(result.insertId));
        console.log(`Created category: ${wpCat.name}`);
      }
    } catch (error) {
      console.error(`Error importing category ${wpCat.name}:`, error.message);
    }
  }
  
  return categoryMap;
}

// Import tags
async function importTags(wpTags) {
  console.log('\nImporting tags...');
  const tagMap = new Map();
  
  for (const wpTag of wpTags) {
    try {
      const [existing] = await db.select().from(tags).where(eq(tags.name, wpTag.name)).limit(1);
      
      if (existing) {
        tagMap.set(wpTag.id, existing.id);
        console.log(`Tag "${wpTag.name}" already exists`);
      } else {
        const result = await db.insert(tags).values({
          name: wpTag.name,
          slug: wpTag.slug
        });
        
        tagMap.set(wpTag.id, Number(result.insertId));
        console.log(`Created tag: ${wpTag.name}`);
      }
    } catch (error) {
      console.error(`Error importing tag ${wpTag.name}:`, error.message);
    }
  }
  
  return tagMap;
}

// Import articles
async function importArticles(wpArticles, categoryMap, tagMap) {
  console.log('\nImporting articles...');
  let imported = 0;
  let skipped = 0;
  
  for (const wpArticle of wpArticles) {
    try {
      // Check if article already exists by slug
      const [existing] = await db.select().from(articles).where(eq(articles.slug, wpArticle.slug)).limit(1);
      
      if (existing) {
        console.log(`Article "${wpArticle.title.rendered}" already exists, skipping`);
        skipped++;
        continue;
      }
      
      // Convert content to blocks
      const blocks = convertHtmlToBlocks(wpArticle.content.rendered);
      
      // Map category
      const categoryId = wpArticle.article_catagory?.[0] ? categoryMap.get(wpArticle.article_catagory[0]) : null;
      
      // Get featured image URL if available (skip for now to speed up import)
      let coverImageUrl = null;
      
      // Create article
      const result = await db.insert(articles).values({
        title: wpArticle.title.rendered,
        slug: wpArticle.slug,
        excerpt: wpArticle.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
        content: JSON.stringify(blocks),
        coverImageUrl: coverImageUrl,
        categoryId: categoryId,
        status: wpArticle.status === 'publish' ? 'published' : 'draft',
        featured: false,
        seoTitle: wpArticle.title.rendered,
        seoDescription: wpArticle.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 160) || '',
        seoKeywords: '',
        createdAt: new Date(wpArticle.date),
        updatedAt: new Date(wpArticle.modified)
      });
      
      const newArticleId = Number(result.insertId);
      
      // Map and create article tags
      if (wpArticle.article_tags && wpArticle.article_tags.length > 0) {
        for (const wpTagId of wpArticle.article_tags) {
          const tagId = tagMap.get(wpTagId);
          if (tagId) {
            await db.insert(articleTags).values({
              articleId: newArticleId,
              tagId: tagId
            });
          }
        }
      }
      
      console.log(`✓ Imported: ${wpArticle.title.rendered}`);
      imported++;
      
    } catch (error) {
      console.error(`Error importing article ${wpArticle.title.rendered}:`, error.message);
    }
  }
  
  return { imported, skipped };
}

// Main import function
async function main() {
  console.log('=== WordPress Article Import ===\n');
  
  try {
    // Initialize database connection
    db = await getDb();
    if (!db) {
      throw new Error('Failed to connect to database');
    }
    // Fetch data from WordPress
    const wpArticles = await fetchWordPressArticles();
    const wpCategories = await fetchWordPressCategories();
    const wpTags = await fetchWordPressTags();
    
    // Import categories and tags first
    const categoryMap = await importCategories(wpCategories);
    const tagMap = await importTags(wpTags);
    
    // Import articles
    const { imported, skipped } = await importArticles(wpArticles, categoryMap, tagMap);
    
    console.log('\n=== Import Complete ===');
    console.log(`Articles imported: ${imported}`);
    console.log(`Articles skipped: ${skipped}`);
    console.log(`Total articles: ${wpArticles.length}`);
    
  } catch (error) {
    console.error('\n=== Import Failed ===');
    console.error(error);
    process.exit(1);
  }
}

main();
