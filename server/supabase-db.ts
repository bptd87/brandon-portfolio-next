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
    createdAt: new Date(proj.created_at),
    updatedAt: new Date(proj.updated_at),
  }));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const { data } = await supabase
    .from('projects')
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

export async function getProjectImages(projectId: number): Promise<ProjectImage[]> {
  const { data } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order');

  if (!data) return [];

  return data.map(img => ({
    ...img,
    created_at: new Date(img.created_at),
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
    ...item,
    date: item.date ? new Date(item.date) : null,
    created_at: new Date(item.created_at),
    updated_at: new Date(item.updated_at),
    published_at: item.published_at ? new Date(item.published_at) : null,
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
    ...data,
    date: data.date ? new Date(data.date) : null,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
    published_at: data.published_at ? new Date(data.published_at) : null,
  };
}

// ============ ARTICLE OPERATIONS ============

export async function getAllArticles(filters?: {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  categoryId?: number;
  authorId?: number;
}): Promise<Article[]> {
  let query = supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false });

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
    ...article,
    created_at: new Date(article.created_at),
    updated_at: new Date(article.updated_at),
    published_at: article.published_at ? new Date(article.published_at) : null,
  }));
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data) return undefined;

  return {
    ...data,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
    published_at: data.published_at ? new Date(data.published_at) : null,
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
