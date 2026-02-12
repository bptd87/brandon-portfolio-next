/**
 * Airtable Data Adapter
 * Transforms Airtable records into the format expected by the application
 */

import { AirtableRecord } from './airtableClient';

// Type definitions matching the original database schema
export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'project' | 'news' | 'article';
  color: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  designNotes?: string;
  discipline: 'scenic_design' | 'experiential_design' | 'rendering' | 'scenic_models';
  subcategory?: string;
  categoryId?: string;
  category?: Category;
  tags?: Tag[];
  creativeTeam?: any;
  viewCount: number;
  likeCount: number;
  coverImageUrl?: string;
  coverImageKey?: string;
  location?: string;
  client?: string;
  year?: number;
  month?: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  metadata?: any;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  imageUrl?: string;
  imageKey?: string;
  videoUrl?: string;
  imageType: 'production' | 'rendering' | 'technical_drawing' | 'video';
  caption?: string;
  altText?: string;
  sortOrder: number;
  createdAt: Date;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categoryId?: string;
  category?: Category;
  tags?: Tag[];
  coverImageUrl?: string;
  coverImageKey?: string;
  location?: string;
  date: Date;
  externalLink?: string;
  blocks?: any;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId?: string;
  category?: Category;
  tags?: Tag[];
  coverImageUrl?: string;
  coverImageKey?: string;
  readTime?: number;
  likes: number;
  views: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/**
 * Transform Airtable category record to app format
 */
export function transformCategory(record: AirtableRecord): Category {
  return {
    id: record.id,
    name: record.fields.Name || '',
    slug: record.fields.Slug || '',
    type: record.fields.Type || 'project',
    color: record.fields.Color || '#FF5722',
    description: record.fields.Description || undefined
  };
}

/**
 * Transform Airtable tag record to app format
 */
export function transformTag(record: AirtableRecord): Tag {
  return {
    id: record.id,
    name: record.fields.Name || '',
    slug: record.fields.Slug || ''
  };
}

/**
 * Transform Airtable project record to app format
 */
export function transformProject(record: AirtableRecord, options?: {
  category?: Category;
  tags?: Tag[];
}): Project {
  // Extract cover image URL from Airtable attachment
  let coverImageUrl: string | undefined;
  if (record.fields['Cover Image'] && Array.isArray(record.fields['Cover Image'])) {
    coverImageUrl = record.fields['Cover Image'][0]?.url;
  }
  
  return {
    id: record.id,
    title: record.fields.Title || '',
    slug: record.fields.Slug || '',
    excerpt: record.fields.Excerpt || undefined,
    designNotes: record.fields['Design Notes'] || undefined,
    discipline: record.fields.Discipline || 'scenic_design',
    subcategory: record.fields.Subcategory || undefined,
    categoryId: record.fields.Category?.[0] || undefined,
    category: options?.category,
    tags: options?.tags,
    creativeTeam: undefined, // TODO: Handle creative team JSON
    viewCount: record.fields['View Count'] || 0,
    likeCount: record.fields['Like Count'] || 0,
    coverImageUrl,
    coverImageKey: undefined,
    location: record.fields.Location || undefined,
    client: record.fields.Client || undefined,
    year: record.fields.Year || undefined,
    month: record.fields.Month || undefined,
    status: record.fields.Status || 'draft',
    featured: record.fields.Featured || false,
    metadata: undefined,
    seoTitle: record.fields['SEO Title'] || undefined,
    seoDescription: record.fields['SEO Description'] || undefined,
    seoKeywords: record.fields['SEO Keywords'] || undefined,
    createdAt: new Date(record.createdTime),
    updatedAt: new Date(record.createdTime),
    publishedAt: record.fields.Status === 'published' ? new Date(record.createdTime) : undefined
  };
}

/**
 * Transform Airtable project image record to app format
 */
export function transformProjectImage(record: AirtableRecord): ProjectImage {
  let imageUrl: string | undefined;
  if (record.fields.Image && Array.isArray(record.fields.Image)) {
    imageUrl = record.fields.Image[0]?.url;
  }
  
  return {
    id: record.id,
    projectId: record.fields.Project?.[0] || '',
    imageUrl,
    imageKey: undefined,
    videoUrl: record.fields['Video URL'] || undefined,
    imageType: record.fields['Image Type'] || 'production',
    caption: record.fields.Caption || undefined,
    altText: record.fields['Alt Text'] || undefined,
    sortOrder: record.fields['Sort Order'] || 0,
    createdAt: new Date(record.createdTime)
  };
}

/**
 * Transform Airtable news record to app format
 */
export function transformNews(record: AirtableRecord, options?: {
  category?: Category;
  tags?: Tag[];
}): News {
  let coverImageUrl: string | undefined;
  if (record.fields['Cover Image'] && Array.isArray(record.fields['Cover Image'])) {
    coverImageUrl = record.fields['Cover Image'][0]?.url;
  }
  
  let blocks: any;
  try {
    blocks = record.fields.Blocks ? JSON.parse(record.fields.Blocks) : undefined;
  } catch (e) {
    blocks = undefined;
  }
  
  return {
    id: record.id,
    title: record.fields.Title || '',
    slug: record.fields.Slug || '',
    excerpt: record.fields.Excerpt || '',
    categoryId: record.fields.Category?.[0] || undefined,
    category: options?.category,
    tags: options?.tags,
    coverImageUrl,
    coverImageKey: undefined,
    location: record.fields.Location || undefined,
    date: record.fields.Date ? new Date(record.fields.Date) : new Date(),
    externalLink: record.fields['External Link'] || undefined,
    blocks,
    status: record.fields.Status || 'draft',
    featured: record.fields.Featured || false,
    seoTitle: record.fields['SEO Title'] || undefined,
    seoDescription: record.fields['SEO Description'] || undefined,
    seoKeywords: record.fields['SEO Keywords'] || undefined,
    createdAt: new Date(record.createdTime),
    updatedAt: new Date(record.createdTime),
    publishedAt: record.fields.Status === 'published' ? new Date(record.createdTime) : undefined
  };
}

/**
 * Transform Airtable article record to app format
 */
export function transformArticle(record: AirtableRecord, options?: {
  category?: Category;
  tags?: Tag[];
}): Article {
  let coverImageUrl: string | undefined;
  if (record.fields['Cover Image'] && Array.isArray(record.fields['Cover Image'])) {
    coverImageUrl = record.fields['Cover Image'][0]?.url;
  }
  
  return {
    id: record.id,
    title: record.fields.Title || '',
    slug: record.fields.Slug || '',
    excerpt: record.fields.Excerpt || '',
    content: record.fields.Content || '',
    categoryId: record.fields.Category?.[0] || undefined,
    category: options?.category,
    tags: options?.tags,
    coverImageUrl,
    coverImageKey: undefined,
    readTime: record.fields['Read Time'] || undefined,
    likes: record.fields.Likes || 0,
    views: record.fields.Views || 0,
    status: record.fields.Status || 'draft',
    featured: record.fields.Featured || false,
    seoTitle: record.fields['SEO Title'] || undefined,
    seoDescription: record.fields['SEO Description'] || undefined,
    seoKeywords: record.fields['SEO Keywords'] || undefined,
    createdAt: new Date(record.createdTime),
    updatedAt: new Date(record.createdTime),
    publishedAt: record.fields.Status === 'published' ? new Date(record.createdTime) : undefined
  };
}
