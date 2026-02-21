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
    console.log('===== DETAILED PROJECT CHECK =====\n');
    
    // Get all projects
    const { data: allProjects, error: projError } = await supabase
      .from('projects')
      .select('*', { count: 'exact' });
      
    if (projError) {
      console.log('Error fetching projects:', projError);
    } else {
      console.log(`Total projects: ${allProjects?.length || 0}\n`);
      
      if (allProjects && allProjects.length > 0) {
        console.log('First 5 projects:');
        allProjects.slice(0, 5).forEach(p => {
          console.log(`  ID ${p.id}: ${p.title} (${p.year})`);
          console.log(`    Discipline: ${p.discipline}`);
        });
        if (allProjects.length > 5) {
          console.log(`  ... and ${allProjects.length - 5} more`);
        }
      }
    }
    
    // Get project images count
    console.log('\n===== PROJECT IMAGES =====\n');
    const { data: images, error: imgError } = await supabase
      .from('project_images')
      .select('*', { count: 'exact' });
      
    if (imgError) {
      console.log('Error:', imgError);
    } else {
      console.log(`Total project_images: ${images?.length || 0}`);
      if (images && images.length > 0) {
        console.log('First 5:');
        images.slice(0, 5).forEach(img => {
          console.log(`  Project ${img.project_id}: ${img.image_url}`);
        });
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}

check();
