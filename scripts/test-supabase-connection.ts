import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 10 } }
  }
);

async function quickTest() {
  console.log('Testing Supabase connection...\n');
  
  const tables = ['projects', 'news', 'articles', 'users'];
  
  for (const table of tables) {
    try {
      const start = Date.now();
      const { data, error, count } = await Promise.race([
        supabase.from(table).select('*', { count: 'exact', head: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]) as any;
      
      const duration = Date.now() - start;
      
      if (error) {
        console.log(`❌ ${table}: ${error.message} (${duration}ms)`);
      } else {
        console.log(`✅ ${table}: ${count} rows (${duration}ms)`);
      }
    } catch (err: any) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  process.exit(0);
}

quickTest();
