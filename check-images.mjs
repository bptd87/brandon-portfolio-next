import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const result = await db.execute(sql`SELECT COUNT(*) as count FROM projectImages`);
console.log('Total images:', result[0][0].count);

const projects = await db.execute(sql`SELECT id, title, slug FROM projects LIMIT 5`);
console.log('\nProjects:');
projects[0].forEach(p => console.log(`- ${p.title} (${p.slug})`));

for (const project of projects[0]) {
  const images = await db.execute(sql`SELECT COUNT(*) as count FROM projectImages WHERE projectId = ${project.id}`);
  console.log(`  Images for "${project.title}": ${images[0][0].count}`);
}

await connection.end();
