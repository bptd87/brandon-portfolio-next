import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAPIResponse() {
  console.log('🔍 Testing what API should return...\n');

  // Find pajama game project ID
  const { data: project, error } = await supabase
    .from('projects')
    .select('id, title, slug, creative_team')
    .eq('slug', 'the-pajama-game')
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ Database query result:');
  console.log(JSON.stringify(project, null, 2));
}

checkAPIResponse();
