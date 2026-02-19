import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function fixMigration() {
  console.log('Fixing rendering_project_images to match covers...\n');
  
  // Northwind Mare Tavern (ID: 2)
  // Cover is Cloudinary, but rendering_project_images has wrong Supabase image
  console.log('Northwind Mare Tavern:');
  const { data: northwind } = await supabase
    .from('rendering_projects')
    .select('id, title, cover_image_url')
    .eq('id', 2)
    .single();
  
  console.log(`  Cover: ${northwind.cover_image_url}`);
  
  // Delete wrong image from rendering_project_images
  await supabase
    .from('rendering_project_images')
    .delete()
    .eq('rendering_project_id', 2);
  
  // Insert correct Cloudinary image from project_images
  const { data: northwindOldImages } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', 2)
    .order('sort_order')
    .limit(1);
  
  if (northwindOldImages && northwindOldImages.length > 0) {
    const img = northwindOldImages[0];
    await supabase
      .from('rendering_project_images')
      .insert({
        rendering_project_id: 2,
        image_url: img.image_url,
        image_key: img.image_key,
        image_type: 'rendering',
        caption: img.caption,
        alt_text: img.alt_text || 'The Northwind Mare Tavern',
        sort_order: 0
      });
    console.log(`  ✓ Updated to: ${img.image_url}`);
  }
  
  // Ashes of the Underworld (ID: 3) - has 4 images in old table
  console.log('\nAshes of the Underworld:');
  const { data: ashes } = await supabase
    .from('rendering_projects')
    .select('id, title, cover_image_url')
    .eq('id', 3)
    .single();
  
  console.log(`  Cover: ${ashes.cover_image_url}`);
  
  // Delete wrong image
  await supabase
    .from('rendering_project_images')
    .delete()
    .eq('rendering_project_id', 3);
  
  // Insert all 4 Cloudinary images from project_images
  const { data: ashesOldImages } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', 3)
    .order('sort_order');
  
  if (ashesOldImages && ashesOldImages.length > 0) {
    for (const img of ashesOldImages) {
      await supabase
        .from('rendering_project_images')
        .insert({
          rendering_project_id: 3,
          image_url: img.image_url,
          image_key: img.image_key,
          image_type: 'rendering',
          caption: img.caption,
          alt_text: img.alt_text || 'Ashes of the Underworld',
          sort_order: img.sort_order
        });
    }
    console.log(`  ✓ Migrated ${ashesOldImages.length} images from project_images`);
  }
  
  console.log('\nDone!');
}

fixMigration();
