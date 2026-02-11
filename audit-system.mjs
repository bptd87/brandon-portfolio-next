import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('\n=== COMPREHENSIVE SYSTEM AUDIT ===\n');

// 1. Projects Disciplines Audit
console.log('1. PROJECTS DISCIPLINES:');
const projects = await db.select().from(schema.projects);
const disciplineCounts = projects.reduce((acc, p) => {
  acc[p.discipline || 'null'] = (acc[p.discipline || 'null'] || 0) + 1;
  return acc;
}, {});
console.log('Distribution:', disciplineCounts);
console.log('Total projects:', projects.length);

// 2. Categories Audit
console.log('\n2. CATEGORIES:');
const categories = await db.select().from(schema.categories);
console.log('Total categories:', categories.length);
categories.forEach(cat => {
  console.log(`- ${cat.name} (${cat.type}) - slug: ${cat.slug}`);
});

// 3. Articles Audit
console.log('\n3. ARTICLES:');
const articles = await db.select().from(schema.articles);
console.log('Total articles:', articles.length);
const articlesWithoutContent = articles.filter(a => !a.content || a.content.length === 0);
console.log('Articles without content:', articlesWithoutContent.length);
if (articlesWithoutContent.length > 0) {
  console.log('Missing content:');
  articlesWithoutContent.forEach(a => console.log(`  - ${a.title}`));
}

// 4. SEO Audit
console.log('\n4. SEO METADATA AUDIT:');
const projectsWithoutSEO = projects.filter(p => !p.seoDescription || p.seoDescription.trim() === '');
console.log(`Projects missing SEO description: ${projectsWithoutSEO.length}/${projects.length}`);

const articlesWithoutSEO = articles.filter(a => !a.seoDescription || a.seoDescription.trim() === '');
console.log(`Articles missing SEO description: ${articlesWithoutSEO.length}/${articles.length}`);

const news = await db.select().from(schema.news);
const newsWithoutSEO = news.filter(n => !n.seoDescription || n.seoDescription.trim() === '');
console.log(`News missing SEO description: ${newsWithoutSEO.length}/${news.length}`);

// 5. Sample Data Check
console.log('\n5. SAMPLE PROJECT DATA:');
const sampleProject = projects[0];
console.log('Sample project:', {
  title: sampleProject.title,
  discipline: sampleProject.discipline,
  categoryId: sampleProject.categoryId,
  hasSEO: !!sampleProject.seoDescription,
  status: sampleProject.status
});

console.log('\n6. SAMPLE ARTICLE DATA:');
const sampleArticle = articles[0];
console.log('Sample article:', {
  title: sampleArticle.title,
  hasContent: !!sampleArticle.content,
  contentLength: sampleArticle.content?.length || 0,
  hasSEO: !!sampleArticle.seoDescription,
  status: sampleArticle.status
});

await connection.end();
console.log('\n=== AUDIT COMPLETE ===\n');
