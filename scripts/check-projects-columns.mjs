import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  console.log('🔍 Checking projects table columns...\n');

  // Get one project to see the actual column names
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!projects || projects.length === 0) {
    console.log('❌ No projects found');
    return;
  }

  const columns = Object.keys(projects[0]);
  console.log('✅ Columns in projects table:');
  columns.sort().forEach(col => {
    console.log(`   - ${col}`);
  });

  console.log('\n🔍 Looking for creative team related columns...');
  const creativeColumns = columns.filter(col => 
    col.toLowerCase().includes('creative') || 
    col.toLowerCase().includes('team')
  );
  
  if (creativeColumns.length > 0) {
    console.log('✅ Found:', creativeColumns);
  } else {
    console.log('❌ No creative team column found');
  }
}

checkColumns();
