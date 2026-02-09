import { db } from './server/db.ts';
import { projects } from './drizzle/schema.ts';
import { eq, or } from 'drizzle-orm';

const results = await db.select({
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

console.log(JSON.stringify(results, null, 2));
process.exit(0);
