import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const result = await db.execute(sql`
  SELECT 
    discipline,
    COUNT(*) as count
  FROM projects
  GROUP BY discipline
  ORDER BY discipline
`);

console.log('\n📊 Projects by Discipline:');
console.log('========================');
let total = 0;
result[0].forEach(row => {
  console.log(`${row.discipline || 'NULL'}: ${row.count}`);
  total += Number(row.count);
});
console.log('========================');
console.log(`TOTAL: ${total} projects`);

const images = await db.execute(sql`SELECT COUNT(*) as count FROM projectImages`);
console.log(`\n🖼️  Total Images: ${images[0][0].count}`);

await connection.end();
