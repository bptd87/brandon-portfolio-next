import { supabase } from './supabase';
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

export interface Category {
  id: number;
  name: string;
  slug: string;
  type: 'project' | 'news' | 'article';
  description: string | null;
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
  design_notes: string | null;
  cover_image: string | null;
  client: string | null;
  location: string | null;
  year: number | null;
  month: number | null;
  discipline: string | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  category_id: number | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectImage {
  id: number;
  project_id: number;
  image_url: string | null;
  video_url: string | null;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: Date;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category_id: number | null;
  cover_image: string | null;
  location: string | null;
  date: Date | null;
  blocks: string | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  external_link: string | null;
  tags: string | null;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category_id: number | null;
  cover_image: string | null;
  author_id: number | null;
  read_time: number | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  likes: number;
  views: number;
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
    .eq('openId', user.openId)
    .single();

  const userData: any = {
    openId: user.openId,
    name: user.name ?? null,
    email: user.email ?? null,
    loginMethod: user.loginMethod ?? null,
    lastSignedIn: user.lastSignedIn?.toISOString() ?? new Date().toISOString(),
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
      .eq('openId', user.openId);
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
    .eq('openId', openId)
    .single();

  if (!data) return undefined;

  return {
    ...data,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    lastSignedIn: data.last_signed_in ? new Date(data.last_signed_in) : null,
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

// ============ PROJECT OPERATIONS ============

export async function getAllProjects(filters?: {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  categoryId?: number;
  year?: number;
  discipline?: string;
}): Promise<any[]> {
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
    query = query.eq('discipline', filters.discipline);
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
  const imagesByProject = new Map<number, any[]>();
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
    client: proj.client,
    location: proj.location,
    year: proj.year,
    month: proj.month,
    discipline: proj.discipline,
    status: proj.status,
    featured: proj.featured,
    categoryId: proj.category_id,
    seoTitle: proj.seo_title,
    seoDescription: proj.seo_description,
    seoKeywords: proj.seo_keywords,
    images: imagesByProject.get(proj.id) || [],
    createdAt: new Date(proj.created_at),
    updatedAt: new Date(proj.updated_at),
  }));
}

export async function getProjectById(id: number): Promise<any> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    discipline: data.discipline,
    year: data.year,
    month: data.month,
    venue: data.venue,
    location: data.location,
    excerpt: data.excerpt,
    coverImageUrl: data.cover_image,
    designNotes: data.design_notes,
    client: data.client,
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

export async function getProjectBySlug(slug: string): Promise<any> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    designNotes: data.design_notes,
    coverImageUrl: data.cover_image,
    client: data.client,
    location: data.location,
    year: data.year,
    month: data.month,
    discipline: data.discipline,
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
}): Promise<any[]> {
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
  }));
}

export async function getNewsBySlug(slug: string): Promise<any> {
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
    coverImageUrl: data.cover_image,
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
    coverImageUrl: data.cover_image,
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

  return data.map(item => item.tags as Tag);
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
    .order('created_at', { ascending: false });

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

export async function getArticleBySlug(slug: string): Promise<any> {
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
  created_at: Date;
}

export async function getAllCollaborators(filters?: {
  role?: string;
  featured?: boolean;
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
    ...collab,
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
    ...data,
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
  content: string | null;
  category: string | null;
  difficulty: string | null;
  duration: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface TutorialProgress {
  id: number;
  user_id: number;
  tutorial_slug: string;
  completed: boolean;
  progress_data: string | null;
  created_at: Date;
  updated_at: Date;
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
    ...progress,
    created_at: new Date(progress.created_at),
    updated_at: new Date(progress.updated_at),
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
    ...data,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
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
      image_url: image.imageUrl,
      video_url: image.videoUrl,
      caption: image.caption,
      category: image.category,
      sort_order: image.sortOrder || 0,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data.id;
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
  const { error} = await supabase
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
