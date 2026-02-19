import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function showAllProjectImages() {
  console.log('=== ALL RENDERING PROJECTS AND THEIR IMAGES ===\n');
  
  const { data: projects } = await supabase
    .from('rendering_projects')
    .select('id, title')
    .order('id');
  
  for (const project of projects) {
    console.log(`\n${project.title} (ID: ${project.id})`);
    
    // Get cover
    const { data: projectData } = await supabase
      .from('rendering_projects')
      .select('cover_image_url')
      .eq('id', project.id)
      .single();
    
    const coverFilename = projectData.cover_image_url ? 
      projectData.cover_image_url.split('/').pop() : 
      'NO COVER';
    console.log(`  Cover: ${coverFilename.substring(0, 60)}`);
    
    // Get gallery images
    const { data: galleryImages } = await supabase
      .from('rendering_project_images')
      .select('image_url')
      .eq('rendering_project_id', project.id);
    
    if (galleryImages && galleryImages.length > 0) {
      console.log(`  Gallery Images (${galleryImages.length}):`);
      galleryImages.forEach((img, i) => {
        const filename = img.image_url.split('/').pop();
        console.log(`    ${i+1}. ${filename.substring(0, 60)}`);
      });
    } else {
      console.log(`  Gallery Images: NONE`);
    }
  }
}

showAllProjectImages();
