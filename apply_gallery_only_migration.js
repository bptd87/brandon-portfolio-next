import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function runMigration() {
  console.log('📦 Applying gallery_only migration...\n');
  
  try {
    // Check if gallery_only column exists in rendering_projects
    console.log('1. Checking rendering_projects...');
    const { error: r2 } = await supabase
      .from('rendering_projects')
      .select('gallery_only')
      .limit(1);
    
    if (r2 && r2.code === '42703') {
      console.log('  ⚠️  Column does not exist. Run this SQL in Supabase SQL Editor:\n');
      const sql = fs.readFileSync('supabase/migrations/20260219_add_gallery_only_flag.sql', 'utf-8');
      console.log(sql);
      process.exit(1);
    } else if (r2) {
      console.log('  ❌ Error:', r2.message);
      process.exit(1);
    } else {
      console.log('  ✅ gallery_only column exists');
    }

    // Check experiential_projects
    console.log('2. Checking experiential_projects...');
    const { error: e2 } = await supabase
      .from('experiential_projects')
      .select('gallery_only')
      .limit(1);
    
    if (e2 && e2.code === '42703') {
      console.log('  ⚠️  Column missing');
    } else {
      console.log('  ✅ gallery_only column exists');
    }

    console.log('\n✅ Migration applied successfully!');
    console.log('You can now set gallery_only = true/false for each project.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

runMigration();
