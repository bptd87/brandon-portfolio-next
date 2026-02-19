import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Load .env file manually
const envContent = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.+)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_ANON_KEY
);

async function check() {
  try {
    console.log('===== INVESTIGATING ALL MY SONS =====\n');
    
    // First, let's look for any project with "Sons" in the title
    console.log('1. Searching for projects with "Sons" in title...');
    const { data: sonProjects, error: sonError } = await supabase
      .from('projects')
      .select('id, title, cover_image, year')
      .ilike('title', '%Sons%');
      
    if (sonError) {
      console.log('Error:', sonError);
    } else {
      console.log(`Found ${sonProjects?.length || 0} projects:`);
      sonProjects?.forEach(p => {
        console.log(`  - ID: ${p.id}, Title: "${p.title}" (${p.year}), Cover: ${p.cover_image || 'null'}`);
      });
    }
    console.log();
    
    // Now let's look at all rendering gallery entries
    console.log('2. All rendering_gallery entries:');
    const { data: galleryItems, error: galError } = await supabase
      .from('rendering_gallery')
      .select('*');
      
    if (galError) {
      console.log('Error:', galError);
    } else {
      console.log(`Found ${galleryItems?.length || 0} gallery entries\n`);
      for (const item of (galleryItems || [])) {
        // For each gallery item, try to fetch its project
        const { data: proj } = await supabase
          .from('projects')
          .select('id, title')
          .eq('id', item.project_id)
          .single();
          
        const projectTitle = proj?.title || `(missing - ID: ${item.project_id})`;
        console.log(`  - Gallery ID ${item.id}: "${item.display_title || projectTitle}" (project_id: ${item.project_id})`);
        
        if (!proj) {
          console.log(`    ⚠️  PROJECT MISSING OR NULL project_id!`);
        }
      }
    }
    console.log();
    
    // Check experiential_gallery too
    console.log('3. All experiential_gallery entries:');
    const { data: expGalleryItems, error: expGalError } = await supabase
      .from('experiential_gallery')
      .select('*');
      
    if (expGalError) {
      console.log('Error:', expGalError);
    } else {
      console.log(`Found ${expGalleryItems?.length || 0} gallery entries\n`);
      for (const item of (expGalleryItems || [])) {
        // For each gallery item, try to fetch its project
        const { data: proj } = await supabase
          .from('projects')
          .select('id, title')
          .eq('id', item.project_id)
          .single();
          
        const projectTitle = proj?.title || `(missing - ID: ${item.project_id})`;
        console.log(`  - Gallery ID ${item.id}: "${item.display_title || projectTitle}" (project_id: ${item.project_id})`);
        
        if (!proj) {
          console.log(`    ⚠️  PROJECT MISSING OR NULL project_id!`);
        }
      }
    }
    
  } catch (e) {
    console.error('Fatal Error:', e);
  }
  process.exit(0);
}

check();
