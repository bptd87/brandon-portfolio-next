import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (!line.startsWith('#') && line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

// Try with SERVICE_KEY for elevated permissions
const supabase = createClient(
  envVars.SUPABASE_URL,
  envVars.SUPABASE_SERVICE_KEY
);

async function check() {
  try {
    console.log('===== RAW SQL CHECK =====\n');
    

    
    // Try direct query
    console.log('Attempting direct SELECT from projects...\n');
    const { data: projects, error: err, count } = await supabase
      .from('projects')
      .select('id, title, year, discipline', { count: 'exact' })
      .limit(50);
    
    if (err) {
      console.log('Query Error:', err);
      process.exit(1);
    }
    
    console.log(`Found ${count} total projects\n`);
    
    if (projects && projects.length > 0) {
      console.log('Projects:');
      projects.forEach((p, i) => {
        console.log(`${i+1}. ID ${p.id}: "${p.title}" (${p.year}) - ${p.discipline}`);
      });
    } else {
      console.log('No projects returned');
      
      // Check table structure
      console.log('\nChecking table structure...');
      const { data: tables } = await supabase
        .from('information_schema.tables')
        .select('*')
        .eq('table_name', 'projects');
      
      if (tables && tables.length > 0) {
        console.log('Projects table exists:', tables[0]);
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}

check();
