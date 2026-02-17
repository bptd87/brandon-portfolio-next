import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Connect to MySQL
const mysqlConnection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('📦 Fetching collaborators from MySQL...\n');

// Get all collaborators from MySQL
const [mysqlCollaborators] = await mysqlConnection.execute(`
  SELECT 
    id, name, role, bio, 
    portfolioUrl, websiteUrl, instagramUrl, instagramHandle,
    imageUrl, imageKey, featured, sortOrder,
    createdAt, updatedAt
  FROM collaborators
  ORDER BY id
`);

console.log(`Found ${mysqlCollaborators.length} collaborators in MySQL\n`);

// Show sample of data
console.log('Sample collaborator data:');
const sample = mysqlCollaborators.slice(0, 3);
sample.forEach(c => {
  console.log(`\n${c.id}. ${c.name} (${c.role})`);
  console.log(`   Portfolio: ${c.portfolioUrl || 'NULL'}`);
  console.log(`   Website: ${c.websiteUrl || 'NULL'}`);
  console.log(`   Instagram: ${c.instagramUrl || 'NULL'} ${c.instagramHandle ? `(@${c.instagramHandle})` : ''}`);
});

console.log('\n---\n');
console.log(`Ready to migrate ${mysqlCollaborators.length} collaborators to Supabase`);
console.log('Press Ctrl+C to cancel, or modify this script to proceed with migration\n');

// Count how many have social links
const withPortfolio = mysqlCollaborators.filter(c => c.portfolioUrl).length;
const withWebsite = mysqlCollaborators.filter(c => c.websiteUrl).length;
const withInstagram = mysqlCollaborators.filter(c => c.instagramUrl).length;

console.log(`\nSocial media data stats:`);
console.log(`  - With Portfolio URL: ${withPortfolio}`);
console.log(`  - With Website URL: ${withWebsite}`);
console.log(`  - With Instagram: ${withInstagram}`);

console.log('\n🚀 Starting migration to Supabase...\n');

for (const collab of mysqlCollaborators) {
  const { error } = await supabase
    .from('collaborators')
    .upsert({
      id: collab.id,
      name: collab.name,
      role: collab.role,
      bio: collab.bio,
      portfolioUrl: collab.portfolioUrl,
      websiteUrl: collab.websiteUrl,
      instagramUrl: collab.instagramUrl,
      instagramHandle: collab.instagramHandle,
      featured: collab.featured || false,
      // Skip imageUrl, imageKey, sortOrder if they don't exist in Supabase yet
    }, {
      onConflict: 'id'
    });

  if (error) {
    console.error(`❌ Error migrating ${collab.name}:`, error);
  } else {
    console.log(`✅ Migrated: ${collab.name}`);
  }
}

console.log('\n✨ Migration complete!');

await mysqlConnection.end();
