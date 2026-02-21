import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkAllImages() {
  const { data: projects } = await supabase
    .from('rendering_projects')
    .select('id, title')
    .order('id');

  for (const project of projects) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${project.title} (ID: ${project.id})`);
    console.log(`${'='.repeat(60)}`);
    
    // Check old project_images table
    const { data: oldImages } = await supabase
      .from('project_images')
      .select('id, image_url, sort_order, caption, image_type')
      .eq('project_id', project.id)
      .order('sort_order');
    
    if (oldImages && oldImages.length > 0) {
      console.log('\nOLD TABLE (project_images):');
      oldImages.forEach((img, i) => {
        console.log(`  ${i + 1}. [Order: ${img.sort_order}] ${img.image_type || 'no type'}`);
        console.log(`     ${img.image_url}`);
        if (img.caption) console.log(`     Caption: ${img.caption}`);
      });
    }
    
    // Check new rendering_project_images table
    const { data: newImages } = await supabase
      .from('rendering_project_images')
      .select('id, image_url, sort_order, caption, image_type')
      .eq('rendering_project_id', project.id)
      .order('sort_order');
    
    if (newImages && newImages.length > 0) {
      console.log('\nNEW TABLE (rendering_project_images):');
      newImages.forEach((img, i) => {
        console.log(`  ${i + 1}. [Order: ${img.sort_order}] ${img.image_type || 'no type'}`);
        console.log(`     ${img.image_url}`);
        if (img.caption) console.log(`     Caption: ${img.caption}`);
      });
    }
    
    if ((!oldImages || oldImages.length === 0) && (!newImages || newImages.length === 0)) {
      console.log('\n  ⚠️ No images found in either table');
    }
  }
}

checkAllImages();
