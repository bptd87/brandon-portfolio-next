const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function check() {
  try {
    // Find All My Sons project
    const { data: projects, error: projError } = await supabase
      .from('projects')
      .select('id, title, cover_image, year')
      .eq('title', 'All My Sons')
      .single();
      
    console.log('===== DEBUGGING ALL MY SONS =====');
    if (projError) {
      console.log('Project Query Error:', projError);
      return;
    }
    
    console.log('Project Found:');
    console.log(projects);
    
    if (projects?.id) {
      // Check project_images for this project
      const{ data: images, error: imgError } = await supabase
        .from('project_images')
        .select('id, image_url, alt_text, sort_order')
        .eq('project_id', projects.id);
        
      console.log('\nProject Images:');
      if (imgError) {
        console.log('Images Query Error:', imgError);
      } else {
        console.log(`Found ${images?.length || 0} images`);
        console.log(images);
      }
    
      // Check rendering_gallery for this project
      const { data: gallery, error: galError } = await supabase
        .from('rendering_gallery')
        .select('id, project_id, alt_text, sort_order')
        .eq('project_id', projects.id);
        
      console.log('\nRendering Gallery Entries:');
      if (galError) {
        console.log('Gallery Query Error:', galError);
      } else {
        console.log(`Found ${gallery?.length || 0} gallery entries`);
        console.log(gallery);
      }
    }
  } catch (e) {
     console.error('Error:', e);
  }
  process.exit(0);
}

check();
