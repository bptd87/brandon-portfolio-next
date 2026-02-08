import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(
  "SELECT id, title, slug FROM news WHERE slug LIKE '%million-dollar%' OR slug LIKE '%buderwitz%' OR slug LIKE '%okoboji%' OR slug LIKE '%utah%' ORDER BY date DESC LIMIT 10"
);

for (const row of rows) {
  console.log(`${row.id} | ${row.title.substring(0, 50)} | ${row.slug}`);
}

await conn.end();
