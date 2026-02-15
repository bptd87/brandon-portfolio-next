import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
);

async function checkSchema() {
  console.log('Checking Supabase schema...\n');
  
  // Try to query projects table
  const { data, error } = await supabase
    .from('projects')
    .select('count')
    .limit(1);
  
  if (error) {
    if (error.message.includes('does not exist')) {
      console.log('❌ projects table DOES NOT EXIST');
      console.log('   Need to create tables first\n');
      return false;
    }
    console.log('❌ Error:', error.message);
    return false;
  }
  
  console.log('✅ projects table exists');
  
  // Check count
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   Current row count: ${count}\n`);
  return true;
}

checkSchema().then(exists => process.exit(exists ? 0 : 1));
