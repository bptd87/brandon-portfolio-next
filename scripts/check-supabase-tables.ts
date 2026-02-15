import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function checkTables() {
  console.log('Checking Supabase tables...\n');

  // Check main content tables
  const tables = ['projects', 'news', 'articles', 'categories', 'tags', 'users', 
                  'tutorials', 'collaborators', 'scenic_directory',
                  'rendering_gallery', 'experiential_gallery', 'model_gallery',
                  'analytics_sessions', 'analytics_project_views', 'analytics_events'];

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count ?? 0} rows`);
      }
    } catch (err: any) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
}

checkTables();
