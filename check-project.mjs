import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const project = await db.query.projects.findFirst({
  where: eq(schema.projects.slug, 'angel-food-cake')
});

console.log('Project title:', project?.title);
console.log('Has designNotes:', !!project?.designNotes);
console.log('DesignNotes length:', project?.designNotes?.length || 0);
console.log('First 300 chars:', project?.designNotes?.substring(0, 300));

await pool.end();
