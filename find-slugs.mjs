import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(
  `SELECT id, title, slug FROM news 
   WHERE title LIKE '%Million Dollar%' 
      OR title LIKE '%Buderwitz%' 
      OR title LIKE '%Okoboji%' 
      OR title LIKE '%Utah%' 
   ORDER BY date DESC LIMIT 20`
);

console.log(JSON.stringify(rows, null, 2));
await connection.end();
