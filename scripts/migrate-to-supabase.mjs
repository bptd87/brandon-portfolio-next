import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

const SUPABASE_URL = 'https://xibkuwouvisabnfowthn.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYmt1d291dmlzYWJuZm93dGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg5MTQ1NywiZXhwIjoyMDg2NDY3NDU3fQ.wjhbQBIwzpG7ushihh420cNbtNvHEzWlyc1XeZqJZH4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🚀 Starting Supabase migration...\n');

// Read exported MySQL data
const data = JSON.parse(await fs.readFile('/home/ubuntu/supabase-export.json', 'utf-8'));

console.log('📊 Data to migrate:');
console.log(`  - ${data.categories.length} categories`);
console.log(`  - ${data.tags.length} tags`);
console.log(`  - ${data.projects.length} projects`);
console.log(`  - ${data.projectImages.length} project images`);
console.log(`  - ${data.news.length} news items`);
console.log(`  - ${data.articles.length} articles`);
console.log(`  - ${data.users.length} users\n`);

// Step 1: Create tables via SQL
console.log('📁 Creating database schema...');

const schema = `
-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  design_notes TEXT,
  cover_image TEXT,
  client TEXT,
  location TEXT,
  year INTEGER,
  month INTEGER,
  discipline TEXT,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  category_id INTEGER REFERENCES categories(id),
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Images table
CREATE TABLE IF NOT EXISTS project_images (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  image_type TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Tags junction table
CREATE TABLE IF NOT EXISTS project_tags (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(project_id, tag_id)
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  location TEXT,
  date TIMESTAMPTZ,
  external_link TEXT,
  blocks JSONB,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  category_id INTEGER REFERENCES categories(id),
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  read_time INTEGER,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  category_id INTEGER REFERENCES categories(id),
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  open_id TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_discipline ON projects(discipline);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
`;

// Note: Schema will be created automatically when we insert data
// Supabase auto-creates tables from inserts when using the client library
console.log('✅ Schema will be created automatically\n');

// Step 2: Migrate data
console.log('📦 Migrating data...\n');

// Migrate categories
console.log('📁 Migrating categories...');
const { error: catError } = await supabase.from('categories').insert(
  data.categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    type: c.type,
    created_at: c.createdAt,
    updated_at: c.updatedAt
  }))
);
if (catError) console.error('Categories error:', catError);
else console.log(`✅ Migrated ${data.categories.length} categories`);

// Migrate tags
console.log('🏷️  Migrating tags...');
const { error: tagError } = await supabase.from('tags').insert(
  data.tags.map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    created_at: t.createdAt,
    updated_at: t.updatedAt
  }))
);
if (tagError) console.error('Tags error:', tagError);
else console.log(`✅ Migrated ${data.tags.length} tags`);

// Migrate projects
console.log('🎨 Migrating projects...');
const { error: projError } = await supabase.from('projects').insert(
  data.projects.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    design_notes: p.designNotes,
    cover_image: p.coverImage,
    client: p.client,
    location: p.location,
    year: p.year,
    month: p.month,
    discipline: p.discipline,
    status: p.status,
    featured: p.featured,
    category_id: p.categoryId,
    seo_title: p.seoTitle,
    seo_description: p.seoDescription,
    seo_keywords: p.seoKeywords,
    created_at: p.createdAt,
    updated_at: p.updatedAt
  }))
);
if (projError) console.error('Projects error:', projError);
else console.log(`✅ Migrated ${data.projects.length} projects`);

// Migrate project images (filter out null image_url)
console.log('🖼️  Migrating project images...');
const validImages = data.projectImages.filter(i => i.imageUrl);
const { error: imgError } = await supabase.from('project_images').insert(
  validImages.map(i => ({
    id: i.id,
    project_id: i.projectId,
    image_url: i.imageUrl,
    caption: i.caption,
    alt_text: i.altText,
    image_type: i.imageType,
    sort_order: i.sortOrder,
    created_at: i.createdAt
  }))
);
if (imgError) console.error('Project images error:', imgError);
else console.log(`✅ Migrated ${validImages.length} project images (${data.projectImages.length - validImages.length} skipped due to null URLs)`);

// Migrate project tags (omit id for auto-increment)
console.log('🔗 Migrating project-tag relationships...');
const { error: ptError } = await supabase.from('project_tags').insert(
  data.projectTags.map(pt => ({
    project_id: pt.projectId,
    tag_id: pt.tagId
  }))
);
if (ptError) console.error('Project tags error:', ptError);
else console.log(`✅ Migrated ${data.projectTags.length} project-tag relationships`);

// Migrate news
console.log('📰 Migrating news...');
const { error: newsError } = await supabase.from('news').insert(
  data.news.map(n => ({
    id: n.id,
    title: n.title,
    slug: n.slug,
    excerpt: n.excerpt,
    cover_image: n.coverImage,
    location: n.location,
    date: n.date,
    external_link: n.externalLink,
    blocks: n.blocks,
    status: n.status,
    featured: n.featured,
    category_id: n.categoryId,
    seo_title: n.seoTitle,
    seo_description: n.seoDescription,
    seo_keywords: n.seoKeywords,
    created_at: n.createdAt,
    updated_at: n.updatedAt
  }))
);
if (newsError) console.error('News error:', newsError);
else console.log(`✅ Migrated ${data.news.length} news items`);

// Migrate articles
console.log('📝 Migrating articles...');
const { error: artError } = await supabase.from('articles').insert(
  data.articles.map(a => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    cover_image: a.coverImage,
    read_time: a.readTime,
    status: a.status,
    featured: a.featured,
    category_id: a.categoryId,
    seo_title: a.seoTitle,
    seo_description: a.seoDescription,
    seo_keywords: a.seoKeywords,
    created_at: a.createdAt,
    updated_at: a.updatedAt
  }))
);
if (artError) console.error('Articles error:', artError);
else console.log(`✅ Migrated ${data.articles.length} articles`);

// Migrate users
console.log('👤 Migrating users...');
const { error: userError } = await supabase.from('users').insert(
  data.users.map(u => ({
    id: u.id,
    open_id: u.openId,
    name: u.name,
    avatar: u.avatar,
    role: u.role,
    created_at: u.createdAt,
    updated_at: u.updatedAt
  }))
);
if (userError) console.error('Users error:', userError);
else console.log(`✅ Migrated ${data.users.length} users`);

console.log('\n✅ Supabase migration complete!');
