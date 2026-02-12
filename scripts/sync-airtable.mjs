#!/usr/bin/env node
/**
 * Airtable → MySQL Sync Script
 * 
 * Syncs content from Airtable to MySQL database
 * Handles ID mapping between Airtable string IDs and MySQL integer IDs
 * 
 * Usage: node scripts/sync-airtable.mjs
 */

import https from 'https';
import mysql from 'mysql2/promise';

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const DATABASE_URL = process.env.DATABASE_URL;

const TABLES = {
  categories: 'tblraijFpBeZ1OmLS',
  tags: 'tbluWvFRlMSIX7pTZ',
  projects: 'tblRwDjfCy9vN2KUo',
  projectImages: 'tbl3AkEtBOYIk1OxJ',
  news: 'tblzRfniYgcQkxYxy',
  articles: 'tbltt0XLQxXD7tAuP'
};

// ID mapping: Airtable ID → MySQL ID
const idMap = {
  categories: new Map(),
  tags: new Map(),
  projects: new Map(),
  news: new Map(),
  articles: new Map()
};

let db;

async function airtableRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.airtable.com',
      port: 443,
      path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`
      }
    };

    https.get(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    }).on('error', reject);
  });
}

async function getAllRecords(tableId) {
  const records = [];
  let offset;
  
  do {
    const path = `/v0/${AIRTABLE_BASE_ID}/${tableId}${offset ? `?offset=${offset}` : ''}`;
    const response = await airtableRequest(path);
    records.push(...response.records);
    offset = response.offset;
  } while (offset);
  
  return records;
}

async function syncCategories() {
  console.log('\n📁 Syncing Categories...');
  const records = await getAllRecords(TABLES.categories);
  
  for (const record of records) {
    const { Name, Slug, Type, Color, Description } = record.fields;
    
    const [existing] = await db.query(
      'SELECT id FROM categories WHERE slug = ?',
      [Slug]
    );
    
    if (existing.length > 0) {
      // Update existing
      await db.query(
        'UPDATE categories SET name = ?, type = ?, color = ?, description = ? WHERE id = ?',
        [Name, Type, Color || '#FF5722', Description || null, existing[0].id]
      );
      idMap.categories.set(record.id, existing[0].id);
    } else {
      // Insert new
      const [result] = await db.query(
        'INSERT INTO categories (name, slug, type, color, description) VALUES (?, ?, ?, ?, ?)',
        [Name, Slug, Type, Color || '#FF5722', Description || null]
      );
      idMap.categories.set(record.id, result.insertId);
    }
  }
  
  console.log(`✅ Synced ${records.length} categories`);
}

async function syncTags() {
  console.log('\n🏷️  Syncing Tags...');
  const records = await getAllRecords(TABLES.tags);
  
  for (const record of records) {
    const { Name, Slug } = record.fields;
    
    const [existing] = await db.query(
      'SELECT id FROM tags WHERE slug = ?',
      [Slug]
    );
    
    if (existing.length > 0) {
      // Update existing
      await db.query(
        'UPDATE tags SET name = ? WHERE id = ?',
        [Name, existing[0].id]
      );
      idMap.tags.set(record.id, existing[0].id);
    } else {
      // Insert new
      const [result] = await db.query(
        'INSERT INTO tags (name, slug) VALUES (?, ?)',
        [Name, Slug]
      );
      idMap.tags.set(record.id, result.insertId);
    }
  }
  
  console.log(`✅ Synced ${records.length} tags`);
}

async function syncProjects() {
  console.log('\n🎨 Syncing Projects...');
  const records = await getAllRecords(TABLES.projects);
  
  for (const record of records) {
    const fields = record.fields;
    
    // Extract cover image URL
    let coverImageUrl = null;
    if (fields['Cover Image'] && fields['Cover Image'].length > 0) {
      coverImageUrl = fields['Cover Image'][0].url;
    }
    
    // Map category ID
    let categoryId = null;
    if (fields.Category && fields.Category.length > 0) {
      categoryId = idMap.categories.get(fields.Category[0]);
    }
    
    const [existing] = await db.query(
      'SELECT id FROM projects WHERE slug = ?',
      [fields.Slug]
    );
    
    const projectData = {
      title: fields.Title,
      slug: fields.Slug,
      excerpt: fields.Excerpt || null,
      designNotes: fields['Design Notes'] || null,
      discipline: fields.Discipline || 'scenic_design',
      subcategory: fields.Subcategory || null,
      categoryId: categoryId,
      coverImageUrl: coverImageUrl,
      location: fields.Location || null,
      client: fields.Client || null,
      year: fields.Year || null,
      month: fields.Month || null,
      status: fields.Status || 'draft',
      featured: fields.Featured ? 1 : 0,
      viewCount: fields['View Count'] || 0,
      likeCount: fields['Like Count'] || 0,
      seoTitle: fields['SEO Title'] || null,
      seoDescription: fields['SEO Description'] || null,
      seoKeywords: fields['SEO Keywords'] || null
    };
    
    if (existing.length > 0) {
      // Update existing
      await db.query(
        `UPDATE projects SET 
          title = ?, excerpt = ?, designNotes = ?, discipline = ?, subcategory = ?,
          categoryId = ?, coverImageUrl = ?, location = ?, client = ?, year = ?, month = ?,
          status = ?, featured = ?, viewCount = ?, likeCount = ?,
          seoTitle = ?, seoDescription = ?, seoKeywords = ?
        WHERE id = ?`,
        [
          projectData.title, projectData.excerpt, projectData.designNotes,
          projectData.discipline, projectData.subcategory, projectData.categoryId,
          projectData.coverImageUrl, projectData.location, projectData.client,
          projectData.year, projectData.month, projectData.status, projectData.featured,
          projectData.viewCount, projectData.likeCount, projectData.seoTitle,
          projectData.seoDescription, projectData.seoKeywords, existing[0].id
        ]
      );
      idMap.projects.set(record.id, existing[0].id);
    } else {
      // Insert new
      const [result] = await db.query(
        `INSERT INTO projects (
          title, slug, excerpt, designNotes, discipline, subcategory, categoryId,
          coverImageUrl, location, client, year, month, status, featured,
          viewCount, likeCount, seoTitle, seoDescription, seoKeywords
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectData.title, projectData.slug, projectData.excerpt, projectData.designNotes,
          projectData.discipline, projectData.subcategory, projectData.categoryId,
          projectData.coverImageUrl, projectData.location, projectData.client,
          projectData.year, projectData.month, projectData.status, projectData.featured,
          projectData.viewCount, projectData.likeCount, projectData.seoTitle,
          projectData.seoDescription, projectData.seoKeywords
        ]
      );
      idMap.projects.set(record.id, result.insertId);
    }
    
    // Sync project tags
    if (fields.Tags && fields.Tags.length > 0) {
      const mysqlProjectId = idMap.projects.get(record.id);
      
      // Clear existing tags
      await db.query('DELETE FROM projectTags WHERE projectId = ?', [mysqlProjectId]);
      
      // Add new tags
      for (const airtableTagId of fields.Tags) {
        const mysqlTagId = idMap.tags.get(airtableTagId);
        if (mysqlTagId) {
          await db.query(
            'INSERT INTO projectTags (projectId, tagId) VALUES (?, ?)',
            [mysqlProjectId, mysqlTagId]
          );
        }
      }
    }
  }
  
  console.log(`✅ Synced ${records.length} projects`);
}

async function syncProjectImages() {
  console.log('\n🖼️  Syncing Project Images...');
  const records = await getAllRecords(TABLES.projectImages);
  
  // Clear all existing project images
  await db.query('DELETE FROM projectImages');
  
  for (const record of records) {
    const fields = record.fields;
    
    // Get MySQL project ID
    const airtableProjectId = fields.Project && fields.Project[0];
    const mysqlProjectId = idMap.projects.get(airtableProjectId);
    
    if (!mysqlProjectId) {
      console.warn(`⚠️  Skipping image - no project found for ${airtableProjectId}`);
      continue;
    }
    
    // Extract image URL
    let imageUrl = null;
    if (fields.Image && fields.Image.length > 0) {
      imageUrl = fields.Image[0].url;
    }
    
    await db.query(
      `INSERT INTO projectImages (
        projectId, imageUrl, videoUrl, imageType, caption, altText, sortOrder
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        mysqlProjectId,
        imageUrl,
        fields['Video URL'] || null,
        fields['Image Type'] || 'production',
        fields.Caption || null,
        fields['Alt Text'] || null,
        fields['Sort Order'] || 0
      ]
    );
  }
  
  console.log(`✅ Synced ${records.length} project images`);
}

async function syncNews() {
  console.log('\n📰 Syncing News...');
  const records = await getAllRecords(TABLES.news);
  
  for (const record of records) {
    const fields = record.fields;
    
    // Extract cover image URL
    let coverImageUrl = null;
    if (fields['Cover Image'] && fields['Cover Image'].length > 0) {
      coverImageUrl = fields['Cover Image'][0].url;
    }
    
    // Map category ID
    let categoryId = null;
    if (fields.Category && fields.Category.length > 0) {
      categoryId = idMap.categories.get(fields.Category[0]);
    }
    
    // Parse blocks JSON
    let blocks = null;
    if (fields.Blocks) {
      try {
        blocks = JSON.parse(fields.Blocks);
      } catch (e) {
        blocks = null;
      }
    }
    
    const [existing] = await db.query(
      'SELECT id FROM news WHERE slug = ?',
      [fields.Slug]
    );
    
    const newsData = {
      title: fields.Title,
      slug: fields.Slug,
      excerpt: fields.Excerpt || '',
      categoryId: categoryId,
      coverImageUrl: coverImageUrl,
      location: fields.Location || null,
      date: fields.Date ? new Date(fields.Date) : new Date(),
      externalLink: fields['External Link'] || null,
      blocks: blocks ? JSON.stringify(blocks) : null,
      status: fields.Status || 'draft',
      featured: fields.Featured ? 1 : 0,
      seoTitle: fields['SEO Title'] || null,
      seoDescription: fields['SEO Description'] || null,
      seoKeywords: fields['SEO Keywords'] || null
    };
    
    if (existing.length > 0) {
      // Update existing
      await db.query(
        `UPDATE news SET 
          title = ?, excerpt = ?, categoryId = ?, coverImageUrl = ?, location = ?,
          date = ?, externalLink = ?, blocks = ?, status = ?, featured = ?,
          seoTitle = ?, seoDescription = ?, seoKeywords = ?
        WHERE id = ?`,
        [
          newsData.title, newsData.excerpt, newsData.categoryId, newsData.coverImageUrl,
          newsData.location, newsData.date, newsData.externalLink, newsData.blocks,
          newsData.status, newsData.featured, newsData.seoTitle,
          newsData.seoDescription, newsData.seoKeywords, existing[0].id
        ]
      );
      idMap.news.set(record.id, existing[0].id);
    } else {
      // Insert new
      const [result] = await db.query(
        `INSERT INTO news (
          title, slug, excerpt, categoryId, coverImageUrl, location, date,
          externalLink, blocks, status, featured, seoTitle, seoDescription, seoKeywords
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newsData.title, newsData.slug, newsData.excerpt, newsData.categoryId,
          newsData.coverImageUrl, newsData.location, newsData.date, newsData.externalLink,
          newsData.blocks, newsData.status, newsData.featured, newsData.seoTitle,
          newsData.seoDescription, newsData.seoKeywords
        ]
      );
      idMap.news.set(record.id, result.insertId);
    }
    
    // Sync news tags
    if (fields.Tags && fields.Tags.length > 0) {
      const mysqlNewsId = idMap.news.get(record.id);
      
      // Clear existing tags
      await db.query('DELETE FROM newsTags WHERE newsId = ?', [mysqlNewsId]);
      
      // Add new tags
      for (const airtableTagId of fields.Tags) {
        const mysqlTagId = idMap.tags.get(airtableTagId);
        if (mysqlTagId) {
          await db.query(
            'INSERT INTO newsTags (newsId, tagId) VALUES (?, ?)',
            [mysqlNewsId, mysqlTagId]
          );
        }
      }
    }
  }
  
  console.log(`✅ Synced ${records.length} news items`);
}

async function syncArticles() {
  console.log('\n📝 Syncing Articles...');
  const records = await getAllRecords(TABLES.articles);
  
  for (const record of records) {
    const fields = record.fields;
    
    // Extract cover image URL
    let coverImageUrl = null;
    if (fields['Cover Image'] && fields['Cover Image'].length > 0) {
      coverImageUrl = fields['Cover Image'][0].url;
    }
    
    // Map category ID
    let categoryId = null;
    if (fields.Category && fields.Category.length > 0) {
      categoryId = idMap.categories.get(fields.Category[0]);
    }
    
    const [existing] = await db.query(
      'SELECT id FROM articles WHERE slug = ?',
      [fields.Slug]
    );
    
    const articleData = {
      title: fields.Title,
      slug: fields.Slug,
      excerpt: fields.Excerpt || '',
      content: fields.Content || '',
      categoryId: categoryId,
      coverImageUrl: coverImageUrl,
      readTime: fields['Read Time'] || null,
      likes: fields.Likes || 0,
      views: fields.Views || 0,
      status: fields.Status || 'draft',
      featured: fields.Featured ? 1 : 0,
      seoTitle: fields['SEO Title'] || null,
      seoDescription: fields['SEO Description'] || null,
      seoKeywords: fields['SEO Keywords'] || null
    };
    
    if (existing.length > 0) {
      // Update existing
      await db.query(
        `UPDATE articles SET 
          title = ?, excerpt = ?, content = ?, categoryId = ?, coverImageUrl = ?,
          readTime = ?, likes = ?, views = ?, status = ?, featured = ?,
          seoTitle = ?, seoDescription = ?, seoKeywords = ?
        WHERE id = ?`,
        [
          articleData.title, articleData.excerpt, articleData.content, articleData.categoryId,
          articleData.coverImageUrl, articleData.readTime, articleData.likes, articleData.views,
          articleData.status, articleData.featured, articleData.seoTitle,
          articleData.seoDescription, articleData.seoKeywords, existing[0].id
        ]
      );
      idMap.articles.set(record.id, existing[0].id);
    } else {
      // Insert new
      const [result] = await db.query(
        `INSERT INTO articles (
          title, slug, excerpt, content, categoryId, coverImageUrl, readTime,
          likes, views, status, featured, seoTitle, seoDescription, seoKeywords
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          articleData.title, articleData.slug, articleData.excerpt, articleData.content,
          articleData.categoryId, articleData.coverImageUrl, articleData.readTime,
          articleData.likes, articleData.views, articleData.status, articleData.featured,
          articleData.seoTitle, articleData.seoDescription, articleData.seoKeywords
        ]
      );
      idMap.articles.set(record.id, result.insertId);
    }
    
    // Sync article tags
    if (fields.Tags && fields.Tags.length > 0) {
      const mysqlArticleId = idMap.articles.get(record.id);
      
      // Clear existing tags
      await db.query('DELETE FROM articleTags WHERE articleId = ?', [mysqlArticleId]);
      
      // Add new tags
      for (const airtableTagId of fields.Tags) {
        const mysqlTagId = idMap.tags.get(airtableTagId);
        if (mysqlTagId) {
          await db.query(
            'INSERT INTO articleTags (articleId, tagId) VALUES (?, ?)',
            [mysqlArticleId, mysqlTagId]
          );
        }
      }
    }
  }
  
  console.log(`✅ Synced ${records.length} articles`);
}

async function main() {
  console.log('🚀 Starting Airtable → MySQL sync...\n');
  
  try {
    // Connect to MySQL
    db = await mysql.createConnection(DATABASE_URL);
    console.log('✅ Connected to MySQL database');
    
    // Sync in order (categories/tags first, then content that references them)
    await syncCategories();
    await syncTags();
    await syncProjects();
    await syncProjectImages();
    await syncNews();
    await syncArticles();
    
    console.log('\n✅ Sync complete!');
  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  } finally {
    if (db) {
      await db.end();
    }
  }
}

main();
