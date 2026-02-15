import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function quickCheck() {
  console.log('Supabase URL:', process.env.SUPABASE_URL);
  console.log('Testing connection...\n');

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ projects table error:', error.message);
    } else {
      console.log('✅ projects table exists, data:', data);
    }
  } catch (err: any) {
    console.log('❌ Connection error:', err.message);
  }
  
  process.exit(0);
}

quickCheck();
