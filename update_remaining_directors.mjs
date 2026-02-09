import mysql from "mysql2/promise";
import fs from "fs/promises";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Read the JSON research results
const jsonData = JSON.parse(await fs.readFile('/home/ubuntu/research_director_profiles.json', 'utf-8'));

let updated = 0;
let skipped = 0;

for (const item of jsonData.results) {
  if (!item.output) continue;
  
  const { name, bio, portfolio_url, instagram } = item.output;
  
  // Clean up values
  const cleanPortfolio = portfolio_url === 'Not found' ? null : portfolio_url;
  const cleanInstagram = instagram === 'Not found' ? null : instagram;
  
  try {
    const [result] = await conn.query(
      `UPDATE collaborators 
       SET bio = ?, portfolioUrl = ?, instagramHandle = ?, updatedAt = NOW()
       WHERE name = ? AND role = 'director'`,
      [bio, cleanPortfolio, cleanInstagram, name]
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
