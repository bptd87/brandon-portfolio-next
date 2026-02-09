import mysql from "mysql2/promise";
import fs from "fs/promises";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Read the JSON research results
const jsonData = JSON.parse(await fs.readFile('/home/ubuntu/research_theatre_company_websites.json', 'utf-8'));

let updated = 0;
let skipped = 0;

for (const item of jsonData.results) {
  if (!item.output) {
    console.log(`⚠ Skipped (no output): ${item.input}`);
    skipped++;
    continue;
  }
  
  const { name, website_url } = item.output;
  
  try {
    const [result] = await conn.query(
      `UPDATE collaborators 
       SET portfolioUrl = ?, updatedAt = NOW()
       WHERE name = ? AND role = 'theatre_company'`,
      [website_url, name]
    );
    
    if (result.affectedRows > 0) {
      console.log(`✓ Updated: ${name} → ${website_url}`);
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
console.log(`\n✅ Complete! Updated ${updated} theatre companies, skipped ${skipped}`);
