import { getDb } from './server/db.ts';
import { projects } from './drizzle/schema.ts';

const db = await getDb();

console.log('Checking Cloudinary URLs in database...\n');

const allProjects = await db.select({
  title: projects.title,
  coverImageUrl: projects.coverImageUrl,
  coverImageKey: projects.coverImageKey
}).from(projects).limit(5);

for (const project of allProjects) {
  console.log(`${project.title}:`);
  console.log(`  URL: ${project.coverImageUrl}`);
  console.log(`  Key: ${project.coverImageKey}`);
  console.log('');
}

console.log('Sample check complete.');
