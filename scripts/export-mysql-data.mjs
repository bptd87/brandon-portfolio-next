import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🚀 Exporting MySQL data...');

const [categories] = await connection.query('SELECT * FROM categories');
const [tags] = await connection.query('SELECT * FROM tags');
const [projects] = await connection.query('SELECT * FROM projects');
const [projectImages] = await connection.query('SELECT * FROM projectImages');
const [projectTags] = await connection.query('SELECT * FROM projectTags');
const [news] = await connection.query('SELECT * FROM news');
const [articles] = await connection.query('SELECT * FROM articles');
const [users] = await connection.query('SELECT * FROM users');

const data = {
  categories,
  tags,
  projects,
  projectImages,
  projectTags,
  news,
  articles,
  users
};

await fs.writeFile('/home/ubuntu/supabase-export.json', JSON.stringify(data, null, 2));

console.log('✅ Exported:');
console.log(`  - ${categories.length} categories`);
console.log(`  - ${tags.length} tags`);
console.log(`  - ${projects.length} projects`);
console.log(`  - ${projectImages.length} project images`);
console.log(`  - ${projectTags.length} project-tag relationships`);
console.log(`  - ${news.length} news items`);
console.log(`  - ${articles.length} articles`);
console.log(`  - ${users.length} users`);

await connection.end();
