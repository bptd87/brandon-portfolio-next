/**
 * Airtable Database Layer
 * Implements core content operations using Airtable instead of MySQL
 */

import { listRecords, getRecord, createRecord, updateRecord, deleteRecord, AIRTABLE_TABLES } from './airtableClient';
import {
  transformCategory, transformTag, transformProject, transformProjectImage,
  transformNews, transformArticle,
  Category, Tag, Project, ProjectImage, News, Article
} from './airtableAdapter';

// ============ CATEGORY OPERATIONS ============

export async function getAllCategories(type?: 'project' | 'news' | 'article'): Promise<Category[]> {
  const filter = type ? `{Type} = '${type}'` : undefined;
  const records = await listRecords(AIRTABLE_TABLES.categories, {
    filterByFormula: filter
  });
  return records.map(transformCategory);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  try {
    const record = await getRecord(AIRTABLE_TABLES.categories, id);
    return transformCategory(record);
  } catch (error) {
    return undefined;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const records = await listRecords(AIRTABLE_TABLES.categories, {
    filterByFormula: `{Slug} = '${slug}'`,
    maxRecords: 1
  });
  return records.length > 0 ? transformCategory(records[0]) : undefined;
}

// ============ TAG OPERATIONS ============

export async function getAllTags(): Promise<Tag[]> {
  const records = await listRecords(AIRTABLE_TABLES.tags);
  return records.map(transformTag);
}

export async function getTagById(id: string): Promise<Tag | undefined> {
  try {
    const record = await getRecord(AIRTABLE_TABLES.tags, id);
    return transformTag(record);
  } catch (error) {
    return undefined;
  }
}

export async function getTagBySlug(slug: string): Promise<Tag | undefined> {
  const records = await listRecords(AIRTABLE_TABLES.tags, {
    filterByFormula: `{Slug} = '${slug}'`,
    maxRecords: 1
  });
  return records.length > 0 ? transformTag(records[0]) : undefined;
}

// ============ PROJECT OPERATIONS ============

export async function getAllProjects(filters?: {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  discipline?: string;
  categoryId?: string;
  tagId?: string;
}): Promise<Project[]> {
  let filterFormula: string | undefined;
  const conditions: string[] = [];
  
  if (filters?.status) {
    conditions.push(`{Status} = '${filters.status}'`);
  }
  
  if (filters?.featured !== undefined) {
    conditions.push(`{Featured} = ${filters.featured ? '1' : '0'}`);
  }
  
  if (filters?.discipline) {
    conditions.push(`{Discipline} = '${filters.discipline}'`);
  }
  
  if (filters?.categoryId) {
    conditions.push(`FIND('${filters.categoryId}', ARRAYJOIN({Category}))`);
  }
  
  if (filters?.tagId) {
    conditions.push(`FIND('${filters.tagId}', ARRAYJOIN({Tags}))`);
  }
  
  if (conditions.length > 0) {
    filterFormula = `AND(${conditions.join(', ')})`;
  }
  
  const records = await listRecords(AIRTABLE_TABLES.projects, {
    filterByFormula: filterFormula,
    sort: [
      { field: 'Year', direction: 'desc' },
      { field: 'Month', direction: 'desc' }
    ]
  });
  
  // Fetch categories and tags for projects
  const categoryIds = Array.from(new Set(records.map(r => r.fields.Category?.[0]).filter(Boolean)));
  const categories = await Promise.all(categoryIds.map(id => getCategoryById(id)));
  const categoryMap = new Map(categories.filter(Boolean).map(c => [c!.id, c!]));
  
  return records.map(record => {
    const categoryId = record.fields.Category?.[0];
    const category = categoryId ? categoryMap.get(categoryId) : undefined;
    
    // TODO: Fetch tags for each project
    return transformProject(record, { category });
  });
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  try {
    const record = await getRecord(AIRTABLE_TABLES.projects, id);
    const categoryId = record.fields.Category?.[0];
    const category = categoryId ? await getCategoryById(categoryId) : undefined;
    
    // TODO: Fetch tags
    return transformProject(record, { category });
  } catch (error) {
    return undefined;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const records = await listRecords(AIRTABLE_TABLES.projects, {
    filterByFormula: `{Slug} = '${slug}'`,
    maxRecords: 1
  });
  
  if (records.length === 0) return undefined;
  
  const record = records[0];
  const categoryId = record.fields.Category?.[0];
  const category = categoryId ? await getCategoryById(categoryId) : undefined;
  
  return transformProject(record, { category });
}

export async function getProjectImages(projectId: string): Promise<ProjectImage[]> {
  const records = await listRecords(AIRTABLE_TABLES.projectImages, {
    filterByFormula: `FIND('${projectId}', ARRAYJOIN({Project}))`,
    sort: [{ field: 'Sort Order', direction: 'asc' }]
  });
  return records.map(transformProjectImage);
}

export async function incrementProjectViews(id: string): Promise<void> {
  try {
    const record = await getRecord(AIRTABLE_TABLES.projects, id);
    const currentViews = record.fields['View Count'] || 0;
    await updateRecord(AIRTABLE_TABLES.projects, id, {
      'View Count': currentViews + 1
    });
  } catch (error) {
    console.error('Failed to increment project views:', error);
  }
}

// ============ NEWS OPERATIONS ============

export async function getAllNews(filters?: {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  categoryId?: string;
}): Promise<News[]> {
  let filterFormula: string | undefined;
  const conditions: string[] = [];
  
  if (filters?.status) {
    conditions.push(`{Status} = '${filters.status}'`);
  }
  
  if (filters?.featured !== undefined) {
    conditions.push(`{Featured} = ${filters.featured ? '1' : '0'}`);
  }
  
  if (filters?.categoryId) {
    conditions.push(`FIND('${filters.categoryId}', ARRAYJOIN({Category}))`);
  }
  
  if (conditions.length > 0) {
    filterFormula = `AND(${conditions.join(', ')})`;
  }
  
  const records = await listRecords(AIRTABLE_TABLES.news, {
    filterByFormula: filterFormula,
    sort: [{ field: 'Date', direction: 'desc' }]
  });
  
  // Fetch categories
  const categoryIds = Array.from(new Set(records.map(r => r.fields.Category?.[0]).filter(Boolean)));
  const categories = await Promise.all(categoryIds.map(id => getCategoryById(id)));
  const categoryMap = new Map(categories.filter(Boolean).map(c => [c!.id, c!]));
  
  return records.map(record => {
    const categoryId = record.fields.Category?.[0];
    const category = categoryId ? categoryMap.get(categoryId) : undefined;
    return transformNews(record, { category });
  });
}

export async function getNewsById(id: string): Promise<News | undefined> {
  try {
    const record = await getRecord(AIRTABLE_TABLES.news, id);
    const categoryId = record.fields.Category?.[0];
    const category = categoryId ? await getCategoryById(categoryId) : undefined;
    return transformNews(record, { category });
  } catch (error) {
    return undefined;
  }
}

export async function getNewsBySlug(slug: string): Promise<News | undefined> {
  const records = await listRecords(AIRTABLE_TABLES.news, {
    filterByFormula: `{Slug} = '${slug}'`,
    maxRecords: 1
  });
  
  if (records.length === 0) return undefined;
  
  const record = records[0];
  const categoryId = record.fields.Category?.[0];
  const category = categoryId ? await getCategoryById(categoryId) : undefined;
  
  return transformNews(record, { category });
}

// ============ ARTICLE OPERATIONS ============

export async function getAllArticles(filters?: {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  categoryId?: string;
}): Promise<Article[]> {
  let filterFormula: string | undefined;
  const conditions: string[] = [];
  
  if (filters?.status) {
    conditions.push(`{Status} = '${filters.status}'`);
  }
  
  if (filters?.featured !== undefined) {
    conditions.push(`{Featured} = ${filters.featured ? '1' : '0'}`);
  }
  
  if (filters?.categoryId) {
    conditions.push(`FIND('${filters.categoryId}', ARRAYJOIN({Category}))`);
  }
  
  if (conditions.length > 0) {
    filterFormula = `AND(${conditions.join(', ')})`;
  }
  
  const records = await listRecords(AIRTABLE_TABLES.articles, {
    filterByFormula: filterFormula,
    sort: [{ field: 'Title', direction: 'asc' }]
  });
  
  // Fetch categories
  const categoryIds = Array.from(new Set(records.map(r => r.fields.Category?.[0]).filter(Boolean)));
  const categories = await Promise.all(categoryIds.map(id => getCategoryById(id)));
  const categoryMap = new Map(categories.filter(Boolean).map(c => [c!.id, c!]));
  
  return records.map(record => {
    const categoryId = record.fields.Category?.[0];
    const category = categoryId ? categoryMap.get(categoryId) : undefined;
    return transformArticle(record, { category });
  });
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  try {
    const record = await getRecord(AIRTABLE_TABLES.articles, id);
    const categoryId = record.fields.Category?.[0];
    const category = categoryId ? await getCategoryById(categoryId) : undefined;
    return transformArticle(record, { category });
  } catch (error) {
    return undefined;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const records = await listRecords(AIRTABLE_TABLES.articles, {
    filterByFormula: `{Slug} = '${slug}'`,
    maxRecords: 1
  });
  
  if (records.length === 0) return undefined;
  
  const record = records[0];
  const categoryId = record.fields.Category?.[0];
  const category = categoryId ? await getCategoryById(categoryId) : undefined;
  
  return transformArticle(record, { category });
}

export async function incrementArticleViews(id: string): Promise<void> {
  try {
    const record = await getRecord(AIRTABLE_TABLES.articles, id);
    const currentViews = record.fields.Views || 0;
    await updateRecord(AIRTABLE_TABLES.articles, id, {
      'Views': currentViews + 1
    });
  } catch (error) {
    console.error('Failed to increment article views:', error);
  }
}

// ============ SEARCH OPERATIONS ============

export async function searchContent(query: string): Promise<{
  projects: Project[];
  news: News[];
  articles: Article[];
}> {
  const searchQuery = query.toLowerCase();
  
  // Search projects
  const projectRecords = await listRecords(AIRTABLE_TABLES.projects, {
    filterByFormula: `OR(
      FIND('${searchQuery}', LOWER({Title})),
      FIND('${searchQuery}', LOWER({Excerpt})),
      FIND('${searchQuery}', LOWER({Design Notes}))
    )`
  });
  
  // Search news
  const newsRecords = await listRecords(AIRTABLE_TABLES.news, {
    filterByFormula: `OR(
      FIND('${searchQuery}', LOWER({Title})),
      FIND('${searchQuery}', LOWER({Excerpt}))
    )`
  });
  
  // Search articles
  const articleRecords = await listRecords(AIRTABLE_TABLES.articles, {
    filterByFormula: `OR(
      FIND('${searchQuery}', LOWER({Title})),
      FIND('${searchQuery}', LOWER({Excerpt})),
      FIND('${searchQuery}', LOWER({Content}))
    )`
  });
  
  return {
    projects: projectRecords.map(r => transformProject(r)),
    news: newsRecords.map(r => transformNews(r)),
    articles: articleRecords.map(r => transformArticle(r))
  };
}
