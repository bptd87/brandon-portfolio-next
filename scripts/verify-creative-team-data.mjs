import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('🔍 Checking if creative_team data was saved...\n');

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, slug, creative_team')
    .eq('slug', 'the-pajama-game')
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ Project found:');
  console.log('   Title:', projects.title);
  console.log('   Slug:', projects.slug);
  console.log('   Creative Team:', projects.creative_team);
  console.log('   Type:', typeof projects.creative_team);
  
  if (projects.creative_team) {
    console.log('   Is Array:', Array.isArray(projects.creative_team));
    if (Array.isArray(projects.creative_team)) {
      console.log('   Members:', projects.creative_team.length);
      projects.creative_team.slice(0, 3).forEach((m) => {
        console.log(`     - ${m.name} (${m.role})`);
      });
    }
  }
}

checkData();
