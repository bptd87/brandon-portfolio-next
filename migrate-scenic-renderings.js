import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function migrateScenicRenderings() {
  console.log('Finding scenic design projects with rendering images...\n');
  
  // Get all scenic design projects
  const { data: scenicProjects, error: projectsError } = await supabase
    .from('projects')
    .select('id, title, slug, year, status')
    .eq('discipline', 'scenic_design')
    .eq('status', 'published')
    .order('year', { ascending: false });
  
  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
    return;
  }
  
  console.log(`Found ${scenicProjects.length} scenic design projects\n`);
  
  let addedCount = 0;
  
  for (const project of scenicProjects) {
    // Check if this project has rendering images
    const { data: images } = await supabase
      .from('project_images')
      .select('id, image_url, image_type, caption, alt_text')
      .eq('project_id', project.id)
      .eq('image_type', 'rendering');
    
    if (images && images.length > 0) {
      console.log(`${project.title} (${project.year || 'no year'}): ${images.length} rendering(s)`);
      
      // Add to rendering_gallery
      const { error: insertError } = await supabase
        .from('rendering_gallery')
        .insert({
          rendering_project_id: project.id,
          display_title: project.title,
          alt_text: project.title,
          sort_order: addedCount,
          active: true
        });
      
      if (insertError) {
        // Might already exist
        if (insertError.code === '23505') {
          console.log(`  (already in gallery)`);
        } else {
          console.error(`  Error:`, insertError.message);
        }
      } else {
        console.log(`  ✓ Added to rendering_gallery`);
        addedCount++;
      }
    }
  }
  
  console.log(`\n✓ Added ${addedCount} scenic design projects to rendering_gallery`);
  console.log('\nNow you can remove the ones you don\'t want from the admin!');
}

migrateScenicRenderings();
