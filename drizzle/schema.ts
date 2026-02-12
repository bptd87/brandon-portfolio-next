import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean, index } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories for organizing portfolio projects, news, and articles
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  type: mysqlEnum("type", ["project", "news", "article"]).notNull(),
  color: varchar("color", { length: 7 }).default("#FF5722").notNull(), // Hex color code
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeIdx: index("type_idx").on(table.type),
}));

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Tags for content tagging across all content types
 */
export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

/**
 * Portfolio projects with rich metadata
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  description: text("description"),
  designNotes: text("designNotes"),
  discipline: mysqlEnum("discipline", ["scenic_design", "experiential_design", "rendering", "scenic_models"]).default("scenic_design").notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  categoryId: int("categoryId").references(() => categories.id),
  creativeTeam: json("creativeTeam").$type<{
    director?: string;
    associateDirector?: string;
    musicDirector?: string;
    coScenicDesigner?: string;
    costumeDesigner?: string;
    lightingDesigner?: string;
    soundDesigner?: string;
    [key: string]: any;
  }>(),
  viewCount: int("viewCount").default(0).notNull(),
  likeCount: int("likeCount").default(0).notNull(),
  coverImageUrl: text("coverImageUrl"),
  coverImageKey: text("coverImageKey"),
  location: varchar("location", { length: 255 }),
  client: varchar("client", { length: 255 }),
  year: int("year"),
  month: int("month"), // 1-12 for sorting projects chronologically
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  featured: boolean("featured").default(false).notNull(),
  metadata: json("metadata").$type<{
    venue?: string;
    director?: string;
    collaborators?: string[];
    awards?: string[];
    dimensions?: string;
    materials?: string[];
    [key: string]: any;
  }>(),
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: text("seoDescription"),
  seoKeywords: text("seoKeywords"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
}, (table) => ({
  statusIdx: index("status_idx").on(table.status),
  featuredIdx: index("featured_idx").on(table.featured),
  slugIdx: index("slug_idx").on(table.slug),
  disciplineIdx: index("discipline_idx").on(table.discipline),
}));

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Project images gallery
 */
export const projectImages = mysqlTable("projectImages", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  imageUrl: text("imageUrl"),
  imageKey: text("imageKey"),
  videoUrl: text("videoUrl"),
  imageType: mysqlEnum("imageType", ["production", "rendering", "technical_drawing", "video"]).default("production").notNull(),
  caption: text("caption"),
  altText: text("altText"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  projectIdx: index("project_idx").on(table.projectId),
}));

export type ProjectImage = typeof projectImages.$inferSelect;
export type InsertProjectImage = typeof projectImages.$inferInsert;

/**
 * Project tags junction table
 */
export const projectTags = mysqlTable("projectTags", {
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  tagId: int("tagId").notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (table) => ({
  projectIdx: index("project_idx").on(table.projectId),
  tagIdx: index("tag_idx").on(table.tagId),
}));

/**
 * News items with flexible block content
 */
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  categoryId: int("categoryId").references(() => categories.id),
  coverImageUrl: text("coverImageUrl"),
  coverImageKey: text("coverImageKey"),
  location: varchar("location", { length: 255 }),
  date: timestamp("date").notNull(),
  externalLink: text("externalLink"),
  tags: text("tags"),
  blocks: json("blocks").$type<Array<
    | { type: 'text'; content: string }
    | { type: 'header'; content: string; level?: 2 | 3 | 4 }
    | { type: 'image'; url: string; caption?: string; alt?: string }
    | { type: 'video'; url: string; caption?: string }
    | { type: 'gallery'; images: { url: string; caption?: string; alt?: string }[] }
    | { type: 'list'; items: string[]; ordered?: boolean }
    | { type: 'quote'; text: string; author?: string; source?: string }
    | { type: 'faq'; items: { question: string; answer: string }[] }
    | { type: 'team'; title: string; members: { role: string; name: string }[] }
    | { type: 'details'; title: string; items: { label: string; value: string }[] }
    | { type: 'link'; url: string; label: string }
  >>(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  featured: boolean("featured").default(false).notNull(),
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: text("seoDescription"),
  seoKeywords: text("seoKeywords"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
}, (table) => ({
  statusIdx: index("status_idx").on(table.status),
  featuredIdx: index("featured_idx").on(table.featured),
  dateIdx: index("date_idx").on(table.date),
  slugIdx: index("slug_idx").on(table.slug),
}));

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

/**
 * News tags junction table
 */
export const newsTags = mysqlTable("newsTags", {
  newsId: int("newsId").notNull().references(() => news.id, { onDelete: "cascade" }),
  tagId: int("tagId").notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (table) => ({
  newsIdx: index("news_idx").on(table.newsId),
  tagIdx: index("tag_idx").on(table.tagId),
}));

/**
 * Articles and blog posts with rich text content
 */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  categoryId: int("categoryId").references(() => categories.id),
  coverImageUrl: text("coverImageUrl"),
  coverImageKey: text("coverImageKey"),
  authorId: int("authorId").references(() => users.id),
  readTime: int("readTime"),
  likes: int("likes").default(0).notNull(),
  views: int("views").default(0).notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  featured: boolean("featured").default(false).notNull(),
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: text("seoDescription"),
  seoKeywords: text("seoKeywords"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
}, (table) => ({
  statusIdx: index("status_idx").on(table.status),
  featuredIdx: index("featured_idx").on(table.featured),
  slugIdx: index("slug_idx").on(table.slug),
  authorIdx: index("author_idx").on(table.authorId),
}));

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Article tags junction table
 */
export const articleTags = mysqlTable("articleTags", {
  articleId: int("articleId").notNull().references(() => articles.id, { onDelete: "cascade" }),
  tagId: int("tagId").notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (table) => ({
  articleIdx: index("article_idx").on(table.articleId),
  tagIdx: index("tag_idx").on(table.tagId),
}));

/**
 * Article comments table
 */
export const comments = mysqlTable("comments", {
  id: int("id").primaryKey().autoincrement(),
  articleId: int("articleId").notNull().references(() => articles.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  parentId: int("parentId"), // For nested replies
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  articleIdx: index("article_idx").on(table.articleId),
  userIdx: index("user_idx").on(table.userId),
  parentIdx: index("parent_idx").on(table.parentId),
}));

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Tutorial progress tracking table
 */
export const tutorialProgress = mysqlTable("tutorialProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  tutorialSlug: varchar("tutorialSlug", { length: 255 }).notNull(),
  watched: boolean("watched").default(false).notNull(),
  watchedAt: timestamp("watchedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  tutorialIdx: index("tutorial_idx").on(table.tutorialSlug),
}));

export type TutorialProgress = typeof tutorialProgress.$inferSelect;
export type InsertTutorialProgress = typeof tutorialProgress.$inferInsert;

// Relations
export const projectsRelations = relations(projects, ({ one, many }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
  }),
  images: many(projectImages),
  tags: many(projectTags),
  teamMembers: many(projectTeamMembers),
}));

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}));

export const projectTagsRelations = relations(projectTags, ({ one }) => ({
  project: one(projects, {
    fields: [projectTags.projectId],
    references: [projects.id],
  }),
  tag: one(tags, {
    fields: [projectTags.tagId],
    references: [tags.id],
  }),
}));

export const newsRelations = relations(news, ({ one, many }) => ({
  category: one(categories, {
    fields: [news.categoryId],
    references: [categories.id],
  }),
  tags: many(newsTags),
}));

export const newsTagsRelations = relations(newsTags, ({ one }) => ({
  news: one(news, {
    fields: [newsTags.newsId],
    references: [news.id],
  }),
  tag: one(tags, {
    fields: [newsTags.tagId],
    references: [tags.id],
  }),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  tags: many(articleTags),
}));

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleTags.articleId],
    references: [articles.id],
  }),
  tag: one(tags, {
    fields: [articleTags.tagId],
    references: [tags.id],
  }),
}));

/**
 * Team members for flexible team management
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  bio: text("bio"),
  imageUrl: text("imageUrl"),
  imageKey: text("imageKey"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Project team members junction table
 */
export const projectTeamMembers = mysqlTable("project_team_members", {
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  teamMemberId: int("teamMemberId").notNull().references(() => teamMembers.id, { onDelete: "cascade" }),
  customRole: varchar("customRole", { length: 255 }),
  sortOrder: int("sortOrder").default(0).notNull(),
}, (table) => ({
  projectIdx: index("project_idx").on(table.projectId),
  teamMemberIdx: index("team_member_idx").on(table.teamMemberId),
}));

// Team relations
export const teamMembersRelations = relations(teamMembers, ({ many }) => ({
  projects: many(projectTeamMembers),
}));

export const projectTeamMembersRelations = relations(projectTeamMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectTeamMembers.projectId],
    references: [projects.id],
  }),
  teamMember: one(teamMembers, {
    fields: [projectTeamMembers.teamMemberId],
    references: [teamMembers.id],
  }),
}));

/**
 * Tutorials table for Vectorworks educational content
 */
export const tutorials = mysqlTable("tutorials", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }),
  youtubeUrl: varchar("youtubeUrl", { length: 500 }).notNull(),
  youtubeId: varchar("youtubeId", { length: 50 }),
  description: text("description"),
  category: mysqlEnum("category", ["getting-started", "2d-drafting", "3d-modeling", "rendering", "advanced"]).default("getting-started").notNull(),
  difficultyLevel: mysqlEnum("difficultyLevel", ["beginner", "intermediate", "advanced"]).default("beginner").notNull(),
  duration: int("duration"), // in seconds
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  views: int("views").default(0).notNull(),
  likes: int("likes").default(0).notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index("category_idx").on(table.category),
  difficultyIdx: index("difficulty_idx").on(table.difficultyLevel),
  enabledIdx: index("enabled_idx").on(table.enabled),
}));

export type Tutorial = typeof tutorials.$inferSelect;
export type InsertTutorial = typeof tutorials.$inferInsert;

/**
 * Scenic Directory - curated resources for scenic designers
 */
export const scenicDirectory = mysqlTable("scenicDirectory", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  description: text("description").notNull(),
  categorySlug: varchar("categorySlug", { length: 100 }).notNull(), // industry, research, software, modeling, supplies
  enabled: boolean("enabled").default(true).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  likes: int("likes").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index("category_idx").on(table.categorySlug),
  enabledIdx: index("enabled_idx").on(table.enabled),
}));

export type ScenicDirectoryItem = typeof scenicDirectory.$inferSelect;
export type InsertScenicDirectoryItem = typeof scenicDirectory.$inferInsert;

/**
 * Saved paint recipes for Rosco Paint Calculator
 */
export const paintRecipes = mysqlTable("paintRecipes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  notes: text("notes"),
  targetColor: varchar("targetColor", { length: 7 }).notNull(), // Hex color code
  mixingRecipe: json("mixingRecipe").$type<Array<{
    paintId: string;
    paintName: string;
    color: string;
    parts: number;
  }>>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  createdAtIdx: index("created_at_idx").on(table.createdAt),
}));

export type PaintRecipe = typeof paintRecipes.$inferSelect;
export type InsertPaintRecipe = typeof paintRecipes.$inferInsert;

/**
 * Collaborators table for directors, designers, theatre companies, and partner companies
 */
export const collaborators = mysqlTable("collaborators", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  role: mysqlEnum("role", [
    "director",
    "scenic_designer",
    "costume_designer",
    "lighting_designer",
    "sound_designer",
    "projection_designer",
    "theatre_company",
    "partner_company"
  ]).notNull(),
  bio: text("bio"),
  portfolioUrl: text("portfolioUrl"),
  instagramHandle: varchar("instagramHandle", { length: 100 }),
  instagramUrl: text("instagramUrl"),
  websiteUrl: text("websiteUrl"),
  imageUrl: text("imageUrl"),
  imageKey: text("imageKey"),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  roleIdx: index("role_idx").on(table.role),
  slugIdx: index("slug_idx").on(table.slug),
  featuredIdx: index("featured_idx").on(table.featured),
}));

export type Collaborator = typeof collaborators.$inferSelect;
export type InsertCollaborator = typeof collaborators.$inferInsert;

/**
 * Project collaborators junction table for linking projects with collaborators
 */
export const projectCollaborators = mysqlTable("project_collaborators", {
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  collaboratorId: int("collaboratorId").notNull().references(() => collaborators.id, { onDelete: "cascade" }),
  customRole: varchar("customRole", { length: 255 }), // Optional custom role override
  sortOrder: int("sortOrder").default(0).notNull(),
}, (table) => ({
  projectIdx: index("project_idx").on(table.projectId),
  collaboratorIdx: index("collaborator_idx").on(table.collaboratorId),
}));

// Collaborator relations
export const collaboratorsRelations = relations(collaborators, ({ many }) => ({
  projects: many(projectCollaborators),
}));

export const projectCollaboratorsRelations = relations(projectCollaborators, ({ one }) => ({
  project: one(projects, {
    fields: [projectCollaborators.projectId],
    references: [projects.id],
  }),
  collaborator: one(collaborators, {
    fields: [projectCollaborators.collaboratorId],
    references: [collaborators.id],
  }),
}));
