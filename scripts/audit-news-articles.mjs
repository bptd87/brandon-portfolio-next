#!/usr/bin/env node
/**
 * Audit all news articles to identify enhancement needs
 */

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { news, projects } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const sqlite = new Database('./local.db');
const db = drizzle(sqlite);

// Get all news articles
const articles = await db.select().from(news).where(eq(news.status, 'published')).all();

// Get all scenic projects for matching
const allProjects = await db.select().from(projects).all();

console.log('='.repeat(120));
console.log('NEWS ARTICLES AUDIT');
console.log('='.repeat(120));
console.log();

const audit = [];

for (const article of articles) {
  const blocks = article.blocks || [];
  
  // Calculate word count from text blocks
  let wordCount = 0;
  let hasHeaderBlocks = false;
  let hasTeamBlocks = false;
  let hasGalleryBlocks = false;
  
  for (const block of blocks) {
    if (block.type === 'text') {
      wordCount += (block.content || '').split(/\s+/).length;
    }
    if (block.type === 'header') hasHeaderBlocks = true;
    if (block.type === 'team') hasTeamBlocks = true;
    if (block.type === 'gallery') hasGalleryBlocks = true;
  }
  
  // Try to match to a scenic project by title similarity
  let matchingProject = null;
  const articleTitleLower = article.title.toLowerCase();
  
  for (const project of allProjects) {
    const projectTitleLower = project.title.toLowerCase();
    // Simple matching - check if article title contains project title or vice versa
    if (articleTitleLower.includes(projectTitleLower) || projectTitleLower.includes(articleTitleLower)) {
      matchingProject = project;
      break;
    }
  }
  
  // Determine article type from category or title
  let articleType = 'General';
  const titleLower = article.title.toLowerCase();
  if (titleLower.includes('opening night') || titleLower.includes('debut')) {
    articleType = 'Production Debut';
  } else if (titleLower.includes('review') || titleLower.includes('praise')) {
    articleType = 'Review/Press';
  } else if (titleLower.includes('assisting') || titleLower.includes('assistant')) {
    articleType = 'Collaboration';
  } else if (titleLower.includes('season') || titleLower.includes('productions')) {
    articleType = 'Season Announcement';
  } else if (titleLower.includes('joining') || titleLower.includes('new role')) {
    articleType = 'Career Milestone';
  }
  
  audit.push({
    id: article.id,
    title: article.title,
    slug: article.slug,
    wordCount,
    hasImage: !!article.coverImageUrl,
    hasHeaderBlocks,
    hasTeamBlocks,
    hasGalleryBlocks,
    blockCount: blocks.length,
    articleType,
    matchingProject: matchingProject ? matchingProject.title : null,
    matchingProjectId: matchingProject ? matchingProject.id : null,
    needsExpansion: wordCount < 300,
    needsImage: !article.coverImageUrl,
    needsTeam: (articleType === 'Production Debut' || articleType === 'Season Announcement') && !hasTeamBlocks,
    needsStructure: wordCount > 200 && !hasHeaderBlocks
  });
}

// Sort by needs attention (most issues first)
audit.sort((a, b) => {
  const aIssues = [a.needsExpansion, a.needsImage, a.needsTeam, a.needsStructure].filter(Boolean).length;
  const bIssues = [b.needsExpansion, b.needsImage, b.needsTeam, b.needsStructure].filter(Boolean).length;
  return bIssues - aIssues;
});

// Print summary
console.log(`Total Articles: ${audit.length}`);
console.log(`Articles needing expansion (<300 words): ${audit.filter(a => a.needsExpansion).length}`);
console.log(`Articles needing images: ${audit.filter(a => a.needsImage).length}`);
console.log(`Articles needing team credits: ${audit.filter(a => a.needsTeam).length}`);
console.log(`Articles needing structure (headers): ${audit.filter(a => a.needsStructure).length}`);
console.log(`Articles with matching portfolio projects: ${audit.filter(a => a.matchingProject).length}`);
console.log();

// Print detailed audit
console.log('DETAILED AUDIT:');
console.log('-'.repeat(120));
console.log(
  'ID'.padEnd(4) +
  'Words'.padEnd(7) +
  'Img'.padEnd(5) +
  'Type'.padEnd(20) +
  'Portfolio Match'.padEnd(30) +
  'Needs'
);
console.log('-'.repeat(120));

for (const item of audit) {
  const needs = [];
  if (item.needsExpansion) needs.push('EXPAND');
  if (item.needsImage) needs.push('IMAGE');
  if (item.needsTeam) needs.push('TEAM');
  if (item.needsStructure) needs.push('HEADERS');
  
  console.log(
    String(item.id).padEnd(4) +
    String(item.wordCount).padEnd(7) +
    (item.hasImage ? '✓' : '✗').padEnd(5) +
    item.articleType.padEnd(20) +
    (item.matchingProject || '-').substring(0, 28).padEnd(30) +
    needs.join(', ')
  );
  console.log('  ' + item.title.substring(0, 110));
  console.log();
}

console.log('='.repeat(120));

// Save to JSON for further processing
import { writeFileSync } from 'fs';
writeFileSync('/home/ubuntu/news_audit.json', JSON.stringify(audit, null, 2));
console.log('\nAudit saved to /home/ubuntu/news_audit.json');

sqlite.close();
