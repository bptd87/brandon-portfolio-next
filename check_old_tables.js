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

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_ANON_KEY
);

async function check() {
  try {
    console.log('===== CHECKING OLD PROJECTS TABLE =====\n');
    
    // Check old projects table
    console.log('1. OLD PROJECTS TABLE:');
    const { data: projects, error: projError } = await supabase
      .from('projects')
      .select('id, title, discipline, year')
      .limit(20);
      
    if (projError) {
      console.log('Error:', projError);
    } else {
      console.log(`Found ${projects?.length || 0} projects:`);
      const rendering = projects?.filter(p => p.discipline === 'rendering') || [];
      const experiential = projects?.filter(p => p.discipline === 'experiential_design') || [];
      const scenic = projects?.filter(p => p.discipline === 'scenic_design') || [];
      
      console.log(`  - Rendering: ${rendering.length}`);
      rendering.forEach(p => console.log(`    - ID ${p.id}: "${p.title}" (${p.year})`));
      console.log(`  - Experiential: ${experiential.length}`);
      experiential.forEach(p => console.log(`    - ID ${p.id}: "${p.title}" (${p.year})`));
      console.log(`  - Scenic: ${scenic.length}`);
      scenic.forEach(p => console.log(`    - ID ${p.id}: "${p.title}" (${p.year})`));
    }
    console.log();
    
    // Check old rendering_gallery
    console.log('2. OLD RENDERING_GALLERY TABLE:');
    const { data: gallery, error: galError } = await supabase
      .from('rendering_gallery')
      .select('id, project_id, display_title, sort_order');
      
    if (galError) {
      console.log('Error:', galError);
    } else {
      console.log(`Found ${gallery?.length || 0} gallery entries`);
      gallery?.forEach(g => {
        console.log(`  - Gallery ID ${g.id}: project_id=${g.project_id}, title="${g.display_title}"`);
      });
    }
    console.log();
    
    // Check project_images
    console.log('3. OLD PROJECT_IMAGES TABLE:');
    const { data: images, error: imgError } = await supabase
      .from('project_images')
      .select('id, project_id, image_url')
      .limit(10);
      
    if (imgError) {
      console.log('Error:', imgError);
    } else {
      console.log(`Found ${images?.length || 0} images`);
      images?.forEach(img => {
        console.log(`  - Project ${img.project_id}: ${img.image_url?.substring(0, 60) || '(no url)'}...`);
      });
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}

check();
