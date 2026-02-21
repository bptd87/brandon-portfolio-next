import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function removeDuplicates() {
  console.log('Checking all rendering projects for duplicate images...\n');
  
  const { data: projects } = await supabase
    .from('rendering_projects')
    .select('id, title, cover_image_url');
  
  for (const project of projects) {
    if (!project.cover_image_url) {
      console.log(`⚠️  ${project.title}: No cover image set`);
      continue;
    }
    
    // Get all gallery images for this project
    const { data: images } = await supabase
      .from('rendering_project_images')
      .select('*')
      .eq('rendering_project_id', project.id);
    
    if (!images || images.length === 0) {
      console.log(`✓ ${project.title}: No gallery images (cover only)`);
      continue;
    }
    
    // Check for duplicates
    const duplicates = images.filter(img => img.image_url === project.cover_image_url);
    
    if (duplicates.length > 0) {
      console.log(`🔧 ${project.title}: Found ${duplicates.length} duplicate(s)`);
      for (const dup of duplicates) {
        await supabase
          .from('rendering_project_images')
          .delete()
          .eq('id', dup.id);
        console.log(`   ✓ Removed duplicate from gallery`);
      }
    } else {
      console.log(`✓ ${project.title}: ${images.length} gallery image(s), no duplicates`);
    }
  }
  
  console.log('\nDone!');
}

removeDuplicates();
