import mysql from "mysql2/promise";
import fs from "fs/promises";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Read the research results
const csvContent = await fs.readFile('/home/ubuntu/research_director_profiles.csv', 'utf-8');
const lines = csvContent.split('\n').slice(1); // Skip header

let updated = 0;
let skipped = 0;

for (const line of lines) {
  if (!line.trim()) continue;
  
  // Parse CSV line (handle commas in quoted fields)
  const match = line.match(/^[^,]*,([^,]+),"([^"]+)",([^,]+),([^,\n]+)/);
  if (!match) {
    console.log(`⚠ Skipping malformed line: ${line.substring(0, 50)}...`);
    skipped++;
    continue;
  }
  
  const [, name, bio, portfolioUrl, instagram] = match;
  
  // Clean up values
  const cleanPortfolio = portfolioUrl.trim() === 'Not found' ? null : portfolioUrl.trim();
  const cleanInstagram = instagram.trim() === 'Not found' ? null : instagram.trim();
  
  try {
    const [result] = await conn.query(
      `UPDATE collaborators 
       SET bio = ?, portfolioUrl = ?, instagramHandle = ?, updatedAt = NOW()
       WHERE name = ? AND role = 'director'`,
      [bio, cleanPortfolio, cleanInstagram, name.trim()]
    );
    
    if (result.affectedRows > 0) {
      console.log(`✓ Updated: ${name}`);
      updated++;
    } else {
      console.log(`⚠ Not found in DB: ${name}`);
      skipped++;
    }
  } catch (err) {
    console.log(`✗ Error updating ${name}: ${err.message}`);
    skipped++;
  }
}

await conn.end();
console.log(`\n✅ Complete! Updated ${updated} directors, skipped ${skipped}`);
