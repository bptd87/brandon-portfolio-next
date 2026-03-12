import { supabase } from './supabase';

export { supabase };
import { ENV } from './_core/env';
import type { Article, Category, News, Project, ProjectImage, RenderingGalleryItem, Tag, Todo, User } from './dbTypes';
export type { Article, Category, News, Project, ProjectImage, RenderingGalleryItem, Tag, Todo, User } from './dbTypes';

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
  
  // Sort by published_at descending
  const news = data
    .map(nt => nt.news)
    .filter(Boolean)
    .sort((a: any, b: any) => {
      const dateA = new Date(a.published_at || a.date || a.created_at);
      const dateB = new Date(b.published_at || b.date || b.created_at);
      return dateB.getTime() - dateA.getTime();
    })
    .map((n: any) => ({
      ...n,
      createdAt: new Date(n.created_at),
      updatedAt: new Date(n.updated_at),
      publishedAt: n.published_at ? new Date(n.published_at) : new Date(n.date || n.created_at)
    }));
  
  return news;
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
    externalArticles: proj.external_articles,
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
    externalArticles: data.external_articles,
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
  const normalizedSlug = slug.trim().toLowerCase();

  const { data: exactData } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', normalizedSlug)
    .eq('gallery_only', false) // Exclude gallery-only items from detail pages
    .single();

  const { data } = exactData
    ? { data: exactData }
    : await supabase
        .from('projects')
        .select('*')
        .ilike('slug', normalizedSlug)
        .eq('gallery_only', false)
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
    externalArticles: data.external_articles,
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
    .select(`
      id,
      title,
      slug,
      subtitle,
      excerpt,
      cover_image,
      cover_image_alt_text,
      cover_image_focal_point,
      layout_variant,
      date,
      status,
      featured,
      category_id,
      seo_title,
      seo_description,
      seo_keywords,
      created_at,
      updated_at,
      published_at,
      location,
      external_link
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

  let { data, error } = await query;
  if (error) {
    console.error('[getAllNews] primary query failed, retrying with fallback select:', error.message);
    let fallbackQuery = supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false });

    if (filters?.status) {
      fallbackQuery = fallbackQuery.eq('status', filters.status);
    }
    if (filters?.featured !== undefined) {
      fallbackQuery = fallbackQuery.eq('featured', filters.featured);
    }
    if (filters?.categoryId) {
      fallbackQuery = fallbackQuery.eq('category_id', filters.categoryId);
    }

    const fallback = await fallbackQuery;
    data = fallback.data as any[] | null;
    error = fallback.error;
  }

  if (error) {
    console.error('[getAllNews] fallback query failed:', error.message);
    throw error;
  }
  if (!data) return [];

  return data.map(item => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    subtitle: item.subtitle,
    excerpt: item.excerpt,
    content: null,
    coverImageUrl: item.cover_image,
    coverImageAltText: item.cover_image_alt_text,
    coverImageFocalPoint: item.cover_image_focal_point,
    layoutVariant: item.layout_variant,
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
    blocks: [],
    externalLink: item.external_link,
    tags: null,
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
    subtitle: data.subtitle,
    excerpt: data.excerpt,
    content: data.content,
    blocks: data.blocks || [],
    coverImageUrl: data.cover_image,
    coverImageKey: data.cover_image_key,
    coverImageAltText: data.cover_image_alt_text,
    coverImageFocalPoint: data.cover_image_focal_point,
    layoutVariant: data.layout_variant,
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
    subtitle: data.subtitle,
    excerpt: data.excerpt,
    content: data.content,
    blocks: data.blocks || [],
    coverImageUrl: data.cover_image,
    coverImageKey: data.cover_image_key,
    coverImageAltText: data.cover_image_alt_text,
    coverImageFocalPoint: data.cover_image_focal_point,
    layoutVariant: data.layout_variant,
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
  };
}

export async function getNewsRelatedLinks(newsId: number) {
  const { data, error } = await supabase
    .from('news_related_links')
    .select('id, label, url, link_type, sort_order')
    .eq('news_id', newsId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return data.map((row: any) => ({
    id: row.id,
    label: row.label,
    url: row.url,
    linkType: row.link_type,
    sortOrder: row.sort_order,
  }));
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
      id,
      title,
      slug,
      excerpt,
      cover_image,
      read_time,
      status,
      featured,
      category_id,
      seo_title,
      seo_description,
      seo_keywords,
      created_at,
      updated_at,
      published_at,
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

  let { data, error } = await query;
  if (error) {
    console.error('[getAllArticles] primary query failed, retrying with fallback select:', error.message);
    const missingAuthorColumn = /author_id/i.test(error.message || '');
    let fallbackQuery = supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (filters?.status) {
      fallbackQuery = fallbackQuery.eq('status', filters.status);
    }
    if (filters?.featured !== undefined) {
      fallbackQuery = fallbackQuery.eq('featured', filters.featured);
    }
    if (filters?.categoryId) {
      fallbackQuery = fallbackQuery.eq('category_id', filters.categoryId);
    }
    if (filters?.authorId && !missingAuthorColumn) {
      fallbackQuery = fallbackQuery.eq('author_id', filters.authorId);
    }

    const fallback = await fallbackQuery;
    data = fallback.data as any[] | null;
    error = fallback.error;
  }

  if (error) {
    console.error('[getAllArticles] fallback query failed:', error.message);
    throw error;
  }
  if (!data) return [];

  const categoryIds = Array.from(
    new Set(
      data
        .map((article: any) => article.category_id)
        .filter((id: unknown): id is number => typeof id === 'number')
    )
  );

  let categoryLookup = new Map<number, { id: number; name: string; slug: string }>();
  if (categoryIds.length > 0) {
    const { data: categoryRows, error: categoryError } = await supabase
      .from('categories')
      .select('id,name,slug')
      .in('id', categoryIds);

    if (categoryError) {
      console.error('[getAllArticles] category lookup failed:', categoryError.message);
    } else if (categoryRows) {
      categoryLookup = new Map(
        categoryRows.map((c: any) => [c.id, { id: c.id, name: c.name, slug: c.slug }])
      );
    }
  }

  return data.map(article => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: null,
    coverImageUrl: article.cover_image,
    readTime: article.read_time,
    status: article.status,
    featured: article.featured,
    categoryId: article.category_id,
    authorId: (article as any).author_id ?? null,
    category: (() => {
      const categoryRaw = Array.isArray((article as any).category) ? (article as any).category[0] : (article as any).category;
      if (categoryRaw) {
        return {
          id: categoryRaw.id,
          name: categoryRaw.name,
          slug: categoryRaw.slug,
        };
      }
      if (typeof article.category_id === 'number') {
        const lookedUp = categoryLookup.get(article.category_id);
        if (lookedUp) return lookedUp;
      }
      return null;
    })(),
    seoTitle: article.seo_title,
    seoDescription: article.seo_description,
    seoKeywords: article.seo_keywords,
    createdAt: new Date(article.created_at),
    updatedAt: new Date(article.updated_at),
    publishedAt: article.published_at ? new Date(article.published_at) : null,
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
    publishedAt: data.published_at ? new Date(data.published_at) : null,
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

function coerceInstagramUrl(handleOrUrl: string | null | undefined): string | null {
  if (!handleOrUrl) return null;
  const trimmed = handleOrUrl.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const normalizedHandle = trimmed.replace(/^@+/, '').trim();
  if (!normalizedHandle) return null;
  return `https://www.instagram.com/${normalizedHandle}/`;
}

function coerceInstagramHandle(handleOrUrl: string | null | undefined): string | null {
  if (!handleOrUrl) return null;
  const trimmed = handleOrUrl.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const firstSegment = url.pathname.split('/').filter(Boolean)[0];
      return firstSegment ? `@${firstSegment}` : null;
    } catch {
      return null;
    }
  }
  const normalized = trimmed.replace(/^@+/, '').trim();
  return normalized ? `@${normalized}` : null;
}

function mapCollaboratorRecord(collab: any): Collaborator {
  const website = collab.website ?? collab.website_url ?? collab.websiteUrl ?? null;
  const portfolioUrl = collab.portfolio_url ?? collab.portfolioUrl ?? null;
  const rawInstagramUrl = collab.instagram_url ?? collab.instagramUrl ?? null;
  const rawInstagramHandle = collab.instagram_handle ?? collab.instagramHandle ?? null;
  const instagramUrl = rawInstagramUrl || coerceInstagramUrl(rawInstagramHandle);
  const instagramHandle = coerceInstagramHandle(rawInstagramHandle) || coerceInstagramHandle(rawInstagramUrl);
  const slug =
    collab.slug ||
    String(collab.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  return {
    id: collab.id,
    name: collab.name,
    slug,
    role: collab.role,
    bio: collab.bio,
    website,
    portfolioUrl,
    instagramUrl,
    instagramHandle,
    coverImage: collab.cover_image ?? collab.coverImage ?? null,
    status: collab.status || 'published',
    featured: collab.featured || false,
    seoTitle: collab.seo_title ?? collab.seoTitle ?? null,
    seoDescription: collab.seo_description ?? collab.seoDescription ?? null,
    seoKeywords: collab.seo_keywords ?? collab.seoKeywords ?? null,
    gallery: collab.gallery,
    created_at: new Date(collab.created_at),
    updated_at: collab.updated_at ? new Date(collab.updated_at) : undefined,
  };
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

  return data.map(mapCollaboratorRecord) as Collaborator[];
}

export async function getCollaboratorBySlug(slug: string): Promise<Collaborator | undefined> {
  const bySlug = await supabase
    .from('collaborators')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!bySlug.error && bySlug.data) return mapCollaboratorRecord(bySlug.data);

  if ((bySlug.error as any)?.code !== '42703') return undefined;

  const { data } = await supabase
    .from('collaborators')
    .select('*');

  const found = (data || []).find((item: any) => {
    const fallbackSlug = String(item.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return fallbackSlug === slug;
  });

  return found ? mapCollaboratorRecord(found) : undefined;
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
  status?: 'draft' | 'published' | 'archived';
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
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[getAllTutorials] query failed:', error.message);
    throw error;
  }
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

function extractMissingColumn(error: any): string | null {
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`;
  const patterns = [
    /Could not find the '([^']+)' column/i,
    /column ["']?([a-zA-Z0-9_]+)["']? does not exist/i,
    /schema cache.*column ["']?([a-zA-Z0-9_]+)["']?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function remapProjectColumn(payload: Record<string, any>, missingColumn: string): boolean {
  const remap: Record<string, string> = {
    cover_image: 'cover_image_url',
    cover_image_key: 'cover_image_key',
    cover_image_url: 'cover_image',
  };

  if (!(missingColumn in payload)) return false;

  const target = remap[missingColumn];
  if (target && !(target in payload)) {
    payload[target] = payload[missingColumn];
  }

  delete payload[missingColumn];
  return true;
}

export async function createProject(project: any) {
  const insertData: Record<string, any> = {
    title: project.title,
    slug: typeof project.slug === 'string' ? project.slug.trim().toLowerCase() : project.slug,
    discipline: project.discipline,
    subcategory: project.subcategory,
    year: project.year,
    month: project.month,
    location: project.location,
    excerpt: project.excerpt,
    cover_image: project.coverImageUrl,
    design_notes: project.designNotes,
    client: project.client,
    external_articles: project.externalArticles,
    status: project.status || 'draft',
    published_at: project.publishedAt,
    featured: project.featured || false,
    category_id: project.categoryId,
    creative_team: project.creativeTeam,
    seo_title: project.seoTitle,
    seo_description: project.seoDescription,
    seo_keywords: project.seoKeywords,
  };

  if (project.venue !== undefined) {
    insertData.venue = project.venue;
  }
  if (project.coverImageKey !== undefined) {
    insertData.cover_image_key = project.coverImageKey;
  }

  let attempts = 0;
  while (attempts < 5) {
    attempts += 1;
    const { data, error } = await supabase
      .from('projects')
      .insert(insertData)
      .select()
      .single();

    if (!error) return data.id;

    const missingColumn = extractMissingColumn(error);
    if (missingColumn && remapProjectColumn(insertData, missingColumn)) {
      continue;
    }

    throw error;
  }

  throw new Error('Failed to create project after adaptive retries');
}

export async function updateProject(id: number, project: any) {
  const updateData: any = {};

  if (project.title !== undefined) updateData.title = project.title;
  if (project.slug !== undefined) updateData.slug = typeof project.slug === 'string' ? project.slug.trim().toLowerCase() : project.slug;
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
  if (project.externalArticles !== undefined) updateData.external_articles = project.externalArticles;
  if (project.status !== undefined) updateData.status = project.status;
  if (project.publishedAt !== undefined) updateData.published_at = project.publishedAt;
  if (project.featured !== undefined) updateData.featured = project.featured;
  if (project.categoryId !== undefined) updateData.category_id = project.categoryId;
  if (project.creativeTeam !== undefined) updateData.creative_team = project.creativeTeam;
  if (project.seoTitle !== undefined) updateData.seo_title = project.seoTitle;
  if (project.seoDescription !== undefined) updateData.seo_description = project.seoDescription;
  if (project.seoKeywords !== undefined) updateData.seo_keywords = project.seoKeywords;

  let attempts = 0;
  while (attempts < 5) {
    attempts += 1;

    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id);

    if (!error) return;

    const missingColumn = extractMissingColumn(error);
    if (missingColumn && remapProjectColumn(updateData, missingColumn)) {
      continue;
    }

    throw error;
  }

  throw new Error('Failed to update project after adaptive retries');
}

export async function deleteProject(id: number) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function addProjectImage(image: any) {
  const resolvedImageUrl = image.imageUrl || image.videoUrl || null;
  if (!resolvedImageUrl) {
    throw new Error('Project image requires imageUrl or videoUrl');
  }

  const { data, error } = await supabase
    .from('project_images')
    .insert({
      project_id: image.projectId,
      title: image.title,
      image_url: resolvedImageUrl,
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
      subtitle: news.subtitle,
      excerpt: news.excerpt,
      blocks: news.blocks,
      cover_image: news.coverImageUrl,
      cover_image_key: news.coverImageKey,
      cover_image_alt_text: news.coverImageAltText,
      cover_image_focal_point: news.coverImageFocalPoint,
      layout_variant: news.layoutVariant,
      location: news.location,
      date: news.date,
      external_link: news.externalLink,
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
  if (news.subtitle !== undefined) updateData.subtitle = news.subtitle;
  if (news.excerpt !== undefined) updateData.excerpt = news.excerpt;
  if (news.blocks !== undefined) updateData.blocks = news.blocks;
  if (news.coverImageUrl !== undefined) updateData.cover_image = news.coverImageUrl;
  if (news.coverImageKey !== undefined) updateData.cover_image_key = news.coverImageKey;
  if (news.coverImageAltText !== undefined) updateData.cover_image_alt_text = news.coverImageAltText;
  if (news.coverImageFocalPoint !== undefined) updateData.cover_image_focal_point = news.coverImageFocalPoint;
  if (news.layoutVariant !== undefined) updateData.layout_variant = news.layoutVariant;
  if (news.location !== undefined) updateData.location = news.location;
  if (news.date !== undefined) updateData.date = news.date;
  if (news.externalLink !== undefined) updateData.external_link = news.externalLink;
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

export async function setNewsRelatedLinks(
  newsId: number,
  links: Array<{
    label: string;
    url: string;
    linkType?: 'source' | 'review' | 'tickets' | 'press' | 'related';
    sortOrder?: number;
  }>
) {
  await supabase
    .from('news_related_links')
    .delete()
    .eq('news_id', newsId);

  if (!links || links.length === 0) return;

  const payload = links
    .filter((link) => link?.label && link?.url)
    .map((link, index) => ({
      news_id: newsId,
      label: link.label,
      url: link.url,
      link_type: link.linkType || 'source',
      sort_order: link.sortOrder ?? index,
    }));

  if (payload.length === 0) return;

  const { error } = await supabase
    .from('news_related_links')
    .insert(payload);

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
      published_at: article.publishedAt,
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
  if (article.publishedAt !== undefined) updateData.published_at = article.publishedAt;
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

  return mapCollaboratorRecord(data);
}

export async function createCollaborator(collaborator: any) {
  const normalizedInstagramUrl = collaborator.instagramUrl || coerceInstagramUrl(collaborator.instagramHandle);
  const normalizedInstagramHandle =
    collaborator.instagramHandle || coerceInstagramHandle(collaborator.instagramUrl);
  const normalizedSlug =
    collaborator.slug ||
    String(collaborator.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const snakePayload = {
    name: collaborator.name,
    slug: normalizedSlug,
    role: collaborator.role,
    bio: collaborator.bio,
    portfolio_url: collaborator.portfolioUrl,
    website: collaborator.website ?? collaborator.websiteUrl ?? collaborator.portfolioUrl ?? null,
    instagram_url: normalizedInstagramUrl,
    instagram_handle: normalizedInstagramHandle,
    cover_image: collaborator.coverImage,
    status: collaborator.status || 'published',
    featured: collaborator.featured || false,
    seo_title: collaborator.seoTitle,
    seo_description: collaborator.seoDescription,
    seo_keywords: collaborator.seoKeywords,
    gallery: collaborator.gallery,
  };

  const snakeResult = await supabase
    .from('collaborators')
    .insert(snakePayload)
    .select()
    .single();

  if (!snakeResult.error) return snakeResult.data.id;
  if ((snakeResult.error as any)?.code !== '42703') throw snakeResult.error;

  const camelPayload = {
    name: collaborator.name,
    role: collaborator.role,
    bio: collaborator.bio,
    portfolioUrl: collaborator.portfolioUrl,
    websiteUrl: collaborator.websiteUrl ?? collaborator.website ?? collaborator.portfolioUrl ?? null,
    website: collaborator.website ?? collaborator.websiteUrl ?? collaborator.portfolioUrl ?? null,
    instagramUrl: normalizedInstagramUrl,
    instagramHandle: normalizedInstagramHandle,
    cover_image: collaborator.coverImage,
    status: collaborator.status || 'published',
    featured: collaborator.featured || false,
    seo_title: collaborator.seoTitle,
    seo_description: collaborator.seoDescription,
    seo_keywords: collaborator.seoKeywords,
    gallery: collaborator.gallery,
  } as any;

  const camelResult = await supabase
    .from('collaborators')
    .insert(camelPayload)
    .select()
    .single();
  if (camelResult.error) throw camelResult.error;
  return camelResult.data.id;
}

export async function updateCollaborator(id: number, updates: any) {
  const normalizedInstagramUrl =
    updates.instagramUrl !== undefined ? updates.instagramUrl : coerceInstagramUrl(updates.instagramHandle);
  const normalizedInstagramHandle =
    updates.instagramHandle !== undefined ? updates.instagramHandle : coerceInstagramHandle(updates.instagramUrl);

  const snakeUpdateData: any = {};
  if (updates.name !== undefined) snakeUpdateData.name = updates.name;
  if (updates.slug !== undefined) snakeUpdateData.slug = updates.slug;
  if (updates.role !== undefined) snakeUpdateData.role = updates.role;
  if (updates.bio !== undefined) snakeUpdateData.bio = updates.bio;
  if (updates.portfolioUrl !== undefined) snakeUpdateData.portfolio_url = updates.portfolioUrl;
  if (updates.website !== undefined || updates.websiteUrl !== undefined) {
    snakeUpdateData.website = updates.website ?? updates.websiteUrl ?? null;
  }
  if (updates.instagramUrl !== undefined || updates.instagramHandle !== undefined) {
    snakeUpdateData.instagram_url = normalizedInstagramUrl ?? null;
    snakeUpdateData.instagram_handle = normalizedInstagramHandle ?? null;
  }
  if (updates.coverImage !== undefined) snakeUpdateData.cover_image = updates.coverImage;
  if (updates.status !== undefined) snakeUpdateData.status = updates.status;
  if (updates.featured !== undefined) snakeUpdateData.featured = updates.featured;
  if (updates.seoTitle !== undefined) snakeUpdateData.seo_title = updates.seoTitle;
  if (updates.seoDescription !== undefined) snakeUpdateData.seo_description = updates.seoDescription;
  if (updates.seoKeywords !== undefined) snakeUpdateData.seo_keywords = updates.seoKeywords;
  if (updates.gallery !== undefined) snakeUpdateData.gallery = updates.gallery;

  const snakeResult = await supabase
    .from('collaborators')
    .update(snakeUpdateData)
    .eq('id', id);
  if (!snakeResult.error) return;
  if ((snakeResult.error as any)?.code !== '42703') throw snakeResult.error;

  const camelUpdateData: any = {};
  if (updates.name !== undefined) camelUpdateData.name = updates.name;
  if (updates.role !== undefined) camelUpdateData.role = updates.role;
  if (updates.bio !== undefined) camelUpdateData.bio = updates.bio;
  if (updates.portfolioUrl !== undefined) camelUpdateData.portfolioUrl = updates.portfolioUrl;
  if (updates.website !== undefined || updates.websiteUrl !== undefined) {
    camelUpdateData.websiteUrl = updates.websiteUrl ?? updates.website ?? null;
    camelUpdateData.website = updates.website ?? updates.websiteUrl ?? null;
  }
  if (updates.instagramUrl !== undefined || updates.instagramHandle !== undefined) {
    camelUpdateData.instagramUrl = normalizedInstagramUrl ?? null;
    camelUpdateData.instagramHandle = normalizedInstagramHandle ?? null;
  }
  if (updates.coverImage !== undefined) camelUpdateData.cover_image = updates.coverImage;
  if (updates.status !== undefined) camelUpdateData.status = updates.status;
  if (updates.featured !== undefined) camelUpdateData.featured = updates.featured;
  if (updates.seoTitle !== undefined) camelUpdateData.seo_title = updates.seoTitle;
  if (updates.seoDescription !== undefined) camelUpdateData.seo_description = updates.seoDescription;
  if (updates.seoKeywords !== undefined) camelUpdateData.seo_keywords = updates.seoKeywords;
  if (updates.gallery !== undefined) camelUpdateData.gallery = updates.gallery;

  const camelResult = await supabase
    .from('collaborators')
    .update(camelUpdateData)
    .eq('id', id);
  if (camelResult.error) throw camelResult.error;
}

export async function deleteCollaborator(id: number) {
  const { error } = await supabase
    .from('collaborators')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ RENDERING PROJECTS OPERATIONS ============

export async function createRenderingProject(data: any) {
  const { data: result, error } = await supabase
    .from('rendering_projects')
    .insert({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      design_notes: data.designNotes,
      cover_image_url: data.coverImageUrl,
      cover_image_key: data.coverImageKey,
      location: data.location,
      client: data.client,
      year: data.year,
      month: data.month,
      status: data.status || 'draft',
      featured: data.featured || false,
      gallery_only: data.galleryOnly !== undefined ? data.galleryOnly : false,
      metadata: data.metadata,
      seo_title: data.seoTitle,
      seo_description: data.seoDescription,
      seo_keywords: data.seoKeywords,
      published_at: data.publishedAt
    })
    .select('id')
    .single();

  if (error) throw error;
  return result.id;
}

export async function updateRenderingProject(id: number, data: any) {
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
  if (data.designNotes !== undefined) updateData.design_notes = data.designNotes;
  if (data.coverImageUrl !== undefined) updateData.cover_image_url = data.coverImageUrl;
  if (data.coverImageKey !== undefined) updateData.cover_image_key = data.coverImageKey;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.client !== undefined) updateData.client = data.client;
  if (data.year !== undefined) updateData.year = data.year;
  if (data.month !== undefined) updateData.month = data.month;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.galleryOnly !== undefined) updateData.gallery_only = data.galleryOnly;
  if (data.metadata !== undefined) updateData.metadata = data.metadata;
  if (data.seoTitle !== undefined) updateData.seo_title = data.seoTitle;
  if (data.seoDescription !== undefined) updateData.seo_description = data.seoDescription;
  if (data.seoKeywords !== undefined) updateData.seo_keywords = data.seoKeywords;
  if (data.publishedAt !== undefined) updateData.published_at = data.publishedAt;

  const { error } = await supabase
    .from('rendering_projects')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteRenderingProject(id: number) {
  const { error } = await supabase
    .from('rendering_projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getRenderingProjectById(id: number) {
  const { data, error } = await supabase
    .from('rendering_projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getRenderingProjects(filters?: { status?: string; galleryOnly?: boolean }) {
  let query = supabase
    .from('rendering_projects')
    .select('*')
    .order('year', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.galleryOnly !== undefined) {
    query = query.eq('gallery_only', filters.galleryOnly);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Fetch images for each project
  if (data && data.length > 0) {
    const projectsWithImages = await Promise.all(
      data.map(async (project) => {
        const images = await getRenderingProjectImages(project.id);
        return {
          ...project,
          images,
          // Map snake_case to camelCase for frontend
          coverImageUrl: project.cover_image_url,
          coverImageKey: project.cover_image_key,
          designNotes: project.design_notes,
          seoTitle: project.seo_title,
          seoDescription: project.seo_description,
          seoKeywords: project.seo_keywords,
          createdAt: new Date(project.created_at),
          updatedAt: new Date(project.updated_at),
          publishedAt: project.published_at ? new Date(project.published_at) : null,
        };
      })
    );
    return projectsWithImages;
  }

  return [];
}

export async function getRenderingProjectBySlug(slug: string) {
  const { data, error } = await supabase
    .from('rendering_projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  const images = await getRenderingProjectImages(data.id);

  return {
    ...data,
    images,
    coverImageUrl: data.cover_image_url,
    coverImageKey: data.cover_image_key,
    designNotes: data.design_notes,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    seoKeywords: data.seo_keywords,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    publishedAt: data.published_at ? new Date(data.published_at) : null,
  };
}

export async function getRenderingProjectImages(projectId: number) {
  const { data, error } = await supabase
    .from('rendering_project_images')
    .select('*')
    .eq('rendering_project_id', projectId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addRenderingProjectImage(data: any) {
  const resolvedImageUrl = data.imageUrl || data.videoUrl || null;
  if (!resolvedImageUrl) {
    throw new Error('Rendering project image requires imageUrl or videoUrl');
  }

  const { error } = await supabase
    .from('rendering_project_images')
    .insert({
      rendering_project_id: data.renderingProjectId || data.projectId,
      title: data.title,
      image_url: resolvedImageUrl,
      image_key: data.imageKey,
      video_url: data.videoUrl,
      image_type: data.imageType || 'production',
      caption: data.caption,
      alt_text: data.altText,
      sort_order: data.sortOrder || 0
    });

  if (error) throw error;
}

export async function deleteRenderingProjectImages(projectId: number) {
  const { error } = await supabase
    .from('rendering_project_images')
    .delete()
    .eq('rendering_project_id', projectId);

  if (error) throw error;
}

// ============ EXPERIENTIAL PROJECTS OPERATIONS ============

export async function createExperientialProject(data: any) {
  const { data: result, error } = await supabase
    .from('experiential_projects')
    .insert({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      design_notes: data.designNotes,
      cover_image_url: data.coverImageUrl,
      cover_image_key: data.coverImageKey,
      location: data.location,
      client: data.client,
      year: data.year,
      month: data.month,
      gallery_type: data.galleryType || 'rendering',
      status: data.status || 'draft',
      featured: data.featured || false,
      metadata: data.metadata,
      seo_title: data.seoTitle,
      seo_description: data.seoDescription,
      seo_keywords: data.seoKeywords,
      published_at: data.publishedAt
    })
    .select('id')
    .single();

  if (error) throw error;
  return result.id;
}

export async function updateExperientialProject(id: number, data: any) {
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
  if (data.designNotes !== undefined) updateData.design_notes = data.designNotes;
  if (data.coverImageUrl !== undefined) updateData.cover_image_url = data.coverImageUrl;
  if (data.coverImageKey !== undefined) updateData.cover_image_key = data.coverImageKey;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.client !== undefined) updateData.client = data.client;
  if (data.year !== undefined) updateData.year = data.year;
  if (data.month !== undefined) updateData.month = data.month;
  if (data.galleryType !== undefined) updateData.gallery_type = data.galleryType;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.metadata !== undefined) updateData.metadata = data.metadata;
  if (data.seoTitle !== undefined) updateData.seo_title = data.seoTitle;
  if (data.seoDescription !== undefined) updateData.seo_description = data.seoDescription;
  if (data.seoKeywords !== undefined) updateData.seo_keywords = data.seoKeywords;
  if (data.publishedAt !== undefined) updateData.published_at = data.publishedAt;

  const { error } = await supabase
    .from('experiential_projects')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteExperientialProject(id: number) {
  const { error } = await supabase
    .from('experiential_projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getExperientialProjectById(id: number) {
  const { data, error } = await supabase
    .from('experiential_projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getExperientialProjectImages(projectId: number) {
  const { data, error } = await supabase
    .from('experiential_project_images')
    .select('*')
    .eq('experiential_project_id', projectId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addExperientialProjectImage(data: any) {
  const resolvedImageUrl = data.imageUrl || data.videoUrl || null;
  if (!resolvedImageUrl) {
    throw new Error('Experiential project image requires imageUrl or videoUrl');
  }

  const { error } = await supabase
    .from('experiential_project_images')
    .insert({
      experiential_project_id: data.experientialProjectId || data.projectId,
      title: data.title,
      image_url: resolvedImageUrl,
      image_key: data.imageKey,
      video_url: data.videoUrl,
      image_type: data.imageType || 'production',
      caption: data.caption,
      alt_text: data.altText,
      sort_order: data.sortOrder || 0
    });

  if (error) throw error;
}

export async function deleteExperientialProjectImages(projectId: number) {
  const { error } = await supabase
    .from('experiential_project_images')
    .delete()
    .eq('experiential_project_id', projectId);

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

    const projectIds = Array.from(new Set(galleryItems.map(item => item.rendering_project_id)));
    const { data: projects, error } = await supabase
      .from('rendering_projects')
      .select('*')
      .in('id', projectIds);

    if (error) {
      console.warn('Error fetching rendering projects for gallery:', error);
      return [];
    }

    // Fetch images for these projects
    const { data: images, error: imagesError } = await supabase
      .from('rendering_project_images')
      .select('*')
      .in('rendering_project_id', projectIds)
      .order('sort_order', { ascending: true });

    if (imagesError) {
      console.warn('Error fetching images for rendering gallery:', imagesError);
    }

    const projectMap = new Map(projects?.map(p => [p.id, p]));
    // Group images by project ID
    const imagesMap = new Map<number, any[]>();
    if (images) {
      images.forEach(img => {
        const projectId = img.rendering_project_id;
        if (!imagesMap.has(projectId)) {
          imagesMap.set(projectId, []);
        }
        imagesMap.get(projectId)?.push(img);
      });
    }

    return galleryItems.map(item => {
      const project = projectMap.get(item.rendering_project_id);
      const projectImages = imagesMap.get(item.rendering_project_id) || [];
      // Use cover_image from project, fallback to first gallery image
      const coverImageUrl = project?.cover_image_url || (projectImages.length > 0 ? projectImages[0].image_url : null);

      return {
        id: item.id,
        projectId: item.rendering_project_id,
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
          coverImageUrl: coverImageUrl,
          coverImageKey: project.cover_image_key,
          client: project.client,
          location: project.location,
          year: project.year,
          month: project.month,
          status: project.status,
          featured: project.featured,
          categoryId: null,
          creativeTeam: null,
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
        rendering_project_id: projectId,
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

// ============ EXPERIENTIAL GALLERY OPERATIONS ============

export async function getExperientialGallery(): Promise<RenderingGalleryItem[]> {
  try {
    const { data: galleryItems, error: galleryError } = await supabase
      .from('experiential_gallery')
      .select('*')
      .order('sort_order', { ascending: true });

    if (galleryError) throw galleryError;
    if (!galleryItems || galleryItems.length === 0) return [];

    const projectIds = Array.from(new Set(galleryItems.map(item => item.experiential_project_id)));
    const { data: projects, error } = await supabase
      .from('experiential_projects')
      .select('*')
      .in('id', projectIds);

    if (error) {
      console.warn('Error fetching experiential projects for gallery:', error);
      return [];
    }

    // Fetch images for these projects
    const { data: images, error: imagesError } = await supabase
      .from('experiential_project_images')
      .select('*')
      .in('experiential_project_id', projectIds)
      .order('sort_order', { ascending: true });

    if (imagesError) {
      console.warn('Error fetching images for experiential gallery:', imagesError);
    }

    const projectMap = new Map(projects?.map(p => [p.id, p]));
    // Group images by project ID
    const imagesMap = new Map<number, any[]>();
    if (images) {
      images.forEach(img => {
        const projectId = img.experiential_project_id;
        if (!imagesMap.has(projectId)) {
          imagesMap.set(projectId, []);
        }
        imagesMap.get(projectId)?.push(img);
      });
    }

    return galleryItems.map(item => {
      const project = projectMap.get(item.experiential_project_id);
      const projectImages = imagesMap.get(item.experiential_project_id) || [];
      // Use cover_image from project, fallback to first gallery image
      const coverImageUrl = project?.cover_image_url || (projectImages.length > 0 ? projectImages[0].image_url : null);

      return {
        id: item.id,
        projectId: item.experiential_project_id,
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
          coverImageUrl: coverImageUrl,
          coverImageKey: project.cover_image_key,
          client: project.client,
          location: project.location,
          year: project.year,
          month: project.month,
          discipline: 'experiential_design',
          subcategory: null,
          status: project.status,
          featured: project.featured,
          categoryId: null,
          creativeTeam: null,
          metadata: project.metadata,
          publishedAt: project.published_at ? new Date(project.published_at) : null,
          seoTitle: project.seo_title,
          seoDescription: project.seo_description,
          seoKeywords: project.seo_keywords,
          createdAt: project.created_at ? new Date(project.created_at) : new Date(),
          updatedAt: project.updated_at ? new Date(project.updated_at) : new Date(),
          images: projectImages.map((img: any) => ({
            id: img.id,
            projectId: item.experiential_project_id,
            imageUrl: img.image_url,
            videoUrl: img.video_url ?? null,
            caption: img.caption,
            altText: img.alt_text,
            sortOrder: img.sort_order,
            createdAt: img.created_at ? new Date(img.created_at) : new Date(),
          }))
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
        experiential_project_id: projectId,
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
