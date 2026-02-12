import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function updateAdminUser() {
  const newOpenId = process.env.OWNER_OPEN_ID!;
  const oldOpenId = 'KLpqiubMKKSULVmt7qKLAq';
  
  console.log('Updating admin user from old Manus ID to Supabase ID...');
  console.log('Old ID:', oldOpenId);
  console.log('New ID:', newOpenId);
  
  // Update the existing user record
  const { data, error } = await supabase
    .from('users')
    .update({ open_id: newOpenId })
    .eq('open_id', oldOpenId)
    .select();
  
  if (error) {
    console.error('❌ Error updating user:', error);
  } else {
    console.log('✅ Successfully updated user:', data);
  }
}

updateAdminUser().catch(console.error);
