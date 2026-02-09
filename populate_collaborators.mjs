import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Directors to add
const directors = [
  'James Moye',
  'Bernie Monroe',
  'Fred Rubeck',
  'Richard Biever',
  'Rob Salas',
  'Eli Simon',
  'John Keating',
  'David Crespy',
  'Eric Hoit',
  'Dan Kalrer',
  'John Hemphill',
  'Joy Powell',
  'Brett Olson',
  'Josh Walden',
  'Stephen Brotebeck',
  'Brandon Riley',
  'Jamey Grisham',
  'Andre Rodriguez',
  'Courtney Crouse',
  'LR Hults'
];

console.log(`Adding ${directors.length} directors...`);

for (const name of directors) {
  const slug = generateSlug(name);
  try {
    await conn.query(
      `INSERT INTO collaborators (name, slug, role, bio, createdAt, updatedAt) 
       VALUES (?, ?, 'director', ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE updatedAt = NOW()`,
      [name, slug, `Theatre director.`]
    );
    console.log(`✓ Added: ${name} (${slug})`);
  } catch (err) {
    console.log(`✗ Error adding ${name}: ${err.message}`);
  }
}

await conn.end();
console.log('Done!');
