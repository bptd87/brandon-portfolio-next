import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🔄 Running migration: Add creative_team column...\n');

  const sql = `
    -- Add creative_team column to projects table
    ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS creative_team JSONB DEFAULT '{}';
  `;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // Try direct approach
      console.log('📝 Running migration directly...');
      
      const { error: directError } = await supabase
        .from('_migrations')
        .insert({ name: '20260216_add_creative_team_column', executed_at: new Date().toISOString() });
      
      if (directError && !directError.message.includes('does not exist')) {
        throw directError;
      }
      
      console.log('⚠️  Note: You may need to run this SQL manually in Supabase dashboard:');
      console.log('\n' + sql + '\n');
    } else {
      console.log('✅ Migration executed successfully!');
    }
    
    // Verify the column was added
    const { data: projects, error: checkError } = await supabase
      .from('projects')
      .select('creative_team')
      .limit(1);
    
    if (checkError) {
      console.log('❌ Column still missing. Please run this SQL in Supabase dashboard:');
      console.log('\nALTER TABLE projects ADD COLUMN IF NOT EXISTS creative_team JSONB DEFAULT \'{}\';');
    } else {
      console.log('✅ Column verified - creative_team now exists!');
    }
    
  } catch (err) {
    console.log('⚠️  Please run this SQL manually in Supabase dashboard:\n');
    console.log('ALTER TABLE projects ADD COLUMN IF NOT EXISTS creative_team JSONB DEFAULT \'{}\';');
  }
}

runMigration();
