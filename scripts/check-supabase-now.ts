import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function check() {
  console.log('Checking Supabase tables...\n');
  console.log('URL:', process.env.SUPABASE_URL?.substring(0, 40) + '...');
  
  const tables = ['projects', 'news', 'articles', 'categories'];
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`${table}: ERROR - ${error.message}`);
    } else {
      console.log(`${table}: ${count} rows`);
    }
  }
  
  // Get first 3 project titles if any
  const { data: projects } = await supabase.from('projects').select('title').limit(3);
  if (projects?.length) {
    console.log('\nSample projects:', projects.map(p => p.title).join(', '));
  }
}

check().catch(console.error);
