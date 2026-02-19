import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setRenderingCoverImages() {
  console.log('Setting cover images for rendering projects...\n');

  // Get all rendering projects
  const { data: projects, error: projectsError } = await supabase
    .from('rendering_projects')
    .select('id, title, cover_image_url')
    .order('id');

  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
    return;
  }

  for (const project of projects) {
    // Get the first image for this project from rendering_project_images
    const { data: images, error: imagesError } = await supabase
      .from('rendering_project_images')
      .select('image_url, image_key')
      .eq('rendering_project_id', project.id)
      .order('sort_order')
      .limit(1);

    if (imagesError) {
      console.error(`Error fetching images for ${project.title}:`, imagesError);
      continue;
    }

    if (images && images.length > 0 && !project.cover_image_url) {
      const firstImage = images[0];
      
      // Update the project with the cover image
      const { error: updateError } = await supabase
        .from('rendering_projects')
        .update({
          cover_image_url: firstImage.image_url,
          cover_image_key: firstImage.image_key
        })
        .eq('id', project.id);

      if (updateError) {
        console.error(`Error updating ${project.title}:`, updateError);
      } else {
        console.log(`✓ Set cover image for "${project.title}"`);
        console.log(`  Image: ${firstImage.image_url.substring(0, 60)}...`);
      }
    } else if (!images || images.length === 0) {
      console.log(`⚠ "${project.title}" has no images to set as cover`);
    } else if (project.cover_image_url) {
      console.log(`- "${project.title}" already has a cover image`);
    }
  }

  console.log('\nDone!');
}

setRenderingCoverImages();
