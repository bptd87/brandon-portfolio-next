import { db } from './server/db.ts';
import { projects } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const allProjects = await db.select({
  slug: projects.slug,
  title: projects.title,
  discipline: projects.discipline,
  seoKeywords: projects.seoKeywords,
  excerpt: projects.excerpt
}).from(projects).where(eq(projects.status, 'published'));

console.log("Projects with SEO issues:\n");
allProjects.forEach(p => {
  const keywordCount = p.seoKeywords ? p.seoKeywords.split(',').length : 0;
  const descLength = p.excerpt ? p.excerpt.length : 0;
  
  if (keywordCount > 8 || descLength < 50 || descLength > 160) {
    console.log(`${p.title} (${p.discipline})`);
    console.log(`  Keywords: ${keywordCount} ${keywordCount > 8 ? '❌ TOO MANY' : '✓'}`);
    console.log(`  Description: ${descLength} chars ${descLength < 50 || descLength > 160 ? '❌ OUT OF RANGE' : '✓'}`);
    console.log('');
  }
});

process.exit(0);
