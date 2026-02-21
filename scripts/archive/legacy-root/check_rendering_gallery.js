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
    console.log('===== RENDERING GALLERY DATA AUDIT =====\n');
    
    // Check rendering_projects
    console.log('1. RENDERING PROJECTS:');
    const { data: projects, error: projError } = await supabase
      .from('rendering_projects')
      .select('id, title, year');
      
    if (projError) {
      console.log('Error:', projError);
    } else {
      console.log(`Found ${projects?.length || 0} rendering projects:`);
      projects?.forEach(p => {
        console.log(`  - ID ${p.id}: "${p.title}" (${p.year})`);
      });
    }
    console.log();
    
    // Check rendering_gallery
    console.log('2. RENDERING GALLERY ENTRIES:');
    const { data: gallery, error: galError } = await supabase
      .from('rendering_gallery')
      .select('id, rendering_project_id, display_title, sort_order');
      
    if (galError) {
      console.log('Error:', galError);
    } else {
      console.log(`Found ${gallery?.length || 0} gallery entries:`);
      gallery?.forEach(g => {
        console.log(`  - Gallery ID ${g.id}: project_id=${g.rendering_project_id}, title="${g.display_title}", sort=${g.sort_order}`);
      });
    }
    console.log();
    
    // Check rendering_project_images
    console.log('3. RENDERING PROJECT IMAGES:');
    const { data: images, error: imgError } = await supabase
      .from('rendering_project_images')
      .select('id, rendering_project_id, image_url')
      .limit(10);
      
    if (imgError) {
      console.log('Error:', imgError);
    } else {
      console.log(`Found ${images?.length || 0} images (showing first 10):`);
      images?.forEach(img => {
        console.log(`  - Project ${img.rendering_project_id}: ${img.image_url?.substring(0, 50) || '(no url)'}...`);
      });
    }
    
    // Summary
    console.log('\n===== SUMMARY =====');
    if ((projects?.length || 0) > 0 && (gallery?.length || 0) === 0) {
      console.log('⚠️  PROBLEM: Projects exist but gallery is empty');
      console.log('   Need to create gallery entries linking projects');
    } else if ((gallery?.length || 0) > 0) {
      console.log('✅ Gallery entries exist');
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}

check();
