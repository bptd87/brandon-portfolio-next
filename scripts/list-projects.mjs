import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listProjects() {
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug')
    .order('title', { ascending: true });

  console.log('📊 Projects in Supabase:');
  projects.forEach((p) => {
    console.log(`   - ${p.slug}`);
  });
  console.log(`\n✅ Total: ${projects.length}`);
}

listProjects();
