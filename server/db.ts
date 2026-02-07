import { eq, and, desc, asc, like, or, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  categories, InsertCategory,
  tags, InsertTag,
  projects, InsertProject, projectImages, InsertProjectImage, projectTags,
  news, InsertNews, newsTags,
  articles, InsertArticle, articleTags
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER OPERATIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ CATEGORY OPERATIONS ============

export async function getAllCategories(type?: 'project' | 'news' | 'article') {
  const db = await getDb();
  if (!db) return [];

  if (type) {
    return await db.select().from(categories).where(eq(categories.type, type)).orderBy(asc(categories.name));
  }
  return await db.select().from(categories).orderBy(asc(categories.name));
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0];
}

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(categories).values(category);
  return Number(result[0].insertId);
}

export async function updateCategory(id: number, category: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(categories).set(category).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(categories).where(eq(categories.id, id));
}

// ============ TAG OPERATIONS ============

export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(tags).orderBy(asc(tags.name));
}

export async function getTagById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
  return result[0];
}

export async function createTag(tag: InsertTag) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(tags).values(tag);
  return Number(result[0].insertId);
}

export async function deleteTag(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(tags).where(eq(tags.id, id));
}

// ============ PROJECT OPERATIONS ============

export async function getAllProjects(filters?: { 
  status?: 'draft' | 'published' | 'archived'; 
  featured?: boolean; 
  categoryId?: number;
  discipline?: 'scenic_design' | 'experiential_design' | 'rendering' | 'scenic_models';
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(projects).$dynamic();

  const conditions = [];
  if (filters?.status) conditions.push(eq(projects.status, filters.status));
  if (filters?.featured !== undefined) conditions.push(eq(projects.featured, filters.featured));
  if (filters?.categoryId) conditions.push(eq(projects.categoryId, filters.categoryId));
  if (filters?.discipline) conditions.push(eq(projects.discipline, filters.discipline));

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return await query.orderBy(desc(projects.year));
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function getProjectBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return result[0];
}

export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(projects).values(project);
  return Number(result[0].insertId);
}

export async function updateProject(id: number, project: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(projects).set(project).where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(projects).where(eq(projects.id, id));
}

export async function getProjectImages(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(projectImages).where(eq(projectImages.projectId, projectId)).orderBy(asc(projectImages.sortOrder));
}

export async function addProjectImage(image: InsertProjectImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(projectImages).values(image);
  return Number(result[0].insertId);
}

export async function deleteProjectImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(projectImages).where(eq(projectImages.id, id));
}

export async function deleteProjectImages(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(projectImages).where(eq(projectImages.projectId, projectId));
}

export async function getProjectTags(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({ tag: tags })
    .from(projectTags)
    .innerJoin(tags, eq(projectTags.tagId, tags.id))
    .where(eq(projectTags.projectId, projectId));

  return result.map(r => r.tag);
}

export async function setProjectTags(projectId: number, tagIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(projectTags).where(eq(projectTags.projectId, projectId));

  if (tagIds.length > 0) {
    await db.insert(projectTags).values(tagIds.map(tagId => ({ projectId, tagId })));
  }
}

// ============ NEWS OPERATIONS ============

export async function getAllNews(filters?: { status?: 'draft' | 'published' | 'archived'; featured?: boolean; categoryId?: number }) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(news).$dynamic();

  const conditions = [];
  if (filters?.status) conditions.push(eq(news.status, filters.status));
  if (filters?.featured !== undefined) conditions.push(eq(news.featured, filters.featured));
  if (filters?.categoryId) conditions.push(eq(news.categoryId, filters.categoryId));

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return await query.orderBy(desc(news.date));
}

export async function getNewsById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
  return result[0];
}

export async function getNewsBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
  return result[0];
}

export async function createNews(newsItem: InsertNews) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(news).values(newsItem);
  return Number(result[0].insertId);
}

export async function updateNews(id: number, newsItem: Partial<InsertNews>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(news).set(newsItem).where(eq(news.id, id));
}

export async function deleteNews(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(news).where(eq(news.id, id));
}

export async function getNewsTags(newsId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({ tag: tags })
    .from(newsTags)
    .innerJoin(tags, eq(newsTags.tagId, tags.id))
    .where(eq(newsTags.newsId, newsId));

  return result.map(r => r.tag);
}

export async function setNewsTags(newsId: number, tagIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(newsTags).where(eq(newsTags.newsId, newsId));

  if (tagIds.length > 0) {
    await db.insert(newsTags).values(tagIds.map(tagId => ({ newsId, tagId })));
  }
}

// ============ ARTICLE OPERATIONS ============

export async function getAllArticles(filters?: { status?: 'draft' | 'published' | 'archived'; featured?: boolean; categoryId?: number; authorId?: number }) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select({
    id: articles.id,
    title: articles.title,
    slug: articles.slug,
    excerpt: articles.excerpt,
    content: articles.content,
    categoryId: articles.categoryId,
    coverImageUrl: articles.coverImageUrl,
    coverImageKey: articles.coverImageKey,
    authorId: articles.authorId,
    status: articles.status,
    featured: articles.featured,
    readTime: articles.readTime,
    seoTitle: articles.seoTitle,
    seoDescription: articles.seoDescription,
    seoKeywords: articles.seoKeywords,
    createdAt: articles.createdAt,
    updatedAt: articles.updatedAt,
    publishedAt: articles.publishedAt,
    category: categories,
  }).from(articles).leftJoin(categories, eq(articles.categoryId, categories.id)).$dynamic();

  const conditions = [];
  if (filters?.status) conditions.push(eq(articles.status, filters.status));
  if (filters?.featured !== undefined) conditions.push(eq(articles.featured, filters.featured));
  if (filters?.categoryId) conditions.push(eq(articles.categoryId, filters.categoryId));
  if (filters?.authorId) conditions.push(eq(articles.authorId, filters.authorId));

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return await query.orderBy(desc(articles.publishedAt));
}

export async function getArticleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return result[0];
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return result[0];
}

export async function createArticle(article: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(articles).values(article);
  return Number(result[0].insertId);
}

export async function updateArticle(id: number, article: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(articles).set(article).where(eq(articles.id, id));
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(articles).where(eq(articles.id, id));
}

export async function getArticleTags(articleId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({ tag: tags })
    .from(articleTags)
    .innerJoin(tags, eq(articleTags.tagId, tags.id))
    .where(eq(articleTags.articleId, articleId));

  return result.map(r => r.tag);
}

export async function setArticleTags(articleId: number, tagIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(articleTags).where(eq(articleTags.articleId, articleId));

  if (tagIds.length > 0) {
    await db.insert(articleTags).values(tagIds.map(tagId => ({ articleId, tagId })));
  }
}

// ============ SEARCH OPERATIONS ============

export async function searchContent(query: string) {
  const db = await getDb();
  if (!db) return { projects: [], news: [], articles: [] };

  const searchPattern = `%${query}%`;

  const [projectResults, newsResults, articleResults] = await Promise.all([
    db.select().from(projects).where(
      and(
        eq(projects.status, 'published'),
        or(
          like(projects.title, searchPattern),
          like(projects.excerpt, searchPattern),
          like(projects.description, searchPattern)
        )
      )
    ).limit(10),
    db.select().from(news).where(
      and(
        eq(news.status, 'published'),
        or(
          like(news.title, searchPattern),
          like(news.excerpt, searchPattern)
        )
      )
    ).limit(10),
    db.select().from(articles).where(
      and(
        eq(articles.status, 'published'),
        or(
          like(articles.title, searchPattern),
          like(articles.excerpt, searchPattern),
          like(articles.content, searchPattern)
        )
      )
    ).limit(10)
  ]);

  return {
    projects: projectResults,
    news: newsResults,
    articles: articleResults
  };
}
