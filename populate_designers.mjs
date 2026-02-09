import mysql from "mysql2/promise";
import fs from "fs/promises";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Read the JSON research results
const jsonData = JSON.parse(await fs.readFile('/home/ubuntu/research_designer_profiles.json', 'utf-8'));

// Map role names to database enum values
const roleMap = {
  'Costume Designer': 'costume_designer',
  'Lighting Designer': 'lighting_designer',
  'Sound Designer': 'sound_designer',
  'Projection Designer': 'projection_designer'
};

// Helper to create slug
function createSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

let inserted = 0;
let skipped = 0;

for (const item of jsonData.results) {
  if (!item.output) {
    console.log(`⚠ Skipped (no output): ${item.input}`);
    skipped++;
    continue;
  }
  
  const { name, role, bio, portfolio_url, instagram } = item.output;
  const dbRole = roleMap[role];
  const slug = createSlug(name);
  
  // Clean up values
  const cleanPortfolio = portfolio_url === 'Not found' ? null : portfolio_url;
  const cleanInstagram = instagram === 'Not found' ? null : instagram;
  
  try {
    // Check if already exists
    const [existing] = await conn.query(
      'SELECT id FROM collaborators WHERE name = ? AND role = ?',
      [name, dbRole]
    );
    
    if (existing.length > 0) {
      console.log(`⚠ Already exists: ${name} (${role})`);
      skipped++;
      continue;
    }
    
    // Insert new designer
    await conn.query(
      `INSERT INTO collaborators (name, slug, role, bio, portfolioUrl, instagramHandle, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, slug, dbRole, bio, cleanPortfolio, cleanInstagram]
    );
    
    console.log(`✓ Inserted: ${name} (${role})`);
    inserted++;
  } catch (err) {
    console.log(`✗ Error inserting ${name}: ${err.message}`);
    skipped++;
  }
}

await conn.end();
console.log(`\n✅ Complete! Inserted ${inserted} designers, skipped ${skipped}`);
