import { supabase } from './supabase';

export { supabase };
import { ENV } from './_core/env';

// ============ TYPES ============

export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date | null;
}

export interface RenderingGalleryItem {
  id: number;
  projectId: number;
  project?: Project; // Joined project data
  sortOrder: number;
  altText: string | null;
  displayTitle: string | null;
  description: string | null;
  createdAt: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  type: 'project' | 'news' | 'article';
  description: string | null;
  color: string | null;
  createdAt: Date;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  designNotes: string | null;
  coverImageUrl: string | null;
  coverImageKey: string | null;
  client: string | null;
  location: string | null;

  year: number | null;
  month: number | null;
  venue?: string | null;
  discipline: 'scenic_design' | 'experiential_design' | 'rendering' | 'scenic_models' | null;
  subcategory: string | null;
  status: 'draft' | 'published' | 'archived' | 'gallery_only';
  featured: boolean;
  categoryId: number | null;
  creativeTeam: any;
  metadata: any;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  images: ProjectImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectImage {
  id: number;
  projectId: number;
  imageUrl: string | null;
  videoUrl: string | null;
  caption: string | null;
  altText: string | null;
  imageType?: string | null;
  sortOrder: number;
  createdAt: Date;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  categoryId: number | null;
  coverImageUrl: string | null;
  coverImageKey?: string | null;
  location: string | null;
  date: Date | null;
  blocks: any;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  externalLink: string | null;
  tags: string | null;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  categoryId: number | null;
  coverImageUrl: string | null;
  authorId: number | null;
  readTime: number | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  likes: number;
  views: number;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  user_id: string;
  created_at: Date;
}


export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  user_id: string;
  created_at: Date;
}


export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  user_id: string;
  created_at: Date;
}

// ============ USER OPERATIONS ============


export async function upsertUser(user: {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: 'admin' | 'user';
  lastSignedIn?: Date;
}): Promise<void> {
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('open_id', user.openId)
    .single();

  const userData: any = {
    open_id: user.openId,
    name: user.name ?? null,
  };

  // Set role to admin if this is the owner
  if (user.openId === ENV.ownerOpenId) {
    userData.role = 'admin';
  } else if (user.role) {
    userData.role = user.role;
  }

  if (existing) {
    await supabase
      .from('users')
      .update(userData)
      .eq('open_id', user.openId);
  } else {
    await supabase
      .from('users')
      .insert(userData);
  }
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('open_id', openId)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    openId: data.open_id,
    name: data.name,
    email: data.email || null,
    role: data.role,
    loginMethod: null,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    lastSignedIn: null,
  };
}

// ============ CATEGORY OPERATIONS ============

export async function getAllCategories(type?: 'project' | 'news' | 'article'): Promise<Category[]> {
  let query = supabase.from('categories').select('*').order('name');

  if (type) {
    query = query.eq('type', type);
  }

  const { data } = await query;
  if (!data) return [];

  return data.map(cat => ({
    ...cat,
    createdAt: new Date(cat.created_at),
  }));
}

export async function getCategoryById(id: number): Promise<Category | undefined> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) return undefined;

  return {
    ...data,
    createdAt: new Date(data.created_at),
  };
}

export async function createCategory(category: any) {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: category.name,
      slug: category.slug,
      type: category.type,
      description: category.description,
      ...(category.color ? { color: category.color } : {}),
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateCategory(id: number, updates: any) {
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.slug !== undefined) updateData.slug = updates.slug;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.color !== undefined) updateData.color = updates.color;

  const { error } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCategory(id: number) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ TAG OPERATIONS ============

export async function getAllTags(): Promise<Tag[]> {
  const { data } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (!data) return [];

  return data.map(tag => ({
    ...tag,
    createdAt: new Date(tag.created_at),
  }));
}

export async function getTagBySlug(slug: string): Promise<Tag | undefined> {
  const { data } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data) return undefined;

  return {
    ...data,
    createdAt: new Date(data.created_at),
  };
}

export async function createTag(tag: { name: string; slug: string }) {
  const { data, error } = await supabase
    .from('tags')
    .insert({ name: tag.name, slug: tag.slug })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateTag(id: number, updates: { name?: string; slug?: string }) {
  const { error } = await supabase
    .from('tags')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteTag(id: number) {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getProjectsByTag(tagId: number): Promise<any[]> {
  const { data } = await supabase
    .from('project_tags')
    .select('project_id, projects(*)')
    .eq('tag_id', tagId);

  if (!data) return [];
  return data.map(pt => pt.projects).filter(Boolean).map((p: any) => ({
    ...p,
    createdAt: new Date(p.created_at),
    updatedAt: new Date(p.updated_at)
  }));
}

export async function getArticlesByTag(tagId: number): Promise<any[]> {
  const { data } = await supabase
    .from('article_tags')
    .select('article_id, articles(*)')
    .eq('tag_id', tagId);

  if (!data) return [];
  
  // Sort by published_at descending
  const articles = data
    .map(at => at.articles)
    .filter(Boolean)
    .sort((a: any, b: any) => {
      const dateA = new Date(a.published_at || a.created_at);
      const dateB = new Date(b.published_at || b.created_at);
      return dateB.getTime() - dateA.getTime();
    })
    .map((a: any) => ({
      ...a,
      createdAt: new Date(a.created_at),
      updatedAt: new Date(a.updated_at),
      publishedAt: a.published_at ? new Date(a.published_at) : new Date(a.created_at)
    }));
  
  return articles;
}

export async function getNewsByTag(tagId: number): Promise<any[]> {
  const { data } = await supabase
    .from('news_tags')
    .select('news_id, news(*)')
    .eq('tag_id', tagId);

  if (!data) return [];
  return data.map(nt => nt.news).filter(Boolean).map((n: any) => ({
    ...n,
    createdAt: new Date(n.created_at),
    updatedAt: new Date(n.updated_at)
  }));
}

// ============ PROJECT OPERATIONS ============

export async function getAllProjects(filters?: {
  status?: 'draft' | 'published' | 'archived' | 'gallery_only';
  featured?: boolean;
  categoryId?: number;
  year?: number;
  discipline?: string;
  includeGalleryOnly?: boolean; // For admin/gallery pages
}): Promise<Project[]> {
  let query = supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters?.year) {
    query = query.eq('year', filters.year);
  }
  if (filters?.discipline) {
    if (filters.discipline === 'scenic_design') {
      query = query.or('discipline.eq.scenic_design,discipline.is.null');
    } else {
      query = query.eq('discipline', filters.discipline);
    }
  }

  // Exclude gallery-only items by default (unless specifically requested by admin)
  if (!filters?.includeGalleryOnly) {
    query = query.eq('gallery_only', false);
  }

  const { data } = await query;
  if (!data) return [];

  // Fetch images for all projects
  const projectIds = data.map(p => p.id);
  const { data: allImages } = await supabase
    .from('project_images')
    .select('*')
    .in('project_id', projectIds)
    .order('sort_order', { ascending: true });

  // Group images by project_id
  const imagesByProject = new Map<number, ProjectImage[]>();
  if (allImages) {
    for (const img of allImages) {
      if (!imagesByProject.has(img.project_id)) {
        imagesByProject.set(img.project_id, []);
      }
      imagesByProject.get(img.project_id)!.push({
        id: img.id,
        projectId: img.project_id,
        imageUrl: img.image_url,
        videoUrl: img.video_url,
        caption: img.caption,
        altText: img.alt_text,
        imageType: img.image_type,
        sortOrder: img.sort_order,
        createdAt: new Date(img.created_at),
      });
    }
  }

  return data.map(proj => ({
    id: proj.id,
    title: proj.title,
    slug: proj.slug,
    excerpt: proj.excerpt,
    designNotes: proj.design_notes,
    coverImageUrl: proj.cover_image,
    coverImageKey: proj.cover_image_key,
    client: proj.client,
    location: proj.location,
    year: proj.year,
    month: proj.month,
    discipline: proj.discipline,
    status: proj.status,
    featured: proj.featured,
    categoryId: proj.category_id,
    creativeTeam: proj.creative_team,
    metadata: proj.metadata,
    publishedAt: proj.published_at ? new Date(proj.published_at) : null,
    subcategory: proj.subcategory,
    seoTitle: proj.seo_title,
    seoDescription: proj.seo_description,
    seoKeywords: proj.seo_keywords,
    images: imagesByProject.get(proj.id) || [],
    createdAt: new Date(proj.created_at),
    updatedAt: new Date(proj.updated_at),
  }));
}

export async function getProjectById(id: number): Promise<Project | undefined> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('gallery_only', false) // Exclude gallery-only items from detail pages
    .single();

  if (!data) return undefined;

  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', data.id)
    .order('sort_order', { ascending: true });

  const projectImages: ProjectImage[] = (images || []).map(img => ({
    id: img.id,
    projectId: img.project_id,
    imageUrl: img.image_url,
    videoUrl: img.video_url,
    caption: img.caption,
    altText: img.alt_text,
    imageType: img.image_type,
    sortOrder: img.sort_order,
    createdAt: new Date(img.created_at),
  }));

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    designNotes: data.design_notes,
    coverImageUrl: data.cover_image,
    coverImageKey: data.cover_image_key,
    client: data.client,
    location: data.location,
    year: data.year,
    month: data.month,
    venue: data.venue,
    discipline: data.discipline,
    subcategory: data.subcategory,
    status: data.status,
    featured: data.featured,
    categoryId: data.category_id,
    creativeTeam: data.creative_team,
    metadata: data.metadata,
    publishedAt: data.published_at ? new Date(data.published_at) : null,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    seoKeywords: data.seo_keywords,
    images: projectImages,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('gallery_only', false) // Exclude gallery-only items from detail pages
    .single();

  if (!data) return undefined;

  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', data.id)
    .order('sort_order', { ascending: true });

  const projectImages: ProjectImage[] = (images || []).map(img => ({
    id: img.id,
    projectId: img.project_id,
    imageUrl: img.image_url,
    videoUrl: img.video_url,
    caption: img.caption,
    altText: img.alt_text,
    imageType: img.image_type,
    sortOrder: img.sort_order,
    createdAt: new Date(img.created_at),
  }));

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    designNotes: data.design_notes,
    coverImageUrl: data.cover_image,
    coverImageKey: data.cover_image_key,
    client: data.client,
    location: data.location,
    year: data.year,
    month: data.month,
    discipline: data.discipline,
    subcategory: data.subcategory,
    status: data.status,
    featured: data.featured,
    categoryId: data.category_id,
    creativeTeam: data.creative_team,
    metadata: data.metadata,
    publishedAt: data.published_at ? new Date(data.published_at) : null,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    seoKeywords: data.seo_keywords,
    images: projectImages,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export async function getProjectImages(projectId: number): Promise<any[]> {
  const { data } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order');

  if (!data) return [];

  return data.map(img => ({
    id: img.id,
    projectId: img.project_id,
    imageUrl: img.image_url,
    videoUrl: img.video_url,
    caption: img.caption,
    altText: img.alt_text,
    imageType: img.image_type,
    sortOrder: img.sort_order,
    createdAt: new Date(img.created_at),
  }));
}

export async function getProjectTags(projectId: number): Promise<Tag[]> {
  const { data } = await supabase
    .from('project_tags')
    .select('tag_id, tags(*)')
    .eq('project_id', projectId);

  if (!data) return [];

  return data
    .filter(pt => pt.tags)
    .map(pt => ({
      id: (pt.tags as any).id,
      name: (pt.tags as any).name,
      slug: (pt.tags as any).slug,
      createdAt: new Date((pt.tags as any).created_at),
    }));
}

// ============ NEWS OPERATIONS ============

export async function getAllNews(filters?: {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  categoryId?: number;
}): Promise<News[]> {
  let query = supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  const { data } = await query;
  if (!data) return [];

  return data.map(item => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content,
    coverImageUrl: item.cover_image,
    date: item.date ? new Date(item.date) : null,
    status: item.status,
    featured: item.featured,
    categoryId: item.category_id,
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    seoKeywords: item.seo_keywords,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
    publishedAt: item.published_at ? new Date(item.published_at) : null,
    location: item.location,
    blocks: item.blocks,
    externalLink: item.external_link,
    tags: item.tags,
  }));
}

export async function getNewsBySlug(slug: string): Promise<News | undefined> {
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    blocks: data.blocks || [],
    coverImageUrl: data.cover_image,
    coverImageKey: data.cover_image_key,
    location: data.location,
    date: data.date ? new Date(data.date) : null,
    status: data.status,
    featured: data.featured,
    categoryId: data.category_id,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    seoKeywords: data.seo_keywords,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    publishedAt: data.published_at ? new Date(data.published_at) : null,
    externalLink: data.external_link,
    tags: data.tags,
  };
}

export async function getNewsById(id: number): Promise<any> {
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    blocks: data.blocks || [],
    coverImageUrl: data.cover_image,
    coverImageKey: data.cover_image_key,
    location: data.location,
    date: data.date ? new Date(data.date) : null,
    status: data.status,
    featured: data.featured,
    categoryId: data.category_id,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    seoKeywords: data.seo_keywords,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    publishedAt: data.published_at ? new Date(data.published_at) : null,
  };
}

export async function getNewsTags(newsId: number): Promise<Tag[]> {
  const { data } = await supabase
    .from('news_tags')
    .select('tag_id, tags(*)')
    .eq('news_id', newsId);

  if (!data) return [];

  // Use as unknown as Tag to avoid any[] inference mismatch
  return data.map(item => (item.tags as unknown as Tag));
}

// ============ ARTICLE OPERATIONS ============

export async function getAllArticles(filters?: {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  categoryId?: number;
  authorId?: number;
}): Promise<any[]> {
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories!category_id(id, name, slug)
    `)
    .order('published_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters?.authorId) {
    query = query.eq('author_id', filters.authorId);
  }

  const { data } = await query;
  if (!data) return [];

  return data.map(article => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImageUrl: article.cover_image,
    readTime: article.read_time,
    status: article.status,
    featured: article.featured,
    categoryId: article.category_id,
    authorId: article.author_id,
    category: article.category ? {
      id: article.category.id,
      name: article.category.name,
      slug: article.category.slug,
    } : null,
    seoTitle: article.seo_title,
    seoDescription: article.seo_description,
    seoKeywords: article.seo_keywords,
    createdAt: new Date(article.created_at),
    updatedAt: new Date(article.updated_at),
    publishedAt: article.published_at ? new Date(article.published_at) : new Date(article.created_at),
  }));
}

export async function getArticleById(id: number): Promise<any> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImageUrl: data.cover_image,
    readTime: data.read_time,
    status: data.status,
    featured: data.featured,
    categoryId: data.category_id,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    seoKeywords: data.seo_keywords,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImageUrl: data.cover_image,
    status: data.status,
    featured: data.featured,
    categoryId: data.category_id,
    authorId: data.author_id,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    seoKeywords: data.seo_keywords,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    publishedAt: data.published_at ? new Date(data.published_at) : null,
    readTime: data.read_time,
    likes: data.likes || 0,
    views: data.views || 0,
  };
}

export async function getArticleTags(articleId: number): Promise<Tag[]> {
  const { data } = await supabase
    .from('article_tags')
    .select('tag_id, tags(*)')
    .eq('article_id', articleId);

  if (!data) return [];

  return data
    .filter(at => at.tags)
    .map(at => ({
      id: (at.tags as any).id,
      name: (at.tags as any).name,
      slug: (at.tags as any).slug,
      createdAt: new Date((at.tags as any).created_at),
    }));
}

// ============ SEARCH ============

export async function searchContent(query: string) {
  const searchTerm = `%${query}%`;

  const [projectsResult, newsResult, articlesResult] = await Promise.all([
    supabase
      .from('projects')
      .select('id, title, slug, excerpt')
      .eq('status', 'published')
      .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
      .limit(10),
    supabase
      .from('news')
      .select('id, title, slug, excerpt')
      .eq('status', 'published')
      .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
      .limit(10),
    supabase
      .from('articles')
      .select('id, title, slug, excerpt')
      .eq('status', 'published')
      .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
      .limit(10),
  ]);

  return {
    projects: projectsResult.data || [],
    news: newsResult.data || [],
    articles: articlesResult.data || [],
  };
}

// ============ COLLABORATOR OPERATIONS ============

export interface Collaborator {
  id: number;
  name: string;
  slug: string;
  role: string | null;
  bio: string | null;
  website: string | null;
  portfolioUrl: string | null;
  instagramUrl: string | null;
  instagramHandle: string | null;
  coverImage: string | null;
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  gallery: any[] | null;
  created_at: Date;
  updated_at?: Date;
}

export async function getAllCollaborators(filters?: {
  role?: string;
}): Promise<Collaborator[]> {
  let query = supabase
    .from('collaborators')
    .select('*')
    .order('name');

  if (filters?.role) {
    query = query.eq('role', filters.role);
  }

  const { data } = await query;
  if (!data) return [];

  return data.map(collab => ({
    id: collab.id,
    name: collab.name,
    role: collab.role,
    bio: collab.bio,
    portfolioUrl: collab.portfolioUrl,
    websiteUrl: collab.websiteUrl,
    instagramUrl: collab.instagramUrl,
    instagramHandle: collab.instagramHandle,
    created_at: new Date(collab.created_at),
  }));
}

export async function getCollaboratorBySlug(slug: string): Promise<Collaborator | undefined> {
  const { data } = await supabase
    .from('collaborators')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    name: data.name,
    role: data.role,
    bio: data.bio,
    portfolioUrl: data.portfolioUrl,
    websiteUrl: data.websiteUrl,
    instagramUrl: data.instagramUrl,
    instagramHandle: data.instagramHandle,
    created_at: new Date(data.created_at),
  };
}

export async function getCollaboratorProjects(collaboratorId: number) {
  const { data } = await supabase
    .from('project_collaborators')
    .select('project_id, projects(*)')
    .eq('collaborator_id', collaboratorId);

  if (!data) return [];

  return data
    .filter(pc => pc.projects)
    .map(pc => ({
      ...(pc.projects as any),
      created_at: new Date((pc.projects as any).created_at),
      updated_at: new Date((pc.projects as any).updated_at),
    }));
}

// ============ TUTORIAL OPERATIONS ============

export interface Tutorial {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  overview: string | null;
  content: string | null;
  category: string | null;
  difficulty: string | null;
  duration: number | null;
  video_url: string | null;
  cover_image: string | null;
  blocks: any[] | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  learning_objectives: string[] | null;
  key_concepts: any[] | null;
  pro_tips: string[] | null;
  shortcuts: any[] | null;
  common_pitfalls: string[] | null;
  transcript: any[] | null;
  related_resources: any[] | null;
  related_tutorials: any[] | null;
  created_at: Date;
  updated_at: Date;
}

export interface TutorialProgress {
  id: number;
  userId: number;
  tutorialSlug: string;
  completed: boolean;
  progressData: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllTutorials(filters?: {
  category?: string;
  difficultyLevel?: string;
}): Promise<Tutorial[]> {
  let query = supabase
    .from('tutorials')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.difficultyLevel) {
    query = query.eq('difficulty', filters.difficultyLevel);
  }

  const { data } = await query;
  if (!data) return [];

  return data.map(tutorial => ({
    ...tutorial,
    created_at: new Date(tutorial.created_at),
    updated_at: new Date(tutorial.updated_at),
  }));
}

export async function getTutorialProgressByUser(userId: number): Promise<TutorialProgress[]> {
  const { data } = await supabase
    .from('tutorial_progress')
    .select('*')
    .eq('user_id', userId);

  if (!data) return [];

  return data.map(progress => ({
    id: progress.id,
    userId: progress.user_id,
    tutorialSlug: progress.tutorial_slug,
    completed: progress.completed,
    progressData: progress.progress_data,
    createdAt: new Date(progress.created_at),
    updatedAt: new Date(progress.updated_at),
  }));
}

export async function getTutorialProgress(userId: number, tutorialSlug: string): Promise<TutorialProgress | undefined> {
  const { data } = await supabase
    .from('tutorial_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('tutorial_slug', tutorialSlug)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    userId: data.user_id,
    tutorialSlug: data.tutorial_slug,
    completed: data.completed,
    progressData: data.progress_data,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export async function createTutorialProgress(progressData: {
  userId: number;
  tutorialSlug: string;
  completed?: boolean;
  progressData?: string;
}): Promise<number> {
  const { data, error } = await supabase
    .from('tutorial_progress')
    .insert({
      user_id: progressData.userId,
      tutorial_slug: progressData.tutorialSlug,
      completed: progressData.completed ?? false,
      progress_data: progressData.progressData ?? null,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateTutorialProgress(
  id: number,
  updates: {
    completed?: boolean;
    progressData?: string;
  }
): Promise<void> {
  const updateData: any = {};
  if (updates.completed !== undefined) updateData.completed = updates.completed;
  if (updates.progressData !== undefined) updateData.progress_data = updates.progressData;

  await supabase
    .from('tutorial_progress')
    .update(updateData)
    .eq('id', id);
}

// ============ PAINT RECIPE OPERATIONS ============

export interface PaintRecipe {
  id: number;
  user_id: number;
  name: string;
  base_color: string | null;
  components: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function createPaintRecipe(recipe: {
  userId: number;
  name: string;
  baseColor?: string;
  components?: string;
  notes?: string;
}): Promise<number> {
  const { data, error } = await supabase
    .from('paint_recipes')
    .insert({
      user_id: recipe.userId,
      name: recipe.name,
      base_color: recipe.baseColor ?? null,
      components: recipe.components ?? null,
      notes: recipe.notes ?? null,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function getUserPaintRecipes(userId: number): Promise<PaintRecipe[]> {
  const { data } = await supabase
    .from('paint_recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (!data) return [];

  return data.map(recipe => ({
    ...recipe,
    created_at: new Date(recipe.created_at),
    updated_at: new Date(recipe.updated_at),
  }));
}

export async function getPaintRecipeById(id: number, userId: number): Promise<PaintRecipe | undefined> {
  const { data } = await supabase
    .from('paint_recipes')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (!data) return undefined;

  return {
    ...data,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
}

export async function updatePaintRecipe(
  id: number,
  userId: number,
  updates: {
    name?: string;
    baseColor?: string;
    components?: string;
    notes?: string;
  }
): Promise<void> {
  const updateData: any = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.baseColor !== undefined) updateData.base_color = updates.baseColor;
  if (updates.components !== undefined) updateData.components = updates.components;
  if (updates.notes !== undefined) updateData.notes = updates.notes;

  await supabase
    .from('paint_recipes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId);
}

export async function deletePaintRecipe(id: number, userId: number): Promise<void> {
  await supabase
    .from('paint_recipes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
}

// ============ SCENIC DIRECTORY OPERATIONS ============

export async function getAllScenicDirectory(filters?: {
  categorySlug?: string;
}): Promise<any[]> {
  let query = supabase
    .from('scenic_directory')
    .select('*')
    .order('name');

  if (filters?.categorySlug) {
    query = query.eq('category_slug', filters.categorySlug);
  }

  const { data } = await query;
  return data || [];
}


export async function incrementArticleViews(id: number) {
  const { data } = await supabase
    .from('articles')
    .select('views')
    .eq('id', id)
    .single();

  if (data) {
    await supabase
      .from('articles')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id);
  }
}

export async function incrementNewsViews(id: number) {
  const { data } = await supabase
    .from('news')
    .select('views')
    .eq('id', id)
    .single();

  if (data) {
    await supabase
      .from('news')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id);
  }
}

export async function incrementProjectViews(id: number) {
  const { data } = await supabase
    .from('projects')
    .select('views')
    .eq('id', id)
    .single();

  if (data) {
    await supabase
      .from('projects')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id);
  }
}


// ============ PROJECT CRUD OPERATIONS ============

export async function createProject(project: any) {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: project.title,
      slug: project.slug,
      discipline: project.discipline,
      subcategory: project.subcategory,
      year: project.year,
      month: project.month,
      venue: project.venue,
      location: project.location,
      excerpt: project.excerpt,
      cover_image: project.coverImageUrl,
      design_notes: project.designNotes,
      client: project.client,
      status: project.status || 'draft',
      featured: project.featured || false,
      category_id: project.categoryId,
      seo_title: project.seoTitle,
      seo_description: project.seoDescription,
      seo_keywords: project.seoKeywords,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateProject(id: number, project: any) {
  const updateData: any = {};

  if (project.title !== undefined) updateData.title = project.title;
  if (project.slug !== undefined) updateData.slug = project.slug;
  if (project.discipline !== undefined) updateData.discipline = project.discipline;
  if (project.subcategory !== undefined) updateData.subcategory = project.subcategory;
  if (project.year !== undefined) updateData.year = project.year;
  if (project.month !== undefined) updateData.month = project.month;
  if (project.venue !== undefined) updateData.venue = project.venue;
  if (project.location !== undefined) updateData.location = project.location;
  if (project.excerpt !== undefined) updateData.excerpt = project.excerpt;
  if (project.coverImageUrl !== undefined) updateData.cover_image = project.coverImageUrl;
  if (project.designNotes !== undefined) updateData.design_notes = project.designNotes;
  if (project.client !== undefined) updateData.client = project.client;
  if (project.status !== undefined) updateData.status = project.status;
  if (project.featured !== undefined) updateData.featured = project.featured;
  if (project.categoryId !== undefined) updateData.category_id = project.categoryId;
  if (project.seoTitle !== undefined) updateData.seo_title = project.seoTitle;
  if (project.seoDescription !== undefined) updateData.seo_description = project.seoDescription;
  if (project.seoKeywords !== undefined) updateData.seo_keywords = project.seoKeywords;

  const { error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteProject(id: number) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function addProjectImage(image: any) {
  const { data, error } = await supabase
    .from('project_images')
    .insert({
      project_id: image.projectId,
      title: image.title,
      image_url: image.imageUrl,
      image_key: image.imageKey,
      video_url: image.videoUrl,
      caption: image.caption,
      alt_text: image.altText,
      image_type: image.imageType || 'production',
      sort_order: image.sortOrder || 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateProjectImage(id: number, updates: any) {
  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.caption !== undefined) updateData.caption = updates.caption;
  if (updates.altText !== undefined) updateData.alt_text = updates.altText;
  if (updates.sortOrder !== undefined) updateData.sort_order = updates.sortOrder;
  if (updates.imageType !== undefined) updateData.image_type = updates.imageType;

  const { error } = await supabase
    .from('project_images')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function reorderProjectImages(orders: { id: number; sortOrder: number }[]) {
  // Supabase doesn't support bulk update easily in one go for different values
  // We'll iterate for now, or use a specific RPC if performance matters (likely fine for small galleries)
  for (const item of orders) {
    await supabase
      .from('project_images')
      .update({ sort_order: item.sortOrder })
      .eq('id', item.id);
  }
}

export async function deleteProjectImage(id: number) {
  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function deleteProjectImages(projectId: number) {
  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('project_id', projectId);

  if (error) throw error;
}

export async function setProjectTags(projectId: number, tagIds: number[]) {
  // Delete existing tags
  await supabase
    .from('project_tags')
    .delete()
    .eq('project_id', projectId);

  // Insert new tags
  if (tagIds.length > 0) {
    const { error } = await supabase
      .from('project_tags')
      .insert(tagIds.map(tagId => ({
        project_id: projectId,
        tag_id: tagId,
      })));

    if (error) throw error;
  }
}


// ============ NEWS CRUD OPERATIONS ============

export async function createNews(news: any) {
  const { data, error } = await supabase
    .from('news')
    .insert({
      title: news.title,
      slug: news.slug,
      excerpt: news.excerpt,
      content: news.content,
      cover_image: news.coverImageUrl,
      date: news.date,
      status: news.status || 'draft',
      featured: news.featured || false,
      category_id: news.categoryId,
      seo_title: news.seoTitle,
      seo_description: news.seoDescription,
      seo_keywords: news.seoKeywords,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateNews(id: number, news: any) {
  const updateData: any = {};

  if (news.title !== undefined) updateData.title = news.title;
  if (news.slug !== undefined) updateData.slug = news.slug;
  if (news.excerpt !== undefined) updateData.excerpt = news.excerpt;
  if (news.content !== undefined) updateData.content = news.content;
  if (news.coverImageUrl !== undefined) updateData.cover_image = news.coverImageUrl;
  if (news.date !== undefined) updateData.date = news.date;
  if (news.status !== undefined) updateData.status = news.status;
  if (news.featured !== undefined) updateData.featured = news.featured;
  if (news.categoryId !== undefined) updateData.category_id = news.categoryId;
  if (news.seoTitle !== undefined) updateData.seo_title = news.seoTitle;
  if (news.seoDescription !== undefined) updateData.seo_description = news.seoDescription;
  if (news.seoKeywords !== undefined) updateData.seo_keywords = news.seoKeywords;

  const { error } = await supabase
    .from('news')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteNews(id: number) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function setNewsTags(newsId: number, tagIds: number[]) {
  // Delete existing tags
  await supabase
    .from('news_tags')
    .delete()
    .eq('news_id', newsId);

  // Insert new tags
  if (tagIds.length > 0) {
    const { error } = await supabase
      .from('news_tags')
      .insert(tagIds.map(tagId => ({
        news_id: newsId,
        tag_id: tagId,
      })));

    if (error) throw error;
  }
}


// ============ ARTICLE CRUD OPERATIONS ============

export async function createArticle(article: any) {
  const { data, error } = await supabase
    .from('articles')
    .insert({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      cover_image: article.coverImageUrl,
      read_time: article.readTime,
      status: article.status || 'draft',
      featured: article.featured || false,
      category_id: article.categoryId,
      seo_title: article.seoTitle,
      seo_description: article.seoDescription,
      seo_keywords: article.seoKeywords,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateArticle(id: number, article: any) {
  const updateData: any = {};

  if (article.title !== undefined) updateData.title = article.title;
  if (article.slug !== undefined) updateData.slug = article.slug;
  if (article.excerpt !== undefined) updateData.excerpt = article.excerpt;
  if (article.content !== undefined) updateData.content = article.content;
  if (article.coverImageUrl !== undefined) updateData.cover_image = article.coverImageUrl;
  if (article.readTime !== undefined) updateData.read_time = article.readTime;
  if (article.status !== undefined) updateData.status = article.status;
  if (article.featured !== undefined) updateData.featured = article.featured;
  if (article.categoryId !== undefined) updateData.category_id = article.categoryId;
  if (article.seoTitle !== undefined) updateData.seo_title = article.seoTitle;
  if (article.seoDescription !== undefined) updateData.seo_description = article.seoDescription;
  if (article.seoKeywords !== undefined) updateData.seo_keywords = article.seoKeywords;

  const { error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteArticle(id: number) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function setArticleTags(articleId: number, tagIds: number[]) {
  // Delete existing tags
  await supabase
    .from('article_tags')
    .delete()
    .eq('article_id', articleId);

  // Insert new tags
  if (tagIds.length > 0) {
    const { error } = await supabase
      .from('article_tags')
      .insert(tagIds.map(tagId => ({
        article_id: articleId,
        tag_id: tagId,
      })));

    if (error) throw error;
  }
}

export async function toggleArticleLike(id: number, liked: boolean) {
  const { data } = await supabase
    .from('articles')
    .select('likes')
    .eq('id', id)
    .single();

  if (data) {
    const newLikes = liked ? (data.likes || 0) + 1 : Math.max((data.likes || 0) - 1, 0);
    await supabase
      .from('articles')
      .update({ likes: newLikes })
      .eq('id', id);
  }
}

// ============ COMMENT OPERATIONS ============

export interface Comment {
  id: number;
  articleId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    name: string;
    openId: string;
  }
}

export async function getArticleComments(articleId: number): Promise<Comment[]> {
  const { data } = await supabase
    .from('comments')
    .select('*, user:users(id, name, openId)')
    .eq('article_id', articleId)
    .order('created_at', { ascending: true });

  if (!data) return [];

  return data.map(c => ({
    id: c.id,
    articleId: c.article_id,
    userId: c.user_id,
    content: c.content,
    createdAt: new Date(c.created_at),
    updatedAt: new Date(c.updated_at),
    user: c.user
  }));
}

export async function createComment(comment: {
  articleId: number;
  userId: number;
  content: string;
}): Promise<number> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      article_id: comment.articleId,
      user_id: comment.userId,
      content: comment.content
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function getCommentById(id: number): Promise<Comment | undefined> {
  const { data } = await supabase
    .from('comments')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    articleId: data.article_id,
    userId: data.user_id,
    content: data.content,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

export async function deleteComment(id: number) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ TODO OPERATIONS ============

export async function getAllTodos(userId: string): Promise<Todo[]> {
  const { data } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (!data) return [];

  return data.map(todo => ({
    ...todo,
    created_at: new Date(todo.created_at),
  }));
}

export async function createTodo(exclude: any, todo: { text: string; userId: string }) {
  const { data, error } = await supabase
    .from('todos')
    .insert({
      text: todo.text,
      user_id: todo.userId
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function toggleTodo(id: number, userId: string): Promise<boolean> {
  // First get current status
  const { data: current } = await supabase
    .from('todos')
    .select('completed')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (!current) throw new Error("Todo not found");

  const { data, error } = await supabase
    .from('todos')
    .update({ completed: !current.completed })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data.completed;
}

export async function deleteTodo(id: number, userId: string) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}


export async function getTutorialById(id: number): Promise<Tutorial | undefined> {
  const { data } = await supabase
    .from('tutorials')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) return undefined;

  return {
    ...data,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
}

export async function getTutorialBySlug(slug: string): Promise<Tutorial | undefined> {
  const { data } = await supabase
    .from('tutorials')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data) return undefined;

  return {
    ...data,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
}

export async function createTutorial(tutorial: any) {
  const { data, error } = await supabase
    .from('tutorials')
    .insert({
      title: tutorial.title,
      slug: tutorial.slug,
      content: tutorial.content,
      blocks: tutorial.blocks,
      category: tutorial.category,
      difficulty: tutorial.difficulty,
      duration: tutorial.duration,
      video_url: tutorial.videoUrl,
      cover_image: tutorial.coverImageUrl,
      status: tutorial.status || 'draft',
      featured: tutorial.featured || false,
      seo_title: tutorial.seoTitle,
      seo_description: tutorial.seoDescription,
      seo_keywords: tutorial.seoKeywords,
      learning_objectives: tutorial.learningObjectives,
      key_concepts: tutorial.keyConcepts,
      pro_tips: tutorial.proTips,
      shortcuts: tutorial.shortcuts,
      common_pitfalls: tutorial.commonPitfalls,
      transcript: tutorial.transcript,
      related_resources: tutorial.relatedResources,
      related_tutorials: tutorial.relatedTutorials,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateTutorial(id: number, updates: any) {
  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.slug !== undefined) updateData.slug = updates.slug;
  if (updates.content !== undefined) updateData.content = updates.content;
  if (updates.blocks !== undefined) updateData.blocks = updates.blocks;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;
  if (updates.duration !== undefined) updateData.duration = updates.duration;
  if (updates.videoUrl !== undefined) updateData.video_url = updates.videoUrl;
  if (updates.coverImageUrl !== undefined) updateData.cover_image = updates.coverImageUrl;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.featured !== undefined) updateData.featured = updates.featured;
  if (updates.seoTitle !== undefined) updateData.seo_title = updates.seoTitle;
  if (updates.seoDescription !== undefined) updateData.seo_description = updates.seoDescription;
  if (updates.seoKeywords !== undefined) updateData.seo_keywords = updates.seoKeywords;
  if (updates.learningObjectives !== undefined) updateData.learning_objectives = updates.learningObjectives;
  if (updates.keyConcepts !== undefined) updateData.key_concepts = updates.keyConcepts;
  if (updates.proTips !== undefined) updateData.pro_tips = updates.proTips;
  if (updates.shortcuts !== undefined) updateData.shortcuts = updates.shortcuts;
  if (updates.commonPitfalls !== undefined) updateData.common_pitfalls = updates.commonPitfalls;
  if (updates.transcript !== undefined) updateData.transcript = updates.transcript;
  if (updates.relatedResources !== undefined) updateData.related_resources = updates.relatedResources;
  if (updates.relatedTutorials !== undefined) updateData.related_tutorials = updates.relatedTutorials;

  const { error } = await supabase
    .from('tutorials')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteTutorial(id: number) {
  const { error } = await supabase
    .from('tutorials')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ SCENIC DIRECTORY CRUD ============

export async function getScenicEntryById(id: number): Promise<any | undefined> {
  const { data } = await supabase
    .from('scenic_directory')
    .select('*')
    .eq('id', id)
    .single();

  return data || undefined;
}

export async function createScenicEntry(entry: any) {
  const { data, error } = await supabase
    .from('scenic_directory')
    .insert({
      name: entry.name,
      description: entry.description,
      category_name: entry.categoryName,
      category_slug: entry.categorySlug,
      url: entry.url,
      location: entry.location,
      cover_image: entry.coverImage,
      status: entry.status || 'published',
      featured: entry.featured || false,
      seo_title: entry.seoTitle,
      seo_description: entry.seoDescription,
      seo_keywords: entry.seoKeywords,
      gallery: entry.gallery || [],
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateScenicEntry(id: number, updates: any) {
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.categoryName !== undefined) updateData.category_name = updates.categoryName;
  if (updates.categorySlug !== undefined) updateData.category_slug = updates.categorySlug;
  if (updates.url !== undefined) updateData.url = updates.url;
  if (updates.location !== undefined) updateData.location = updates.location;
  if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.featured !== undefined) updateData.featured = updates.featured;
  if (updates.seoTitle !== undefined) updateData.seo_title = updates.seoTitle;
  if (updates.seoDescription !== undefined) updateData.seo_description = updates.seoDescription;
  if (updates.seoKeywords !== undefined) updateData.seo_keywords = updates.seoKeywords;
  if (updates.gallery !== undefined) updateData.gallery = updates.gallery;

  const { error } = await supabase
    .from('scenic_directory')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteScenicEntry(id: number) {
  const { error } = await supabase
    .from('scenic_directory')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ COLLABORATOR CRUD ============

export async function getCollaboratorById(id: number): Promise<Collaborator | undefined> {
  const { data } = await supabase
    .from('collaborators')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    name: data.name,
    role: data.role,
    bio: data.bio,
    portfolioUrl: data.portfolioUrl,
    websiteUrl: data.websiteUrl,
    instagramUrl: data.instagramUrl,
    instagramHandle: data.instagramHandle,
    created_at: new Date(data.created_at),
  };
}

export async function createCollaborator(collaborator: any) {
  const { data, error } = await supabase
    .from('collaborators')
    .insert({
      name: collaborator.name,
      role: collaborator.role,
      bio: collaborator.bio,
      portfolioUrl: collaborator.portfolioUrl,
      websiteUrl: collaborator.websiteUrl,
      instagramUrl: collaborator.instagramUrl,
      instagramHandle: collaborator.instagramHandle,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateCollaborator(id: number, updates: any) {
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.role !== undefined) updateData.role = updates.role;
  if (updates.bio !== undefined) updateData.bio = updates.bio;
  if (updates.portfolioUrl !== undefined) updateData.portfolioUrl = updates.portfolioUrl;
  if (updates.websiteUrl !== undefined) updateData.websiteUrl = updates.websiteUrl;
  if (updates.instagramUrl !== undefined) updateData.instagramUrl = updates.instagramUrl;
  if (updates.instagramHandle !== undefined) updateData.instagramHandle = updates.instagramHandle;

  const { error } = await supabase
    .from('collaborators')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCollaborator(id: number) {
  const { error } = await supabase
    .from('collaborators')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ RENDERING GALLERY OPERATIONS ============

export async function getRenderingGallery() {
  try {
    const { data: galleryItems, error: galleryError } = await supabase
      .from('rendering_gallery')
      .select('*')
      .order('sort_order', { ascending: true });

    if (galleryError) throw galleryError;
    if (!galleryItems || galleryItems.length === 0) return [];

    const projectIds = Array.from(new Set(galleryItems.map(item => item.project_id)));
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .in('id', projectIds);

    if (error) {
      console.warn('Error fetching projects for rendering gallery:', error);
      return [];
    }

    // Fetch images for these projects
    // Fetch images for these projects
    const { data: images, error: imagesError } = await supabase
      .from('project_images')
      .select('*')
      .in('project_id', projectIds)
      .order('sort_order', { ascending: true });

    if (imagesError) {
      console.warn('Error fetching images for rendering gallery:', imagesError);
    }

    const projectMap = new Map(projects?.map(p => [p.id, p]));
    // Group images by project ID
    const imagesMap = new Map<number, any[]>();
    if (images) {
      images.forEach(img => {
        const projectId = img.project_id;
        if (!imagesMap.has(projectId)) {
          imagesMap.set(projectId, []);
        }
        imagesMap.get(projectId)?.push(img);
      });
    }

    return galleryItems.map(item => {
      const project = projectMap.get(item.project_id);
      const projectImages = imagesMap.get(item.project_id) || [];

      return {
        id: item.id,
        projectId: item.project_id,
        sortOrder: item.sort_order,
        altText: item.alt_text,
        displayTitle: item.display_title,
        description: item.description,
        createdAt: new Date(item.created_at),
        project: project ? {
          id: project.id,
          title: project.title,
          slug: project.slug,
          excerpt: project.excerpt,
          designNotes: project.design_notes,
          coverImageUrl: project.cover_image,
          coverImageKey: project.cover_image_key,
          client: project.client,
          location: project.location,
          venue: project.venue,
          year: project.year,
          month: project.month,
          discipline: project.discipline,
          subcategory: project.subcategory,
          status: project.status,
          featured: project.featured,
          categoryId: project.category_id,
          creativeTeam: project.creative_team,
          metadata: project.metadata,
          publishedAt: project.published_at ? new Date(project.published_at) : null,
          seoTitle: project.seo_title,
          seoDescription: project.seo_description,
          seoKeywords: project.seo_keywords,
          images: projectImages.map((img: any) => ({
            id: img.id,
            imageUrl: img.image_url,
            caption: img.caption,
            altText: img.alt_text,
            sortOrder: img.sort_order
          }))
        } : undefined
      };
    });
  } catch (e) {
    console.error('Supabase Rendering Gallery Error:', e);
    return [];
  }
}

export async function addProjectToRenderingGallery(projectId: number, altText?: string, displayTitle?: string) {
  try {
    // Get max sort order
    const { data: maxItem } = await supabase
      .from('rendering_gallery')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxItem?.sort_order ?? 0) + 1;

    const { error } = await supabase
      .from('rendering_gallery')
      .insert({
        project_id: projectId,
        sort_order: nextOrder,
        alt_text: altText || null,
        display_title: displayTitle || null,
        description: null,
        active: true
      });

    if (error) throw error;
  } catch (e) {
    console.error('Failed to add to rendering gallery (Supabase)', e);
    throw e;
  }
}

export async function removeProjectFromRenderingGallery(galleryId: number) {
  const { error } = await supabase
    .from('rendering_gallery')
    .delete()
    .eq('id', galleryId);

  if (error) throw error;
}

export async function updateRenderingGalleryOrder(items: { id: number; sortOrder: number }[]) {
  // Supabase doesn't support bulk update with different values easily in one query without RPC
  // So we'll do promise.all for now, or sequential. Sequential is safer for rate limits.
  for (const item of items) {
    await supabase
      .from('rendering_gallery')
      .update({ sort_order: item.sortOrder })
      .eq('id', item.id);
  }
}

export async function updateRenderingGalleryMetadata(id: number, active: boolean, altText?: string, displayTitle?: string, description?: string) {
  const updateData: any = { active };
  if (altText !== undefined) updateData.alt_text = altText;
  if (displayTitle !== undefined) updateData.display_title = displayTitle;
  if (description !== undefined) updateData.description = description;

  const { error } = await supabase
    .from('rendering_gallery')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

// ============ MODEL GALLERY OPERATIONS ============

export async function getModelGallery(): Promise<RenderingGalleryItem[]> {
  try {
    const { data: galleryItems, error: galleryError } = await supabase
      .from('model_gallery')
      .select('*')
      .order('sort_order', { ascending: true });

    if (galleryError) throw galleryError;
    if (!galleryItems || galleryItems.length === 0) return [];

    const projectIds = Array.from(new Set(galleryItems.map(item => item.project_id)));
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .in('id', projectIds);

    if (error) {
      console.warn('Error fetching projects for model gallery:', error);
      return [];
    }

    const { data: images, error: imagesError } = await supabase
      .from('project_images')
      .select('*')
      .in('project_id', projectIds)
      .order('sort_order', { ascending: true });

    if (imagesError) {
      console.warn('Error fetching images for model gallery:', imagesError);
    }

    const projectMap = new Map(projects?.map(p => [p.id, p]));
    const imagesMap = new Map<number, any[]>();
    if (images) {
      images.forEach(img => {
        const projectId = img.project_id;
        if (!imagesMap.has(projectId)) {
          imagesMap.set(projectId, []);
        }
        imagesMap.get(projectId)?.push(img);
      });
    }

    return galleryItems.map(item => {
      const project = projectMap.get(item.project_id);
      const projectImages = imagesMap.get(item.project_id) || [];
      return {
        id: item.id,
        projectId: item.project_id,
        sortOrder: item.sort_order,
        altText: item.alt_text,
        displayTitle: item.display_title,
        description: null,
        createdAt: new Date(item.created_at),
        project: project ? {
          id: project.id,
          title: project.title,
          slug: project.slug,
          excerpt: project.excerpt,
          designNotes: project.design_notes,
          coverImageUrl: project.cover_image,
          coverImageKey: project.cover_image_key,
          client: project.client,
          location: project.location,
          venue: project.venue,
          year: project.year,
          month: project.month,
          discipline: project.discipline,
          subcategory: project.subcategory,
          status: project.status,
          featured: project.featured,
          categoryId: project.category_id,
          creativeTeam: project.creative_team,
          metadata: project.metadata,
          publishedAt: project.published_at ? new Date(project.published_at) : null,
          seoTitle: project.seo_title,
          seoDescription: project.seo_description,
          seoKeywords: project.seo_keywords,
          images: projectImages.map((img: any) => ({
            id: img.id,
            imageUrl: img.image_url,
            caption: img.caption,
            altText: img.alt_text,
            sortOrder: img.sort_order
          })),
          createdAt: new Date(project.created_at),
          updatedAt: new Date(project.updated_at),
        } : undefined,
      };
    });
  } catch (e) {
    console.error('Supabase Model Gallery Error:', e);
    return [];
  }
}

export async function addProjectToModelGallery(projectId: number, altText?: string, displayTitle?: string) {
  try {
    const { data: maxItem } = await supabase
      .from('model_gallery')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxItem?.sort_order ?? 0) + 1;

    const { error } = await supabase
      .from('model_gallery')
      .insert({
        project_id: projectId,
        sort_order: nextOrder,
        alt_text: altText || null,
        display_title: displayTitle || null,
        active: true
      });

    if (error) throw error;
  } catch (e) {
    console.error('Failed to add to model gallery (Supabase)', e);
    throw e;
  }
}

export async function removeProjectFromModelGallery(galleryId: number) {
  const { error } = await supabase
    .from('model_gallery')
    .delete()
    .eq('id', galleryId);

  if (error) throw error;
}

export async function updateModelGalleryOrder(items: { id: number; sortOrder: number }[]) {
  for (const item of items) {
    await supabase
      .from('model_gallery')
      .update({ sort_order: item.sortOrder })
      .eq('id', item.id);
  }
}

export async function updateModelGalleryMetadata(id: number, active: boolean, altText?: string, displayTitle?: string) {
  const updateData: any = { active };
  if (altText !== undefined) updateData.alt_text = altText;
  if (displayTitle !== undefined) updateData.display_title = displayTitle;

  const { error } = await supabase
    .from('model_gallery')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

// ============ EXPERIENTIAL GALLERY OPERATIONS ============

export async function getExperientialGallery(): Promise<RenderingGalleryItem[]> {
  try {
    const { data: galleryItems, error: galleryError } = await supabase
      .from('experiential_gallery')
      .select('*')
      .order('sort_order', { ascending: true });

    if (galleryError) throw galleryError;
    if (!galleryItems || galleryItems.length === 0) return [];

    const projectIds = Array.from(new Set(galleryItems.map(item => item.project_id)));
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .in('id', projectIds);

    if (error) {
      console.warn('Error fetching projects for experiential gallery:', error);
      return [];
    }

    const projectMap = new Map(projects?.map(p => [p.id, p]));

    return galleryItems.map(item => {
      const project = projectMap.get(item.project_id);
      return {
        id: item.id,
        projectId: item.project_id,
        sortOrder: item.sort_order,
        altText: item.alt_text,
        displayTitle: item.display_title,
        description: null,
        createdAt: new Date(item.created_at),
        project: project ? {
          id: project.id,
          title: project.title,
          slug: project.slug,
          excerpt: project.excerpt,
          designNotes: project.design_notes,
          coverImageUrl: project.cover_image,
          coverImageKey: project.cover_image_key,
          client: project.client,
          location: project.location,
          venue: project.venue,
          year: project.year,
          month: project.month,
          discipline: project.discipline,
          subcategory: project.subcategory,
          status: project.status,
          featured: project.featured,
          categoryId: project.category_id,
          creativeTeam: project.creative_team,
          metadata: project.metadata,
          publishedAt: project.published_at ? new Date(project.published_at) : null,
          seoTitle: project.seo_title,
          seoDescription: project.seo_description,
          seoKeywords: project.seo_keywords,
          images: [],
          createdAt: new Date(project.created_at),
          updatedAt: new Date(project.updated_at),
        } : undefined,
      };
    });
  } catch (e) {
    console.error('Supabase Experiential Gallery Error:', e);
    return [];
  }
}

export async function addProjectToExperientialGallery(projectId: number, altText?: string, displayTitle?: string) {
  try {
    const { data: maxItem } = await supabase
      .from('experiential_gallery')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxItem?.sort_order ?? 0) + 1;

    const { error } = await supabase
      .from('experiential_gallery')
      .insert({
        project_id: projectId,
        sort_order: nextOrder,
        alt_text: altText || null,
        display_title: displayTitle || null,
        active: true
      });

    if (error) throw error;
  } catch (e) {
    console.error('Failed to add to experiential gallery (Supabase)', e);
    throw e;
  }
}

export async function removeProjectFromExperientialGallery(galleryId: number) {
  const { error } = await supabase
    .from('experiential_gallery')
    .delete()
    .eq('id', galleryId);

  if (error) throw error;
}

export async function updateExperientialGalleryOrder(items: { id: number; sortOrder: number }[]) {
  for (const item of items) {
    await supabase
      .from('experiential_gallery')
      .update({ sort_order: item.sortOrder })
      .eq('id', item.id);
  }
}

export async function updateExperientialGalleryMetadata(id: number, active: boolean, altText?: string, displayTitle?: string) {
  const updateData: any = { active };
  if (altText !== undefined) updateData.alt_text = altText;
  if (displayTitle !== undefined) updateData.display_title = displayTitle;

  const { error } = await supabase
    .from('experiential_gallery')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

// ============ EXPERIENTIAL PROCESS GALLERY OPERATIONS ============

export type ProcessGalleryCategory = 
  // Workflow showcase images (single per category)
  | 'workflow-toolkit' 
  | 'workflow-drawing' 
  | 'workflow-modeling' 
  | 'workflow-buildability'
  // Portfolio galleries (multiple images per category)
  | 'rendering' 
  | 'technical-drawing' 
  | 'live-events';

export interface ProcessGalleryItem {
  id: number;
  category: ProcessGalleryCategory;
  projectId: number | null;
  imageUrl: string;
  imageKey: string | null;
  videoUrl: string | null;
  altText: string | null;
  displayTitle: string | null;
  description: string | null;
  year: number | null;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  project?: {
    id: number;
    title: string;
    coverImageUrl: string | null;
    year: number | null;
  };
}

export async function getProcessGalleryByCategory(category?: ProcessGalleryCategory): Promise<ProcessGalleryItem[]> {
  try {
    let query = supabase
      .from('experiential_process_gallery')
      .select(`
        *,
        project:projects(id, title, slug, cover_image, year)
      `)
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data) return [];

    return data.map(item => ({
      id: item.id,
      category: item.category as ProcessGalleryCategory,
      projectId: item.project_id || null,
      imageUrl: item.image_url,
      imageKey: item.image_key,
      videoUrl: item.video_url || null,
      altText: item.alt_text,
      displayTitle: item.display_title,
      description: item.description,
      year: item.year || null,
      sortOrder: item.sort_order,
      active: item.active,
      createdAt: new Date(item.created_at),
      project: item.project ? {
        id: item.project.id,
        title: item.project.title,
        slug: item.project.slug,
        coverImageUrl: item.project.cover_image,
        year: item.project.year
      } : undefined
    }));
  } catch (e) {
    console.error('Supabase Process Gallery Error:', e);
    return [];
  }
}

export async function getAllProcessGallery(): Promise<ProcessGalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from('experiential_process_gallery')
      .select(`
        *,
        project:projects(id, title, slug, cover_image, year)
      `)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase getAllProcessGallery error:', error);
      throw error;
    }
    if (!data) return [];

    console.log(`[getAllProcessGallery] Found ${data.length} items`);

    return data.map(item => ({
      id: item.id,
      category: item.category as ProcessGalleryCategory,
      projectId: item.project_id || null,
      imageUrl: item.image_url || '',
      imageKey: item.image_key,
      videoUrl: item.video_url || null,
      altText: item.alt_text,
      displayTitle: item.display_title,
      description: item.description,
      year: item.year || null,
      sortOrder: item.sort_order,
      active: item.active,
      createdAt: new Date(item.created_at),
      project: item.project ? {
        id: item.project.id,
        title: item.project.title,
        slug: item.project.slug,
        coverImageUrl: item.project.cover_image,
        year: item.project.year
      } : undefined
    }));
  } catch (e) {
    console.error('Supabase Process Gallery Error:', e);
    throw e;
  }
}

export async function addProcessGalleryItem(
  category: ProcessGalleryCategory,
  imageUrl: string,
  imageKey?: string,
  videoUrl?: string,
  altText?: string,
  displayTitle?: string,
  description?: string,
  projectId?: number
) {
  try {
    // Get max sort order for this category
    const { data: maxItem } = await supabase
      .from('experiential_process_gallery')
      .select('sort_order')
      .eq('category', category)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxItem?.sort_order ?? 0) + 1;

    const { data, error } = await supabase
      .from('experiential_process_gallery')
      .insert({
        category,
        project_id: projectId || null,
        image_url: imageUrl,
        image_key: imageKey || null,
        video_url: videoUrl || null,
        alt_text: altText || null,
        display_title: displayTitle || null,
        description: description || null,
        sort_order: nextOrder,
        active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Failed to add process gallery item:', e);
    throw e;
  }
}

export async function updateProcessGalleryItem(
  id: number,
  updates: {
    altText?: string;
    displayTitle?: string;
    description?: string;
    videoUrl?: string;
    year?: number;
    active?: boolean;
  }
) {
  const updateData: any = {};
  if (updates.altText !== undefined) updateData.alt_text = updates.altText;
  if (updates.displayTitle !== undefined) updateData.display_title = updates.displayTitle;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.videoUrl !== undefined) updateData.video_url = updates.videoUrl;
  if (updates.year !== undefined) updateData.year = updates.year;
  if (updates.active !== undefined) updateData.active = updates.active;

  const { error } = await supabase
    .from('experiential_process_gallery')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteProcessGalleryItem(id: number) {
  const { error } = await supabase
    .from('experiential_process_gallery')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateProcessGalleryOrder(items: { id: number; sortOrder: number }[]) {
  for (const item of items) {
    await supabase
      .from('experiential_process_gallery')
      .update({ sort_order: item.sortOrder })
      .eq('id', item.id);
  }
}

// ============ EXPERIENTIAL BRANDS OPERATIONS ============

export interface ExperientialBrand {
  id: number;
  name: string;
  logoUrl: string | null;
  logoKey: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
}

export async function getExperientialBrands(): Promise<ExperientialBrand[]> {
  try {
    const { data, error } = await supabase
      .from('experiential_brands')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map(item => ({
      id: item.id,
      name: item.name,
      logoUrl: item.logo_url,
      logoKey: item.logo_key,
      websiteUrl: item.website_url,
      sortOrder: item.sort_order,
      active: item.active,
      createdAt: new Date(item.created_at),
    }));
  } catch (e) {
    console.error('Supabase Brands Error:', e);
    return [];
  }
}

export async function getAllExperientialBrands(): Promise<ExperientialBrand[]> {
  try {
    const { data, error } = await supabase
      .from('experiential_brands')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map(item => ({
      id: item.id,
      name: item.name,
      logoUrl: item.logo_url,
      logoKey: item.logo_key,
      websiteUrl: item.website_url,
      sortOrder: item.sort_order,
      active: item.active,
      createdAt: new Date(item.created_at),
    }));
  } catch (e) {
    console.error('Supabase Brands Error:', e);
    return [];
  }
}

export async function addExperientialBrand(name: string, logoUrl?: string, logoKey?: string, websiteUrl?: string) {
  try {
    const { data: maxItem } = await supabase
      .from('experiential_brands')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxItem?.sort_order ?? 0) + 1;

    const { data, error } = await supabase
      .from('experiential_brands')
      .insert({
        name,
        logo_url: logoUrl || null,
        logo_key: logoKey || null,
        website_url: websiteUrl || null,
        sort_order: nextOrder,
        active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Failed to add brand:', e);
    throw e;
  }
}

export async function updateExperientialBrand(
  id: number,
  updates: {
    name?: string;
    logoUrl?: string;
    logoKey?: string;
    websiteUrl?: string;
    active?: boolean;
  }
) {
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.logoUrl !== undefined) updateData.logo_url = updates.logoUrl;
  if (updates.logoKey !== undefined) updateData.logo_key = updates.logoKey;
  if (updates.websiteUrl !== undefined) updateData.website_url = updates.websiteUrl;
  if (updates.active !== undefined) updateData.active = updates.active;

  const { error } = await supabase
    .from('experiential_brands')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteExperientialBrand(id: number) {
  const { error } = await supabase
    .from('experiential_brands')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateExperientialBrandsOrder(items: { id: number; sortOrder: number }[]) {
  for (const item of items) {
    await supabase
      .from('experiential_brands')
      .update({ sort_order: item.sortOrder })
      .eq('id', item.id);
  }
}

// ============ SITE SETTINGS OPERATIONS ============

export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) return null;
    return data?.value || null;
  } catch (e) {
    return null;
  }
}

export async function setSiteSetting(key: string, value: string | null) {
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) throw error;
  } catch (e) {
    console.error('Failed to set site setting:', e);
    throw e;
  }
}
