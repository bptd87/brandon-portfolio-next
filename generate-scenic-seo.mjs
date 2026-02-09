import { db } from './server/db.ts';
import { projects, tags, projectTags } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

// Get all scenic design projects
const scenicProjects = await db.select({
  id: projects.id,
  slug: projects.slug,
  title: projects.title,
  year: projects.year,
  client: projects.client,
  excerpt: projects.excerpt,
  designNotes: projects.designNotes
}).from(projects)
.where(eq(projects.discipline, 'scenic_design'))
.where(eq(projects.status, 'published'));

console.log(`Found ${scenicProjects.length} scenic design projects\n`);

// Generate SEO and tags for first 5 as examples
const updates = [];

for (const project of scenicProjects.slice(0, 5)) {
  const seoKeywords = [];
  const displayTags = [];
  
  // Always include these
  seoKeywords.push('scenic design');
  seoKeywords.push(project.title);
  
  // Add venue/client
  if (project.client) {
    seoKeywords.push(project.client);
  }
  
  // Analyze title and content for style/period
  const content = `${project.title} ${project.excerpt || ''} ${project.designNotes || ''}`.toLowerCase();
  
  // Show title as tag
  displayTags.push(project.title);
  
  // Year
  if (project.year) {
    displayTags.push(project.year.toString());
  }
  
  // Detect Shakespeare
  if (content.includes('shakespeare')) {
    seoKeywords.push('Shakespeare');
    displayTags.push('Shakespeare');
  }
  
  // Detect periods/styles
  if (content.includes('1950') || content.includes('mid-century') || content.includes('midcentury')) {
    displayTags.push('1950s');
    displayTags.push('Mid-Century Modern');
  }
  if (content.includes('operatic') || content.includes('opera')) {
    displayTags.push('Operatic Design');
  }
  if (content.includes('western') || content.includes('saloon') || content.includes('wild west')) {
    displayTags.push('Wild West');
    displayTags.push('Western');
  }
  if (content.includes('realistic') || content.includes('realism')) {
    displayTags.push('Realistic Interior');
  }
  
  // Detect venue types
  if (content.includes('summer') && content.includes('theatre')) {
    displayTags.push('Summer Stock');
  }
  if (content.includes('regional') || content.includes('repertory')) {
    displayTags.push('Regional Theatre');
  }
  if (content.includes('festival')) {
    displayTags.push('Theatre Festival');
  }
  
  // Co-design
  if (content.includes('co-scenic') || content.includes('co–scenic')) {
    displayTags.push('Co-Design');
  }
  
  updates.push({
    slug: project.slug,
    title: project.title,
    seoKeywords: seoKeywords.slice(0, 6).join(', '),
    displayTags: displayTags
  });
}

console.log(JSON.stringify(updates, null, 2));
process.exit(0);
