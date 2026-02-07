import fetch from 'node-fetch';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { getDb } from '../server/db.ts';
// Database imports not needed for extraction phase
import { eq } from 'drizzle-orm';

const WORDPRESS_API = 'https://cms.brandonptdavis.com/wp-json/wp/v2';
const OUTPUT_DIR = '/home/ubuntu/wordpress-articles-export';

// Create output directory
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🚀 Starting WordPress article extraction...\n');

// Fetch all articles with pagination
async function fetchAllArticles() {
  let page = 1;
  let allArticles = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${WORDPRESS_API}/articles?page=${page}&per_page=100`);
    
    if (!response.ok) {
      hasMore = false;
      break;
    }
    
    const articles = await response.json();
    
    if (!Array.isArray(articles) || articles.length === 0) {
      hasMore = false;
    } else {
      allArticles = allArticles.concat(articles);
      console.log(`📄 Fetched page ${page}: ${articles.length} articles`);
      page++;
    }
  }

  return allArticles;
}

// Fetch featured image
async function fetchFeaturedImage(mediaId) {
  if (!mediaId) return null;
  
  try {
    const response = await fetch(`${WORDPRESS_API}/media/${mediaId}`);
    const media = await response.json();
    return {
      url: media.source_url,
      alt: media.alt_text || '',
      caption: media.caption?.rendered || ''
    };
  } catch (error) {
    console.error(`  ⚠️  Failed to fetch media ${mediaId}:`, error.message);
    return null;
  }
}

// Extract images from HTML content
function extractImagesFromHTML(html) {
  const images = [];
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^">]*)"[^>]*>/g;
  let match;
  
  while ((match = imgRegex.exec(html)) !== null) {
    images.push({
      url: match[1],
      alt: match[2] || ''
    });
  }
  
  return images;
}

// Fetch categories
async function fetchCategories(categoryIds) {
  if (!categoryIds || categoryIds.length === 0) return [];
  
  const cats = [];
  for (const id of categoryIds) {
    try {
      const response = await fetch(`${WORDPRESS_API}/article-categories/${id}`);
      const cat = await response.json();
      cats.push(cat.name);
    } catch (error) {
      console.error(`  ⚠️  Failed to fetch category ${id}`);
    }
  }
  return cats;
}

// Fetch tags
async function fetchTags(tagIds) {
  if (!tagIds || tagIds.length === 0) return [];
  
  const articleTags = [];
  for (const id of tagIds) {
    try {
      const response = await fetch(`${WORDPRESS_API}/article-tags/${id}`);
      const tag = await response.json();
      articleTags.push(tag.name);
    } catch (error) {
      console.error(`  ⚠️  Failed to fetch tag ${id}`);
    }
  }
  return articleTags;
}

// Main extraction
const wpArticles = await fetchAllArticles();
console.log(`\n✅ Total articles found: ${wpArticles.length}\n`);

const extractedArticles = [];

for (const article of wpArticles) {
  console.log(`📝 Processing: ${article.title.rendered}`);
  
  // Fetch featured image
  const featuredImage = await fetchFeaturedImage(article.featured_media);
  
  // Extract inline images
  const inlineImages = extractImagesFromHTML(article.content.rendered);
  
  // Fetch categories and tags
  const articleCategories = await fetchCategories(article['article-categories']);
  const articleTags = await fetchTags(article['article-tags']);
  
  const extracted = {
    title: article.title.rendered,
    slug: article.slug,
    excerpt: article.excerpt.rendered.replace(/<[^>]*>/g, '').trim(),
    content: article.content.rendered,
    publishedAt: article.date,
    featuredImage: featuredImage,
    inlineImages: inlineImages,
    categories: articleCategories,
    tags: articleTags,
    seo: {
      title: article.yoast_head_json?.title || article.title.rendered,
      description: article.yoast_head_json?.description || '',
      ogImage: article.yoast_head_json?.og_image?.[0]?.url || featuredImage?.url || ''
    }
  };
  
  extractedArticles.push(extracted);
  
  console.log(`  ✓ Featured image: ${featuredImage ? 'Yes' : 'No'}`);
  console.log(`  ✓ Inline images: ${inlineImages.length}`);
  console.log(`  ✓ Categories: ${articleCategories.join(', ')}`);
  console.log(`  ✓ Tags: ${articleTags.join(', ')}\n`);
}

// Save to JSON file
const outputPath = join(OUTPUT_DIR, 'articles-full-export.json');
writeFileSync(outputPath, JSON.stringify(extractedArticles, null, 2));

console.log(`\n✅ Extraction complete!`);
console.log(`📁 Saved to: ${outputPath}`);
console.log(`📊 Total articles: ${extractedArticles.length}`);
console.log(`📸 Total images to download: ${extractedArticles.reduce((sum, a) => sum + (a.featuredImage ? 1 : 0) + a.inlineImages.length, 0)}`);

process.exit(0);
