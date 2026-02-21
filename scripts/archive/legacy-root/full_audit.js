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
    console.log('===== DATABASE AUDIT =====\n');
    
    // Get ALL projects
    console.log('1. ALL PROJECTS:');
    const { data: allProjects, error: projError } = await supabase
      .from('projects')
      .select('id, title, year, cover_image')
      .order('id', { ascending: true });
      
    if (projError) {
      console.log('Error fetching projects:', projError);
    } else {
      console.log(`Found ${allProjects?.length || 0} projects total:`);
      allProjects?.forEach(p => {
        console.log(`   - ID ${p.id}: "${p.title}" (${p.year}) cover_image: ${p.cover_image ? '✓' : '✗'}`);
      });
    }
    console.log();
    
    // Check rendering_gallery
    console.log('2. RENDERING_GALLERY:');
    const { data: renderingGallery, error: rgError } = await supabase
      .from('rendering_gallery')
      .select('id, project_id, display_title, alt_text, sort_order');
      
    if (rgError) {
      console.log('Error:', rgError);
    } else {
      console.log(`Found ${renderingGallery?.length || 0} entries:`);
      for (const item of (renderingGallery || [])) {
        const matchingProject = allProjects?.find(p => p.id === item.project_id);
        const status = matchingProject ? '✓' : '✗';
        const projTitle = matchingProject?.title || 'PROJECT NOT FOUND';
        console.log(`   - RG${item.id}: project_id=${item.project_id} [${status}] "${item.display_title || projTitle}"`);
      }
    }
    console.log();
    
    // Check experiential_gallery
    console.log('3. EXPERIENTIAL_GALLERY:');
    const { data: expGallery, error: egError } = await supabase
      .from('experiential_gallery')
      .select('id, project_id, display_title, alt_text, sort_order');
      
    if (egError) {
      console.log('Error:', egError);
    } else {
      console.log(`Found ${expGallery?.length || 0} entries:`);
      for (const item of (expGallery || [])) {
        const matchingProject = allProjects?.find(p => p.id === item.project_id);
        const status = matchingProject ? '✓' : '✗';
        const projTitle = matchingProject?.title || 'PROJECT NOT FOUND';
        console.log(`   - EG${item.id}: project_id=${item.project_id} [${status}] "${item.display_title || projTitle}"`);
      }
    }
    console.log();
    
    // Check project_images for projects 1 and 2
    console.log('4. PROJECT IMAGES:');
    const { data: images, error: imgError } = await supabase
      .from('project_images')
      .select('id, project_id, image_url')
      .in('project_id', [1, 2]);
      
    if (imgError) {
      console.log('Error:', imgError);
    } else {
      console.log(`Found ${images?.length || 0} images for projects 1-2:`);
      images?.forEach(img => {
        console.log(`   - Project ${img.project_id}: ${img.image_url}`);
      });
    }
    
  } catch (e) {
    console.error('Fatal Error:', e.message);
  }
  process.exit(0);
}

check();
