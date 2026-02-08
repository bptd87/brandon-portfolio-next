import { db } from './server/db.js';
import { news } from './drizzle/schema.js';

const allNews = await db.select().from(news).orderBy(news.date);

console.log(`\n=== NEWS AUDIT (${allNews.length} articles) ===\n`);

const issues = [];
const duplicates = new Map();

allNews.forEach((article, idx) => {
  const problems = [];
  
  // Check for missing content
  if (!article.externalLink) problems.push('NO_LINK');
  if (!article.tags || article.tags.length === 0) problems.push('NO_TAGS');
  if (!article.blocks || article.blocks.length === 0) problems.push('NO_BLOCKS');
  if (!article.coverImageUrl) problems.push('NO_IMAGE');
  
  // Track duplicates by slug
  if (duplicates.has(article.slug)) {
    duplicates.get(article.slug).push(article.id);
  } else {
    duplicates.set(article.slug, [article.id]);
  }
  
  if (problems.length > 0) {
    issues.push({
      id: article.id,
      title: article.title,
      slug: article.slug,
      problems: problems.join(', ')
    });
  }
});

// Show duplicates
console.log('DUPLICATES:');
for (const [slug, ids] of duplicates.entries()) {
  if (ids.length > 1) {
    console.log(`  ${slug}: IDs ${ids.join(', ')}`);
  }
}

// Show issues
console.log(`\nISSUES (${issues.length} articles):`);
issues.forEach(issue => {
  console.log(`  [${issue.id}] ${issue.title}`);
  console.log(`      Problems: ${issue.problems}`);
});

process.exit(0);
