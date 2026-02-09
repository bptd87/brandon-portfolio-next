import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.query("SELECT title, creativeTeam FROM projects WHERE discipline = 'scenic_design' AND status = 'published' LIMIT 5");

rows.forEach(r => {
  console.log(`\n=== ${r.title} ===`);
  console.log(JSON.stringify(r.creativeTeam, null, 2));
});

await conn.end();
