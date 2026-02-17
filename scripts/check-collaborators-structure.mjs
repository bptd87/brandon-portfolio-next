import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Get one collaborator to see all columns
const { data, error } = await supabase
  .from('collaborators')
  .select('*')
  .limit(1)
  .single();

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log('\nCurrent Supabase collaborators table columns:');
console.log(Object.keys(data).join('\n'));
console.log('\n---\n');
console.log('Sample data:', data);
