import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function checkSchema() {
  // Get rendering_projects columns
  const { data: columns } = await supabase
    .from('rendering_projects')
    .select('*')
    .limit(1);
  
  if (columns && columns.length > 0) {
    console.log('=== RENDERING_PROJECTS TABLE COLUMNS ===\n');
    Object.keys(columns[0]).forEach(col => {
      console.log(`  - ${col}`);
    });
  }
  
  // Check current projects
  console.log('\n=== CURRENT RENDERING PROJECTS ===\n');
  const { data: projects } = await supabase
    .from('rendering_projects')
    .select('id, title, slug, status')
    .order('id');
  
  projects?.forEach(p => {
    console.log(`${p.id}. "${p.title}"`);
    console.log(`   Slug: ${p.slug || 'NULL'}`);
    console.log(`   Status: ${p.status}`);
  });
  
  process.exit(0);
}

checkSchema();
