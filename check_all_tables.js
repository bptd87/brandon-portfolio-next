import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (!line.startsWith('#') && line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_ANON_KEY
);

async function check() {
  try {
    console.log('===== CHECKING ALL TABLES =====\n');
    
    const tables = [
      { name: 'projects', columns: 'id, title, discipline, year' },
      { name: 'rendering_projects', columns: 'id, title, year' },
      { name: 'experiential_projects', columns: 'id, title, year' },
      { name: 'project_images', columns: 'id, project_id, image_url' },
      { name: 'rendering_project_images', columns: 'id, rendering_project_id, image_url' },
      { name: 'experiential_project_images', columns: 'id, experiential_project_id, image_url' },
      { name: 'rendering_gallery', columns: 'id, rendering_project_id' },
      { name: 'experiential_gallery', columns: 'id, experiential_project_id' },
    ];
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table.name)
          .select(table.columns, { count: 'exact', head: true });
          
        if (error) {
          console.log(`❌ ${table.name}: ERROR - ${error.message}`);
        } else {
          console.log(`✓ ${table.name}: ${count} records`);
        }
      } catch (e) {
        console.log(`❌ ${table.name}: ${e.message}`);
      }
    }
    
    console.log('\n===== SAMPLE DATA FROM NON-EMPTY TABLES =====\n');
    
    // Get actual data from each non-empty table
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, year')
      .limit(5);
    if (projects?.length > 0) {
      console.log('projects:');
      projects.forEach(p => console.log(`  ${p.id}: ${p.title}`));
    }
    
    const { data: rendering } = await supabase
      .from('rendering_projects')
      .select('id, title, year')
      .limit(5);
    if (rendering?.length > 0) {
      console.log('rendering_projects:');
      rendering.forEach(p => console.log(`  ${p.id}: ${p.title}`));
    }
    
    const { data: experiential } = await supabase
      .from('experiential_projects')
      .select('id, title, year')
      .limit(5);
    if (experiential?.length > 0) {
      console.log('experiential_projects:');
      experiential.forEach(p => console.log(`  ${p.id}: ${p.title}`));
    }
    
    const { data: projImg } = await supabase
      .from('project_images')
      .select('id, project_id, image_url')
      .limit(5);
    if (projImg?.length > 0) {
      console.log('project_images:');
      projImg.forEach(img => console.log(`  Project ${img.project_id}: ${img.image_url}`));
    }
    
  } catch (e) {
    console.error('Error:', e);
  }
  process.exit(0);
}

check();
