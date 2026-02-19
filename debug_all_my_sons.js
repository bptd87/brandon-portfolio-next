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
    console.log('===== DEBUGGING ALL MY SONS =====\n');
    
    // Find All My Sons project
    const { data: projects, error: projError } = await supabase
      .from('projects')
      .select('id, title, cover_image, year')
      .eq('title', 'All My Sons')
      .single();
      
    if (projError) {
      console.log('❌ Project Query Error:', projError);
      return;
    }
    
    if (!projects) {
      console.log('❌ No "All My Sons" project found');
      return;
    }
    
    console.log('✅ Project Found:');
    console.log(`   ID: ${projects.id}`);
    console.log(`   Title: ${projects.title}`);
    console.log(`   Year: ${projects.year}`);
    console.log(`   Cover Image: ${projects.cover_image || '(null)'}\n`);
    
    // Check project_images for this project
    const { data: images, error: imgError } = await supabase
      .from('project_images')
      .select('id, image_url, alt_text, sort_order')
      .eq('project_id', projects.id);
      
    if (imgError) {
      console.log('❌ Images Query Error:', imgError);
    } else {
      console.log(`✅ Project Images: Found ${images?.length || 0} images`);
      if (images && images.length >0) {
        images.forEach((img, i) => {
          console.log(`   ${i + 1}. ${img.image_url || '(no url)'}`);
        });
      }
      console.log();
    }
    
    // Check rendering_gallery for this project
    const { data: gallery, error: galError } = await supabase
      .from('rendering_gallery')
      .select('id, project_id, alt_text, sort_order')
      .eq('project_id', projects.id);
      
    if (galError) {
      console.log('❌ Rendering Gallery Query Error:', galError);
    } else {
      console.log(`✅ Rendering Gallery: Found ${gallery?.length || 0} entries`);
      console.log();
    }
    
    // Now check what the getExperientialGallery would return for this project
    const { data: expGallery, error: expGalError } = await supabase
      .from('experiential_gallery')
      .select('id, project_id, alt_text, sort_order')
      .eq('project_id', projects.id);
      
    if (expGalError) {
      console.log('❌ Experiential Gallery Query Error:', expGalError);
    } else {
      console.log(`✅ Experiential Gallery: Found ${expGallery?.length || 0} entries`);
    }
    
    // Summary
    console.log('\n===== SUMMARY =====');
    const hasImages = (images && images.length > 0);
    const hasCoverImage = !!projects.cover_image;
    
    if (!hasCoverImage && !hasImages) {
      console.log('❌ PROBLEM: Project has NO cover image AND NO item images');
      console.log('   Result: Frontend will show placeholder icon');
    } else if (!hasCoverImage && hasImages) {
      console.log('⚠️  PARTIAL: Project has item images but NO cover image');
      console.log('   Result: Should use first item image as cover');
    } else if (hasCoverImage) {
      console.log('✅ OK: Project has cover image set');
      console.log('   Result: Image should display');
    }
    
  } catch (e) {
    console.error('❌ Fatal Error:', e);
  }
  process.exit(0);
}

check();
