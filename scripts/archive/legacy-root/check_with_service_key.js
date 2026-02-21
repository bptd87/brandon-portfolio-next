import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Load .env file manually
const envContent = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (!line.startsWith('#') && line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

// Try both ANON key and SERVICE key
const anonClient = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_ANON_KEY
);

const serviceClient = createClient(
  envVars.VITE_SUPABASE_URL || envVars.SUPABASE_URL,
  envVars.SUPABASE_SERVICE_KEY
);

async function check() {
  try {
    console.log('===== CHECKING DATA WITH BOTH KEYS =====\n');
    
    // Try with ANON key
    console.log('Using ANON KEY:');
    const { data: anonProjects, error: anonError } = await anonClient
      .from('projects')
      .select('count');
    if (anonError) {
      console.log(`  Error: ${anonError.message}`);
    } else {
      console.log(`  Count: ${anonProjects}`);
    }
    
    // Try simple count with SERVICE key
    console.log('\nUsing SERVICE KEY:');
    const { count: serviceCount, error: serviceCountError } = await serviceClient
      .from('projects')
      .select('*', { count: 'exact', head: true});
    if (serviceCountError) {
      console.log(`  Error: ${serviceCountError.message}`);
    } else {
      console.log(`  Row count: ${serviceCount}`);
    }
    
    // Get some actual data
    console.log('\nFetching project data with SERVICE KEY:');
    const { data: allProjects, error: projError } = await serviceClient
      .from('projects')
      .select('id, title')
      .order('id', { ascending: true })
      .limit(10);
      
    if (projError) {
      console.log(`  Error: ${projError.message}`);
    } else {
      console.log(`  Found ${allProjects?.length || 0} projects:`);
      allProjects?.forEach(p => {
        console.log(`    - ID ${p.id}: "${p.title}"`);
      });
    }
    
    // Check if rendering_gallery exists
    console.log('\nFetching rendering_gallery:');
    const { data: gallery, error: galError } = await serviceClient
      .from('rendering_gallery')
      .select('*')
      .limit(5);
      
    if (galError) {
      console.log(`  Error: ${galError.message}`);
    } else {
      console.log(`  Found gallery entries`);
      gallery?.forEach(g => {
        console.log(`    - ID ${g.id}: project_id=${g.project_id}, display_title="${g.display_title || ''}"`);
      });
    }
    
  } catch (e) {
    console.error('Fatal Error:', e.message);
  }
  process.exit(0);
}

check();
