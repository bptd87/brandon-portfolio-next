
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const { supabase } = await import('../server/db');

  console.log('Checking rendering_gallery columns...');
  // We can't easily query information_schema via supabase-js client usually, 
  // unless we have direct SQL access or a stored procedure.
  // Instead, let's try to select a single row and see keys, 
  // OR try to update a dummy ID with 'active' field and see if it error with "column does not exist".

  // Attempt to invoke a raw query if possible, or just use the error message from a failed update.

  // Validating active column existence by trying to select it.
  const { data, error } = await supabase
    .from('rendering_gallery')
    .select('active')
    .limit(1);

  if (error) {
    console.log('Error checking active column:', error.message);
  } else {
    console.log('Active column exists.');
  }
}

main().catch(console.error);
