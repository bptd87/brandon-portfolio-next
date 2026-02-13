
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

async function checkSchema() {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching tutorials:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Tutorial keys:', Object.keys(data[0]));
  } else {
    console.log('No tutorials found to check schema.');
  }
}

checkSchema();
