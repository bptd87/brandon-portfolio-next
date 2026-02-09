import { db } from './server/db.ts';
import { tags, projectTags } from './drizzle/schema.ts';

const allTags = await db.select().from(tags).limit(10);
const allProjectTags = await db.select().from(projectTags).limit(10);

console.log('Tags:', allTags.length);
console.log('ProjectTags:', allProjectTags.length);
process.exit(0);
