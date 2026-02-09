import { db } from './server/db.ts';
import { projects, projectImages } from './drizzle/schema.ts';
import { eq, or, inArray } from 'drizzle-orm';

const projs = await db.select({
  id: projects.id,
  title: projects.title,
  slug: projects.slug,
  coverImageUrl: projects.coverImageUrl
}).from(projects).where(
  or(
    eq(projects.slug, 'the-northwind-mare-tavern'),
    eq(projects.slug, 'isolation')
  )
);

console.log('Projects:', JSON.stringify(projs, null, 2));

const projIds = projs.map(p => p.id);
const images = await db.select().from(projectImages).where(
  inArray(projectImages.projectId, projIds)
);

console.log('\nExisting images:', JSON.stringify(images, null, 2));
process.exit(0);
