import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function inspectUsersTable() {
  console.log('Fetching existing users...');
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sample user data:', JSON.stringify(data, null, 2));
    if (data && data.length > 0) {
      console.log('\nColumn names:', Object.keys(data[0]));
    } else {
      console.log('No users found in table');
    }
  }
}

inspectUsersTable().catch(console.error);
