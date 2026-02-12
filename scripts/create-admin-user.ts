import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function createAdminUser() {
  const adminUserId = process.env.OWNER_OPEN_ID!;
  
  console.log('Step 1: Creating users table if it doesn\'t exist...');
  
  // Create the users table
  const { error: tableError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "openId" TEXT UNIQUE NOT NULL,
          name TEXT,
          email TEXT,
          role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
          login_method TEXT,
          last_signed_in TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_open_id ON public.users("openId");
    `
  });
  
  if (tableError) {
    console.log('Note: Could not create table via RPC (expected if table exists)');
  }
  
  console.log('Step 2: Creating admin user with ID:', adminUserId);
  
  // First, check if user exists
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('openId', adminUserId)
    .single();
  
  if (existing) {
    console.log('User already exists:', existing);
    // Update to ensure admin role
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('openId', adminUserId);
    
    if (updateError) {
      console.error('Error updating user:', updateError);
    } else {
      console.log('✅ Updated user to admin role');
    }
  } else {
    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert({
        openId: adminUserId,
        role: 'admin',
        last_signed_in: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating user:', error);
    } else {
      console.log('✅ Created admin user:', data);
    }
  }
}

createAdminUser().catch(console.error);
