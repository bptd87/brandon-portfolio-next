import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function check() {
  try {
    console.log('URL:', process.env.SUPABASE_URL);
    console.log('Using SERVICE_KEY\n');
    
    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .limit(10);
    
    if (error) {
      console.log('Error:', error);
      process.exit(1);
    }
    
    console.log(`Total projects: ${count}\n`);
    
    if (data && data.length > 0) {
      console.log('Found projects:');
      data.forEach((p, i) => {
        console.log(`${i+1}. ID ${p.id}: "${p.title}" (${p.year})`);
      });
    } else {
      console.log('No projects found');
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}

check();
