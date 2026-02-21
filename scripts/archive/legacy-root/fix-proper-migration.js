import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function fixProperMigration() {
  console.log('Fixing rendering_project_images - cover should NOT be duplicated in gallery...\n');
  
  // Northwind Mare Tavern - only 1 image, so gallery should be EMPTY
  console.log('Northwind Mare Tavern (1 image total):');
  console.log('  Removing from gallery (cover will show automatically)');
  await supabase
    .from('rendering_project_images')
    .delete()
    .eq('rendering_project_id', 2);
  console.log('  ✓ Removed duplicate');
  
  // Ashes of the Underworld - 4 images total, so gallery should have images 2,3,4
  console.log('\nAshes of the Underworld (4 images total):');
  console.log('  Cover = image 1');
  console.log('  Gallery = images 2, 3, 4');
  
  // Get all 4 images from old table
  const { data: ashesImages } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', 3)
    .order('sort_order');
  
  // Delete all current gallery images
  await supabase
    .from('rendering_project_images')
    .delete()
    .eq('rendering_project_id', 3);
  
  // Insert images 2, 3, 4 (skip first one which is the cover)
  if (ashesImages && ashesImages.length > 1) {
    for (let i = 1; i < ashesImages.length; i++) {
      const img = ashesImages[i];
      await supabase
        .from('rendering_project_images')
        .insert({
          rendering_project_id: 3,
          image_url: img.image_url,
          image_key: img.image_key,
          image_type: 'rendering',
          caption: img.caption,
          alt_text: img.alt_text || 'Ashes of the Underworld',
          sort_order: i - 1  // 0, 1, 2
        });
    }
    console.log(`  ✓ Added ${ashesImages.length - 1} additional images to gallery`);
  }
  
  console.log('\nDone! Cover images will show automatically, additional images in gallery.');
}

fixProperMigration();
