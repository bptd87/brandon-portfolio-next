import { db } from './server/db.ts';
import { projects } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const proj = await db.select({
  id: projects.id,
  coverImageUrl: projects.coverImageUrl
}).from(projects).where(eq(projects.slug, 'isolation'));

console.log(JSON.stringify(proj, null, 2));
process.exit(0);
